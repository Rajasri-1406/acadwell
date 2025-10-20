# app/api/socket_events.py
from flask_socketio import emit, join_room
from flask_jwt_extended import decode_token
from app import socketio
from app.models import messages_col
from datetime import datetime

# ---------------- Event: user joins ----------------
@socketio.on("join")
def handle_join(data):
    token = data.get("token")
    try:
        decoded = decode_token(token)
        user_id = str(decoded["sub"])
        join_room(user_id)
        emit("status", {"msg": f"{user_id} joined"}, room=user_id)
    except Exception as e:
        emit("status", {"msg": "Invalid token"})


# ---------------- Event: send message ----------------
@socketio.on("send_message")
def handle_send_message(data):
    sender_id = str(data.get("sender_id"))
    receiver_id = str(data.get("receiver_id"))
    text = data.get("text")
    timestamp = datetime.utcnow()

    if not sender_id or not receiver_id or not text:
        return

    # Save message
    messages_col.insert_one({
        "sender_id": sender_id,
        "receiver_id": receiver_id,
        "text": text,
        "timestamp": timestamp
    })

    # Emit to both sender and receiver
    for uid in [sender_id, receiver_id]:
        emit("receive_message", {
            "sender_id": sender_id,
            "receiver_id": receiver_id,
            "text": text,
            "timestamp": timestamp.isoformat()
        }, room=uid)
