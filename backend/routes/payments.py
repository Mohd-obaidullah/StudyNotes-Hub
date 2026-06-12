# import json
# import logging
# from flask import Blueprint, request, jsonify, session, current_app
# from middleware.auth import login_required
# from models.note import get_note_by_id
# from models.payment import create_payment_record, confirm_payment
# from models.purchase import create_purchase, has_purchased
# from models.user import get_user_by_id
# from services.payment_service import create_order, verify_signature, verify_webhook_signature

# payments_bp = Blueprint("payments", __name__, url_prefix="/api/payments") #extra api for production
# logger = logging.getLogger(__name__)

# @payments_bp.route("/create-order", methods=["POST"])
# @login_required
# def init_order():
#     data = request.get_json(force=True)
#     note_id = data.get("note_id")
#     user_id = session["user_id"]

#     note = get_note_by_id(note_id)
#     if not note:
#         return jsonify({"error": "Note not found"}), 404
#     if has_purchased(user_id, note_id):
#         return jsonify({"error": "Already purchased"}), 400

#     try:
#         order = create_order(note["price"], note_id, user_id)
#         create_payment_record(user_id, note_id, note["price"], order["id"])
#         return jsonify({
#             "order_id": order["id"],
#             "amount": order["amount"],
#             "currency": order["currency"],
#             "key": current_app.config["RAZORPAY_KEY_ID"],
#             "note_title": note["title"],
#         })
#     except Exception as e:
#         logger.error("Order creation failed: %s", e)
#         return jsonify({"error": "Payment initialization failed"}), 500

# @payments_bp.route("/verify", methods=["POST"])
# @login_required
# def verify():
#     data = request.get_json(force=True)
#     order_id = data.get("razorpay_order_id", "")
#     payment_id = data.get("razorpay_payment_id", "")
#     signature = data.get("razorpay_signature", "")
#     note_id = data.get("note_id", "")

#     if not verify_signature(order_id, payment_id, signature):
#         return jsonify({"error": "Invalid payment signature"}), 400

#     user_id = session["user_id"]
#     confirm_payment(order_id, payment_id)
#     create_purchase(user_id, note_id, payment_id)

#     user = get_user_by_id(user_id)
#     note = get_note_by_id(note_id)
#     if user and note:
#         from flask_mail import Mail
#         mail = current_app.extensions.get("mail")
#         if mail:
#             from services.email_service import send_purchase_receipt
#             send_purchase_receipt(mail, user["name"], user["email"], note["title"], note["price"], payment_id)

#     return jsonify({"message": "Payment verified", "access_granted": True})

# @payments_bp.route("/webhook", methods=["POST"])
# def webhook():
#     body = request.get_data()
#     signature = request.headers.get("X-Razorpay-Signature", "")
#     if not verify_webhook_signature(body, signature):
#         return jsonify({"error": "Invalid signature"}), 400
#     event = request.get_json(force=True)
#     logger.info("Razorpay webhook: %s", event.get("event"))
#     return jsonify({"status": "ok"})

import logging

from flask import (
    Blueprint,
    request,
    jsonify,
    session,
    current_app,
)

from middleware.auth import login_required

from models.note import get_note_by_id
from models.payment import (
    create_payment_record,
    confirm_payment,
)
from models.purchase import (
    create_purchase,
    has_purchased,
)
from models.user import get_user_by_id

from services.payment_service import (
    create_order,
    verify_signature,
    verify_webhook_signature,
)

from services.email_service import (
    send_purchase_receipt,
)


payments_bp = Blueprint(
    "payments",
    __name__,
    url_prefix="/api/payments",
)


logger = logging.getLogger(__name__)


# =========================================
# Create Razorpay Order
# =========================================

