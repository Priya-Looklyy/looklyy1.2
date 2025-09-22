# Content Processing Layer with LLM Integration

import openai
import json
import re
from typing import Dict, List, Optional, Any
from datetime import datetime
import logging
from ..models.trend_model import CrawledContent

class FashionContentProcessor:
    """Process and enhance crawled fashion content using LLM"""
    
    def __init__(self, openai_api_key: str):
        self.logger = logging.getLogger("content_processor")
        openai.api_key = openai_api_key
        
    async def process_content(self, crawled_content: CrawledContent) -> Dict[str, Any]:
        """Process and enhance crawled content"""
        try:
            # Clean the raw content
            cleaned_content = self.clean_content(crawled_content)
            
            # Generate LLM enhancements
            enhanced_content = await self.enhance_with_llm(cleaned_content)
            
            # Extract fashion insights
            fashion_insights = self.extract_fashion_insights(enhanced_content)
            
            # Calculate final trend score
            final_score = self.calculate_enhanced_trend_score(enhanced_content, fashion_insights)
            
            return {
                **enhanced_content,
                'fashion_insights': fashion_insights,
                'final_trend_score': final_score,
                'processed_at': datetime.now().isoformat()
            }
            
        except Exception as e:
            self.logger.error(f"Error processing content: {e}")
            return crawled_content.__dict__
    
    def clean_content(self, content: CrawledContent) -> Dict[str, Any]:
        """Clean and normalize raw content"""
        # Remove ads, navigation, and irrelevant content
        cleaned_title = self.clean_text(content.title)
        cleaned_description = self.clean_text(content.description)
        
        # Normalize tags
        normalized_tags = [self.normalize_tag(tag) for tag in content.tags]
        normalized_tags = [tag for tag in normalized_tags if tag]  # Remove empty tags
        
        return {
            'title': cleaned_title,
            'description': cleaned_description,
            'primary_image_url': content.primary_image_url,
            'source_url': content.source_url,
            'source_site': content.source_site,
            'category': content.category,
            'tags': normalized_tags,
            'published_date': content.published_date,
            'additional_images': content.additional_images or [],
            'author': content.author,
            'original_trend_score': content.trend_score
        }
    
    def clean_text(self, text: str) -> str:
        """Clean and normalize text content"""
        if not text:
            return ""
        
        # Remove unwanted patterns
        patterns_to_remove = [
            r'\bAdvertisement\b',
            r'\bSponsor.*?\b',
            r'\bRead More\b',
            r'\bSubscribe\b',
            r'\bSign Up\b',
            r'Photo:.*?Getty Images',
            r'Image:.*?Courtesy',
        ]
        
        cleaned = text
        for pattern in patterns_to_remove:
            cleaned = re.sub(pattern, '', cleaned, flags=re.IGNORECASE)
        
        # Normalize whitespace
        cleaned = re.sub(r'\s+', ' ', cleaned).strip()
        
        return cleaned
    
    def normalize_tag(self, tag: str) -> str:
        """Normalize tag format"""
        if not tag:
            return ""
        
        # Convert to lowercase, remove special chars
        normalized = re.sub(r'[^a-zA-Z0-9\s]', '', tag.lower())
        normalized = re.sub(r'\s+', '_', normalized.strip())
        
        return normalized if len(normalized) > 2 else ""
    
    async def enhance_with_llm(self, content: Dict[str, Any]) -> Dict[str, Any]:
        """Use LLM to enhance and categorize content"""
        try:
            prompt = self.create_enhancement_prompt(content)
            
            response = await openai.ChatCompletion.acreate(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a fashion expert and trend analyst. Analyze fashion content and provide structured insights."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=500,
                temperature=0.3
            )
            
            llm_response = response.choices[0].message.content
            enhancements = self.parse_llm_response(llm_response)
            
            # Merge LLM enhancements with original content
            enhanced = {**content, **enhancements}
            
            return enhanced
            
        except Exception as e:
            self.logger.error(f"LLM enhancement failed: {e}")
            return content  # Return original if LLM fails
    
    def create_enhancement_prompt(self, content: Dict[str, Any]) -> str:
        """Create prompt for LLM enhancement"""
        return f"""
        Analyze this fashion content and provide structured insights:
        
        Title: {content['title']}
        Description: {content['description'][:500]}...
        Category: {content['category']}
        Tags: {', '.join(content['tags'])}
        
        Please provide a JSON response with:
        1. "enhanced_summary": A concise 2-3 sentence summary highlighting key fashion trends
        2. "trend_keywords": 5-8 specific fashion keywords/trends mentioned
        3. "style_category": Primary style category (minimalist, bohemian, luxury, streetwear, etc.)
        4. "season_relevance": Current season relevance (fall2025, spring2025, etc.)
        5. "target_audience": Who this trend appeals to (gen-z, millennials, luxury-shoppers, etc.)
        6. "trend_strength": Confidence score 0.0-1.0 for how trending this content is
        
        Focus on extracting actionable fashion insights for a Pinterest-style fashion discovery app.
        """
    
    def parse_llm_response(self, response: str) -> Dict[str, Any]:
        """Parse LLM JSON response"""
        try:
            # Extract JSON from response
            json_match = re.search(r'\{.*\}', response, re.DOTALL)
            if json_match:
                return json.loads(json_match.group())
            else:
                # Fallback parsing if no JSON found
                return self.fallback_parse(response)
                
        except json.JSONDecodeError:
            return self.fallback_parse(response)
    
    def fallback_parse(self, response: str) -> Dict[str, Any]:
        """Fallback parsing if JSON parsing fails"""
        return {
            'enhanced_summary': response[:200] + "..." if len(response) > 200 else response,
            'trend_keywords': [],
            'style_category': 'general',
            'season_relevance': 'year_round',
            'target_audience': 'general',
            'trend_strength': 0.5
        }
    
    def extract_fashion_insights(self, content: Dict[str, Any]) -> Dict[str, Any]:
        """Extract additional fashion-specific insights"""
        insights = {
            'color_palette': self.extract_colors(content),
            'price_range': self.estimate_price_range(content),
            'style_complexity': self.assess_style_complexity(content),
            'versatility_score': self.calculate_versatility(content),
            'seasonality': self.determine_seasonality(content)
        }
        
        return insights
    
    def extract_colors(self, content: Dict[str, Any]) -> List[str]:
        """Extract color mentions from content"""
        text = (content.get('title', '') + ' ' + content.get('description', '')).lower()
        
        colors = [
            'black', 'white', 'red', 'blue', 'green', 'yellow', 'purple', 'pink',
            'orange', 'brown', 'gray', 'grey', 'navy', 'burgundy', 'emerald',
            'coral', 'mint', 'lavender', 'gold', 'silver', 'rose', 'cream',
            'beige', 'tan', 'olive', 'maroon', 'teal', 'turquoise'
        ]
        
        found_colors = [color for color in colors if color in text]
        return found_colors[:5]  # Limit to 5 colors
    
    def estimate_price_range(self, content: Dict[str, Any]) -> str:
        """Estimate price range based on content indicators"""
        text = (content.get('title', '') + ' ' + content.get('description', '')).lower()
        
        luxury_indicators = ['designer', 'couture', 'luxury', 'high-end', 'premium']
        budget_indicators = ['affordable', 'budget', 'under', 'cheap', 'sale']
        
        if any(indicator in text for indicator in luxury_indicators):
            return 'luxury'
        elif any(indicator in text for indicator in budget_indicators):
            return 'budget'
        else:
            return 'mid_range'
    
    def assess_style_complexity(self, content: Dict[str, Any]) -> str:
        """Assess how complex the styling is"""
        text = (content.get('title', '') + ' ' + content.get('description', '')).lower()
        
        complex_indicators = ['layering', 'statement', 'bold', 'dramatic', 'avant-garde']
        simple_indicators = ['minimal', 'clean', 'simple', 'basic', 'effortless']
        
        if any(indicator in text for indicator in complex_indicators):
            return 'complex'
        elif any(indicator in text for indicator in simple_indicators):
            return 'simple'
        else:
            return 'moderate'
    
    def calculate_versatility(self, content: Dict[str, Any]) -> float:
        """Calculate how versatile the look is (0.0-1.0)"""
        text = (content.get('title', '') + ' ' + content.get('description', '')).lower()
        
        versatile_keywords = ['versatile', 'day-to-night', 'office', 'casual', 'dress-up', 'mix-match']
        specific_keywords = ['formal', 'evening', 'gala', 'red-carpet', 'wedding']
        
        versatile_count = sum(1 for keyword in versatile_keywords if keyword in text)
        specific_count = sum(1 for keyword in specific_keywords if keyword in text)
        
        if versatile_count > specific_count:
            return min(1.0, 0.7 + (versatile_count * 0.1))
        else:
            return max(0.3, 0.7 - (specific_count * 0.1))
    
    def determine_seasonality(self, content: Dict[str, Any]) -> str:
        """Determine seasonal relevance"""
        text = (content.get('title', '') + ' ' + content.get('description', '')).lower()
        
        seasonal_keywords = {
            'fall': ['fall', 'autumn', 'september', 'october', 'november', 'cozy', 'layers'],
            'winter': ['winter', 'december', 'january', 'february', 'coat', 'warm'],
            'spring': ['spring', 'march', 'april', 'may', 'fresh', 'light'],
            'summer': ['summer', 'june', 'july', 'august', 'beach', 'vacation']
        }
        
        season_scores = {}
        for season, keywords in seasonal_keywords.items():
            score = sum(1 for keyword in keywords if keyword in text)
            if score > 0:
                season_scores[season] = score
        
        if season_scores:
            return max(season_scores, key=season_scores.get) + '2025'
        else:
            return 'year_round'
    
    def calculate_enhanced_trend_score(self, content: Dict[str, Any], insights: Dict[str, Any]) -> float:
        """Calculate final trend score with LLM insights"""
        base_score = content.get('original_trend_score', 0.5)
        
        # LLM trend strength boost
        llm_strength = content.get('trend_strength', 0.5)
        
        # Versatility boost
        versatility = insights.get('versatility_score', 0.5)
        
        # Recency boost
        recency_boost = 0.0
        if content.get('published_date'):
            days_old = (datetime.now() - content['published_date']).days
            recency_boost = max(0, 0.2 - (days_old * 0.01))
        
        # Calculate weighted final score
        final_score = (
            base_score * 0.4 +
            llm_strength * 0.3 +
            versatility * 0.2 +
            recency_boost * 0.1
        )
        
        return min(1.0, final_score)
