from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
import uuid
from datetime import datetime

users_bp = Blueprint("users", __name__, url_prefix="/api/users")

# ----------------------------
# Send Request
# ----------------------------
@users_bp.route("/requests/send", methods=["POST"])
@jwt_required()
def send_request():
    try:
        data = request.get_json()
        from_id = get_jwt_identity()
        to_id = data.get("to_id")

        if not to_id:
            return jsonify({"success": False, "message": "Recipient required"}), 400

        # ✅ Prevent duplicate requests
        existing = current_app.db.requests.find_one({
            "from_id": from_id,
            "to_id": to_id,
            "status": {"$in": ["pending", "accepted"]}
        })
        if existing:
            return jsonify({"success": False, "message": "Request already sent"}), 400

        from_user = current_app.db.users.find_one({"id": from_id})
        to_user = current_app.db.users.find_one({"id": to_id})

        req = {
            "_id": str(uuid.uuid4()),
            "from_id": from_id,
            "from_name": from_user["name"],
            "from_role": from_user["role"],
            "to_id": to_id,
            "to_name": to_user["name"],
            "to_role": to_user["role"],
            "status": "pending",
            "created_at": datetime.utcnow()
        }
        current_app.db.requests.insert_one(req)

        return jsonify({"success": True, "message": "Request sent"}), 201

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# ----------------------------
# Get Received Requests
# ----------------------------
@users_bp.route("/requests/received/<user_id>", methods=["GET"])
@jwt_required()
def received_requests(user_id):
    try:
        requests = list(current_app.db.requests.find({
            "to_id": user_id,
            "status": "pending"
        }, {"_id": 0}))
        return jsonify(requests), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# ----------------------------
# Accept Request
# ----------------------------
@users_bp.route("/requests/accept", methods=["POST"])
@jwt_required()
def accept_request():
    try:
        data = request.get_json()
        req_id = data.get("request_id")

        if not req_id:
            return jsonify({"success": False, "message": "Request ID required"}), 400

        current_app.db.requests.update_one(
            {"_id": req_id},
            {"$set": {"status": "accepted", "updated_at": datetime.utcnow()}}
        )

        return jsonify({"success": True, "message": "Request accepted"}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# ----------------------------
# Reject Request
# ----------------------------
@users_bp.route("/requests/reject", methods=["POST"])
@jwt_required()
def reject_request():
    try:
        data = request.get_json()
        req_id = data.get("request_id")

        if not req_id:
            return jsonify({"success": False, "message": "Request ID required"}), 400

        current_app.db.requests.update_one(
            {"_id": req_id},
            {"$set": {"status": "rejected", "updated_at": datetime.utcnow()}}
        )

        return jsonify({"success": True, "message": "Request rejected"}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# ----------------------------
# Get Connections (Accepted)
# ----------------------------
@users_bp.route("/connections/<user_id>", methods=["GET"])
def get_connections(user_id):
    try:
        # Connections are stored in "connections" collection
        connections = list(current_app.db.connections.find({
            "$or": [
                {"from_id": user_id, "status": "accepted"},
                {"to_id": user_id, "status": "accepted"}
            ]
        }))

        # Extract user IDs
        user_ids = []
        for conn in connections:
            if conn["from_id"] == user_id:
                user_ids.append(conn["to_id"])
            else:
                user_ids.append(conn["from_id"])

        # Fetch users from DB
        users = list(current_app.db.users.find(
            {"id": {"$in": user_ids}},
            {"password": 0, "_id": 0}
        ))

        return jsonify(users), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500