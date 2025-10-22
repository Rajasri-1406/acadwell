# app/models.py
import os
from pymongo import MongoClient

# ------------------ MONGODB CONNECTION ------------------
# Local fallback URI (for development)
LOCAL_URI = "mongodb://localhost:27017/"

# Production URI from environment variable (Render / Atlas)
MONGO_URI = os.getenv("MONGO_URI", LOCAL_URI)

try:
    client = MongoClient(MONGO_URI)
    db = client["acadwell"]
    print(f"[MongoDB] Connected to: {MONGO_URI}")
except Exception as e:
    print(f"[MongoDB] Connection failed: {e}")
    raise

# ------------------ COLLECTIONS ------------------
users_col = db["users"]
messages_col = db["messages"]
follows_col = db["follows"]            # accepted follows
grades_col = db["grades"]
connections_col = db["connections"]    # mutual connections
requests_col = db["requests"]          # pending follow requests
community_col = db["community_posts"]
wellness_moods_col = db["wellness_moods"]
badges_col = db["badges"]
groups_col = db["groups"]

# ------------------ HELPER ------------------
def check_connection():
    """Optional: test connection"""
    try:
        client.admin.command("ping")
        print("[MongoDB] Ping successful")
        return True
    except Exception as e:
        print(f"[MongoDB] Ping failed: {e}")
        return False
