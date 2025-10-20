from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from pymongo import MongoClient
from datetime import datetime
import os
from dotenv import load_dotenv
from app.api.messages import messages_bp


load_dotenv()

def create_app():
    app = Flask(__name__)
    
    # Configuration
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'dev-secret')
    app.config['MONGO_URI'] = os.getenv('MONGO_URI', 'mongodb://localhost:27017/acadwell')
    
    # Initialize extensions
    CORS(app, origins=os.getenv('CORS_ORIGINS', 'http://localhost:3000').split(','))
    jwt = JWTManager(app)
    
    # Database connection with error handling
    try:
        client = MongoClient(app.config['MONGO_URI'], serverSelectionTimeoutMS=5000)
        client.server_info()  # Test connection
        app.db = client.acadwell
        print("✅ MongoDB connected successfully!")
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        app.db = None
    
    # Register blueprints
    from app.api.auth import auth_bp
    from app.api.questions import questions_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(questions_bp, url_prefix='/api/questions')
    app.register_blueprint(messages_bp, url_prefix='/api/messages')

    
    # Health check endpoint
    @app.route('/health')
    def health_check():
        try:
            if app.db is not None:
                # Actually ping MongoDB to confirm it's alive
                app.db.command('ping')
                db_status = "connected"
            else:
                db_status = "disconnected"
        except Exception:
            db_status = "disconnected"

        return jsonify({
            'status': 'healthy',
            'service': 'acadwell-api',
            'database': db_status,
            'timestamp': str(datetime.now())
        })
    
    # Test endpoint
    @app.route('/api/test')
    def test_endpoint():
        return jsonify({'message': 'Backend is working!', 'timestamp': str(datetime.now())})
    
    return app
