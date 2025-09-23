export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method not allowed' })

  const featuredLooks = [
    { id: 'featured-001', title: 'Oversized Blazers', description: 'Power dressing redefined', category: 'runway_trends', source_site: 'harpers_bazaar', primary_image_url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop&crop=center', trend_score: 0.95, is_featured: true, slider_group: 1 },
    { id: 'featured-002', title: 'Metallic Textures', description: 'Shimmer and shine', category: 'runway_trends', source_site: 'harpers_bazaar', primary_image_url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop&crop=center', trend_score: 0.92, is_featured: true, slider_group: 1 },
    { id: 'featured-003', title: 'Statement Sleeves', description: 'Dramatic details', category: 'runway_trends', source_site: 'harpers_bazaar', primary_image_url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=600&fit=crop&crop=center', trend_score: 0.89, is_featured: true, slider_group: 1 },
    { id: 'featured-004', title: 'Bold Patterns', description: 'Eye-catching designs', category: 'runway_trends', source_site: 'harpers_bazaar', primary_image_url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop&crop=center', trend_score: 0.86, is_featured: true, slider_group: 1 },
    { id: 'featured-005', title: 'Tailored Perfection', description: 'Precision and elegance', category: 'runway_trends', source_site: 'harpers_bazaar', primary_image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=600&fit=crop&crop=center', trend_score: 0.83, is_featured: true, slider_group: 1 }
  ]

  const { limit = 25 } = req.query
  const sortedLooks = featuredLooks.sort((a, b) => b.trend_score - a.trend_score).slice(0, parseInt(limit))

  res.status(200).json({
    success: true,
    data: sortedLooks,
    meta: {
      total: sortedLooks.length,
      source: 'harpers_bazaar',
      crawled_at: new Date().toISOString(),
      slider_groups: 5,
      images_per_slider: 5
    }
  })
}