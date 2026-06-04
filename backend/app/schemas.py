from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum


# Enums
class OrderStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PREPARING = "preparing"
    READY = "ready"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


class OrderType(str, Enum):
    TAKEAWAY = "takeaway"
    DINE_IN = "dine_in"


class TableStatus(str, Enum):
    AVAILABLE = "available"
    OCCUPIED = "occupied"
    RESERVED = "reserved"


# Category Schemas
class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    display_order: int = 0
    is_active: bool = True


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    display_order: Optional[int] = None
    is_active: Optional[bool] = None


class Category(CategoryBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# MenuItem Schemas
class MenuItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    image_url: Optional[str] = None
    category_id: int
    is_available: bool = True
    is_vegetarian: bool = False
    is_vegan: bool = False
    is_gluten_free: bool = False
    spice_level: int = 0
    prep_time_minutes: int = 15


class MenuItemCreate(MenuItemBase):
    pass


class MenuItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    image_url: Optional[str] = None
    category_id: Optional[int] = None
    is_available: Optional[bool] = None
    is_vegetarian: Optional[bool] = None
    is_vegan: Optional[bool] = None
    is_gluten_free: Optional[bool] = None
    spice_level: Optional[int] = None
    prep_time_minutes: Optional[int] = None


class MenuItem(MenuItemBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class MenuItemWithCategory(MenuItem):
    category: Category


# Table Schemas
class TableBase(BaseModel):
    table_number: str
    capacity: int
    location: Optional[str] = None
    status: TableStatus = TableStatus.AVAILABLE
    is_active: bool = True


class TableCreate(TableBase):
    pass


class TableUpdate(BaseModel):
    table_number: Optional[str] = None
    capacity: Optional[int] = None
    location: Optional[str] = None
    status: Optional[TableStatus] = None
    is_active: Optional[bool] = None


class Table(TableBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# OrderItem Schemas
class OrderItemBase(BaseModel):
    menu_item_id: int
    quantity: int
    special_instructions: Optional[str] = None


class OrderItemCreate(OrderItemBase):
    pass


class OrderItem(OrderItemBase):
    id: int
    order_id: int
    unit_price: float
    total_price: float
    created_at: datetime

    class Config:
        from_attributes = True


class OrderItemWithMenuItem(OrderItem):
    menu_item: MenuItem


# Order Schemas
class CustomerBase(BaseModel):
    full_name: str
    email: EmailStr
    phone: str


class CustomerCreate(CustomerBase):
    pass


class Customer(CustomerBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class OrderBase(BaseModel):
    order_type: OrderType
    table_id: Optional[int] = None
    special_instructions: Optional[str] = None


class OrderCreate(OrderBase):
    items: List[OrderItemCreate]
    fcm_token: Optional[str] = None


class OrderUpdate(BaseModel):
    status: Optional[OrderStatus] = None
    special_instructions: Optional[str] = None
    estimated_ready_time: Optional[datetime] = None


class Order(OrderBase):
    id: int
    order_number: str
    customer_id: int
    status: OrderStatus
    subtotal: float
    tax: float
    total: float
    estimated_ready_time: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class OrderWithItems(Order):
    customer: Customer
    items: List[OrderItemWithMenuItem]
    table: Optional[Table] = None


# Admin Schemas
class AdminBase(BaseModel):
    email: EmailStr
    full_name: str
    is_active: bool = True
    is_superadmin: bool = False


class AdminCreate(AdminBase):
    password: str


class AdminUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None
    is_superadmin: Optional[bool] = None


class Admin(AdminBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: Optional[str] = None


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class CustomerLoginRequest(BaseModel):
    email: EmailStr
    phone: str


class CustomerRegisterRequest(CustomerLoginRequest):
    full_name: str


# Dashboard Stats
class DashboardStats(BaseModel):
    total_orders_today: int
    total_revenue_today: float
    pending_orders: int
    completed_orders_today: int
    available_tables: int
    occupied_tables: int
