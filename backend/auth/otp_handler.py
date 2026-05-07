"""Simple in-memory OTP store (dev mode). Replace with Redis for production."""
import random, time
from typing import Optional

_store: dict[str, tuple[str, float]] = {}  # phone -> (otp, expires_at)
OTP_TTL = 300  # 5 min


def generate_otp(phone: str) -> str:
    otp = str(random.randint(100000, 999999))
    _store[phone] = (otp, time.time() + OTP_TTL)
    return otp


def verify_otp(phone: str, otp: str) -> bool:
    entry = _store.get(phone)
    if not entry:
        return False
    stored_otp, expires_at = entry
    if time.time() > expires_at:
        del _store[phone]
        return False
    if stored_otp != otp:
        return False
    del _store[phone]
    return True
