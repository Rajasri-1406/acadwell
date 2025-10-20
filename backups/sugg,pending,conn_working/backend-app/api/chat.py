from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import users_col, requests_col, connections_col

chat_bp = Blueprint("chat", __name__, url_prefix="/api/chat")


def serialize_user(user):
    """Convert MongoDB user document to JSON-friendly dict."""
    return {
        "id": user.get("id") or str(user["_id"]),  # prefer UUID over ObjectId
        "name": user.get("name", "Unnamed User")
    }

# ---------------- SUGGESTIONS ----------------
@chat_bp.route("/suggestions", methods=["GET"])
@jwt_required()
def get_suggestions():
    current_user_id = str(get_jwt_identity())

    # Get all connected user IDs (UUIDs)
    connected_ids = set()
    for c in connections_col.find({"$or": [{"user1": current_user_id}, {"user2": current_user_id}]}):
        connected_ids.add(c["user1"])
        connected_ids.add(c["user2"])

    # Get all pending request user IDs (UUIDs)
    pending_ids = set()
    for r in requests_col.find({"$or": [{"from": current_user_id}, {"to": current_user_id}]}):
        pending_ids.add(r["from"])
        pending_ids.add(r["to"])

    # Exclude self, connected, and pending users
    excluded = connected_ids.union(pending_ids).union({current_user_id})

    suggestions = [serialize_user(u) for u in users_col.find({"id": {"$nin": list(excluded)}})]
    return jsonify({"success": True, "users": suggestions})


# ---------------- SEND FOLLOW REQUEST ----------------
@chat_bp.route("/follow/<target_id>", methods=["POST"])
@jwt_required()
def send_follow(target_id):
    current_user_id = str(get_jwt_identity())

    if current_user_id == target_id:
        return jsonify({"success": False, "message": "Cannot follow yourself"}), 400

    # Check if already requested
    if requests_col.find_one({"from": current_user_id, "to": target_id, "status": "pending"}):
        return jsonify({"success": False, "message": "Already requested"}), 400

    # Check if already connected
    if connections_col.find_one({"$or": [
        {"user1": current_user_id, "user2": target_id},
        {"user1": target_id, "user2": current_user_id}
    ]}):
        return jsonify({"success": False, "message": "Already connected"}), 400

    # Insert new follow request
    requests_col.insert_one({
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
    pending_requests = []

    for r in requests_col.find({"to": current_user_id, "status": "pending"}):
        user = users_col.find_one({"id": r["from"]})  # ✅ UUID lookup
        if user:
            pending_requests.append(serialize_user(user))

    return jsonify({"success": True, "requests": pending_requests})


# ---------------- ACCEPT FOLLOW ----------------
@chat_bp.route("/accept/<follower_id>", methods=["POST"])
@jwt_required()
def accept_follow(follower_id):
    current_user_id = str(get_jwt_identity())
    req = requests_col.find_one({"from": follower_id, "to": current_user_id, "status": "pending"})

    if not req:
        return jsonify({"success": False, "message": "Request not found"}), 404

    # Add to connections
    connections_col.insert_one({"user1": follower_id, "user2": current_user_id})

    # Delete the pending request
    requests_col.delete_one({"_id": req["_id"]})

    return jsonify({"success": True, "message": "Follow request accepted"})


# ---------------- CONNECTIONS ----------------
@chat_bp.route("/connections", methods=["GET"])
@jwt_required()
def get_connections():
    current_user_id = str(get_jwt_identity())
    connections = []

    for c in connections_col.find({"$or": [{"user1": current_user_id}, {"user2": current_user_id}]}):
        partner_id = c["user1"] if c["user2"] == current_user_id else c["user2"]
        user = users_col.find_one({"id": partner_id})  # ✅ UUID lookup
        if user:
            connections.append(serialize_user(user))

    return jsonify({"success": True, "connections": connections})
