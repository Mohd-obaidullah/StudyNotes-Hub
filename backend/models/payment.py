from datetime import datetime
from bson import ObjectId
from database.connection import get_db

def create_payment_record(user_id, note_id, amount, razorpay_order_id):
    db = get_db()
    doc = {
        "user_id": ObjectId(user_id),
        "note_id": ObjectId(note_id),
        "amount": amount,
        "razorpay_order_id": razorpay_order_id,
        "razorpay_payment_id": None,
        "status": "created",
        "created_at": datetime.utcnow(),
    }
    result = db.payments.insert_one(doc)
    return str(result.inserted_id)

def confirm_payment(razorpay_order_id, razorpay_payment_id):
    db = get_db()
    db.payments.update_one(
        {"razorpay_order_id": razorpay_order_id},
        {"$set": {"razorpay_payment_id": razorpay_payment_id, "status": "paid", "paid_at": datetime.utcnow()}},
    )

def get_revenue_stats():
    db = get_db()
    pipeline = [
        {"$match": {"status": "paid"}},
        {"$group": {"_id": None, "total": {"$sum": "$amount"}, "count": {"$sum": 1}}},
    ]
    result = list(db.payments.aggregate(pipeline))
    return result[0] if result else {"total": 0, "count": 0}

def monthly_revenue():
    db = get_db()
    pipeline = [
        {"$match": {"status": "paid"}},
        {"$group": {
            "_id": {"year": {"$year": "$paid_at"}, "month": {"$month": "$paid_at"}},
            "revenue": {"$sum": "$amount"},
            "count": {"$sum": 1},
        }},
        {"$sort": {"_id.year": -1, "_id.month": -1}},
        {"$limit": 12},
    ]
    return list(db.payments.aggregate(pipeline))
