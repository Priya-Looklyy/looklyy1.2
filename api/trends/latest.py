# Vercel Serverless Function for Looklyy API
from http.server import BaseHTTPRequestHandler
import json
import base64
from datetime import datetime

def get_placeholder_image_url(image_id, trend_title="Fashion Trend"):
    """Generate SVG placeholder images"""
    colors = [
        "9333ea", "a855f7", "c084fc", "e879f9", "f0abfc",  # Purple variants
        "ec4899", "f472b6", "fbbf24", "f59e0b", "ef4444"   # Pink, yellow, red
    ]
    color = colors[image_id % len(colors)]
    
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
        <defs>
            <linearGradient id="grad{image_id}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#{color};stop-opacity:1" />
                <stop offset="100%" style="stop-color:#{color}88;stop-opacity:1" />
            </linearGradient>
        </defs>
        <rect width="400" height="600" fill="url(#grad{image_id})"/>
        <text x="200" y="280" font-family="Arial, sans-serif" font-size="20" fill="white" text-anchor="middle" dominant-baseline="middle">{trend_title}</text>
        <text x="200" y="310" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle" dominant-baseline="middle" opacity="0.8">Looklyy.com</text>
        <text x="200" y="330" font-family="Arial, sans-serif" font-size="12" fill="white" text-anchor="middle" dominant-baseline="middle" opacity="0.6">Vercel API</text>
    </svg>'''
    
    return f"data:image/svg+xml;base64,{base64.b64encode(svg.encode()).decode()}"

# Generate production trending data
categories = [
    "runway_fashion", "street_style", "celebrity_style", 
    "sustainable_fashion", "vintage_inspired", "minimalist_chic",
    "bohemian_style", "athleisure", "business_casual", "evening_wear"
]

sources = ["harpers_bazaar", "elle", "vogue", "instyle", "whowhatwear"]
trend_titles = [
    "Oversized Blazers", "Metallic Textures", "Sustainable Denim", "Vintage Accessories",
    "Minimalist Jewelry", "Bold Prints", "Neutral Tones", "Statement Sleeves",
    "Chunky Sneakers", "Silk Scarves", "Wide-Leg Pants", "Cropped Jackets",
    "Animal Prints", "Pastel Colors", "Leather Accents", "Floral Patterns",
    "Geometric Shapes", "Fringe Details", "Sheer Fabrics", "Embroidered Pieces"
]

def generate_trends(limit=50):
    trends = []
    for i in range(1, min(limit + 1, 101)):
        category = categories[i % len(categories)]
        source = sources[i % len(sources)]
        title = trend_titles[i % len(trend_titles)]
        
        trends.append({
            "id": i,
            "title": f"{title} - {category.replace('_', ' ').title()}",
            "description": f"Latest {category.replace('_', ' ')} trend featuring {title.lower()} from {source.replace('_', ' ').title()}",
            "primary_image_url": get_placeholder_image_url(i, title),
            "image_alt_text": f"{title} fashion trend",
            "source_site": source,
            "category": category,
            "tags": [category, title.lower().replace(" ", "_"), "trending"],
            "trend_score": 0.6 + (i % 40) * 0.01,
            "engagement_score": 0.5 + (i % 50) * 0.01,
            "crawled_at": datetime.now().isoformat(),
            "is_featured": i <= 25
        })
    return trends

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Parse query parameters
        from urllib.parse import urlparse, parse_qs
        parsed_url = urlparse(self.path)
        query_params = parse_qs(parsed_url.query)
        limit = int(query_params.get('limit', [50])[0])
        
        # Generate trending data
        trends = generate_trends(limit)
        
        # Set CORS headers
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
        
        # Return JSON response
        self.wfile.write(json.dumps(trends).encode())
    
    def do_OPTIONS(self):
        # Handle CORS preflight
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()
