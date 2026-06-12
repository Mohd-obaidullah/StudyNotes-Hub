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
    os.environ.setdefault("RAZORPAY_KEY_SECRET", "secret")
    os.environ.setdefault("GOOGLE_CLIENT_ID", "cid")
    os.environ.setdefault("GOOGLE_CLIENT_SECRET", "csecret")
    with patch("database.connection.MongoClient"):
        from app import create_app
        application = create_app()
        application.config["TESTING"] = True
        application.config["WTF_CSRF_ENABLED"] = False
        yield application

@patch("routes.notes.get_notes")
def test_list_notes_empty(mock_get, client):
    mock_get.return_value = ([], 0)
    resp = client.get("/notes/")
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["notes"] == []
    assert data["total"] == 0

@patch("routes.notes.get_note_by_id")
def test_note_not_found(mock_get, client):
    mock_get.return_value = None
    resp = client.get("/notes/000000000000000000000000")
    assert resp.status_code == 404

@patch("routes.notes.get_note_by_id")
@patch("routes.notes.has_purchased")
def test_note_detail(mock_purch, mock_get, client):
    from bson import ObjectId
    mock_get.return_value = {
        "_id": ObjectId("64a0000000000000000abcde"),
        "title": "Math Notes",
        "description": "Great stuff",
        "category": "Math",
        "price": 99.0,
        "thumbnail": "thumb.jpg",
        "preview_pages": 3,
    }
    mock_purch.return_value = False
    resp = client.get("/notes/64a0000000000000000abcde")
    assert resp.status_code == 200
    data = resp.get_json()
    assert data["title"] == "Math Notes"
    assert "pdf_file" not in data
