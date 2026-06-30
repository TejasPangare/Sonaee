from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, and_
from datetime import datetime, timedelta
from typing import List, Optional
import random
import string

from . import models, schemas
from .auth import get_password_hash


# Helper function to generate order number
def generate_order_number() -> str:
    prefix = "ORD"
    timestamp = datetime.now().strftime("%y%m%d")
    random_suffix = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
    return f"{prefix}-{timestamp}-{random_suffix}"


# Category CRUD
def get_categories(db: Session, skip: int = 0, limit: int = 100, active_only: bool = False):
    query = db.query(models.Category)
    if active_only:
        query = query.filter(models.Category.is_active == True)
    return query.order_by(models.Category.display_order).offset(skip).limit(limit).all()


def get_category(db: Session, category_id: int):
    return db.query(models.Category).filter(models.Category.id == category_id).first()


def create_category(db: Session, category: schemas.CategoryCreate):
    db_category = models.Category(**category.model_dump())
    db.add(db_category)
    db.commit()
    db.refresh(db_category)
    return db_category


def update_category(db: Session, category_id: int, category: schemas.CategoryUpdate):
    db_category = get_category(db, category_id)
    if db_category:
        update_data = category.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_category, key, value)
        db.commit()
        db.refresh(db_category)
    return db_category


def delete_category(db: Session, category_id: int):
    db_category = get_category(db, category_id)
    if db_category:
        db.delete(db_category)
        db.commit()
        return True
    return False


# MenuItem CRUD
def get_menu_items(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    category_id: Optional[int] = None,
    available_only: bool = False,
    search: Optional[str] = None
):
    query = db.query(models.MenuItem).options(joinedload(models.MenuItem.category))
    
    if category_id:
        query = query.filter(models.MenuItem.category_id == category_id)
    if available_only:
        query = query.filter(models.MenuItem.is_available == True)
    if search:
        query = query.filter(models.MenuItem.name.ilike(f"%{search}%"))
    
    return query.offset(skip).limit(limit).all()


def get_menu_item(db: Session, item_id: int):
    return db.query(models.MenuItem).options(
        joinedload(models.MenuItem.category)
    ).filter(models.MenuItem.id == item_id).first()


def create_menu_item(db: Session, item: schemas.MenuItemCreate):
    db_item = models.MenuItem(**item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def update_menu_item(db: Session, item_id: int, item: schemas.MenuItemUpdate):
    db_item = get_menu_item(db, item_id)
    if db_item:
        update_data = item.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_item, key, value)
        db.commit()
        db.refresh(db_item)
    return db_item


def delete_menu_item(db: Session, item_id: int):
    db_item = db.query(models.MenuItem).filter(models.MenuItem.id == item_id).first()
    if db_item:
        db.delete(db_item)
        db.commit()
        return True
    return False


# Table CRUD
def get_tables(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    status: Optional[schemas.TableStatus] = None,
    active_only: bool = False
):
    query = db.query(models.Table)
    if status:
        query = query.filter(models.Table.status == status)
    if active_only:
        query = query.filter(models.Table.is_active == True)
    return query.order_by(models.Table.table_number).offset(skip).limit(limit).all()


def get_table(db: Session, table_id: int):
    return db.query(models.Table).filter(models.Table.id == table_id).first()


def create_table(db: Session, table: schemas.TableCreate):
    db_table = models.Table(**table.model_dump())
    db.add(db_table)
    db.commit()
    db.refresh(db_table)
    return db_table


def update_table(db: Session, table_id: int, table: schemas.TableUpdate):
    db_table = get_table(db, table_id)
    if db_table:
        update_data = table.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_table, key, value)
        db.commit()
        db.refresh(db_table)
    return db_table


def delete_table(db: Session, table_id: int):
    db_table = get_table(db, table_id)
    if db_table:
        db.delete(db_table)
        db.commit()
        return True
    return False


