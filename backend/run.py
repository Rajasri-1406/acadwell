# run.py
import os
import eventlet
eventlet.monkey_patch()

from app import create_app, socketio
from dotenv import load_dotenv

# Load .env file
load_dotenv()

# Create Flask app
app = create_app()

# Entry point
if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug = os.getenv("FLASK_ENV") != "production"
    
    print(f"🚀 Starting Acadwell backend on port {port} (Debug={debug})")
    socketio.run(
        app,
        host="0.0.0.0",
        port=port,
        debug=debug,
    )
