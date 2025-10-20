from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import check_password_hash, generate_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
import uuid
from datetime import datetime

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


# ✅ Register Student
@auth_bp.route("/register/student", methods=["POST"])
def register_student():
    data = request.get_json()

    name = data.get("name")
    reg_number = data.get("regNumber")   # unique
    email = data.get("email")
    password = data.get("password")
    university = data.get("university")
    year = data.get("year")
    field = data.get("field")

    # Check duplicate reg number or email
    if current_app.db.users.find_one({"regNumber": reg_number}):
        return jsonify({"success": False, "message": "Reg. Number already exists"}), 400

    if current_app.db.users.find_one({"email": email}):
        return jsonify({"success": False, "message": "Email already registered"}), 400

    # Create student object
    student = {
        "id": str(uuid.uuid4()),
        "role": "student",
        "name": name,
        "regNumber": reg_number,
        "email": email,
        "password": generate_password_hash(password),
        "university": university,
        "year": year,
        "field": field,
        "created_at": datetime.utcnow()
    }

    # Save to DB
    current_app.db.users.insert_one(student)

    return jsonify({"success": True, "message": "Student registered successfully"}), 201


# ✅ Login (student & teacher both)
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    user = current_app.db.users.find_one({"email": email})

    if not user or not check_password_hash(user["password"], password):
        return jsonify({"success": False, "message": "Invalid email or password"}), 401

    # ✅ Use regNumber as identity (unique)
    access_token = create_access_token(
        identity=user["regNumber"],
        additional_claims={
            "email": user["email"],
            "role": user["role"]
        }
    )

    return jsonify({
        "success": True,
        "token": access_token,
        "user": {
            "regNumber": user["regNumber"],
            "role": user["role"],
            "name": user["name"],
            "email": user["email"]
        }
    }), 200


# ✅ Profile route (protected)
@auth_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_profile():
    reg_number = get_jwt_identity()  # regNumber is identity
    claims = get_jwt()

    user = current_app.db.users.find_one({"regNumber": reg_number}, {"password": 0})
    if not user:
        return jsonify({"success": False, "message": "User not found"}), 404

    return jsonify({"success": True, "user": user}), 200


# ✅ Update profile (optional)
@auth_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_profile():
    reg_number = get_jwt_identity()
    data = request.get_json()

    update_fields = {k: v for k, v in data.items() if k not in ["_id", "password", "role", "regNumber"]}

    if update_fields:
        current_app.db.users.update_one({"regNumber": reg_number}, {"$set": update_fields})

    user = current_app.db.users.find_one({"regNumber": reg_number}, {"password": 0})
    return jsonify({"success": True, "user": user}), 200
