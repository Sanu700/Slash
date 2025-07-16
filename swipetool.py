# def get_top_chunks(prompt: str, k: int = 5):
#     # Simulate recommendations
#     return [{"id": f"rec_{i}", "score": 0.9 - i*0.1} for i in range(k)]



from qdrant_client.models import VectorParams, Distance
import os
from qdrant_client.models import VectorParams, Distance


from dotenv import load_dotenv
load_dotenv()
load_dotenv(override=True)

# --- Supabase session persistence ---
import supabase
from supabase import create_client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Save session to Supabase
def save_session_to_db(session_id):
    session = sessions.get(session_id)
    if not session:
        print(f"⚠️ No session found for session_id: {session_id}")
        return {"status": "error", "message": "Session not found."}

    try:
        response = supabase_client.table("sessions").upsert(
            {
                "id": session_id,
                "current_question_index": session["current_question_index"],
                "recipient_context": session["recipient_context"],
                "only_questions": session["only_questions"],
                "question_stack": session["question_stack"],
            },
            on_conflict="id"  # 👈 ensures update if the session ID already exists
        ).execute()

        print(f"✅ Session {session_id} saved to DB.")
        return {"status": "ok", "message": "Session saved to DB.", "data": response.data}

    except Exception as e:
        print(f"❌ Failed to save session {session_id} to DB:", str(e))
        return {"status": "error", "message": str(e)}

def save_all_sessions_to_db():
    for session_id in sessions.keys():
        save_session_to_db(session_id)

def load_all_sessions_from_db():
    response = supabase_client.table("sessions").select("*").execute()
    if response.data:
        for row in response.data:
            sessions[row["id"]] = {
                "current_question_index": row.get("current_question_index", 0),
                "recipient_context": row.get("recipient_context", {}),
                "only_questions": row.get("only_questions", []),
                "question_stack": row.get("question_stack", [])
            }

def load_session_from_db(session_id):
    try:
        response = supabase_client.table("sessions").select("*").eq("id", session_id).single().execute()

        data = response.data
        if data:
            print(f"✅ Session {session_id} loaded from DB.")
            # Restore it into local in-memory sessions
            sessions[session_id] = {
                "current_question_index": data["current_question_index"],
                "recipient_context": data["recipient_context"],
                "only_questions": data["only_questions"],
                "question_stack": data["question_stack"]
            }
            return {"status": "ok", "session": sessions[session_id]}
        else:
            print(f"⚠️ Session {session_id} not found in DB.")
            return {"status": "error", "message": "Session not found."}

    except Exception as e:
        print(f"❌ Error loading session {session_id} from DB:", str(e))
        return {"status": "error", "message": str(e)}

# # --- Session persistence timing utility ---
# import time
# from typing import Dict

# # Utility to track last saved time
# session_last_saved: Dict[str, float] = {}

# def maybe_save_session_to_db(session_id):
#     """Save session if more than X seconds passed since last save"""
#     now = time.time()
#     last_saved = session_last_saved.get(session_id, 0)
#     if now - last_saved > 60:  # e.g., save if more than 60 seconds passed
#         save_session_to_db(session_id)
#         session_last_saved[session_id] = now




def delete_session(session_id):
    if session_id in sessions:
        del sessions[session_id]
        print(f"🗑️ Session {session_id} deleted from memory.")
        return {"status": "ok", "message": f"Session {session_id} deleted."}
    else:
        print(f"⚠️ Session {session_id} not found.")
        return {"status": "error", "message": f"Session {session_id} not found."}

#Environment variables
load_dotenv(override=True)
Azure_OpenAI = os.getenv("Azure_OpenAI")
Azure_link = os.getenv("Azure_link")
QDRANT_API_KEY = os.getenv("QDRANT_API")
QDRANT_HOST = os.getenv("QDRANT_URL")

import csv
import openai
import uuid
from qdrant_client import QdrantClient
import nltk


from openai import AzureOpenAI

embedding_client = AzureOpenAI(
    api_key=Azure_OpenAI,
    api_version="2023-05-15",
    azure_endpoint=Azure_link
)

# ---------------------------------------------------------------------
# Helper Functions
# ---------------------------------------------------------------------

def get_embedding(text_chunk):
    """Generate an embedding using Azure OpenAI."""
    try:
        response = embedding_client.embeddings.create(
            input=text_chunk,  # Changed from [text_chunk] to text_chunk
            model= "text-embedding-3-small"
        )
        return response.data[0].embedding
    except Exception as e:
        print(f"Error getting embedding for chunk '{text_chunk[:30]}...': {e}")
        return None

