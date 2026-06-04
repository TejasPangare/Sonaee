'use client'

import React, { useEffect } from "react"
import { usePathname, useRouter } from 'next/navigation'
import { CartProvider } from '@/lib/cart-context'
import { Header } from '@/components/customer/header'
import { Footer } from '@/components/customer/footer'

const protectedRoutes = ['/cart', '/checkout', '/order-confirmation', '/orders']

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (!pathname) return
    const token = typeof window !== 'undefined' ? localStorage.getItem('customer_token') : null
    const requiresAuth = protectedRoutes.some((route) => pathname.startsWith(route))

    if (requiresAuth && !token) {
      router.replace('/login')
    }
  }, [pathname, router])

  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </CartProvider>
  )
}
