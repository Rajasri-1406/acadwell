from flask_socketio import emit, join_room, leave_room
from app.models import chats_col
from datetime import datetime

def register_socket_events(socketio):

    @socketio.on("join_room")
    def handle_join(data):
        room = data["room"]
        join_room(room)
        emit("system_message", {"msg": f"{data['role']} joined the room"}, to=room)

    @socketio.on("leave_room")
    def handle_leave(data):
        room = data["room"]
        leave_room(room)
        emit("system_message", {"msg": f"{data['role']} left the room"}, to=room)

    @socketio.on("send_message")
    def handle_message(data):
        room = data["room"]
        msg = {
            "sender": data["sender"],  # real user id
            "role": data["role"],      # student/teacher
            "message": data["message"],
            "timestamp": datetime.utcnow()
        }
        chats_col.insert_one(msg)

        # 👇 Masked role-based name
        display_name = "Anonymous " + data["role"].capitalize()

        emit("receive_message", {
            "sender": display_name,
            "message": data["message"],
            "timestamp": msg["timestamp"].strftime("%H:%M")
        }, to=room)
