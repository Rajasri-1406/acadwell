# app/api/wellness.py
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from app.models import messages_col, wellness_moods_col, users_col, groups_col, community_col
from pymongo.errors import PyMongoError

wellness_bp = Blueprint("wellness", __name__, url_prefix="/api/wellness")


# ---------------- HELPER FUNCTIONS ----------------
def calculate_peer_sessions(user_id):
    """Count how many unique peers a student has connections with."""
    try:
        connections = list(current_app.db.connections.find({"studentId": user_id}))
        return len(connections)
    except PyMongoError:
        return 0


def calculate_peer_contributions(user_id):
    """Count how many answers the student has provided to others' questions."""
    try:
        answers = list(current_app.db.answers.find({"answeredBy": user_id}))
        contribution_count = 0
        for ans in answers:
            question = current_app.db.questions.find_one({"_id": ans.get("questionId")})
            if question and question.get("askedBy") != user_id:
                contribution_count += 1
        return contribution_count
    except PyMongoError:
        return 0


# ------------------------------------------------------------
# 1️⃣ SAVE MOOD
# ------------------------------------------------------------
@wellness_bp.route("/mood", methods=["POST"])
@jwt_required()
def save_mood():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()
        mood = data.get("mood")

        if not mood:
            return jsonify({"success": False, "message": "Mood is required"}), 400

        record = {
            "userId": user_id,
            "mood": mood,
            "date": datetime.utcnow().strftime("%Y-%m-%d"),
            "time": datetime.utcnow().strftime("%H:%M:%S"),
            "createdAt": datetime.utcnow(),
        }

        wellness_moods_col.insert_one(record)
        return jsonify({"success": True, "message": "Mood saved successfully"}), 201
    except PyMongoError as e:
        current_app.logger.error(f"Error saving mood: {e}")
        return jsonify({"success": False, "message": "Database error"}), 500


# ------------------------------------------------------------
# 2️⃣ GET MOOD HISTORY
# ------------------------------------------------------------
@wellness_bp.route("/history", methods=["GET"])
@jwt_required()
def get_mood_history():
    try:
        user_id = get_jwt_identity()
        moods = wellness_moods_col.find({"userId": user_id}).sort("createdAt", -1).limit(30)
        history = [
            {
                "_id": str(m["_id"]),
                "mood": m.get("mood"),
                "date": m.get("date"),
                "time": m.get("time"),
            }
            for m in moods
        ]
        return jsonify({"success": True, "history": history}), 200
    except PyMongoError as e:
        current_app.logger.error(f"Error fetching mood history: {e}")
        return jsonify({"success": False, "message": "Database error"}), 500


# ------------------------------------------------------------
# 3️⃣ DASHBOARD SUMMARY
# ------------------------------------------------------------
@wellness_bp.route("/summary", methods=["GET"])
@jwt_required()
def wellness_summary():
    try:
        user_id = get_jwt_identity()

        messages = list(messages_col.find({"sender_id": user_id}, {"_id": 0, "timestamp": 1}))
        if not messages:
            return jsonify({
                "success": True,
                "peerSessions": 0,
                "peerContributions": 0,
                "wellnessStreak": 0
            }), 200

        dates = sorted({msg["timestamp"].date() for msg in messages}, reverse=True)

        streak = 1
        for i in range(1, len(dates)):
            delta = (dates[i-1] - dates[i]).days
            if delta == 1:
                streak += 1
            else:
                break

        peer_sessions = len(dates)
        peer_contributions = len(messages)

        return jsonify({
            "success": True,
            "peerSessions": peer_sessions,
            "peerContributions": peer_contributions,
            "wellnessStreak": streak
        }), 200
    except PyMongoError as e:
        current_app.logger.error(f"Error fetching wellness summary: {e}")
        return jsonify({"success": False, "message": "Database error"}), 500


# ------------------------------------------------------------
# 4️⃣ CORRELATION ANALYTICS
# ------------------------------------------------------------
@wellness_bp.route("/correlation", methods=["GET"])
@jwt_required()
def get_correlation():
    try:
        user_id = get_jwt_identity()

        total_groups = groups_col.count_documents({})
        joined_groups = groups_col.count_documents({"members": {"$in": [user_id]}})
        messages_sent = messages_col.count_documents({"sender_id": user_id, "type": "group"})

        study_group_activity = min(100, ((joined_groups + messages_sent) / max(total_groups, 1)) * 50)

        badges_given = list(
            users_col.aggregate([
                {"$unwind": "$peerBadges"},
                {"$match": {"peerBadges.givenBy": user_id}}
            ])
        )
        peer_help_given = min(100, len(badges_given) * 10)

        posts = community_col.find({"userId": user_id})
        total_posts, total_answers = 0, 0
        for p in posts:
            total_posts += 1
            total_answers += len(p.get("answers", []))
        answers_received = min(100, (total_answers / total_posts) * 100) if total_posts else 0

        total_private_msgs = messages_col.count_documents({"sender_id": user_id, "type": "private"})
        msgs_to_connections = messages_col.count_documents(
            {"sender_id": user_id, "type": "private", "isConnection": True}
        )
        anonymous_discussions = (
            min(100, (msgs_to_connections / total_private_msgs) * 100)
            if total_private_msgs else 0
        )

        correlation = [
            {"activity": "Study Group Activity", "impact": round(study_group_activity, 2)},
            {"activity": "Peer Help Given", "impact": round(peer_help_given, 2)},
            {"activity": "Answers Received", "impact": round(answers_received, 2)},
            {"activity": "Anonymous Discussions", "impact": round(anonymous_discussions, 2)},
        ]

        return jsonify({"success": True, "correlation": correlation}), 200
    except PyMongoError as e:
        current_app.logger.error(f"Error fetching correlation analytics: {e}")
        return jsonify({"success": False, "message": "Database error"}), 500
