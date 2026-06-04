'use client'

import React, { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ShoppingBag, User, Phone, Mail, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useCart } from '@/lib/cart-context'
import { apiClient } from '@/lib/api-client'
import { getPushToken } from "@/lib/getPushToken"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, tax, total, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<String | null>(null)
  const [orderType, setOrderType] = useState<'takeaway' | 'dine-in'>('takeaway')
  const [token, setToken] = useState<string | null>(null)
  const [customerProfile, setCustomerProfile] = useState<{
    fullName: string
    email: string
    phone: string
  } | null>(null)
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | 'unsupported'>('default')
  const [notificationStatusMessage, setNotificationStatusMessage] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    specialInstructions: '',
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('customer_token')
      setToken(storedToken)
      if (storedToken) {
        try {
          const payload = JSON.parse(atob(storedToken.split('.')[1]))
          setCustomerProfile({
            fullName: payload.name || '',
            email: payload.sub || '',
            phone: payload.phone || '',
          })
        } catch {
          setCustomerProfile(null)
        }
      }

      if ('Notification' in window) {
        setNotificationPermission(Notification.permission)
      } else {
        setNotificationPermission('unsupported')
      }
    }
  }, [])

  if (items.length === 0) {
    return (
      <div className="py-16 md:py-24">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-muted-foreground" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">No items to checkout</h1>
          <p className="text-muted-foreground mb-8">
            Add some items to your cart before checking out.
          </p>
          <Link href="/menu">
            <Button className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Browse Menu
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    const pushToken = await getPushToken();

    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationPermission(Notification.permission)
    }

    try {
      // Map cart items to OrderItemCreate format
      const orderItems = items.map(item => ({
        menu_item_id: item.menu_item.id,
        quantity: item.quantity,
        special_instructions: item.special_instructions || undefined,
      }))

      const orderData: any = {
        order_type: (orderType === 'dine-in' ? 'dine_in' : 'takeaway') as 'takeaway' | 'dine_in',
        special_instructions: formData.specialInstructions || undefined,
        items: orderItems,
      }

      if (pushToken) {
        orderData.fcm_token = pushToken
        setNotificationPermission('granted')
      }

      // Call API to create order
      const createdOrder = await apiClient.createOrder(orderData, token || undefined)

      // Clear cart and redirect with real order number
      clearCart()
      router.push(`/order-confirmation?order=${createdOrder.order_number}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to place order. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleEnableNotifications = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      setNotificationPermission('unsupported')
      setNotificationStatusMessage('Push notifications are not supported in this browser.')
      return
    }

    const pushToken = await getPushToken()
    setNotificationPermission(Notification.permission)

    if (pushToken) {
      setNotificationStatusMessage('Notifications enabled for order updates.')
    } else if (Notification.permission === 'denied') {
      setNotificationStatusMessage('Permission blocked. Allow notifications in browser settings.')
    } else {
      setNotificationStatusMessage('Notifications are not enabled yet.')
    }
  }

  return (
    <div className="py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/cart">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Form */}
            <div className="lg:col-span-3 space-y-6">
              {/* Order Type */}
              {/* <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order Type</CardTitle>
                </CardHeader>
                <CardContent>
                  <RadioGroup
                    value={orderType}
                    onValueChange={(v) => setOrderType(v as 'takeaway' | 'dine-in')}
                    className="grid grid-cols-2 gap-4"
                  >
                    <Label
                      htmlFor="takeaway"
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        orderType === 'takeaway'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-muted-foreground'
                      }`}
                    >
                      <RadioGroupItem value="takeaway" id="takeaway" className="sr-only" />
                      <ShoppingBag className={`w-6 h-6 ${orderType === 'takeaway' ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className={`font-medium ${orderType === 'takeaway' ? 'text-primary' : 'text-foreground'}`}>Takeaway</span>
                      <span className="text-xs text-muted-foreground">Pick up at restaurant</span>
                    </Label>
                    <Label
                      htmlFor="dine-in"
                      className={`flex flex-col items-center gap-2 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                        orderType === 'dine-in'
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-muted-foreground'
                      }`}
                    >
                      <RadioGroupItem value="dine-in" id="dine-in" className="sr-only" />
                      <User className={`w-6 h-6 ${orderType === 'dine-in' ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className={`font-medium ${orderType === 'dine-in' ? 'text-primary' : 'text-foreground'}`}>Dine-In</span>
                      <span className="text-xs text-muted-foreground">Eat at restaurant</span>
                    </Label>
                  </RadioGroup>
                </CardContent>
              </Card> */}

              {/* Contact Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Contact Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {customerProfile ? (
                    <div className="rounded-lg border border-border bg-muted p-4 text-sm text-muted-foreground space-y-2">
                      <div>
                        <span className="font-medium text-foreground">{customerProfile.fullName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{customerProfile.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{customerProfile.phone}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                      Customer details are unavailable. Please sign in again before placing the order.
                    </div>
                  )}

                  <div className="rounded-lg border border-border bg-muted p-4 text-sm">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-medium">
                          Notification status: {' '}
                          <span className={
                            notificationPermission === 'granted'
                              ? 'text-emerald-600'
                              : notificationPermission === 'denied'
                              ? 'text-rose-600'
                              : 'text-foreground'
                          }>
                            {notificationPermission === 'unsupported'
                              ? 'Unsupported'
                              : notificationPermission === 'granted'
                              ? 'Enabled'
                              : notificationPermission === 'denied'
                              ? 'Blocked'
                              : 'Not enabled'}
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          We use push notifications to alert you when order status changes.
                        </p>
                      </div>
                      {notificationPermission !== 'granted' && notificationPermission !== 'unsupported' && (
                        <Button type="button" variant="secondary" size="sm" onClick={handleEnableNotifications}>
                          Enable
                        </Button>
                      )}
                    </div>
                    {notificationStatusMessage && (
                      <p className="mt-2 text-xs text-muted-foreground">{notificationStatusMessage}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Special Instructions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Special Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="specialInstructions">Any special requests?</Label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Textarea
                        id="specialInstructions"
                        name="specialInstructions"
                        placeholder="Allergies, dietary restrictions, or other notes..."
                        value={formData.specialInstructions}
                        onChange={handleInputChange}
                        className="pl-10 min-h-[100px]"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="text-lg">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {items.map(item => (
                      <div key={item.menu_item.id} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          {item.quantity}x {item.menu_item.name}
                        </span>
                        <span className="text-foreground">
                          ₹{(item.menu_item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (10%)</span>
                    <span className="text-foreground">₹{tax.toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span className="text-foreground">Total</span>
                    <span className="text-foreground">₹{total.toFixed(2)}</span>
                  </div>
                  
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={isSubmitting || !token || !customerProfile}
                  >
                    {isSubmitting ? 'Placing Order...' : 'Place Order'}
                  </Button>

                  {error && (
                    <p className="text-sm text-red-600 text-center mt-2">{error}</p>
                  )}

                  <p className="text-xs text-muted-foreground text-center">
                    {orderType === 'takeaway'
                      ? 'Your order will be ready for pickup in 20-30 minutes'
                      : 'Your order will be prepared once you arrive'
                    }
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
