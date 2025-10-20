# app/api/grades.py
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import pandas as pd
import datetime
from io import BytesIO

students_bp = Blueprint("students_bp", __name__)
teacher_bp = Blueprint("teacher_bp", __name__)

ALLOWED_EXTENSIONS = {"csv", "xlsx"}

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def _find_column(df_cols, candidates):
    """Return the first column name in df_cols that contains any candidate token."""
    for c in df_cols:
        for cand in candidates:
            if cand in c:
                return c
    return None

# ---------------- STUDENT: fetch my grades ----------------
@students_bp.route("/my_grades", methods=["GET"])
@jwt_required()
def my_grades():
    try:
        student_id = get_jwt_identity()
        student = current_app.db.users.find_one({"id": student_id, "role": "student"})
        if not student:
            return jsonify({"success": False, "message": "Student not found"}), 404

        reg_no = student.get("regNumber")
        if not reg_no:
            return jsonify({"success": False, "message": "Student has no regNumber"}), 400

        # fetch only documents for this student's regNumber
        grades = list(current_app.db.grades.find({"regNumber": reg_no}))
        result = []
        for g in grades:
            result.append({
                "subject": g.get("subject"),
                "marks": g.get("marks"),
                "teacherName": g.get("teacherName"),
                "uploadedAt": g.get("uploadedAt").isoformat() if g.get("uploadedAt") else None,
                "fileName": g.get("fileName", "Unknown File"),
                "date": g.get("date"),
                "semester": g.get("semester"),
                "department": g.get("department"),
                "testType": g.get("testType")
            })
        return jsonify({"success": True, "grades": result}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500


# ---------------- TEACHER: upload grades ----------------
@teacher_bp.route("/upload_grades", methods=["POST"])
@jwt_required()
def upload_grades():
    """
    Expects multipart/form-data:
      - file: .csv or .xlsx (with rollno, subject, marks columns -- tolerant to names)
      - date, semester, department, testType (as form fields)
    """
    try:
        teacher_id = get_jwt_identity()
        teacher = current_app.db.users.find_one({"id": teacher_id, "role": "teacher"})
        if not teacher:
            return jsonify({"success": False, "message": "Teacher not found"}), 404
        teacher_name = teacher.get("name", "Unknown Teacher")

        if "file" not in request.files:
            return jsonify({"success": False, "message": "No file uploaded"}), 400

        file_storage = request.files["file"]
        if file_storage.filename == "" or not allowed_file(file_storage.filename):
            return jsonify({"success": False, "message": "Invalid or missing file"}), 400

        # form metadata
        date = request.form.get("date")
        semester = request.form.get("semester")
        department = request.form.get("department")
        test_type = request.form.get("testType")

        if not all([date, semester, department, test_type]):
            return jsonify({"success": False, "message": "All fields (date, semester, department, testType) are required"}), 400

        filename = secure_filename(file_storage.filename)

        # Read contents safely into pandas using BytesIO (works for both CSV & Excel)
        file_bytes = file_storage.read()
        buf = BytesIO(file_bytes)

        # use case-insensitive, whitespace tolerant column matching:
        if filename.lower().endswith(".csv"):
            df = pd.read_csv(buf, dtype=str)  # read everything as str to avoid parsing surprises
        else:
            # Excel: let pandas infer types, but convert column names below
            df = pd.read_excel(buf, dtype=str)

        if df.empty:
            return jsonify({"success": False, "message": "Uploaded file is empty"}), 400

        # normalize column names for robust matching
        df.columns = [str(c).strip().lower() for c in df.columns]

        # tolerant column detection
        roll_col = _find_column(df.columns, ["roll", "reg", "regno", "reg_number", "registration"])
        subject_col = _find_column(df.columns, ["subject", "sub"])
        marks_col = _find_column(df.columns, ["mark", "score", "marks", "marks_obtained"])

        missing = []
        if not roll_col:
            missing.append("rollno (or column containing 'roll'/'reg')")
        if not subject_col:
            missing.append("subject")
        if not marks_col:
            missing.append("marks")

        if missing:
            return jsonify({"success": False, "message": f"Missing required columns: {', '.join(missing)}"}), 400

        uploaded_time = datetime.datetime.utcnow()
        inserted = 0

        # iterate rows safely
        for idx, row in df.iterrows():
            # Use .get to be safe — pandas Series.get returns NaN if not present
            raw_roll = row.get(roll_col)
            raw_subject = row.get(subject_col)
            raw_marks = row.get(marks_col)

            if pd.isna(raw_roll) or pd.isna(raw_subject) or pd.isna(raw_marks):
                # skip incomplete rows
                continue

            rollno = str(raw_roll).strip()
            subject = str(raw_subject).strip()
            marks_val = raw_marks
            # try cast numeric marks if possible
            try:
                if isinstance(marks_val, str):
                    marks_val = marks_val.strip()
                    # allow numeric strings like "85.5"
                    if marks_val == "":
                        continue
                    marks_numeric = float(marks_val) if any(ch.isdigit() for ch in marks_val) else marks_val
                else:
                    marks_numeric = float(marks_val)
            except Exception:
                marks_numeric = raw_marks  # fallback to raw if casting fails

            # match student by regNumber
            student = current_app.db.users.find_one({"regNumber": rollno, "role": "student"})
            if not student:
                # skip unknown roll numbers (do not insert)
                continue

            # insert grade doc (store regNumber to allow direct matching later)
            current_app.db.grades.insert_one({
                "studentId": student["id"],
                "regNumber": rollno,
                "subject": subject,
                "marks": marks_numeric,
                "teacherId": teacher_id,
                "teacherName": teacher_name,
                "uploadedAt": uploaded_time,
                "fileName": filename,
                "date": date,
                "semester": semester,
                "department": department,
                "testType": test_type
            })
            inserted += 1

        return jsonify({"success": True, "message": f"{inserted} grades uploaded successfully"}), 200

    except Exception as e:
        # return helpful error message (in prod consider logging and returning generic message)
        return jsonify({"success": False, "message": str(e)}), 500


# ---------------- TEACHER: upload history (for the logged-in teacher only) ----------------
@teacher_bp.route("/my_uploads", methods=["GET"])
@jwt_required()
def my_uploads():
    try:
        teacher_id = get_jwt_identity()
        # fetch only this teacher's uploads
        docs = list(current_app.db.grades.find({"teacherId": teacher_id}))
        # group by file + metadata to produce concise history
        history_map = {}
        for g in docs:
            key = (
                g.get("fileName", "Unknown File"),
                g.get("date"),
                g.get("semester"),
                g.get("department"),
                g.get("testType")
            )
            # keep latest uploadedAt for that key
            existing = history_map.get(key)
            if not existing or (g.get("uploadedAt") and g.get("uploadedAt") > existing["uploadedAt"]):
                history_map[key] = {
                    "fileName": key[0],
                    "date": key[1],
                    "semester": key[2],
                    "department": key[3],
                    "testType": key[4],
                    "uploadedAt": g.get("uploadedAt")
                }

        result = []
        for v in history_map.values():
            result.append({
                "fileName": v["fileName"],
                "date": v["date"],
                "semester": v["semester"],
                "department": v["department"],
                "testType": v["testType"],
                "uploadedAt": v["uploadedAt"].isoformat() if v["uploadedAt"] else None
            })

        return jsonify({"success": True, "files": result}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
