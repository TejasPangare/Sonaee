"""
Reset customer and order tables for the customer-account migration.

This script is destructive for customer/order data:
- drops order_items
- drops orders
- drops customers
- recreates customers, orders, order_items with the current ORM schema

Usage:
    python reset_customer_order_schema.py
"""

from app.database import engine
from app.models import Customer, Order, OrderItem


def main() -> None:
    print("Resetting customers, orders, and order_items tables...")

    OrderItem.__table__.drop(bind=engine, checkfirst=True)
    Order.__table__.drop(bind=engine, checkfirst=True)
    Customer.__table__.drop(bind=engine, checkfirst=True)

    Customer.__table__.create(bind=engine, checkfirst=True)
    Order.__table__.create(bind=engine, checkfirst=True)
    OrderItem.__table__.create(bind=engine, checkfirst=True)

    print("Done. Customer and order tables now match the current application schema.")


if __name__ == "__main__":
    main()
