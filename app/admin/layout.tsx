import React from "react"
import { AdminProvider } from '@/lib/admin-context'

export const metadata = {
  title: 'Admin Dashboard | Sonaee Veg Family Restaurant',
  description: 'Manage orders, menu, and tables',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminProvider>
      {children}
    </AdminProvider>
  )
}
