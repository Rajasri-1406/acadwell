# app/api/student.py
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity

student_bp = Blueprint("student", __name__)

# ---------------- EXISTING ROUTE ----------------
# GET student profile by email (sent as query param)
@student_bp.route("/profile", methods=["GET"])
def get_profile():
    email = request.args.get("email")  # frontend must send ?email=...
    if not email:
        return jsonify({"error": "Email is required"}), 400

    student = current_app.db.users.find_one({"email": email}, {"_id": 0, "password": 0})
    if not student:
        return jsonify({"error": "Student not found"}), 404

    return jsonify(student), 200


# ---------------- NEW ROUTE ----------------
# GET student badges / credits
@student_bp.route("/my_badges", methods=["GET"])
@jwt_required()
def get_my_badges():
    student_id = get_jwt_identity()  # get logged-in student's ID

    badges_cursor = current_app.db.badges.find({"userId": student_id})
    badges = []

    for badge in badges_cursor:
        badges.append({
            "id": str(badge.get("_id")),
            "type": badge.get("type", "Unknown"),
            "points": badge.get("points", 0),
            "postId": badge.get("postId"),
            "answerId": badge.get("answerId"),
            "createdAt": badge.get("createdAt")
        })

    return jsonify({"success": True, "badges": badges}), 200
