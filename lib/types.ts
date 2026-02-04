export interface Category {
  id: string
  name: string
  description: string
  image_url: string
  display_order: number
  is_active: boolean
}

export interface MenuItem {
  id: string
  category_id: string
  name: string
  description: string
  price: number
  image_url: string
  is_available: boolean
  is_vegetarian: boolean
  is_vegan: boolean
  is_gluten_free: boolean
  spice_level: number // 0-3
  preparation_time: number // minutes
  display_order: number
}

export interface CartItem {
  menu_item: MenuItem
  quantity: number
  special_instructions?: string
}

export interface Table {
  id: string
  table_number: string
  capacity: number
  status: 'available' | 'occupied' | 'reserved'
  location: string
}

export interface Order {
  id: string
  order_number: string
  customer_name: string
  customer_phone: string
  customer_email?: string
  order_type: 'takeaway' | 'dine-in'
  table_id?: string
  items: OrderItem[]
  subtotal: number
  tax: number
  total: number
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled'
  special_instructions?: string
  estimated_ready_time?: string
  created_at: string
  updated_at: string
}

export interface OrderItem {
  id: string
  menu_item_id: string
  menu_item_name: string
  quantity: number
  unit_price: number
  total_price: number
  special_instructions?: string
}

export interface AdminUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'manager' | 'staff'
}
