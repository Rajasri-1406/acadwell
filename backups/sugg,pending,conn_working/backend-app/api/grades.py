# app/api/grades.py
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import pandas as pd
import datetime

students_bp = Blueprint("students_bp", __name__)
teacher_bp = Blueprint("teacher_bp", __name__)

ALLOWED_EXTENSIONS = {"csv", "xlsx"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


# ------------------------ Student: Fetch grades ------------------------
@students_bp.route("/my_grades", methods=["GET"])
@jwt_required()
def my_grades():
    student_id = get_jwt_identity()
    try:
        grades = list(current_app.db.grades.find({"studentId": student_id}))
        result = []
        for g in grades:
            result.append({
                "subject": g.get("subject"),
                "marks": g.get("marks"),
                "teacherName": g.get("teacherName"),
                "uploadedAt": g.get("uploadedAt").isoformat() if g.get("uploadedAt") else None,
                "fileName": g.get("fileName", "Unknown File")
            })
        return jsonify({"success": True, "grades": result}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# ------------------------ Teacher: Upload grades ------------------------
@teacher_bp.route("/upload_grades", methods=["POST"])
@jwt_required()
def upload_grades():
    teacher_id = get_jwt_identity()
    teacher = current_app.db.users.find_one({"id": teacher_id})
    teacher_name = teacher.get("name", "Unknown Teacher")

    if "file" not in request.files:
        return jsonify({"success": False, "message": "No file part"}), 400

    file = request.files["file"]
    if file.filename == "" or not allowed_file(file.filename):
        return jsonify({"success": False, "message": "Invalid file"}), 400

    filename = secure_filename(file.filename)

    try:
        # Read Excel or CSV
        if filename.endswith(".csv"):
            df = pd.read_csv(file)
        else:
            df = pd.read_excel(file)

        uploaded_count = 0
        uploaded_time = datetime.datetime.utcnow()

        for _, row in df.iterrows():
            rollno = str(row["rollno"]).strip()
            subject = str(row["subject"]).strip()
            marks = row["marks"]

            student = current_app.db.users.find_one({"regNumber": rollno, "role": "student"})
            if student:
                current_app.db.grades.insert_one({
                    "studentId": student["id"],
                    "subject": subject,
                    "marks": marks,
                    "teacherId": teacher_id,
                    "teacherName": teacher_name,
                    "uploadedAt": uploaded_time,   # same timestamp for all rows in this file
                    "fileName": filename
                })
                uploaded_count += 1

        return jsonify({
            "success": True,
            "message": f"{uploaded_count} grades uploaded successfully",
        }), 200

    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# ------------------------ Teacher: Fetch upload history ------------------------
@teacher_bp.route("/my_uploads", methods=["GET"])
@jwt_required()
def my_uploads():
    teacher_id = get_jwt_identity()
    try:
        grades = list(current_app.db.grades.find({"teacherId": teacher_id}))
        
        # Group by file name and store latest uploadedAt
        history = {}
        for g in grades:
            fname = g.get("fileName", "Unknown File")
            time = g.get("uploadedAt")
            if fname not in history or (time and time > history[fname]):
                history[fname] = time

        result = [
            {
                "fileName": fname,
                "uploadedAt": history[fname].isoformat() if history[fname] else None
            }
            for fname in history
        ]

        return jsonify({"success": True, "files": result}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
