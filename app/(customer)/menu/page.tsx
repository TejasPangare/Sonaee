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
        {/* Header */}
        <AnimatedSection animation="fade-up" className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Our Menu</h1>
          <p className="text-muted-foreground">
            Fresh ingredients, expertly prepared. Ready for pickup in 20-30 minutes.
          </p>
        </AnimatedSection>

        {/* Search & Filters */}
        <AnimatedSection animation="fade-up" delay={100} className="space-y-4 mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <CategoryTabs
            categories={activeCategories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </AnimatedSection>

        {/* Results */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item, i) => (
              <AnimatedSection key={item.id} animation="fade-up" delay={Math.min(i * 50, 300)}>
                <MenuItemCard item={item} />
              </AnimatedSection>
            ))}
          </div>
        ) : (
          <AnimatedSection animation="fade-in" className="text-center py-16">
            <p className="text-muted-foreground text-lg">No items found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Try adjusting your search or filter
            </p>
          </AnimatedSection>
        )}
      </div>
    </div>
  )
}
