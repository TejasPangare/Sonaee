import logging

import firebase_admin
from firebase_admin import messaging

logger = logging.getLogger(__name__)


def _is_firebase_initialized() -> bool:
    try:
        firebase_admin.get_app()
        return True
    except ValueError:
        return False


def send_push(token: str, title: str, body: str):
    if not token:
        logger.info("Push notification skipped because the order has no FCM token.")
        return None

    if not _is_firebase_initialized():
        logger.info("Push notification skipped because Firebase Admin is not configured.")
        return None

    message = messaging.Message(
        token=token,
        notification=messaging.Notification(title=title, body=body),
    )

    try:
        return messaging.send(message)
    except Exception as error:  # pragma: no cover - external service call
        logger.warning("Push notification failed: %s", error)
        return None


def send_push_to_admins(title: str, body: str, db=None):
    """Send push notification to all active admins with registered FCM tokens"""
    if not db:
        logger.warning("Database session not provided for admin notifications")
        return []

    if not _is_firebase_initialized():
        logger.info("Admin notification skipped because Firebase Admin is not configured.")
        return []

    # Import here to avoid circular imports
    from .. import crud

    admins = crud.get_active_admins_with_fcm_token(db)
    if not admins:
        logger.info("No active admins with FCM tokens to notify")
        return []

    results = []
    for admin in admins:
        if admin.fcm_token:
            message = messaging.Message(
                token=admin.fcm_token,
                notification=messaging.Notification(title=title, body=body),
            )
            try:
                response = messaging.send(message)
                results.append(response)
                logger.info(f"Admin notification sent to {admin.email}")
            except Exception as error:  # pragma: no cover - external service call
                logger.warning(f"Admin notification failed for {admin.email}: {error}")
    
    return results
