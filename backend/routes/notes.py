# import os
# print("NOTES BLUEPRINT LOADED") 
# from flask import Blueprint, request, jsonify, send_file, session
# from werkzeug.utils import secure_filename
# from bson import ObjectId
# from models.note import create_note, get_notes, get_note_by_id, update_note, delete_note
# from models.purchase import has_purchased
# from middleware.auth import login_required, admin_required
# from services.pdf_service import add_watermark
# from models.user import get_user_by_id
# from config import Config

# notes_bp = Blueprint("notes", __name__, url_prefix="/api/notes") #api add extra for production
# ALLOWED_IMAGE = {"png", "jpg", "jpeg", "webp"}
# ALLOWED_PDF = {"pdf"}

# def _allowed(filename, allowed):
#     return "." in filename and filename.rsplit(".", 1)[1].lower() in allowed

# def _serialize(note):
#     n = dict(note)
#     n["_id"] = str(n["_id"])
#     n.pop("pdf_file", None)          # never leak the real path
#     return n

# @notes_bp.route("/", methods=["GET"])
# def list_notes():
#     category = request.args.get("category")
#     search = request.args.get("q")
#     page = int(request.args.get("page", 1))
#     notes, total = get_notes(category=category, search=search, page=page)
#     return jsonify({"notes": [_serialize(n) for n in notes], "total": total, "page": page})

# @notes_bp.route("/<note_id>", methods=["GET"])
# def note_detail(note_id):
#     note = get_note_by_id(note_id)
#     if not note:
#         return jsonify({"error": "Not found"}), 404
#     data = _serialize(note)
#     user_id = session.get("user_id")
#     data["purchased"] = has_purchased(user_id, note_id) if user_id else False
#     return jsonify(data)

# @notes_bp.route("/<note_id>/access", methods=["GET"])
# @login_required
# def access_note(note_id):
#     user_id = session.get("user_id")
#     user = get_user_by_id(user_id)
#     if not user:
#         return jsonify({"error": "Unauthorized"}), 401
#     if not has_purchased(user_id, note_id):
#         return jsonify({"error": "Purchase required"}), 403
#     note = get_note_by_id(note_id)
#     if not note or not note.get("pdf_file"):
#         return jsonify({"error": "File not found"}), 404
#     pdf_path = os.path.join(Config.UPLOAD_FOLDER, note["pdf_file"])
#     if not os.path.exists(pdf_path):
#         return jsonify({"error": "File missing"}), 404
#     watermarked = add_watermark(pdf_path, user["email"])
#     response = send_file(
#     watermarked,
#     mimetype="application/pdf",
#     as_attachment=False,
#     download_name=f"{note['title'].replace(' ','_')}.pdf"
# )

#     response.headers["X-Content-Type-Options"] = "nosniff"
#     return response
    

# # ── Admin routes ────────────────────────────────────────────────────────────

# @notes_bp.route("/admin/upload", methods=["POST"])
# @admin_required
# def upload_note():
#     data = request.form
#     thumbnail = request.files.get("thumbnail")
#     pdf = request.files.get("pdf")

#     if not thumbnail or not _allowed(thumbnail.filename, ALLOWED_IMAGE):
#         return jsonify({"error": "Valid thumbnail required"}), 400
#     if not pdf or not _allowed(pdf.filename, ALLOWED_PDF):
#         return jsonify({"error": "Valid PDF required"}), 400

#     thumb_name = secure_filename(thumbnail.filename)
#     pdf_name = secure_filename(pdf.filename)
#     os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
#     thumbnail.save(os.path.join(Config.UPLOAD_FOLDER, thumb_name))
#     pdf.save(os.path.join(Config.UPLOAD_FOLDER, pdf_name))

#     note_id = create_note({
#         "title": data.get("title", "").strip(),
#         "description": data.get("description", "").strip(),
#         "category": data.get("category", "").strip(),
#         "price": float(data.get("price", 0)),
#         "thumbnail": thumb_name,
#         "pdf_file": pdf_name,
#         "preview_pages": int(data.get("preview_pages", 0)),
#     })
#     from models.admin_log import log_action
#     log_action(session["user_id"], f"Uploaded note {note_id}")
#     return jsonify({"message": "Note uploaded", "note_id": note_id}), 201

