from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson import ObjectId
from datetime import datetime

community_bp = Blueprint("community", __name__, url_prefix="/api/community")

# ---------------- Helper ----------------
def serialize_post(post):
    """Convert Mongo ObjectIds to strings for JSON response"""
    post["_id"] = str(post["_id"])
    post["answers"] = [
        {**a, "_id": str(a["_id"])} for a in post.get("answers", [])
    ]
    return post

# ---------------- GET ALL POSTS ----------------
@community_bp.route("", methods=["GET"])
@jwt_required()
def get_posts():
    user_id = get_jwt_identity()
    user = current_app.db.users.find_one({"id": user_id})
    if not user:
        return jsonify({"error": "User not found"}), 404

    filter_type = request.args.get("filter", "recent")
    posts = []

    if filter_type == "connections":
        connections_cursor = current_app.db.connections.find({
            "$or": [{"user1": user_id}, {"user2": user_id}]
        })
        connection_ids = [
            doc["user2"] if doc["user1"] == user_id else doc["user1"]
            for doc in connections_cursor
        ]
        if connection_ids:
            posts = list(current_app.db.community_posts.find({
                "userId": {"$in": connection_ids}
            }).sort("createdAt", -1))

    elif filter_type == "mine":
        posts = list(current_app.db.community_posts.find({
            "$or": [
                {"userId": user_id},
                {"answers.userId": user_id}
            ]
        }).sort("createdAt", -1))

    else:  # recent
        posts = list(current_app.db.community_posts.find().sort("createdAt", -1))

    return jsonify([serialize_post(p) for p in posts]), 200

# ---------------- POST QUESTION ----------------
@community_bp.route("", methods=["POST"])
@jwt_required()
def post_question():
    data = request.json
    question_text = data.get("question")
    is_anonymous = data.get("isAnonymous", True)

    if not question_text:
        return jsonify({"error": "Question is required"}), 400

    user_id = get_jwt_identity()
    user = current_app.db.users.find_one({"id": user_id})
    if not user:
        return jsonify({"error": "User not found"}), 404

    posted_by = user.get("anonId") if is_anonymous else user.get("name")

    post = {
        "question": question_text,
        "postedBy": posted_by,
        "userId": user_id,
        "isAnonymous": is_anonymous,
        "likes": 0,
        "answers": [],
        "acceptedAnswerId": None,
        "createdAt": datetime.utcnow(),
    }

    res = current_app.db.community_posts.insert_one(post)
    post["_id"] = str(res.inserted_id)
    return jsonify(post), 201

# ---------------- POST ANSWER ----------------
@community_bp.route("/<post_id>/answer", methods=["POST"])
@jwt_required()
def post_answer(post_id):
    data = request.json
    text = data.get("text")
    is_anonymous = data.get("isAnonymous", True)

    if not text:
        return jsonify({"error": "Answer text is required"}), 400

    user_id = get_jwt_identity()
    user = current_app.db.users.find_one({"id": user_id})
    if not user:
        return jsonify({"error": "User not found"}), 404

    posted_by = user.get("anonId") if is_anonymous else user.get("name")

    answer = {
        "_id": ObjectId(),
        "text": text,
        "postedBy": posted_by,
        "userId": user_id,
        "isAnonymous": is_anonymous,
        "accepted": False,
        "createdAt": datetime.utcnow(),
    }

    res = current_app.db.community_posts.update_one(
        {"_id": ObjectId(post_id)},
        {"$push": {"answers": answer}}
    )

    if res.modified_count == 0:
        return jsonify({"error": "Post not found"}), 404

    answer["_id"] = str(answer["_id"])
    return jsonify(answer), 201

# ---------------- ACCEPT AN ANSWER ----------------
@community_bp.route("/<post_id>/accept/<answer_id>", methods=["PUT"])
@jwt_required()
def accept_answer(post_id, answer_id):
    user_id = get_jwt_identity()
    data = request.json or {}
    credits = int(data.get("credits", 10))

    post = current_app.db.community_posts.find_one({"_id": ObjectId(post_id)})
    if not post:
        return jsonify({"error": "Post not found"}), 404

    if post["userId"] != user_id:
        return jsonify({"error": "You cannot accept answers for others' questions"}), 403

    if post.get("acceptedAnswerId"):
        return jsonify({"error": "An answer is already accepted"}), 400

    res = current_app.db.community_posts.update_one(
        {"_id": ObjectId(post_id), "answers._id": ObjectId(answer_id)},
        {"$set": {"answers.$.accepted": True, "acceptedAnswerId": answer_id}}
    )
    if res.modified_count == 0:
        return jsonify({"error": "Answer not found"}), 404

    # Award credits
    post = current_app.db.community_posts.find_one({"_id": ObjectId(post_id)})
    accepted_answer = next(
        (a for a in post.get("answers", []) if str(a["_id"]) == answer_id),
        None
    )

    if accepted_answer:
        answerer_id = accepted_answer["userId"]

        # update user credits
        current_app.db.users.update_one(
            {"id": answerer_id},
            {"$inc": {"credits": credits}}
        )

        # add badge
        current_app.db.badges.insert_one({
            "userId": answerer_id,
            "type": "Accepted Answer",
            "points": credits,
            "postId": post_id,
            "answerId": answer_id,
            "createdAt": datetime.utcnow()
        })

    return jsonify({"msg": f"Answer accepted and {credits} credits awarded"}), 200

# ---------------- LIKE POST ----------------
@community_bp.route("/<post_id>/like", methods=["PUT"])
@jwt_required()
def like_post(post_id):
    res = current_app.db.community_posts.update_one(
        {"_id": ObjectId(post_id)},
        {"$inc": {"likes": 1}}
    )
    if res.modified_count == 0:
        return jsonify({"error": "Post not found"}), 404
    return jsonify({"msg": "Liked"}), 200