# Order CRUD
def get_orders(
    db: Session,
    skip: int = 0,
    limit: int = 100,
    status: Optional[schemas.OrderStatus] = None,
    order_type: Optional[schemas.OrderType] = None,
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None
):
    query = db.query(models.Order).options(
        joinedload(models.Order.customer),
        joinedload(models.Order.items).joinedload(models.OrderItem.menu_item),
        joinedload(models.Order.table)
    )
    
    if status:
        query = query.filter(models.Order.status == status)
    if order_type:
        query = query.filter(models.Order.order_type == order_type)
    if date_from:
        query = query.filter(models.Order.created_at >= date_from)
    if date_to:
        query = query.filter(models.Order.created_at <= date_to)
    
    return query.order_by(models.Order.created_at.desc()).offset(skip).limit(limit).all()


def get_order(db: Session, order_id: int):
    return db.query(models.Order).options(
        joinedload(models.Order.customer),
        joinedload(models.Order.items).joinedload(models.OrderItem.menu_item),
        joinedload(models.Order.table)
    ).filter(models.Order.id == order_id).first()


def get_order_by_number(db: Session, order_number: str):
    return db.query(models.Order).options(
        joinedload(models.Order.customer),
        joinedload(models.Order.items).joinedload(models.OrderItem.menu_item),
        joinedload(models.Order.table)
    ).filter(models.Order.order_number == order_number).first()


def get_customer_by_id(db: Session, customer_id: int):
    return db.query(models.Customer).filter(models.Customer.id == customer_id).first()


def get_customer_by_email(db: Session, email: str):
    return db.query(models.Customer).filter(models.Customer.email == email).first()


def get_customer_by_phone(db: Session, phone: str):
    return db.query(models.Customer).filter(models.Customer.phone == phone).first()


def get_customer_by_email_and_phone(db: Session, email: str, phone: str):
    return db.query(models.Customer).filter(
        models.Customer.email == email,
        models.Customer.phone == phone,
    ).first()


def create_customer(db: Session, customer: schemas.CustomerCreate):
    db_customer = models.Customer(**customer.model_dump())
    db.add(db_customer)
    db.commit()
    db.refresh(db_customer)
    return db_customer


def create_order(db: Session, order: schemas.OrderCreate, customer_id: int):
    # Calculate totals
    subtotal = 0.0
    order_items = []
    
    for item in order.items:
        menu_item = db.query(models.MenuItem).filter(models.MenuItem.id == item.menu_item_id).first()
        if not menu_item:
            raise ValueError(f"Menu item {item.menu_item_id} not found")
        if not menu_item.is_available:
            raise ValueError(f"Menu item {menu_item.name} is not available")
        
        item_total = menu_item.price * item.quantity
        subtotal += item_total
        order_items.append({
            "menu_item_id": item.menu_item_id,
            "quantity": item.quantity,
            "unit_price": menu_item.price,
            "total_price": item_total,
            "special_instructions": item.special_instructions
        })
    
    tax = subtotal * 0.1  # 10% tax
    total = subtotal + tax

    customer = get_customer_by_id(db, customer_id)
    if not customer:
        raise ValueError("Customer not found")
    
    # Create order
    db_order = models.Order(
        order_number=generate_order_number(),
        customer_id=customer.id,
        order_type=order.order_type,
        table_id=order.table_id,
        special_instructions=order.special_instructions,
        subtotal=subtotal,
        tax=tax,
        total=total,
        fcm_token=order.fcm_token if order.fcm_token else None,
        estimated_ready_time=datetime.now() + timedelta(minutes=30)
    )
    db.add(db_order)
    db.flush()  # Get order ID
    
    # Create order items
    for item_data in order_items:
        db_order_item = models.OrderItem(order_id=db_order.id, **item_data)
        db.add(db_order_item)
    
    # Update table status if dine-in
    if order.order_type == schemas.OrderType.DINE_IN and order.table_id:
        table = get_table(db, order.table_id)
        if table:
            table.status = models.TableStatus.OCCUPIED
    
    db.commit()
    db.refresh(db_order)
    return get_order(db, db_order.id)


def update_order_status(db: Session, order_id: int, order_update: schemas.OrderUpdate):
    db_order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if db_order:
        update_data = order_update.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_order, key, value)
        
        # Free up table if order is completed/cancelled
        if order_update.status in [schemas.OrderStatus.COMPLETED, schemas.OrderStatus.CANCELLED]:
            if db_order.table_id:
                table = get_table(db, db_order.table_id)
                if table:
                    table.status = models.TableStatus.AVAILABLE
        
        db.commit()
        db.refresh(db_order)
    return get_order(db, order_id)


