/**
 * Mock Fashion Images for Looklyy Demo
 * Static data to showcase the complete product flow
 */

export interface MockImage {
  id: string
  original_url: string
  title: string
  description: string
  category: string
  subcategory?: string
  trendScore: number
  created_at: string
  is_heart_marked?: boolean
  training_status?: 'pending' | 'approved' | 'rejected' | 'queued'
}

// High-quality placeholder images from fashion/style sources
export const mockTrendingImages: MockImage[] = [
  {
    id: '1',
    original_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
    title: 'Elegant Spring Runway Look',
    description: 'Flowing silk dress with modern silhouette from Paris Fashion Week',
    category: 'runway',
    subcategory: 'spring-2025',
    trendScore: 0.95,
    created_at: '2025-01-15T10:00:00Z'
  },
  {
    id: '2',
    original_url: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800',
    title: 'Minimalist Street Style',
    description: 'Clean lines and neutral tones define this season\'s urban aesthetic',
    category: 'street-style',
    subcategory: 'minimalist',
    trendScore: 0.92,
    created_at: '2025-01-15T09:30:00Z'
  },
  {
    id: '3',
    original_url: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800',
    title: 'Bohemian Summer Vibes',
    description: 'Flowy fabrics and earthy colors for effortless summer style',
    category: 'trends',
    subcategory: 'bohemian',
    trendScore: 0.89,
    created_at: '2025-01-15T09:00:00Z'
  },
  {
    id: '4',
    original_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800',
    title: 'Power Suit Revival',
    description: 'Sharp tailoring meets contemporary design in modern workwear',
    category: 'runway',
    subcategory: 'power-dressing',
    trendScore: 0.94,
    created_at: '2025-01-15T08:30:00Z'
  },
  {
    id: '5',
    original_url: 'https://images.unsplash.com/photo-1558769132-cb1aea1c8f6a?w=800',
    title: 'Vintage Glam',
    description: 'Retro-inspired elegance with a modern twist',
    category: 'trends',
    subcategory: 'vintage',
    trendScore: 0.88,
    created_at: '2025-01-15T08:00:00Z'
  },
  {
    id: '6',
    original_url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800',
    title: 'Athleisure Chic',
    description: 'Comfort meets style in sophisticated sportswear',
    category: 'street-style',
    subcategory: 'athleisure',
    trendScore: 0.91,
    created_at: '2025-01-14T18:00:00Z'
  },
  {
    id: '7',
    original_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
    title: 'Monochrome Magic',
    description: 'All-black ensemble with striking proportions',
    category: 'runway',
    subcategory: 'monochrome',
    trendScore: 0.93,
    created_at: '2025-01-14T17:00:00Z'
  },
  {
    id: '8',
    original_url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800',
    title: 'Romantic Evening Wear',
    description: 'Delicate lace and soft pastels for special occasions',
    category: 'trends',
    subcategory: 'evening',
    trendScore: 0.87,
    created_at: '2025-01-14T16:00:00Z'
  },
  {
    id: '9',
    original_url: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800',
    title: 'Denim Reimagined',
    description: 'Contemporary take on classic denim staples',
    category: 'street-style',
    subcategory: 'casual',
    trendScore: 0.86,
    created_at: '2025-01-14T15:00:00Z'
  },
  {
    id: '10',
    original_url: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800',
    title: 'Avant-Garde Statement',
    description: 'Bold architectural shapes push fashion boundaries',
    category: 'runway',
    subcategory: 'avant-garde',
    trendScore: 0.90,
    created_at: '2025-01-14T14:00:00Z'
  },
  {
    id: '11',
    original_url: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=800',
    title: 'Coastal Elegance',
    description: 'Breezy linen and ocean-inspired colors',
    category: 'trends',
    subcategory: 'coastal',
    trendScore: 0.85,
    created_at: '2025-01-14T13:00:00Z'
  },
  {
    id: '12',
    original_url: 'https://images.unsplash.com/photo-1467043237213-65f2da53396f?w=800',
    title: 'Urban Edge',
    description: 'Streetwear meets high fashion in city-ready looks',
    category: 'street-style',
    subcategory: 'urban',
    trendScore: 0.89,
    created_at: '2025-01-14T12:00:00Z'
  },
  {
    id: '13',
    original_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
    title: 'Textured Layers',
    description: 'Mix of fabrics creates depth and interest',
    category: 'trends',
    subcategory: 'layering',
    trendScore: 0.84,
    created_at: '2025-01-14T11:00:00Z'
  },
  {
    id: '14',
    original_url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800',
    title: 'Festival Ready',
    description: 'Free-spirited style perfect for outdoor events',
    category: 'street-style',
    subcategory: 'festival',
    trendScore: 0.83,
    created_at: '2025-01-14T10:00:00Z'
  },
  {
    id: '15',
    original_url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800',
    title: 'Sophisticated Neutrals',
    description: 'Timeless elegance in beige and cream tones',
    category: 'runway',
    subcategory: 'neutrals',
    trendScore: 0.92,
    created_at: '2025-01-14T09:00:00Z'
  },
  {
    id: '16',
    original_url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800',
    title: 'Color Pop',
    description: 'Vibrant hues make a bold fashion statement',
    category: 'trends',
    subcategory: 'colorful',
    trendScore: 0.88,
    created_at: '2025-01-13T18:00:00Z'
  },
  {
    id: '17',
    original_url: 'https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?w=800',
    title: 'Tailored Perfection',
    description: 'Impeccable fit defines this season\'s suiting',
    category: 'runway',
    subcategory: 'tailored',
    trendScore: 0.91,
    created_at: '2025-01-13T17:00:00Z'
  },
  {
    id: '18',
    original_url: 'https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?w=800',
    title: 'Romantic Ruffles',
    description: 'Feminine details add softness to structured pieces',
    category: 'trends',
    subcategory: 'romantic',
    trendScore: 0.86,
    created_at: '2025-01-13T16:00:00Z'
  },
  {
    id: '19',
    original_url: 'https://images.unsplash.com/photo-1495385794356-15371f348c31?w=800',
    title: 'Leather Luxe',
    description: 'Premium leather in unexpected silhouettes',
    category: 'street-style',
    subcategory: 'leather',
    trendScore: 0.90,
    created_at: '2025-01-13T15:00:00Z'
  },
  {
    id: '20',
    original_url: 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800',
    title: 'Ethereal Beauty',
    description: 'Light fabrics flow like poetry in motion',
    category: 'runway',
    subcategory: 'ethereal',
    trendScore: 0.89,
    created_at: '2025-01-13T14:00:00Z'
  }
]

