'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Camera, Expand, ZoomIn, ZoomOut } from 'lucide-react'

import { AnimatedSection } from '@/components/ui/animated-section'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { galleryCategories, type GalleryItem } from '@/lib/gallery-data'

type GallerySectionProps = {
  id?: string
  title: string
  subtitle: string
  items: GalleryItem[]
  viewMoreHref: string
  viewMoreLabel?: string
  showCategoryTabs?: boolean
  maxItems?: number
}

const masonryColumnsClass = 'columns-1 gap-6 sm:columns-2 xl:columns-3'
const cardClass = 'premium-panel overflow-hidden rounded-[1.75rem] border border-border/60 bg-card/88'

export function GallerySection({
  id,
  title,
  subtitle,
  items,
  viewMoreHref,
  viewMoreLabel = "View Complete Gallery",
  showCategoryTabs = true,
  maxItems,
}: GallerySectionProps) {
  const [activeCategory, setActiveCategory] = useState<(typeof galleryCategories)[number]>('All')
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [isZoomed, setIsZoomed] = useState(false)

  const previewItems = typeof maxItems === "number" ? items.slice(0, maxItems) : items
  const filteredItems = useMemo(
    () =>
      showCategoryTabs
        ? activeCategory === 'All'
          ? previewItems
          : previewItems.filter((item) => item.category === activeCategory)
        : previewItems,
    [activeCategory, previewItems, showCategoryTabs]
  )

  useEffect(() => {
    if (selectedIndex === null) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setSelectedIndex(null)
        setIsZoomed(false)
      }

      if (event.key === 'ArrowRight') {
        setSelectedIndex((current) => {
          if (current === null) return current
          return (current + 1) % filteredItems.length
        })
        setIsZoomed(false)
      }

      if (event.key === 'ArrowLeft') {
        setSelectedIndex((current) => {
          if (current === null) return current
          return (current - 1 + filteredItems.length) % filteredItems.length
        })
        setIsZoomed(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [filteredItems.length, selectedIndex])

  useEffect(() => {
    setSelectedIndex(null)
    setIsZoomed(false)
  }, [activeCategory])

  const selectedItem = selectedIndex !== null ? filteredItems[selectedIndex] : null

  const goToPrevious = () => {
    setSelectedIndex((current) => {
      if (current === null) return current
      return (current - 1 + filteredItems.length) % filteredItems.length
    })
    setIsZoomed(false)
  }

  const goToNext = () => {
    setSelectedIndex((current) => {
      if (current === null) return current
      return (current + 1) % filteredItems.length
    })
    setIsZoomed(false)
  }

  return (
    <section id={id} className="bg-secondary/35 py-16 scroll-mt-28 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fade-up" className="mb-10 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">Gallery</p>
          <h2 className="mb-3 text-4xl text-foreground md:text-5xl">{title}</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">{subtitle}</p>
        </AnimatedSection>

        {showCategoryTabs ? (
          <AnimatedSection animation="fade-up" delay={120} className="mb-8 flex flex-wrap justify-center gap-3">
            {galleryCategories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-primary text-primary-foreground shadow-[0_14px_30px_rgba(196,147,82,0.22)]'
                    : 'border border-border/70 bg-card/80 text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
              >
                {category}
              </button>
            ))}
          </AnimatedSection>
        ) : null}

        <div className={masonryColumnsClass}>
          {filteredItems.map((item, index) => (
            <AnimatedSection
              key={`${item.src}-${item.category}-${index}`}
              animation="fade-up"
              delay={Math.min(index * 70, 280)}
              className="mb-6 break-inside-avoid"
            >
              <button
                type="button"
                onClick={() => {
                  setSelectedIndex(index)
                  setIsZoomed(false)
                }}
                className="group block w-full text-left"
              >
                  <div className={cardClass}>
                    <div className={`relative overflow-hidden ${item.aspect}`}>
                    <img
                      src={item.src}
                      alt={item.title || item.category}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/22 to-transparent transition-opacity duration-300 group-hover:from-black/72" />
                    <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/20 text-white backdrop-blur-md transition-transform duration-300 group-hover:scale-105">
                      <Expand className="h-4 w-4" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white/90 backdrop-blur-md">
                        <Camera className="h-3.5 w-3.5" />
                        {item.category}
                      </div>
                      {showCategoryTabs && item.title ? <h3 className="mb-2 text-2xl text-white">{item.title}</h3> : null}
                      {showCategoryTabs && item.description ? (
                        <p className="max-w-md text-sm leading-6 text-white/80">{item.description}</p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </button>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection animation="fade-up" delay={160} className="mt-10 text-center">
          <Link href={viewMoreHref}>
            <Button variant="outline" className="gap-2 rounded-full bg-transparent">
              {viewMoreLabel}
              {/* <ArrowRight className="h-4 w-4" /> */}
            </Button> 
          </Link>
        </AnimatedSection>
      </div>

      <Dialog
        open={selectedIndex !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedIndex(null)
            setIsZoomed(false)
          }
        }}
      >
        <DialogContent
          className={
            isZoomed
              ? 'h-[100dvh] w-[100vw] max-w-none border-0 bg-black/95 p-4 sm:p-8'
              : 'max-w-6xl border-border/70 bg-background/96 p-3 sm:p-5'
          }
          showCloseButton
        >
          {selectedItem ? (
            <div >
              <div className={isZoomed ? 'h-full w-full' : 'overflow-hidden rounded-[1.5rem] border border-border/60 bg-black/4'}>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsZoomed((value) => !value)}
                    className="relative block w-full overflow-hidden"
                  >
                    <div className="absolute right-4 top-4 z-20 flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md">
                      {isZoomed ? <ZoomOut className="h-3.5 w-3.5" /> : <ZoomIn className="h-3.5 w-3.5" />}
                      {isZoomed ? 'Zoom Out' : 'Zoom In'}
                    </div>  
                    <div
                      className={
                        isZoomed
                          ? 'relative h-[calc(100dvh-4rem)] w-[min(100%,70rem)] overflow-hidden rounded-[1.5rem] bg-black sm:h-[calc(100dvh-8rem)]'
                          : 'relative aspect-[16/11] overflow-hidden bg-black transition-all duration-500'
                      }
                    >
                      <img
                        src={selectedItem.src}
                        alt={selectedItem.title || selectedItem.category}
                        className={isZoomed ? 'h-full w-full object-contain' : 'h-full w-full object-cover transition-all duration-500'}
                      />
                    </div>
                  </button>

                  {!isZoomed && filteredItems.length > 1 ? (
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

              {!isZoomed && <div className="flex flex-col justify-between rounded-[1.5rem] border border-border/60 bg-card/82 p-6">
                  <div>
                    <div className="mb-4 inline-flex rounded-full border border-border/60 bg-background/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                      {selectedItem.category}
                    </div>
                      {showCategoryTabs && selectedItem.title ? (
                        <DialogTitle className="mb-3 text-3xl text-foreground">
                          {selectedItem.title}
                        </DialogTitle>
                      ) : null}
                  {showCategoryTabs && selectedItem.description ? (
                    <DialogDescription className="text-sm leading-7 text-muted-foreground">
                      {selectedItem.description}
                    </DialogDescription>
                  ) : null}
                </div>

                <div className="mt-6 space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => setIsZoomed((value) => !value)}
                  >
                    {isZoomed ? 'Zoom Out' : 'Zoom Image'}
                    {isZoomed ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
                  </Button>
                </div>
              </div>}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  )
}
