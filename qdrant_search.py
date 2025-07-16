




        
   
  #!/usr/bin/env python3
"""
Qdrant-based Experience Search Engine with Session Management

This module provides a refactored search engine that:
- Maintains session IDs for user state and preferences
- Accepts experience prompts with tags and optional experience ID exclusion
- Extracts tags from prompts using multiple parsing strategies
- Converts tags to binary vectors matching the DB format
- Performs vector similarity search with experience exclusion
- Returns top K most similar experiences

Key Features:
- Session-based state management
- Flexible tag extraction (explicit, bracketed, semantic)
- Experience ID exclusion
- Binary vector conversion
- Vector similarity search
- RESTful API compatibility
"""

import numpy as np
from qdrant_client import QdrantClient
from qdrant_client.http.models import Filter, FieldCondition, MatchValue, Range
from typing import List, Dict, Optional, Any
import json
import re
import os
import uuid
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer
import torch

# Load environment variables
load_dotenv()

# Simple session management (similar to maiz.py)
from typing import Dict, Any

sessions: Dict[str, Dict[str, Any]] = {}

class QdrantSearchEngine:
    def __init__(self, url: str = None, api_key: str = None, session_id: str = None):
        """
        Initialize Qdrant Cloud search engine with session support.
        
        Args:
            url: Qdrant Cloud URL
            api_key: Qdrant Cloud API key
            session_id: Session ID for managing user state (creates new if None)
        """
        # Initialize or get session
        if session_id is None:
            self.session_id = str(uuid.uuid4())
        else:
            self.session_id = session_id
            
        # Initialize session if it doesn't exist
        if self.session_id not in sessions:
            sessions[self.session_id] = {
                'search_history': [],
                'preferences': {
                    'semantic_threshold': 0.3,
                    'default_location': None,
                    'max_price_filter': None,
                    'min_price_filter': None
                },
                'cached_results': {},
                'query_count': 0
            }
        
        print(f"🆔 Using session: {self.session_id}")
        
        # Get credentials from parameters or environment variables
        cloud_url = url or os.getenv('QDRANT_URL') or os.getenv('QDRANT_CLOUD_URL')
        cloud_api_key = api_key or os.getenv('QDRANT_API_KEY') or os.getenv('QDRANT_CLOUD_API_KEY')
        
        if not cloud_url or not cloud_api_key:
            raise ValueError(
                "Qdrant Cloud credentials required. Provide either:\n"
                "1. url and api_key parameters, or\n"
                "2. QDRANT_URL and QDRANT_API_KEY environment variables\n"
                "3. Create .env file with your credentials"
            )
        
        self.client = QdrantClient(
            url=cloud_url,
            api_key=cloud_api_key,
        )
        print(f"🌐 Connected to Qdrant Cloud: {cloud_url}")
        
        # Initialize semantic model for understanding queries
        print("🤖 Loading semantic model...")
        self.semantic_model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Get semantic threshold from session preferences
        session_data = sessions.get(self.session_id, {})
        self.semantic_threshold = session_data.get('preferences', {}).get('semantic_threshold', 0.3)
        print("✅ Semantic model loaded!")

        self.collection_name = os.getenv("QDRANT_COLLECTION_NAME")  # Name of the collection
        self.all_tags = []
        self.tag_to_index = {}
        self.load_metadata()
    
    def load_metadata(self):
        """Load metadata from the uploader."""
        try:
            with open("qdrant_metadata.json", "r") as f:
                metadata = json.load(f)
            
            self.all_tags = metadata["all_tags"]
            self.tag_to_index = metadata["tag_to_index"]
            
            print(f"Loaded metadata: {len(self.all_tags)} tags, {metadata['total_items']} items")
            print(f"Available tags: {', '.join(self.all_tags[:10])}..." if len(self.all_tags) > 10 else f"Available tags: {', '.join(self.all_tags)}")
            
        except FileNotFoundError:
            print("❌ Metadata file not found. Please run 'qdrant_uploader.py' first.")
            raise
        except Exception as e:
            print(f"❌ Error loading metadata: {str(e)}")
            raise
    
    def extract_tags_from_experience_prompt(self, prompt: str) -> tuple[List[str], Optional[int]]:
        """
        Extract experience tags and experience ID from user prompt.
        
        Args:
            prompt: User prompt containing experience tags and optionally experience ID to exclude
            
        Returns:
            Tuple of (extracted_tags, experience_id_to_exclude)
        """
        print(f"🔍 Parsing experience prompt: '{prompt}'")
        
        # Extract experience ID to exclude (look for patterns like "experience 123", "id:123", "#123")
        experience_id = None
        id_patterns = [
            r'experience\s+(\d+)',
            r'id[:=]\s*(\d+)', 
            r'#(\d+)',
            r'exclude\s+(\d+)',
            r'not\s+(\d+)'
        ]
        
        for pattern in id_patterns:
            match = re.search(pattern, prompt.lower())
            if match:
                experience_id = int(match.group(1))
                print(f"🚫 Found experience ID to exclude: {experience_id}")
                # Remove the ID part from prompt for tag extraction
                prompt = re.sub(pattern, '', prompt, flags=re.IGNORECASE).strip()
                break
        
        # Extract tags from the remaining prompt
        # First try to find tags in brackets, quotes, or after keywords
        tag_patterns = [
            r'tags?\s*[:=]\s*\[([^\]]+)\]',  # tags: [tag1, tag2, tag3]
            r'tags?\s*[:=]\s*["\']([^"\']+)["\']',  # tags: "tag1, tag2, tag3"
            r'tags?\s*[:=]\s*([^,\n]+(?:,\s*[^,\n]+)*)',  # tags: tag1, tag2, tag3
            r'\[([^\]]+)\]',  # [tag1, tag2, tag3]
            r'["\']([^"\']+)["\']'  # "tag1, tag2, tag3"
        ]
        
        extracted_tags = []
        
        for pattern in tag_patterns:
            matches = re.findall(pattern, prompt, re.IGNORECASE)
            for match in matches:
                # Split by common delimiters and clean up
                tags = re.split(r'[,;|]+', match)
                for tag in tags:
                    clean_tag = tag.strip().strip('"\'').lower()
                    if clean_tag and len(clean_tag) > 1:
                        # Check if this tag exists in our tag vocabulary
                        if clean_tag in self.all_tags:
                            extracted_tags.append(clean_tag)
                        else:
                            # Try to find similar tags using partial matching
                            for known_tag in self.all_tags:
                                if clean_tag in known_tag or known_tag in clean_tag:
                                    if known_tag not in extracted_tags:
                                        extracted_tags.append(known_tag)
                                        break
        
        # If no tags found with patterns, try semantic matching on the whole prompt
        if not extracted_tags:
            print("🔄 No explicit tags found, trying semantic extraction...")
            extracted_tags = self.parse_user_query(prompt, similarity_threshold=0.4)
        
        # Remove duplicates while preserving order
        unique_tags = []
        for tag in extracted_tags:
            if tag not in unique_tags:
                unique_tags.append(tag)
        
        print(f"📊 Extracted tags: {unique_tags}")
        if experience_id:
            print(f"🚫 Will exclude experience ID: {experience_id}")
        
        return unique_tags, experience_id
    
    def extract_location_from_prompt(self, prompt: str) -> Optional[str]:
        """
        Extract location information from user prompt text.
        Only extracts the three allowed cities: Delhi, Bangalore, Gurugram.
        
        Args:
            prompt: User prompt that may contain location information
            
        Returns:
            Extracted location string (Delhi/Bangalore/Gurugram) or None if no location found
        """
        print(f"🔍 Parsing location from prompt: '{prompt}'")
        
        prompt_lower = prompt.lower().strip()
        
        # Define city-specific keywords for the three allowed cities
        city_keywords = {
            'Delhi': [
                'delhi', 'new delhi', 'old delhi', 'ncr', 'national capital region',
                'dwarka', 'rohini', 'lajpat nagar', 'connaught place', 'cp'
            ],
            'Bangalore': [
                'bangalore', 'bengaluru', 'bangaluru', 'blr', 'karnataka',
                'electronic city', 'whitefield', 'koramangala', 'indiranagar',
                'jayanagar', 'mg road', 'brigade road'
            ],
            'Gurugram': [
                'gurugram', 'gurgaon', 'cyber city', 'dlf', 'millennium city',
                'haryana', 'manesar', 'sohna', 'udyog vihar', 'golf course road'
            ]
        }
        
        # Score each city based on keyword matches
        city_scores = {}
        for city, keywords in city_keywords.items():
            score = 0
            matched_keywords = []
            
            for keyword in keywords:
                if keyword in prompt_lower:
                    # Give higher score to exact word matches
                    if f' {keyword} ' in f' {prompt_lower} ' or prompt_lower.startswith(keyword + ' ') or prompt_lower.endswith(' ' + keyword):
                        score += 3
                        matched_keywords.append(keyword)
                    else:
                        score += 1
                        matched_keywords.append(keyword)
            
            if score > 0:
                city_scores[city] = score
                print(f"📍 Found keywords for {city}: {matched_keywords} (score: {score})")
        
        # Get the city with highest score
        if city_scores:
            best_city = max(city_scores, key=city_scores.get)
            print(f"📍 Extracted location: '{best_city}' (score: {city_scores[best_city]})")
            return best_city
        
        print("❌ No location found in prompt")
        return None
    
    def extract_tags_and_location_from_prompt(self, prompt: str) -> tuple[List[str], Optional[int], Optional[str]]:
        """
        Extract tags, experience ID, and location from a comprehensive prompt.
        
        Args:
            prompt: User prompt containing tags, experience ID, and location
            
        Returns:
            Tuple of (extracted_tags, experience_id_to_exclude, location)
        """
        print(f"🔍 Comprehensive parsing of prompt: '{prompt}'")
        
        # Extract tags and experience ID
        tags, experience_id = self.extract_tags_from_experience_prompt(prompt)
        
        # Extract location
        location = self.extract_location_from_prompt(prompt)
        
        print(f"📊 Comprehensive extraction results:")
        print(f"   • Tags: {tags}")
        print(f"   • Experience ID to exclude: {experience_id}")
        print(f"   • Location: {location}")
        
        return tags, experience_id, location
    
    def parse_user_query(self, query: str, similarity_threshold: float = None) -> List[str]:
        """
        Parse user query to extract tags using semantic understanding.
        
        Args:
            query: User's search query
            similarity_threshold: Minimum similarity score to consider a tag relevant
            
        Returns:
            List of extracted tags based on semantic similarity
        """
        # Get session-specific threshold if not provided
        if similarity_threshold is None:
            session_data = sessions.get(self.session_id, {})
            similarity_threshold = session_data.get('preferences', {}).get('semantic_threshold', self.semantic_threshold)
            
        print(f"🔍 Analyzing query semantically: '{query}' (threshold: {similarity_threshold})")
        
        # Encode the user query
        query_embedding = self.semantic_model.encode([query])
        
        # Encode all available tags
        tag_embeddings = self.semantic_model.encode(self.all_tags)
        
        # Calculate cosine similarity between query and each tag
        similarities = torch.nn.functional.cosine_similarity(
            torch.tensor(query_embedding), 
            torch.tensor(tag_embeddings), 
            dim=1
        )
        
        # Find tags above the similarity threshold
        extracted_tags = []
        tag_scores = []
        
        for i, similarity in enumerate(similarities):
            if similarity.item() > similarity_threshold:
                tag = self.all_tags[i]
                score = similarity.item()
                extracted_tags.append(tag)
                tag_scores.append((tag, score))
        
        # Sort by similarity score (highest first)
        tag_scores.sort(key=lambda x: x[1], reverse=True)
        
        # Print semantic analysis results
        if tag_scores:
            print(f"📊 Semantic matches found:")
            for tag, score in tag_scores[:5]:  # Show top 5 matches
                print(f"   • {tag}: {score:.3f}")
        else:
            print(f"❌ No semantic matches above threshold {similarity_threshold}")
            print("🔄 Falling back to keyword matching...")
            
            # Fallback to original keyword-based approach
            query_lower = query.lower()
            
            # Check for exact tag matches
            for tag in self.all_tags:
                if tag in query_lower:
                    extracted_tags.append(tag)
            
            # If no exact matches, try partial matches
            if not extracted_tags:
                query_words = re.findall(r'\b\w+\b', query_lower)
                for word in query_words:
                    for tag in self.all_tags:
                        if (word in tag or tag in word) and len(word) > 2:
                            if tag not in extracted_tags:
                                extracted_tags.append(tag)
        
        return extracted_tags
    
    def create_query_vector(self, tags: List[str]) -> List[float]:
        """
        Create binary vector from list of tags.
        
        Args:
            tags: List of tag strings
            
        Returns:
            Binary vector as list of floats
        """
        vector = [0.0] * len(self.all_tags)
        
        for tag in tags:
            if tag.lower() in self.tag_to_index:
                vector[self.tag_to_index[tag.lower()]] = 1.0
        
        return vector
    
    def create_filters(self, 
                      location: Optional[str] = None,
                      exclude_experience_id: Optional[int] = None) -> Optional[Filter]:
        """
        Create Qdrant filters for location and experience exclusion.
        
        Args:
            location: Location constraint (Delhi, Bangalore, or Gurugram)
            exclude_experience_id: Experience ID to exclude from results
            
        Returns:
            Qdrant Filter object or None if no filters needed
        """
        must_conditions = []
        must_not_conditions = []
        
        # Location filter
        if location:
            # Normalize location to match allowed cities
            normalized_location = self.normalize_location(location)
            must_conditions.append(
                FieldCondition(
                    key="location",
                    match=MatchValue(value=normalized_location)
                )
            )
            print(f"📍 Filtering by location: {normalized_location}")
        
        # Experience exclusion filter
        if exclude_experience_id is not None:
            must_not_conditions.append(
                FieldCondition(
                    key="experience_id",
                    match=MatchValue(value=exclude_experience_id)
                )
            )
            print(f"🚫 Excluding experience ID: {exclude_experience_id}")
        
        # Build filter if we have any conditions
        if must_conditions or must_not_conditions:
            filter_dict = {}
            if must_conditions:
                filter_dict["must"] = must_conditions
            if must_not_conditions:
                filter_dict["must_not"] = must_not_conditions
            return Filter(**filter_dict)
        
        return None
    
    def search_similar(self, 
                      query: str,
                      location: Optional[str] = None,
                      exclude_experience_id: Optional[int] = None,
                      min_price: Optional[float] = None,
                      max_price: Optional[float] = None,
                      top_k: int = 5,
                      auto_extract_location: bool = True,
                      use_structured_parsing: bool = False,
                      **kwargs) -> List[Dict]:
        """
        Search for similar experiences using vector similarity and constraints.
        Uses session preferences for defaults and caching.
        Can automatically extract location from query if not provided.
        
        Args:
            query: User's search query or structured prompt
            location: Location constraint (uses session default if None)
            exclude_experience_id: Experience ID to exclude from results
            min_price: Minimum price constraint (uses session default if None)
            max_price: Maximum price constraint (uses session default if None)
            top_k: Number of results to return
            auto_extract_location: Whether to automatically extract location from query
            use_structured_parsing: If True, uses structured tag parsing (for experience prompts)
            **kwargs: Additional filter conditions
            
        Returns:
            List of search results with similarity scores
        """
        try:
            # Get session preferences for defaults
            session_data = sessions.get(self.session_id, {})
            preferences = session_data.get('preferences', {})
            
            # Apply session defaults if not provided
            if location is None:
                location = preferences.get('default_location')
            if min_price is None:
                min_price = preferences.get('min_price_filter')
            if max_price is None:
                max_price = preferences.get('max_price_filter')
            
            # Extract tags based on parsing method
            if use_structured_parsing:
                # Use structured parsing for experience prompts
                extracted_tags, extracted_id, extracted_location = self.extract_tags_and_location_from_prompt(query)
                
                # Use extracted values if not explicitly provided
                if exclude_experience_id is None and extracted_id is not None:
                    exclude_experience_id = extracted_id
                if location is None and extracted_location is not None:
                    location = extracted_location
                    
                query_tags = extracted_tags
                print(f"Structured parsing - Tags: {query_tags}, Exclude ID: {exclude_experience_id}, Location: {location}")
            else:
                # Use semantic parsing for natural language queries
                query_tags = self.parse_user_query(query)
                print(f"Semantic parsing - Extracted tags from query: {query_tags}")
                
                # Auto-extract location from query if enabled and no location provided
                if auto_extract_location and location is None:
                    extracted_location = self.extract_location_from_prompt(query)
                    if extracted_location:
                        location = extracted_location
                        print(f"📍 Auto-extracted location from query: {location}")
            
            if not query_tags:
                print("⚠️ No valid tags found in query.")
                print(f"Available tags: {', '.join(self.all_tags)}")
                return []
            
            # Create cache key for this search
            cache_key = f"{query}_{location}_{exclude_experience_id}_{min_price}_{max_price}_{top_k}_{hash(str(sorted(kwargs.items())))}"
            
            # Check cache first
            if session_data and cache_key in session_data.get('cached_results', {}):
                cached_result = session_data['cached_results'][cache_key]
                print(f"💾 Using cached results for this query")
                return cached_result['results']
            
            # Create query vector
            query_vector = self.create_query_vector(query_tags)
            
            # Create filters for location and experience exclusion
            filters = self.create_filters(
                location=location,
                exclude_experience_id=exclude_experience_id
            )
            
            # Perform vector search
            search_results = self.client.search(
                collection_name=self.collection_name,
                query_vector=query_vector,
                query_filter=filters,
                limit=top_k,
                with_payload=True,
                with_vectors=False  # Don't return vectors to save bandwidth
            )
            
            # Format results
            results = []
            for result in search_results:
                result_dict = {
                    "id": result.id,
                    "similarity_score": float(result.score),
                    "payload": result.payload
                }
                results.append(result_dict)
            
            # Cache results (keep only last 10 searches per session)
            if session_data:
                if 'cached_results' not in session_data:
                    session_data['cached_results'] = {}
                
                cached_results = session_data['cached_results']
                cached_results[cache_key] = {'results': results}
                
                # Keep only last 10 cached searches
                if len(cached_results) > 10:
                    # Remove oldest entry (first key)
                    oldest_key = next(iter(cached_results))
                    del cached_results[oldest_key]
                
                sessions[self.session_id]['cached_results'] = cached_results
            
            # Add to search history
            search_history_query = f"Tags: {', '.join(query_tags)}" if use_structured_parsing else query
            if 'search_history' not in sessions[self.session_id]:
                sessions[self.session_id]['search_history'] = []
            sessions[self.session_id]['search_history'].append({
                'query': search_history_query,
                'results_count': len(results)
            })
            sessions[self.session_id]['query_count'] = sessions[self.session_id].get('query_count', 0) + 1
            
            # Keep only last 50 searches
            if len(sessions[self.session_id]['search_history']) > 50:
                sessions[self.session_id]['search_history'] = sessions[self.session_id]['search_history'][-50:]
            
            return results
            
        except Exception as e:
            print(f"❌ Search error: {str(e)}")
            return []
    
    def print_results(self, results: List[Dict], query: str):
        """
        Print search results in a formatted way.
        
        Args:
            results: Search results
            query: Original query
        """
        if not results:
            print("\n❌ No results found.")
            return
        
        print(f"\n🔍 Search Results for: '{query}'")
        print("=" * 80)
        
        for i, result in enumerate(results, 1):
            payload = result["payload"]
            score = result["similarity_score"]
            
            print(f"\n{i}. Similarity Score: {score:.4f}")
            print(f"   Name: {payload.get('name', 'N/A')}")
            print(f"   Tags: {payload.get('tags', 'N/A')}")
            print(f"   Location: {payload.get('location', 'N/A')}")
            print(f"   Price: ${payload.get('price', 'N/A')}")
            
            # Print additional fields if available
            for key, value in payload.items():
                if key not in ['name', 'tags', 'location', 'price', 'original_index']:
                    print(f"   {key.replace('_', ' ').title()}: {value}")
            
            print("-" * 60)
    
    def get_available_tags(self) -> List[str]:
        """Get list of all available tags."""
        return self.all_tags.copy()
    


    def set_semantic_threshold(self, threshold: float):
        """
        Set the similarity threshold for semantic tag matching for this session.
        
        Args:
            threshold: Similarity threshold (0.0 to 1.0)
        """
        threshold = max(0.0, min(1.0, threshold))
        if self.session_id in sessions:
            sessions[self.session_id]['preferences']['semantic_threshold'] = threshold
        print(f"🎯 Semantic similarity threshold set to: {threshold} for session {self.session_id}")
    
    def get_session_stats(self) -> Dict:
        """Get statistics for the current session."""
        session = sessions.get(self.session_id, {})
        if session:
            return {
                'session_id': self.session_id,
                'query_count': session.get('query_count', 0),
                'search_history_count': len(session.get('search_history', [])),
                'preferences': session.get('preferences', {})
            }
        return {}
    


    def normalize_location(self, location_string: str) -> str:
        """
        Parse and normalize location string to match allowed cities.
        Uses the same intelligent parsing as the uploader.
        
        Args:
            location_string: Raw location string from user input
            
        Returns:
            Normalized location (Delhi, Bangalore, or Gurugram)
        """
        if not location_string:
            return 'Delhi'  # Default fallback
        
        location_lower = str(location_string).lower().strip()
        
        # Define mapping patterns for each city
        city_patterns = {
            'Delhi': [
                'delhi', 'new delhi', 'old delhi', 'ncr', 'national capital region',
                'dwarka', 'rohini', 'lajpat nagar', 'connaught place', 'cp'
            ],
            'Bangalore': [
                'bangalore', 'bengaluru', 'bangaluru', 'blr', 'karnataka',
                'electronic city', 'whitefield', 'koramangala', 'indiranagar',
                'jayanagar', 'mg road', 'brigade road'
            ],
            'Gurugram': [
                'gurugram', 'gurgaon', 'cyber city', 'dlf', 'millennium city',
                'haryana', 'manesar', 'sohna', 'udyog vihar', 'golf course road'
            ]
        }
        
        # Check for exact or partial matches
        for city, patterns in city_patterns.items():
            for pattern in patterns:
                if pattern in location_lower:
                    return city
        
        # If no match found, try fuzzy matching on city names only
        cities = ['delhi', 'bangalore', 'bengaluru', 'gurugram', 'gurgaon']
        for city_name in cities:
            if city_name in location_lower:
                if city_name in ['bangalore', 'bengaluru']:
                    return 'Bangalore'
                elif city_name in ['gurugram', 'gurgaon']:
                    return 'Gurugram'
                elif city_name == 'delhi':
                    return 'Delhi'
        
        # Final fallback to Delhi
        print(f"⚠️ Could not parse location '{location_string}', defaulting to Delhi")
        return 'Delhi'
    
    def get_session_id(self) -> str:
        """Get the current session ID."""
        return self.session_id
    
    def clear_session_cache(self):
        """Clear cached results for this session."""
        if self.session_id in sessions:
            sessions[self.session_id]['cached_results'] = {}
            print(f"🧹 Cleared cache for session {self.session_id}")
    
    def reset_session_preferences(self):
        """Reset all preferences for this session to defaults."""
        default_preferences = {
            'semantic_threshold': 0.3,
            'default_location': None,
            'max_price_filter': None,
            'min_price_filter': None
        }
        if self.session_id in sessions:
            sessions[self.session_id]['preferences'] = default_preferences
        print(f"🔄 Reset preferences for session {self.session_id}")
    
    def analyze_query_semantics(self, query: str, top_k: int = 10) -> List[tuple]:
        """
        Analyze semantic similarity between query and all tags for debugging.
        
        Args:
            query: User's search query
            top_k: Number of top matches to return
            
        Returns:
            List of (tag, similarity_score) tuples
        """
        query_embedding = self.semantic_model.encode([query])
        tag_embeddings = self.semantic_model.encode(self.all_tags)
        
        similarities = torch.nn.functional.cosine_similarity(
            torch.tensor(query_embedding), 
            torch.tensor(tag_embeddings), 
            dim=1
        )
        
        tag_scores = [(self.all_tags[i], similarities[i].item()) 
                     for i in range(len(self.all_tags))]
        tag_scores.sort(key=lambda x: x[1], reverse=True)
        
        return tag_scores[:top_k]

    def get_allowed_locations(self) -> List[str]:
        """Get list of allowed locations."""
        return ["Delhi", "Bangalore", "Gurugram"]

