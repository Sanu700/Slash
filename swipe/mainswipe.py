from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
from supabase import create_client, Client
from dotenv import load_dotenv
import os
import sys
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
load_dotenv()
load_dotenv()
load_dotenv(override=True)


# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

# Qdrant configuration
QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API")

# Validate required environment variables
if not SUPABASE_URL or not SUPABASE_KEY:
    logger.error("Missing Supabase credentials.")
    sys.exit(1)

if not QDRANT_URL or not QDRANT_API_KEY:
    logger.warning("Missing Qdrant credentials. Will use fallback logic.")

# Initialize Supabase client (only persistent connection)
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Initialize FastAPI app
app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "https://slash-rag-agent.onrender.com",
        "https://slash-experiences.netlify.app",
        "http://localhost:5173", 
        "https://slashexperiences.in",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SwipeRequest(BaseModel):
    user_id: str
    likes: List[str]  # List of UUIDs
    dislikes: List[str]  # List of UUIDs
    skips: List[str]  # List of UUIDs

def get_search_engine():
    """Create a fresh QdrantSearchEngine instance for each request."""
    try:
        if QDRANT_URL and QDRANT_API_KEY:
            from qdrant_search import create_search_engine_with_session
            return create_search_engine_with_session(
                url=QDRANT_URL,
                api_key=QDRANT_API_KEY
            )
        return None
    except Exception as e:
        logger.error(f"Error creating QdrantSearchEngine: {str(e)}")
        return None

@app.get("/start")
async def get_initial_experiences(user_id: str):
    """
    Get initial 7 experiences for a user.
    Stateless: All data is fetched from Supabase and discarded after response.
    """
    # Create fresh search engine instance for this request only
    search_engine = get_search_engine()
    
    try:
        logger.info(f"Getting initial experiences for user {user_id}")
        
        # Fetch user history from Supabase (no local caching)
        user_history_response = supabase.table("swipes").select("*").eq("user_id", user_id).execute()
        user_has_history = bool(user_history_response.data)
        
        # Fetch already swiped IDs from Supabase (no local storage)
        already_swiped_response = supabase.table("swipes").select("likes, dislikes, skips").eq("user_id", user_id).execute()
        already_swiped = []
        if already_swiped_response.data:
            for record in already_swiped_response.data:
                if record.get("likes"):
                    already_swiped.extend(record["likes"])
                if record.get("dislikes"):
                    already_swiped.extend(record["dislikes"])
                if record.get("skips"):
                    already_swiped.extend(record["skips"])
        
        if user_has_history:
            logger.info(f"User {user_id} has previous swipe history")
            
            # Extract liked IDs from history
            liked_ids = []
            for record in user_history_response.data:
                if record.get("likes"):
                    liked_ids.extend(record["likes"])
            
            # If we have Qdrant and liked experiences, use vector search
            if search_engine and liked_ids:
                # Fetch liked experiences from Supabase
                liked_experiences_response = supabase.table("experiences").select("*").in_("id", liked_ids).execute()
                
                if liked_experiences_response.data:
                    # Extract tags from liked experiences
                    all_tags = []
                    for exp in liked_experiences_response.data:
                        if exp.get("tags"):
                            if isinstance(exp["tags"], list):
                                all_tags.extend(exp["tags"])
                            elif isinstance(exp["tags"], str):
                                all_tags.extend([t.strip() for t in exp["tags"].split(',')])
                    
                    if all_tags:
                        # Use Qdrant to find similar experiences
                        tag_query = ", ".join(list(set(all_tags)))  # Remove duplicates
                        qdrant_results = search_engine.search_similar(
                            query=f"Tags: {tag_query}",
                            top_k=15,
                            use_structured_parsing=True
                        )
                        
                        # Get experience IDs from Qdrant results, excluding already swiped
                        recommended_ids = []
                        for result in qdrant_results:
                            exp_id = result.get("id")
                            if exp_id and exp_id not in already_swiped and len(recommended_ids) < 7:
                                recommended_ids.append(exp_id)
                        
                        # Fetch full experience data from Supabase
                        if recommended_ids:
                            experiences_response = supabase.table("experiences").select("*").in_("id", recommended_ids).execute()
                            if experiences_response.data:
                                return experiences_response.data[:7]
            
            # Fallback: Get random experiences excluding already swiped
            if already_swiped:
                # Use filter with not operator for excluding already swiped
                all_experiences_response = supabase.table("experiences").select("*").execute()
                if all_experiences_response.data:
                    # Filter out already swiped experiences
                    filtered_experiences = [exp for exp in all_experiences_response.data if exp["id"] not in already_swiped]
                    return filtered_experiences[:7]
            else:
                random_response = supabase.table("experiences").select("*").limit(7).execute()
                return random_response.data if random_response.data else []
        
        else:
            logger.info(f"New user {user_id}. Providing diverse initial experiences")
            
            # For new users, get diverse experiences with unique tags
            if search_engine:
                try:
                    available_tags = search_engine.get_available_tags()
                    diverse_experiences = []
                    
                    # Get one experience for each of the first 7 tags
                    for tag in available_tags[:7]:
                        qdrant_results = search_engine.search_similar(
                            query=f"Tags: {tag}",
                            top_k=1,
                            use_structured_parsing=True
                        )
                        
                        if qdrant_results:
                            exp_id = qdrant_results[0].get("id")
                            if exp_id:
                                exp_response = supabase.table("experiences").select("*").eq("id", exp_id).execute()
                                if exp_response.data:
                                    diverse_experiences.extend(exp_response.data)
                                    if len(diverse_experiences) >= 7:
                                        break
                    
                    if len(diverse_experiences) >= 7:
                        return diverse_experiences[:7]
                
                except Exception as e:
                    logger.error(f"Error getting diverse experiences: {str(e)}")
            
            # Final fallback: Get 7 random experiences
            random_response = supabase.table("experiences").select("*").limit(7).execute()
            return random_response.data if random_response.data else []
    
    except Exception as e:
        logger.error(f"Error in get_initial_experiences: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error getting initial experiences: {str(e)}")
    
    finally:
        # Ensure search_engine is cleaned up (goes out of scope)
        search_engine = None

