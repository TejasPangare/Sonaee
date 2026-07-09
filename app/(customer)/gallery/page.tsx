"use client";

import { useEffect, useState } from "react";

import { GalleryCollections } from "@/components/customer/gallery-collections";
import { apiClient } from "@/lib/api-client";
import { mapContentItemsToGalleryItems, type GalleryItem } from "@/lib/gallery-data";

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchGallery() {
      try {
        const siteContent = await apiClient.getSiteContent()
        setGalleryItems(mapContentItemsToGalleryItems(siteContent.items))
      } catch (error) {
        console.error("Failed to fetch gallery items:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchGallery()
  }, [])

  return (
    <div className="bg-background py-8 md:py-12">
      {isLoading ? (
        <div className="mx-auto flex min-h-[50vh] max-w-7xl items-center justify-center px-4 text-sm text-muted-foreground sm:px-6 lg:px-8">
          Loading gallery...
        </div>
      ) : (
        <GalleryCollections items={galleryItems} />
      )}
    </div>
  )
}