def create_search_engine_with_session(session_id: str = None, url: str = None, api_key: str = None) -> QdrantSearchEngine:
    """
    Factory function to create a QdrantSearchEngine with session support.
    
    Args:
        session_id: Existing session ID or None to create new
        url: Qdrant Cloud URL
        api_key: Qdrant Cloud API key
        
    Returns:
        QdrantSearchEngine instance with session
    """
    return QdrantSearchEngine(url=url, api_key=api_key, session_id=session_id)



def main():
    """Main function for interactive search with session management."""
    try:
        print("🌐 Qdrant Cloud Experience Search Engine with Session Support")
        print("Make sure you have uploaded data using 'qdrant_uploader.py' first!")
        
        # Check for environment variables first
        url = os.getenv('QDRANT_URL')
        api_key = os.getenv('QDRANT_API_KEY')
        
        if not url or not api_key:
            print("\n📝 Environment variables not found.")
            print("You can either:")
            print("1. Create a .env file with QDRANT_URL and QDRANT_API_KEY")
            print("2. Enter them manually below")
            
            url = url or input("\nEnter Qdrant Cloud URL: ").strip()
            api_key = api_key or input("Enter Qdrant Cloud API Key: ").strip()
            
            if not url or not api_key:
                print("❌ Both URL and API Key are required!")
                return
        
        # Simple session setup
        print(f"\n🆔 Session Management:")
        existing_session = input("Enter existing session ID (or press Enter for new): ").strip()
        session_id = existing_session if existing_session else None
        
        search_engine = create_search_engine_with_session(session_id=session_id, url=url, api_key=api_key)
        
        print("\nAvailable tags:", ', '.join(search_engine.get_available_tags()[:15]), "...")
        print("Available locations:", ', '.join(search_engine.get_allowed_locations()))
        
        # Show session info
        session_stats = search_engine.get_session_stats()
        print(f"\n📊 Session {session_stats.get('session_id', 'Unknown')[:8]} | Previous queries: {session_stats.get('query_count', 0)}")
        
        # Interactive search
        print(f"\n{'='*60}")
        print("🔍 EXPERIENCE SEARCH ENGINE")
        print(f"{'='*60}")
        print("Examples:")
        print("  • 'Tags: adventure, outdoors in Delhi exclude experience 123'")
        print("  • 'Spa experiences in Bangalore similar to relaxation'")
        print("  • 'Cultural activities in Koramangala not experience 456'")
        print("Type 'quit' to exit")
        
        while True:
            query = input(f"\n� [{search_engine.get_session_id()[:8]}] Enter experience prompt: ").strip()
            if query.lower() in ['quit', 'exit', 'q']:
                break
            
            if not query:
                continue
            
            # Main experience search - auto-extracts tags, location, and experience ID
            print(f"\n🔍 Searching for similar experiences based on: '{query}'")
            print("💡 Auto-extracting tags, location, and experience ID from your prompt...")
            
            results = search_engine.search_similar(
                query=query,
                top_k=5,
                use_structured_parsing=True,
                auto_extract_location=True
            )
            
            if results:
                print(f"\n🎯 Found {len(results)} similar experiences:")
                for i, result in enumerate(results, 1):
                    print(f"\n{i}. Experience ID: {result['id']}")
                    print(f"   Similarity: {result['similarity_score']:.4f}")
                    payload = result['payload']
                    if 'title' in payload:
                        print(f"   Title: {payload['title']}")
                    if 'location' in payload:
                        print(f"   Location: {payload['location']}")
                    if 'price' in payload:
                        print(f"   Price: ${payload['price']}")
                    if 'tags' in payload:
                        print(f"   Tags: {', '.join(payload['tags'])}")
            else:
                print("❌ No similar experiences found.")
                print("💡 Try different tags or check available tags online")
    
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        print("Make sure you have Qdrant credentials and uploaded data.")

if __name__ == "__main__":
    main()
