import json
import logging
from pathlib import Path
from typing import Optional

import firebase_admin
from firebase_admin import credentials, messaging

from .config import settings

logger = logging.getLogger(__name__)


def _load_firebase_credentials() -> Optional[credentials.Base]:
    if settings.firebase_service_account_key_json:
        try:
            return credentials.Certificate(
                json.loads(settings.firebase_service_account_key_json)
            )
        except json.JSONDecodeError:
            logger.warning(
                "FIREBASE_SERVICE_ACCOUNT_KEY_JSON is not valid JSON. Push notifications are disabled."
            )
            return None

    if settings.firebase_service_account_key_path:
        credential_path = Path(settings.firebase_service_account_key_path).expanduser()
        if credential_path.is_file():
            return credentials.Certificate(str(credential_path))
        logger.warning(
            "Firebase service account file was not found at %s. Push notifications are disabled.",
            credential_path,
        )

    return None


def _ensure_firebase() -> bool:
    try:
        firebase_admin.get_app()
        return True
    except ValueError:
        pass

    firebase_credentials = _load_firebase_credentials()
    if not firebase_credentials:
        return False

    firebase_admin.initialize_app(firebase_credentials)
    return True


def send_push(token: str, title: str, body: str):
    if not token:
        logger.info("Push notification skipped because the order has no FCM token.")
        return None

    if not _ensure_firebase():
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

    if not _ensure_firebase():
        logger.info("Admin notification skipped because Firebase Admin is not configured.")
        return []

    # Import here to avoid circular imports
    from . import crud

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
