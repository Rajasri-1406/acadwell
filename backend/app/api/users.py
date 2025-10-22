from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
import uuid
from datetime import datetime

users_bp = Blueprint("users", __name__, url_prefix="/api/users")

# ----------------------------
# Send Connection Request
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

        # ✅ Prevent duplicate or existing accepted requests
        existing = current_app.db.requests.find_one({
            "from_id": from_id,
            "to_id": to_id,
            "status": {"$in": ["pending", "accepted"]}
        })
        if existing:
            return jsonify({"success": False, "message": "Request already sent"}), 400

        # ✅ Fetch user details
        from_user = current_app.db.users.find_one({"id": from_id})
        to_user = current_app.db.users.find_one({"id": to_id})

        if not from_user or not to_user:
            return jsonify({"success": False, "message": "Invalid user(s)"}), 404

        req = {
            "_id": str(uuid.uuid4()),
            "from_id": from_id,
            "from_name": from_user.get("name"),
            "from_role": from_user.get("role"),
            "to_id": to_id,
            "to_name": to_user.get("name"),
            "to_role": to_user.get("role"),
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
        requests = list(current_app.db.requests.find(
            {"to_id": user_id, "status": "pending"},
            {"_id": 0}
        ))
        return jsonify({"success": True, "requests": requests}), 200

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# ----------------------------
# Accept Request (creates connection)
# ----------------------------
@users_bp.route("/requests/accept", methods=["POST"])
@jwt_required()
def accept_request():
    try:
        data = request.get_json()
        req_id = data.get("request_id")

        if not req_id:
            return jsonify({"success": False, "message": "Request ID required"}), 400

        # ✅ Update request status
        req = current_app.db.requests.find_one_and_update(
            {"_id": req_id},
            {"$set": {"status": "accepted", "updated_at": datetime.utcnow()}},
            return_document=True
        )

        if not req:
            return jsonify({"success": False, "message": "Request not found"}), 404

        # ✅ Add mutual connection
        connection_data = {
            "_id": str(uuid.uuid4()),
            "from_id": req["from_id"],
            "to_id": req["to_id"],
            "status": "accepted",
            "created_at": datetime.utcnow()
        }

        current_app.db.connections.insert_one(connection_data)

        return jsonify({"success": True, "message": "Request accepted and connection added"}), 200

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
@jwt_required()
def get_connections(user_id):
    try:
        # ✅ Find accepted connections
        connections = list(current_app.db.connections.find({
            "$or": [
                {"from_id": user_id, "status": "accepted"},
                {"to_id": user_id, "status": "accepted"}
            ]
        }))

        if not connections:
            return jsonify({"success": True, "connections": []}), 200

        # ✅ Extract peer user IDs
        user_ids = []
        for conn in connections:
            if conn["from_id"] == user_id:
                user_ids.append(conn["to_id"])
            else:
                user_ids.append(conn["from_id"])

        # ✅ Fetch user details
        users = list(current_app.db.users.find(
            {"id": {"$in": user_ids}},
            {"_id": 0, "password": 0}
        ))

        return jsonify({"success": True, "connections": users}), 200

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