def get_top_chunks(query, k=5):
    """Retrieve the most relevant chunks from Qdrant with budget and location filtering."""
    # Parse budget and location from query
    user_budget = parse_budget_from_query(query)
    user_location = parse_location_from_query(query)
    
    print(f"🔍 Using budget: {user_budget}")
    print(f"🔍 Using location: {user_location}")
    
    # Use the imported get_embedding from populate_database.py for query embedding
    query_vector = get_embedding(query)
    
    # Get more results initially in case we need to filter by budget/location
    search_limit = k * 5 if (user_budget or user_location) else k
    
    results = client.query_points(
        collection_name="dragv10_bot",
        query=query_vector,
        limit=search_limit,
        with_payload=True
    )
    
    # Handle the results structure properly
    chunks = []
    points = getattr(results, 'points', results)
    if isinstance(points, list):
        for hit in points:
            payload = getattr(hit, "payload", None)
            if payload is None and isinstance(hit, dict):
                payload = hit.get("payload", {})
            
            if payload and "title" in payload:
                # Get price and location from payload
                chunk_price = payload.get("price", float('inf'))
                chunk_location = payload.get("location", "")
                chunk_id = payload.get("id", "")
                supabase_id= payload.get("supabase_id", "")
                title = payload.get("title", "")
                
                # Apply filters
                passes_budget_filter = True
                passes_location_filter = True
                
                # Filter by budget if user specified one
                if user_budget is not None:
                    new_budget = user_budget*1.12
                    passes_budget_filter = chunk_price <= new_budget
                
                # Filter by location if user specified one
                if user_location is not None:
                    if not chunk_location:
                        # If chunk has no location but user specified one, skip this chunk
                        passes_location_filter = False
                    else:
                        # Simple location matching for Delhi, Bangalore, Gurgaon
                        user_location_lower = user_location.lower()
                        chunk_location_lower = chunk_location.lower()
                        
                        print(f"🔍 Comparing: '{user_location_lower}' with '{chunk_location_lower}'")
                        
                        # Direct string matching for Indian cities
                        passes_location_filter = (
                            user_location_lower in chunk_location_lower or
                            chunk_location_lower in user_location_lower
                        )
                        
                        print(f"🔍 Location filter result: {passes_location_filter}")
                
                # Only add chunks that pass both filters
                if passes_budget_filter and passes_location_filter:
                    chunks.append({
                        "id": chunk_id,
                        "supabase_id": supabase_id,
                        "title": title,
                        "price": chunk_price,
                        "location": chunk_location
                    })
                    if len(chunks) >= k:  # Stop when we have enough chunks
                        break
    
    # If we have filters but no results, provide feedback
    if (user_budget or user_location) and not chunks:
        print(f"⚠️  No experiences found matching your criteria:")
        if user_budget:
            print(f"   Budget: Under ₹{user_budget:,.2f}")
        if user_location:
            print(f"   Location: {user_location}")
        print("   Try adjusting your budget or location preferences.")
    
    return chunks

def parse_budget_from_query(query):
    """Extract budget from user query, including budget ranges. Returns the higher limit for ranges."""
    
    # First check for budget ranges like "2000-4000", "$2000-$4000", etc.
    range_patterns = [
        r'budget\s*\$?(\d+(?:,\d{3})*(?:\.\d{2})?)\s*-\s*\$?(\d+(?:,\d{3})*(?:\.\d{2})?)',
        r'\$?(\d+(?:,\d{3})*(?:\.\d{2})?)\s*-\s*\$?(\d+(?:,\d{3})*(?:\.\d{2})?)\s*budget',
        r'between\s*\$?(\d+(?:,\d{3})*(?:\.\d{2})?)\s*-\s*\$?(\d+(?:,\d{3})*(?:\.\d{2})?)',
        r'between\s*\$?(\d+(?:,\d{3})*(?:\.\d{2})?)\s*and\s*\$?(\d+(?:,\d{3})*(?:\.\d{2})?)',
        r'from\s*\$?(\d+(?:,\d{3})*(?:\.\d{2})?)\s*to\s*\$?(\d+(?:,\d{3})*(?:\.\d{2})?)',
        r'\$?(\d+(?:,\d{3})*(?:\.\d{2})?)\s*-\s*\$?(\d+(?:,\d{3})*(?:\.\d{2})?)'
    ]
    
    query_lower = query.lower()
    
    # Check for range patterns first
    for pattern in range_patterns:
        match = re.search(pattern, query_lower)
        if match:
            try:
                # Get both values from the range
                min_budget = float(match.group(1).replace(',', ''))
                max_budget = float(match.group(2).replace(',', ''))
                # Return the higher value as the budget limit
                return max(min_budget, max_budget)
            except (ValueError, AttributeError):
                continue
    
    # If no range found, look for single budget values
    single_patterns = [
        r'budget\s*\$?(\d+(?:,\d{3})*(?:\.\d{2})?)',
        r'\$(\d+(?:,\d{3})*(?:\.\d{2})?)\s*budget',
        r'under\s*\$?(\d+(?:,\d{3})*(?:\.\d{2})?)',
        r'within\s*\$?(\d+(?:,\d{3})*(?:\.\d{2})?)',
        r'maximum\s*\$?(\d+(?:,\d{3})*(?:\.\d{2})?)',
        r'max\s*\$?(\d+(?:,\d{3})*(?:\.\d{2})?)',
        r'up\s*to\s*\$?(\d+(?:,\d{3})*(?:\.\d{2})?)',
        r'\$(\d+(?:,\d{3})*(?:\.\d{2})?)'
    ]
    
    for pattern in single_patterns:
        match = re.search(pattern, query_lower)
        if match:
            try:
                # Remove commas and convert to float
                budget_str = match.group(1).replace(',', '')
                return float(budget_str)
            except (ValueError, AttributeError):
                continue
    
    return None

