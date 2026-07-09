'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MessageCircle, Phone, ShoppingBag, CalendarDays } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSiteSettings } from '@/lib/site-settings-context'

const hiddenRoutes = ['/cart', '/checkout', '/order-confirmation', '/orders']

export function FloatingActions() {
  const pathname = usePathname()
  const { settings } = useSiteSettings()

  if (!pathname) return null

  const shouldHide = hiddenRoutes.some((route) => pathname.startsWith(route))
  if (shouldHide) return null

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 hidden flex-col gap-3 lg:flex">
        <a href={settings.phoneHref}>
          <Button variant="outline" className="min-w-[164px] justify-between bg-background/92 backdrop-blur-md">
            Call
            <Phone className="h-4 w-4" />
          </Button>
        </a>
        <a href={settings.whatsappHref} target="_blank" rel="noreferrer">
          <Button variant="outline" className="min-w-[164px] justify-between bg-background/92 backdrop-blur-md">
            WhatsApp
            <MessageCircle className="h-4 w-4" />
          </Button>
        </a>
        <Link href="/menu">
          <Button className="min-w-[164px] justify-between">
            Order Food
            <ShoppingBag className="h-4 w-4" />
          </Button>
        </Link>
        <Link href="/banquet#banquet">
          <Button variant="secondary" className="min-w-[164px] justify-between">
            Book Event
            <CalendarDays className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="fixed inset-x-3 bottom-3 z-40 lg:hidden">
        <div className="grid grid-cols-4 gap-2 rounded-[1.5rem] border border-border/70 bg-background/94 p-2 shadow-[0_18px_40px_rgba(20,20,20,0.18)] backdrop-blur-xl">
          <a
            href={settings.phoneHref}
            className="flex flex-col items-center justify-center gap-1 rounded-[1rem] py-2 text-[11px] font-semibold text-foreground"
          >
            <Phone className="h-4 w-4 text-primary" />
            Call
          </a>
          <a
            href={settings.whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="flex flex-col items-center justify-center gap-1 rounded-[1rem] py-2 text-[11px] font-semibold text-foreground"
          >
            <MessageCircle className="h-4 w-4 text-primary" />
            WhatsApp
          </a>
          <Link
            href="/menu"
            className="flex flex-col items-center justify-center gap-1 rounded-[1rem] bg-primary py-2 text-[11px] font-semibold text-primary-foreground"
          >
            <ShoppingBag className="h-4 w-4" />
            Order
          </Link>
          <Link
            href="/banquet#banquet"
            className="flex flex-col items-center justify-center gap-1 rounded-[1rem] bg-secondary py-2 text-[11px] font-semibold text-secondary-foreground"
          >
            <CalendarDays className="h-4 w-4" />
            Event
          </Link>
        </div>
      </div>
    </>
  )
}
