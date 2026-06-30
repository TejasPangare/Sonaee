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
