from app import create_app, mongo
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

app = create_app()

with app.app_context():
    print("Collections in MongoDB:", mongo.db.list_collection_names())
