# backend/app/utils/socket_events.py
from flask_socketio import emit, join_room
from flask_jwt_extended import decode_token
from datetime import datetime
from app import socketio, mongo


@socketio.on("join")
def handle_join(data):
    """
    User joins their private room using JWT token.
    Frontend should emit:
        socket.emit("join", { token })
    """
    token = data.get("token")
    if not token:
        emit("error", {"msg": "Missing token"})
        return

    try:
        decoded = decode_token(token)
        user_id = decoded.get("sub")
        if not user_id:
            emit("error", {"msg": "Invalid token: no user_id"})
            return

        # ✅ Each user joins their own private room
        join_room(user_id)

        emit("status", {"msg": f"✅ User {user_id} joined room"}, room=user_id)
        print(f"[JOIN] User {user_id} joined their private room.")

    except Exception as e:
        emit("error", {"msg": f"Join failed: {str(e)}"})
        print(f"[ERROR] Join failed → {e}")


@socketio.on("send_message")
def handle_message(data):
    """
    Send + save a message.
    Frontend should emit:
        socket.emit("send_message", { sender_id, receiver_id, text })
    """
    sender_id = data.get("sender_id")
    receiver_id = data.get("receiver_id")
    text = data.get("text")

    if not sender_id or not receiver_id or not text:
        emit("error", {"msg": "❌ Missing fields in message"})
        return

    msg = {
        "sender_id": sender_id,
        "receiver_id": receiver_id,
        "text": text,
        "timestamp": datetime.utcnow().isoformat(),
    }

    try:
        # ✅ Save in MongoDB
        mongo.db.messages.insert_one(msg)

        # ✅ Emit to sender & receiver rooms
        emit("receive_message", msg, room=sender_id)
        emit("receive_message", msg, room=receiver_id)

        print(f"[MESSAGE] {sender_id} → {receiver_id}: {text}")

    except Exception as e:
        emit("error", {"msg": f"Message save failed: {str(e)}"})
        print(f"[ERROR] Message save failed → {e}")
