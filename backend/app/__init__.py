# app/__init__.py
import os
from dotenv import load_dotenv
from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO

# ---------------- Load environment variables ----------------
load_dotenv()  # loads .env file if present

# ---------------- Extensions ----------------
mongo = PyMongo()
jwt = JWTManager()
socketio = SocketIO(cors_allowed_origins="*")  # Allow frontend React app

def create_app():
    app = Flask(__name__)

    # ---------------- Config ----------------
    app.config["MONGO_URI"] = os.getenv("MONGO_URI", "mongodb://localhost:27017/acadwell")
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "your_secret_key")

    # ---------------- Initialize Extensions ----------------
    mongo.init_app(app)
    jwt.init_app(app)
    socketio.init_app(app, cors_allowed_origins="*")

    # Attach DB reference for convenience
    app.db = mongo.db

    # Enable CORS for all routes, allow frontend origin
    CORS(app, resources={r"/*": {"origins": os.getenv("CORS_ORIGINS", "*")}})

    # ---------------- Import Blueprints ----------------
    from .api.auth import auth_bp
    from .api.groups import groups_bp
    from .api.student import student_bp
    from .api.users import users_bp
    from .api.chat import chat_bp
    from .api.grades import students_bp, teacher_bp  # grades-related routes
    from .api.teacher import teacher_profile_bp
    from .api.community import community_bp
    from .api.wellness import wellness_bp

    # ---------------- Register Blueprints ----------------
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(groups_bp, url_prefix="/api/groups")
    app.register_blueprint(student_bp, url_prefix="/api/student")
    app.register_blueprint(users_bp, url_prefix="/api/users")
    app.register_blueprint(chat_bp, url_prefix="/api/chat")
    app.register_blueprint(students_bp, url_prefix="/api/student")
    app.register_blueprint(teacher_bp, url_prefix="/api/teacher")
    app.register_blueprint(teacher_profile_bp, url_prefix="/api/teacher")
    app.register_blueprint(community_bp, url_prefix="/api/community")
    app.register_blueprint(wellness_bp, url_prefix="/api/wellness")

    print("✅ Flask app + MongoDB connected")
    return app
