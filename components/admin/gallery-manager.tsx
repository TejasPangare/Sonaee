"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient, type ContentItem, type ContentItemCreate, type ContentItemUpdate } from "@/lib/api-client";

type GalleryFormState = {
  category: string
  imageUrl: string
  displayOrder: string
  aspect: string
  isActive: boolean
}

const defaultAspect = "aspect-[4/5]"

const defaultFormState: GalleryFormState = {
  category: "",
  imageUrl: "",
  displayOrder: "0",
  aspect: defaultAspect,
  isActive: true,
}

function parseAspect(metadataJson?: string | null) {
  if (!metadataJson) return defaultAspect
  try {
    const parsed = JSON.parse(metadataJson) as { aspect?: string }
    return parsed.aspect || defaultAspect
  } catch {
    return defaultAspect
  }
}

function sortGalleryItems(items: ContentItem[]) {
  return [...items].sort((left, right) => left.display_order - right.display_order || left.id - right.id)
}

function sortGalleryCategories(items: ContentItem[]) {
  return [...items].sort((left, right) => left.display_order - right.display_order || left.id - right.id)
}

export function GalleryManager({ token }: { token: string | null }) {
  const [items, setItems] = useState<ContentItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "">("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ContentItem | null>(null)
  const [formState, setFormState] = useState<GalleryFormState>(defaultFormState)
  const [previewUrl, setPreviewUrl] = useState("")
  const [galleryCategoryItems, setGalleryCategoryItems] = useState<ContentItem[]>([])

  const resetPreview = (nextUrl: string) => {
    setPreviewUrl(nextUrl)
  }

  const showMessage = (nextMessage: string, type: "success" | "error") => {
    setMessage(nextMessage)
    setMessageType(type)
  }

  const clearForm = () => {
    setEditingItem(null)
    setFormState(defaultFormState)
    resetPreview("")
  }

  const openCreateDialog = () => {
    clearForm()
    setFormState((current) => ({
      ...current,
      category: galleryCategoryItems[0]?.title || "",
    }))
    setIsDialogOpen(true)
  }

  const openEditDialog = (item: ContentItem) => {
    setEditingItem(item)
    setFormState({
      category: item.tag || "",
      imageUrl: item.image_url || "",
      displayOrder: String(item.display_order || 0),
      aspect: parseAspect(item.metadata_json),
      isActive: item.is_active,
    })
    resetPreview(item.image_url || "")
    setIsDialogOpen(true)
  }

  useEffect(() => {
    if (!token) return
    const authToken = token

    async function loadGallery() {
      setIsLoading(true)
      try {
        const [galleryItems, categories] = await Promise.all([
          apiClient.getContentItems(authToken, "gallery"),
          apiClient.getContentItems(authToken, "gallery_category"),
        ])
        setItems(sortGalleryItems(galleryItems))
        setGalleryCategoryItems(sortGalleryCategories(categories))
      } catch (error) {
        showMessage(error instanceof Error ? error.message : "Failed to load gallery items.", "error")
      } finally {
        setIsLoading(false)
      }
    }

    loadGallery()
  }, [token])

  const ensureImageUrl = async () => {
    return formState.imageUrl.trim()
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!token) return

    if (!formState.imageUrl.trim()) {
      showMessage("Please add an image link.", "error")
      return
    }

    if (!formState.category.trim()) {
      showMessage("Please select a gallery category.", "error")
      return
    }

    setIsSaving(true)
    setMessage("")
    setMessageType("")

    try {
      const imageUrl = await ensureImageUrl()
      if (!imageUrl) {
        showMessage("Please add an image link for the gallery item.", "error")
        setIsSaving(false)
        return
      }

      const selectedCategory = galleryCategoryItems.find((category) => category.title === formState.category)

      const payload: ContentItemCreate | ContentItemUpdate = {
        type: "gallery",
        title: selectedCategory?.title || formState.category.trim(),
        description: "",
        image_url: imageUrl,
        tag: formState.category,
        display_order: Number.parseInt(formState.displayOrder, 10) || 0,
        is_active: formState.isActive,
        metadata_json: JSON.stringify({ aspect: formState.aspect || defaultAspect }),
      }

      if (editingItem) {
        const updatedItem = await apiClient.updateContentItem(editingItem.id, payload, token)
        setItems((current) => sortGalleryItems(current.map((item) => (item.id === updatedItem.id ? updatedItem : item))))
        showMessage("Gallery item updated successfully.", "success")
      } else {
        const createdItem = await apiClient.createContentItem(payload as ContentItemCreate, token)
        setItems((current) => sortGalleryItems([...current, createdItem]))
        showMessage("Gallery item added successfully.", "success")
      }

      setIsDialogOpen(false)
      clearForm()
    } catch (error) {
      showMessage(error instanceof Error ? error.message : "Failed to save gallery item.", "error")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!token || !deleteTarget) return

    try {
      await apiClient.deleteContentItem(deleteTarget.id, token)
      setItems((current) => current.filter((item) => item.id !== deleteTarget.id))
      showMessage("Gallery item deleted successfully.", "success")
    } catch (error) {
      showMessage(error instanceof Error ? error.message : "Failed to delete gallery item.", "error")
    } finally {
      setDeleteTarget(null)
    }
  }

  const handleReorder = async (item: ContentItem, direction: -1 | 1) => {
    if (!token) return

    const sortedItems = sortGalleryItems(items)
    const currentIndex = sortedItems.findIndex((candidate) => candidate.id === item.id)
    const neighbor = sortedItems[currentIndex + direction]
    if (!neighbor) return

    try {
      const currentDisplayOrder = item.display_order
      const neighborDisplayOrder = neighbor.display_order

      const updatedCurrent = await apiClient.updateContentItem(item.id, { display_order: neighborDisplayOrder }, token)
      const updatedNeighbor = await apiClient.updateContentItem(neighbor.id, { display_order: currentDisplayOrder }, token)

      setItems((current) =>
        sortGalleryItems(
          current.map((candidate) => {
            if (candidate.id === updatedCurrent.id) return updatedCurrent
            if (candidate.id === updatedNeighbor.id) return updatedNeighbor
            return candidate
          })
        )
      )
      showMessage("Gallery order updated.", "success")
    } catch (error) {
      showMessage(error instanceof Error ? error.message : "Failed to reorder gallery.", "error")
    }
  }

  const sortedItems = sortGalleryItems(items)

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>Gallery Management</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Add, update, reorder, and remove gallery images for the homepage gallery.
            </p>
          </div>
          <Button onClick={openCreateDialog} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Gallery Image
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
            <p className="text-sm text-muted-foreground">Loading gallery items...</p>
          ) : sortedItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">No gallery items added yet.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {sortedItems.map((item, index) => (
                <Card key={item.id} className="flex h-[420px] flex-col overflow-hidden">
                  <div className="relative h-[240px] flex-shrink-0 bg-muted">
                    <img src={item.image_url || "/placeholder.svg"} alt={item.title} className="h-full w-full object-cover" />
                  </div>
                  <CardContent className="flex flex-1 flex-col justify-between space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="line-clamp-1 text-lg font-semibold text-foreground">{item.tag || "Uncategorized"}</h3>
                        <p className="line-clamp-2 text-sm text-muted-foreground">{item.title}</p>
                      </div>
                      <span className="rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground">
                        {item.display_order}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReorder(item, -1)}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReorder(item, 1)}
                        disabled={index === sortedItems.length - 1}
                      >
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => openEditDialog(item)} className="ml-auto">
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setDeleteTarget(item)}>
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
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Edit Gallery Image" : "Add Gallery Image"}</DialogTitle>
            <DialogDescription>
              Paste a direct image link and choose the gallery category it belongs to.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label>Image Preview</Label>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/60 bg-muted">
                  {previewUrl ? (
                    <img src={previewUrl} alt="Gallery preview" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                      No image selected
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="galleryImageUrl">Image Link *</Label>
                <Input
                  id="galleryImageUrl"
                  type="url"
                  value={formState.imageUrl}
                  onChange={(event) => {
                    const nextUrl = event.target.value
                    setFormState((current) => ({ ...current, imageUrl: nextUrl }))
                    resetPreview(nextUrl.trim())
                  }}
                  placeholder="https://example.com/photo.jpg"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Paste a direct image URL. The gallery will use that link as-is.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="galleryCategory">Category *</Label>
                <select
                  id="galleryCategory"
                  value={formState.category}
                  onChange={(event) => setFormState((current) => ({ ...current, category: event.target.value }))}
                  className="surface-field h-12 w-full rounded-2xl px-4 text-sm text-foreground outline-none transition-[box-shadow,border-color] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30"
                  required
                  disabled={galleryCategoryItems.length === 0}
                >
                  {galleryCategoryItems.length === 0 ? (
                    <option value="">Create a gallery category first</option>
                ) : (
                    galleryCategoryItems.map((category) => (
                      <option key={category.id} value={category.title}>
                        {category.title}
                      </option>
                    ))
                  )}
                </select>
                <p className="text-xs text-muted-foreground">
                  This links the image to one of the gallery categories you manage below.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="galleryOrder">Display Order</Label>
                <Input
                  id="galleryOrder"
                  type="number"
                  value={formState.displayOrder}
                  onChange={(event) => setFormState((current) => ({ ...current, displayOrder: event.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="galleryAspect">Aspect Ratio</Label>
                <select
                  id="galleryAspect"
                  value={formState.aspect}
                  onChange={(event) => setFormState((current) => ({ ...current, aspect: event.target.value }))}
                  className="surface-field h-12 w-full rounded-2xl px-4 text-sm text-foreground outline-none transition-[box-shadow,border-color] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30"
                >
                  <option value="aspect-[4/5]">Tall</option>
                  <option value="aspect-[5/4]">Wide</option>
                  <option value="aspect-[4/3]">Standard</option>
                  <option value="aspect-[3/4]">Portrait</option>
                  <option value="aspect-[16/11]">Landscape</option>
                </select>
              </div>

              <div className="flex items-center gap-2 md:col-span-2">
                <input
                  id="galleryActive"
                  type="checkbox"
                  checked={formState.isActive}
                  onChange={(event) => setFormState((current) => ({ ...current, isActive: event.target.checked }))}
                />
                <Label htmlFor="galleryActive">Visible on the website</Label>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : editingItem ? "Save Changes" : "Add Image"}
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
            <AlertDialogTitle>Delete gallery image?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the gallery image from the website and admin dashboard.
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
