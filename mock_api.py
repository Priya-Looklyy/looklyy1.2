# Looklyy Trending API with Local Image Storage

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
from image_manager import image_manager

app = FastAPI()

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files for serving images
app.mount("/images", StaticFiles(directory="public/images"), name="images")

# Helper function for local images
def get_local_image_url(image_id):
    """Get local image URL using image manager"""
    return image_manager.get_local_image_url(image_id)

# Mock trending data with local images
MOCK_TRENDS = [
    {
        "id": 1,
        "title": "Fall 2025 Minimalist Chic",
        "description": "Neutral tones dominate this season's runway",
        "primary_image_url": get_local_image_url(1),
        "image_alt_text": "Minimalist fashion",
        "source_site": "harpers_bazaar",
        "category": "minimalist_chic",
        "tags": ["fall2025", "minimalist"],
        "trend_score": 0.95,
        "engagement_score": 0.88,
        "crawled_at": "2024-01-15T10:30:00Z",
        "is_featured": True
    },
    {
        "id": 2,
        "title": "Sustainable Fashion Revolution",
        "description": "Eco-conscious luxury takes center stage",
        "primary_image_url": get_local_image_url(2),
        "image_alt_text": "Sustainable fashion",
        "source_site": "vogue",
        "category": "sustainable_fashion",
        "tags": ["sustainable", "luxury"],
        "trend_score": 0.92,
        "engagement_score": 0.85,
        "crawled_at": "2024-01-15T11:15:00Z",
        "is_featured": True
    },
    {
        "id": 3,
        "title": "Street Style Blazers",
        "description": "Oversized blazers dominate urban fashion",
        "primary_image_url": get_local_image_url(3),
        "image_alt_text": "Street style blazer",
        "source_site": "elle",
        "category": "street_style",
        "tags": ["street_style", "blazers"],
        "trend_score": 0.89,
        "engagement_score": 0.82,
        "crawled_at": "2024-01-15T12:00:00Z",
        "is_featured": True
    }
]

for i in range(4, 51):
    MOCK_TRENDS.append({
        "id": i,
        "title": f"Fashion Trend {i}",
        "description": f"Latest trend number {i} from top fashion magazines",
        "primary_image_url": get_local_image_url(i),
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
    return {"message": "Looklyy Mock API", "status": "running", "total_trends": len(MOCK_TRENDS)}

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

@app.get("/images/stats")
def get_image_stats():
    """Get image cache statistics"""
    return image_manager.get_image_stats()

@app.post("/images/update")
def update_images():
    """Manually trigger image update"""
    updated_count = image_manager.update_all_images()
    return {"message": f"Updated {updated_count} images", "status": "success"}

if __name__ == "__main__":
    print("🚀 Starting Looklyy API with Local Image Storage...")
    print("📁 Images will be cached in: public/images/cache/")
    print("🔄 Auto-updates every 6 hours")
    uvicorn.run(app, host="0.0.0.0", port=8000)
