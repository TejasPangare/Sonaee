export type GalleryItem = {
  src: string
  title?: string
  description: string
  category:
    | 'Restaurant'
    | 'Banquet Hall'
    | 'Weddings'
    | 'Reception'
    | 'Engagement'
    | 'Birthday'
    | 'Food'
    | 'Decoration'
    | 'Stage Setup'
  aspect: string
}

export const galleryCategories = [
  'All',
  'Restaurant',
  'Banquet Hall',
  'Weddings',
  'Reception',
  'Engagement',
  'Birthday',
  'Food',
  'Decoration',
  'Stage Setup',
] as const

export type GalleryCategory = Exclude<(typeof galleryCategories)[number], 'All'>

const galleryCategorySet = new Set<GalleryCategory>(
  galleryCategories.filter((category): category is GalleryCategory => category !== 'All')
)

export type GalleryCollection = {
  category: GalleryCategory
  title: string
  description: string
  ctaLabel: string
  ctaHref: string
  coverImage: GalleryItem
  items: GalleryItem[]
}

const categoryMeta: Record<
  GalleryCategory,
  {
    title: string
    description: string
    ctaLabel: string
    ctaHref: string
  }
> = {
  Restaurant: {
    title: 'Restaurant',
    description: 'A warm dining atmosphere with premium interiors and everyday hospitality.',
    ctaLabel: 'View Dining',
    ctaHref: '/menu',
  },
  'Banquet Hall': {
    title: 'Banquet Hall',
    description: 'A polished venue for receptions, family gatherings, and memorable celebrations.',
    ctaLabel: 'Book Banquet',
    ctaHref: '/banquet#banquet',
  },
  Weddings: {
    title: 'Weddings',
    description: 'Elegant wedding-ready spaces designed for photos, ceremonies, and hosting guests.',
    ctaLabel: 'Plan Wedding',
    ctaHref: '/banquet#banquet',
  },
  Reception: {
    title: 'Reception',
    description: 'Welcoming reception visuals that set the tone for the event ahead.',
    ctaLabel: 'See Reception',
    ctaHref: '/banquet#banquet',
  },
  Engagement: {
    title: 'Engagement',
    description: 'Stylish engagement setups that feel intimate, bright, and celebration-ready.',
    ctaLabel: 'Explore Engagement',
    ctaHref: '/banquet#banquet',
  },
  Birthday: {
    title: 'Birthday',
    description: 'Joyful birthday moments in a space that feels festive and relaxed.',
    ctaLabel: 'Celebrate Birthday',
    ctaHref: '/banquet#banquet',
  },
  Food: {
    title: 'Food',
    description: 'Freshly prepared vegetarian dishes served with care and presentation.',
    ctaLabel: 'Browse Menu',
    ctaHref: '/menu',
  },
  Decoration: {
    title: 'Decoration',
    description: 'Decorated event frames that add polish and personality to every occasion.',
    ctaLabel: 'View Decor',
    ctaHref: '/banquet#banquet',
  },
  'Stage Setup': {
    title: 'Stage Setup',
    description: 'A focal stage arrangement created for speeches, rituals, and key moments.',
    ctaLabel: 'See Stage Setup',
    ctaHref: '/banquet#banquet',
  },
}

export const homepageGalleryItems: GalleryItem[] = [
  {
    src: '/assets/hotel_8.png',
    title: 'Signature Restaurant Hall',
    description: 'A refined dining room designed for premium meals, family gatherings, and warm hospitality.',
    category: 'Restaurant',
    aspect: 'aspect-[4/5]',
  },
  {
    src: '/assets/hotel_7.png',
    title: 'Elegant Reception Ambience',
    description: 'Polished interiors and welcoming lighting that create a memorable first impression.',
    category: 'Reception',
    aspect: 'aspect-[5/4]',
  },
  {
    src: '/assets/hotel_6.png',
    title: 'Wedding Celebration Setup',
    description: 'A graceful venue presentation for ceremonies, family moments, and grand celebrations.',
    category: 'Weddings',
    aspect: 'aspect-[4/3]',
  },
  {
    src: '/assets/hotel_5.png',
    title: 'Birthday Dining Moments',
    description: 'Warm spaces that make intimate birthdays and festive dinners feel effortless and special.',
    category: 'Birthday',
    aspect: 'aspect-[3/4]',
  },
  {
    src: '/assets/hotel_4.png',
    title: 'Decorated Event Corner',
    description: 'Flexible event styling for receptions, engagements, and private banquet experiences.',
    category: 'Decoration',
    aspect: 'aspect-[4/5]',
  },
  {
    src: '/assets/hotel_3.png',
    title: 'Premium Food Presentation',
    description: 'Thoughtfully plated vegetarian dishes that reflect freshness, care, and quality.',
    category: 'Food',
    aspect: 'aspect-[5/4]',
  },
  {
    src: '/assets/hotel_2.png',
    title: 'Banquet Hall View',
    description: 'A spacious hall suited for receptions, naming ceremonies, and elegant hosted events.',
    category: 'Banquet Hall',
    aspect: 'aspect-[4/3]',
  },
  {
    src: '/assets/hotel_1.png',
    title: 'Engagement Entrance Styling',
    description: 'A welcoming setting that elevates engagement celebrations and guest arrival moments.',
    category: 'Engagement',
    aspect: 'aspect-[4/5]',
  },
  {
    src: '/assets/hotel_6.png',
    title: 'Stage Setup Experience',
    description: 'An event-ready focal stage crafted for ceremonies, speeches, and family celebrations.',
    category: 'Stage Setup',
    aspect: 'aspect-[16/11]',
  },
]

type GalleryContentItem = {
  type: string
  title: string
  description?: string | null
  image_url?: string | null
  tag?: string | null
  subtitle?: string | null
  metadata_json?: string | null
}

export function mapContentItemsToGalleryItems(items: GalleryContentItem[]): GalleryItem[] {
  return items
    .filter((item) => item.type === 'gallery')
    .flatMap((item) => {
      const category = getGalleryCategoryFromContent(item)

      if (!category || !item.image_url) {
        return []
      }

      return [
        {
          src: item.image_url,
          title: item.title,
          description: item.description || '',
          category,
          aspect: parseGalleryAspect(item.metadata_json),
        },
      ]
    })
}

export function buildGalleryCollections(items: GalleryItem[]): GalleryCollection[] {
  return galleryCategories
    .filter((category): category is GalleryCategory => category !== 'All')
    .flatMap((category) => {
      const categoryItems = items.filter((item) => item.category === category)

      if (categoryItems.length === 0) {
        return []
      }

      const meta = categoryMeta[category]

      return [
        {
          category,
          title: meta.title,
          description: meta.description,
          ctaLabel: meta.ctaLabel,
          ctaHref: meta.ctaHref,
          coverImage: categoryItems[0],
          items: categoryItems,
        },
      ]
    })
}

export function getGalleryCategoryMeta(category: GalleryCategory) {
  return categoryMeta[category]
}

function getGalleryCategoryFromContent(item: GalleryContentItem): GalleryCategory | null {
  const rawCategory = item.tag || item.subtitle || ''
  if (!rawCategory || !galleryCategorySet.has(rawCategory as GalleryCategory)) {
    return null
  }

  return rawCategory as GalleryCategory
}

function parseGalleryAspect(metadataJson?: string | null) {
  if (!metadataJson) return 'aspect-[4/5]'

  try {
    const parsed = JSON.parse(metadataJson) as { aspect?: string }
    return parsed.aspect || 'aspect-[4/5]'
  } catch {
    return 'aspect-[4/5]'
  }
}
