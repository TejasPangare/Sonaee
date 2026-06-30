/**
 * API Client for connecting to FastAPI backend
 * 
 * Set NEXT_PUBLIC_API_URL environment variable to your FastAPI server URL
 * Example: NEXT_PUBLIC_API_URL=http://localhost:8000
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface FetchOptions extends RequestInit {
  token?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const { token, ...fetchOptions } = options;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    };

    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...fetchOptions,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
      throw new Error(error.detail || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Categories
  async getCategories(activeOnly = true) {
    return this.request<Category[]>(`/api/categories?active_only=${activeOnly}`);
  }

  async getCategory(id: number) {
    return this.request<Category>(`/api/categories/${id}`);
  }

  async createCategory(data: CategoryCreate, token: string) {
    return this.request<Category>('/api/categories', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    });
  }

  async updateCategory(id: number, data: CategoryUpdate, token: string) {
    return this.request<Category>(`/api/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    });
  }

  async deleteCategory(id: number, token: string) {
    return this.request(`/api/categories/${id}`, {
      method: 'DELETE',
      token,
    });
  }

  // Menu Items
  async getMenuItems(params?: {
    categoryId?: number;
    availableOnly?: boolean;
    search?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.categoryId) searchParams.set('category_id', params.categoryId.toString());
    if (params?.availableOnly !== undefined) searchParams.set('available_only', params.availableOnly.toString());
    if (params?.search) searchParams.set('search', params.search);
    
    const query = searchParams.toString();
    return this.request<MenuItemWithCategory[]>(`/api/menu-items${query ? `?${query}` : ''}`);
  }

  async getMenuItem(id: number) {
    return this.request<MenuItemWithCategory>(`/api/menu-items/${id}`);
  }

  async createMenuItem(data: MenuItemCreate, token: string) {
    return this.request<MenuItem>('/api/menu-items', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    });
  }

  async updateMenuItem(id: number, data: MenuItemUpdate, token: string) {
    return this.request<MenuItem>(`/api/menu-items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    });
  }

  async deleteMenuItem(id: number, token: string) {
    return this.request(`/api/menu-items/${id}`, {
      method: 'DELETE',
      token,
    });
  }

  async toggleMenuItemAvailability(id: number, isAvailable: boolean, token: string) {
    return this.request(`/api/menu-items/${id}/availability?is_available=${isAvailable}`, {
      method: 'PATCH',
      token,
    });
  }

  // Tables
  async getTables(params?: { status?: string; activeOnly?: boolean }) {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.activeOnly !== undefined) searchParams.set('active_only', params.activeOnly.toString());
    
    const query = searchParams.toString();
    return this.request<Table[]>(`/api/tables${query ? `?${query}` : ''}`);
  }

  async getAvailableTables() {
    return this.request<Table[]>('/api/tables/available');
  }

  async getTable(id: number) {
    return this.request<Table>(`/api/tables/${id}`);
  }

  async createTable(data: TableCreate, token: string) {
    return this.request<Table>('/api/tables', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    });
  }

  async updateTable(id: number, data: TableUpdate, token: string) {
    return this.request<Table>(`/api/tables/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    });
  }

  async deleteTable(id: number, token: string) {
    return this.request(`/api/tables/${id}`, {
      method: 'DELETE',
      token,
    });
  }

  async updateTableStatus(id: number, status: string, token: string) {
    return this.request(`/api/tables/${id}/status?status=${status}`, {
      method: 'PATCH',
      token,
    });
  }

  // Orders
  async getOrders(token: string, params?: {
    status?: string;
    orderType?: string;
    dateFrom?: string;
    dateTo?: string;
  }) {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.orderType) searchParams.set('order_type', params.orderType);
    if (params?.dateFrom) searchParams.set('date_from', params.dateFrom);
    if (params?.dateTo) searchParams.set('date_to', params.dateTo);
    
    const query = searchParams.toString();
    return this.request<OrderWithItems[]>(`/api/orders${query ? `?${query}` : ''}`, { token });
  }

  async getOrder(id: number) {
    return this.request<OrderWithItems>(`/api/orders/${id}`);
  }

  async getOrderByNumber(orderNumber: string) {
    return this.request<OrderWithItems>(`/api/orders/by-number/${orderNumber}`);
  }

  async createOrder(data: OrderCreate, token?: string) {
    return this.request<OrderWithItems>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    });
  }

  async updateOrderStatus(id: number, data: OrderUpdate, token: string) {
    return this.request<OrderWithItems>(`/api/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      token,
    });
  }

  // Auth
  async login(email: string, password: string) {
    return this.request<{ access_token: string; token_type: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  // Customer auth
  async customerLogin(email: string, phone: string) {
    return this.request<{ access_token: string; token_type: string }>('/api/customers/login', {
      method: 'POST',
      body: JSON.stringify({ email, phone }),
    });
  }

  async customerRegister(data: CustomerRegisterRequest) {
    return this.request<{ access_token: string; token_type: string }>('/api/customers/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Customer-specific order endpoints
  async getMyOrders(token: string) {
    return this.request<OrderWithItems[]>('/api/orders/my', { token });
  }

  async cancelOrder(orderId: number, token: string) {
    return this.request<OrderWithItems>(`/api/orders/${orderId}/cancel`, {
      method: 'POST',
      token,
    });
  }

  async getCurrentAdmin(token: string) {
    return this.request<Admin>('/api/auth/me', { token });
  }

  // Dashboard
  async getDashboardStats(token: string) {
    return this.request<DashboardStats>('/api/admin/dashboard', { token });
  }

  async getSiteContent() {
    return this.request<SiteContentResponse>('/api/content/site');
  }

  async getContentSections(token: string) {
    return this.request<ContentSection[]>('/api/admin/content/sections', { token });
  }

  async upsertContentSection(key: string, data: ContentSectionUpsert, token: string) {
    return this.request<ContentSection>(`/api/admin/content/sections/${key}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    });
  }

  async getContentItems(token: string, type?: string) {
    const query = type ? `?type=${encodeURIComponent(type)}` : '';
    return this.request<ContentItem[]>(`/api/admin/content/items${query}`, { token });
  }

  async createContentItem(data: ContentItemCreate, token: string) {
    return this.request<ContentItem>('/api/admin/content/items', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    });
  }

  async updateContentItem(id: number, data: ContentItemUpdate, token: string) {
    return this.request<ContentItem>(`/api/admin/content/items/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      token,
    });
  }

  async deleteContentItem(id: number, token: string) {
    return this.request<{ success: boolean }>(`/api/admin/content/items/${id}`, {
      method: 'DELETE',
      token,
    });
  }

  async registerAdmin(data: AdminCreateRequest, token: string) {
    return this.request<Admin>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
      token,
    });
  }
}

// Types matching the FastAPI schemas
export interface Category {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CategoryCreate {
  name: string;
  description?: string;
  image_url?: string;
  display_order?: number;
  is_active?: boolean;
}

export interface CategoryUpdate {
  name?: string;
  description?: string;
  image_url?: string;
  display_order?: number;
  is_active?: boolean;
}

export interface MenuItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category_id: number;
  is_available: boolean;
  is_vegetarian: boolean;
  is_vegan: boolean;
  is_gluten_free: boolean;
  spice_level: number;
  prep_time_minutes: number;
  created_at: string;
  updated_at?: string;
}

export interface MenuItemWithCategory extends MenuItem {
  category: Category;
}

export interface MenuItemCreate {
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  category_id: number;
  is_available?: boolean;
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  is_gluten_free?: boolean;
  spice_level?: number;
  prep_time_minutes?: number;
}

export interface MenuItemUpdate {
  name?: string;
  description?: string;
  price?: number;
  image_url?: string;
  category_id?: number;
  is_available?: boolean;
  is_vegetarian?: boolean;
  is_vegan?: boolean;
  is_gluten_free?: boolean;
  spice_level?: number;
  prep_time_minutes?: number;
}

export interface Table {
  id: number;
  table_number: string;
  capacity: number;
  location?: string;
  status: 'available' | 'occupied' | 'reserved';
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface TableCreate {
  table_number: string;
  capacity: number;
  location?: string;
  status?: 'available' | 'occupied' | 'reserved';
  is_active?: boolean;
}

export interface TableUpdate {
  table_number?: string;
  capacity?: number;
  location?: string;
  status?: 'available' | 'occupied' | 'reserved';
  is_active?: boolean;
}

export interface OrderItem {
  id: number;
  order_id: number;
  menu_item_id: number;
  quantity: number;
  unit_price: number;
  total_price: number;
  special_instructions?: string;
  created_at: string;
  menu_item: MenuItem;
}

export interface Order {
  id: number;
  order_number: string;
  customer_id: number;
  order_type: 'takeaway' | 'dine_in';
  table_id?: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  subtotal: number;
  tax: number;
  total: number;
  special_instructions?: string;
  estimated_ready_time?: string;
  created_at: string;
  updated_at?: string;
}

export interface Customer {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface OrderWithItems extends Order {
  customer: Customer;
  items: OrderItem[];
  table?: Table;
}

export interface OrderItemCreate {
  menu_item_id: number;
  quantity: number;
  special_instructions?: string;
}

export interface OrderCreate {
  order_type: 'takeaway' | 'dine_in';
  table_id?: number;
  special_instructions?: string;
  items: OrderItemCreate[];
  fcm_token?: string | null;
}

export interface OrderUpdate {
  status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  special_instructions?: string;
  estimated_ready_time?: string;
}

export interface Admin {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  is_superadmin: boolean;
  created_at: string;
  updated_at?: string;
}

export interface CustomerRegisterRequest {
  full_name: string;
  email: string;
  phone: string;
}

export interface DashboardStats {
  total_orders_today: number;
  total_revenue_today: number;
  pending_orders: number;
  completed_orders_today: number;
  available_tables: number;
  occupied_tables: number;
}

export interface ContentSection {
  id: number;
  key: string;
  title?: string;
  subtitle?: string;
  description?: string;
  image_url?: string;
  primary_cta_label?: string;
  primary_cta_href?: string;
  secondary_cta_label?: string;
  secondary_cta_href?: string;
  metadata_json?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface ContentSectionUpsert {
  key: string;
  title?: string;
  subtitle?: string;
  description?: string;
  image_url?: string;
  primary_cta_label?: string;
  primary_cta_href?: string;
  secondary_cta_label?: string;
  secondary_cta_href?: string;
  metadata_json?: string;
  is_active?: boolean;
}

export interface ContentItem {
  id: number;
  type: string;
  title: string;
  subtitle?: string;
  description?: string;
  image_url?: string;
  cta_label?: string;
  cta_href?: string;
  tag?: string;
  metadata_json?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface ContentItemCreate {
  type: string;
  title: string;
  subtitle?: string;
  description?: string;
  image_url?: string;
  cta_label?: string;
  cta_href?: string;
  tag?: string;
  metadata_json?: string;
  display_order?: number;
  is_active?: boolean;
}

export interface ContentItemUpdate {
  type?: string;
  title?: string;
  subtitle?: string;
  description?: string;
  image_url?: string;
  cta_label?: string;
  cta_href?: string;
  tag?: string;
  metadata_json?: string;
  display_order?: number;
  is_active?: boolean;
}

export interface SiteContentResponse {
  sections: ContentSection[];
  items: ContentItem[];
}

export interface AdminCreateRequest {
  email: string;
  full_name: string;
  password: string;
  is_active?: boolean;
  is_superadmin?: boolean;
}

export interface CartItem {
  menu_item: MenuItem
  quantity: number
  special_instructions?: string
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL);
