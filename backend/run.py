# run.py

# 1. Eventlet monkey patch MUST come first
import eventlet
eventlet.monkey_patch()

# 2. Import modules after monkey patch
from app import create_app, socketio
import os

# 3. Create app from factory
app = create_app()

# 4. Run app using SocketIO with Eventlet
if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    socketio.run(app, host="0.0.0.0", port=port)
