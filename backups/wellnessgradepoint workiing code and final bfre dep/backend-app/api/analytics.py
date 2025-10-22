# app/api/analytics.py
from flask import Blueprint, jsonify, current_app
from flask_jwt_extended import jwt_required

analytics_bp = Blueprint("analytics", __name__)

@analytics_bp.route("", methods=["GET"])
@jwt_required()
def get_dashboard_analytics():
    try:
        total_students = current_app.db.users.count_documents({"role": "student"})
        total_questions = current_app.db.questions.count_documents({})
        total_groups = current_app.db.groups.count_documents({})
        total_moods = current_app.db.wellness.count_documents({})

        analytics = {
            "students": total_students,
            "questions": total_questions,
            "groups": total_groups,
            "mood_logs": total_moods
        }

        return jsonify({"success": True, "analytics": analytics}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
