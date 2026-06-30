'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { ShoppingBag, Menu, Phone, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useCart } from '@/lib/cart-context'
import { useSiteSettings } from '@/lib/site-settings-context'
import { useEffect, useMemo, useState } from 'react'
import { cn } from '@/lib/utils'

type NavLink = {
  href: string
  label: string
  route: string
  hash?: string
}

export function Header() {
  const { itemCount } = useCart()
  const { settings } = useSiteSettings()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentHash, setCurrentHash] = useState('')
  const router = useRouter()
  const pathname = usePathname()

  const navLinks = useMemo<NavLink[]>(
    () => [
      { href: '/', label: 'Home', route: '/' },
      { href: '/menu', label: 'Menu', route: '/menu' },
      { href: '/contact#banquet', label: 'Banquet', route: '/contact', hash: 'banquet' },
      { href: '/#gallery', label: 'Gallery', route: '/', hash: 'gallery' },
      { href: '/contact', label: 'Contact', route: '/contact' },
    ],
    []
  )

  useEffect(() => {
    if (typeof window === 'undefined') return

    setIsLoggedIn(Boolean(localStorage.getItem('customer_token')))

    const syncHash = () => {
      setCurrentHash(window.location.hash.replace('#', ''))
    }

    syncHash()
    window.addEventListener('hashchange', syncHash)

    return () => window.removeEventListener('hashchange', syncHash)
  }, [pathname])

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('customer_token')
    }
    setIsLoggedIn(false)
    router.push('/login')
  }

  const isNavActive = (link: NavLink) => {
    if (pathname !== link.route) return false
    if (link.hash) return currentHash === link.hash
    return currentHash === '' || link.route !== '/contact'
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/84 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between gap-4 py-3 md:h-22">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-sm font-semibold text-primary shadow-soft">
              {settings.logoText}
            </div>
            <div className="leading-none">
              <span className="block text-2xl text-foreground">{settings.shortName}</span>
              <span className="block text-[11px] font-semibold uppercase tracking-[0.3em] text-primary/80">
                {settings.brandLabel}
              </span>
            </div>
          </Link>

          <nav className="hidden flex-1 items-center justify-center md:flex">
            <div className="surface-card flex items-center gap-1 rounded-full px-2 py-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-300",
                    isNavActive(link)
                      ? "bg-primary text-primary-foreground shadow-[0_10px_24px_rgba(196,147,82,0.24)]"
                      : "text-muted-foreground hover:bg-secondary/90 hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <a
              href={settings.phoneHref}
              className="hidden items-center gap-2 rounded-full border border-border/70 bg-card/70 px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground xl:flex"
            >
              <Phone className="h-4 w-4" />
              <span>{settings.phoneDisplay}</span>
            </a>

            <Link href="/menu" className="hidden lg:block">
              <Button size="sm" className="px-5">
                Order Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>

            <Link href="/cart">
              <Button variant="outline" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {itemCount}
                  </span>
                )}
                <span className="sr-only">View cart</span>
              </Button>
            </Link>

            {isLoggedIn ? (
              <div className="hidden items-center gap-2 sm:flex">
                <Link href="/orders">
                  <Button variant="outline" size="sm">
                    My Orders
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="outline" size="sm">
                    Register
                  </Button>
                </Link>
              </div>
            )}

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 border-l border-border/70 bg-background/96 p-0">
                <div className="flex h-full flex-col">
                  <div className="border-b border-border/70 px-6 py-6">
                    <div className="mb-5 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-sm font-semibold text-primary">
                        {settings.logoText}
                      </div>
                      <div>
                        <p className="text-xl text-foreground">{settings.shortName}</p>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-primary/80">
                          {settings.brandLabel}
                        </p>
                      </div>
                    </div>
                    <Link href="/menu" onClick={() => setIsOpen(false)}>
                      <Button className="w-full justify-between">
                        Start Ordering
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>

                  <div className="flex flex-1 flex-col gap-2 px-4 py-6">
                    {navLinks.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "rounded-2xl px-4 py-3 text-base font-medium transition-all duration-300",
                          isNavActive(link)
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground hover:bg-secondary hover:text-primary"
                        )}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>

                  <div className="border-t border-border/70 px-6 py-5">
                    <a
                      href={settings.phoneHref}
                      className="flex items-center gap-2 text-sm text-muted-foreground"
                    >
                      <Phone className="h-4 w-4" />
                      {settings.phoneDisplay}
                    </a>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
