# app/api/wellness.py
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
import uuid

wellness_bp = Blueprint("wellness", __name__)

# ================================
# SAVE MOOD
# ================================
@wellness_bp.route("/mood", methods=["POST"])
@jwt_required()
def save_mood():
    try:
        data = request.get_json()
        user = get_jwt_identity()

        mood_entry = {
            "id": str(uuid.uuid4()),
            "user_id": user["id"],
            "mood": data["mood"],
            "created_at": datetime.utcnow()
        }

        current_app.db.wellness.insert_one(mood_entry)
        return jsonify({"success": True, "message": "Mood saved successfully!"}), 201
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# ================================
# GET WELLNESS ANALYTICS
# ================================
@wellness_bp.route("/analytics", methods=["GET"])
@jwt_required()
def get_analytics():
    try:
        user = get_jwt_identity()
        mood_logs = list(current_app.db.wellness.find(
            {"user_id": user["id"]}, {"_id": 0}
        ))

        total_logs = len(mood_logs)
        happy_count = len([m for m in mood_logs if m["mood"] == "happy"])
        neutral_count = len([m for m in mood_logs if m["mood"] == "neutral"])
        sad_count = len([m for m in mood_logs if m["mood"] == "sad"])

        analytics = {
            "total_logs": total_logs,
            "happy": happy_count,
            "neutral": neutral_count,
            "sad": sad_count
        }

        return jsonify({"success": True, "analytics": analytics}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
