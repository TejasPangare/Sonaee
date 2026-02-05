'use client'

import React from "react"

import { useState } from 'react'
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

export default function CheckoutPage() {
  const router = useRouter()
  const { items, subtotal, tax, total, clearCart } = useCart()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<String | null>(null)
  const [orderType, setOrderType] = useState<'takeaway' | 'dine-in'>('takeaway')
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    specialInstructions: '',
  })

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

    try {
      // Map cart items to OrderItemCreate format
      const orderItems = items.map(item => ({
        menu_item_id: item.menu_item.id,
        quantity: item.quantity,
        special_instructions: item.special_instructions || undefined,
      }))

      // Create order data
      const orderData = {
        customer_name: formData.name,
        customer_email: formData.email || undefined,
        customer_phone: formData.phone,
        order_type: (orderType === 'dine-in' ? 'dine_in' : 'takeaway') as 'takeaway' | 'dine_in',
        special_instructions: formData.specialInstructions || undefined,
        items: orderItems,
      }

      // Call API to create order
      const createdOrder = await apiClient.createOrder(orderData)

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
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="name"
                        name="name"
                        placeholder="John Smith"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email (Optional)</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="pl-10"
                      />
                    </div>
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
                    disabled={isSubmitting}
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
