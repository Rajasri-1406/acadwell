# backend/app/api/auth.py
from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from datetime import datetime, timedelta
import uuid
from flask_jwt_extended import jwt_required, get_jwt_identity

auth_bp = Blueprint('auth', __name__)

# 🔹 Register a new student
@auth_bp.route('/register/student', methods=['POST'])
def register_student():
    data = request.get_json()
    required_fields = ["name", "regNumber", "email", "password", "university", "year", "field"]

    # Validate all fields exist
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    db = current_app.db
    users = db.users

    # Check if email already exists
    if users.find_one({"email": data["email"]}):
        return jsonify({"error": "Email already registered"}), 400

    # Hash password
    hashed_pw = generate_password_hash(data["password"])

    # Create user record
    user_id = str(uuid.uuid4())  # Generate user_id
    new_user = {
        "user_id": user_id,  # Ensure it's a string
        "role": "student",
        "name": data["name"],
        "regNumber": data["regNumber"],
        "email": data["email"],
        "password": hashed_pw,
        "university": data["university"],
        "year": data["year"],
        "field": data["field"],
        "created_at": datetime.utcnow()
    }

    # 🚫 DO NOT insert anonymous_id unless explicitly passed
    if data.get("anonymous_id"):
        new_user["anonymous_id"] = data["anonymous_id"]

    users.insert_one(new_user)

    return jsonify({"message": "Student registered successfully!", "user_id": user_id}), 201


# 🔹 Login for all users
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    db = current_app.db
    user = db.users.find_one({"email": email})

    if not user or not check_password_hash(user["password"], password):
        return jsonify({"error": "Invalid email or password"}), 401

    # Ensure user_id is a string
    user_id = str(user["user_id"])
    
    # Debug logging
    print(f"🔐 Login successful for user: {user_id} ({user['name']})")
    print(f"🔐 User data: role={user['role']}, email={user['email']}")

    # Generate JWT token with user_id as string
    access_token = create_access_token(
        identity=user_id,  # This should be a string
        additional_claims={"role": user["role"]},
        expires_delta=timedelta(hours=2)
    )

    response_data = {
        "message": "Login successful",
        "token": access_token,
        "role": user["role"],
        "name": user["name"],
        "user_id": user_id,  # 👈 Ensure this is always a string
        "email": user["email"]
    }
    
    print(f"🔐 Login response: {response_data}")
    
    return jsonify(response_data), 200


@auth_bp.route('/users', methods=['GET'])
@jwt_required()
def list_users():
    current_user_id = get_jwt_identity()
    print(f"👥 Listing users, current user: {current_user_id}")
    
    db = current_app.db
    users = db.users.find({}, {"password": 0})  # exclude passwords

    user_list = []
    for user in users:
        user_id = str(user["user_id"])  # Ensure string
        if user_id != str(current_user_id):  # exclude self
            user_list.append({
                "user_id": user_id,
                "name": user["name"],
                "role": user["role"],
                "email": user["email"]
            })

    return jsonify({"users": user_list}), 200


# 🔹 Get current user info (useful for debugging)
@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    current_user_id = get_jwt_identity()
    db = current_app.db
    user = db.users.find_one({"user_id": current_user_id}, {"password": 0})
    
    if not user:
        return jsonify({"error": "User not found"}), 404
    
    return jsonify({
        "user_id": str(user["user_id"]),
        "name": user["name"],
        "role": user["role"],
        "email": user["email"]
    }), 200