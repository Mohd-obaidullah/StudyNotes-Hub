from datetime import datetime
from bson import ObjectId
from database.connection import get_db

def log_action(admin_id, action):
    db = get_db()
    db.admin_logs.insert_one({
        "admin_id": ObjectId(admin_id),
        "action": action,
        "timestamp": datetime.utcnow(),
    })

def get_recent_logs(limit=50):
    db = get_db()
    return list(db.admin_logs.find({}).sort("timestamp", -1).limit(limit))
