# from flask import Flask, jsonify, send_from_directory
# import logging
# import os
# from flask_cors import CORS
# from flask_mail import Mail
# from flask_wtf.csrf import CSRFProtect
# from flask_limiter import Limiter
# from flask_limiter.util import get_remote_address
# from config import Config

# mail = Mail()
# csrf = CSRFProtect()
# limiter = Limiter(key_func=get_remote_address)

# def create_app(config_class=Config):
#     app = Flask(__name__)
#     app.config.from_object(config_class)

#     os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)
#     os.makedirs(os.path.join(os.path.dirname(__file__), "logs"), exist_ok=True)

#     logging.basicConfig(
#         level=logging.INFO,
#         format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
#         handlers=[
#             logging.StreamHandler(),
#             logging.FileHandler(os.path.join(os.path.dirname(__file__), "logs", "app.log")),
#         ],
#     )

#     CORS(app, supports_credentials=True, origins=[os.getenv("FRONTEND_URL", "http://localhost:3000")])
#     mail.init_app(app)
#     csrf.init_app(app)
#     limiter.init_app(app)

#     from routes.auth import auth_bp
#     from routes.notes import notes_bp
#     from routes.payments import payments_bp
#     from routes.admin import admin_bp
#     from routes.contact import contact_bp
#     from routes.purchases import purchases_bp

#     app.register_blueprint(auth_bp)
#     app.register_blueprint(notes_bp)
#     app.register_blueprint(payments_bp)
#     app.register_blueprint(admin_bp)
#     app.register_blueprint(contact_bp)
#     app.register_blueprint(purchases_bp)

#     from models.category import get_categories
#     @app.route("/categories")
#     def categories():
#         cats = get_categories()
#         for c in cats:
#             c["_id"] = str(c["_id"])
#         return jsonify({"categories": cats})

#     @app.route("/health")
#     @limiter.exempt
#     def health():
#         return jsonify({"status": "ok"})
    

#     @app.route("/uploads/<path:filename>")
#     def uploaded_file(filename):
#         return send_from_directory(app.config["UPLOAD_FOLDER"], filename)

#     @app.errorhandler(404)
#     def not_found(_):
#         return jsonify({"error": "Not found"}), 404

#     @app.errorhandler(429)
#     def rate_limited(_):
#         return jsonify({"error": "Too many requests"}), 429

#     @app.errorhandler(500)
#     def server_error(e):
#         app.logger.error("500 error: %s", e)
#         return jsonify({"error": "Internal server error"}), 500
    
#     print("\n===== ROUTES =====")
#     for rule in app.url_map.iter_rules():
#         print(rule)
#     print("==================")    

#     return app

# if __name__ == "__main__":
#     app = create_app()
#     app.run(debug=os.getenv("FLASK_ENV") != "production", port=5000)

import os
import logging

from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
from flask_mail import Mail
from flask_wtf.csrf import CSRFProtect
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

from config import Config


mail = Mail()
csrf = CSRFProtect()
limiter = Limiter(key_func=get_remote_address)


def create_app(config_class=Config):

    app = Flask(__name__)
    app.config.from_object(config_class)


    # Create required folders
    os.makedirs(app.config["UPLOAD_FOLDER"], exist_ok=True)
    logs_path = os.path.join(
        os.path.dirname(__file__),
        "logs"
    )
    os.makedirs(logs_path, exist_ok=True)


    # Production-friendly logging
    handlers = [
        logging.StreamHandler()
    ]

    # File logs only for development
    if app.config.get("DEBUG"):
        handlers.append(
            logging.FileHandler(
                os.path.join(logs_path, "app.log")
            )
        )

    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        handlers=handlers
    )


    # CORS configuration
    CORS(
        app,
        supports_credentials=True,
        origins=[
            os.getenv(
                "FRONTEND_URL",
                "http://localhost:5173"
            )
        ]
    )


    # Initialize extensions
    mail.init_app(app)
    csrf.init_app(app)
    limiter.init_app(app)


    # Register blueprints
    from routes.auth import auth_bp
    from routes.notes import notes_bp
    from routes.payments import payments_bp
    from routes.admin import admin_bp
    from routes.contact import contact_bp
    from routes.purchases import purchases_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(notes_bp)
    app.register_blueprint(payments_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(contact_bp)
    app.register_blueprint(purchases_bp)


    # Categories API
    from models.category import get_categories

    @app.route("/categories")
    def categories():

        categories = get_categories()

        for category in categories:
            category["_id"] = str(category["_id"])

        return jsonify({
            "categories": categories
        })


    # Health check for Render
    @app.route("/health")
    @limiter.exempt
    def health():

        return jsonify({
            "status": "ok"
        })


    # Static uploads
    @app.route("/uploads/<path:filename>")
    def uploaded_file(filename):

        return send_from_directory(
            app.config["UPLOAD_FOLDER"],
            filename
        )


    # Error handlers
    @app.errorhandler(404)
    def not_found(_):

        return jsonify({
            "error": "Not found"
        }), 404


    @app.errorhandler(429)
    def rate_limited(_):

        return jsonify({
            "error": "Too many requests"
        }), 429


    @app.errorhandler(500)
    def server_error(error):

        app.logger.exception(
            "Internal server error: %s",
            error
        )

        return jsonify({
            "error": "Internal server error"
        }), 500


    return app


if __name__ == "__main__":

    app = create_app()

    app.run(
        debug=os.getenv("FLASK_ENV") != "production",
        port=5000
    )