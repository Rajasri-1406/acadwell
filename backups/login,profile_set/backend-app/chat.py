from flask_socketio import SocketIO, join_room, emit

def register_chat(socketio: SocketIO):
    @socketio.on("connect")
    def on_connect():
        print("🟢 Client connected")

    @socketio.on("disconnect")
    def on_disconnect():
        print("🔴 Client disconnected")

    @socketio.on("join_room")
    def on_join(data):
        room = data["room"]
        join_room(room)
        emit("status", {"msg": f"{data['name']} joined the room"}, room=room)

    @socketio.on("send_message")
    def on_message(data):
        room = data["room"]
        emit("receive_message", data, room=room)
