# Elle Magazine Crawler (JS-heavy site)

from typing import List, Optional
from bs4 import BeautifulSoup
from playwright.async_api import async_playwright
import asyncio
from .base_crawler import BaseFashionCrawler, CrawledContent

class ElleCrawler(BaseFashionCrawler):
    """Specialized crawler for Elle magazine (handles JS-heavy content)"""
    
    def __init__(self, site_config):
        super().__init__(site_config)
        self.site_name = 'elle'
        self.use_playwright = True  # Elle uses lazy loading
    
    async def fetch_page_with_js(self, url: str) -> Optional[str]:
        """Fetch page using Playwright for JS-rendered content"""
        try:
            async with async_playwright() as p:
                browser = await p.chromium.launch(headless=True)
                page = await browser.new_page()
                
                # Set user agent
                await page.set_extra_http_headers({
                    'User-Agent': 'LooklyyCrawler/1.0 (+https://looklyy.com/about)'
                })
                
                # Navigate and wait for content
                await page.goto(url, wait_until='networkidle')
                
                # Scroll to load lazy-loaded images
                await page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
                await asyncio.sleep(2)
                
                content = await page.content()
                await browser.close()
                
                self.logger.info(f"Successfully fetched JS content: {url}")
                return content
                
        except Exception as e:
            self.logger.error(f"Playwright error for {url}: {e}")
            return None
    
    async def extract_article_links(self, soup: BeautifulSoup, base_url: str) -> List[str]:
        """Extract article links from Elle listing pages"""
        links = []
        
        # Elle-specific selectors
        article_selectors = [
            '.card-media a',
            '.story-item a',
            '.article-link',
            'a[href*="/fashion/"]',
            'a[href*="/style/"]',
            'a[href*="/trends/"]',
            '.listicle-slide a',
            '.gallery-item a'
        ]
        
        for selector in article_selectors:
            for link_elem in soup.select(selector):
                href = link_elem.get('href')
                if href and self.is_fashion_content(href):
                    if href.startswith('/'):
                        full_url = base_url + href
                    else:
                        full_url = href
                    links.append(full_url)
        
        return list(set(links))
    
    async def parse_article(self, soup: BeautifulSoup, url: str) -> Optional[CrawledContent]:
        """Parse individual Elle article"""
        try:
            # Title extraction (Elle-specific)
            title_selectors = [
                'h1.content-hed',
                '.article-header h1',
                '.story-hed',
                'h1'
            ]
            
            title = ""
            for selector in title_selectors:
                title_elem = soup.select_one(selector)
                if title_elem:
                    title = title_elem.get_text(strip=True)
                    break
            
            if not title:
                return None
            
            # Description extraction
            desc_selectors = [
                '.content-dek',
                '.article-dek',
                '.story-dek',
                '.lead-paragraph p',
                '.article-body p:first-child'
            ]
            
            description = ""
            for selector in desc_selectors:
                desc_elem = soup.select_one(selector)
                if desc_elem:
                    description = desc_elem.get_text(strip=True)
                    break
            
            # Primary image extraction (Elle uses specific classes)
            image_selectors = [
                '.content-lede-image img',
                '.hero-image img',
                '.article-hero img',
                '.story-image img',
                'img[data-src*="elle"]'
            ]
            
            primary_image = None
            for selector in image_selectors:
                img_elem = soup.select_one(selector)
                if img_elem:
                    img_src = img_elem.get('data-src') or img_elem.get('src')
                    if img_src and self.is_magazine_quality_image(img_src, img_elem):
                        if img_src.startswith('//'):
                            primary_image = 'https:' + img_src
                        elif img_src.startswith('/'):
                            primary_image = self.base_url + img_src
                        else:
                            primary_image = img_src
                        break
            
            if not primary_image:
                return None
            
            # Extract author
            author_selectors = ['.byline-name', '.author-name', '.story-byline']
            author = None
            for selector in author_selectors:
                author_elem = soup.select_one(selector)
                if author_elem:
                    author = author_elem.get_text(strip=True)
                    break
            
            # Extract publish date
            date_elem = soup.select_one('time[datetime], .publish-date, .story-date')
            published_date = None
            if date_elem:
                date_str = date_elem.get('datetime') or date_elem.get_text(strip=True)
                published_date = self.parse_date(date_str)
            
            # Category and tags
            category = self.categorize_content(url, title, description)
            tags = self.extract_tags(soup, title, description)
            
            # Additional images
            additional_images = self.extract_high_quality_images(soup, self.base_url)
            additional_images = [img for img in additional_images if img != primary_image]
            
            return CrawledContent(
                title=title,
                description=description,
                primary_image_url=primary_image,
                source_url=url,
                source_site=self.site_name,
                category=category,
                tags=tags,
                published_date=published_date,
                additional_images=additional_images[:5],
                author=author
            )
            
        except Exception as e:
            self.logger.error(f"Error parsing Elle article {url}: {e}")
            return None
    
    async def crawl_section(self, section_path: str) -> List[CrawledContent]:
        """Override to use Playwright for JS-heavy Elle content"""
        if not await self.check_robots_txt():
            self.logger.error(f"Crawling not allowed by robots.txt for {self.base_url}")
            return []
        
        section_url = self.base_url + section_path
        self.logger.info(f"Starting JS-aware crawl of {section_url}")
        
        # Use Playwright for section page
        html = await self.fetch_page_with_js(section_url)
        if not html:
            return []
        
        soup = self.parse_html(html, section_url)
        article_links = await self.extract_article_links(soup, self.base_url)
        
        self.logger.info(f"Found {len(article_links)} Elle articles")
        
        # Crawl individual articles
        crawled_content = []
        for link in article_links[:self.crawl_depth]:
            try:
                # Use Playwright for article pages too (lazy loading)
                article_html = await self.fetch_page_with_js(link)
                if article_html:
                    article_soup = self.parse_html(article_html, link)
                    content = await self.parse_article(article_soup, link)
                    if content:
                        content.trend_score = self.calculate_trend_score(content.__dict__)
                        crawled_content.append(content)
                        
            except Exception as e:
                self.logger.error(f"Error crawling Elle article {link}: {e}")
                continue
        
        return crawled_content