def parse_location_from_query(query):
    """Extract location from user query - only recognizes Delhi, Bangalore, and Gurgaon"""
    query_lower = query.lower()
    
    # Only accept these three Indian cities
    valid_locations = ['delhi', 'bangalore', 'gurgaon']
    
    # Split by commas and check each part (for structured input like "name,delhi,relation,occasion")
    parts = [part.strip() for part in query.split(',')]
    for part in parts:
        part_lower = part.lower()
        for location in valid_locations:
            # Only match if the part is exactly the location
            if part_lower == location:
                return location.title()
    
    # Check for explicit location phrases
    location_phrases = [
        r'location[:\s]+([a-zA-Z\s]+?)(?:\s*,|\s*$)',
        r'city[:\s]+([a-zA-Z\s]+?)(?:\s*,|\s*$)',
        r'where[:\s]+([a-zA-Z\s]+?)(?:\s*,|\s*$)',
        r'in\s+([a-zA-Z\s]+?)(?:\s*,|\s*$)'
    ]
    
    for pattern in location_phrases:
        match = re.search(pattern, query_lower)
        if match:
            location = match.group(1).strip()
            location = re.sub(r'\b(the|a|an)\b', '', location, flags=re.IGNORECASE).strip()
            location_lower = location.lower()
            # Only return if it's one of our valid locations
            if location_lower in valid_locations:
                return location.title()
    
    # Direct substring search for valid locations only
    for location in valid_locations:
        if location in query_lower:
            return location.title()
    
    return None

def generate_answer(query, chunks):
    """Use Azure OpenAI to generate an answer given retrieved chunks."""
    completion_client = AzureOpenAI(
        api_key=Azure_OpenAI,
        api_version="2023-05-15",
        azure_endpoint=Azure_link
    )
    
    # Format chunks with title and price information
    context_parts = []
    for chunk in chunks:
        context_parts.append(f"Experience: {chunk['title']} (Price: ${chunk['price']:.2f}) [Chunk ID: {chunk['id']}, SUPABASE ID: {chunk['supabase_id']}]")
    
    context = "\n".join(context_parts)
    prompt = f"Context:\n{context}\n\nQuestion: {query}\nAnswer:"
    
    response = completion_client.chat.completions.create(
        model=COMPLETION_MODEL_NAME,
        messages=[{"role": "user", "content": prompt}],
        max_tokens=200
    )
    return response.choices[0].message.content


EMBEDDING_MODEL = "embed model name"  # Azure OpenAI embedding deployment
# COMPLETION_MODEL = "ychat completion model name (response model)"       # Azure OpenAI completion deployment

QDRANT_HOST = os.getenv("QDRANT_URL")  # e.g., "https://YOUR-QDRANT-URL
QDRANT_API_KEY = os.getenv("QDRANT_API")
COLLECTION = "dragv10_bot"

# Use environment variable for completion model name, fallback to default
COMPLETION_MODEL_NAME = os.getenv("COMPLETION_MODEL_NAME", "gpt-4o-mini")

client = QdrantClient(
    url=QDRANT_HOST,
    api_key=QDRANT_API_KEY
)