# @notes_bp.route("/admin/<note_id>", methods=["PUT"])
# @admin_required
# def edit_note(note_id):
#     data = request.get_json(force=True)
#     allowed_fields = {"title", "description", "category", "price", "preview_pages"}
#     update = {k: v for k, v in data.items() if k in allowed_fields}
#     update_note(note_id, update)
#     from models.admin_log import log_action
#     log_action(session["user_id"], f"Edited note {note_id}")
#     return jsonify({"message": "Updated"})

# @notes_bp.route("/admin/<note_id>", methods=["DELETE"])
# @admin_required
# def remove_note(note_id):
#     note = get_note_by_id(note_id)
#     if note:
#         for field in ("pdf_file", "thumbnail"):
#             fname = note.get(field)
#             if fname:
#                 path = os.path.join(Config.UPLOAD_FOLDER, fname)
#                 if os.path.exists(path):
#                     os.remove(path)
#     delete_note(note_id)
#     from models.admin_log import log_action
#     log_action(session["user_id"], f"Deleted note {note_id}")
#     return jsonify({"message": "Deleted"})

import os
import uuid
import logging

from flask import (
    Blueprint,
    request,
    jsonify,
    send_file,
    session,
)

from werkzeug.utils import secure_filename
from bson.errors import InvalidId

from models.note import (
    create_note,
    get_notes,
    get_note_by_id,
    update_note,
    delete_note,
)

from models.purchase import has_purchased
from models.user import get_user_by_id

from middleware.auth import (
    login_required,
    admin_required,
)

from services.pdf_service import add_watermark

from config import Config


logger = logging.getLogger(__name__)


notes_bp = Blueprint(
    "notes",
    __name__,
    url_prefix="/api/notes",
)


ALLOWED_IMAGE = {
    "png",
    "jpg",
    "jpeg",
    "webp",
}

ALLOWED_PDF = {
    "pdf",
}


def allowed_file(filename, allowed_extensions):

    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower()
        in allowed_extensions
    )


def serialize_note(note):

    data = dict(note)

    data["_id"] = str(data["_id"])

    # Never expose real PDF location
    data.pop("pdf_file", None)

    return data


# =================================================
# Public APIs
# =================================================


@notes_bp.route("/", methods=["GET"])
def list_notes():

    category = request.args.get("category")
    search = request.args.get("q")

    try:
        page = int(
            request.args.get("page", 1)
        )

        if page < 1:
            page = 1

    except (ValueError, TypeError):
        page = 1


    notes, total = get_notes(
        category=category,
        search=search,
        page=page,
    )


    return jsonify({
        "notes": [
            serialize_note(note)
            for note in notes
        ],
        "total": total,
        "page": page,
    })


@notes_bp.route("/<note_id>", methods=["GET"])
def note_detail(note_id):

    try:

        note = get_note_by_id(note_id)

    except InvalidId:

        return jsonify({
            "error": "Invalid note ID"
        }), 400


    if not note:

        return jsonify({
            "error": "Note not found"
        }), 404


    data = serialize_note(note)


    user_id = session.get("user_id")


    data["purchased"] = (
        has_purchased(user_id, note_id)
        if user_id
        else False
    )


    return jsonify(data)


# =================================================
# Secure PDF Access
# =================================================


@notes_bp.route("/<note_id>/access", methods=["GET"])
@login_required
def access_note(note_id):

    user_id = session.get("user_id")

    user = get_user_by_id(user_id)


    if not user:

        return jsonify({
            "error": "Unauthorized"
        }), 401


    if not has_purchased(user_id, note_id):

        return jsonify({
            "error": "Purchase required"
        }), 403


    try:

        note = get_note_by_id(note_id)

    except InvalidId:

        return jsonify({
            "error": "Invalid note ID"
        }), 400


    if not note or not note.get("pdf_file"):

        return jsonify({
            "error": "File not found"
        }), 404


    pdf_path = os.path.join(
        Config.UPLOAD_FOLDER,
        note["pdf_file"]
    )


    if not os.path.exists(pdf_path):

        logger.warning(
            "Missing PDF: %s",
            pdf_path,
        )

        return jsonify({
            "error": "File missing"
        }), 404


    try:

        watermarked_pdf = add_watermark(
            pdf_path,
            user["email"],
        )

    except Exception:

        logger.exception(
            "Failed to create watermarked PDF"
        )

        return jsonify({
            "error": "Unable to prepare PDF"
        }), 500


    response = send_file(
        watermarked_pdf,
        mimetype="application/pdf",
        as_attachment=False,
        download_name=(
            f"{note['title'].replace(' ', '_')}.pdf"
        ),
    )


    response.headers[
        "X-Content-Type-Options"
    ] = "nosniff"


    return response


