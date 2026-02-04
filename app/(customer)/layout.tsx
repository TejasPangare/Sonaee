import React from "react"
import { CartProvider } from '@/lib/cart-context'
import { Header } from '@/components/customer/header'
import { Footer } from '@/components/customer/footer'

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
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
