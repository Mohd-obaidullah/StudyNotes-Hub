# from flask import Blueprint, jsonify, request
# from middleware.auth import admin_required
# from models.user import get_all_users, set_role
# from models.note import top_selling_notes
# from models.purchase import get_all_orders
# from models.payment import get_revenue_stats, monthly_revenue
# from models.admin_log import get_recent_logs
# from database.connection import get_db
# from bson import objectId

# admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")   # extra api for production
# @admin_bp.route("/dashboard", methods=["GET"])
# @admin_required
# def dashboard():
#     db = get_db()
#     total_users = db.users.count_documents({})
#     total_notes = db.notes.count_documents({})
#     total_orders = db.purchases.count_documents({})
#     revenue = get_revenue_stats()
#     top_notes = top_selling_notes()
#     recent_logs = get_recent_logs(10)

#     def _s(doc):
#         d = dict(doc)
#         d["_id"] = str(d["_id"])
#         for k in ("user_id", "note_id", "admin_id"):
#             if k in d:
#                 d[k] = str(d[k])
#         return d

#     return jsonify({
#         "total_users": total_users,
#         "total_notes": total_notes,
#         "total_orders": total_orders,
#         "total_revenue": revenue.get("total", 0),
#         "top_notes": [_s(n) for n in top_notes],
#         "recent_logs": [_s(l) for l in recent_logs],
#     })

# @admin_bp.route("/revenue/monthly", methods=["GET"])
# @admin_required
# def monthly():
#     data = monthly_revenue()
#     return jsonify({"monthly": data})

# @admin_bp.route("/users", methods=["GET"])
# @admin_required
# def users():
#     page = int(request.args.get("page", 1))
#     all_users, total = get_all_users(page=page)
#     def _s(u):
#         d = dict(u)
#         d["_id"] = str(d["_id"])
#         return d
#     return jsonify({"users": [_s(u) for u in all_users], "total": total})

# @admin_bp.route("/users/<user_id>/role", methods=["PUT"])
# @admin_required
# def change_role(user_id):
#     data = request.get_json(force=True)
#     role = data.get("role")
#     if role not in ("student", "admin"):
#         return jsonify({"error": "Invalid role"}), 400
#     set_role(user_id, role)
#     return jsonify({"message": "Role updated"})

# @admin_bp.route("/orders", methods=["GET"])
# @admin_required
# def orders():
#     page = int(request.args.get("page", 1))
#     all_orders, total = get_all_orders(page=page)
#     def _s(o):
#         d = dict(o)
#         d["_id"] = str(d["_id"])
#         d["user_id"] = str(d["user_id"])
#         d["note_id"] = str(d["note_id"])
#         return d
#     return jsonify({"orders": [_s(o) for o in all_orders], "total": total})

# @admin_bp.route("/categories", methods=["GET"])
# @admin_required
# def list_categories():
#     from models.category import get_categories
#     cats = get_categories()
#     for c in cats:
#         c["_id"] = str(c["_id"])
#     return jsonify({"categories": cats})

# @admin_bp.route("/categories", methods=["POST"])
# @admin_required
# def add_category():
#     data = request.get_json(force=True)
#     from models.category import create_category
#     cat_id = create_category(data.get("name", "").strip())
#     return jsonify({"id": cat_id}), 201

# @admin_bp.route("/categories/<cat_id>", methods=["DELETE"])
# @admin_required
# def remove_category(cat_id):
#     from models.category import delete_category
#     delete_category(cat_id)
#     return jsonify({"message": "Deleted"})
# #=============
# #extra added for admin messages
# @admin_bp.route("/contacts", methods=["GET"])
# @admin_required
# def get_contacts():
#     db = get_db()

#     contacts = list(
#         db.contacts.find()
#         .sort("created_at", -1)
#     )

#     for contact in contacts:
#         contact["_id"] = str(contact["_id"])

#     return jsonify({
#         "total": len(contacts),
#         "contacts": contacts
#     })

# #=========================
# @admin_bp.route("/contacts/<contact_id>", methods=["DELETE"])
# @admin_required
# def delete_contact(contact_id):
#     db = get_db()

#     result = db.contacts.delete_one({
#         "_id": ObjectId(contact_id)
#     })

#     if result.deleted_count == 0:
#         return jsonify({"error": "Message not found"}), 404

#     return jsonify({
#         "message": "Contact deleted successfully"
#     })

