# backend/app/api/requests.py
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity

requests_bp = Blueprint("requests", __name__)

# ---------------- SEND REQUEST ----------------
@requests_bp.route("", methods=["POST"])
@jwt_required()
def send_request():
    data = request.json or {}
    recipient_id = data.get("recipient_id")
    message = data.get("message", "").strip()
    sender_id = str(get_jwt_identity())

    if not recipient_id or not message:
        return jsonify({"success": False, "message": "recipient_id and message required"}), 400

    recipient = current_app.db.users.find_one({"id": recipient_id})
    if not recipient:
        return jsonify({"success": False, "message": "recipient not found"}), 404

    # Prevent sending to self
    if recipient_id == sender_id:
        return jsonify({"success": False, "message": "Cannot send request to yourself"}), 400

    # Check if request already exists
    existing = current_app.db.requests.find_one({
        "from": sender_id,
        "to": recipient_id,
        "status": "pending"
    })
    if existing:
        return jsonify({"success": False, "message": "Request already sent"}), 400

    new_request = {
        "from": sender_id,
        "to": recipient_id,
        "message": message,
        "status": "pending",
        "createdAt": datetime.utcnow()
    }
    res = current_app.db.requests.insert_one(new_request)
    new_request["_id"] = str(res.inserted_id)

    return jsonify({"success": True, "request": new_request}), 201


# ---------------- RECEIVED REQUESTS ----------------
@requests_bp.route("/received", methods=["GET"])
@jwt_required()
def received_requests():
    user_id = str(get_jwt_identity())
    requests_list = list(current_app.db.requests.find({"to": user_id, "status": "pending"}))
    for r in requests_list:
        r["_id"] = str(r["_id"])
    return jsonify({"success": True, "requests": requests_list})


# ---------------- SENT REQUESTS ----------------
@requests_bp.route("/sent", methods=["GET"])
@jwt_required()
def sent_requests():
    user_id = str(get_jwt_identity())
    requests_list = list(current_app.db.requests.find({"from": user_id, "status": "pending"}))
    for r in requests_list:
        r["_id"] = str(r["_id"])
    return jsonify({"success": True, "requests": requests_list})


# ---------------- RESPOND TO REQUEST ----------------
@requests_bp.route("/<request_id>/respond", methods=["POST"])
@jwt_required()
def respond_request(request_id):
    user_id = str(get_jwt_identity())
    data = request.json or {}
    action = data.get("action")
    if action not in ("accept", "reject"):
        return jsonify({"success": False, "message": "action must be 'accept' or 'reject'"}), 400

    req = current_app.db.requests.find_one({"_id": request_id})
    if not req:
        return jsonify({"success": False, "message": "Request not found"}), 404

    if req["to"] != user_id:
        return jsonify({"success": False, "message": "Not authorized to respond"}), 403

    status = "accepted" if action == "accept" else "rejected"
    current_app.db.requests.update_one({"_id": req["_id"]}, {"$set": {"status": status}})

    # If accepted, add connection
    if status == "accepted":
        current_app.db.connections.insert_one({
            "user1": req["from"],
            "user2": req["to"],
            "createdAt": datetime.utcnow()
        })

    req["status"] = status
    req["_id"] = str(req["_id"])
    return jsonify({"success": True, "request": req})
