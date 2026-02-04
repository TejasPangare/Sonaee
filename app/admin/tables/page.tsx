'use client'

import React from "react"

import { useState } from 'react'
import { Users, MapPin, Plus, Pencil, Trash2, MoreHorizontal } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { AdminShell } from '@/components/admin/admin-shell'
import { tables as initialTables } from '@/lib/mock-data'
import { Table } from '@/lib/types'

export default function TablesPage() {
  const [tables, setTables] = useState(initialTables)
  const [editingTable, setEditingTable] = useState<Table | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const statusColors: Record<Table['status'], string> = {
    available: 'bg-green-100 text-green-800 border-green-200',
    occupied: 'bg-red-100 text-red-800 border-red-200',
    reserved: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  }

  const filteredTables = tables.filter(table => 
    statusFilter === 'all' || table.status === statusFilter
  )

  const updateTableStatus = (tableId: string, status: Table['status']) => {
    setTables(prev => prev.map(t => 
      t.id === tableId ? { ...t, status } : t
    ))
  }

  const deleteTable = (tableId: string) => {
    setTables(prev => prev.filter(t => t.id !== tableId))
  }

  const handleSaveTable = (table: Table) => {
    if (editingTable) {
      setTables(prev => prev.map(t => t.id === table.id ? table : t))
    } else {
      setTables(prev => [...prev, { ...table, id: String(Date.now()) }])
    }
    setEditingTable(null)
    setIsAddDialogOpen(false)
  }

  const availableCount = tables.filter(t => t.status === 'available').length
  const occupiedCount = tables.filter(t => t.status === 'occupied').length
  const reservedCount = tables.filter(t => t.status === 'reserved').length
  const totalCapacity = tables.reduce((sum, t) => sum + t.capacity, 0)

  return (
    <AdminShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Tables</h1>
            <p className="text-muted-foreground">Manage restaurant seating</p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add Table
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{tables.length}</p>
              <p className="text-sm text-muted-foreground">Total Tables</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">{availableCount}</p>
              <p className="text-sm text-muted-foreground">Available</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-red-600">{occupiedCount}</p>
              <p className="text-sm text-muted-foreground">Occupied</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{totalCapacity}</p>
              <p className="text-sm text-muted-foreground">Total Capacity</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter */}
        <div className="flex gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="occupied">Occupied</SelectItem>
              <SelectItem value="reserved">Reserved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Tables Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTables.map(table => (
            <Card key={table.id}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">{table.table_number}</span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setEditingTable(table)}>
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => deleteTable(table.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{table.capacity} seats</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{table.location}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <Badge variant="outline" className={statusColors[table.status]}>
                    {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
                  </Badge>
                  <Select 
                    value={table.status} 
                    onValueChange={(v) => updateTableStatus(table.id, v as Table['status'])}
                  >
                    <SelectTrigger className="w-28 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="occupied">Occupied</SelectItem>
                      <SelectItem value="reserved">Reserved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <TableDialog
        open={isAddDialogOpen || !!editingTable}
        onOpenChange={(open) => {
          if (!open) {
            setEditingTable(null)
            setIsAddDialogOpen(false)
          }
        }}
        table={editingTable}
        onSave={handleSaveTable}
      />
    </AdminShell>
  )
}

function TableDialog({ 
  open, 
  onOpenChange, 
  table, 
  onSave 
}: { 
  open: boolean
  onOpenChange: (open: boolean) => void
  table: Table | null
  onSave: (table: Table) => void
}) {
  const [formData, setFormData] = useState<Partial<Table>>(table || {
    table_number: '',
    capacity: 2,
    status: 'available',
    location: 'Main Hall',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData as Table)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{table ? 'Edit Table' : 'Add New Table'}</DialogTitle>
          <DialogDescription>
            {table ? 'Update table details' : 'Add a new table to your restaurant'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="table_number">Table Number *</Label>
            <Input
              id="table_number"
              placeholder="e.g., T9"
              value={formData.table_number}
              onChange={(e) => setFormData(prev => ({ ...prev, table_number: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">Capacity *</Label>
            <Input
              id="capacity"
              type="number"
              min="1"
              max="20"
              value={formData.capacity}
              onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location *</Label>
            <Select 
              value={formData.location} 
              onValueChange={(v) => setFormData(prev => ({ ...prev, location: v }))}
            >
              <SelectTrigger id="location">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Main Hall">Main Hall</SelectItem>
                <SelectItem value="Window">Window</SelectItem>
                <SelectItem value="Patio">Patio</SelectItem>
                <SelectItem value="Private Room">Private Room</SelectItem>
                <SelectItem value="Bar Area">Bar Area</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(v) => setFormData(prev => ({ ...prev, status: v as Table['status'] }))}
            >
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
                <SelectItem value="reserved">Reserved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {table ? 'Save Changes' : 'Add Table'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
