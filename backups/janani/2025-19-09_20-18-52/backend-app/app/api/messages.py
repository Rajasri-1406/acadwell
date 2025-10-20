# backend/app/api/messages.py
from flask import Blueprint, request, jsonify, current_app
from app.extensions import socketio
from flask_socketio import emit, join_room, leave_room
from flask_jwt_extended import decode_token
from bson import ObjectId
from datetime import datetime
import traceback
import json

messages_bp = Blueprint('messages', __name__)

def safe_content_handler(content):
    """Safely handle content to prevent character splitting"""
    if content is None:
        return ""
    
    if isinstance(content, list):
        # If it's a list, join it (this fixes the character splitting)
        return ''.join(str(item) for item in content)
    
    if isinstance(content, str):
        return content
    
    # For any other type, convert to string
    return str(content)

def debug_content(content, location="unknown"):
    """Debug helper to track content issues"""
    print(f"🐛 DEBUG [{location}]: Content type={type(content)}, value={repr(content)}")
    if isinstance(content, list):
        print(f"🐛 DEBUG [{location}]: List length={len(content)}, first_few={content[:5] if len(content) > 5 else content}")

# ---------- REST endpoints ----------

@messages_bp.route('/conversations', methods=['GET'])
def get_conversations():
    auth = request.headers.get('Authorization', '')
    token = auth.replace('Bearer ', '') if auth.startswith('Bearer ') else None
    if not token:
        return jsonify({"error": "Missing token"}), 401

    try:
        decoded = decode_token(token)
        user_id = decoded.get('sub') or decoded.get('identity')
    except Exception:
        return jsonify({"error": "Invalid token"}), 401

    db = current_app.db
    convs = list(db.conversations.find({"participants": user_id}).sort("last_updated", -1))

    out = []
    for c in convs:
        other = [p for p in c['participants'] if p != user_id]
        
        # Get user names for better display
        other_user_names = []
        for other_id in other:
            user = db.users.find_one({"user_id": other_id})
            if user:
                other_user_names.append(user.get('name', 'Unknown'))
        
        # Safely handle last_message
        last_message = safe_content_handler(c.get("last_message", ""))
        
        out.append({
            "conversation_id": str(c["_id"]),
            "participants": [str(p) for p in c["participants"]],
            "other_preview": ", ".join(other_user_names) if other_user_names else "Unknown",
            "last_message": last_message,
            "last_updated": c.get("last_updated").isoformat() if c.get("last_updated") else None
        })
    return jsonify({"conversations": out}), 200

@messages_bp.route('/start', methods=['POST'])
def start_conversation():
    data = request.get_json() or {}
    participants = data.get('participants')
    if not participants or not isinstance(participants, list):
        return jsonify({"error": "participants must be a list"}), 400

    auth = request.headers.get('Authorization', '')
    token = auth.replace('Bearer ', '') if auth.startswith('Bearer ') else None
    if not token:
        return jsonify({"error": "Missing token"}), 401

    try:
        decoded = decode_token(token)
        user_id = decoded.get('sub') or decoded.get('identity')
    except Exception:
        return jsonify({"error": "Invalid token"}), 401

    if user_id not in participants:
        participants.append(user_id)

    db = current_app.db

    # For 1:1 conversations, try to reuse
    if len(participants) == 2:
        existing = db.conversations.find_one({"participants": {"$all": participants, "$size": 2}})
        if existing:
            return jsonify({"conversation_id": str(existing["_id"])}), 200

    conv = {
        "participants": participants,
        "created_at": datetime.utcnow(),
        "last_message": "",  # Explicitly set as empty string
        "last_updated": datetime.utcnow()
    }
    res = db.conversations.insert_one(conv)
    return jsonify({"conversation_id": str(res.inserted_id)}), 201

