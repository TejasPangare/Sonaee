'use client'

import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useSiteSettings } from '@/lib/site-settings-context'
import { BanquetInquiryForm } from '@/components/customer/banquet-inquiry-form'

export default function ContactPage() {
  const { settings } = useSiteSettings()

  return (
    <div className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Banquet Inquiry</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Planning a celebration? Share your banquet details and our team will help with the next steps.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Address</h3>
                    <p className="text-muted-foreground">
                      {settings.address}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                    <a href={settings.phoneHref} className="text-muted-foreground hover:text-primary transition-colors">
                      {settings.phoneDisplay}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Email</h3>
                    <a href={settings.emailHref} className="text-muted-foreground hover:text-primary transition-colors">
                      {settings.email}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Opening Hours</h3>
                    <div className="text-muted-foreground space-y-1">
                      <p>{settings.businessHours}</p>
                      <p>Takeaway: {settings.takeawayHours}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card id="banquet">
            <div className="border-b border-border/60 px-6 py-5">
              <h2 className="text-xl font-semibold text-foreground">Banquet Inquiry</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Share your event details and we will help with planning, seating, and menu coordination.
              </p>
            </div>
            <CardContent>
              <BanquetInquiryForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
