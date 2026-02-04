'use client'

import Image from 'next/image'
import { Plus, Minus, Leaf, Flame, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MenuItem } from '@/lib/types'
import { useCart } from '@/lib/cart-context'
import { useState } from 'react'

interface MenuItemCardProps {
  item: MenuItem
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const { items, addItem, updateQuantity } = useCart()
  const [imageError, setImageError] = useState(false)
  
  const cartItem = items.find(ci => ci.menu_item.id === item.id)
  const quantity = cartItem?.quantity || 0

  const handleAdd = () => {
    addItem(item, 1)
  }

  const handleIncrement = () => {
    updateQuantity(item.id, quantity + 1)
  }

  const handleDecrement = () => {
    updateQuantity(item.id, quantity - 1)
  }

  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
      <div className="relative aspect-[4/3] bg-muted overflow-hidden">
        {!imageError ? (
          <Image
            src={item.image_url || "/placeholder.svg"}
            alt={item.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <span className="text-4xl text-muted-foreground/30">🍽️</span>
          </div>
        )}
        {!item.is_available && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Badge variant="secondary" className="text-sm">Currently Unavailable</Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-foreground line-clamp-1">{item.name}</h3>
          <span className="font-bold text-primary shrink-0">₹{item.price.toFixed(2)}</span>
        </div>
        
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {item.description}
        </p>
        
        <div className="flex items-center gap-2 mb-4">
          {item.is_vegetarian && (
            <Badge variant="secondary" className="text-xs gap-1 bg-green-100 text-green-800 border-green-200">
              <Leaf className="w-3 h-3" />
              Veg
            </Badge>
          )}
          {item.spice_level > 0 && (
            <Badge variant="secondary" className="text-xs gap-1 bg-red-100 text-red-800 border-red-200">
              <Flame className="w-3 h-3" />
              {item.spice_level === 1 ? 'Mild' : item.spice_level === 2 ? 'Medium' : 'Hot'}
            </Badge>
          )}
          {item.is_gluten_free && (
            <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800 border-amber-200">
              GF
            </Badge>
          )}
          <span className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
            <Clock className="w-3 h-3" />
            {item.preparation_time}m
          </span>
        </div>
        
        {item.is_available && (
          <div className="flex items-center gap-2">
            {quantity === 0 ? (
              <Button onClick={handleAdd} className="w-full" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add to Order
              </Button>
            ) : (
              <div className="flex items-center justify-between w-full">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-transparent"
                  onClick={handleDecrement}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="font-semibold text-foreground">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 bg-transparent"
                  onClick={handleIncrement}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
