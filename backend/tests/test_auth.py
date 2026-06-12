import pytest
from unittest.mock import patch, MagicMock

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def app():
    import sys, os
    sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
    os.environ.setdefault("MONGO_URI", "mongodb://localhost:27017")
    os.environ.setdefault("SECRET_KEY", "test-key")
    os.environ.setdefault("RAZORPAY_KEY_ID", "rzp_test_x")
    os.environ.setdefault("RAZORPAY_KEY_SECRET", "test_secret")
    os.environ.setdefault("GOOGLE_CLIENT_ID", "test-client-id")
    os.environ.setdefault("GOOGLE_CLIENT_SECRET", "test-client-secret")
    with patch("database.connection.MongoClient"):
        from app import create_app
        application = create_app()
        application.config["TESTING"] = True
        application.config["WTF_CSRF_ENABLED"] = False
        yield application

def test_me_unauthenticated(client):
    resp = client.get("/auth/me")
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["user"] is None

def test_logout(client):
    resp = client.post("/auth/logout")
    assert resp.status_code == 200

def test_health(client):
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.get_json()["status"] == "ok"
