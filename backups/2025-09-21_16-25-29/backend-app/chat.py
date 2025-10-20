from flask import Blueprint, request, jsonify, current_app
from datetime import datetime

chat_bp = Blueprint("chat", __name__)

# ---------------- Routes ----------------

# ✅ Send message (only if connection accepted)
@chat_bp.route("/send", methods=["POST"])
def send_message():
    data = request.json
    from_id = data.get("from_id")
    to_id = data.get("to_id")
    message = data.get("message")

    if not from_id or not to_id or not message:
        return jsonify({"error": "from_id, to_id, message required"}), 400

    db = current_app.db

    # Ensure connection exists and accepted
    connection = db.follows.find_one({
        "$or": [
            {"from_id": from_id, "to_id": to_id},
            {"from_id": to_id, "to_id": from_id}
        ],
        "status": "accepted"
    })

    if not connection:
        return jsonify({"error": "Follow request not accepted"}), 403

    chat_doc = {
        "from_id": from_id,
        "to_id": to_id,
        "message": message,
        "timestamp": datetime.utcnow()
    }
    db.messages.insert_one(chat_doc)

    return jsonify({"message": "Message sent"}), 201


# ✅ Get chat history between two users
@chat_bp.route("/history/<user1>/<user2>", methods=["GET"])
def get_chat_history(user1, user2):
    db = current_app.db

    messages = list(db.messages.find({
        "$or": [
            {"from_id": user1, "to_id": user2},
            {"from_id": user2, "to_id": user1}
        ]
    }).sort("timestamp", 1))

    # Convert ObjectId + datetime
    for m in messages:
        m["_id"] = str(m["_id"])
        if "timestamp" in m:
            m["timestamp"] = m["timestamp"].isoformat()

    return jsonify(messages), 200
