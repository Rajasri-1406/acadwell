from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

wellness_bp = Blueprint("wellness", __name__)
# ---------------- HELPER FUNCTIONS ----------------
def calculate_peer_sessions(student_id):
    """
    Count how many unique peers a student has connections with.
    """
    connections = list(current_app.db.connections.find({"studentId": student_id}))
    return len(connections)

def calculate_peer_contributions(student_id):
    """
    Count how many answers the student has provided to others' questions.
    """
    # Find answers given by student
    answers = list(current_app.db.answers.find({"answeredBy": student_id}))
    contribution_count = 0
    for ans in answers:
        # Check if question asked by others
        question = current_app.db.questions.find_one({"_id": ans.get("questionId")})
        if question and question.get("askedBy") != student_id:
            contribution_count += 1
    return contribution_count
# ------------------------------------------------------------
# 1️⃣ SAVE MOOD
# ------------------------------------------------------------
@wellness_bp.route("/mood", methods=["POST"])
@jwt_required()
def save_mood():
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

    current_app.db.wellness_moods.insert_one(record)
    return jsonify({"success": True, "message": "Mood saved successfully"}), 201


# ------------------------------------------------------------
# 2️⃣ GET MOOD HISTORY
# ------------------------------------------------------------
@wellness_bp.route("/history", methods=["GET"])
@jwt_required()
def get_mood_history():
    user_id = get_jwt_identity()
    moods = (
        current_app.db.wellness_moods.find({"userId": user_id})
        .sort("createdAt", -1)
        .limit(30)
    )
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


# ------------------------------------------------------------
# 3️⃣ DASHBOARD SUMMARY
# ------------------------------------------------------------
@wellness_bp.route("/summary", methods=["GET"])
@jwt_required()
def get_wellness_summary():
    user_id = get_jwt_identity()
    db = current_app.db

    # 🎓 Average grade & subject performance
    grades = list(db.grades.find({"userId": user_id}))
    subject_performance = []
    total_scores = []

    for g in grades:
        subject = g.get("subject", "Unknown")
        score = g.get("score") or g.get("marks") or 0
        subject_performance.append({"subject": subject, "score": score})
        total_scores.append(score)

    avg_grade = round(sum(total_scores) / len(total_scores), 2) if total_scores else 0

    # 💆 Wellness score (today)
    today = datetime.utcnow().strftime("%Y-%m-%d")
    today_moods = list(db.wellness_moods.find({"userId": user_id, "date": today}))
    mood_map = {"happy": 9, "neutral": 5, "sad": 2}
    wellness_score = (
        round(sum(mood_map.get(m["mood"], 0) for m in today_moods) / len(today_moods), 2)
        if today_moods else 0
    )

    # 👥 Peer Sessions (unique connections with messages)
    group_msgs = db.messages.distinct("receiverId", {"senderId": user_id, "type": "group"})
    private_msgs = db.messages.distinct("receiverId", {"senderId": user_id, "type": "private"})
    peer_sessions = len(set(group_msgs + private_msgs))

    # 💬 Peer Contributions (credits from posts + badges given)
    contributions = 0
    # 1️⃣ Community posts answers
    posts = db.community_posts.find({"answers.userId": user_id})
    for p in posts:
        for ans in p.get("answers", []):
            if ans.get("userId") == user_id:
                contributions += ans.get("creditPoints", 1)
    # 2️⃣ Badges given to peers
    badges_given = list(
        db.users.aggregate([
            {"$unwind": "$peerBadges"},
            {"$match": {"peerBadges.givenBy": user_id}}
        ])
    )
    contributions += len(badges_given)  # each badge counts as 1 point
    peer_contributions = contributions

    # 📈 Mood history (last 7 records)
    recent_moods = db.wellness_moods.find({"userId": user_id}).sort("createdAt", -1).limit(7)
    mood_history = [
        {"date": m.get("date"), "mood": m.get("mood"), "value": mood_map.get(m.get("mood"), 0)}
        for m in recent_moods
    ]

    return jsonify({
        "success": True,
        "averageGrade": avg_grade,
        "wellnessScore": wellness_score,
        "peerSessions": peer_sessions,
        "peerContributions": peer_contributions,
        "subjectPerformance": subject_performance,
        "moodHistory": list(reversed(mood_history)),  # chronological order
    }), 200


# ------------------------------------------------------------
# 4️⃣ CORRELATION ANALYTICS
# ------------------------------------------------------------
@wellness_bp.route("/correlation", methods=["GET"])
@jwt_required()
def get_correlation():
    user_id = get_jwt_identity()
    db = current_app.db

    total_groups = db.groups.count_documents({})
    joined_groups = db.groups.count_documents({"members": {"$in": [user_id]}})
    messages_sent = db.messages.count_documents({"senderId": user_id, "type": "group"})

    study_group_activity = min(100, ((joined_groups + messages_sent) / max(total_groups, 1)) * 50)

    badges_given = list(
        db.users.aggregate([
            {"$unwind": "$peerBadges"},
            {"$match": {"peerBadges.givenBy": user_id}}
        ])
    )
    peer_help_given = min(100, len(badges_given) * 10)

    posts = db.community_posts.find({"userId": user_id})
    total_posts, total_answers = 0, 0
    for p in posts:
        total_posts += 1
        total_answers += len(p.get("answers", []))
    answers_received = min(100, (total_answers / total_posts) * 100) if total_posts else 0

    total_private_msgs = db.messages.count_documents({"senderId": user_id, "type": "private"})
    msgs_to_connections = db.messages.count_documents(
        {"senderId": user_id, "type": "private", "isConnection": True}
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
