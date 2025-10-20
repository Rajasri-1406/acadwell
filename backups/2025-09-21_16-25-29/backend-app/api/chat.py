from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
import uuid
from app.models import messages_col
from app.utils.socket_events import socketio
from bson import ObjectId

chat_bp = Blueprint("chat", __name__, url_prefix="/api/chat")

# ------------------- Helper -------------------
def anonymize_user(user):
    """Return anonymized version of a user"""
    return {
        "anon_id": user.get("id", str(uuid.uuid4())),
        "role": user.get("role", "unknown"),
        "name": "Anonymous Student" if user["role"] == "student" else "Anonymous Teacher"
    }

# ------------------- Get Available Users -------------------
@chat_bp.route("/users", methods=["GET"])
@jwt_required()
def get_chat_users():
    db = current_app.db
    current_user_id = get_jwt_identity()

    current_user = db.users.find_one({"id": current_user_id})
    if not current_user:
        return jsonify({"success": False, "message": "User not found"}), 404

    role = current_user.get("role")

    # Students see all teachers; teachers see all students
    if role == "student":
        users = list(db.users.find({"role": "teacher"}))
    elif role == "teacher":
        users = list(db.users.find({"role": "student"}))
    else:
        users = []

    result = [anonymize_user(u) for u in users if u["id"] != current_user_id]
    return jsonify({"success": True, "users": result})

# ------------------- Send Follow Request -------------------
@chat_bp.route("/follow/<target_id>", methods=["POST"])
@jwt_required()
def follow_user(target_id):
    db = current_app.db
    current_user_id = get_jwt_identity()

    if current_user_id == target_id:
        return jsonify({"success": False, "message": "You cannot follow yourself"}), 400

    target_user = db.users.find_one({"id": target_id})
    if not target_user:
        return jsonify({"success": False, "message": "Target user not found"}), 404

    existing = db.follows.find_one({
        "follower_id": current_user_id,
        "followee_id": target_id
    })
    if existing:
        return jsonify({"success": False, "message": "Follow request already exists"}), 400

    follow = {
        "follower_id": current_user_id,
        "followee_id": target_id,
        "status": "pending",
        "created_at": datetime.utcnow()
    }

    db.follows.insert_one(follow)
    return jsonify({"success": True, "message": "Follow request sent"})

# ------------------- Accept Follow Request -------------------
@chat_bp.route("/accept/<follower_id>", methods=["POST"])
@jwt_required()
def accept_follow(follower_id):
    db = current_app.db
    current_user_id = get_jwt_identity()

    follow = db.follows.find_one({
        "follower_id": follower_id,
        "followee_id": current_user_id,
        "status": "pending"
    })

    if not follow:
        return jsonify({"success": False, "message": "No pending request"}), 404

    db.follows.update_one(
        {"_id": follow["_id"]},
        {"$set": {"status": "accepted"}}
    )

    return jsonify({"success": True, "message": "Follow request accepted"})

# ------------------- Get Connections -------------------
@chat_bp.route("/connections", methods=["GET"])
@jwt_required()
def get_connections():
    db = current_app.db
    current_user_id = get_jwt_identity()

    follows = list(db.follows.find({
        "status": "accepted",
        "$or": [
            {"follower_id": current_user_id},
            {"followee_id": current_user_id}
        ]
    }))

    connected_ids = set()
    for f in follows:
        connected_ids.add(f["follower_id"])
        connected_ids.add(f["followee_id"])

    connected_ids.discard(current_user_id)

    users = list(db.users.find({"id": {"$in": list(connected_ids)}}))
    result = [anonymize_user(u) for u in users]

    return jsonify({"success": True, "connections": result})

# ------------------- Get Pending Requests -------------------
@chat_bp.route("/pending", methods=["GET"])
@jwt_required()
def get_pending_requests():
    db = current_app.db
    current_user_id = get_jwt_identity()

    follows = list(db.follows.find({
        "followee_id": current_user_id,
        "status": "pending"
    }))

    follower_ids = [f["follower_id"] for f in follows]
    users = list(db.users.find({"id": {"$in": follower_ids}}))

    result = [anonymize_user(u) for u in users]
    return jsonify({"success": True, "requests": result})

# ------------------- Get Chat History -------------------
@chat_bp.route("/history/<partner_id>", methods=["GET"])
@jwt_required(optional=True)  # allow manual user_id param too
def get_chat_history(partner_id):
    db = current_app.db
    user_id = get_jwt_identity() or request.args.get("user_id")

    if not user_id:
        return jsonify({"success": False, "message": "Missing user_id"}), 400

    msgs = list(
        db.messages.find({
            "$or": [
                {"sender_id": user_id, "receiver_id": partner_id},
                {"sender_id": partner_id, "receiver_id": user_id}
            ]
        }).sort("timestamp", 1)
    )

    for m in msgs:
        m["_id"] = str(m["_id"])
        if isinstance(m.get("timestamp"), datetime):
            m["timestamp"] = m["timestamp"].isoformat()

    return jsonify({"success": True, "messages": msgs})

# ------------------- Send Message + Socket -------------------

@chat_bp.route("/send", methods=["POST"])
@jwt_required()
def send_message():
    db = current_app.db
    data = request.json
    sender_id = get_jwt_identity()
    receiver_id = data.get("receiver_id")
    text = data.get("text")

    if not receiver_id or not text:
        return jsonify({"success": False, "msg": "Missing fields"}), 400

    msg = {
        "sender_id": sender_id,
        "receiver_id": receiver_id,
        "text": text,
        "timestamp": datetime.utcnow().isoformat()
    }

    # ✅ Save in MongoDB
    db.messages.insert_one(msg)

    # ✅ Emit real-time message to both users
    socketio.emit("receive_message", msg, room=receiver_id)
    socketio.emit("receive_message", msg, room=sender_id)

    return jsonify({"success": True, "msg": "Message sent", "message": msg})


# ✅ Fetch messages between two users
@chat_bp.route("/messages/<receiver_id>", methods=["GET"])
@jwt_required()
def get_messages(receiver_id):
    db = current_app.db
    sender_id = get_jwt_identity()
    msgs = list(
        db.messages.find(
            {
                "$or": [
                    {"sender_id": sender_id, "receiver_id": receiver_id},
                    {"sender_id": receiver_id, "receiver_id": sender_id},
                ]
            }
        ).sort("timestamp", 1)
    )

    # Convert ObjectId → str
    for m in msgs:
        m["_id"] = str(m["_id"])
        if isinstance(m.get("timestamp"), datetime):
            m["timestamp"] = m["timestamp"].isoformat()

    return jsonify({"success": True, "messages": msgs})
