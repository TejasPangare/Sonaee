"use client"

import { useEffect, useState } from "react"

import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { BanquetInquiryForm } from '@/components/customer/banquet-inquiry-form'
import { EventCategoriesSection } from "@/components/customer/event-categories-section"
import { useSiteSettings } from '@/lib/site-settings-context'
import { apiClient, type ContentItem } from "@/lib/api-client"

export default function BanquetPage() {
  const { settings } = useSiteSettings()
  const [siteContentItems, setSiteContentItems] = useState<ContentItem[]>([])

  useEffect(() => {
    async function fetchContent() {
      try {
        const siteContent = await apiClient.getSiteContent()
        setSiteContentItems(siteContent.items)
      } catch (error) {
        console.error("Failed to fetch banquet event categories:", error)
      }
    }

    fetchContent()
  }, [])

  return (
    <div className="py-8 md:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-3xl font-bold text-foreground md:text-4xl">Banquet Inquiry</h1>
          <p className="mx-auto max-w-xl text-muted-foreground">
            Planning a celebration? Share your banquet details and our team will help with the next steps.
          </p>
        </div>

        <EventCategoriesSection
          items={siteContentItems}
          title="Banquet experiences for every occasion."
          subtitle="From intimate family moments to elegant celebrations, our venue is designed to host each event with warmth and attention to detail."
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-foreground">Address</h3>
                    <p className="text-muted-foreground">{settings.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-foreground">Phone</h3>
                    <a href={settings.phoneHref} className="text-muted-foreground transition-colors hover:text-primary">
                      {settings.phoneDisplay}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-foreground">Email</h3>
                    <a href={settings.emailHref} className="text-muted-foreground transition-colors hover:text-primary">
                      {settings.email}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold text-foreground">Opening Hours</h3>
                    <div className="space-y-1 text-muted-foreground">
                      <p>{settings.businessHours}</p>
                      <p>Takeaway: {settings.takeawayHours}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

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
