from functools import wraps
from flask import session, jsonify
from models.purchase import has_purchased

def purchase_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        user_id = session.get("user_id")
        note_id = kwargs.get("note_id")
        if not user_id:
            return jsonify({"error": "Login required"}), 401
        if not has_purchased(user_id, note_id):
            return jsonify({"error": "Purchase required to access this content"}), 403
        return f(*args, **kwargs)
    return decorated
