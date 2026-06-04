'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { apiClient, OrderWithItems } from '@/lib/api-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancelling, setCancelling] = useState<number | null>(null)
  const [cancelOrderId, setCancelOrderId] = useState<number | null>(null)

  const router = useRouter()
  const token = typeof window !== 'undefined' ? localStorage.getItem('customer_token') : null

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      setError(null)
      try {
        if (!token) {
          router.replace('/login')
          return
        }
        const data = await apiClient.getMyOrders(token)
        setOrders(data || [])
      } catch (err: any) {
        setError(err.message || 'Failed to load orders')
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [token, router])

  const handleCancel = async (orderId: number) => {
    if (!token) return
    setCancelling(orderId)
    try {
      const updated = await apiClient.cancelOrder(orderId, token)
      setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)))
    } catch (err: any) {
      setError(err.message || 'Failed to cancel order')
    } finally {
      setCancelling(null)
    }
  }

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">My Orders</h1>

      {loading && <p>Loading your orders...</p>}
      {error && <p className="text-destructive">{error}</p>}

      {!loading && orders.length === 0 && <p>No orders found.</p>}

      <div className="space-y-4">
        {orders.length > 0 && orders.map((order) => (
          <Card key={order.id}>
            <CardHeader className="flex justify-between items-center">
              <div>
                <CardTitle className="text-lg">Order #{order.order_number} • {order.status}</CardTitle>
                <div className="text-sm text-muted-foreground">Placed: {new Date(order.created_at).toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">{order.customer.full_name}</div>
              </div>
              <div className="text-right">
                <div className="font-medium">Total: ${order.total.toFixed(2)}</div>
                {order.status === 'pending' ? (
                  <AlertDialog open={cancelOrderId === order.id} onOpenChange={(open) => !open && setCancelOrderId(null)}>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setCancelOrderId(order.id)}
                        disabled={cancelling === order.id}
                      >
                        {cancelling === order.id ? 'Cancelling...' : 'Cancel Order'}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Cancel order?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to cancel order #{order.order_number}? This cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Keep order</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleCancel(order.id)}
                          disabled={cancelling === order.id}
                        >
                          {cancelling === order.id ? 'Cancelling...' : 'Confirm cancel'}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                ) : null}
              </div>
            </CardHeader>
            <CardContent>
              <ul className="divide-y">
                {order.items.map((item) => (
                  <li key={item.id} className="py-2 flex justify-between">
                    <div>
                      <div className="font-medium">{item.menu_item?.name}</div>
                      <div className="text-sm text-muted-foreground">Qty: {item.quantity}</div>
                    </div>
                    <div className="font-medium">${item.total_price.toFixed(2)}</div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
