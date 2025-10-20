from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
import uuid

questions_bp = Blueprint("questions", __name__)

# ============================
# Fetch All Questions
# ============================
@questions_bp.route("", methods=["GET"])
@jwt_required()
def get_questions():
    try:
        questions = list(current_app.db.questions.find({}, {"_id": 0}).sort("created_at", -1))
        return jsonify({"success": True, "questions": questions})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# ============================
# Create New Question
# ============================
@questions_bp.route("", methods=["POST"])
@jwt_required()
def create_question():
    try:
        user = get_jwt_identity()
        data = request.get_json()

        question = {
            "id": str(uuid.uuid4()),
            "student_id": user["id"],
            "student_name": data.get("anonymous", False) and "Anonymous" or user["email"].split("@")[0],
            "question": data["question"],
            "answers": [],
            "created_at": datetime.utcnow(),
            "anonymous_id": data.get("anonymous_id")
        }

        current_app.db.questions.insert_one(question)
        return jsonify({"success": True, "question": question, "message": "Question created successfully"}), 201

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# ============================
# Get Single Question + Answers
# ============================
@questions_bp.route("/<question_id>", methods=["GET"])
@jwt_required()
def get_question(question_id):
    try:
        question = current_app.db.questions.find_one({"id": question_id}, {"_id": 0})
        if not question:
            return jsonify({"success": False, "message": "Question not found"}), 404
        return jsonify({"success": True, "question": question})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# ============================
# Answer a Question
# ============================
@questions_bp.route("/<question_id>/answer", methods=["POST"])
@jwt_required()
def answer_question(question_id):
    try:
        user = get_jwt_identity()
        data = request.get_json()

        answer = {
            "sender": user["email"].split("@")[0],
            "text": data["text"],
            "timestamp": datetime.utcnow()
        }

        result = current_app.db.questions.update_one(
            {"id": question_id},
            {"$push": {"answers": answer}}
        )

        if result.modified_count == 0:
            return jsonify({"success": False, "message": "Question not found"}), 404

        return jsonify({"success": True, "answer": answer, "message": "Answer added successfully"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# ============================
# Get My Questions
# ============================
@questions_bp.route("/my", methods=["GET"])
@jwt_required()
def get_my_questions():
    try:
        user = get_jwt_identity()
        questions = list(current_app.db.questions.find({"student_id": user["id"]}, {"_id": 0}))
        return jsonify({"success": True, "questions": questions})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
