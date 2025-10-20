# run.py

# 1. Eventlet monkey patch MUST come first
import eventlet
eventlet.monkey_patch()

# 2. Import modules after monkey patch
from app import create_app, socketio
from flask import send_from_directory
import os

# 3. Create app from factory
app = create_app()

# 4. Serve React build files (from frontend/build)
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    build_dir = os.path.join(os.path.dirname(__file__), "frontend", "build")
    if path != "" and os.path.exists(os.path.join(build_dir, path)):
        return send_from_directory(build_dir, path)
    else:
        return send_from_directory(build_dir, "index.html")

# 5. Run app using SocketIO with Eventlet
if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    socketio.run(app, host="0.0.0.0", port=port)
