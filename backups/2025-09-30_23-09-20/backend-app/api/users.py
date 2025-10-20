# app/api/users.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from app.models import users_col, follows_col

users_bp = Blueprint("users", __name__, url_prefix="/api/users")


# ---------------- Get all users (excluding self and already connected) ----------------


@users_bp.route("/users", methods=["GET"])
@jwt_required()
def get_users():
    current_user_id = get_jwt_identity()
    current_user = users_col.find_one({"id": current_user_id})
    if not current_user:
        return jsonify({"success": False, "message": "User not found"}), 404

    role = current_user.get("role")
    if role == "student":
        users = list(users_col.find({"role": "teacher"}))
    elif role == "teacher":
        users = list(users_col.find({"role": "student"}))
    else:
        users = []

    # Exclude self and already-followed users
    already_followed = follows_col.find({"follower_id": current_user_id})
    followed_ids = [f["followee_id"] for f in already_followed]
    users = [u for u in users if u["id"] != current_user_id and u["id"] not in followed_ids]

    result = [{"anon_id": u["id"], "name": u["name"], "role": u["role"]} for u in users]
    return jsonify({"success": True, "users": result})


# ---------------- Send follow request ----------------
@users_bp.route("/follow/<target_id>", methods=["POST"])
@jwt_required()
def send_follow(target_id):
    current_user_id = get_jwt_identity()
    if current_user_id == target_id:
        return jsonify({"success": False, "message": "Cannot follow yourself"}), 400

    if not users_col.find_one({"id": target_id}):
        return jsonify({"success": False, "message": "Target user not found"}), 404

    existing = follows_col.find_one({
        "follower_id": current_user_id,
        "followee_id": target_id
    })
    if existing:
        return jsonify({"success": False, "message": "Follow request already exists"}), 400

    follows_col.insert_one({
        "follower_id": current_user_id,
        "followee_id": target_id,
        "status": "pending",
        "created_at": datetime.utcnow()
    })
    return jsonify({"success": True, "message": "Follow request sent"})


# ---------------- Accept follow request ----------------
@users_bp.route("/accept/<follower_id>", methods=["POST"])
@jwt_required()
def accept_follow(follower_id):
    current_user_id = get_jwt_identity()
    follow = follows_col.find_one({
        "follower_id": follower_id,
        "followee_id": current_user_id,
        "status": "pending"
    })
    if not follow:
        return jsonify({"success": False, "message": "No pending request"}), 404

    follows_col.update_one(
        {"_id": follow["_id"]},
        {"$set": {"status": "accepted"}}
    )
    return jsonify({"success": True, "message": "Follow request accepted"})


# ---------------- Get connections ----------------
@users_bp.route("/connections", methods=["GET"])
@jwt_required()
def get_connections():
    current_user_id = get_jwt_identity()
    follows = list(follows_col.find({
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

    users = list(users_col.find({"id": {"$in": list(connected_ids)}}))
    result = [{"id": u["id"], "name": u["name"], "role": u["role"]} for u in users]
    return jsonify({"success": True, "connections": result})


# ---------------- Get pending requests ----------------
@users_bp.route("/pending", methods=["GET"])
@jwt_required()
def get_pending():
    current_user_id = get_jwt_identity()
    pending_follows = list(follows_col.find({
        "followee_id": current_user_id,
        "status": "pending"
    }))

    follower_ids = [f["follower_id"] for f in pending_follows]
    users = list(users_col.find({"id": {"$in": follower_ids}}))
    result = [{"id": u["id"], "name": u["name"], "role": u["role"]} for u in users]
    return jsonify({"success": True, "requests": result})
