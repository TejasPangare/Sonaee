"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiClient } from "@/lib/api-client";
import { useSiteSettings } from "@/lib/site-settings-context";

const eventTypes = [
  "Wedding",
  "Reception",
  "Engagement",
  "Birthday",
  "Baby Shower",
  "Corporate Event",
  "Anniversary",
  "Naming Ceremony",
]

type SubmissionState = "idle" | "success" | "error";

export function BanquetInquiryForm() {
  const { settings } = useSiteSettings()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle")
  const [statusMessage, setStatusMessage] = useState("")

  const whatsappMessage = encodeURIComponent(
    "Hello, I would like to enquire about banquet availability and planning support."
  )
  const sanitizedWhatsAppNumber = settings.whatsappNumber.replace(/\D/g, "")
  const whatsappHref = sanitizedWhatsAppNumber
    ? `https://wa.me/${sanitizedWhatsAppNumber}?text=${whatsappMessage}`
    : settings.whatsappHref

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)

    setIsSubmitting(true)
    setSubmissionState("idle")
    setStatusMessage("")

    const budget = String(formData.get("budget") ?? "").trim()

    try {
      const response = await apiClient.submitBanquetInquiry({
        name: String(formData.get("name") ?? "").trim(),
        phone: String(formData.get("phone") ?? "").trim(),
        email: String(formData.get("email") ?? "").trim(),
        event_type: String(formData.get("event_type") ?? "").trim(),
        event_date: String(formData.get("event_date") ?? "").trim(),
        expected_guests: Number(formData.get("expected_guests") ?? 0),
        budget: budget || undefined,
        additional_requirements: String(formData.get("additional_requirements") ?? "").trim(),
      })

      setSubmissionState("success")
      setStatusMessage(response.message)
      form.reset()
    } catch (error) {
      setSubmissionState("error")
      setStatusMessage(error instanceof Error ? error.message : "Unable to send your banquet inquiry right now.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {submissionState !== "idle" && (
        <div
          className={
            submissionState === "success"
              ? "rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
              : "rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          }
        >
          {statusMessage || (submissionState === "success" ? "Banquet inquiry sent successfully." : "Unable to send your banquet inquiry right now.")}
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" placeholder="Your full name" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 123-4567" required />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="john@example.com" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="event_type">Event Type</Label>
          <select
            id="event_type"
            name="event_type"
            className="surface-field h-12 w-full rounded-2xl px-4 text-sm text-foreground outline-none transition-[box-shadow,border-color] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30"
            defaultValue=""
            required
          >
            <option value="" disabled>
              Select an event
            </option>
            {eventTypes.map((eventType) => (
              <option key={eventType}>{eventType}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="event_date">Event Date</Label>
          <Input id="event_date" name="event_date" type="date" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="expected_guests">Expected Guests</Label>
          <Input id="expected_guests" name="expected_guests" type="number" min="1" placeholder="Approximate guest count" required />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="budget">Budget (Optional)</Label>
          <Input id="budget" name="budget" type="text" placeholder="Budget range, if any" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="additional_requirements">Additional Requirements</Label>
          <Textarea
            id="additional_requirements"
            name="additional_requirements"
            className="min-h-[132px] sm:min-h-[48px]"
            placeholder="Tell us about your event style, menu, seating, or setup needs..."
            required
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
          {isSubmitting ? "Sending..." : "Send Banquet Inquiry"}
        </Button>
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <a href={whatsappHref} target="_blank" rel="noreferrer">
            WhatsApp Us
          </a>
        </Button>
      </div>
    </form>
  )
}
