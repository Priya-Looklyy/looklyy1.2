# Harper's Bazaar Specific Crawler

import re
from typing import List, Optional
from bs4 import BeautifulSoup
from datetime import datetime
from .base_crawler import BaseFashionCrawler, CrawledContent

class HarpersBazaarCrawler(BaseFashionCrawler):
    """Specialized crawler for Harper's Bazaar fashion content"""
    
    def __init__(self, site_config):
        super().__init__(site_config)
        self.site_name = 'harpers_bazaar'
    
    async def extract_article_links(self, soup: BeautifulSoup, base_url: str) -> List[str]:
        """Extract article links from Harper's Bazaar listing pages"""
        links = []
        
        # Harper's Bazaar specific selectors
        article_selectors = [
            'article h2 a',
            'article h3 a', 
            '.listicle-item a',
            '.card-headline a',
            '.story-item a',
            'a[href*="/fashion/"]',
            'a[href*="/style/"]',
            'a[href*="/runway/"]'
        ]
        
        for selector in article_selectors:
            for link_elem in soup.select(selector):
                href = link_elem.get('href')
                if href:
                    # Convert relative URLs
                    if href.startswith('/'):
                        full_url = base_url + href
                    elif href.startswith('http'):
                        full_url = href
                    else:
                        continue
                    
                    # Filter for fashion-related content
                    if self.is_fashion_content(full_url):
                        links.append(full_url)
        
        return list(set(links))  # Remove duplicates
    
    def is_fashion_content(self, url: str) -> bool:
        """Check if URL contains fashion-related content"""
        fashion_keywords = [
            '/fashion/', '/style/', '/runway/', '/trends/', 
            '/celebrity-style/', '/street-style/', '/beauty/',
            'fashion-week', 'designer', 'outfit', 'look'
        ]
        return any(keyword in url.lower() for keyword in fashion_keywords)
    
    async def parse_article(self, soup: BeautifulSoup, url: str) -> Optional[CrawledContent]:
        """Parse individual Harper's Bazaar article"""
        try:
            # Extract title
            title_elem = soup.select_one('h1, .headline, .article-title, .story-headline')
            title = title_elem.get_text(strip=True) if title_elem else "Untitled"
            
            # Extract description/summary
            desc_selectors = [
                '.article-dek', '.story-dek', '.article-summary',
                '.lead-paragraph', 'p.lead', '.intro-text'
            ]
            description = ""
            for selector in desc_selectors:
                desc_elem = soup.select_one(selector)
                if desc_elem:
                    description = desc_elem.get_text(strip=True)
                    break
            
            # Extract main image
            image_selectors = [
                '.hero-image img', '.featured-image img', 
                '.article-hero img', '.story-image img',
                'img[data-src]', 'img[src]'
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
                return None  # Skip articles without quality images
            
            # Extract additional images
            additional_images = self.extract_high_quality_images(soup, self.base_url)
            additional_images = [img for img in additional_images if img != primary_image]
            
            # Extract author
            author_elem = soup.select_one('.byline, .author, .story-byline, [rel="author"]')
            author = author_elem.get_text(strip=True) if author_elem else None
            
            # Extract publish date
            date_elem = soup.select_one('time, .publish-date, .story-date, [datetime]')
            published_date = None
            if date_elem:
                date_str = date_elem.get('datetime') or date_elem.get_text(strip=True)
                published_date = self.parse_date(date_str)
            
            # Determine category based on URL and content
            category = self.categorize_content(url, title, description)
            
            # Extract tags
            tags = self.extract_tags(soup, title, description)
            
            return CrawledContent(
                title=title,
                description=description,
                primary_image_url=primary_image,
                source_url=url,
                source_site=self.site_name,
                category=category,
                tags=tags,
                published_date=published_date,
                additional_images=additional_images[:5],  # Limit to 5 additional images
                author=author
            )
            
        except Exception as e:
            self.logger.error(f"Error parsing article {url}: {e}")
            return None
    
    def categorize_content(self, url: str, title: str, description: str) -> str:
        """Categorize content based on URL and text analysis"""
        url_lower = url.lower()
        text_content = (title + " " + description).lower()
        
        if 'runway' in url_lower or 'fashion-week' in text_content:
            return 'runway_fashion'
        elif 'celebrity' in url_lower or 'red-carpet' in text_content:
            return 'celebrity_style'
        elif 'street-style' in url_lower or 'street style' in text_content:
            return 'street_style'
        elif 'sustainable' in text_content or 'eco-fashion' in text_content:
            return 'sustainable_fashion'
        elif 'vintage' in text_content or 'retro' in text_content:
            return 'vintage_revival'
        elif 'minimalist' in text_content or 'minimal' in text_content:
            return 'minimalist_chic'
        elif 'business' in text_content or 'work' in text_content:
            return 'power_dressing'
        else:
            return 'seasonal_trends'  # Default category
    
    def extract_tags(self, soup: BeautifulSoup, title: str, description: str) -> List[str]:
        """Extract relevant tags from content"""
        tags = []
        
        # Look for explicit tags
        tag_selectors = ['.tags a', '.categories a', '.keywords', '[rel="tag"]']
        for selector in tag_selectors:
            for tag_elem in soup.select(selector):
                tag_text = tag_elem.get_text(strip=True).lower()
                if tag_text and len(tag_text) < 30:  # Reasonable tag length
                    tags.append(tag_text)
        
        # Extract implicit tags from content
        text_content = (title + " " + description).lower()
        fashion_keywords = [
            'fall2025', 'spring2025', 'summer2025', 'winter2025',
            'designer', 'luxury', 'affordable', 'trendy', 'classic',
            'bohemian', 'gothic', 'preppy', 'casual', 'formal',
            'blazer', 'dress', 'pants', 'skirt', 'jacket', 'shoes',
            'accessories', 'jewelry', 'handbag', 'sunglasses'
        ]
        
        for keyword in fashion_keywords:
            if keyword in text_content:
                tags.append(keyword)
        
        return list(set(tags))[:10]  # Limit to 10 most relevant tags
    
    def parse_date(self, date_str: str) -> Optional[datetime]:
        """Parse various date formats"""
        if not date_str:
            return None
            
        try:
            # Common date formats
            date_formats = [
                '%Y-%m-%dT%H:%M:%S',
                '%Y-%m-%d %H:%M:%S',
                '%Y-%m-%d',
                '%B %d, %Y',
                '%b %d, %Y',
                '%m/%d/%Y'
            ]
            
            for fmt in date_formats:
                try:
                    return datetime.strptime(date_str[:len(fmt)], fmt)
                except ValueError:
                    continue
                    
        except Exception as e:
            self.logger.warning(f"Could not parse date '{date_str}': {e}")
        
        return None
