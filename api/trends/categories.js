// Vercel API Route for Trend Categories
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

  // Return available categories
  const categories = [
    {
      id: "runway_fashion",
      name: "Runway Fashion",
      description: "Latest runway trends and designer collections"
    },
    {
      id: "street_style",
      name: "Street Style",
      description: "Urban fashion and casual wear trends"
    },
    {
      id: "celebrity_style",
      name: "Celebrity Style",
      description: "Celebrity fashion and red carpet looks"
    },
    {
      id: "sustainable_fashion",
      name: "Sustainable Fashion",
      description: "Eco-friendly and ethical fashion trends"
    },
    {
      id: "vintage_inspired",
      name: "Vintage Inspired",
      description: "Retro and vintage-inspired fashion"
    },
    {
      id: "minimalist_chic",
      name: "Minimalist Chic",
      description: "Clean, simple, and elegant fashion"
    },
    {
      id: "bohemian_style",
      name: "Bohemian Style",
      description: "Free-spirited and artistic fashion"
    },
    {
      id: "athleisure",
      name: "Athleisure",
      description: "Athletic wear for everyday fashion"
    },
    {
      id: "business_casual",
      name: "Business Casual",
      description: "Professional yet relaxed workwear"
    },
    {
      id: "evening_wear",
      name: "Evening Wear",
      description: "Formal and special occasion fashion"
    }
  ];

  res.status(200).json(categories);
}
