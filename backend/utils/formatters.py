from datetime import datetime


def format_date(iso_str: str) -> str:
    try:
        return datetime.fromisoformat(iso_str).strftime("%d %b %Y")
    except Exception:
        return iso_str


def format_datetime(iso_str: str) -> str:
    try:
        return datetime.fromisoformat(iso_str).strftime("%d %b %Y, %I:%M %p")
    except Exception:
        return iso_str


def bytes_to_mb(b: int) -> str:
    return f"{b / 1024 / 1024:.2f} MB"
