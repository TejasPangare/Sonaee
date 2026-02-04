from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from ..database import get_db
from .. import crud, schemas
from ..auth import get_current_admin

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


@router.post("/", response_model=schemas.OrderWithItems)
def create_order(
    order: schemas.OrderCreate,
    db: Session = Depends(get_db)
):
    """Create a new order (public endpoint)"""
    try:
        return crud.create_order(db, order)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


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
    return order


@router.get("/pending/count")
def get_pending_orders_count(
    db: Session = Depends(get_db),
    admin: schemas.Admin = Depends(get_current_admin)
):
    """Get count of pending orders (admin only)"""
    orders = crud.get_orders(db, status=schemas.OrderStatus.PENDING)
    return {"count": len(orders)}
