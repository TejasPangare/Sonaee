'use client'

import Link from 'next/link'
import { ArrowUpRight, Clock, Facebook, Globe, Instagram, Mail, MapPin, Phone, Youtube } from 'lucide-react'

import { useSiteSettings } from '@/lib/site-settings-context'

const quickLinks = [
  { href: '/', label: 'Home' },
  { href: '/menu', label: 'Menu' },
  { href: '/contact#banquet', label: 'Banquet' },
  { href: '/about#gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
]

export function Footer() {
  const { settings } = useSiteSettings()
  const socialLinks = [
    { href: settings.instagramUrl, label: 'Instagram', icon: Instagram },
    { href: settings.facebookUrl, label: 'Facebook', icon: Facebook },
    { href: settings.xUrl, label: 'X', icon: Globe },
    { href: settings.youtubeUrl, label: 'YouTube', icon: Youtube },
  ].filter((link) => Boolean(link.href))

  return (
    <footer className="bg-sidebar text-sidebar-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="mb-8 overflow-hidden rounded-[2rem] border border-sidebar-border bg-white/5 p-6 md:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.35em] text-sidebar-primary">Restaurant Ordering</p>
              <h2 className="text-3xl text-sidebar-foreground md:text-4xl">Fresh vegetarian favorites, elegantly prepared for dine-in and takeaway.</h2>
            </div>
            <Link
              href="/menu"
              className="inline-flex items-center justify-center rounded-full bg-sidebar-primary px-6 py-3 text-sm font-semibold text-sidebar-primary-foreground transition-transform hover:-translate-y-0.5"
            >
              Start Your Order
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="rounded-[1.75rem] border border-sidebar-border bg-white/5 p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full border border-sidebar-primary/30 bg-sidebar-primary/10 text-sm font-semibold text-sidebar-primary">
                  {settings.logoText}
                </div>
                <div>
                  <span className="block text-2xl text-sidebar-foreground">{settings.shortName}</span>
                  <span className="text-xs font-semibold uppercase tracking-[0.28em] text-sidebar-primary/85">{settings.brandLabel}</span>
                </div>
              </div>
              <p className="mb-5 text-sm leading-relaxed text-sidebar-foreground/70">{settings.description}</p>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-sidebar-border bg-white/5 px-4 py-2 text-sm text-sidebar-foreground/75 transition-colors hover:text-sidebar-foreground"
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-sidebar-border bg-white/5 p-6">
              <h3 className="mb-4 text-lg text-sidebar-foreground">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="inline-flex items-center gap-2 text-sm text-sidebar-foreground/70 transition-colors hover:text-sidebar-foreground"
                    >
                      <ArrowUpRight className="h-3.5 w-3.5" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-[1.75rem] border border-sidebar-border bg-white/5 p-6">
              <h3 className="mb-4 text-lg text-sidebar-foreground">Contact</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-sidebar-foreground/70">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sidebar-primary" />
                  <span>{settings.address}</span>
                </li>
                <li>
                  <a
                    href={settings.phoneHref}
                    className="flex items-center gap-3 text-sm text-sidebar-foreground/70 transition-colors hover:text-sidebar-foreground"
                  >
                    <Phone className="h-4 w-4 text-sidebar-primary" />
                    {settings.phoneDisplay}
                  </a>
                </li>
                <li>
                  <a
                    href={settings.emailHref}
                    className="flex items-center gap-3 text-sm text-sidebar-foreground/70 transition-colors hover:text-sidebar-foreground"
                  >
                    <Mail className="h-4 w-4 text-sidebar-primary" />
                    {settings.email}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[0.85fr_1.15fr]">
            <div className="rounded-[1.75rem] border border-sidebar-border bg-white/5 p-6">
              <h3 className="mb-4 text-lg text-sidebar-foreground">Opening Hours</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-sm text-sidebar-foreground/70">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-sidebar-primary" />
                  <div>
                    <p className="font-medium text-sidebar-foreground">Restaurant</p>
                    <p>{settings.businessHours}</p>
                  </div>
                </li>
                <li className="flex items-start gap-3 text-sm text-sidebar-foreground/70">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-sidebar-primary" />
                  <div>
                    <p className="font-medium text-sidebar-foreground">Takeaway</p>
                    <p>{settings.takeawayHours}</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="overflow-hidden rounded-[1.75rem] border border-sidebar-border bg-white/5">
              <div className="border-b border-sidebar-border px-6 py-5">
                <h3 className="text-lg text-sidebar-foreground">Google Map</h3>
                <p className="mt-1 text-sm text-sidebar-foreground/65">
                  Find us easily for dine-in, takeaway pickup, and banquet visits.
                </p>
              </div>
              <div className="aspect-[4/3] w-full md:aspect-[16/10]">
                <iframe
                  title={`${settings.shortName} location map`}
                  src={settings.mapEmbedUrl}
                  className="h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-sidebar-border pt-6 text-sm text-sidebar-foreground/60 md:flex-row md:items-center md:justify-between">
          <p>© 2026 {settings.hotelName}. All rights reserved.</p>
          <p>{settings.copyrightText}</p>
        </div>
      </div>
    </footer>
  )
}
