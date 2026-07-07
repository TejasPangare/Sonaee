import logging
import os

try:
    import resend
except ImportError:  # pragma: no cover - dependency availability varies by environment
    resend = None

logger = logging.getLogger(__name__)


def get_email_sender() -> str | None:
    email_from = os.getenv("EMAIL_FROM")
    if not email_from:
        logger.warning("Email notifications are disabled because EMAIL_FROM is not configured.")
        return None
    return email_from


def get_resend_module():
    if resend is None:
        logger.warning("Email notifications are disabled because the resend package is not installed.")
        return None

    api_key = os.getenv("RESEND_API_KEY")
    if not api_key:
        logger.warning("Email notifications are disabled because RESEND_API_KEY is not configured.")
        return None

    resend.api_key = api_key
    return resend
