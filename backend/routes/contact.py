from flask import Blueprint, request, jsonify
from database.connection import get_db
from datetime import datetime

contact_bp = Blueprint("contact", __name__, url_prefix="/api/contact")

@contact_bp.route("/", methods=["POST"])
def send_message():
    data = request.json

    message = {
        "name": data.get("name"),
        "email": data.get("email"),
        "message": data.get("message"),
        "created_at": datetime.utcnow()
    }

    db = get_db()
    db.contacts.insert_one(message)

    return jsonify({
        "success": True,
        "message": "Message received"
    }), 201