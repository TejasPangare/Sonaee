'use client'

import { cn } from '@/lib/utils'
import { Category } from '@/lib/api-client'

interface CategoryTabsProps {
  categories: Category[]
  activeCategory: string
  onCategoryChange: (categoryId: string) => void
}

export function CategoryTabs({ categories, activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <div className="premium-panel scrollbar-hide flex gap-2 overflow-x-auto rounded-full border border-border/70 bg-card/80 p-2">
      <button
        onClick={() => onCategoryChange('all')}
        className={cn(
          'whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors',
          activeCategory === 'all'
            ? 'bg-primary text-primary-foreground'
            : 'text-secondary-foreground hover:bg-secondary/80'
        )}
      >
        All Items
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onCategoryChange(String(category.id))}
          className={cn(
            'whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors',
            activeCategory === String(category.id)
              ? 'bg-primary text-primary-foreground'
              : 'text-secondary-foreground hover:bg-secondary/80'
          )}
        >
          {category.name}
        </button>
      ))}
    </div>
  )
}
