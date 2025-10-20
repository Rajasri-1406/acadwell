import os
from dotenv import load_dotenv
from app import create_app, socketio

# Load environment variables from .env
load_dotenv()

# Create Flask app
app = create_app()

if __name__ == "__main__":
    # ✅ Run with Socket.IO support
    socketio.run(
        app,
        host="0.0.0.0",
        port=int(os.getenv("PORT", 5000)),  # fallback to 5000 if PORT not set
        debug=True,
        allow_unsafe_werkzeug=True  # needed for Flask 2.x
    )
