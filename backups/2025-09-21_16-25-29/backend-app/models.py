# app/models.py
from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["acadwell"]

# Collections
users_col = db["users"]
messages_col = db["messages"]
follows_col = db["follows"]   # ✅ add this
