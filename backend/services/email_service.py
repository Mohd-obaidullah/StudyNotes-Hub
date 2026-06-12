from flask_mail import Message
from flask import current_app

def send_welcome_email(mail, user_name, user_email):
    try:
        msg = Message(
            subject="Welcome to StudyNotes Hub",
            recipients=[user_email],
        )
        msg.html = f"""
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:8px">
          <h2 style="color:#4f46e5">Welcome, {user_name}!</h2>
          <p>Thanks for joining <strong>StudyNotes Hub</strong>. You now have access to high-quality study notes to boost your academic performance.</p>
          <a href="{current_app.config.get('FRONTEND_URL', 'http://localhost:3000')}/notes"
             style="display:inline-block;margin-top:16px;padding:12px 24px;background:#4f46e5;color:#fff;border-radius:6px;text-decoration:none">
            Browse Notes
          </a>
          <p style="margin-top:24px;color:#6b7280;font-size:13px">StudyNotes Hub Team</p>
        </div>
        """
        mail.send(msg)
    except Exception as e:
        current_app.logger.warning("Welcome email failed: %s", e)

def send_purchase_receipt(mail, user_name, user_email, note_title, amount, payment_id):
    try:
        msg = Message(
            subject=f"Purchase Confirmed – {note_title}",
            recipients=[user_email],
        )
        msg.html = f"""
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:8px">
          <h2 style="color:#4f46e5">Payment Successful</h2>
          <p>Hi {user_name}, your purchase is confirmed.</p>
          <table style="width:100%;border-collapse:collapse;margin-top:16px">
            <tr><td style="padding:8px;border:1px solid #e5e7eb"><strong>Note</strong></td><td style="padding:8px;border:1px solid #e5e7eb">{note_title}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb"><strong>Amount</strong></td><td style="padding:8px;border:1px solid #e5e7eb">₹{amount}</td></tr>
            <tr><td style="padding:8px;border:1px solid #e5e7eb"><strong>Payment ID</strong></td><td style="padding:8px;border:1px solid #e5e7eb">{payment_id}</td></tr>
          </table>
          <p style="margin-top:16px">Visit <a href="{current_app.config.get('FRONTEND_URL','http://localhost:3000')}/my-notes">My Notes</a> to access your content.</p>
          <p style="margin-top:24px;color:#6b7280;font-size:13px">StudyNotes Hub Team</p>
        </div>
        """
        mail.send(msg)
    except Exception as e:
        current_app.logger.warning("Receipt email failed: %s", e)