@payments_bp.route("/create-order", methods=["POST"])
@login_required
def create_payment_order():

    try:

        data = request.get_json(silent=True) or {}

        note_id = data.get("note_id")

        if not note_id:
            return jsonify({
                "error": "Note ID is required"
            }), 400


        user_id = session.get("user_id")


        note = get_note_by_id(note_id)

        if not note:
            return jsonify({
                "error": "Note not found"
            }), 404


        if has_purchased(user_id, note_id):
            return jsonify({
                "error": "You already purchased this note"
            }), 400


        # Razorpay amount always comes from database
        order = create_order(
            note["price"],
            note_id,
            user_id,
        )


        create_payment_record(
            user_id,
            note_id,
            note["price"],
            order["id"],
        )


        logger.info(
            "Payment order created: user=%s note=%s order=%s",
            user_id,
            note_id,
            order["id"],
        )


        return jsonify({
            "order_id": order["id"],
            "amount": order["amount"],
            "currency": order["currency"],
            "key": current_app.config["RAZORPAY_KEY_ID"],
            "note_title": note["title"],
        })


    except Exception as error:

        logger.exception(
            "Order creation failed: %s",
            error,
        )


        return jsonify({
            "error": "Payment initialization failed"
        }), 500


# =========================================
# Verify Razorpay Payment
# =========================================

@payments_bp.route("/verify", methods=["POST"])
@login_required
def verify_payment():

    try:

        data = request.get_json(silent=True) or {}


        order_id = data.get("razorpay_order_id")
        payment_id = data.get("razorpay_payment_id")
        signature = data.get("razorpay_signature")
        note_id = data.get("note_id")


        if not all([
            order_id,
            payment_id,
            signature,
            note_id,
        ]):
            return jsonify({
                "error": "Missing payment details"
            }), 400


        # Verify payment with Razorpay signature
        if not verify_signature(
            order_id,
            payment_id,
            signature,
        ):

            logger.warning(
                "Invalid payment signature: %s",
                payment_id,
            )

            return jsonify({
                "error": "Invalid payment signature"
            }), 400


        user_id = session.get("user_id")


        # Prevent duplicate purchases
        if has_purchased(user_id, note_id):

            logger.warning(
                "Duplicate purchase attempt: user=%s note=%s",
                user_id,
                note_id,
            )

            return jsonify({
                "message": "Already purchased",
                "access_granted": True,
            })


        # Mark payment successful
        confirm_payment(
            order_id,
            payment_id,
        )


        # Grant access
        create_purchase(
            user_id,
            note_id,
            payment_id,
        )


        logger.info(
            "Payment verified successfully: %s",
            payment_id,
        )


        # Send purchase receipt email
        try:

            user = get_user_by_id(user_id)
            note = get_note_by_id(note_id)

            mail = current_app.extensions.get(
                "mail"
            )


            if user and note and mail:

                send_purchase_receipt(
                    mail,
                    user["name"],
                    user["email"],
                    note["title"],
                    note["price"],
                    payment_id,
                )


        except Exception as email_error:

            logger.warning(
                "Receipt email failed: %s",
                email_error,
            )


        return jsonify({
            "message": "Payment verified",
            "access_granted": True,
        })


    except Exception as error:

        logger.exception(
            "Payment verification failed: %s",
            error,
        )


        return jsonify({
            "error": "Payment verification failed"
        }), 500


# =========================================
# Razorpay Webhook
# =========================================

@payments_bp.route("/webhook", methods=["POST"])
def webhook():

    try:

        body = request.get_data()

        signature = request.headers.get(
            "X-Razorpay-Signature",
            "",
        )


        if not verify_webhook_signature(
            body,
            signature,
        ):

            logger.warning(
                "Invalid Razorpay webhook signature"
            )

            return jsonify({
                "error": "Invalid signature"
            }), 400


        event = request.get_json(
            silent=True
        ) or {}


        logger.info(
            "Razorpay webhook received: %s",
            event.get("event"),
        )


        return jsonify({
            "status": "ok"
        })


    except Exception as error:

        logger.exception(
            "Webhook processing failed: %s",
            error,
        )


        return jsonify({
            "error": "Webhook processing failed"
        }), 500