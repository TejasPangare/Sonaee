"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiClient, type ContentItem, type ContentItemCreate, type ContentItemUpdate } from "@/lib/api-client";

type GalleryCategoryFormState = {
  name: string
  description: string
  displayOrder: string
  isActive: boolean
}

const defaultFormState: GalleryCategoryFormState = {
  name: "",
  description: "",
  displayOrder: "0",
  isActive: true,
}

function sortGalleryCategories(categories: ContentItem[]) {
  return [...categories].sort((left, right) => left.display_order - right.display_order || left.id - right.id)
}

export function GalleryCategoryManager({ token }: { token: string | null }) {
  const [categories, setCategories] = useState<ContentItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "">("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<ContentItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ContentItem | null>(null)
  const [formState, setFormState] = useState<GalleryCategoryFormState>(defaultFormState)

  const showMessage = (nextMessage: string, type: "success" | "error") => {
    setMessage(nextMessage)
    setMessageType(type)
  }

  const clearForm = () => {
    setEditingCategory(null)
    setFormState(defaultFormState)
  }

  const openCreateDialog = () => {
    clearForm()
    setIsDialogOpen(true)
  }

  const openEditDialog = (category: ContentItem) => {
    setEditingCategory(category)
    setFormState({
      name: category.title,
      description: category.description || "",
      displayOrder: String(category.display_order || 0),
      isActive: category.is_active,
    })
    setIsDialogOpen(true)
  }

  useEffect(() => {
    if (!token) return
    const authToken = token

    async function loadCategories() {
      setIsLoading(true)
      try {
        const categoryList = await apiClient.getContentItems(authToken, "gallery_category")
        setCategories(sortGalleryCategories(categoryList))
      } catch (error) {
        showMessage(error instanceof Error ? error.message : "Failed to load gallery categories.", "error")
      } finally {
        setIsLoading(false)
      }
    }

    loadCategories()
  }, [token])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!token) return

    if (!formState.name.trim()) {
      showMessage("Gallery category name is required.", "error")
      return
    }

    setIsSaving(true)
    setMessage("")
    setMessageType("")

    try {
      const payload: ContentItemCreate | ContentItemUpdate = {
        type: "gallery_category",
        title: formState.name.trim(),
        description: formState.description.trim(),
        display_order: Number.parseInt(formState.displayOrder, 10) || 0,
        is_active: formState.isActive,
      }

      if (editingCategory) {
        const updatedCategory = await apiClient.updateContentItem(editingCategory.id, payload, token)
        setCategories((current) => sortGalleryCategories(current.map((item) => (item.id === updatedCategory.id ? updatedCategory : item))))
        showMessage("Gallery category updated successfully.", "success")
      } else {
        const createdCategory = await apiClient.createContentItem(payload as ContentItemCreate, token)
        setCategories((current) => sortGalleryCategories([...current, createdCategory]))
        showMessage("Gallery category added successfully.", "success")
      }

      setIsDialogOpen(false)
      clearForm()
    } catch (error) {
      showMessage(error instanceof Error ? error.message : "Failed to save gallery category.", "error")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!token || !deleteTarget) return

    try {
      await apiClient.deleteContentItem(deleteTarget.id, token)
      setCategories((current) => current.filter((item) => item.id !== deleteTarget.id))
      showMessage("Gallery category deleted successfully.", "success")
    } catch (error) {
      showMessage(error instanceof Error ? error.message : "Failed to delete gallery category.", "error")
    } finally {
      setDeleteTarget(null)
    }
  }

  const sortedCategories = sortGalleryCategories(categories)

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>Gallery Categories</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Create the category card name, description, and display order used to group gallery images.
            </p>
          </div>
          <Button onClick={openCreateDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Category
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {message ? (
            <div
              className={
                messageType === "success"
                  ? "rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800"
                  : "rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
              }
            >
              {message}
            </div>
          ) : null}

          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading gallery categories...</p>
          ) : sortedCategories.length === 0 ? (
            <p className="text-sm text-muted-foreground">No gallery categories available yet.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {sortedCategories.map((category) => (
                <Card key={category.id} className="overflow-hidden">
                  <CardContent className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{category.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {category.is_active ? "Active" : "Inactive"}
                        </p>
                      </div>
                      <span className="rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground">
                        {category.display_order}
                      </span>
                    </div>
                    <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                      {category.description || "No description provided."}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(category)} className="ml-auto">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setDeleteTarget(category)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) {
            clearForm()
          }
        }}
      >
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Gallery Category" : "Add Gallery Category"}</DialogTitle>
            <DialogDescription>
              Define the category card name, description, and display order used by gallery images.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="galleryCategoryName">Name *</Label>
                <Input
                  id="galleryCategoryName"
                  value={formState.name}
                  onChange={(event) => setFormState((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Collection name"
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="galleryCategoryDescription">Description</Label>
                <Textarea
                  id="galleryCategoryDescription"
                  value={formState.description}
                  onChange={(event) => setFormState((current) => ({ ...current, description: event.target.value }))}
                  placeholder="Short description shown on the gallery collection card"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="galleryCategoryOrder">Display Order</Label>
                <Input
                  id="galleryCategoryOrder"
                  type="number"
                  value={formState.displayOrder}
                  onChange={(event) => setFormState((current) => ({ ...current, displayOrder: event.target.value }))}
                />
              </div>

              <div className="flex items-center gap-2 md:col-span-2">
                <input
                  id="galleryCategoryActive"
                  type="checkbox"
                  checked={formState.isActive}
                  onChange={(event) => setFormState((current) => ({ ...current, isActive: event.target.checked }))}
                />
                <Label htmlFor="galleryCategoryActive">Visible on the website</Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : editingCategory ? "Save Changes" : "Add Category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete gallery category?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the gallery category from the admin dashboard and public gallery cards.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
