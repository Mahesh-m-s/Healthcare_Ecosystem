"""SMS stub — integrations can be added without cloud deps."""

def send_sms(phone: str, message: str) -> bool:
    print(f"[SMS STUB] To: {phone} | Message: {message}")
    return True
