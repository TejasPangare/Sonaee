import firebase_admin
from firebase_admin import credentials
from pathlib import Path
import json
import logging
import os

logger = logging.getLogger(__name__)


def _load_firebase_credentials():
    """Load Firebase credentials from environment variable or local file."""
    # Try environment variable first
    firebase_json = os.getenv("FIREBASE_SERVICE_ACCOUNT_KEY_JSON")
    if firebase_json:
        try:
            cred_dict = json.loads(firebase_json)
            logger.info("Firebase Admin: Credentials loaded from FIREBASE_SERVICE_ACCOUNT_KEY_JSON environment variable")
            return credentials.Certificate(cred_dict)
        except json.JSONDecodeError as e:
            logger.error(f"Firebase Admin: Invalid JSON in FIREBASE_SERVICE_ACCOUNT_KEY_JSON: {e}")
            raise

    # Fallback to local file for development
    cred_path = Path(__file__).resolve().parent / "serviceAccountKey.json"
    print(cred_path)
    print(cred_path.exists())
    if cred_path.exists():
        logger.info(f"Firebase Admin: Credentials loaded from {cred_path}")
        return credentials.Certificate(str(cred_path))

    # No credentials found
    logger.warning(
        "Firebase Admin: No credentials found. Checked FIREBASE_SERVICE_ACCOUNT_KEY_JSON env var and "
        f"{cred_path}. Push notifications may not work. Set FIREBASE_SERVICE_ACCOUNT_KEY_JSON or create "
        "serviceAccountKey.json for local development."
    )
    return None


# Initialize Firebase Admin
cred = _load_firebase_credentials()
if cred:
    firebase_admin.initialize_app(cred)
    logger.info("Firebase Admin SDK initialized successfully")
else:
    logger.warning("Firebase Admin SDK initialization skipped - credentials not available")
