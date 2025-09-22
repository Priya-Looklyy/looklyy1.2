# Vogue Magazine Crawler

from typing import List, Optional
from bs4 import BeautifulSoup
from .base_crawler import BaseFashionCrawler, CrawledContent

class VogueCrawler(BaseFashionCrawler):
    """Specialized crawler for Vogue magazine"""
    
    def __init__(self, site_config):
        super().__init__(site_config)
        self.site_name = 'vogue'
        self.delay = 3.0  # Vogue might be more strict, use longer delays
    
    async def extract_article_links(self, soup: BeautifulSoup, base_url: str) -> List[str]:
        """Extract article links from Vogue listing pages"""
        links = []
        
        # Vogue-specific selectors
        article_selectors = [
            '.summary-item__hed-link',
            '.card__link',
            '.river-item a',
            'a[href*="/article/"]',
            'a[href*="/fashion/"]',
            'a[href*="/runway/"]',
            '.gallery-slide a',
            '.story-item a'
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
        """Parse individual Vogue article"""
        try:
            # Vogue title extraction
            title_selectors = [
                'h1[data-testid="ContentHeaderHed"]',
                '.content-header__hed',
                '.article__header h1',
                'h1.hed'
            ]
            
            title = ""
            for selector in title_selectors:
                title_elem = soup.select_one(selector)
                if title_elem:
                    title = title_elem.get_text(strip=True)
                    break
            
            # Vogue description
            desc_selectors = [
                '[data-testid="ContentHeaderDek"]',
                '.content-header__dek',
                '.article__dek',
                '.dek'
            ]
            
            description = ""
            for selector in desc_selectors:
                desc_elem = soup.select_one(selector)
                if desc_elem:
                    description = desc_elem.get_text(strip=True)
                    break
            
            # Vogue image extraction
            image_selectors = [
                '.lede-image img',
                '.content-header-image img',
                '.hero-image img',
                'img[data-src*="vogue"]',
                '.article-hero img'
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
            
            if not primary_image or not title:
                return None
            
            # Vogue author extraction
            author_selectors = [
                '[data-testid="ContentHeaderByline"] a',
                '.byline__name',
                '.content-header__byline'
            ]
            
            author = None
            for selector in author_selectors:
                author_elem = soup.select_one(selector)
                if author_elem:
                    author = author_elem.get_text(strip=True)
                    break
            
            # Date extraction
            date_elem = soup.select_one('time[datetime], [data-testid="ContentHeaderPublishDate"]')
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
            self.logger.error(f"Error parsing Vogue article {url}: {e}")
            return None
