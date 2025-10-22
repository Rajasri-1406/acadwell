# run.py

import eventlet
eventlet.monkey_patch()

from app import create_app, socketio
import os

# Create Flask app
app = create_app()

# Entry point
if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    socketio.run(app, host="0.0.0.0", port=port)
