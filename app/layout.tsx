import React from "react"
import type { Metadata } from 'next'
import { Cormorant_Garamond, Geist_Mono, Manrope } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import '@/app/globals.css'
import FirebaseMessagingClient from "@/components/FirebaseMessagingClient"

const headingFont = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["500", "600", "700"],
})

const bodyFont = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
})

const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'Hotel Sonaee Veg Restaurant | Fine Dining & Takeaway',
  description: 'Experience exceptional cuisine at Hotel Sonaee Veg Restaurant. Order takeaway online or dine with us for an unforgettable culinary experience.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${bodyFont.variable} ${headingFont.variable} font-sans antialiased`}>
        <FirebaseMessagingClient />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
