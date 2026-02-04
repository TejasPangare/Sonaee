'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { apiClient, type Admin } from './api-client'

interface AdminContextType {
  user: Admin | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

const TOKEN_KEY = 'admin_token'

export function AdminProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Admin | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for existing token on mount
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY)
    if (storedToken) {
      validateToken(storedToken)
    } else {
      setIsLoading(false)
    }
  }, [])

  const validateToken = async (storedToken: string) => {
    try {
      const adminData = await apiClient.getCurrentAdmin(storedToken)
      setUser(adminData)
      setToken(storedToken)
    } catch {
      localStorage.removeItem(TOKEN_KEY)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiClient.login(email, password)
      const newToken = response.access_token
      
      // Get admin info
      const adminData = await apiClient.getCurrentAdmin(newToken)
      
      setToken(newToken)
      setUser(adminData)
      localStorage.setItem(TOKEN_KEY, newToken)
      
      return true
    } catch {
      return false
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem(TOKEN_KEY)
  }

  return (
    <AdminContext.Provider value={{
      user,
      token,
      isAuthenticated: !!user && !!token,
      isLoading,
      login,
      logout,
    }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}
