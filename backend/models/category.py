from bson import ObjectId
from database.connection import get_db
import re

def create_category(name):
    db = get_db()
    slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    existing = db.categories.find_one({"slug": slug})
    if existing:
        return str(existing["_id"])
    result = db.categories.insert_one({"name": name, "slug": slug})
    return str(result.inserted_id)

def get_categories():
    db = get_db()
    return list(db.categories.find({}, {"_id": 1, "name": 1, "slug": 1}))

def delete_category(cat_id):
    db = get_db()
    db.categories.delete_one({"_id": ObjectId(cat_id)})
