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
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "your_secret_key")
CORS(app)

# 4. Initialize JWT
jwt = JWTManager(app)

# 5. Initialize SocketIO with Eventlet
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="eventlet")

# 6. MongoDB connection (example using PyMongo)
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/acadwell")
client = MongoClient(MONGO_URI)
db = client.get_default_database()
print("✅ Flask app + MongoDB connected")

# 7. Import routes AFTER app is created
from app import routes  # Make sure your route files are in app/routes.py

# 8. Run the app
if __name__ == "__main__":
    # Use SocketIO's run to support Eventlet
    socketio.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 5000)))