@messages_bp.route('/<conv_id>/messages', methods=['GET'])
def get_messages(conv_id):
    auth = request.headers.get('Authorization', '')
    token = auth.replace('Bearer ', '') if auth.startswith('Bearer ') else None
    if not token:
        return jsonify({"error": "Missing token"}), 401

    try:
        decoded = decode_token(token)
        user_id = decoded.get('sub') or decoded.get('identity')
    except Exception:
        return jsonify({"error": "Invalid token"}), 401

    db = current_app.db
    try:
        conv_obj_id = ObjectId(conv_id)
    except Exception:
        return jsonify({"error": "Bad conversation id"}), 400

    conv = db.conversations.find_one({"_id": conv_obj_id, "participants": user_id})
    if not conv:
        return jsonify({"error": "Conversation not found or access denied"}), 404

    msgs = list(db.messages.find({"conversation_id": conv_obj_id}).sort("timestamp", 1))
    out = []
    
    for m in msgs:
        # Get sender name
        sender = db.users.find_one({"user_id": str(m["sender_id"])})
        sender_name = sender.get('name', 'Unknown') if sender else 'Unknown'
        
        # Safely handle content with debugging
        raw_content = m.get("content", "")
        debug_content(raw_content, f"get_messages-{m.get('_id')}")
        content = safe_content_handler(raw_content)
        
        # Skip empty or single character messages (likely broken)
        if len(content.strip()) == 0 or (len(content) == 1 and content.isalpha()):
            print(f"⚠️  Skipping potentially broken message: '{content}'")
            continue
        
        out.append({
            "message_id": str(m["_id"]),
            "conversation_id": str(m["conversation_id"]),
            "sender_id": str(m["sender_id"]),
            "sender_name": sender_name,
            "content": content,
            "timestamp": m["timestamp"].isoformat() if m.get("timestamp") else datetime.utcnow().isoformat(),
            "read_by": [str(u) for u in m.get("read_by", [])]
        })
    
    print(f"📨 Returning {len(out)} messages for conversation {conv_id}")
    return jsonify({"messages": out}), 200

@messages_bp.route('/<conv_id>/send', methods=['POST'])
def send_message_rest(conv_id):
    data = request.get_json() or {}
    raw_content = data.get("content", "")
    
    # Debug incoming content
    debug_content(raw_content, "send_message_rest-input")
    
    # Safely handle and validate content
    content = safe_content_handler(raw_content).strip()
    
    if not content:
        return jsonify({"error": "Empty message"}), 400
    
    # Additional validation
    if len(content) < 1:
        return jsonify({"error": "Message too short"}), 400

    auth = request.headers.get('Authorization', '')
    token = auth.replace('Bearer ', '') if auth.startswith('Bearer ') else None
    if not token:
        return jsonify({"error": "Missing token"}), 401

    try:
        decoded = decode_token(token)
        user_id = decoded.get('sub') or decoded.get('identity')
    except Exception:
        return jsonify({"error": "Invalid token"}), 401

    db = current_app.db
    try:
        conv_obj_id = ObjectId(conv_id)
    except Exception:
        return jsonify({"error": "Bad conversation id"}), 400

    now = datetime.utcnow()

    # Store message with explicit string content
    msg = {
        "conversation_id": conv_obj_id,
        "sender_id": str(user_id),
        "content": str(content),  # FORCE string type
        "timestamp": now,
        "read_by": [str(user_id)]
    }
    
    print(f"💾 Storing message: {msg}")
    res = db.messages.insert_one(msg)

    # Update conversation
    db.conversations.update_one(
        {"_id": conv_obj_id},
        {"$set": {"last_message": str(content), "last_updated": now}}
    )

    # Get sender name
    sender = db.users.find_one({"user_id": str(user_id)})
    sender_name = sender.get('name', 'Unknown') if sender else 'Unknown'

    msg_out = {
        "message_id": str(res.inserted_id),
        "conversation_id": str(conv_id),
        "sender_id": str(user_id),
        "sender_name": sender_name,
        "content": str(content),  # FORCE string type
        "timestamp": now.isoformat()
    }

    try:
        socketio.emit('new_message', msg_out, room=str(conv_obj_id))
        print(f"📡 Emitted message via socket: {msg_out}")
    except Exception as e:
        print(f"❌ Socket emit error: {e}")

    return jsonify({"message": "sent", "data": msg_out}), 201

