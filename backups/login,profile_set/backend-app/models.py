# app/models.py
from pymongo import MongoClient

# MongoDB connection (adjust URI if needed)
client = MongoClient("mongodb://localhost:27017/")
db = client["acadwell"]

# Collections
users_col = db["users"]
messages_col = db["messages"]
