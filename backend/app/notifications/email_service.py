import logging

from .email_client import get_email_sender, get_resend_module
from .email_templates import (
    render_feedback_request_email,
    render_order_confirmation_email,
)

logger = logging.getLogger(__name__)


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
