from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_socketio import SocketIO

# Extensions
mongo = PyMongo()
jwt = JWTManager()
socketio = SocketIO(cors_allowed_origins="*")   # ✅ allow frontend (React) to connect

def create_app():
    app = Flask(__name__)
    app.config["MONGO_URI"] = "mongodb://localhost:27017/acadwell"
    app.config["JWT_SECRET_KEY"] = "your_secret_key"

    # Initialize extensions
    mongo.init_app(app)
    jwt.init_app(app)
    socketio.init_app(app, cors_allowed_origins="*")   # ✅ important for React

    # Attach DB reference
    app.db = mongo.db

    # Enable CORS for all routes (fixes preflight errors)
    CORS(app, resources={r"/*": {"origins": "*"}})

    # Register blueprints
    from .api.auth import auth_bp
    from .api.groups import groups_bp
    from .api.student import student_bp
    from .chat import register_chat

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(groups_bp, url_prefix="/api/groups")
    app.register_blueprint(student_bp, url_prefix="/api/student")

    # SocketIO chat handlers
    register_chat(socketio)

    print("✅ Flask app + MongoDB connected")
    return app
