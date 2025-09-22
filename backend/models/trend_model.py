# Looklyy Trending Content Database Models

from sqlalchemy import Column, Integer, String, Text, DateTime, JSON, Float, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from datetime import datetime
from typing import Optional, List, Dict
from pydantic import BaseModel, HttpUrl

Base = declarative_base()

class TrendingLook(Base):
    """Database model for trending fashion looks"""
    __tablename__ = 'trending_looks'
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Source Information
    source_site = Column(String(100), nullable=False)  # 'harpers_bazaar', 'elle', 'vogue'
    source_url = Column(String(500), nullable=False, unique=True)
    source_title = Column(String(200))
    source_author = Column(String(100))
    
    # Content Data
    title = Column(String(200), nullable=False)
    description = Column(Text)
    summary = Column(Text)  # LLM-generated summary
    
    # Image Data
    primary_image_url = Column(String(500), nullable=False)
    image_alt_text = Column(String(200))
    image_width = Column(Integer)
    image_height = Column(Integer)
    image_quality_score = Column(Float, default=0.0)
    
    # Additional Images (JSON array of URLs)
    additional_images = Column(JSON, default=list)
    
    # Categorization
    category = Column(String(50), nullable=False)  # 'runway_fashion', 'celebrity_style', etc.
    tags = Column(JSON, default=list)  # ['fall2025', 'minimalist', 'sustainable']
    season = Column(String(20))  # 'fall2025', 'spring2025', etc.
    
    # Trend Metrics
    trend_score = Column(Float, default=0.0)  # Algorithm-calculated trending score
    engagement_score = Column(Float, default=0.0)  # Social engagement if available
    
    # Timestamps
    published_date = Column(DateTime)
    crawled_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Status
    is_active = Column(Boolean, default=True)
    is_featured = Column(Boolean, default=False)
    
    def __repr__(self):
        return f"<TrendingLook(id={self.id}, title='{self.title}', source='{self.source_site}')>"

# Pydantic Models for API
class TrendingLookBase(BaseModel):
    title: str
    description: Optional[str] = None
    summary: Optional[str] = None
    primary_image_url: HttpUrl
    image_alt_text: Optional[str] = None
    category: str
    tags: List[str] = []
    season: Optional[str] = None

class TrendingLookCreate(TrendingLookBase):
    source_site: str
    source_url: HttpUrl
    source_title: Optional[str] = None
    source_author: Optional[str] = None
    published_date: Optional[datetime] = None

class TrendingLookResponse(TrendingLookBase):
    id: int
    source_site: str
    trend_score: float
    engagement_score: float
    crawled_at: datetime
    is_featured: bool
    
    class Config:
        from_attributes = True

class CrawlerStats(BaseModel):
    """Statistics from crawler runs"""
    total_looks_crawled: int
    new_looks_added: int
    updated_looks: int
    failed_crawls: int
    average_quality_score: float
    crawl_duration: float
    last_crawl_time: datetime

class TrendingFilters(BaseModel):
    """Filters for trending looks API"""
    category: Optional[str] = None
    season: Optional[str] = None
    tags: Optional[List[str]] = None
    min_trend_score: Optional[float] = 0.0
    limit: Optional[int] = 50
    offset: Optional[int] = 0
    sort_by: Optional[str] = 'trend_score'  # 'trend_score', 'crawled_at', 'engagement_score'
    sort_order: Optional[str] = 'desc'  # 'asc', 'desc'
