from firebase_admin import messaging
import sys


def send_push(token: str, title: str, body: str):
    if not token:
        print("Push notification skipped: no FCM token", file=sys.stderr)
        return None

    message = messaging.Message(
        token=token,
        notification=messaging.Notification(
            title=title,
            body=body
        )
    )
    print(f"[PUSH] Sending to token: {token[:20]}...", file=sys.stderr)
    print(f"[PUSH] Title: {title}, Body: {body}", file=sys.stderr)
    try:
        response = messaging.send(message)
        print(f"[PUSH] Success! Response: {response}", file=sys.stderr)
        return response
    except Exception as error:
        print(f"[PUSH] Failed: {type(error).__name__}: {error}", file=sys.stderr)
        return None
