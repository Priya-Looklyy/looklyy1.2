# Base Crawler Class for Fashion Websites

import asyncio
import aiohttp
import time
import logging
from abc import ABC, abstractmethod
from typing import List, Dict, Optional, Any
from urllib.robotparser import RobotFileParser
from urllib.parse import urljoin, urlparse
from bs4 import BeautifulSoup
from dataclasses import dataclass
from datetime import datetime

@dataclass
class CrawledContent:
    """Standardized content structure from any fashion site"""
    title: str
    description: str
    primary_image_url: str
    source_url: str
    source_site: str
    category: str
    tags: List[str]
    published_date: Optional[datetime] = None
    additional_images: List[str] = None
    author: Optional[str] = None
    trend_score: float = 0.0

class BaseFashionCrawler(ABC):
    """Abstract base class for all fashion website crawlers"""
    
    def __init__(self, site_config: Dict[str, Any]):
        self.site_config = site_config
        self.base_url = site_config['base_url']
        self.delay = site_config.get('delay', 2.0)
        self.crawl_depth = site_config.get('crawl_depth', 3)
        self.session = None
        self.logger = logging.getLogger(f"crawler.{self.__class__.__name__}")
        
    async def __aenter__(self):
        """Async context manager entry"""
        self.session = aiohttp.ClientSession(
            timeout=aiohttp.ClientTimeout(total=30),
            headers={'User-Agent': 'LooklyyCrawler/1.0 (+https://looklyy.com/about)'}
        )
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit"""
        if self.session:
            await self.session.close()
    
    async def check_robots_txt(self) -> bool:
        """Check if crawling is allowed by robots.txt"""
        try:
            robots_url = urljoin(self.base_url, '/robots.txt')
            rp = RobotFileParser()
            rp.set_url(robots_url)
            rp.read()
            
            user_agent = 'LooklyyCrawler'
            return rp.can_fetch(user_agent, self.base_url)
        except Exception as e:
            self.logger.warning(f"Could not check robots.txt: {e}")
            return True  # Assume allowed if can't check
    
    async def fetch_page(self, url: str) -> Optional[str]:
        """Fetch a single page with error handling and throttling"""
        try:
            # Respect rate limiting
            await asyncio.sleep(self.delay)
            
            async with self.session.get(url) as response:
                if response.status == 200:
                    content = await response.text()
                    self.logger.info(f"Successfully fetched: {url}")
                    return content
                else:
                    self.logger.warning(f"Failed to fetch {url}: Status {response.status}")
                    return None
                    
        except Exception as e:
            self.logger.error(f"Error fetching {url}: {e}")
            return None
    
    def parse_html(self, html: str, url: str) -> BeautifulSoup:
        """Parse HTML content"""
        return BeautifulSoup(html, 'lxml')
    
    def extract_high_quality_images(self, soup: BeautifulSoup, base_url: str) -> List[str]:
        """Extract high-quality fashion images from page"""
        images = []
        
        # Look for common fashion image patterns
        image_selectors = [
            'img[src*="fashion"]',
            'img[src*="runway"]',
            'img[src*="style"]',
            'img[alt*="fashion"]',
            'img[alt*="style"]',
            '.hero-image img',
            '.featured-image img',
            '.gallery img',
            'article img',
            '.content img'
        ]
        
        for selector in image_selectors:
            for img in soup.select(selector):
                img_url = img.get('src') or img.get('data-src')
                if img_url:
                    # Convert relative URLs to absolute
                    if img_url.startswith('//'):
                        img_url = 'https:' + img_url
                    elif img_url.startswith('/'):
                        img_url = urljoin(base_url, img_url)
                    
                    # Filter for magazine-quality images
                    if self.is_magazine_quality_image(img_url, img):
                        images.append(img_url)
        
        return list(set(images))  # Remove duplicates
    
    def is_magazine_quality_image(self, img_url: str, img_tag) -> bool:
        """Determine if image meets magazine quality standards"""
        # Check URL patterns for high-quality images
        quality_indicators = [
            'high-res', 'hero', 'featured', 'gallery', 'runway',
            'editorial', 'campaign', 'lookbook'
        ]
        
        # Check image dimensions if available
        width = img_tag.get('width')
        height = img_tag.get('height')
        
        if width and height:
            try:
                w, h = int(width), int(height)
                if w < 400 or h < 600:  # Minimum magazine quality
                    return False
            except ValueError:
                pass
        
        # Check URL for quality indicators
        img_url_lower = img_url.lower()
        return any(indicator in img_url_lower for indicator in quality_indicators)
    
    def calculate_trend_score(self, content: Dict[str, Any]) -> float:
        """Calculate trending score based on various factors"""
        score = 0.0
        
        # Recency boost (newer content scores higher)
        if content.get('published_date'):
            days_old = (datetime.now() - content['published_date']).days
            recency_score = max(0, 1.0 - (days_old / 30))  # Decay over 30 days
            score += recency_score * 0.3
        
        # Source authority (Harper's Bazaar > Elle > Others)
        source_weights = {
            'harpers_bazaar': 1.0,
            'vogue': 0.95,
            'elle': 0.9,
            'default': 0.7
        }
        source_score = source_weights.get(content.get('source_site', ''), 0.7)
        score += source_score * 0.4
        
        # Content quality (title length, description richness)
        title_score = min(1.0, len(content.get('title', '')) / 100)
        desc_score = min(1.0, len(content.get('description', '')) / 500)
        score += (title_score + desc_score) * 0.2
        
        # Image quality
        if content.get('image_quality_score'):
            score += content['image_quality_score'] * 0.1
        
        return min(1.0, score)
    
    @abstractmethod
    async def extract_article_links(self, soup: BeautifulSoup, base_url: str) -> List[str]:
        """Extract article links from listing page - implement per site"""
        pass
    
    @abstractmethod
    async def parse_article(self, soup: BeautifulSoup, url: str) -> Optional[CrawledContent]:
        """Parse individual article - implement per site"""
        pass
    
    async def crawl_section(self, section_path: str) -> List[CrawledContent]:
        """Crawl a specific section (trends, runway, etc.)"""
        if not await self.check_robots_txt():
            self.logger.error(f"Crawling not allowed by robots.txt for {self.base_url}")
            return []
        
        section_url = urljoin(self.base_url, section_path)
        self.logger.info(f"Starting crawl of {section_url}")
        
        # Get section page
        html = await self.fetch_page(section_url)
        if not html:
            return []
        
        soup = self.parse_html(html, section_url)
        
        # Extract article links
        article_links = await self.extract_article_links(soup, self.base_url)
        self.logger.info(f"Found {len(article_links)} articles to crawl")
        
        # Crawl individual articles
        crawled_content = []
        for link in article_links[:self.crawl_depth]:  # Respect crawl depth
            try:
                article_html = await self.fetch_page(link)
                if article_html:
                    article_soup = self.parse_html(article_html, link)
                    content = await self.parse_article(article_soup, link)
                    if content:
                        content.trend_score = self.calculate_trend_score(content.__dict__)
                        crawled_content.append(content)
                        
            except Exception as e:
                self.logger.error(f"Error crawling article {link}: {e}")
                continue
        
        self.logger.info(f"Successfully crawled {len(crawled_content)} articles")
        return crawled_content
