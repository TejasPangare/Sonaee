from .email_service import send_feedback_request, send_order_confirmation
from .push_service import send_push, send_push_to_admins


def notify_customer_status(token: str, title: str, body: str):
    return send_push(token=token, title=title, body=body)


def notify_admin_new_order(order, body=None, db=None):
    if body is not None:
        return send_push_to_admins(title=order, body=body, db=db)
    return send_push_to_admins(
        title="New Order",
        body=f"A new order #{order.order_number} has been placed.",
        db=db,
    )


def notify_admin_order_cancelled(order, body=None, db=None):
    if body is not None:
        return send_push_to_admins(title=order, body=body, db=db)
    return send_push_to_admins(
        title="Order Cancelled",
        body=f"Order #{order.order_number} has been cancelled.",
        db=db,
    )


def notify_customer_order_created(order):
    return send_order_confirmation(order)


def notify_customer_status_changed(order):
    return send_push(
        token=order.fcm_token,
        title="Order Update",
        body=f"Your order is now {order.status}",
    )


def notify_customer_feedback_request(order):
    return send_feedback_request(order)


def notify_contact_inquiry(inquiry):
    return None


def notify_table_reservation(reservation):
    return None


def notify_banquet_inquiry(inquiry):
    return None
