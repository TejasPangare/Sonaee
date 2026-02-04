'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Clock, MapPin, Phone, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('order') || 'ORD-000000'

  return (
    <div className="py-12 md:py-20">
      <div className="max-w-2xl mx-auto px-4 text-center">
        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>

        {/* Header */}
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Order Confirmed!
        </h1>
        <p className="text-muted-foreground mb-2">
          Thank you for your order. We are preparing it now.
        </p>
        <p className="text-lg font-semibold text-primary mb-8">
          Order #{orderNumber}
        </p>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-1">Estimated Time</h3>
              <p className="text-muted-foreground">20-30 minutes</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6 text-center">
              <MapPin className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-1">Pickup Location</h3>
              <p className="text-muted-foreground text-sm">123 Grand Avenue, Downtown</p>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card className="mb-8 text-left">
          <CardContent className="p-6">
            <h3 className="font-semibold text-foreground mb-4">What happens next?</h3>
            <ol className="space-y-3">
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shrink-0">1</span>
                <span className="text-muted-foreground">Our kitchen is preparing your order with fresh ingredients</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shrink-0">2</span>
                <span className="text-muted-foreground">You will receive a call when your order is ready</span>
              </li>
              <li className="flex gap-3">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shrink-0">3</span>
                <span className="text-muted-foreground">Pick up your order at our restaurant counter</span>
              </li>
            </ol>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <p className="text-muted-foreground mb-3">
              Questions about your order? Call us:
            </p>
            <a
              href="tel:+15551234567"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
            >
              <Phone className="w-4 h-4" />
              (555) 123-4567
            </a>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/menu">
            <Button variant="outline" className="w-full sm:w-auto gap-2 bg-transparent">
              Order More
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link href="/">
            <Button className="w-full sm:w-auto">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