# =================================================
# Admin APIs
# =================================================


@notes_bp.route("/admin/upload", methods=["POST"])
@admin_required
def upload_note():

    data = request.form

    thumbnail = request.files.get("thumbnail")
    pdf = request.files.get("pdf")


    # Validate files
    if not thumbnail or not allowed_file(
        thumbnail.filename,
        ALLOWED_IMAGE,
    ):
        return jsonify({
            "error": "Valid thumbnail image required"
        }), 400


    if not pdf or not allowed_file(
        pdf.filename,
        ALLOWED_PDF,
    ):
        return jsonify({
            "error": "Valid PDF file required"
        }), 400


    # Generate unique filenames
    thumb_extension = (
        secure_filename(thumbnail.filename)
        .rsplit(".", 1)[1]
        .lower()
    )

    pdf_extension = (
        secure_filename(pdf.filename)
        .rsplit(".", 1)[1]
        .lower()
    )


    thumbnail_name = (
        f"{uuid.uuid4()}.{thumb_extension}"
    )

    pdf_name = (
        f"{uuid.uuid4()}.{pdf_extension}"
    )


    try:

        os.makedirs(
            Config.UPLOAD_FOLDER,
            exist_ok=True,
        )


        thumbnail.save(
            os.path.join(
                Config.UPLOAD_FOLDER,
                thumbnail_name,
            )
        )


        pdf.save(
            os.path.join(
                Config.UPLOAD_FOLDER,
                pdf_name,
            )
        )


        note_id = create_note({
            "title": data.get(
                "title",
                ""
            ).strip(),

            "description": data.get(
                "description",
                ""
            ).strip(),

            "category": data.get(
                "category",
                ""
            ).strip(),

            "price": float(
                data.get(
                    "price",
                    0
                )
            ),

            "thumbnail": thumbnail_name,

            "pdf_file": pdf_name,

            "preview_pages": int(
                data.get(
                    "preview_pages",
                    0
                )
            ),
        })


        from models.admin_log import log_action


        log_action(
            session["user_id"],
            f"Uploaded note {note_id}",
        )


        logger.info(
            "Note uploaded: %s by admin %s",
            note_id,
            session["user_id"],
        )


        return jsonify({
            "message": "Note uploaded successfully",
            "note_id": note_id,
        }), 201


    except Exception as error:

        logger.exception(
            "Note upload failed: %s",
            error,
        )


        return jsonify({
            "error": "Upload failed"
        }), 500



@notes_bp.route("/admin/<note_id>", methods=["PUT"])
@admin_required
def edit_note(note_id):

    data = request.get_json(
        silent=True
    ) or {}


    allowed_fields = {
        "title",
        "description",
        "category",
        "price",
        "preview_pages",
    }


    update_data = {
        key: value
        for key, value in data.items()
        if key in allowed_fields
    }


    try:

        update_note(
            note_id,
            update_data,
        )


        from models.admin_log import log_action


        log_action(
            session["user_id"],
            f"Edited note {note_id}",
        )


        return jsonify({
            "message": "Note updated successfully"
        })


    except Exception as error:

        logger.exception(
            "Note update failed: %s",
            error,
        )


        return jsonify({
            "error": "Update failed"
        }), 500



@notes_bp.route("/admin/<note_id>", methods=["DELETE"])
@admin_required
def remove_note(note_id):

    try:

        note = get_note_by_id(
            note_id
        )


        if note:

            for field in [
                "pdf_file",
                "thumbnail",
            ]:

                filename = note.get(
                    field
                )


                if filename:

                    path = os.path.join(
                        Config.UPLOAD_FOLDER,
                        filename,
                    )


                    try:

                        if os.path.exists(
                            path
                        ):
                            os.remove(path)

                    except OSError:

                        logger.warning(
                            "Could not delete file: %s",
                            path,
                        )


        delete_note(
            note_id
        )


        from models.admin_log import (
            log_action
        )


        log_action(
            session["user_id"],
            f"Deleted note {note_id}",
        )


        logger.info(
            "Note deleted: %s by admin %s",
            note_id,
            session["user_id"],
        )


        return jsonify({
            "message": "Note deleted successfully"
        })


    except Exception as error:

        logger.exception(
            "Delete note failed: %s",
            error,
        )


        return jsonify({
            "error": "Delete failed"
        }), 500