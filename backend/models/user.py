from datetime import datetime
from bson import ObjectId
from database.connection import get_db

def find_or_create_user(google_id, name, email, picture):
    db = get_db()
    user = db.users.find_one({"google_id": google_id})
    if user:
        db.users.update_one({"_id": user["_id"]}, {"$set": {"name": name, "profile_picture": picture}})
        return db.users.find_one({"_id": user["_id"]})
    doc = {
        "google_id": google_id,
        "name": name,
        "email": email,
        "profile_picture": picture,
        "role": "student",
        "created_at": datetime.utcnow(),
    }
    result = db.users.insert_one(doc)
    return db.users.find_one({"_id": result.inserted_id})

def get_user_by_id(user_id):
    db = get_db()
    try:
        return db.users.find_one({"_id": ObjectId(user_id)})
    except Exception:
        return None

def get_all_users(page=1, per_page=20):
    db = get_db()
    skip = (page - 1) * per_page
    users = list(db.users.find({}, {"google_id": 0}).sort("created_at", -1).skip(skip).limit(per_page))
    total = db.users.count_documents({})
    return users, total

def set_role(user_id, role):
    db = get_db()
    db.users.update_one({"_id": ObjectId(user_id)}, {"$set": {"role": role}})
