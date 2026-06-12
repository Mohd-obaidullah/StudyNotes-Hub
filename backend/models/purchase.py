from datetime import datetime
from bson import ObjectId
from database.connection import get_db

def create_purchase(user_id, note_id, payment_id):
    db = get_db()
    doc = {
        "user_id": ObjectId(user_id),
        "note_id": ObjectId(note_id),
        "payment_id": payment_id,
        "purchase_date": datetime.utcnow(),
    }
    db.purchases.insert_one(doc)
    db.notes.update_one({"_id": ObjectId(note_id)}, {"$inc": {"purchases_count": 1}})

def has_purchased(user_id, note_id):
    db = get_db()
    try:
        return db.purchases.find_one({"user_id": ObjectId(user_id), "note_id": ObjectId(note_id)}) is not None
    except Exception:
        return False

def get_user_purchases(user_id):
    db = get_db()
    purchases = list(db.purchases.find({"user_id": ObjectId(user_id)}).sort("purchase_date", -1))
    result = []
    for p in purchases:
        note = db.notes.find_one({"_id": p["note_id"]}, {"pdf_file": 0})
        result.append({"purchase": p, "note": note})
    return result

def get_all_orders(page=1, per_page=20):
    db = get_db()
    skip = (page - 1) * per_page
    orders = list(db.purchases.find({}).sort("purchase_date", -1).skip(skip).limit(per_page))
    total = db.purchases.count_documents({})
    return orders, total