# from flask import Blueprint, jsonify, request
# from bson import ObjectId

# from middleware.auth import admin_required
# from models.user import get_all_users, set_role
# from models.note import top_selling_notes
# from models.purchase import get_all_orders
# from models.payment import get_revenue_stats, monthly_revenue
# from models.admin_log import get_recent_logs
# from database.connection import get_db


# admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")


# # ================= Dashboard =================

# @admin_bp.route("/dashboard", methods=["GET"])
# @admin_required
# def dashboard():
#     db = get_db()

#     total_users = db.users.count_documents({})
#     total_notes = db.notes.count_documents({})
#     total_orders = db.purchases.count_documents({})

#     revenue = get_revenue_stats()
#     top_notes = top_selling_notes()
#     recent_logs = get_recent_logs(10)

#     def serialize(doc):
#         data = dict(doc)
#         data["_id"] = str(data["_id"])

#         for field in ("user_id", "note_id", "admin_id"):
#             if field in data:
#                 data[field] = str(data[field])

#         return data

#     return jsonify({
#         "total_users": total_users,
#         "total_notes": total_notes,
#         "total_orders": total_orders,
#         "total_revenue": revenue.get("total", 0),
#         "top_notes": [serialize(note) for note in top_notes],
#         "recent_logs": [serialize(log) for log in recent_logs]
#     })


# # ================= Revenue =================

# @admin_bp.route("/revenue/monthly", methods=["GET"])
# @admin_required
# def revenue_monthly():
#     return jsonify({
#         "monthly": monthly_revenue()
#     })


# # ================= Users =================

# @admin_bp.route("/users", methods=["GET"])
# @admin_required
# def users():
#     page = int(request.args.get("page", 1))

#     users_list, total = get_all_users(page=page)

#     result = []

#     for user in users_list:
#         user["_id"] = str(user["_id"])
#         result.append(user)

#     return jsonify({
#         "users": result,
#         "total": total
#     })


# @admin_bp.route("/users/<user_id>/role", methods=["PUT"])
# @admin_required
# def change_role(user_id):
#     data = request.get_json(force=True)

#     role = data.get("role")

#     if role not in ["student", "admin"]:
#         return jsonify({
#             "error": "Invalid role"
#         }), 400

#     set_role(user_id, role)

#     return jsonify({
#         "message": "Role updated successfully"
#     })


# # ================= Orders =================

# @admin_bp.route("/orders", methods=["GET"])
# @admin_required
# def orders():
#     page = int(request.args.get("page", 1))

#     orders_list, total = get_all_orders(page=page)

#     result = []

#     for order in orders_list:
#         order["_id"] = str(order["_id"])
#         order["user_id"] = str(order["user_id"])
#         order["note_id"] = str(order["note_id"])

#         result.append(order)

#     return jsonify({
#         "orders": result,
#         "total": total
#     })


# # ================= Categories =================

# @admin_bp.route("/categories", methods=["GET"])
# @admin_required
# def get_categories():
#     from models.category import get_categories

#     categories = get_categories()

#     for category in categories:
#         category["_id"] = str(category["_id"])

#     return jsonify({
#         "categories": categories
#     })


# @admin_bp.route("/categories", methods=["POST"])
# @admin_required
# def create_category():
#     from models.category import create_category

#     data = request.get_json(force=True)

#     category_id = create_category(
#         data.get("name", "").strip()
#     )

#     return jsonify({
#         "id": category_id
#     }), 201


# @admin_bp.route("/categories/<category_id>", methods=["DELETE"])
# @admin_required
# def remove_category(category_id):
#     from models.category import delete_category

#     delete_category(category_id)

#     return jsonify({
#         "message": "Category deleted"
#     })


# # ================= Contact Messages =================

# @admin_bp.route("/contacts", methods=["GET"])
# @admin_required
# def get_contacts():
#     db = get_db()

#     contacts = list(
#         db.contacts.find()
#         .sort("created_at", -1)
#     )

#     for contact in contacts:
#         contact["_id"] = str(contact["_id"])

#     return jsonify({
#         "total": len(contacts),
#         "contacts": contacts
#     })


# @admin_bp.route("/contacts/<contact_id>", methods=["DELETE"])
# @admin_required
# def delete_contact(contact_id):
#     db = get_db()

#     try:
#         result = db.contacts.delete_one({
#             "_id": ObjectId(contact_id)
#         })

