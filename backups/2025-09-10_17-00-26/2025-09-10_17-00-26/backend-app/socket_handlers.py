from flask import current_app
from flask_socketio import emit, join_room, leave_room
from . import socketio, mongo
from datetime import datetime

@socketio.on("join")
def handle_join(data):
    room = data.get("room")
    username = data.get("username", "anonymous")
    if not room:
        emit("error", {"error": "room required"})
        return
    join_room(room)
    emit("status", {"msg": f"{username} has joined {room}"}, room=room)

@socketio.on("leave")
def handle_leave(data):
    room = data.get("room")
    username = data.get("username", "anonymous")
    if room:
        leave_room(room)
        emit("status", {"msg": f"{username} has left {room}"}, room=room)

@socketio.on("message")
def handle_message(data):
    room = data.get("room")
    username = data.get("username", "anonymous")
    text = data.get("text", "")
    if not room or not text:
        emit("error", {"error": "room and text required"})
        return

    msg = {
        "room": room,
        "username": username,
        "text": text,
        "timestamp": datetime.utcnow().isoformat()
    }

    # Save to DB
    try:
        mongo.db.messages.insert_one(msg)
    except Exception as e:
        current_app.logger.error(f"Failed to save message: {e}")

    # Broadcast to room
    emit("message", msg, room=room)
