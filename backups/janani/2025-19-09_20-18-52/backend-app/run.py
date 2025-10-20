# backend/run.py
from app import create_app
from app.extensions import socketio
import os

app = create_app()

# Initialize socketio with allowed origins (so frontend can connect)
cors_origins = os.getenv('CORS_ORIGINS', 'http://localhost:3000').split(',')
socketio.init_app(app, cors_allowed_origins=cors_origins, logger=False, engineio_logger=False)


if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    print(f"🚀 Starting Flask + Socket.IO server on http://localhost:{port}")
    print("📱 Frontend should run on http://localhost:3000")
    print("🔗 Cross-origin requests enabled for frontend")

    # Use socketio.run instead of app.run
    socketio.run(
        app,
        host='0.0.0.0',
        port=port,
        debug=True,
        use_reloader=True
    )
