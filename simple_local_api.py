# Simple Looklyy API with Local Image Storage

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import os
from pathlib import Path

app = FastAPI()

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create images directory if it doesn't exist
images_dir = Path("public/images")
images_dir.mkdir(parents=True, exist_ok=True)

# Mount static files for serving images
app.mount("/images", StaticFiles(directory="public/images"), name="images")

# CSS-based placeholder images that will actually display
def get_placeholder_image_url(image_id):
    """Generate a CSS-based placeholder image URL"""
    colors = [
        "9333ea", "a855f7", "c084fc", "e879f9", "f0abfc",  # Purple variants
        "ec4899", "f472b6", "fbbf24", "f59e0b", "ef4444"   # Pink, yellow, red
    ]
    color = colors[image_id % len(colors)]
    
    # Create a data URL for a simple colored rectangle
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="400" height="600" viewBox="0 0 400 600">
        <defs>
            <linearGradient id="grad{image_id}" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#{color};stop-opacity:1" />
                <stop offset="100%" style="stop-color:#{color}88;stop-opacity:1" />
            </linearGradient>
        </defs>
        <rect width="400" height="600" fill="url(#grad{image_id})"/>
        <text x="200" y="300" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle">Fashion Trend {image_id}</text>
        <text x="200" y="330" font-family="Arial, sans-serif" font-size="16" fill="white" text-anchor="middle" dominant-baseline="middle" opacity="0.8">Looklyy</text>
    </svg>'''
    
    return f"data:image/svg+xml;base64,{__import__('base64').b64encode(svg.encode()).decode()}"

# Mock trending data with local images
MOCK_TRENDS = []

for i in range(1, 51):
    MOCK_TRENDS.append({
        "id": i,
        "title": f"Fashion Trend {i}",
        "description": f"Latest trend number {i} from top fashion magazines",
        "primary_image_url": get_placeholder_image_url(i),
        "image_alt_text": f"Fashion trend {i}",
        "source_site": ["harpers_bazaar", "elle", "vogue"][i % 3],
        "category": ["runway_fashion", "street_style", "celebrity_style"][i % 3],
        "tags": ["trendy", "fashion"],
        "trend_score": 0.7 + (i % 20) * 0.01,
        "engagement_score": 0.6 + (i % 30) * 0.01,
        "crawled_at": f"2024-01-15T{10 + i % 8}:30:00Z",
        "is_featured": i <= 25
    })

@app.get("/")
def root():
    return {"message": "Looklyy Local API", "status": "running", "total_trends": len(MOCK_TRENDS)}

@app.get("/trends/latest")
def get_latest_trends(limit: int = 50):
    return MOCK_TRENDS[:limit]

@app.get("/trends/featured")  
def get_featured_looks(limit: int = 25):
    featured = [t for t in MOCK_TRENDS if t.get("is_featured", False)]
    return featured[:limit]

@app.get("/trends/search")
def search_trends(q: str, limit: int = 20):
    results = [t for t in MOCK_TRENDS if q.lower() in t["title"].lower()]
    return results[:limit]

if __name__ == "__main__":
    print("🚀 Starting Looklyy Local API...")
    print("📁 Serving images from: public/images/")
    print("🖼️  Using local image URLs for reliable display")
    uvicorn.run(app, host="0.0.0.0", port=8000)