# Admin CRUD
def get_admin_by_email(db: Session, email: str):
    return db.query(models.Admin).filter(models.Admin.email == email).first()


def create_admin(db: Session, admin: schemas.AdminCreate):
    hashed_password = get_password_hash(admin.password)
    db_admin = models.Admin(
        email=admin.email,
        full_name=admin.full_name,
        hashed_password=hashed_password,
        is_active=admin.is_active,
        is_superadmin=admin.is_superadmin
    )
    db.add(db_admin)
    db.commit()
    db.refresh(db_admin)
    return db_admin


def get_content_sections(db: Session):
    return db.query(models.ContentSection).order_by(models.ContentSection.key).all()


def get_content_section_by_key(db: Session, key: str):
    return db.query(models.ContentSection).filter(models.ContentSection.key == key).first()


def upsert_content_section(db: Session, key: str, section: schemas.ContentSectionUpsert):
    db_section = get_content_section_by_key(db, key)
    data = section.model_dump()
    data["key"] = key

    if db_section:
      for field, value in data.items():
          setattr(db_section, field, value)
    else:
      db_section = models.ContentSection(**data)
      db.add(db_section)

    db.commit()
    db.refresh(db_section)
    return db_section


def get_content_items(db: Session, item_type: Optional[str] = None, active_only: bool = False):
    query = db.query(models.ContentItem)
    if item_type:
        query = query.filter(models.ContentItem.type == item_type)
    if active_only:
        query = query.filter(models.ContentItem.is_active == True)
    return query.order_by(models.ContentItem.type, models.ContentItem.display_order, models.ContentItem.id).all()


def get_content_item(db: Session, item_id: int):
    return db.query(models.ContentItem).filter(models.ContentItem.id == item_id).first()


def create_content_item(db: Session, item: schemas.ContentItemCreate):
    db_item = models.ContentItem(**item.model_dump())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item


def update_content_item(db: Session, item_id: int, item: schemas.ContentItemUpdate):
    db_item = get_content_item(db, item_id)
    if db_item:
        update_data = item.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(db_item, key, value)
        db.commit()
        db.refresh(db_item)
    return db_item


def delete_content_item(db: Session, item_id: int):
    db_item = get_content_item(db, item_id)
    if db_item:
        db.delete(db_item)
        db.commit()
        return True
    return False


# Dashboard Stats
def get_dashboard_stats(db: Session) -> schemas.DashboardStats:
    today_start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
    today_end = today_start + timedelta(days=1)
    
    # Orders today
    orders_today = db.query(models.Order).filter(
        and_(
            models.Order.created_at >= today_start,
            models.Order.created_at < today_end
        )
    ).all()
    
    total_orders_today = len(orders_today)
    total_revenue_today = sum(o.total for o in orders_today if o.status != schemas.OrderStatus.CANCELLED)
    completed_orders_today = len([o for o in orders_today if o.status == schemas.OrderStatus.COMPLETED])
    
    # Pending orders (all time)
    pending_orders = db.query(models.Order).filter(
        models.Order.status.in_([
            schemas.OrderStatus.PENDING,
            schemas.OrderStatus.CONFIRMED,
            schemas.OrderStatus.PREPARING
        ])
    ).count()
    
    # Table stats
    available_tables = db.query(models.Table).filter(
        and_(
            models.Table.status == schemas.TableStatus.AVAILABLE,
            models.Table.is_active == True
        )
    ).count()
    
    occupied_tables = db.query(models.Table).filter(
        and_(
            models.Table.status == schemas.TableStatus.OCCUPIED,
            models.Table.is_active == True
        )
    ).count()
    
    return schemas.DashboardStats(
        total_orders_today=total_orders_today,
        total_revenue_today=total_revenue_today,
        pending_orders=pending_orders,
        completed_orders_today=completed_orders_today,
        available_tables=available_tables,
        occupied_tables=occupied_tables
    )
