"use client"

import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { CategoryTabs } from "@/components/customer/category-tabs"
import { MenuItemCard } from "@/components/customer/menu-item-card"
import { AnimatedSection } from "@/components/ui/animated-section"
import { apiClient, Category, MenuItemWithCategory } from "@/lib/api-client"

export default function MenuPage() {
  const searchParams = useSearchParams()
  const initialCategory = searchParams.get("category") || "all"

  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [searchQuery, setSearchQuery] = useState("")
  const [categories, setCategories] = useState<Category[]>([])
  const [menuItems, setMenuItems] = useState<MenuItemWithCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [categoriesData, menuItemsData] = await Promise.all([
          apiClient.getCategories(),
          apiClient.getMenuItems({ availableOnly: true })
        ])
        setCategories(categoriesData)
        setMenuItems(menuItemsData)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const filteredItems = useMemo(() => {
    let items = menuItems.filter((item) => item.is_available)

    if (activeCategory !== "all") {
      items = items.filter((item) => item.category_id === parseInt(activeCategory))
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) || item.description?.toLowerCase().includes(query)
      )
    }

    return items
  }, [activeCategory, searchQuery, menuItems])

  const activeCategories = categories.filter((c) => c.is_active)

  return (
    <div className="py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fade-up" className="mb-8 overflow-hidden rounded-[2rem] border border-border/70 bg-card/85 p-6 premium-panel md:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">Restaurant Ordering</p>
              <h1 className="mb-3 text-4xl text-foreground md:text-5xl">Our Menu</h1>
              <p className="text-muted-foreground">
                Fresh ingredients, signature flavors, and a smooth ordering experience designed for quick pickup.
              </p>
            </div>
            <div className="rounded-3xl border border-primary/15 bg-primary/8 px-5 py-4 text-sm text-foreground">
              Average prep time: 20-30 minutes
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={100} className="mb-8 space-y-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 rounded-full border-border/70 bg-card/90 pl-10"
            />
          </div>
          <CategoryTabs
            categories={activeCategories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </AnimatedSection>

        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredItems.map((item, i) => (
              <AnimatedSection key={item.id} animation="fade-up" delay={Math.min(i * 50, 300)}>
                <MenuItemCard item={item} />
              </AnimatedSection>
            ))}
          </div>
        ) : (
          <AnimatedSection animation="fade-in" className="py-16 text-center">
            <p className="text-lg text-muted-foreground">{isLoading ? "Loading menu..." : "No items found"}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {isLoading ? "Please wait a moment" : "Try adjusting your search or filter"}
            </p>
          </AnimatedSection>
        )}
      </div>
    </div>
  )
}
