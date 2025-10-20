from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
import uuid
from flask import current_app
from app.__init__ import socketio


groups_bp = Blueprint("groups", __name__)

# ---------- Create Group (Teacher Only) ----------
@groups_bp.route("/create", methods=["POST"])
@jwt_required()
def create_group():
    try:
        data = request.get_json()
        current_user = get_jwt_identity()

        if current_user.get("role") != "teacher":
            return jsonify({"success": False, "message": "Unauthorized"}), 403

        if not data.get("name") or not data.get("subject") or not data.get("description"):
            return jsonify({"success": False, "message": "All fields required"}), 400

        group = {
            "id": str(uuid.uuid4()),
            "name": data["name"],
            "subject": data["subject"],
            "description": data["description"],
            "created_by": current_user["id"],
            "created_at": datetime.utcnow(),
            "studentCount": 0,
            "messages": []
        }

        current_app.db.groups.insert_one(group)
        socketio.emit("group_created", {"group": group}, broadcast=True)

        return jsonify({"success": True, "group": group}), 201

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# ---------- Get Groups ----------
@groups_bp.route("", methods=["GET"])
@jwt_required()
def get_groups():
    try:
        subject = request.args.get("subject")
        query = {"subject": subject} if subject else {}
        groups = list(current_app.db.groups.find(query, {"_id": 0}))
        return jsonify({"success": True, "groups": groups}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