export const mockWardrobeImages: MockImage[] = [
  ...mockTrendingImages.slice(0, 5).map(img => ({
    ...img,
    is_heart_marked: true
  }))
]

export const mockTrainingImages: MockImage[] = [
  ...mockTrendingImages.slice(10, 20).map((img, index) => ({
    ...img,
    training_status: index % 3 === 0 ? 'pending' : (index % 3 === 1 ? 'queued' : 'pending') as any
  }))
]

export const mockCategories = [
  { name: 'All', count: 20, active: true },
  { name: 'Runway', count: 7, active: false },
  { name: 'Street Style', count: 6, active: false },
  { name: 'Trends', count: 7, active: false }
]

export const mockUserProfile = {
  name: 'Fashion Enthusiast',
  email: 'demo@looklyy.com',
  avatar: 'https://ui-avatars.com/api/?name=Fashion+Enthusiast&background=9333ea&color=fff',
  favorites: 5,
  joined: '2025-01-01'
}

export const mockCrawlerStats = {
  last_run: '2025-01-15T10:00:00Z',
  total_images: 500,
  pages_crawled: 25,
  images_stored: 443,
  success_rate: 95
}

export const mockTrainingStats = {
  total_reviewed: 150,
  approved: 95,
  rejected: 40,
  duplicates: 15,
  pending: 10
}

export const mockReviewSession = {
  session_id: 'demo_session_001',
  total_images: 10,
  images_reviewed: 6,
  status: 'active',
  created_at: '2025-01-15T08:00:00Z',
  expires_at: '2025-01-15T14:00:00Z'
}
