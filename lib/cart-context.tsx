'use client'

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { CartItem,MenuItem } from './api-client'

interface CartContextType {
  items: CartItem[]
  addItem: (item: MenuItem, quantity?: number, instructions?: string) => void
  removeItem: (itemId: number) => void
  updateQuantity: (itemId: number, quantity: number) => void
  updateInstructions: (itemId: number, instructions: string) => void
  clearCart: () => void
  itemCount: number
  subtotal: number
  tax: number
  total: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const TAX_RATE = 0.10 // 10% tax

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = useCallback((menuItem: MenuItem, quantity = 1, instructions?: string) => {
    setItems(prev => {
      const existingIndex = prev.findIndex(item => Number(item.menu_item.id )=== menuItem.id)
      if (existingIndex >= 0) {
        const updated = [...prev]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        }
        return updated
      }
      return [...prev, { menu_item: menuItem, quantity, special_instructions: instructions }]
    })
  }, [])

  const removeItem = useCallback((itemId: number) => {
    setItems(prev => prev.filter(item => Number(item.menu_item.id)!== itemId))
  }, [])

  const updateQuantity = useCallback((itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId)
      return
    }
    setItems(prev => 
      prev.map(item => 
        Number(item.menu_item.id) === itemId ? { ...item, quantity } : item
      )
    )
  }, [removeItem])

  const updateInstructions = useCallback((itemId: number, instructions: string) => {
    setItems(prev => 
      prev.map(item => 
        Number(item.menu_item.id) === itemId ? { ...item, special_instructions: instructions } : item
      )
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + (item.menu_item.price * item.quantity), 0)
  const tax = subtotal * TAX_RATE
  const total = subtotal + tax

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      updateInstructions,
      clearCart,
      itemCount,
      subtotal,
      tax,
      total,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
