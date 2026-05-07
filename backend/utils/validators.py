import re

PHONE_RE = re.compile(r"^[+]?[0-9]{10,15}$")
BLOOD_GROUPS = {"A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"}


def valid_phone(phone: str) -> bool:
    return bool(PHONE_RE.match(phone.replace(" ", "").replace("-", "")))


def valid_blood_group(bg: str) -> bool:
    return bg.upper() in BLOOD_GROUPS
