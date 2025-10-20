from flask import Blueprint

# ✅ Import individual blueprints
from app.api.auth import auth_bp
from app.api.questions import questions_bp
from app.api.groups import groups_bp
from app.api.wellness import wellness_bp
from app.api.analytics import analytics_bp
from app.api.chat import chat_bp   # NEW
from app.models import messages_col
api_bp = Blueprint("api", __name__, url_prefix="/api")

# ✅ Register blueprints
api_bp.register_blueprint(auth_bp, url_prefix="/auth")
api_bp.register_blueprint(questions_bp, url_prefix="/questions")
api_bp.register_blueprint(groups_bp, url_prefix="/groups")
api_bp.register_blueprint(wellness_bp, url_prefix="/wellness")
api_bp.register_blueprint(analytics_bp, url_prefix="/analytics")
api_bp.register_blueprint(chat_bp, url_prefix="/chat")   # NEW
result = messages_col.delete_many({})
print("Deleted", result.deleted_count, "messages")