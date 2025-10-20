from flask import Blueprint, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity

teacher_profile_bp = Blueprint("teacher_profile", __name__)

def find_user_by_id(user_id):
    return current_app.db.users.find_one({"id": user_id, "role": "teacher"}, {"password": 0})

@teacher_profile_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_teacher_profile():
    user_id = get_jwt_identity()
    teacher = find_user_by_id(user_id)
    if not teacher:
        return jsonify({"success": False, "message": "Teacher not found"}), 404
    return jsonify({"success": True, "user": teacher}), 200

@teacher_profile_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_teacher_profile():
    user_id = get_jwt_identity()
    data = request.get_json()
    safe_fields = {k: v for k, v in data.items() if k not in ["_id", "password", "role", "id"]}
    if safe_fields:
        current_app.db.users.update_one({"id": user_id, "role": "teacher"}, {"$set": safe_fields})
    teacher = find_user_by_id(user_id)
    return jsonify({"success": True, "user": teacher}), 200