#         if result.deleted_count == 0:
#             return jsonify({
#                 "error": "Message not found"
#             }), 404

#         return jsonify({
#             "message": "Contact deleted successfully"
#         })

#     except Exception:
#         return jsonify({
#             "error": "Invalid contact ID"
#         }), 400


import logging

from flask import (
    Blueprint,
    jsonify,
    request,
    session,
)

from bson import ObjectId
from bson.errors import InvalidId

from middleware.auth import admin_required

from models.user import (
    get_all_users,
    set_role,
)

from models.note import (
    top_selling_notes,
)

from models.purchase import (
    get_all_orders,
)

from models.payment import (
    get_revenue_stats,
    monthly_revenue,
)

from models.admin_log import (
    get_recent_logs,
    log_action,
)

from database.connection import (
    get_db,
)


logger = logging.getLogger(__name__)


admin_bp = Blueprint(
    "admin",
    __name__,
    url_prefix="/api/admin",
)


# =========================================
# Helpers
# =========================================

def get_page():
    """
    Safe pagination parser.
    """

    try:
        page = int(
            request.args.get("page", 1)
        )

        if page < 1:
            return 1

        return page

    except (ValueError, TypeError):
        return 1


def serialize_document(doc):
    """
    Convert Mongo ObjectId fields to strings.
    """

    data = dict(doc)

    if "_id" in data:
        data["_id"] = str(data["_id"])

    for field in (
        "user_id",
        "note_id",
        "admin_id",
    ):
        if field in data:
            data[field] = str(data[field])

    return data


# =========================================
# Dashboard
# =========================================

@admin_bp.route("/dashboard", methods=["GET"])
@admin_required
def dashboard():

    try:

        db = get_db()

        total_users = db.users.count_documents({})
        total_notes = db.notes.count_documents({})
        total_orders = db.purchases.count_documents({})

        revenue = get_revenue_stats()

        return jsonify({
            "total_users": total_users,
            "total_notes": total_notes,
            "total_orders": total_orders,
            "total_revenue": revenue.get(
                "total",
                0,
            ),
            "top_notes": [
                serialize_document(note)
                for note in top_selling_notes()
            ],
            "recent_logs": [
                serialize_document(log)
                for log in get_recent_logs(10)
            ],
        })


    except Exception as error:

        logger.exception(
            "Admin dashboard failed: %s",
            error,
        )

        return jsonify({
            "error": "Unable to load dashboard"
        }), 500


# =========================================
# Revenue
# =========================================

@admin_bp.route(
    "/revenue/monthly",
    methods=["GET"],
)
@admin_required
def revenue_monthly():

    try:

        return jsonify({
            "monthly": monthly_revenue()
        })

    except Exception as error:

        logger.exception(
            "Revenue fetch failed: %s",
            error,
        )

        return jsonify({
            "error": "Unable to load revenue"
        }), 500
    
    # =========================================
# Users Management
# =========================================

@admin_bp.route("/users", methods=["GET"])
@admin_required
def users():

    try:

        page = get_page()

        users_list, total = get_all_users(
            page=page
        )


        result = []

        for user in users_list:

            result.append({
                "_id": str(user["_id"]),
                "name": user.get("name", ""),
                "email": user.get("email", ""),
                "role": user.get(
                    "role",
                    "student"
                ),
                "profile_picture": user.get(
                    "profile_picture",
                    ""
                ),
                "created_at": user.get(
                    "created_at"
                ),
            })


        return jsonify({
            "users": result,
            "total": total,
            "page": page,
        })


    except Exception as error:

        logger.exception(
            "Failed to fetch users: %s",
            error,
        )

        return jsonify({
            "error": "Unable to load users"
        }), 500


# =========================================
# Change User Role
# =========================================

@admin_bp.route(
    "/users/<user_id>/role",
    methods=["PUT"]
)
@admin_required
def change_role(user_id):

    try:

        data = request.get_json(
            silent=True
        ) or {}


        role = data.get(
            "role",
            ""
        ).strip()


        if role not in (
            "student",
            "admin",
        ):
            return jsonify({
                "error": "Invalid role"
            }), 400


        try:
            ObjectId(user_id)

        except InvalidId:

            return jsonify({
                "error": "Invalid user ID"
            }), 400


        set_role(
            user_id,
            role,
        )


        # Create audit log
        log_action(
            session["user_id"],
            f"Changed role of user {user_id} to {role}",
        )


        logger.info(
            "Admin %s changed role of %s to %s",
            session["user_id"],
            user_id,
            role,
        )


        return jsonify({
            "message": "User role updated successfully"
        })


    except Exception as error:

        logger.exception(
            "Role update failed: %s",
            error,
        )

        return jsonify({
            "error": "Failed to update role"
        }), 500
    # =========================================
