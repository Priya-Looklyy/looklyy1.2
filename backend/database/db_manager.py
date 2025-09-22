# Database Manager for Looklyy Trending Content

import asyncio
from sqlalchemy import create_engine, desc, and_, or_
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from contextlib import asynccontextmanager
from typing import List, Optional, Dict, Any
import logging
from datetime import datetime, timedelta

from ..models.trend_model import Base, TrendingLook, TrendingFilters
from ..config import get_config

class TrendingLookDatabase:
    """Database manager for trending fashion looks"""
    
    def __init__(self):
        self.config = get_config()
        self.logger = logging.getLogger("database")
        
        # Database URL
        db_config = self.config.DATABASE_CONFIG['postgres']
        self.database_url = (
            f"postgresql://{db_config['user']}:{db_config['password']}"
            f"@{db_config['host']}:{db_config['port']}/{db_config['database']}"
        )
        
        # Async database URL
        self.async_database_url = self.database_url.replace('postgresql://', 'postgresql+asyncpg://')
        
        # Create engines
        self.engine = create_engine(self.database_url)
        self.async_engine = create_async_engine(self.async_database_url)
        
        # Session makers
        self.SessionLocal = sessionmaker(bind=self.engine)
        self.AsyncSessionLocal = async_sessionmaker(self.async_engine)
    
    def create_tables(self):
        """Create database tables"""
        Base.metadata.create_all(bind=self.engine)
        self.logger.info("Database tables created successfully")
    
    @asynccontextmanager
    async def get_async_session(self):
        """Get async database session"""
        async with self.AsyncSessionLocal() as session:
            try:
                yield session
                await session.commit()
            except Exception:
                await session.rollback()
                raise
            finally:
                await session.close()
    
    async def save_trending_look(self, look_data: Dict[str, Any]) -> Optional[int]:
        """Save a trending look to database"""
        try:
            async with self.get_async_session() as session:
                # Check if URL already exists
                existing = await session.execute(
                    select(TrendingLook).where(TrendingLook.source_url == look_data['source_url'])
                )
                existing_look = existing.scalar_one_or_none()
                
                if existing_look:
                    # Update existing look
                    for key, value in look_data.items():
                        if hasattr(existing_look, key):
                            setattr(existing_look, key, value)
                    existing_look.updated_at = datetime.now()
                    
                    await session.commit()
                    self.logger.info(f"Updated existing look: {existing_look.id}")
                    return existing_look.id
                else:
                    # Create new look
                    new_look = TrendingLook(**look_data)
                    session.add(new_look)
                    await session.flush()
                    
                    look_id = new_look.id
                    await session.commit()
                    self.logger.info(f"Saved new look: {look_id}")
                    return look_id
                    
        except Exception as e:
            self.logger.error(f"Error saving trending look: {e}")
            return None
    
    async def get_trending_looks(self, filters: TrendingFilters) -> List[TrendingLook]:
        """Get trending looks with filters"""
        try:
            async with self.get_async_session() as session:
                query = session.query(TrendingLook).filter(TrendingLook.is_active == True)
                
                # Apply filters
                if filters.category:
                    query = query.filter(TrendingLook.category == filters.category)
                
                if filters.season:
                    query = query.filter(TrendingLook.season == filters.season)
                
                if filters.tags:
                    # Check if any of the tags match
                    tag_conditions = [TrendingLook.tags.contains([tag]) for tag in filters.tags]
                    query = query.filter(or_(*tag_conditions))
                
                if filters.min_trend_score:
                    query = query.filter(TrendingLook.trend_score >= filters.min_trend_score)
                
                # Apply sorting
                if filters.sort_by == 'trend_score':
                    order_col = TrendingLook.trend_score
                elif filters.sort_by == 'crawled_at':
                    order_col = TrendingLook.crawled_at
                elif filters.sort_by == 'engagement_score':
                    order_col = TrendingLook.engagement_score
                else:
                    order_col = TrendingLook.trend_score
                
                if filters.sort_order == 'desc':
                    query = query.order_by(desc(order_col))
                else:
                    query = query.order_by(order_col)
                
                # Apply pagination
                query = query.offset(filters.offset).limit(filters.limit)
                
                results = await session.execute(query)
                return results.scalars().all()
                
        except Exception as e:
            self.logger.error(f"Error getting trending looks: {e}")
            return []
    
    async def get_featured_looks(self, limit: int = 25) -> List[TrendingLook]:
        """Get featured looks for home page sliders"""
        try:
            async with self.get_async_session() as session:
                query = (
                    session.query(TrendingLook)
                    .filter(and_(
                        TrendingLook.is_active == True,
                        TrendingLook.is_featured == True
                    ))
                    .order_by(desc(TrendingLook.trend_score))
                    .limit(limit)
                )
                
                results = await session.execute(query)
                return results.scalars().all()
                
        except Exception as e:
            self.logger.error(f"Error getting featured looks: {e}")
            return []
    
    async def update_trend_scores(self):
        """Recalculate trend scores based on age and engagement"""
        try:
            async with self.get_async_session() as session:
                # Get all active looks
                looks = await session.execute(
                    select(TrendingLook).where(TrendingLook.is_active == True)
                )
                
                for look in looks.scalars():
                    # Age decay factor
                    days_old = (datetime.now() - look.crawled_at).days
                    age_factor = max(0.1, 1.0 - (days_old * 0.02))  # 2% decay per day
                    
                    # Update trend score
                    look.trend_score = look.trend_score * age_factor
                    
                    # Mark as not featured if score too low
                    if look.trend_score < 0.3:
                        look.is_featured = False
                
                await session.commit()
                self.logger.info("Updated trend scores for all looks")
                
        except Exception as e:
            self.logger.error(f"Error updating trend scores: {e}")
    
    async def get_crawler_stats(self) -> Dict[str, Any]:
        """Get crawler statistics"""
        try:
            async with self.get_async_session() as session:
                total_looks = await session.execute(
                    select(func.count(TrendingLook.id))
                )
                
                recent_looks = await session.execute(
                    select(func.count(TrendingLook.id))
                    .where(TrendingLook.crawled_at >= datetime.now() - timedelta(days=1))
                )
                
                avg_score = await session.execute(
                    select(func.avg(TrendingLook.trend_score))
                    .where(TrendingLook.is_active == True)
                )
                
                return {
                    'total_looks': total_looks.scalar() or 0,
                    'recent_looks_24h': recent_looks.scalar() or 0,
                    'average_trend_score': round(avg_score.scalar() or 0.0, 2),
                    'last_update': datetime.now().isoformat()
                }
                
        except Exception as e:
            self.logger.error(f"Error getting stats: {e}")
            return {}

# Database instance
db_manager = TrendingLookDatabase()
