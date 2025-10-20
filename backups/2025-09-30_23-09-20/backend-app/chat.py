from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
import uuid
from backend.app.socket_events import socketio

chat_bp = Blueprint("chat", __name__, url_prefix="/api/chat")


# ----------------------------
# Suggest Users (like Instagram)
# ----------------------------
@chat_bp.route("/suggestions", methods=["GET"])
@jwt_required()
def suggestions():
    db = current_app.db
    current_user_id = get_jwt_identity()
    current_user = db.users.find_one({"id": current_user_id})

    if not current_user:
        return jsonify({"success": False, "message": "User not found"}), 404

    role = current_user.get("role")

    # Students see teachers, teachers see students
    opposite_role = "teacher" if role == "student" else "student"
    users = list(db.users.find({"role": opposite_role}, {"_id": 0, "password": 0}))

    # Remove already connected users
    follows = db.follows.find({"follower_id": current_user_id})
    followed_ids = [f["followee_id"] for f in follows]
    users = [u for u in users if u["id"] not in followed_ids]

    return jsonify({"success": True, "users": users})


# ----------------------------
# Send Follow Request
# ----------------------------
@chat_bp.route("/follow/<target_id>", methods=["POST"])
@jwt_required()
def follow_user(target_id):
    db = current_app.db
    current_user_id = get_jwt_identity()

    if current_user_id == target_id:
        return jsonify({"success": False, "message": "You cannot follow yourself"}), 400

    # Check duplicate
    existing = db.follows.find_one({
        "follower_id": current_user_id,
        "followee_id": target_id
    })
    if existing:
        return jsonify({"success": False, "message": "Request already exists"}), 400

    follow = {
        "_id": str(uuid.uuid4()),
        "follower_id": current_user_id,
        "followee_id": target_id,
        "status": "pending",
        "created_at": datetime.utcnow()
    }
    db.follows.insert_one(follow)

    return jsonify({"success": True, "message": "Follow request sent"})


# ----------------------------
# Accept Follow Request
# ----------------------------
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
        {"$set": {"status": "accepted", "updated_at": datetime.utcnow()}}
    )

    return jsonify({"success": True, "message": "Follow request accepted"})


# ----------------------------
# Get Connections
# ----------------------------
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

    connected_ids = {f["follower_id"] for f in follows} | {f["followee_id"] for f in follows}
    connected_ids.discard(current_user_id)

    users = list(db.users.find({"id": {"$in": list(connected_ids)}}, {"_id": 0, "password": 0}))

    return jsonify({"success": True, "connections": users})


# ----------------------------
# Get Pending Requests
# ----------------------------
@chat_bp.route("/pending", methods=["GET"])
@jwt_required()
def pending_requests():
    db = current_app.db
    current_user_id = get_jwt_identity()

    follows = list(db.follows.find({
        "followee_id": current_user_id,
        "status": "pending"
    }))

    follower_ids = [f["follower_id"] for f in follows]
    users = list(db.users.find({"id": {"$in": follower_ids}}, {"_id": 0, "password": 0}))

    return jsonify({"success": True, "requests": users})


# ----------------------------
# Send Message
# ----------------------------
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
        "_id": str(uuid.uuid4()),
        "sender_id": sender_id,
        "receiver_id": receiver_id,
        "text": text,
        "timestamp": datetime.utcnow().isoformat()
    }

    db.messages.insert_one(msg)

    # Emit via WebSocket to both
    socketio.emit("receive_message", msg, room=receiver_id)
    socketio.emit("receive_message", msg, room=sender_id)

    return jsonify({"success": True, "message": msg})


# ----------------------------
# Get Chat History
# ----------------------------
@chat_bp.route("/history/<partner_id>", methods=["GET"])
@jwt_required()
def get_chat_history(partner_id):
    db = current_app.db
    current_user_id = get_jwt_identity()

    msgs = list(db.messages.find({
        "$or": [
            {"sender_id": current_user_id, "receiver_id": partner_id},
            {"sender_id": partner_id, "receiver_id": current_user_id}
        ]
    }).sort("timestamp", 1))

    for m in msgs:
        m["_id"] = str(m["_id"])

    return jsonify({"success": True, "messages": msgs})
