'use client'

import Image from 'next/image'
import { Plus, Minus, Leaf, Flame, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MenuItem } from '@/lib/api-client'
import { useCart } from '@/lib/cart-context'
import { useState } from 'react'

interface MenuItemCardProps {
  item: MenuItem
}

export function MenuItemCard({ item }: MenuItemCardProps) {
  const { items, addItem, updateQuantity } = useCart()
  const [imageError, setImageError] = useState(false)

  const cartItem = items.find((ci) => Number(ci.menu_item.id) === item.id)
  const quantity = cartItem?.quantity || 0

  const handleAdd = () => {
    addItem(item, 1)
  }

  const handleIncrement = () => {
    updateQuantity(Number(item.id), quantity + 1)
  }

  const handleDecrement = () => {
    updateQuantity(Number(item.id), quantity - 1)
  }

  return (
    <Card className="premium-panel group overflow-hidden border-border/70 bg-card/90 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {!imageError ? (
          <Image
            src={item.image_url || "/placeholder.svg"}
            alt={item.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <span className="text-2xl text-muted-foreground/40">Image unavailable</span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/45 to-transparent" />
        {!item.is_available && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <Badge variant="secondary" className="text-sm">Currently Unavailable</Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-xl text-foreground">{item.name}</h3>
          <span className="shrink-0 text-lg font-bold text-primary">Rs. {item.price.toFixed(2)}</span>
        </div>

        <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
          {item.description}
        </p>

        <div className="mb-4 flex items-center gap-2">
          {item.is_vegetarian && (
            <Badge variant="secondary" className="gap-1 border-emerald-200 bg-emerald-50 text-xs text-emerald-800">
              <Leaf className="w-3 h-3" />
              Veg
            </Badge>
          )}
          {item.spice_level > 0 && (
            <Badge variant="secondary" className="gap-1 border-orange-200 bg-orange-50 text-xs text-orange-800">
              <Flame className="w-3 h-3" />
              {item.spice_level === 1 ? 'Mild' : item.spice_level === 2 ? 'Medium' : 'Hot'}
            </Badge>
          )}
          {item.is_gluten_free && (
            <Badge variant="secondary" className="border-amber-200 bg-amber-50 text-xs text-amber-800">
              GF
            </Badge>
          )}
          <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {item.prep_time_minutes}m
          </span>
        </div>

        {item.is_available && (
          <div className="flex items-center gap-2">
            {quantity === 0 ? (
              <Button onClick={handleAdd} className="w-full rounded-full" size="sm">
                <Plus className="mr-1 w-4 h-4" />
                Add to Order
              </Button>
            ) : (
              <div className="flex w-full items-center justify-between">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full border-border/70 bg-transparent"
                  onClick={handleDecrement}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="font-semibold text-foreground">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 rounded-full border-border/70 bg-transparent"
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
