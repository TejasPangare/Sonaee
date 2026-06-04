from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from typing import List, Optional
from datetime import datetime

from ..database import get_db
from .. import crud, schemas, models
from ..auth import get_current_admin, get_current_customer_identity
from ..push import send_push

router = APIRouter(prefix="/orders", tags=["orders"])


@router.get("/", response_model=List[schemas.OrderWithItems])
def list_orders(
    skip: int = 0,
    limit: int = 100,
    status: Optional[schemas.OrderStatus] = None,
    order_type: Optional[schemas.OrderType] = None,
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None,
    db: Session = Depends(get_db),
    admin: schemas.Admin = Depends(get_current_admin)
):
    """Get all orders (admin only)"""
    return crud.get_orders(
        db,
        skip=skip,
        limit=limit,
        status=status,
        order_type=order_type,
        date_from=date_from,
        date_to=date_to
    )


@router.post("/", response_model=schemas.OrderWithItems)
def create_order(
    order: schemas.OrderCreate,
    db: Session = Depends(get_db),
    customer_identity: dict[str, str | int] = Depends(get_current_customer_identity)
):
    """Create a new order for the authenticated customer."""
    try:
        return crud.create_order(db, order, customer_id=int(customer_identity["customer_id"]))
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/my", response_model=List[schemas.OrderWithItems])
def get_my_orders(
    db: Session = Depends(get_db),
    customer_identity: dict[str, str | int] = Depends(get_current_customer_identity)
):
    """Get orders for the currently authenticated customer."""
    orders = db.query(models.Order).options(
        joinedload(models.Order.customer),
        joinedload(models.Order.items).joinedload(models.OrderItem.menu_item),
        joinedload(models.Order.table)
    ).filter(models.Order.customer_id == int(customer_identity["customer_id"])).order_by(models.Order.created_at.desc()).all()
    print(f"[ORDERS] Retrieved {len(orders)} orders for customer id={customer_identity['customer_id']}")
    return orders


@router.get("/by-number/{order_number}", response_model=schemas.OrderWithItems)
def get_order_by_number(
    order_number: str,
    db: Session = Depends(get_db)
):
    """Get order by order number (public endpoint for order tracking)"""
    order = crud.get_order_by_number(db, order_number)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.get("/{order_id}", response_model=schemas.OrderWithItems)
def get_order(
    order_id: int,
    db: Session = Depends(get_db)
):
    """Get a specific order by ID"""
    order = crud.get_order(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order


@router.post("/{order_id}/cancel", response_model=schemas.OrderWithItems)
def cancel_order(
    order_id: int,
    db: Session = Depends(get_db),
    customer_identity: dict[str, str | int] = Depends(get_current_customer_identity)
):
    """Allow a customer to cancel their own order if still pending"""
    order = crud.get_order(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.customer_id != int(customer_identity["customer_id"]):
        raise HTTPException(status_code=403, detail="Not authorized to cancel this order")
    if order.status != schemas.OrderStatus.PENDING:
        raise HTTPException(status_code=400, detail="Only pending orders can be cancelled")

    order.status = schemas.OrderStatus.CANCELLED
    if order.table_id:
        table = crud.get_table(db, order.table_id)
        if table:
            table.status = models.TableStatus.AVAILABLE

    db.commit()
    db.refresh(order)
    return crud.get_order(db, order_id)


@router.patch("/{order_id}/status", response_model=schemas.OrderWithItems)
def update_order_status(
    order_id: int,
    order_update: schemas.OrderUpdate,
    db: Session = Depends(get_db),
    admin: schemas.Admin = Depends(get_current_admin)
):
    """Update order status (admin only)"""
    order = crud.update_order_status(db, order_id, order_update)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if order.fcm_token:
        send_push(
            token=order.fcm_token,
            title="Order Update",
            body=f"Your order is now {order.status}"
        )
    return order


@router.get("/pending/count")
def get_pending_orders_count(
    db: Session = Depends(get_db),
    admin: schemas.Admin = Depends(get_current_admin)
):
    """Get count of pending orders (admin only)"""
    orders = crud.get_orders(db, status=schemas.OrderStatus.PENDING)
    return {"count": len(orders)}
