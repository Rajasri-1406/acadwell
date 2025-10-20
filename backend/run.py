# run.py

# 1. Eventlet monkey patch MUST come first
import eventlet
eventlet.monkey_patch()

# 2. Import standard modules after monkey patch
from flask import Flask
from flask_cors import CORS
from flask_socketio import SocketIO
from flask_jwt_extended import JWTManager
from pymongo import MongoClient
import os

# 3. Initialize Flask app
app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "your-super-secret-key")

# Enable CORS (allow origins from .env or default to all)
cors_origins = os.getenv("CORS_ORIGINS", "*")
CORS(app, origins=cors_origins)

# 4. Initialize JWT
jwt = JWTManager(app)

# 5. Initialize SocketIO with Eventlet
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="eventlet")

# 6. MongoDB connection
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/acadwell")
client = MongoClient(MONGO_URI)

# Since your URI now includes a default DB (acadwell), get_default_database() works
db = client.get_default_database()
print("✅ Flask app + MongoDB connected")

# 7. Import routes AFTER app is created
from app import routes  # Make sure your routes are in app/routes.py

# 8. Run the app
if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))  # Use Render port if provided
    socketio.run(app, host="0.0.0.0", port=port)
