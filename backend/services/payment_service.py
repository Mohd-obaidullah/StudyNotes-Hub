import hmac
import hashlib


def _get_client():
    import razorpay
    from config import Config
    return razorpay.Client(auth=(Config.RAZORPAY_KEY_ID, Config.RAZORPAY_KEY_SECRET))


def create_order(amount_rupees, note_id, user_id):
    from config import Config
    client = _get_client()
    order = client.order.create({
        "amount": int(amount_rupees * 100),
        "currency": "INR",
        "receipt": f"note_{str(note_id)[:20]}",
        "payment_capture": 1,
    })
    return order


def verify_signature(order_id, payment_id, signature):
    from config import Config
    msg = f"{order_id}|{payment_id}".encode()
    expected = hmac.new(Config.RAZORPAY_KEY_SECRET.encode(), msg, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, signature)


def verify_webhook_signature(body, signature):
    from config import Config
    expected = hmac.new(
        Config.RAZORPAY_WEBHOOK_SECRET.encode(), body, hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(expected, signature)