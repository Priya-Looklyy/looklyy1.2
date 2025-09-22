# Simple Looklyy Trending API - Standalone Version

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List, Optional, Dict, Any
import logging
from datetime import datetime
import random

# Initialize FastAPI app
app = FastAPI(
    title="Looklyy Trending API",
    description="API for fashion trending content",
    version="1.0.0"
)

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("trending_api")

# Sample fashion data (simulating crawler results)
SAMPLE_TRENDS = [
    {
        "id": 1,
        "title": "Fall 2025 Minimalist Chic: The Power of Neutral Tones",
        "description": "Discover how fashion's biggest names are embracing understated elegance this season with carefully curated neutral palettes.",
        "primary_image_url": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop",
        "image_alt_text": "Minimalist fashion look",
        "source_site": "harpers_bazaar",
        "source_url": "https://harpersbazaar.com/fashion/trends/fall-2025-minimalist",
        "category": "minimalist_chic",
        "tags": ["fall2025", "minimalist", "neutral", "elegant"],
        "trend_score": 0.95,
        "engagement_score": 0.88,
        "crawled_at": "2024-01-15T10:30:00Z",
        "is_featured": True
    },
    {
        "id": 2,
        "title": "Runway Report: Sustainable Fashion Takes Center Stage",
        "description": "From Milan to Paris, designers are proving that eco-conscious fashion can be both luxurious and cutting-edge.",
        "primary_image_url": "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=600&fit=crop",
        "image_alt_text": "Sustainable fashion runway",
        "source_site": "vogue",
        "source_url": "https://vogue.com/runway/sustainable-fashion-2025",
        "category": "sustainable_fashion",
        "tags": ["runway", "sustainable", "eco-friendly", "luxury"],
        "trend_score": 0.92,
        "engagement_score": 0.85,
        "crawled_at": "2024-01-15T11:15:00Z",
        "is_featured": True
    },
    {
        "id": 3,
        "title": "Street Style Spotlight: Oversized Blazers Dominate Urban Fashion",
        "description": "Fashion week attendees and influencers alike are embracing the power blazer trend with modern, oversized silhouettes.",
        "primary_image_url": "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop",
        "image_alt_text": "Street style oversized blazer",
        "source_site": "elle",
        "source_url": "https://elle.com/fashion/street-style-blazers-2025",
        "category": "street_style",
        "tags": ["street_style", "blazers", "oversized", "urban"],
        "trend_score": 0.89,
        "engagement_score": 0.82,
        "crawled_at": "2024-01-15T12:00:00Z",
        "is_featured": True
    },
    {
        "id": 4,
        "title": "Celebrity Style: Red Carpet Glamour Meets Everyday Elegance",
        "description": "A-list celebrities are redefining formal wear by incorporating high-fashion elements into accessible, everyday looks.",
        "primary_image_url": "https://images.unsplash.com/photo-1566479179817-c0b30c6e9b33?w=400&h=600&fit=crop",
        "image_alt_text": "Celebrity fashion look",
        "source_site": "harpers_bazaar",
        "source_url": "https://harpersbazaar.com/celebrity/style/red-carpet-everyday",
        "category": "celebrity_style",
        "tags": ["celebrity", "red_carpet", "glamour", "accessible"],
        "trend_score": 0.87,
        "engagement_score": 0.90,
        "crawled_at": "2024-01-15T13:30:00Z",
        "is_featured": True
    },
    {
        "id": 5,
        "title": "Vintage Revival: 90s Fashion Makes a Bold Comeback",
        "description": "Slip dresses, platform shoes, and minimalist jewelry are having a major moment as Gen Z embraces 90s nostalgia.",
        "primary_image_url": "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=600&fit=crop",
        "image_alt_text": "90s vintage fashion revival",
        "source_site": "elle",
        "source_url": "https://elle.com/fashion/trends/90s-revival-2025",
        "category": "vintage_revival",
        "tags": ["90s", "vintage", "slip_dress", "platform_shoes"],
        "trend_score": 0.84,
        "engagement_score": 0.87,
        "crawled_at": "2024-01-15T14:15:00Z",
        "is_featured": True
    }
]

