"use client";

import { useEffect, useState } from "react";

import { GallerySection } from "@/components/customer/gallery-section";
import { apiClient } from "@/lib/api-client";
import { homepageGalleryItems, mapContentItemsToGalleryItems, type GalleryItem } from "@/lib/gallery-data";

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(homepageGalleryItems)

  useEffect(() => {
    async function fetchGallery() {
      try {
        const siteContent = await apiClient.getSiteContent()
        const galleryContentItems = mapContentItemsToGalleryItems(siteContent.items)
        if (galleryContentItems.length > 0) {
          setGalleryItems(galleryContentItems)
        }
      } catch (error) {
        console.error("Failed to fetch gallery items:", error)
      }
    }

    fetchGallery()
  }, [])

  return (
    <div className="bg-background py-8 md:py-12">
      <GallerySection
        title="Our full gallery of spaces and celebrations."
        subtitle="Browse the complete collection of restaurant, banquet, food, and event images, all in the same familiar visual style."
        items={galleryItems}
        viewMoreHref="/banquet#banquet"
        viewMoreLabel="Book Banquet"
      />
    </div>
  )
}
