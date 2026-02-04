import Link from 'next/link'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-sidebar text-sidebar-foreground">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-sidebar-primary">Sonaee</span>
              <span className="text-xl font-light">Veg</span>
            </div>
            <p className="text-sm text-sidebar-foreground/70 leading-relaxed">
              Experience culinary excellence with our carefully crafted dishes,
              available for dine-in and takeaway.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { href: '/menu', label: 'Our Menu' },
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact' },
                { href: '/cart', label: 'Your Order' },
              ].map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-sidebar-foreground/70">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                <span>123 Grand Avenue, Downtown, NY 10001</span>
              </li>
              <li>
                <a
                  href="tel:+15551234567"
                  className="flex items-center gap-3 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  (555) 123-4567
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@grandhotel.com"
                  className="flex items-center gap-3 text-sm text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  info@grandhotel.com
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h3 className="font-semibold mb-4">Opening Hours</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-sidebar-foreground/70">
                <Clock className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-sidebar-foreground">Restaurant</p>
                  <p>Mon - Sun: 11:00 AM - 10:00 PM</p>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm text-sidebar-foreground/70">
                <Clock className="w-4 h-4 mt-0.5 shrink-0" />
                <div>
                  <p className="font-medium text-sidebar-foreground">Takeaway</p>
                  <p>Mon - Sun: 11:00 AM - 9:30 PM</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-sidebar-border mt-10 pt-8 text-center text-sm text-sidebar-foreground/60">
          <p>2026 Hotel Sonaee Veg. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
