# app/models.py
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["acadwell"]

# Collections
users_col = db["users"]
messages_col = db["messages"]
follows_col = db["follows"]   # ✅ add this
grades_col = db["grades"]
connections_col = db["connections"]   # for accepted follows (mutual)
requests_col = db["requests"]         # for pending follow requests
community_col = db["community_posts"]
wellness_moods_col = db["wellness_moods"]
badges_col = db["badges"]
groups_col = db["groups"]
