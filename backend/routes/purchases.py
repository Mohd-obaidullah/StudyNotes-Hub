# from flask import Blueprint, jsonify, session
# from middleware.auth import login_required
# from models.purchase import get_user_purchases

# purchases_bp = Blueprint("purchases", __name__, url_prefix="/api/purchases")   #extra api for production

# @purchases_bp.route("/mine", methods=["GET"])
# @login_required
# def my_purchases():
#     user_id = session["user_id"]
#     purchases = get_user_purchases(user_id)

#     def _s(p):
#         purchase = dict(p["purchase"])
#         purchase["_id"] = str(purchase["_id"])
#         purchase["user_id"] = str(purchase["user_id"])
#         purchase["note_id"] = str(purchase["note_id"])
#         note = dict(p["note"]) if p["note"] else None
#         if note:
#             note["_id"] = str(note["_id"])
#         return {"purchase": purchase, "note": note}

#     return jsonify({"purchases": [_s(p) for p in purchases]})

import logging

from flask import (
    Blueprint,
    jsonify,
    session,
)

from middleware.auth import (
    login_required,
)

from models.purchase import (
    get_user_purchases,
)


logger = logging.getLogger(__name__)


purchases_bp = Blueprint(
    "purchases",
    __name__,
    url_prefix="/api/purchases",
)


@purchases_bp.route("/mine", methods=["GET"])
@login_required
def my_purchases():

    try:

        user_id = session.get(
            "user_id"
        )


        purchases = get_user_purchases(
            user_id
        )


        result = []


        for item in purchases:

            purchase = item.get(
                "purchase",
                {}
            )

            note = item.get(
                "note"
            )


            serialized = {
                "purchase_id": str(
                    purchase.get("_id")
                ),
                "purchase_date": purchase.get(
                    "purchase_date"
                ),
                "payment_id": purchase.get(
                    "payment_id"
                ),
                "note": None,
            }


            if note:

                serialized["note"] = {
                    "_id": str(
                        note.get("_id")
                    ),
                    "title": note.get(
                        "title",
                        ""
                    ),
                    "description": note.get(
                        "description",
                        ""
                    ),
                    "category": note.get(
                        "category",
                        ""
                    ),
                    "thumbnail": note.get(
                        "thumbnail",
                        ""
                    ),
                    "price": note.get(
                        "price",
                        0
                    ),
                }


            result.append(
                serialized
            )


        return jsonify({
            "purchases": result
        })


    except Exception as error:

        logger.exception(
            "Failed to load purchases: %s",
            error,
        )


        return jsonify({
            "error":
            "Unable to load purchase history"
        }), 500