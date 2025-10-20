# run.py

# -------------------------------
# 1️⃣ Eventlet monkey patch MUST come first
# -------------------------------
import eventlet
eventlet.monkey_patch()

# -------------------------------
# 2️⃣ Import Flask app and SocketIO after monkey patch
# -------------------------------
from app import create_app, socketio
from flask import send_from_directory
import os

# -------------------------------
# 3️⃣ Create Flask app using factory
# -------------------------------
app = create_app()

# -------------------------------
# 4️⃣ Serve React build files
# -------------------------------
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    build_dir = os.path.join(os.path.dirname(__file__), "frontend", "build")
    if path != "" and os.path.exists(os.path.join(build_dir, path)):
        return send_from_directory(build_dir, path)
    else:
        return send_from_directory(build_dir, "index.html")

# -------------------------------
# 5️⃣ Run app using SocketIO with Eventlet
# -------------------------------
if __name__ == "__main__":
    # Use Render's PORT environment variable
    port = int(os.getenv("PORT", 10000))  # default fallback if PORT not set
    print(f"Starting server on port {port}...")
    
    # Run the app with socketio + eventlet
    socketio.run(
        app,
        host="0.0.0.0",
        port=port,
        debug=True,      # set False in production
        use_reloader=False  # important to prevent multiple workers
    )
