# Looklyy Fashion Crawler - Main Entry Point

import asyncio
import logging
import schedule
import time
from datetime import datetime
from typing import Dict, Any

from crawlers.crawler_manager import crawler_manager
from database.db_manager import db_manager
from config import get_config

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/crawler.log'),
        logging.StreamHandler()
    ]
)

logger = logging.getLogger("main")

async def run_daily_crawl():
    """Run the daily fashion trends crawl"""
    logger.info("Starting daily fashion crawl...")
    
    try:
        # Crawl all sites
        results = await crawler_manager.crawl_all_sites()
        
        # Update featured looks for home page
        await crawler_manager.update_featured_looks()
        
        logger.info(f"Daily crawl completed: {results}")
        
        return results
        
    except Exception as e:
        logger.error(f"Daily crawl failed: {e}")
        return None

async def run_quick_crawl():
    """Run a quick crawl of just trends sections"""
    logger.info("Starting quick trends crawl...")
    
    try:
        results = await crawler_manager.crawl_all_sites(['trends_path'])
        logger.info(f"Quick crawl completed: {results}")
        return results
        
    except Exception as e:
        logger.error(f"Quick crawl failed: {e}")
        return None

def schedule_crawls():
    """Schedule regular crawling jobs"""
    config = get_config()
    
    # Schedule daily full crawl at 6 AM
    schedule.every().day.at("06:00").do(lambda: asyncio.run(run_daily_crawl()))
    
    # Schedule quick trends crawl every 4 hours
    schedule.every(4).hours.do(lambda: asyncio.run(run_quick_crawl()))
    
    # Schedule trend score updates every hour
    schedule.every().hour.do(lambda: asyncio.run(db_manager.update_trend_scores()))
    
    logger.info("Crawl schedules configured")

async def initialize_database():
    """Initialize database with tables"""
    try:
        db_manager.create_tables()
        logger.info("Database initialized successfully")
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        raise

async def seed_initial_data():
    """Seed database with initial trending data"""
    logger.info("Seeding initial trending data...")
    
    try:
        # Run initial crawl to populate database
        results = await run_daily_crawl()
        
        if results and results['new_looks_added'] > 0:
            logger.info(f"Seeded {results['new_looks_added']} initial trending looks")
        else:
            logger.warning("No initial data was seeded")
            
    except Exception as e:
        logger.error(f"Failed to seed initial data: {e}")

def main():
    """Main entry point"""
    logger.info("Starting Looklyy Fashion Crawler System...")
    
    config = get_config()
    
    # Initialize database
    asyncio.run(initialize_database())
    
    # Seed initial data (optional)
    if config.DEBUG:
        asyncio.run(seed_initial_data())
    
    # Setup scheduled crawls
    schedule_crawls()
    
    logger.info("Crawler system running. Press Ctrl+C to stop.")
    
    # Keep the scheduler running
    try:
        while True:
            schedule.run_pending()
            time.sleep(60)  # Check every minute
            
    except KeyboardInterrupt:
        logger.info("Crawler system stopped by user")
    except Exception as e:
        logger.error(f"Crawler system error: {e}")

if __name__ == "__main__":
    main()
