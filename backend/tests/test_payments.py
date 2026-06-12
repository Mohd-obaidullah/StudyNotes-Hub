import pytest
from unittest.mock import patch, MagicMock

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def app():
    import sys, os
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
    for k, v in {
        "MONGO_URI": "mongodb://localhost:27017",
        "SECRET_KEY": "test",
        "RAZORPAY_KEY_ID": "rzp_test_x",
        "RAZORPAY_KEY_SECRET": "secret",
        "GOOGLE_CLIENT_ID": "cid",
        "GOOGLE_CLIENT_SECRET": "csecret",
    }.items():
        os.environ.setdefault(k, v)
    with patch("database.connection.MongoClient"):
        from app import create_app
        application = create_app()
        application.config["TESTING"] = True
        application.config["WTF_CSRF_ENABLED"] = False
        yield application

def test_create_order_requires_login(client):
    resp = client.post("/payments/create-order", json={"note_id": "abc"})
    assert resp.status_code == 401

def test_verify_requires_login(client):
    resp = client.post("/payments/verify", json={})
    assert resp.status_code == 401
