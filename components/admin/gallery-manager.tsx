"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiClient, type ContentItem, type ContentItemCreate, type ContentItemUpdate } from "@/lib/api-client";
import { galleryCategories } from "@/lib/gallery-data";

type GalleryFormState = {
  title: string
  description: string
  category: string
  imageUrl: string
  displayOrder: string
  aspect: string
  isActive: boolean
}

const defaultAspect = "aspect-[4/5]"
const allowedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
const maxImageSizeBytes = 5 * 1024 * 1024

const defaultFormState: GalleryFormState = {
  title: "",
  description: "",
  category: "Restaurant",
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState("")
  const previewObjectUrlRef = useRef<string | null>(null)

  const resetPreview = (nextUrl: string) => {
    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current)
      previewObjectUrlRef.current = null
    }

    setPreviewUrl(nextUrl)
  }

  const showMessage = (nextMessage: string, type: "success" | "error") => {
    setMessage(nextMessage)
    setMessageType(type)
  }

  const clearForm = () => {
    setEditingItem(null)
    setFormState(defaultFormState)
    setSelectedFile(null)
    resetPreview("")
  }

  const openCreateDialog = () => {
    clearForm()
    setIsDialogOpen(true)
  }

  const openEditDialog = (item: ContentItem) => {
    setEditingItem(item)
    setFormState({
      title: item.title,
      description: item.description || "",
      category: item.tag || "Restaurant",
      imageUrl: item.image_url || "",
      displayOrder: String(item.display_order || 0),
      aspect: parseAspect(item.metadata_json),
      isActive: item.is_active,
    })
    setSelectedFile(null)
    resetPreview(item.image_url || "")
    setIsDialogOpen(true)
  }

  useEffect(() => {
    if (!token) return
    const authToken = token

    async function loadGallery() {
      setIsLoading(true)
      try {
        const galleryItems = await apiClient.getContentItems(authToken, "gallery")
        setItems(sortGalleryItems(galleryItems))
      } catch (error) {
        showMessage(error instanceof Error ? error.message : "Failed to load gallery items.", "error")
      } finally {
        setIsLoading(false)
      }
    }

    loadGallery()
  }, [token])

  useEffect(() => {
    return () => {
      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current)
      }
    }
  }, [])

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    if (!file) {
      setSelectedFile(null)
      resetPreview(formState.imageUrl)
      return
    }

    if (!allowedImageTypes.includes(file.type)) {
      showMessage("Only JPG, PNG, WEBP, and GIF images are supported.", "error")
      event.target.value = ""
      return
    }

    if (file.size > maxImageSizeBytes) {
      showMessage("Image must be 5MB or smaller.", "error")
      event.target.value = ""
      return
    }

    if (previewObjectUrlRef.current) {
      URL.revokeObjectURL(previewObjectUrlRef.current)
    }

    const objectUrl = URL.createObjectURL(file)
    previewObjectUrlRef.current = objectUrl
    setSelectedFile(file)
    setPreviewUrl(objectUrl)
  }

  const ensureImageUrl = async () => {
    if (selectedFile) {
      const uploadResult = await apiClient.uploadContentImage(selectedFile, token || "")
      setFormState((current) => ({ ...current, imageUrl: uploadResult.url }))
      resetPreview(uploadResult.url)
      setSelectedFile(null)
      return uploadResult.url
    }

    return formState.imageUrl
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!token) return

    if (!formState.title.trim()) {
      showMessage("Title is required.", "error")
      return
    }

    if (!formState.description.trim()) {
      showMessage("Description is required.", "error")
      return
    }

    if (!formState.category) {
      showMessage("Please select a category.", "error")
      return
    }

    setIsSaving(true)
    setMessage("")
    setMessageType("")

    try {
      const imageUrl = await ensureImageUrl()
      if (!imageUrl) {
        showMessage("Please upload an image for the gallery item.", "error")
        setIsSaving(false)
        return
      }

      const payload: ContentItemCreate | ContentItemUpdate = {
        type: "gallery",
        title: formState.title.trim(),
        description: formState.description.trim(),
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
              Upload, update, reorder, and remove gallery images for the homepage gallery.
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
                <Card key={item.id} className="overflow-hidden">
                  <div className="relative aspect-[4/3] bg-muted">
                    <Image
                      src={item.image_url || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.tag || "Uncategorized"}</p>
                      </div>
                      <span className="rounded-full border border-border/60 px-3 py-1 text-xs text-muted-foreground">
                        {item.display_order}
                      </span>
                    </div>
                    <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">{item.description}</p>
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
              Upload an image, choose its category, and set how it appears in the gallery.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label>Image Preview</Label>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/60 bg-muted">
                  {previewUrl ? (
                    previewUrl.startsWith("blob:") ? (
                      <img src={previewUrl} alt="Gallery preview" className="h-full w-full object-cover" />
                    ) : (
                      <Image src={previewUrl} alt="Gallery preview" fill className="object-cover" />
                    )
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                      No image selected
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="galleryFile">Upload Image *</Label>
                <Input id="galleryFile" type="file" accept="image/*" onChange={handleFileChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="galleryTitle">Title *</Label>
                <Input
                  id="galleryTitle"
                  value={formState.title}
                  onChange={(event) => setFormState((current) => ({ ...current, title: event.target.value }))}
                  placeholder="Gallery image title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="galleryCategory">Category *</Label>
                <select
                  id="galleryCategory"
                  value={formState.category}
                  onChange={(event) => setFormState((current) => ({ ...current, category: event.target.value }))}
                  className="surface-field h-12 w-full rounded-2xl px-4 text-sm text-foreground outline-none transition-[box-shadow,border-color] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30"
                  required
                >
                  {galleryCategories
                    .filter((category) => category !== "All")
                    .map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="galleryDescription">Description *</Label>
                <Textarea
                  id="galleryDescription"
                  value={formState.description}
                  onChange={(event) => setFormState((current) => ({ ...current, description: event.target.value }))}
                  placeholder="Short description shown in the gallery card"
                  required
                />
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
