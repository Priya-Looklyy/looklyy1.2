// Vercel API Route for Featured Trends
export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  // Parse query parameters
  const { limit = 25 } = req.query;
  const limitNum = parseInt(limit);

  // Generate featured trends for home page sliders
  const featuredTitles = [
    "Spring Runway Highlights", "Celebrity Street Style", "Sustainable Fashion",
    "Vintage Revival", "Minimalist Chic", "Bold Statement Pieces",
    "Neutral Palette", "Metallic Accents", "Oversized Silhouettes",
    "Floral Patterns", "Leather Details", "Sheer Fabrics",
    "Chunky Accessories", "Pastel Tones", "Geometric Prints",
    "Fringe Elements", "Embroidered Textures", "Wide Leg Pants",
    "Cropped Jackets", "Silk Scarves", "Animal Prints",
    "Business Casual", "Evening Wear", "Athleisure", "Bohemian Style"
  ];

  const trends = [];
  for (let i = 1; i <= Math.min(limitNum, 25); i++) {
    const title = featuredTitles[i - 1];
    
    // Generate SVG placeholder image
    const colors = [
      "9333ea", "a855f7", "c084fc", "e879f9", "f0abfc",
      "ec4899", "f472b6", "fbbf24", "f59e0b", "ef4444"
    ];
    const color = colors[i % colors.length];
    
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
      <defs>
        <linearGradient id="grad${i}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#${color};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#${color}88;stop-opacity:1" />
        </linearGradient>
      </defs>
      <rect width="400" height="600" fill="url(#grad${i})"/>
      <text x="200" y="280" font-family="Arial, sans-serif" font-size="20" fill="white" text-anchor="middle" dominant-baseline="middle">${title}</text>
      <text x="200" y="310" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle" dominant-baseline="middle" opacity="0.8">Looklyy.com</text>
      <text x="200" y="330" font-family="Arial, sans-serif" font-size="12" fill="white" text-anchor="middle" dominant-baseline="middle" opacity="0.6">Featured</text>
    </svg>`;
    
    const imageUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
    
    trends.push({
      id: i,
      title: title,
      description: `Featured trend: ${title} - curated by Looklyy fashion experts`,
      primary_image_url: imageUrl,
      image_alt_text: `${title} featured fashion trend`,
      source_site: "looklyy_curated",
      category: "featured",
      tags: ["featured", "curated", "trending"],
      trend_score: 0.8 + (i % 20) * 0.01, // Higher scores for featured
      engagement_score: 0.7 + (i % 25) * 0.01,
      crawled_at: new Date().toISOString(),
      is_featured: true
    });
  }

  res.status(200).json(trends);
}
