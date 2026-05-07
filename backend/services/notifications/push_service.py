"""Push notification stub."""

def send_push(user_id: str, title: str, body: str, data: dict = None) -> bool:
    print(f"[PUSH STUB] user={user_id} | {title}: {body}")
    return True
