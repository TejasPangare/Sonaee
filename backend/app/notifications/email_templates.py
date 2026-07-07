from html import escape
from typing import Any


def _format_currency(amount) -> str:
    return f"Rs. {float(amount):.2f}"


def _format_order_type(order_type) -> str:
    return str(order_type).replace("_", " ").title()


def _render_order_items_rows(order) -> str:
    rows = []
    for item in getattr(order, "items", []):
        item_name = escape(getattr(getattr(item, "menu_item", None), "name", "Item"))
        quantity = escape(str(getattr(item, "quantity", "")))
        total_price = _format_currency(getattr(item, "total_price", 0))
        rows.append(
            f"""
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0e4d7; color: #2f241f;">{item_name}</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0e4d7; color: #6b5647; text-align: center;">{quantity}</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0e4d7; color: #2f241f; text-align: right;">{total_price}</td>
            </tr>
            """
        )
    return "".join(rows)


def _wrap_email(title: str, body_html: str) -> str:
    return f"""
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{escape(title)}</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f7f0e8; font-family: Arial, sans-serif; color: #2f241f;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #f7f0e8; padding: 24px 12px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width: 640px; background-color: #ffffff; border-radius: 18px; overflow: hidden;">
                <tr>
                  <td style="background: linear-gradient(135deg, #0f6a4e, #1c8b67); padding: 28px 32px; color: #ffffff;">
                    <div style="font-size: 28px; font-weight: 700; letter-spacing: 0.02em;">Sonaee Veg</div>
                    <div style="margin-top: 6px; font-size: 14px; opacity: 0.9;">Fresh vegetarian dining, thoughtfully prepared.</div>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 32px;">
                    {body_html}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 20px 32px 32px; color: #8b7463; font-size: 13px; line-height: 1.6;">
                    Thank you for choosing Sonaee Veg.<br />
                    This is an automated transactional email from your order notifications service.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
    """


def _render_inquiry_rows(fields: list[tuple[str, Any]]) -> str:
    rows = []
    for label, value in fields:
        if value in (None, ""):
            display_value = "N/A"
        else:
            display_value = escape(str(value))

        rows.append(
            f"""
            <tr>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0e4d7; width: 180px; color: #8b7463; vertical-align: top;">{escape(label)}</td>
              <td style="padding: 12px 0; border-bottom: 1px solid #f0e4d7; color: #2f241f;">{display_value}</td>
            </tr>
            """
        )

    return "".join(rows)


def render_order_confirmation_email(order) -> str:
    customer_name = escape(getattr(getattr(order, "customer", None), "full_name", "Customer"))
    order_number = escape(getattr(order, "order_number", ""))
    order_type = escape(_format_order_type(getattr(order, "order_type", "")))
    total = _format_currency(getattr(order, "total", 0))
    items_rows = _render_order_items_rows(order)

    body_html = f"""
    <h1 style="margin: 0 0 12px; font-size: 28px; color: #2f241f;">Order Confirmed</h1>
    <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7; color: #5e4b3e;">
      Hi {customer_name}, thanks for your order. We have received it and started processing it.
    </p>
    <div style="background-color: #fbf7f2; border: 1px solid #efdfcf; border-radius: 14px; padding: 20px; margin-bottom: 24px;">
      <div style="font-size: 14px; color: #8b7463; margin-bottom: 8px;">Order Number</div>
      <div style="font-size: 22px; font-weight: 700; color: #2f241f;">#{order_number}</div>
      <div style="margin-top: 16px; font-size: 14px; color: #8b7463;">Order Type</div>
      <div style="font-size: 16px; font-weight: 600; color: #2f241f;">{order_type}</div>
    </div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; margin-bottom: 20px;">
      <tr>
        <th align="left" style="padding-bottom: 10px; font-size: 13px; color: #8b7463; border-bottom: 2px solid #efdfcf;">Item</th>
        <th align="center" style="padding-bottom: 10px; font-size: 13px; color: #8b7463; border-bottom: 2px solid #efdfcf;">Qty</th>
        <th align="right" style="padding-bottom: 10px; font-size: 13px; color: #8b7463; border-bottom: 2px solid #efdfcf;">Total</th>
      </tr>
      {items_rows}
    </table>
    <div style="text-align: right; font-size: 18px; font-weight: 700; color: #0f6a4e;">
      Total: {total}
    </div>
    """
    return _wrap_email("Sonaee Veg Order Confirmation", body_html)


