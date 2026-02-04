import { apiClient, OrderUpdate } from './api-client'

// This is what your pages/components will use
export const api = {
  orders: {
    getAll: (token: string) => apiClient.getOrders(token),
    getById: (id: number, token: string) => apiClient.getOrder(id),
    updateStatus: (id: number, data: OrderUpdate, token: string) =>
      apiClient.updateOrderStatus(id, data, token),
  },

  tables: {
    getAll: (token: string) => apiClient.getTables({}),
    updateStatus: (id: number, status: string, token: string) =>
      apiClient.updateTableStatus(id, status, token),
  },

  dashboard: {
    stats: (token: string) => apiClient.getDashboardStats(token),
  },
}
