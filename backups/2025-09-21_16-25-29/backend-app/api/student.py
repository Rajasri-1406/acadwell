# app/api/student.py
from flask import Blueprint, request, jsonify
from app.models import users_col

student_bp = Blueprint("student", __name__)

# GET student profile by email (sent as query param)
@student_bp.route("/profile", methods=["GET"])
def get_profile():
    email = request.args.get("email")  # frontend must send ?email=...
    if not email:
        return jsonify({"error": "Email is required"}), 400

    student = users_col.find_one({"email": email}, {"_id": 0})
    if not student:
        return jsonify({"error": "Student not found"}), 404

    return jsonify(student), 200