# Generate more sample data
def generate_sample_trends(count: int = 50) -> List[Dict[str, Any]]:
    """Generate additional sample trending looks"""
    categories = ["runway_fashion", "celebrity_style", "street_style", "seasonal_trends", 
                 "sustainable_fashion", "vintage_revival", "power_dressing", "minimalist_chic"]
    
    sources = ["harpers_bazaar", "elle", "vogue"]
    
    sample_images = [
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop",
        "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=600&fit=crop",
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop",
        "https://images.unsplash.com/photo-1566479179817-c0b30c6e9b33?w=400&h=600&fit=crop",
        "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=600&fit=crop",
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400&h=600&fit=crop",
        "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=600&fit=crop",
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop"
    ]
    
    trends = SAMPLE_TRENDS.copy()
    
    for i in range(len(SAMPLE_TRENDS), count):
        trend = {
            "id": i + 1,
            "title": f"Fashion Trend #{i + 1}: {random.choice(['Luxe', 'Chic', 'Bold', 'Elegant', 'Modern'])} {random.choice(['Silhouettes', 'Textures', 'Colors', 'Styles', 'Looks'])}",
            "description": f"Exploring the latest in {random.choice(categories).replace('_', ' ')} with innovative approaches to contemporary fashion.",
            "primary_image_url": random.choice(sample_images),
            "image_alt_text": f"Fashion trend {i + 1}",
            "source_site": random.choice(sources),
            "source_url": f"https://{random.choice(sources).replace('_', '')}.com/fashion/trend-{i + 1}",
            "category": random.choice(categories),
            "tags": [random.choice(["fall2025", "spring2025", "luxury", "casual", "formal"]), 
                    random.choice(["trendy", "classic", "modern", "vintage"])],
            "trend_score": round(random.uniform(0.6, 1.0), 2),
            "engagement_score": round(random.uniform(0.5, 0.95), 2),
            "crawled_at": f"2024-01-{random.randint(10, 20)}T{random.randint(10, 18)}:{random.randint(10, 59)}:00Z",
            "is_featured": random.choice([True, False])
        }
        trends.append(trend)
    
    return trends

ALL_TRENDS = generate_sample_trends(100)

@app.on_event("startup")
async def startup_event():
    """Initialize API on startup"""
    logger.info("Looklyy Simple Trending API started successfully")

@app.get("/")
async def root():
    """API health check"""
    return {
        "message": "Looklyy Trending API",
        "status": "active",
        "timestamp": datetime.now().isoformat(),
        "total_trends": len(ALL_TRENDS)
    }

@app.get("/trends/latest")
async def get_latest_trends(
    limit: int = 50,
    category: Optional[str] = None,
    season: Optional[str] = None,
    min_score: Optional[float] = 0.0
):
    """Get latest trending looks"""
    try:
        trends = ALL_TRENDS.copy()
        
        # Apply filters
        if category:
            trends = [t for t in trends if t["category"] == category]
        
        if season:
            trends = [t for t in trends if season in t.get("tags", [])]
        
        if min_score:
            trends = [t for t in trends if t["trend_score"] >= min_score]
        
        # Sort by trend score
        trends.sort(key=lambda x: x["trend_score"], reverse=True)
        
        # Apply limit
        trends = trends[:limit]
        
        logger.info(f"Returning {len(trends)} trending looks")
        return trends
        
    except Exception as e:
        logger.error(f"Error getting latest trends: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch trending looks")

@app.get("/trends/featured")
async def get_featured_looks(limit: int = 25):
    """Get featured looks for home page sliders"""
    try:
        featured_trends = [t for t in ALL_TRENDS if t.get("is_featured", False)]
        featured_trends.sort(key=lambda x: x["trend_score"], reverse=True)
        
        result = featured_trends[:limit]
        logger.info(f"Returning {len(result)} featured looks")
        return result
        
    except Exception as e:
        logger.error(f"Error getting featured looks: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch featured looks")

@app.get("/trends/search")
async def search_trends(
    q: str,
    category: Optional[str] = None,
    limit: int = 20
):
    """Search trending looks by keyword"""
    try:
        q_lower = q.lower()
        results = []
        
        for trend in ALL_TRENDS:
            if (q_lower in trend["title"].lower() or 
                q_lower in trend["description"].lower() or
                any(q_lower in tag.lower() for tag in trend.get("tags", []))):
                
                if not category or trend["category"] == category:
                    results.append(trend)
        
        results.sort(key=lambda x: x["trend_score"], reverse=True)
        results = results[:limit]
        
        logger.info(f"Search for '{q}' returned {len(results)} results")
        return results
        
    except Exception as e:
        logger.error(f"Error searching trends: {e}")
        raise HTTPException(status_code=500, detail="Search failed")

@app.get("/trends/categories")
async def get_categories():
    """Get available trend categories"""
    categories = list(set(trend["category"] for trend in ALL_TRENDS))
    return {
        "categories": sorted(categories),
        "total": len(categories)
    }

@app.get("/crawler/stats")
async def get_crawler_stats():
    """Get crawler statistics"""
    return {
        "total_looks_crawled": len(ALL_TRENDS),
        "new_looks_added": 25,
        "updated_looks": 5,
        "failed_crawls": 0,
        "average_quality_score": 0.87,
        "crawl_duration": 45.2,
        "last_crawl_time": datetime.now().isoformat()
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
