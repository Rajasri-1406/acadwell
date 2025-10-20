from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
import uuid
from datetime import datetime, timedelta

auth_bp = Blueprint("auth", __name__)

# ----------------------------
# Utility: Find user by email
# ----------------------------
def find_user_by_email(email):
    return current_app.db.users.find_one({"email": email})

# ----------------------------
# Student Registration
# ----------------------------
@auth_bp.route("/register/student", methods=["POST"])
def register_student():
    try:
        data = request.get_json()

        if find_user_by_email(data["email"]):
            return jsonify({"success": False, "message": "Email already registered"}), 400

        student = {
            "id": str(uuid.uuid4()),
            "role": "student",
            "name": data["name"],
            "regNumber": data["regNumber"],
            "email": data["email"],
            "password": generate_password_hash(data["password"]),
            "university": data["university"],
            "year": data["year"],
            "field": data["field"],
            "created_at": datetime.utcnow()
        }

        current_app.db.users.insert_one(student)

        return jsonify({"success": True, "message": "Student registered successfully!"}), 201

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# ----------------------------
# Teacher Registration
# ----------------------------
@auth_bp.route("/register/teacher", methods=["POST"])
def register_teacher():
    try:
        data = request.get_json()

        if find_user_by_email(data["email"]):
            return jsonify({"success": False, "message": "Email already registered"}), 400

        teacher = {
            "id": str(uuid.uuid4()),
            "role": "teacher",
            "name": data["name"],
            "email": data["email"],
            "password": generate_password_hash(data["password"]),
            "university": data["university"],
            "department": data["department"],
            "designation": data["designation"],
            "created_at": datetime.utcnow()
        }

        current_app.db.users.insert_one(teacher)

        return jsonify({"success": True, "message": "Teacher registered successfully!"}), 201

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# ----------------------------
# Login API ✅ FIXED
# ----------------------------
@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        email = data["email"]
        password = data["password"]

        user = find_user_by_email(email)
        if not user or not check_password_hash(user["password"], password):
            return jsonify({"success": False, "message": "Invalid email or password"}), 401

        # ✅ Create JWT token
        access_token = create_access_token(
            identity={
                "id": user["id"],
                "role": user["role"],
                "email": user["email"],
                "field": user.get("field", "")
            },
            expires_delta=timedelta(hours=1)
        )

        # ✅ Return token + user details
        return jsonify({
            "success": True,
            "message": "Login successful",
            "token": access_token,
            "user": {
                "id": user["id"],
                "role": user["role"],
                "email": user["email"],
                "field": user.get("field", "")
            }
        }), 200

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
