from flask import Blueprint, jsonify, current_app
from flask_jwt_extended import jwt_required

groups_bp = Blueprint("groups_bp", __name__, url_prefix="/api/groups")

@groups_bp.route("/random-teachers", methods=["GET"])
@jwt_required()
def random_teachers():
    teachers = list(current_app.db.users.find({"role": "teacher"}, {"_id": 1, "name": 1}))
    return jsonify({"status": "success", "teachers": teachers})

@groups_bp.route("/random-students", methods=["GET"])
@jwt_required()
def random_students():
    students = list(current_app.db.users.find({"role": "student"}, {"_id": 1, "name": 1}))
    return jsonify({"status": "success", "students": students})