# Categories Management
# =========================================

@admin_bp.route("/categories", methods=["GET"])
@admin_required
def categories():

    try:

        from models.category import get_categories


        categories = get_categories()


        result = [
            {
                "_id": str(category["_id"]),
                "name": category.get("name", ""),
                "slug": category.get("slug", ""),
            }
            for category in categories
        ]


        return jsonify({
            "categories": result
        })


    except Exception as error:

        logger.exception(
            "Failed to load categories: %s",
            error,
        )

        return jsonify({
            "error": "Unable to load categories"
        }), 500


# =========================================
# Create Category
# =========================================

@admin_bp.route("/categories", methods=["POST"])
@admin_required
def create_new_category():

    try:

        from models.category import create_category


        data = request.get_json(
            silent=True
        ) or {}


        name = data.get(
            "name",
            ""
        ).strip()


        if not name:
            return jsonify({
                "error": "Category name is required"
            }), 400


        if len(name) > 50:
            return jsonify({
                "error": "Category name is too long"
            }), 400


        category_id = create_category(
            name
        )


        log_action(
            session["user_id"],
            f"Created category {name}",
        )


        logger.info(
            "Admin %s created category %s",
            session["user_id"],
            name,
        )


        return jsonify({
            "id": category_id
        }), 201


    except Exception as error:

        logger.exception(
            "Category creation failed: %s",
            error,
        )

        return jsonify({
            "error": "Unable to create category"
        }), 500


# =========================================
# Delete Category
# =========================================

@admin_bp.route("/categories/<category_id>", methods=["DELETE"])
@admin_required
def remove_category(category_id):

    try:

        from models.category import delete_category


        deleted = delete_category(
            category_id
        )


        if not deleted:

            return jsonify({
                "error": "Category not found"
            }), 404


        log_action(
            session["user_id"],
            f"Deleted category {category_id}",
        )


        logger.info(
            "Admin %s deleted category %s",
            session["user_id"],
            category_id,
        )


        return jsonify({
            "message": "Category deleted successfully"
        })


    except Exception as error:

        logger.exception(
            "Category deletion failed: %s",
            error,
        )

        return jsonify({
            "error": "Unable to delete category"
        }), 500


# =========================================
# Contact Messages
# =========================================

@admin_bp.route("/contacts", methods=["GET"])
@admin_required
def contacts():

    try:

        db = get_db()


        messages = list(
            db.contacts
            .find()
            .sort("created_at", -1)
        )


        result = []


        for message in messages:

            result.append({
                "_id": str(message["_id"]),
                "name": message.get("name", ""),
                "email": message.get("email", ""),
                "message": message.get("message", ""),
                "created_at": message.get("created_at"),
            })


        return jsonify({
            "total": len(result),
            "contacts": result,
        })


    except Exception as error:

        logger.exception(
            "Failed to fetch contacts: %s",
            error,
        )

        return jsonify({
            "error": "Unable to load contacts"
        }), 500


# =========================================
# Delete Contact Message
# =========================================

@admin_bp.route("/contacts/<contact_id>", methods=["DELETE"])
@admin_required
def remove_contact(contact_id):

    try:

        db = get_db()


        try:
            object_id = ObjectId(
                contact_id
            )

        except InvalidId:

            return jsonify({
                "error": "Invalid contact ID"
            }), 400


        result = db.contacts.delete_one({
            "_id": object_id
        })


        if result.deleted_count == 0:

            return jsonify({
                "error": "Message not found"
            }), 404


        log_action(
            session["user_id"],
            f"Deleted contact message {contact_id}",
        )


        logger.info(
            "Admin %s deleted contact %s",
            session["user_id"],
            contact_id,
        )


        return jsonify({
            "message": "Contact deleted successfully"
        })


    except Exception as error:

        logger.exception(
            "Contact deletion failed: %s",
            error,
        )

        return jsonify({
            "error": "Unable to delete message"
        }), 500