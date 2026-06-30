'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Camera, Expand, Search, X } from 'lucide-react'

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
}

const masonryColumnsClass = 'columns-1 gap-6 sm:columns-2 xl:columns-3'
const cardClass = 'premium-panel overflow-hidden rounded-[1.75rem] border border-border/60 bg-card/88'

export function GallerySection({
  id,
  title,
  subtitle,
  items,
  viewMoreHref,
}: GallerySectionProps) {
  const [activeCategory, setActiveCategory] = useState<(typeof galleryCategories)[number]>('All')
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [isZoomed, setIsZoomed] = useState(false)

  const filteredItems = useMemo(
    () => (activeCategory === 'All' ? items : items.filter((item) => item.category === activeCategory)),
    [activeCategory, items]
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
                    <Image
                      src={item.src}
                      alt={item.title || item.category}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
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
                      {item.title ? <h3 className="mb-2 text-2xl text-white">{item.title}</h3> : null}
                      <p className="max-w-md text-sm leading-6 text-white/80">{item.description}</p>
                    </div>
                  </div>
                </div>
              </button>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection animation="fade-up" delay={160} className="mt-10 text-center">
          <p className="mb-4 text-lg text-muted-foreground">Want to see more?</p>
          <Link href={viewMoreHref}>
            <Button variant="outline" className="gap-2 rounded-full bg-transparent">
              View Complete Gallery
              <ArrowRight className="h-4 w-4" />
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
        <DialogContent className="max-w-6xl border-border/70 bg-background/96 p-3 sm:p-5" showCloseButton>
          {selectedItem ? (
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
              <div className="overflow-hidden rounded-[1.5rem] border border-border/60 bg-black/4">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsZoomed((value) => !value)}
                    className="relative block w-full overflow-hidden"
                  >
                    <div className="absolute right-4 top-4 z-20 flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md">
                      <Search className="h-3.5 w-3.5" />
                      {isZoomed ? 'Zoom Out' : 'Zoom In'}
                    </div>
                    <div className="relative aspect-[16/11] overflow-auto bg-black">
                      <Image
                        src={selectedItem.src}
                        alt={selectedItem.title || selectedItem.category}
                        fill
                        sizes="100vw"
                        priority
                        className={`object-cover transition-transform duration-500 ${isZoomed ? 'scale-[1.3]' : 'scale-100'}`}
                      />
                    </div>
                  </button>

                  {filteredItems.length > 1 ? (
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

              <div className="flex flex-col justify-between rounded-[1.5rem] border border-border/60 bg-card/82 p-6">
                <div>
                  <div className="mb-4 inline-flex rounded-full border border-border/60 bg-background/75 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                    {selectedItem.category}
                  </div>
                  <DialogTitle className="mb-3 text-3xl text-foreground">
                    {selectedItem.title || selectedItem.category}
                  </DialogTitle>
                  <DialogDescription className="text-sm leading-7 text-muted-foreground">
                    {selectedItem.description}
                  </DialogDescription>
                </div>

                <div className="mt-6 space-y-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full justify-between"
                    onClick={() => setIsZoomed((value) => !value)}
                  >
                    {isZoomed ? 'Reduce Zoom' : 'Zoom Image'}
                    <Search className="h-4 w-4" />
                  </Button>
                  <div className="grid grid-cols-2 gap-3">
                    <Button type="button" variant="outline" className="justify-between" onClick={goToPrevious}>
                      Previous
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="outline" className="justify-between" onClick={goToNext}>
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full justify-between"
                    onClick={() => {
                      setSelectedIndex(null)
                      setIsZoomed(false)
                    }}
                  >
                    Close Gallery
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  )
}
