# import os
# from dotenv import load_dotenv

# load_dotenv()

# class Config:
#     SECRET_KEY = os.getenv("SECRET_KEY", "change-me-in-production")
#     MONGO_URI = os.getenv("MONGO_URI")
#     DB_NAME = os.getenv("DB_NAME", "studynotes")

#     GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
#     GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
#     GOOGLE_REDIRECT_URI = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:5000/auth/callback")

#     RAZORPAY_KEY_ID = os.getenv("RAZORPAY_KEY_ID")
#     RAZORPAY_KEY_SECRET = os.getenv("RAZORPAY_KEY_SECRET")
#     RAZORPAY_WEBHOOK_SECRET = os.getenv("RAZORPAY_WEBHOOK_SECRET")

#     MAIL_SERVER = os.getenv("MAIL_SERVER", "smtp.gmail.com")
#     MAIL_PORT = int(os.getenv("MAIL_PORT", 587))
#     MAIL_USE_TLS = True
#     MAIL_USERNAME = os.getenv("MAIL_USERNAME")
#     MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
#     MAIL_DEFAULT_SENDER = os.getenv("MAIL_DEFAULT_SENDER", "noreply@studynoteshub.com")

#     UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), "uploads")
#     MAX_CONTENT_LENGTH = 50 * 1024 * 1024  # 50 MB

#     SESSION_COOKIE_SECURE = os.getenv("FLASK_ENV") == "production"
#     SESSION_COOKIE_HTTPONLY = True
#     SESSION_COOKIE_SAMESITE = "Lax"
#     PERMANENT_SESSION_LIFETIME = 86400 * 7  # 7 days

#     RATELIMIT_DEFAULT = "200 per day;50 per hour"
#     WTF_CSRF_ENABLED = False

import os
from datetime import timedelta
from dotenv import load_dotenv


load_dotenv()


class Config:

    # Environment
    FLASK_ENV = os.getenv("FLASK_ENV", "development")
    DEBUG = FLASK_ENV != "production"


    # Security
    SECRET_KEY = os.environ["SECRET_KEY"]


    # MongoDB
    MONGO_URI = os.environ["MONGO_URI"]
    DB_NAME = os.getenv("DB_NAME", "studynotes")


    # Frontend URL (Vercel)
    FRONTEND_URL = os.getenv(
        "FRONTEND_URL",
        "http://localhost:5173"
    )


    # Google OAuth
    GOOGLE_CLIENT_ID = os.environ["GOOGLE_CLIENT_ID"]
    GOOGLE_CLIENT_SECRET = os.environ["GOOGLE_CLIENT_SECRET"]

    GOOGLE_REDIRECT_URI = os.getenv(
        "GOOGLE_REDIRECT_URI",
        "http://localhost:5000/auth/callback"
    )


    # Razorpay
    RAZORPAY_KEY_ID = os.environ["RAZORPAY_KEY_ID"]
    RAZORPAY_KEY_SECRET = os.environ["RAZORPAY_KEY_SECRET"]
    RAZORPAY_WEBHOOK_SECRET = os.getenv(
        "RAZORPAY_WEBHOOK_SECRET"
    )


    # Mail Configuration
    MAIL_SERVER = os.getenv(
        "MAIL_SERVER",
        "smtp.gmail.com"
    )

    MAIL_PORT = int(
        os.getenv("MAIL_PORT", 587)
    )

    MAIL_USE_TLS = True

    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")

    MAIL_DEFAULT_SENDER = os.getenv(
        "MAIL_DEFAULT_SENDER",
        "noreply@studynoteshub.com"
    )


    # File Uploads
    UPLOAD_FOLDER = os.path.join(
        os.path.dirname(__file__),
        "uploads"
    )

    # 5MB image + 20MB PDF
    MAX_CONTENT_LENGTH = 25 * 1024 * 1024


    # Session Security
    SESSION_COOKIE_HTTPONLY = True

    SESSION_COOKIE_SECURE = (
        FLASK_ENV == "production"
    )

    SESSION_COOKIE_SAMESITE = (
        "None"
        if FLASK_ENV == "production"
        else "Lax"
    )

    PERMANENT_SESSION_LIFETIME = timedelta(
        days=7
    )


    # Rate Limiting
    RATELIMIT_DEFAULT = (
        "200 per day;50 per hour"
    )


    # CSRF
    # Keep disabled for now.
    # We will review auth.py, payments.py,
    # and API routes before enabling it.
    WTF_CSRF_ENABLED = False