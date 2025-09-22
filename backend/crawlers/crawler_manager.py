# Crawler Manager - Orchestrates all fashion site crawlers

import asyncio
import logging
from typing import List, Dict, Any
from datetime import datetime
import time

from .harpers_bazaar_crawler import HarpersBazaarCrawler
from .elle_crawler import ElleCrawler
from .vogue_crawler import VogueCrawler
from ..processors.content_processor import FashionContentProcessor
from ..database.db_manager import db_manager
from ..config import get_config

class FashionCrawlerManager:
    """Manages all fashion website crawlers"""
    
    def __init__(self):
        self.config = get_config()
        self.logger = logging.getLogger("crawler_manager")
        self.content_processor = FashionContentProcessor(
            self.config.LLM_CONFIG['openai_api_key']
        )
        
        # Initialize crawlers
        self.crawlers = {
            'harpers_bazaar': HarpersBazaarCrawler(self.config.FASHION_SITES['harpers_bazaar']),
            'elle': ElleCrawler(self.config.FASHION_SITES['elle']),
            'vogue': VogueCrawler(self.config.FASHION_SITES['vogue'])
        }
    
    async def crawl_all_sites(self, sections: List[str] = None) -> Dict[str, Any]:
        """Crawl all configured fashion sites"""
        if sections is None:
            sections = ['trends_path', 'runway_path', 'celebrity_path']
        
        start_time = time.time()
        crawl_results = {
            'total_looks_crawled': 0,
            'new_looks_added': 0,
            'updated_looks': 0,
            'failed_crawls': 0,
            'sites_crawled': [],
            'crawl_duration': 0,
            'errors': []
        }
        
        self.logger.info(f"Starting crawl of {len(self.crawlers)} sites")
        
        # Crawl each site
        for site_name, crawler in self.crawlers.items():
            try:
                site_results = await self.crawl_site(site_name, crawler, sections)
                
                # Aggregate results
                crawl_results['total_looks_crawled'] += site_results['looks_found']
                crawl_results['new_looks_added'] += site_results['new_looks']
                crawl_results['updated_looks'] += site_results['updated_looks']
                crawl_results['sites_crawled'].append(site_name)
                
            except Exception as e:
                error_msg = f"Failed to crawl {site_name}: {e}"
                self.logger.error(error_msg)
                crawl_results['failed_crawls'] += 1
                crawl_results['errors'].append(error_msg)
        
        crawl_results['crawl_duration'] = time.time() - start_time
        
        # Update trend scores after crawling
        await db_manager.update_trend_scores()
        
        self.logger.info(f"Crawl completed in {crawl_results['crawl_duration']:.2f}s")
        return crawl_results
    
    async def crawl_site(self, site_name: str, crawler, sections: List[str]) -> Dict[str, Any]:
        """Crawl a specific fashion site"""
        site_results = {
            'looks_found': 0,
            'new_looks': 0,
            'updated_looks': 0,
            'sections_crawled': []
        }
        
        async with crawler:
            for section in sections:
                try:
                    section_path = crawler.site_config.get(section)
                    if not section_path:
                        continue
                    
                    self.logger.info(f"Crawling {site_name} - {section}")
                    
                    # Crawl section
                    crawled_content = await crawler.crawl_section(section_path)
                    
                    # Process and save content
                    for content in crawled_content:
                        processed_content = await self.content_processor.process_content(content)
                        
                        # Save to database
                        look_id = await db_manager.save_trending_look(processed_content)
                        if look_id:
                            site_results['new_looks'] += 1
                        
                        site_results['looks_found'] += 1
                    
                    site_results['sections_crawled'].append(section)
                    
                except Exception as e:
                    self.logger.error(f"Error crawling {site_name} {section}: {e}")
        
        return site_results
    
    async def crawl_single_site(self, site_name: str, sections: List[str] = None) -> Dict[str, Any]:
        """Crawl a single fashion site"""
        if site_name not in self.crawlers:
            raise ValueError(f"Unknown site: {site_name}")
        
        if sections is None:
            sections = ['trends_path', 'runway_path']
        
        crawler = self.crawlers[site_name]
        return await self.crawl_site(site_name, crawler, sections)
    
    async def update_featured_looks(self):
        """Update which looks should be featured on home page"""
        try:
            # Get top trending looks
            filters = TrendingFilters(
                min_trend_score=0.7,
                limit=50,
                sort_by='trend_score',
                sort_order='desc'
            )
            
            top_looks = await db_manager.get_trending_looks(filters)
            
            # Mark top 25 as featured for home page
            featured_count = 0
            for look in top_looks:
                if featured_count < 25:
                    look.is_featured = True
                    featured_count += 1
                else:
                    look.is_featured = False
            
            self.logger.info(f"Updated {featured_count} looks as featured")
            
        except Exception as e:
            self.logger.error(f"Error updating featured looks: {e}")

# Global crawler manager instance
crawler_manager = FashionCrawlerManager()

# API Routes that use the crawler manager
@app.post("/admin/crawl")
async def trigger_manual_crawl(
    sites: List[str] = Query(['harpers_bazaar']),
    sections: List[str] = Query(['trends_path'])
):
    """Manually trigger crawl (admin endpoint)"""
    try:
        if len(sites) == 1:
            results = await crawler_manager.crawl_single_site(sites[0], sections)
        else:
            results = await crawler_manager.crawl_all_sites(sections)
        
        return {
            "status": "success",
            "results": results,
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Manual crawl failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/admin/update-featured")
async def update_featured_endpoint():
    """Update featured looks for home page"""
    try:
        await crawler_manager.update_featured_looks()
        return {"status": "success", "message": "Featured looks updated"}
        
    except Exception as e:
        logger.error(f"Failed to update featured looks: {e}")
        raise HTTPException(status_code=500, detail=str(e))
