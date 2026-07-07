import logging
import json

from .. import crud
from ..database import SessionLocal
from .email_client import get_email_sender, get_resend_module
from .email_templates import (
    render_banquet_inquiry_email,
    render_contact_inquiry_email,
    render_feedback_request_email,
    render_order_confirmation_email,
)

logger = logging.getLogger(__name__)
INQUIRY_RECIPIENT = "tejaspangare1004@gmail.com"
SITE_SETTINGS_KEY = "site_settings"


def _get_customer_email(order) -> str | None:
    customer = getattr(order, "customer", None)
    email = getattr(customer, "email", None)
    if not email:
        logger.warning(
            "Email notification skipped because the order customer email is missing."
        )
        return None
    return email


def _send_email(*, to_email: str, subject: str, html: str) -> bool:
    resend = get_resend_module()
    email_from = get_email_sender()
    if resend is None or not email_from:
        return False

    params = {
        "from": email_from,
        "to": [to_email],
        "subject": subject,
        "html": html,
    }

    try:
        resend.Emails.send(params)
        return True
    except Exception as error:  # pragma: no cover - external service call
        logger.warning("Email notification failed: %s", error)
        return False


def _get_inquiry_recipient(metadata_key: str) -> str:
    db = SessionLocal()
    try:
        section = crud.get_content_section_by_key(db, SITE_SETTINGS_KEY)
        metadata = {}
        if section and getattr(section, "metadata_json", None):
            try:
                metadata = json.loads(section.metadata_json)
            except json.JSONDecodeError:
                metadata = {}

        recipient = metadata.get(metadata_key)
        if isinstance(recipient, str) and recipient.strip():
            return recipient.strip()
        return INQUIRY_RECIPIENT
    except Exception:
        return INQUIRY_RECIPIENT
    finally:
        db.close()


def send_order_confirmation(order) -> bool:
    try:
        customer_email = _get_customer_email(order)
        if not customer_email:
            return False

        return _send_email(
            to_email=customer_email,
            subject=f"Order Confirmation #{order.order_number}",
            html=render_order_confirmation_email(order),
        )
    except Exception as error:  # pragma: no cover - defensive guard
        logger.warning("Order confirmation email failed: %s", error)
        return False


def send_feedback_request(order) -> bool:
    try:
        customer_email = _get_customer_email(order)
        if not customer_email:
            return False

        return _send_email(
            to_email=customer_email,
            subject=f"How was your order #{order.order_number}?",
            html=render_feedback_request_email(order),
        )
    except Exception as error:  # pragma: no cover - defensive guard
        logger.warning("Feedback request email failed: %s", error)
        return False


def send_contact_inquiry(inquiry) -> bool:
    try:
        recipient = _get_inquiry_recipient("contactInquiryRecipient")
        return _send_email(
            to_email=recipient,
            subject=f"Contact Inquiry: {getattr(inquiry, 'subject', 'New message')}",
            html=render_contact_inquiry_email(inquiry),
        )
    except Exception as error:  # pragma: no cover - defensive guard
        logger.warning("Contact inquiry email failed: %s", error)
        return False


def send_banquet_inquiry(inquiry) -> bool:
    try:
        event_type = getattr(inquiry, "event_type", "Banquet Inquiry")
        recipient = _get_inquiry_recipient("banquetInquiryRecipient")
        return _send_email(
            to_email=recipient,
            subject=f"Banquet Inquiry: {event_type}",
            html=render_banquet_inquiry_email(inquiry),
        )
    except Exception as error:  # pragma: no cover - defensive guard
        logger.warning("Banquet inquiry email failed: %s", error)
        return False
