# run.py

import eventlet
eventlet.monkey_patch()

from app import create_app, socketio
from flask import send_from_directory
import os

# Create the Flask app
app = create_app()

# Serve the React frontend
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    build_dir = os.path.join(os.path.dirname(__file__), "frontend_build")
    file_path = os.path.join(build_dir, path)
    if path != "" and os.path.exists(file_path):
        return send_from_directory(build_dir, path)
    return send_from_directory(build_dir, "index.html")

# Entry point
if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    socketio.run(app, host="0.0.0.0", port=port)
