// Vercel API Route for Search Trends
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
  const { q: query, limit = 20 } = req.query;
  const limitNum = parseInt(limit);

  if (!query) {
    res.status(400).json({ error: 'Query parameter "q" is required' });
    return;
  }

  // Generate search results
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

  // Filter trends based on search query
  const matchingTrends = [];
  let id = 1;
  
  for (const title of trendTitles) {
    if (title.toLowerCase().includes(query.toLowerCase()) && matchingTrends.length < limitNum) {
      const category = categories[id % categories.length];
      const source = sources[id % sources.length];
      
      // Generate SVG placeholder image
      const colors = [
        "9333ea", "a855f7", "c084fc", "e879f9", "f0abfc",
        "ec4899", "f472b6", "fbbf24", "f59e0b", "ef4444"
      ];
      const color = colors[id % colors.length];
      
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
        <defs>
          <linearGradient id="grad${id}" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#${color};stop-opacity:1" />
            <stop offset="100%" style="stop-color:#${color}88;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="400" height="600" fill="url(#grad${id})"/>
        <text x="200" y="280" font-family="Arial, sans-serif" font-size="20" fill="white" text-anchor="middle" dominant-baseline="middle">${title}</text>
        <text x="200" y="310" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle" dominant-baseline="middle" opacity="0.8">Search Result</text>
        <text x="200" y="330" font-family="Arial, sans-serif" font-size="12" fill="white" text-anchor="middle" dominant-baseline="middle" opacity="0.6">${query}</text>
      </svg>`;
      
      const imageUrl = `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
      
      matchingTrends.push({
        id: id,
        title: `${title} - ${category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
        description: `Search result for "${query}": ${title.toLowerCase()} from ${source.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
        primary_image_url: imageUrl,
        image_alt_text: `${title} fashion trend`,
        source_site: source,
        category: category,
        tags: [category, title.toLowerCase().replace(" ", "_"), "search", query.toLowerCase()],
        trend_score: 0.7 + (id % 30) * 0.01,
        engagement_score: 0.6 + (id % 40) * 0.01,
        crawled_at: new Date().toISOString(),
        is_featured: false
      });
      
      id++;
    }
  }

  res.status(200).json(matchingTrends);
}
