"""Email notifications — local SMTP (no cloud). Configure SMTP_HOST in .env."""
import smtplib, ssl
from email.mime.text import MIMEText
from config import settings


def send_email(to: str, subject: str, body: str) -> bool:
    if not settings.smtp_host:
        print(f"[EMAIL STUB] To: {to} | Subject: {subject}")
        return True
    try:
        msg = MIMEText(body, "html")
        msg["Subject"] = subject
        msg["From"]    = settings.smtp_from
        msg["To"]      = to
        ctx = ssl.create_default_context()
        with smtplib.SMTP_SSL(settings.smtp_host, settings.smtp_port, context=ctx) as s:
            s.login(settings.smtp_user, settings.smtp_password)
            s.sendmail(settings.smtp_from, to, msg.as_string())
        return True
    except Exception as e:
        print(f"Email error: {e}")
        return False
