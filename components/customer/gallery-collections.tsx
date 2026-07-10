'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState, type TouchEvent } from 'react'
import { ArrowLeft, ArrowRight, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react'

import { AnimatedSection } from '@/components/ui/animated-section'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import {
  buildGalleryCollections,
  type GalleryCategoryCard,
  type GalleryItem,
} from '@/lib/gallery-data'
import { cn } from '@/lib/utils'

type GalleryCollectionsProps = {
  items: GalleryItem[]
  categories: GalleryCategoryCard[]
}

export function GalleryCollections({ items, categories }: GalleryCollectionsProps) {
  const collections = useMemo(() => buildGalleryCollections(items, categories), [items, categories])
  const [selectedCollectionIndex, setSelectedCollectionIndex] = useState<number | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [isImageReady, setIsImageReady] = useState(false)

  const touchStartX = useRef<number | null>(null)
  const touchStartY = useRef<number | null>(null)

  const selectedCollection = selectedCollectionIndex !== null ? collections[selectedCollectionIndex] : null
  const currentItems = selectedCollection?.items ?? []
  const currentImage = currentItems[selectedImageIndex] || null

  useEffect(() => {
    if (!selectedCollection) return

    setSelectedImageIndex(0)
    setIsZoomed(false)
    setIsImageReady(false)
  }, [selectedCollectionIndex, selectedCollection])

  useEffect(() => {
    if (!currentImage) return

    setIsImageReady(false)
    const timer = window.setTimeout(() => setIsImageReady(true), 40)

    const preload = (src?: string) => {
      if (!src) return
      const image = new window.Image()
      image.src = src
    }

    const previous = currentItems[(selectedImageIndex - 1 + currentItems.length) % currentItems.length]
    const next = currentItems[(selectedImageIndex + 1) % currentItems.length]
    preload(previous?.src)
    preload(next?.src)

    return () => window.clearTimeout(timer)
  }, [currentImage, currentItems, selectedImageIndex])

  useEffect(() => {
    if (selectedCollectionIndex === null) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedCollectionIndex(null)
        setIsZoomed(false)
      }

      if (event.key === 'ArrowRight') {
        setSelectedImageIndex((current) => (current + 1) % currentItems.length)
        setIsZoomed(false)
      }

      if (event.key === 'ArrowLeft') {
        setSelectedImageIndex((current) => (current - 1 + currentItems.length) % currentItems.length)
        setIsZoomed(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentItems.length, selectedCollectionIndex])

  const openCollection = (index: number) => {
    setSelectedCollectionIndex(index)
    setSelectedImageIndex(0)
    setIsZoomed(false)
  }

  const goToPrevious = () => {
    if (!currentItems.length) return
    setSelectedImageIndex((current) => (current - 1 + currentItems.length) % currentItems.length)
    setIsZoomed(false)
  }

  const goToNext = () => {
    if (!currentItems.length) return
    setSelectedImageIndex((current) => (current + 1) % currentItems.length)
    setIsZoomed(false)
  }

  const handleTouchStart = (event: TouchEvent<HTMLButtonElement>) => {
    touchStartX.current = event.touches[0]?.clientX ?? null
    touchStartY.current = event.touches[0]?.clientY ?? null
  }

  const handleTouchEnd = (event: TouchEvent<HTMLButtonElement>) => {
    if (touchStartX.current === null || touchStartY.current === null) return

    const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX.current
    const touchEndY = event.changedTouches[0]?.clientY ?? touchStartY.current
    const deltaX = touchEndX - touchStartX.current
    const deltaY = touchEndY - touchStartY.current

    touchStartX.current = null
    touchStartY.current = null

    if (Math.abs(deltaX) < 48 || Math.abs(deltaX) < Math.abs(deltaY)) return

    if (deltaX < 0) {
      goToNext()
    } else {
      goToPrevious()
    }
  }

  return (
    <section className="bg-secondary/35 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fade-up" className="mb-10 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">Gallery</p>
          <h1 className="mb-3 text-4xl text-foreground md:text-5xl">Our full gallery of spaces and celebrations.</h1>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Browse curated collections by category, then step through every image within the selected set.
          </p>
        </AnimatedSection>

        {collections.length === 0 ? (
          <div className="rounded-[1.75rem] border border-border/60 bg-card/80 px-6 py-12 text-center text-sm text-muted-foreground">
            No gallery collections are available right now.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {collections.map((collection, index) => (
              <AnimatedSection key={collection.category} animation="fade-up" delay={Math.min(index * 70, 280)}>
                <button
                  type="button"
                  onClick={() => openCollection(index)}
                  className="group block h-full w-full text-left"
                >
                  <div className="premium-panel overflow-hidden rounded-[1.75rem] border border-border/60 bg-card/88 transition-transform duration-300 group-hover:-translate-y-1">
                    <div className="relative aspect-[4/5] overflow-hidden bg-black">
                      <img
                        src={collection.coverImage.src}
                        alt={collection.coverImage.title || collection.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/24 to-transparent" />
                      <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-3">
                        <div className="inline-flex rounded-full border border-white/15 bg-black/35 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-md">
                          {collection.category}
                        </div>
                        <div className="inline-flex rounded-full border border-white/15 bg-black/35 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white backdrop-blur-md">
                          {collection.items.length} Photos
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        <h2 className="mb-2 text-2xl text-white">{collection.title}</h2>
                        {collection.description ? (
                          <p className="mb-4 max-w-md text-sm leading-6 text-white/80">{collection.description}</p>
                        ) : null}
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-foreground transition-transform duration-300 group-hover:translate-x-1">
                          Open Collection
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              </AnimatedSection>
            ))}
          </div>
        )}
      </div>

      <Dialog
        open={selectedCollectionIndex !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedCollectionIndex(null)
            setIsZoomed(false)
          }
        }}
      >
        <DialogContent
          className={
            isZoomed
              ? 'h-[100dvh] w-[100vw] max-w-none border-0 bg-black/95 p-4 sm:p-8'
              : 'max-w-7xl border-border/70 bg-background/96 p-3 sm:p-5'
          }
          showCloseButton
        >
              {selectedCollection && currentImage ? (
                <div className="space-y-4">
                  {/* {!isZoomed ? (
                    <div className="w-full max-w-full rounded-[1.25rem] border border-border/60 bg-card/80 px-3 py-2">
                      <div className="flex flex-wrap items-center gap-2">
                        {collections.map((collection, index) => (
                          <button
                            key={collection.category}
                            type="button"
                            onClick={() => {
                              setSelectedCollectionIndex(index)
                              setSelectedImageIndex(0)
                              setIsZoomed(false)
                            }}
                            className={cn(
                              'shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-300',
                              selectedCollectionIndex === index
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'border-border/70 bg-card/80 text-muted-foreground hover:bg-secondary hover:text-foreground'
                            )}
                          >
                            {collection.category}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : null} */}

              <div>
                <div className="overflow-hidden rounded-[1.5rem] border border-border/60 bg-black/5">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsZoomed((value) => !value)}
                      className="relative block w-full overflow-hidden"
                      onTouchStart={handleTouchStart}
                      onTouchEnd={handleTouchEnd}
                    >
                      <div className="absolute right-4 top-4 z-20 flex items-center gap-2 rounded-full border border-white/15 bg-black/45 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md">
                        {isZoomed ? <ZoomOut className="h-3.5 w-3.5" /> : <ZoomIn className="h-3.5 w-3.5" />}
                        {isZoomed ? 'Zoom Out' : 'Zoom In'}
                      </div>
                      <div
                        className={
                          isZoomed
                            ? 'relative h-[calc(100dvh-6rem)] w-full overflow-hidden rounded-[1.5rem] bg-black sm:h-[calc(100dvh-8rem)]'
                            : 'relative aspect-[4/5] overflow-hidden bg-black transition-all duration-500 md:aspect-[16/11]'
                        }
                      >
                        <img
                          key={currentImage.src}
                          src={currentImage.src}
                          alt={currentImage.title || selectedCollection.title}
                          className={cn(
                            'h-full w-full transition-all duration-300',
                            isImageReady ? 'opacity-100' : 'opacity-0',
                            isZoomed ? 'object-contain' : 'object-cover'
                          )}
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 z-20 rounded-full border border-white/15 bg-black/45 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white backdrop-blur-md">
                          {selectedImageIndex + 1} / {currentItems.length}
                        </div>
                      </div>
                    </button>

                    {currentItems.length > 1 ? (
                      <>
                        <button
                          type="button"
                          onClick={goToPrevious}
                          className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white backdrop-blur-md transition-transform hover:scale-105"
                          aria-label="Previous image"
                        >
                          <ArrowLeft className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={goToNext}
                          className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/35 text-white backdrop-blur-md transition-transform hover:scale-105"
                          aria-label="Next image"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </>
                    ) : null}
                  </div>
                </div>

                {!isZoomed ? (
                  <div className="flex flex-col justify-between rounded-[1.5rem] border border-border/60 bg-card/82 p-6">
                    <div>
                      <div className="mb-4 inline-flex rounded-full border border-border/60 bg-background/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                        {selectedCollection.category}
                      </div>
                      <DialogTitle className="mb-3 text-3xl text-foreground">{selectedCollection.title}</DialogTitle>
                  {selectedCollection.description ? (
                    <DialogDescription className="text-sm leading-7 text-muted-foreground">
                      {selectedCollection.description}
                    </DialogDescription>
                  ) : null}
                      <p className="mt-4 text-sm text-muted-foreground">
                        Viewing {selectedCollection.items.length} photo{selectedCollection.items.length === 1 ? '' : 's'} in this collection.
                      </p>
                    </div>

                    <div className="mt-6">
                      <Button asChild className="w-full justify-between">
                        <Link href={selectedCollection.ctaHref}>
                          {selectedCollection.ctaLabel}
                          <ChevronRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  )
}
