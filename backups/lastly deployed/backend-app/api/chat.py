from flask import Blueprint, jsonify, request, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

chat_bp = Blueprint("chat", __name__, url_prefix="/api/chat")


def serialize_user(user):
    """Convert MongoDB user document to JSON-friendly dict using anonId."""
    return {
        "id": user.get("id") or str(user["_id"]),
        "anonId": user.get("anonId", "Anonymous"),
    }


def serialize_message(msg):
    """Convert MongoDB message document to JSON-friendly dict."""
    return {
        "id": str(msg.get("_id")),
        "from": msg.get("sender_id"),
        "to": msg.get("receiver_id"),
        "text": msg.get("text"),
        "timestamp": msg.get("timestamp").isoformat() if msg.get("timestamp") else None,
    }


# ---------------- SUGGESTIONS ----------------
@chat_bp.route("/suggestions", methods=["GET"])
@jwt_required()
def get_suggestions():
    current_user_id = str(get_jwt_identity())
    db = current_app.db

    connected_ids = {
        c["user1"] if c["user2"] == current_user_id else c["user2"]
        for c in db.connections.find({"$or": [
            {"user1": current_user_id}, {"user2": current_user_id}
        ]})
    }

    pending_ids = {
        r["from"] if r["to"] == current_user_id else r["to"]
        for r in db.requests.find({"$or": [
            {"from": current_user_id}, {"to": current_user_id}
        ]})
    }

    excluded = connected_ids.union(pending_ids).union({current_user_id})

    suggestions = [serialize_user(u) for u in db.users.find({"id": {"$nin": list(excluded)}})]
    return jsonify({"success": True, "users": suggestions})


# ---------------- SEND FOLLOW REQUEST ----------------
@chat_bp.route("/follow/<target_id>", methods=["POST"])
@jwt_required()
def send_follow(target_id):
    current_user_id = str(get_jwt_identity())
    db = current_app.db

    if current_user_id == target_id:
        return jsonify({"success": False, "message": "Cannot follow yourself"}), 400

    if db.requests.find_one({"from": current_user_id, "to": target_id, "status": "pending"}):
        return jsonify({"success": False, "message": "Already requested"}), 400

    if db.connections.find_one({"$or": [
        {"user1": current_user_id, "user2": target_id},
        {"user1": target_id, "user2": current_user_id}
    ]}):
        return jsonify({"success": False, "message": "Already connected"}), 400

    db.requests.insert_one({
        "from": current_user_id,
        "to": target_id,
        "status": "pending"
    })

    return jsonify({"success": True, "message": "Request sent"})


# ---------------- PENDING REQUESTS ----------------
@chat_bp.route("/pending", methods=["GET"])
@jwt_required()
def get_pending():
    current_user_id = str(get_jwt_identity())
    db = current_app.db
    pending_requests = []

    for r in db.requests.find({"to": current_user_id, "status": "pending"}):
        user = db.users.find_one({"id": r["from"]})
        if user:
            pending_requests.append(serialize_user(user))

    return jsonify({"success": True, "requests": pending_requests})


# ---------------- ACCEPT FOLLOW ----------------
@chat_bp.route("/accept/<follower_id>", methods=["POST"])
@jwt_required()
def accept_follow(follower_id):
    current_user_id = str(get_jwt_identity())
    db = current_app.db
    req = db.requests.find_one({"from": follower_id, "to": current_user_id, "status": "pending"})

    if not req:
        return jsonify({"success": False, "message": "Request not found"}), 404

    db.connections.insert_one({"user1": follower_id, "user2": current_user_id})
    db.requests.delete_one({"_id": req["_id"]})

    return jsonify({"success": True, "message": "Follow request accepted"})


# ---------------- CONNECTIONS ----------------
@chat_bp.route("/connections", methods=["GET"])
@jwt_required()
def get_connections():
    current_user_id = str(get_jwt_identity())
    db = current_app.db
    connections = []

    for c in db.connections.find({"$or": [{"user1": current_user_id}, {"user2": current_user_id}]}):
        partner_id = c["user1"] if c["user2"] == current_user_id else c["user2"]
        user = db.users.find_one({"id": partner_id})
        if user:
            connections.append(serialize_user(user))

    return jsonify({"success": True, "connections": connections})


# ---------------- SEND MESSAGE ----------------
@chat_bp.route("/messages/<receiver_id>", methods=["POST"])
@jwt_required()
def send_message(receiver_id):
    current_user_id = str(get_jwt_identity())
    db = current_app.db
    data = request.get_json()
    text = data.get("text")

    if not text:
        return jsonify({"success": False, "message": "Message text required"}), 400

    # Must be connected
    if not db.connections.find_one({"$or": [
        {"user1": current_user_id, "user2": receiver_id},
        {"user1": receiver_id, "user2": current_user_id}
    ]}):
        return jsonify({"success": False, "message": "Not connected"}), 403

    msg = {
        "sender_id": current_user_id,
        "receiver_id": receiver_id,
        "text": text,
        "timestamp": datetime.utcnow()
    }
    inserted = db.messages.insert_one(msg)
    msg["_id"] = inserted.inserted_id

    return jsonify({"success": True, "message": "Message sent", "data": serialize_message(msg)})


# ---------------- GET CHAT HISTORY ----------------
@chat_bp.route("/messages/<partner_id>", methods=["GET"])
@jwt_required()
def get_messages(partner_id):
    current_user_id = str(get_jwt_identity())
    db = current_app.db

    msgs = list(db.messages.find({
        "$or": [
            {"sender_id": current_user_id, "receiver_id": partner_id},
            {"sender_id": partner_id, "receiver_id": current_user_id}
        ]
    }).sort("timestamp", 1))

    formatted = [serialize_message(m) for m in msgs]

    return jsonify({"success": True, "messages": formatted})
