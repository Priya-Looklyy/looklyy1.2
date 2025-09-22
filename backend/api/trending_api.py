# FastAPI Server for Looklyy Trending Content

from fastapi import FastAPI, HTTPException, Depends, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List, Optional
import logging
from datetime import datetime

from ..database.db_manager import db_manager
from ..models.trend_model import TrendingLookResponse, TrendingFilters, CrawlerStats
from ..config import get_config

# Initialize FastAPI app
app = FastAPI(
    title="Looklyy Trending API",
    description="API for fashion trending content",
    version="1.0.0"
)

# Configuration
config = get_config()

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=config.API_CONFIG['cors_origins'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging setup
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("trending_api")

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    try:
        db_manager.create_tables()
        logger.info("Trending API started successfully")
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")

@app.get("/")
async def root():
    """API health check"""
    return {
        "message": "Looklyy Trending API",
        "status": "active",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/trends/latest", response_model=List[TrendingLookResponse])
async def get_latest_trends(
    limit: int = Query(50, ge=1, le=100),
    category: Optional[str] = Query(None),
    season: Optional[str] = Query(None),
    min_score: Optional[float] = Query(0.0, ge=0.0, le=1.0)
):
    """Get latest trending looks"""
    try:
        filters = TrendingFilters(
            category=category,
            season=season,
            min_trend_score=min_score,
            limit=limit,
            sort_by='trend_score',
            sort_order='desc'
        )
        
        looks = await db_manager.get_trending_looks(filters)
        return [TrendingLookResponse.from_orm(look) for look in looks]
        
    except Exception as e:
        logger.error(f"Error getting latest trends: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch trending looks")

@app.get("/trends/featured", response_model=List[TrendingLookResponse])
async def get_featured_looks(limit: int = Query(25, ge=1, le=50)):
    """Get featured looks for home page sliders"""
    try:
        looks = await db_manager.get_featured_looks(limit)
        return [TrendingLookResponse.from_orm(look) for look in looks]
        
    except Exception as e:
        logger.error(f"Error getting featured looks: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch featured looks")

@app.get("/trends/search", response_model=List[TrendingLookResponse])
async def search_trends(
    q: str = Query(..., min_length=2),
    category: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100)
):
    """Search trending looks by keyword"""
    try:
        # This would implement full-text search in a real database
        # For now, simple filtering
        filters = TrendingFilters(
            category=category,
            limit=limit,
            sort_by='trend_score',
            sort_order='desc'
        )
        
        all_looks = await db_manager.get_trending_looks(filters)
        
        # Simple keyword filtering (would use proper search in production)
        search_results = []
        q_lower = q.lower()
        for look in all_looks:
            if (q_lower in look.title.lower() or 
                q_lower in (look.description or '').lower() or
                any(q_lower in tag for tag in look.tags)):
                search_results.append(look)
        
        return [TrendingLookResponse.from_orm(look) for look in search_results]
        
    except Exception as e:
        logger.error(f"Error searching trends: {e}")
        raise HTTPException(status_code=500, detail="Search failed")

@app.get("/trends/categories")
async def get_categories():
    """Get available trend categories"""
    return {
        "categories": config.TREND_CATEGORIES,
        "total": len(config.TREND_CATEGORIES)
    }

@app.get("/crawler/stats", response_model=CrawlerStats)
async def get_crawler_stats():
    """Get crawler statistics"""
    try:
        stats = await db_manager.get_crawler_stats()
        return CrawlerStats(**stats)
        
    except Exception as e:
        logger.error(f"Error getting crawler stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to get crawler stats")

@app.post("/crawler/trigger")
async def trigger_crawl(
    sites: List[str] = Query(['harpers_bazaar'], description="Sites to crawl"),
    sections: List[str] = Query(['trends'], description="Sections to crawl")
):
    """Manually trigger a crawl (for testing/admin)"""
    try:
        # This would trigger the crawler in the background
        # For now, return a placeholder response
        return {
            "message": "Crawl triggered successfully",
            "sites": sites,
            "sections": sections,
            "estimated_completion": "10-15 minutes",
            "status": "started"
        }
        
    except Exception as e:
        logger.error(f"Error triggering crawl: {e}")
        raise HTTPException(status_code=500, detail="Failed to trigger crawl")

@app.get("/trends/by-source/{source_site}")
async def get_trends_by_source(
    source_site: str,
    limit: int = Query(20, ge=1, le=100)
):
    """Get trends from specific source site"""
    try:
        filters = TrendingFilters(
            limit=limit,
            sort_by='trend_score',
            sort_order='desc'
        )
        
        # Filter by source site
        async with db_manager.get_async_session() as session:
            looks = await session.execute(
                select(TrendingLook)
                .where(and_(
                    TrendingLook.source_site == source_site,
                    TrendingLook.is_active == True
                ))
                .order_by(desc(TrendingLook.trend_score))
                .limit(limit)
            )
            
            results = looks.scalars().all()
            return [TrendingLookResponse.from_orm(look) for look in results]
            
    except Exception as e:
        logger.error(f"Error getting trends by source: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch trends by source")

# Error handlers
@app.exception_handler(404)
async def not_found_handler(request, exc):
    return JSONResponse(
        status_code=404,
        content={"message": "Endpoint not found", "status": "error"}
    )

@app.exception_handler(500)
async def internal_error_handler(request, exc):
    return JSONResponse(
        status_code=500,
        content={"message": "Internal server error", "status": "error"}
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "trending_api:app",
        host=config.API_CONFIG['host'],
        port=config.API_CONFIG['port'],
        reload=config.DEBUG
    )
