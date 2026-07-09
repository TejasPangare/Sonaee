"use client";

import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiClient, type EventCategory, type EventCategoryCreate, type EventCategoryUpdate } from "@/lib/api-client";

type EventCategoryFormState = {
  title: string
  description: string
  imageUrl: string
  displayOrder: string
  isActive: boolean
}

const allowedImageTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
const maxImageSizeBytes = 5 * 1024 * 1024

const defaultFormState: EventCategoryFormState = {
  title: "",
  description: "",
  imageUrl: "",
  displayOrder: "0",
  isActive: true,
}

function sortEventCategories(categories: EventCategory[]) {
  return [...categories].sort((left, right) => left.display_order - right.display_order || left.id - right.id)
}

export function EventCategoryManager({ token }: { token: string | null }) {
  const [categories, setCategories] = useState<EventCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "">("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<EventCategory | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<EventCategory | null>(null)
  const [formState, setFormState] = useState<EventCategoryFormState>(defaultFormState)
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
    setEditingCategory(null)
    setFormState(defaultFormState)
    setSelectedFile(null)
    resetPreview("")
  }

  const openCreateDialog = () => {
    clearForm()
    setIsDialogOpen(true)
  }

  const openEditDialog = (category: EventCategory) => {
    setEditingCategory(category)
    setFormState({
      title: category.title,
      description: category.description || "",
      imageUrl: category.image_url || "",
      displayOrder: String(category.display_order || 0),
      isActive: category.is_active,
    })
    setSelectedFile(null)
    resetPreview(category.image_url || "")
    setIsDialogOpen(true)
  }

  useEffect(() => {
    async function loadCategories() {
      if (!token) return

      setIsLoading(true)
      try {
        const categoryList = await apiClient.getEventCategories(token)
        setCategories(sortEventCategories(categoryList))
      } catch (error) {
        showMessage(error instanceof Error ? error.message : "Failed to load event categories.", "error")
      } finally {
        setIsLoading(false)
      }
    }

    loadCategories()
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
      showMessage("Event category title is required.", "error")
      return
    }

    setIsSaving(true)
    setMessage("")
    setMessageType("")

    try {
      const imageUrl = await ensureImageUrl()
      const payload: EventCategoryCreate | EventCategoryUpdate = {
        title: formState.title.trim(),
        description: formState.description.trim(),
        image_url: imageUrl || undefined,
        display_order: Number.parseInt(formState.displayOrder, 10) || 0,
        is_active: formState.isActive,
      }

      if (editingCategory) {
        const updatedCategory = await apiClient.updateEventCategory(editingCategory.id, payload, token)
        setCategories((current) => sortEventCategories(current.map((category) => (category.id === updatedCategory.id ? updatedCategory : category))))
        showMessage("Event category updated successfully.", "success")
      } else {
        const createdCategory = await apiClient.createEventCategory(payload as EventCategoryCreate, token)
        setCategories((current) => sortEventCategories([...current, createdCategory]))
        showMessage("Event category added successfully.", "success")
      }

      setIsDialogOpen(false)
      clearForm()
    } catch (error) {
      showMessage(error instanceof Error ? error.message : "Failed to save event category.", "error")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!token || !deleteTarget) return

    try {
      await apiClient.deleteEventCategory(deleteTarget.id, token)
      setCategories((current) => current.filter((category) => category.id !== deleteTarget.id))
      showMessage("Event category deleted successfully.", "success")
    } catch (error) {
      showMessage(error instanceof Error ? error.message : "Failed to delete event category.", "error")
    } finally {
      setDeleteTarget(null)
    }
  }

  const sortedCategories = sortEventCategories(categories)

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>Event Categories</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Add, edit, delete, and adjust the event category details used on the website.
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
            <p className="text-sm text-muted-foreground">Loading event categories...</p>
          ) : sortedCategories.length === 0 ? (
            <p className="text-sm text-muted-foreground">No event categories available yet.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {sortedCategories.map((category) => (
                <Card key={category.id} className="overflow-hidden">
                  <div className="relative aspect-[4/3] bg-muted">
                    <Image
                      src={category.image_url || "/placeholder.svg"}
                      alt={category.title}
                      fill
                      className="object-cover"
                    />
                  </div>
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
            <DialogTitle>{editingCategory ? "Edit Event Category" : "Add Event Category"}</DialogTitle>
            <DialogDescription>
              Update the title, description, image, and display order for event categories.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2 md:col-span-2">
                <Label>Image Preview</Label>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border/60 bg-muted">
                  {previewUrl ? (
                    previewUrl.startsWith("blob:") ? (
                      <img src={previewUrl} alt="Event category preview" className="h-full w-full object-cover" />
                    ) : (
                      <Image src={previewUrl} alt="Event category preview" fill className="object-cover" />
                    )
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                      No image selected
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="categoryFile">Upload Image</Label>
                <Input id="categoryFile" type="file" accept="image/*" onChange={handleFileChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoryTitle">Title *</Label>
                <Input
                  id="categoryTitle"
                  value={formState.title}
                  onChange={(event) => setFormState((current) => ({ ...current, title: event.target.value }))}
                  placeholder="Event category title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoryOrder">Display Order</Label>
                <Input
                  id="categoryOrder"
                  type="number"
                  value={formState.displayOrder}
                  onChange={(event) => setFormState((current) => ({ ...current, displayOrder: event.target.value }))}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="categoryDescription">Description</Label>
                <Textarea
                  id="categoryDescription"
                  value={formState.description}
                  onChange={(event) => setFormState((current) => ({ ...current, description: event.target.value }))}
                  placeholder="Short description shown on the website"
                />
              </div>

              <div className="flex items-center gap-2 md:col-span-2">
                <input
                  id="categoryActive"
                  type="checkbox"
                  checked={formState.isActive}
                  onChange={(event) => setFormState((current) => ({ ...current, isActive: event.target.checked }))}
                />
                <Label htmlFor="categoryActive">Visible on the website</Label>
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
            <AlertDialogTitle>Delete event category?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the event category from the admin dashboard and public website sections.
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
