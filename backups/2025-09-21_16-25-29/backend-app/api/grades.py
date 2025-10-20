from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
import pandas as pd
from app import mongo

grades_bp = Blueprint("grades", __name__)

@grades_bp.route("/teacher/upload_grades", methods=["POST"])
@jwt_required()
def upload_grades():
    file = request.files.get("file")
    if not file:
        return jsonify({"error": "No file uploaded"}), 400

    try:
        # read CSV or Excel
        if file.filename.endswith(".csv"):
            df = pd.read_csv(file)
        else:
            df = pd.read_excel(file)

        # assume columns: rollno, subject, marks
        records = df.to_dict(orient="records")
        for r in records:
            mongo.db.grades.update_one(
                {"rollno": str(r["rollno"])},
                {"$push": {"grades": {"subject": r["subject"], "marks": r["marks"]}}},
                upsert=True,
            )

        return jsonify({"success": True, "message": "Grades uploaded successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@grades_bp.route("/student/my_grades", methods=["GET"])
@jwt_required()
def my_grades():
    user_id = get_jwt_identity()
    student = mongo.db.users.find_one({"_id": user_id})
    if not student:
        return jsonify({"error": "User not found"}), 404

    rollno = student.get("rollno")
    grades = mongo.db.grades.find_one({"rollno": str(rollno)})
    return jsonify({"success": True, "grades": grades.get("grades", [])})
