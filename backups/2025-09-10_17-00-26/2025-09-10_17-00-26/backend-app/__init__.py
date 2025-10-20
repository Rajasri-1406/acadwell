from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO
from pymongo import MongoClient
import os

socketio = SocketIO(cors_allowed_origins="*")  # ✅ Initialize globally

def create_app():
    app = Flask(__name__)

    # ✅ CORS for frontend (React at :3000)
    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

    # ✅ JWT Configuration
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "acadwell_secret_key")
    JWTManager(app)

    # ✅ MongoDB Connection
    try:
        client = MongoClient("mongodb://localhost:27017/")
        app.db = client["acadwell"]
        print("✅ Connected to MongoDB successfully")
    except Exception as e:
        print("❌ MongoDB connection failed:", str(e))
        raise e

    # ✅ Register all API routes
    from app.api import api_bp
    app.register_blueprint(api_bp, url_prefix="/api")

    # ✅ Initialize SocketIO
    socketio.init_app(app)

    # ✅ Import socket events **AFTER** initializing socketio
    from app import socket_events  # 🔄 FIXES circular import

    return app
