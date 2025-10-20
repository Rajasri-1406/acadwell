import os
from dotenv import load_dotenv
from app import create_app, socketio

# Load environment variables
load_dotenv()

# Create Flask app
app = create_app()

# For development only
DEBUG = os.getenv("FLASK_ENV") != "production"

if __name__ == "__main__":
    # ✅ Local dev
    socketio.run(
        app,
        host="0.0.0.0",
        port=int(os.getenv("PORT", 5000)),
        debug=DEBUG,
        allow_unsafe_werkzeug=True
    )
