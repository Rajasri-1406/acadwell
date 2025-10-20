from flask import request
from flask_socketio import join_room, leave_room, emit
from app import socketio

# ================================
# ✅ Client Connected
# ================================
@socketio.on("connect")
def handle_connect():
    print(f"🟢 Client connected: {request.sid}")
    emit("server_message", {"message": "Connected to AcadWell Chat Server ✅"})

# ================================
# ❌ Client Disconnected
# ================================
@socketio.on("disconnect")
def handle_disconnect():
    print(f"🔴 Client disconnected: {request.sid}")

# ================================
# ✅ Join a Group Chat Room
# ================================
@socketio.on("join_group")
def handle_join_group(data):
    """
    data = {
        "groupId": "uuid-of-group"
    }
    """
    group_id = data.get("groupId")
    if group_id:
        join_room(group_id)
        print(f"👥 Client {request.sid} joined group: {group_id}")
        emit(
            "server_message",
            {"message": f"Joined group {group_id} successfully ✅"},
            room=request.sid,
        )

# ================================
# ✅ Leave a Group Chat Room
# ================================
@socketio.on("leave_group")
def handle_leave_group(data):
    """
    data = {
        "groupId": "uuid-of-group"
    }
    """
    group_id = data.get("groupId")
    if group_id:
        leave_room(group_id)
        print(f"👤 Client {request.sid} left group: {group_id}")
        emit(
            "server_message",
            {"message": f"Left group {group_id} ❌"},
            room=request.sid,
        )

# ================================
# ✅ Send a Chat Message
# ================================
@socketio.on("send_message")
def handle_send_message(data):
    """
    data = {
        "groupId": "uuid-of-group",
        "sender": "Teacher / Student",
        "text": "Hello Everyone!"
    }
    """
    group_id = data.get("groupId")
    sender = data.get("sender", "Anonymous")
    text = data.get("text", "")

    if not group_id or not text:
        emit(
            "error",
            {"message": "Group ID and message text are required ❌"},
            room=request.sid,
        )
        return

    # Construct message object
    message = {
        "sender": sender,
        "text": text,
    }

    print(f"💬 Message in {group_id} → {sender}: {text}")

    # ✅ Broadcast to all clients in the same group room
    emit(
        "receive_message",
        {"groupId": group_id, "message": message},
        room=group_id,
    )
