from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity

teacher_profile_bp = Blueprint("teacher_profile", __name__, url_prefix="/api/teacher")

# ----------------------------
# Helper: Find teacher by ID
# ----------------------------
def find_user_by_id(user_id):
    try:
        return current_app.db.users.find_one(
            {"id": user_id, "role": "teacher"},
            {"_id": 0, "password": 0}
        )
    except Exception as e:
        print(f"Error finding teacher: {e}")
        return None


# ----------------------------
# Get Teacher Profile
# ----------------------------
@teacher_profile_bp.route("/profile", methods=["GET"])
@jwt_required()
def get_teacher_profile():
    try:
        user_id = get_jwt_identity()
        teacher = find_user_by_id(user_id)

        if not teacher:
            return jsonify({"success": False, "message": "Teacher not found"}), 404

        return jsonify({"success": True, "user": teacher}), 200

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# ----------------------------
# Update Teacher Profile
# ----------------------------
@teacher_profile_bp.route("/profile", methods=["PUT"])
@jwt_required()
def update_teacher_profile():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        if not data:
            return jsonify({"success": False, "message": "No data provided"}), 400

        # ✅ Allow only safe fields to be updated
        restricted_fields = ["_id", "password", "role", "id"]
        safe_fields = {k: v for k, v in data.items() if k not in restricted_fields}

        if not safe_fields:
            return jsonify({"success": False, "message": "No valid fields to update"}), 400

        result = current_app.db.users.update_one(
            {"id": user_id, "role": "teacher"},
            {"$set": safe_fields}
        )

        if result.modified_count == 0:
            return jsonify({"success": False, "message": "No changes made"}), 200

        teacher = find_user_by_id(user_id)
        return jsonify({"success": True, "message": "Profile updated successfully", "user": teacher}), 200

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