# ---------- Socket.IO handlers ----------

@socketio.on('connect')
def on_connect(auth):
    try:
        token = None
        if isinstance(auth, dict):
            token = auth.get('token')
        if not token:
            token = request.args.get('token')

        if not token:
            print("❌ No token provided for socket connection")
            return False

        decoded = decode_token(token)
        user_id = str(decoded.get('sub') or decoded.get('identity'))
        print(f"✅ Socket connected for user: {user_id}")

        db = current_app.db
        convs = db.conversations.find({"participants": user_id})
        for c in convs:
            join_room(str(c["_id"]))
            print(f"🏠 User {user_id} joined room: {str(c['_id'])}")

        emit('connected', {'message': 'connected', 'user_id': user_id})
        return True
    except Exception as e:
        print(f"❌ Socket connection error: {e}")
        traceback.print_exc()
        return False

@socketio.on('join_conversation')
def on_join_conversation(data):
    conv_id = data.get('conversation_id')
    try:
        join_room(str(conv_id))
        emit('joined', {'conversation_id': str(conv_id)})
        print(f"🏠 User joined conversation room: {conv_id}")
    except Exception as e:
        print(f"❌ Error joining conversation: {e}")

@socketio.on('leave_conversation')
def on_leave_conversation(data):
    conv_id = data.get('conversation_id')
    try:
        leave_room(str(conv_id))
        print(f"🏠 User left conversation room: {conv_id}")
    except Exception as e:
        print(f"❌ Error leaving conversation: {e}")

@socketio.on('send_message')
def on_send_message(data):
    try:
        token = None
        if isinstance(data, dict) and data.get('token'):
            token = data.get('token')
        if not token:
            token = request.args.get('token')
        if not token:
            emit('error', {'error': 'missing token'})
            return

        decoded = decode_token(token)
        user_id = str(decoded.get('sub') or decoded.get('identity'))

        conv_id = data.get('conversation_id')
        raw_content = data.get('content') or ''
        
        # Debug incoming socket content
        debug_content(raw_content, "socket_send_message-input")
        
        # Safely handle content
        content = safe_content_handler(raw_content).strip()
        
        if not conv_id or not content:
            emit('error', {'error': 'bad payload'})
            return

        print(f"💬 Socket message from user {user_id} in conversation {conv_id}: '{content}'")

        db = current_app.db
        conv_obj_id = ObjectId(conv_id)
        now = datetime.utcnow()

        msg = {
            "conversation_id": conv_obj_id,
            "sender_id": str(user_id),
            "content": str(content),  # FORCE string type
            "timestamp": now,
            "read_by": [str(user_id)]
        }
        
        print(f"💾 Socket storing message: {msg}")
        res = db.messages.insert_one(msg)

        db.conversations.update_one(
            {"_id": conv_obj_id},
            {"$set": {"last_message": str(content), "last_updated": now}}
        )

        # Get sender name
        sender = db.users.find_one({"user_id": str(user_id)})
        sender_name = sender.get('name', 'Unknown') if sender else 'Unknown'

        msg_out = {
            "message_id": str(res.inserted_id),
            "conversation_id": str(conv_id),
            "sender_id": str(user_id),
            "sender_name": sender_name,
            "content": str(content),  # FORCE string type
            "timestamp": now.isoformat()
        }

        print(f"📤 Socket broadcasting message to room {str(conv_obj_id)}: {msg_out}")
        socketio.emit('new_message', msg_out, room=str(conv_obj_id))
        
    except Exception as e:
        print(f"❌ Send message error: {e}")
        traceback.print_exc()
        emit('error', {'error': 'server error'})