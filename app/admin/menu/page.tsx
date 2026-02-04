'use client'

import React from "react"

import { useState } from 'react'
import Image from 'next/image'
import { Search, Plus, Pencil, Trash2, Leaf, Flame, MoreHorizontal } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { AdminShell } from '@/components/admin/admin-shell'
import { categories, menuItems as initialMenuItems } from '@/lib/mock-data'
import { MenuItem } from '@/lib/types'

export default function MenuManagementPage() {
  const [menuItems, setMenuItems] = useState(initialMenuItems)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || item.category_id === categoryFilter
    return matchesSearch && matchesCategory
  })

  const getCategoryName = (categoryId: string) => {
    return categories.find(c => c.id === categoryId)?.name || 'Unknown'
  }

  const toggleAvailability = (itemId: string) => {
    setMenuItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, is_available: !item.is_available } : item
    ))
  }

  const deleteItem = (itemId: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== itemId))
  }

  const handleSaveItem = (item: MenuItem) => {
    if (editingItem) {
      setMenuItems(prev => prev.map(i => i.id === item.id ? item : i))
    } else {
      setMenuItems(prev => [...prev, { ...item, id: String(Date.now()) }])
    }
    setEditingItem(null)
    setIsAddDialogOpen(false)
  }

  return (
    <AdminShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Menu Items</h1>
            <p className="text-muted-foreground">Manage your restaurant menu</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Item
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search menu items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredItems.map(item => (
            <Card key={item.id} className={!item.is_available ? 'opacity-60' : ''}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-muted shrink-0">
                    {!imageErrors[item.id] ? (
                      <Image
                        src={item.image_url || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        onError={() => setImageErrors(prev => ({ ...prev, [item.id]: true }))}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-2xl text-muted-foreground/30">🍽️</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-foreground truncate">{item.name}</h3>
                        <p className="text-sm text-muted-foreground">{getCategoryName(item.category_id)}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="shrink-0">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingItem(item)}>
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => deleteItem(item.id)}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className="text-lg font-bold text-primary mt-1">₹{item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {item.is_vegetarian && (
                        <Badge variant="secondary" className="text-xs gap-1 bg-green-100 text-green-800">
                          <Leaf className="w-3 h-3" />
                        </Badge>
                      )}
                      {item.spice_level > 0 && (
                        <Badge variant="secondary" className="text-xs gap-1 bg-red-100 text-red-800">
                          <Flame className="w-3 h-3" />
                        </Badge>
                      )}
                      <div className="ml-auto flex items-center gap-2">
                        <Label htmlFor={`avail-${item.id}`} className="text-xs text-muted-foreground">
                          Available
                        </Label>
                        <Switch
                          id={`avail-${item.id}`}
                          checked={item.is_available}
                          onCheckedChange={() => toggleAvailability(item.id)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Edit/Add Dialog */}
      <MenuItemDialog
        open={isAddDialogOpen || !!editingItem}
        onOpenChange={(open) => {
          if (!open) {
            setEditingItem(null)
            setIsAddDialogOpen(false)
          }
        }}
        item={editingItem}
        onSave={handleSaveItem}
      />
    </AdminShell>
  )
}

function MenuItemDialog({ 
  open, 
  onOpenChange, 
  item, 
  onSave 
}: { 
  open: boolean
  onOpenChange: (open: boolean) => void
  item: MenuItem | null
  onSave: (item: MenuItem) => void
}) {
  const [formData, setFormData] = useState<Partial<MenuItem>>(item || {
    name: '',
    description: '',
    price: 0,
    category_id: '1',
    image_url: '/images/placeholder.jpg',
    is_available: true,
    is_vegetarian: false,
    is_vegan: false,
    is_gluten_free: false,
    spice_level: 0,
    preparation_time: 15,
    display_order: 1,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData as MenuItem)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{item ? 'Edit Item' : 'Add New Item'}</DialogTitle>
          <DialogDescription>
            {item ? 'Update the menu item details' : 'Fill in the details for the new menu item'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.category_id} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, category_id: v }))}
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prep_time">Prep Time (min)</Label>
              <Input
                id="prep_time"
                type="number"
                min="1"
                value={formData.preparation_time}
                onChange={(e) => setFormData(prev => ({ ...prev, preparation_time: parseInt(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="spice">Spice Level</Label>
              <Select 
                value={String(formData.spice_level)} 
                onValueChange={(v) => setFormData(prev => ({ ...prev, spice_level: parseInt(v) }))}
              >
                <SelectTrigger id="spice">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">None</SelectItem>
                  <SelectItem value="1">Mild</SelectItem>
                  <SelectItem value="2">Medium</SelectItem>
                  <SelectItem value="3">Hot</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <Label>Dietary Options</Label>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="vegetarian"
                  checked={formData.is_vegetarian}
                  onCheckedChange={(c) => setFormData(prev => ({ ...prev, is_vegetarian: c }))}
                />
                <Label htmlFor="vegetarian" className="text-sm">Vegetarian</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="vegan"
                  checked={formData.is_vegan}
                  onCheckedChange={(c) => setFormData(prev => ({ ...prev, is_vegan: c }))}
                />
                <Label htmlFor="vegan" className="text-sm">Vegan</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="gf"
                  checked={formData.is_gluten_free}
                  onCheckedChange={(c) => setFormData(prev => ({ ...prev, is_gluten_free: c }))}
                />
                <Label htmlFor="gf" className="text-sm">Gluten Free</Label>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="available"
              checked={formData.is_available}
              onCheckedChange={(c) => setFormData(prev => ({ ...prev, is_available: c }))}
            />
            <Label htmlFor="available">Available for ordering</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {item ? 'Save Changes' : 'Add Item'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