@app.post("/recommendation")
async def get_recommendations(request: SwipeRequest):
    """
    Update swipes table and return 5 relevant recommendations.
    Stateless: All data is immediately persisted to Supabase and discarded after response.
    """
    # Create fresh search engine instance for this request only
    search_engine = get_search_engine()
    
    try:
        user_id = request.user_id
        new_likes = request.likes
        new_dislikes = request.dislikes
        new_skips = request.skips
        
        logger.info(f"Processing recommendation request for user {user_id}")
        
        # Fetch current swipes record from Supabase
        current_record_response = supabase.table("swipes").select("*").eq("user_id", user_id).execute()
        
        if not current_record_response.data:
            # Create new record in Supabase immediately
            supabase.table("swipes").insert({
                "user_id": user_id,
                "likes": list(set(new_likes)) if new_likes else [],
                "dislikes": list(set(new_dislikes)) if new_dislikes else [],
                "skips": list(set(new_skips)) if new_skips else []
            }).execute()
            
            final_likes = new_likes
            final_dislikes = new_dislikes
            final_skips = new_skips
        else:
            # Update existing record in Supabase immediately
            current_record = current_record_response.data[0]
            
            # Merge arrays ensuring no duplicates across categories
            current_likes = current_record.get("likes", []) or []
            current_dislikes = current_record.get("dislikes", []) or []
            current_skips = current_record.get("skips", []) or []
            
            # Process new likes
            final_likes = current_likes.copy()
            for like_id in new_likes:
                if like_id not in final_likes:
                    final_likes.append(like_id)
                    # Remove from other arrays
                    current_dislikes = [id for id in current_dislikes if id != like_id]
                    current_skips = [id for id in current_skips if id != like_id]
            
            # Process new dislikes
            final_dislikes = current_dislikes.copy()
            for dislike_id in new_dislikes:
                if dislike_id not in final_dislikes:
                    final_dislikes.append(dislike_id)
                    # Remove from other arrays
                    final_likes = [id for id in final_likes if id != dislike_id]
                    current_skips = [id for id in current_skips if id != dislike_id]
            
            # Process new skips
            final_skips = current_skips.copy()
            for skip_id in new_skips:
                if skip_id not in final_skips:
                    final_skips.append(skip_id)
                    # Remove from other arrays
                    final_likes = [id for id in final_likes if id != skip_id]
                    final_dislikes = [id for id in final_dislikes if id != skip_id]
            
            # Update Supabase immediately
            supabase.table("swipes").update({
                "likes": final_likes,
                "dislikes": final_dislikes,
                "skips": final_skips,
                "updated_at": "now()"
            }).eq("user_id", user_id).execute()
        
        # Get all already swiped IDs from Supabase
        all_swiped = []
        all_swiped.extend(final_likes)
        all_swiped.extend(final_dislikes)
        all_swiped.extend(final_skips)
        
        # Generate recommendations using Qdrant if available
        if search_engine and final_likes:
            # Fetch liked experiences from Supabase
            liked_experiences_response = supabase.table("experiences").select("*").in_("id", final_likes).execute()
            
            if liked_experiences_response.data:
                # Extract tags from liked experiences
                all_tags = []
                for exp in liked_experiences_response.data:
                    if exp.get("tags"):
                        if isinstance(exp["tags"], list):
                            all_tags.extend(exp["tags"])
                        elif isinstance(exp["tags"], str):
                            all_tags.extend([t.strip() for t in exp["tags"].split(',')])
                
                if all_tags:
                    # Use Qdrant to find similar experiences
                    unique_tags = list(set(all_tags))  # Remove duplicates
                    tag_query = ", ".join(unique_tags)
                    
                    qdrant_results = search_engine.search_similar(
                        query=f"Tags: {tag_query}",
                        top_k=20,
                        use_structured_parsing=True
                    )
                    
                    # Get experience IDs from Qdrant results, excluding already swiped
                    recommended_ids = []
                    for result in qdrant_results:
                        exp_id = result.get("id")
                        if exp_id and exp_id not in all_swiped and len(recommended_ids) < 5:
                            recommended_ids.append(exp_id)
                    
                    # Fetch full experience data from Supabase
                    if recommended_ids:
                        recommendations_response = supabase.table("experiences").select("*").in_("id", recommended_ids).execute()
                        if recommendations_response.data:
                            return recommendations_response.data[:5]
        
        # Fallback: Get random experiences excluding already swiped
        if all_swiped:
            # Get all experiences and filter out already swiped ones
            all_experiences_response = supabase.table("experiences").select("*").execute()
            if all_experiences_response.data:
                # Filter out already swiped experiences
                filtered_experiences = [exp for exp in all_experiences_response.data if exp["id"] not in all_swiped]
                return filtered_experiences[:5]
        else:
            random_response = supabase.table("experiences").select("*").limit(5).execute()
            return random_response.data if random_response.data else []
        
        return []
    
    except Exception as e:
        logger.error(f"Error in get_recommendations: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error getting recommendations: {str(e)}")
    
    finally:
        # Ensure search_engine is cleaned up (goes out of scope)
        search_engine = None
