// Vercel API Route for Latest Trends
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
  const { limit = 50 } = req.query;
  const limitNum = parseInt(limit);

  // Generate trending data
  const categories = [
    "runway_fashion", "street_style", "celebrity_style", 
    "sustainable_fashion", "vintage_inspired", "minimalist_chic",
    "bohemian_style", "athleisure", "business_casual", "evening_wear"
  ];

  const sources = ["harpers_bazaar", "elle", "vogue", "instyle", "whowhatwear"];
  const trendTitles = [
    "Oversized Blazers", "Metallic Textures", "Sustainable Denim", "Vintage Accessories",
    "Minimalist Jewelry", "Bold Prints", "Neutral Tones", "Statement Sleeves",
    "Chunky Sneakers", "Silk Scarves", "Wide-Leg Pants", "Cropped Jackets",
    "Animal Prints", "Pastel Colors", "Leather Accents", "Floral Patterns",
    "Geometric Shapes", "Fringe Details", "Sheer Fabrics", "Embroidered Pieces"
  ];

  const trends = [];
  for (let i = 1; i <= Math.min(limitNum, 100); i++) {
    const category = categories[i % categories.length];
    const source = sources[i % sources.length];
    const title = trendTitles[i % trendTitles.length];
    
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
      <text x="200" y="330" font-family="Arial, sans-serif" font-size="12" fill="white" text-anchor="middle" dominant-baseline="middle" opacity="0.6">Vercel API</text>
    </svg>`;
    
    const imageUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
    
    trends.push({
      id: i,
      title: `${title} - ${category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
      description: `Latest ${category.replace('_', ' ')} trend featuring ${title.toLowerCase()} from ${source.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
      primary_image_url: imageUrl,
      image_alt_text: `${title} fashion trend`,
      source_site: source,
      category: category,
      tags: [category, title.toLowerCase().replace(" ", "_"), "trending"],
      trend_score: 0.6 + (i % 40) * 0.01,
      engagement_score: 0.5 + (i % 50) * 0.01,
      crawled_at: new Date().toISOString(),
      is_featured: i <= 25
    });
  }

  res.status(200).json(trends);
}