def render_feedback_request_email(order) -> str:
    customer_name = escape(getattr(getattr(order, "customer", None), "full_name", "Customer"))
    order_number = escape(getattr(order, "order_number", ""))
    feedback_url = f"https://example.com/feedback?order={order_number}"

    body_html = f"""
    <h1 style="margin: 0 0 12px; font-size: 28px; color: #2f241f;">Thank You for Dining with Sonaee Veg</h1>
    <p style="margin: 0 0 18px; font-size: 16px; line-height: 1.7; color: #5e4b3e;">
      Hi {customer_name}, we hope you enjoyed your order.
    </p>
    <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7; color: #5e4b3e;">
      Your feedback for order #{order_number} helps us keep improving the Sonaee Veg experience.
    </p>
    <div style="text-align: center; margin: 32px 0;">
      <a href="{escape(feedback_url)}" style="display: inline-block; background-color: #0f6a4e; color: #ffffff; text-decoration: none; font-weight: 700; padding: 14px 28px; border-radius: 999px;">
        Leave Feedback
      </a>
    </div>
    <p style="margin: 0; font-size: 14px; line-height: 1.7; color: #8b7463;">
      We appreciate your time and look forward to serving you again soon.
    </p>
    """
    return _wrap_email("Share Your Sonaee Veg Feedback", body_html)


def render_contact_inquiry_email(inquiry) -> str:
    first_name = escape(getattr(inquiry, "first_name", ""))
    last_name = escape(getattr(inquiry, "last_name", ""))
    full_name = f"{first_name} {last_name}".strip() or "Customer"
    fields = [
        ("Name", full_name),
        ("Email", getattr(inquiry, "email", "")),
        ("Phone", getattr(inquiry, "phone", "")),
        ("Subject", getattr(inquiry, "subject", "")),
        ("Message", getattr(inquiry, "message", "")),
    ]

    body_html = f"""
    <h1 style="margin: 0 0 12px; font-size: 28px; color: #2f241f;">Contact Inquiry</h1>
    <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7; color: #5e4b3e;">
      A customer has submitted a general enquiry from the website.
    </p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
      {_render_inquiry_rows(fields)}
    </table>
    """
    return _wrap_email("Sonaee Veg Contact Inquiry", body_html)


def render_banquet_inquiry_email(inquiry) -> str:
    event_date = getattr(inquiry, "event_date", None)
    formatted_date = event_date.strftime("%B %d, %Y") if event_date else "N/A"
    fields = [
        ("Name", getattr(inquiry, "name", "")),
        ("Phone", getattr(inquiry, "phone", "")),
        ("Email", getattr(inquiry, "email", "")),
        ("Event Type", getattr(inquiry, "event_type", "")),
        ("Event Date", formatted_date),
        ("Expected Guests", getattr(inquiry, "expected_guests", "")),
        ("Budget", getattr(inquiry, "budget", "")),
        ("Additional Requirements", getattr(inquiry, "additional_requirements", "")),
    ]

    body_html = f"""
    <h1 style="margin: 0 0 12px; font-size: 28px; color: #2f241f;">Banquet Inquiry</h1>
    <p style="margin: 0 0 24px; font-size: 16px; line-height: 1.7; color: #5e4b3e;">
      A customer has submitted a banquet enquiry from the website.
    </p>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
      {_render_inquiry_rows(fields)}
    </table>
    """
    return _wrap_email("Sonaee Veg Banquet Inquiry", body_html)
