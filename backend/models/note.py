from datetime import datetime
from bson import ObjectId
from database.connection import get_db

def create_note(data):
    db = get_db()
    data["created_at"] = datetime.utcnow()
    data["purchases_count"] = 0
    result = db.notes.insert_one(data)
    return str(result.inserted_id)

def get_notes(category=None, search=None, page=1, per_page=12):
    db = get_db()
    query = {}
    if category:
        query["category"] = category
    if search:
        query["$or"] = [
            {"title": {"$regex": search, "$options": "i"}},
            {"description": {"$regex": search, "$options": "i"}},
        ]
    skip = (page - 1) * per_page
    notes = list(db.notes.find(query).sort("created_at", -1).skip(skip).limit(per_page))
    total = db.notes.count_documents(query)
    return notes, total

def get_note_by_id(note_id):
    db = get_db()
    try:
        return db.notes.find_one({"_id": ObjectId(note_id)})
    except Exception:
        return None

def update_note(note_id, data):
    db = get_db()
    db.notes.update_one({"_id": ObjectId(note_id)}, {"$set": data})

def delete_note(note_id):
    db = get_db()
    db.notes.delete_one({"_id": ObjectId(note_id)})

def top_selling_notes(limit=5):
    db = get_db()
    return list(db.notes.find({}).sort("purchases_count", -1).limit(limit))
