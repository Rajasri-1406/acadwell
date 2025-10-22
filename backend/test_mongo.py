from pymongo import MongoClient

# --- STEP 1: Connect to your local MongoDB ---
local_client = MongoClient("mongodb://localhost:27017/")  # default local URI
local_db = local_client["acadwell"]  # your local DB name

# --- STEP 2: Connect to MongoDB Atlas ---
atlas_uri = "mongodb+srv://rajasri_db_user:rajasri14@cluster0.gxcgqpi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"  # replace with your Atlas connection string
atlas_client = MongoClient(atlas_uri)
atlas_db = atlas_client["acadwell"]  # target DB name in Atlas

# --- STEP 3: Copy collections ---
for collection_name in local_db.list_collection_names():
    print(f"Migrating collection: {collection_name}")
    local_collection = local_db[collection_name]
    atlas_collection = atlas_db[collection_name]

    # Fetch all documents from local
    docs = list(local_collection.find())
    
    if docs:
        atlas_collection.insert_many(docs)
        print(f"Inserted {len(docs)} documents into {collection_name} in Atlas")
    else:
        print(f"No documents found in {collection_name}")

print("\nMigration complete!")
print("Collections in Atlas DB:", atlas_db.list_collection_names())
