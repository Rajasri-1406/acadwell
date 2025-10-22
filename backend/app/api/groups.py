# app/api/groups.py
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from datetime import datetime

groups_bp = Blueprint("groups", __name__, url_prefix="/api/groups")


# ---------------- UTILS ----------------
def serialize_group(group):
    """Convert MongoDB group doc to JSON-safe dict"""
    group["_id"] = str(group["_id"])
    group.pop("createdBy", None)  # hide creator for anonymity
    return group


def get_anon_id(user_id):
    """Fetch anonId of user, fallback to 'Anonymous'"""
    user = current_app.db.users.find_one({"id": user_id})
    return user.get("anonId", "Anonymous") if user else "Anonymous"


# ---------------- CREATE GROUP ----------------
@groups_bp.route("/create", methods=["POST"])
@jwt_required()
def create_group():
    try:
        user_id = get_jwt_identity()
        data = request.get_json() or {}

        name = data.get("name")
        description = data.get("description", "")
        is_private = data.get("isPrivate", False)
        profile_pic = data.get("profilePic", "")

        if not name:
            return jsonify({"success": False, "message": "Group name is required"}), 400

        new_group = {
            "name": name,
            "description": description,
            "profilePic": profile_pic,
            "isPrivate": is_private,
            "createdBy": user_id,
            "members": [user_id],
            "createdAt": datetime.utcnow()
        }

        result = current_app.db.groups.insert_one(new_group)
        new_group["_id"] = str(result.inserted_id)
        new_group.pop("createdBy", None)

        # Initial system message
        current_app.db.group_messages.insert_one({
            "groupId": new_group["_id"],
            "senderId": None,
            "message": "🟢 You joined the group!",
            "timestamp": datetime.utcnow(),
            "system": True
        })

        return jsonify({"success": True, "group": new_group}), 201

    except Exception as e:
        current_app.logger.error(f"Error creating group: {e}")
        return jsonify({"success": False, "message": str(e)}), 500


# ---------------- GET MY GROUPS ----------------
@groups_bp.route("/my", methods=["GET"])
@jwt_required()
def my_groups():
    try:
        user_id = get_jwt_identity()
        groups = list(current_app.db.groups.find({"members": user_id}))
        return jsonify({"success": True, "groups": [serialize_group(g) for g in groups]}), 200
    except Exception as e:
        current_app.logger.error(f"Error fetching my groups: {e}")
        return jsonify({"success": False, "message": str(e)}), 500


# ---------------- SUGGESTED GROUPS ----------------
@groups_bp.route("/suggestions", methods=["GET"])
@jwt_required()
def suggestions():
    try:
        user_id = get_jwt_identity()

        # User connections
        connections_docs = list(current_app.db.connections.find({
            "$or": [{"user1": user_id}, {"user2": user_id}]
        }))
        connections = [doc["user2"] if doc["user1"] == user_id else doc["user1"] for doc in connections_docs]

        # Public groups not joined
        public_groups = list(current_app.db.groups.find({
            "isPrivate": False,
            "members": {"$ne": user_id}
        }))

        # Private groups by connections
        private_groups = list(current_app.db.groups.find({
            "isPrivate": True,
            "createdBy": {"$in": connections},
            "members": {"$ne": user_id}
        }))

        all_groups = public_groups + private_groups
        return jsonify({"success": True, "groups": [serialize_group(g) for g in all_groups]}), 200

    except Exception as e:
        current_app.logger.error(f"Error fetching suggested groups: {e}")
        return jsonify({"success": False, "message": str(e)}), 500


# ---------------- JOIN GROUP ----------------
@groups_bp.route("/<group_id>/join", methods=["POST"])
@jwt_required()
def join_group(group_id):
    try:
        user_id = get_jwt_identity()
        group = current_app.db.groups.find_one({"_id": ObjectId(group_id)})
        if not group:
            return jsonify({"success": False, "message": "Group not found"}), 404

        if user_id in group.get("members", []):
            return jsonify({"success": False, "message": "Already a member"}), 400

        current_app.db.groups.update_one({"_id": ObjectId(group_id)}, {"$addToSet": {"members": user_id}})

        anon_id = get_anon_id(user_id)
        current_app.db.group_messages.insert_one({
            "groupId": group_id,
            "senderId": None,
            "message": f"🟢 {anon_id} joined the group!",
            "timestamp": datetime.utcnow(),
            "system": True
        })

        return jsonify({"success": True, "message": "Joined group successfully"}), 200

    except Exception as e:
        current_app.logger.error(f"Error joining group: {e}")
        return jsonify({"success": False, "message": str(e)}), 500


# ---------------- LEAVE GROUP ----------------
@groups_bp.route("/<group_id>/leave", methods=["POST"])
@jwt_required()
def leave_group(group_id):
    try:
        user_id = get_jwt_identity()
        current_app.db.groups.update_one({"_id": ObjectId(group_id)}, {"$pull": {"members": user_id}})

        anon_id = get_anon_id(user_id)
        current_app.db.group_messages.insert_one({
            "groupId": group_id,
            "senderId": None,
            "message": f"⚪ {anon_id} left the group",
            "timestamp": datetime.utcnow(),
            "system": True
        })

        return jsonify({"success": True, "message": "Left group successfully"}), 200

    except Exception as e:
        current_app.logger.error(f"Error leaving group: {e}")
        return jsonify({"success": False, "message": str(e)}), 500


# ---------------- GET GROUP MESSAGES ----------------
@groups_bp.route("/<group_id>/messages", methods=["GET"])
@jwt_required()
def get_messages(group_id):
    try:
        messages = list(current_app.db.group_messages.find({"groupId": group_id}).sort("timestamp", 1))
        for m in messages:
            m["_id"] = str(m["_id"])
            if not m.get("system") and m.get("senderId"):
                m["anonId"] = get_anon_id(m["senderId"])
        return jsonify({"success": True, "messages": messages}), 200

    except Exception as e:
        current_app.logger.error(f"Error fetching group messages: {e}")
        return jsonify({"success": False, "message": str(e)}), 500


# ---------------- SEND GROUP MESSAGE ----------------
@groups_bp.route("/<group_id>/messages", methods=["POST"])
@jwt_required()
def send_message(group_id):
    try:
        user_id = get_jwt_identity()
        data = request.get_json() or {}
        message_text = data.get("message")

        if not message_text:
            return jsonify({"success": False, "message": "Message cannot be empty"}), 400

        message = {
            "groupId": group_id,
            "senderId": user_id,
            "message": message_text,
            "timestamp": datetime.utcnow(),
            "system": False
        }

        result = current_app.db.group_messages.insert_one(message)
        message["_id"] = str(result.inserted_id)
        message.pop("senderId", None)

        return jsonify({"success": True, "message": message}), 201

    except Exception as e:
        current_app.logger.error(f"Error sending group message: {e}")
        return jsonify({"success": False, "message": str(e)}), 500


# ---------------- GET GROUP DETAILS ----------------
@groups_bp.route("/<group_id>", methods=["GET"])
@jwt_required()
def get_group_details(group_id):
    try:
        group = current_app.db.groups.find_one({"_id": ObjectId(group_id)})
        if not group:
            return jsonify({"success": False, "message": "Group not found"}), 404

        members_anon = [get_anon_id(uid) for uid in group.get("members", [])]
        group["_id"] = str(group["_id"])
        group.pop("createdBy", None)
        group["membersAnonIds"] = members_anon

        return jsonify({"success": True, "group": group}), 200

    except Exception as e:
        current_app.logger.error(f"Error fetching group details: {e}")
        return jsonify({"success": False, "message": str(e)}), 500
