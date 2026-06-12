import pytest
from unittest.mock import patch

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

def test_pdf_access_without_login(client):
    resp = client.get("/notes/64a0000000000000000abcde/access")
    assert resp.status_code == 401

@patch("routes.notes.get_user_by_id")
@patch("routes.notes.has_purchased")
def test_pdf_access_without_purchase(mock_purch, mock_user, client):
    from bson import ObjectId
    mock_user.return_value = {"_id": ObjectId(), "email": "test@test.com"}
    mock_purch.return_value = False
    with client.session_transaction() as sess:
        sess["user_id"] = "64a0000000000000000abcde"
    resp = client.get("/notes/64a0000000000000000abcde/access")
    assert resp.status_code == 403

def test_admin_panel_blocked_for_student(client):
    with patch("models.user.get_user_by_id") as mock_user:
        mock_user.return_value = {"_id": "uid", "role": "student"}
        with client.session_transaction() as sess:
            sess["user_id"] = "64a0000000000000000abcde"
        resp = client.get("/admin/dashboard")
        assert resp.status_code == 403
