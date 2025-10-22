# backend/app/api/requests.py
from flask import Blueprint, request, jsonify, current_app
import jwt
from functools import wraps
import os

from ..models import (
    get_user_by_id,
    create_request,
    get_received_requests,
    get_sent_requests,
    get_request_by_id,
    update_request_status,
)

requests_bp = Blueprint("requests", __name__)
SECRET = os.getenv("SECRET_KEY", "devsecret123")

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth = request.headers.get("Authorization", "")
        if auth and auth.startswith("Bearer "):
            token = auth.split(" ", 1)[1]
        if not token:
            return jsonify({"message": "Token is missing"}), 401
        try:
            payload = jwt.decode(token, SECRET, algorithms=["HS256"])
            user = get_user_by_id(payload["user_id"])
            if not user:
                return jsonify({"message": "Invalid token (user not found)"}), 401
            request.current_user = user
        except Exception as e:
            return jsonify({"message": "Token invalid", "error": str(e)}), 401
        return f(*args, **kwargs)
    return decorated

@requests_bp.route("/api/requests", methods=["POST"])
@token_required
def send_request():
    data = request.json or {}
    recipient_id = data.get("recipient_id")
    message = data.get("message", "").strip()
    if not recipient_id or not message:
        return jsonify({"message": "recipient_id and message required"}), 400
    recipient = get_user_by_id(recipient_id)
    if not recipient:
        return jsonify({"message": "recipient not found"}), 404
    sender = request.current_user
    r = create_request(
        sender_id=sender["_id"],
        sender_name=sender.get("full_name") or sender.get("username"),
        recipient_id=recipient["_id"],
        recipient_name=recipient.get("full_name") or recipient.get("username"),
        message=message,
    )
    return jsonify({"request": r}), 201

@requests_bp.route("/api/requests/received", methods=["GET"])
@token_required
def received():
    user = request.current_user
    res = get_received_requests(user["_id"])
    return jsonify({"requests": res}), 200

@requests_bp.route("/api/requests/sent", methods=["GET"])
@token_required
def sent():
    user = request.current_user
    res = get_sent_requests(user["_id"])
    return jsonify({"requests": res}), 200

@requests_bp.route("/api/requests/<request_id>/respond", methods=["POST"])
@token_required
def respond_request(request_id):
    user = request.current_user
    data = request.json or {}
    action = data.get("action")
    if action not in ("accept", "reject"):
        return jsonify({"message": "action must be 'accept' or 'reject'"}), 400
    r = get_request_by_id(request_id)
    if not r:
        return jsonify({"message": "request not found"}), 404
    if r["recipient_id"] != user["_id"]:
        return jsonify({"message": "not authorized to respond to this request"}), 403
    status = "accepted" if action == "accept" else "rejected"
    updated = update_request_status(request_id, status)
    return jsonify({"request": updated}), 200
