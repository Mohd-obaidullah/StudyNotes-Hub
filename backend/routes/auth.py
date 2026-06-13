# import os
# os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

# import requests
# from flask import Blueprint, redirect, session, url_for, jsonify, current_app, request
# from google_auth_oauthlib.flow import Flow
# from models.user import find_or_create_user, get_user_by_id
# from models.admin_log import log_action
# from services.email_service import send_welcome_email
# import os

# auth_bp = Blueprint("auth", __name__, url_prefix="/auth")

# SCOPES = ["openid", "https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"]

# def _make_flow():
#     from config import Config
#     return Flow.from_client_config(
#         {
#             "web": {
#                 "client_id": Config.GOOGLE_CLIENT_ID,
#                 "client_secret": Config.GOOGLE_CLIENT_SECRET,
#                 "redirect_uris": [Config.GOOGLE_REDIRECT_URI],
#                 "auth_uri": "https://accounts.google.com/o/oauth2/auth",
#                 "token_uri": "https://oauth2.googleapis.com/token",
#             }
#         },
#         scopes=SCOPES,
#         redirect_uri=Config.GOOGLE_REDIRECT_URI,
#     )

# @auth_bp.route("/login")
# def login():
#     flow = _make_flow()
#     auth_url, state = flow.authorization_url(prompt="consent", access_type="offline")
#     session["oauth_state"] = state
#     return redirect(auth_url)

# @auth_bp.route("/callback")
# def callback():
#     flow = _make_flow()
#     try:
#         flow.fetch_token(authorization_response=requests.compat.urljoin(
#             current_app.config.get("GOOGLE_REDIRECT_URI", ""),
#             "?" + requests.compat.urlencode(dict(
#                 code=request.args.get("code", ""),
#                 state=request.args.get("state", ""),
#             ))
#         ))
#     except Exception:
#         from flask import request
#         flow.fetch_token(authorization_response=request.url)

#     credentials = flow.credentials
#     id_info = requests.get(
#         "https://www.googleapis.com/oauth2/v3/userinfo",
#         headers={"Authorization": f"Bearer {credentials.token}"},
#     ).json()

#     is_new = False
#     from database.connection import get_db
#     db = get_db()
#     existing = db.users.find_one({"google_id": id_info["sub"]})
#     if not existing:
#         is_new = True

#     user = find_or_create_user(
#         google_id=id_info["sub"],
#         name=id_info.get("name", ""),
#         email=id_info.get("email", ""),
#         picture=id_info.get("picture", ""),
#     )

#     session["user_id"] = str(user["_id"])
#     session.permanent = True

#     if is_new:
#         from flask_mail import Mail
#         mail = current_app.extensions.get("mail")
#         if mail:
#             send_welcome_email(mail, user["name"], user["email"])

#     frontend_url = current_app.config.get("FRONTEND_URL", "http://localhost:3000")
#     return redirect(f"{frontend_url}/dashboard")

# @auth_bp.route("/logout", methods=["POST"])
# def logout():
#     session.clear()
#     return jsonify({"message": "Logged out"})

# @auth_bp.route("/me")
# def me():
#     user_id = session.get("user_id")
#     if not user_id:
#         return jsonify({"user": None})
#     user = get_user_by_id(user_id)
#     if not user:
#         session.clear()
#         return jsonify({"user": None})
#     return jsonify({
#         "user": {
#             "id": str(user["_id"]),
#             "name": user["name"],
#             "email": user["email"],
#             "profile_picture": user.get("profile_picture", ""),
#             "role": user.get("role", "student"),
#         }
#     })

import os
import requests

from flask import (
    Blueprint,
    redirect,
    session,
    jsonify,
    current_app,
    request
)

from google_auth_oauthlib.flow import Flow

from models.user import (
    find_or_create_user,
    get_user_by_id
)

from services.email_service import (
    send_welcome_email
)


# Allow OAuth over HTTP only in development
if os.getenv("FLASK_ENV") != "production":
    os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"


auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/auth"
)


SCOPES = [
    "openid",
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
]


def create_flow():
    return Flow.from_client_config(
        {
            "web": {
                "client_id": current_app.config["GOOGLE_CLIENT_ID"],
                "client_secret": current_app.config["GOOGLE_CLIENT_SECRET"],
                "redirect_uris": [
                    current_app.config["GOOGLE_REDIRECT_URI"]
                ],
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
            }
        },
        scopes=SCOPES,
        redirect_uri=current_app.config["GOOGLE_REDIRECT_URI"]
    )


@auth_bp.route("/login")
def login():

    # Prevent session fixation
    session.clear()

    flow = create_flow()

    auth_url, state = flow.authorization_url(
        prompt="consent",
        access_type="offline"
    )

    session["oauth_state"] = state

    return redirect(auth_url)


@auth_bp.route("/callback")
def callback():

    # Verify OAuth state
    if request.args.get("state") != session.get("oauth_state"):

        current_app.logger.warning(
            "OAuth state mismatch"
        )

        return jsonify({
            "error": "Invalid OAuth state"
        }), 400


    try:

        flow = create_flow()


        flow.fetch_token(
            authorization_response=request.url
        )


        credentials = flow.credentials


        response = requests.get(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={
                "Authorization":
                    f"Bearer {credentials.token}"
            },
            timeout=5
        )


        response.raise_for_status()


        user_info = response.json()


        if "sub" not in user_info:

            return jsonify({
                "error":
                "Invalid Google response"
            }), 400


        user = find_or_create_user(
            google_id=user_info["sub"],
            name=user_info.get("name", ""),
            email=user_info.get("email", ""),
            picture=user_info.get("picture", "")
        )


        # Remove OAuth state
        session.pop("oauth_state", None)


        # Create login session
        session["user_id"] = str(
            user["_id"]
        )

        session.permanent = True


        # Send welcome email
        try:

            mail = current_app.extensions.get(
                "mail"
            )

            # if mail:
            #     send_welcome_email(
            #         mail,
            #         user["name"],
            #         user["email"]
            #     )

        except Exception as email_error:

            current_app.logger.warning(
                "Welcome email failed: %s",
                email_error
            )


        return redirect(
            f"{current_app.config['FRONTEND_URL']}/dashboard"
        )


    except requests.RequestException as error:

        current_app.logger.error(
            "Google API error: %s",
            error
        )

        return jsonify({
            "error":
            "Failed to fetch Google profile"
        }), 502


    except Exception as error:

        current_app.logger.exception(
            "Authentication failed: %s",
            error
        )

        return jsonify({
            "error":
            "Authentication failed"
        }), 500


@auth_bp.route("/logout", methods=["POST"])
def logout():

    session.clear()

    return jsonify({
        "message": "Logged out successfully"
    })


@auth_bp.route("/me")
def me():

    user_id = session.get("user_id")


    if not user_id:

        return jsonify({
            "user": None
        })


    user = get_user_by_id(user_id)


    if not user:

        session.clear()

        return jsonify({
            "user": None
        })


    return jsonify({
        "user": {
            "id": str(user["_id"]),
            "name": user.get("name", ""),
            "email": user.get("email", ""),
            "profile_picture": user.get(
                "profile_picture",
                ""
            ),
            "role": user.get(
                "role",
                "student"
            )
        }
    })