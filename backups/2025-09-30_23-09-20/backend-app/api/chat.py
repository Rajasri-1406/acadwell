# app/api/chat.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import messages_col

chat_bp = Blueprint("chat", __name__, url_prefix="/api/chat")


# ---------------- Send message ----------------
@chat_bp.route("/send", methods=["POST"])
@jwt_required()
def send_message():
    data = request.json
    sender_id = get_jwt_identity()
    receiver_id = data.get("receiver_id")
    text = data.get("text")

    if not text or not receiver_id:
        return jsonify({"success": False, "message": "Missing data"}), 400

    msg = {
        "sender_id": sender_id,
        "receiver_id": receiver_id,
        "text": text,
        "timestamp": datetime.utcnow()
    }
    messages_col.insert_one(msg)
    return jsonify({"success": True, "message": "Message sent"})


# ---------------- Get chat messages ----------------
@chat_bp.route("/messages/<other_id>", methods=["GET"])
@jwt_required()
def get_messages(other_id):
    current_user_id = get_jwt_identity()
    msgs = list(messages_col.find({
        "$or": [
            {"sender_id": current_user_id, "receiver_id": other_id},
            {"sender_id": other_id, "receiver_id": current_user_id}
        ]
    }).sort("timestamp", 1))

    result = []
    for m in msgs:
        result.append({
            "sender_id": m["sender_id"],
            "receiver_id": m["receiver_id"],
            "text": m["text"],
            "timestamp": m["timestamp"]
        })

    return jsonify({"success": True, "messages": result})
