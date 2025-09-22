# Looklyy Crawler Configuration

import os
from typing import List, Dict
from dataclasses import dataclass

@dataclass
class CrawlerConfig:
    """Configuration for fashion website crawlers"""
    
    # Target Fashion Websites
    FASHION_SITES = {
        'harpers_bazaar': {
            'base_url': 'https://www.harpersbazaar.com',
            'trends_path': '/fashion/trends/',
            'runway_path': '/fashion/runway/',
            'celebrity_path': '/celebrity/style/',
            'crawl_depth': 3,
            'delay': 2.0,  # seconds between requests
        },
        'elle': {
            'base_url': 'https://www.elle.com',
            'trends_path': '/fashion/trends/',
            'runway_path': '/fashion/runway/',
            'celebrity_path': '/fashion/celebrity-style/',
            'crawl_depth': 3,
            'delay': 2.5,
        },
        'vogue': {
            'base_url': 'https://www.vogue.com',
            'trends_path': '/fashion/trends/',
            'runway_path': '/fashion/runway/',
            'celebrity_path': '/fashion/celebrity-style/',
            'crawl_depth': 2,
            'delay': 3.0,  # Vogue might be more strict
        }
    }
    
    # Content Categories
    TREND_CATEGORIES = [
        'runway_fashion',
        'celebrity_style',
        'street_style',
        'seasonal_trends',
        'sustainable_fashion',
        'vintage_revival',
        'power_dressing',
        'minimalist_chic'
    ]
    
    # Image Quality Requirements
    IMAGE_REQUIREMENTS = {
        'min_width': 400,
        'min_height': 600,
        'max_file_size': 5 * 1024 * 1024,  # 5MB
        'formats': ['jpg', 'jpeg', 'png', 'webp'],
        'quality_threshold': 0.7  # Image quality score
    }
    
    # Database Configuration
    DATABASE_CONFIG = {
        'postgres': {
            'host': os.getenv('DB_HOST', 'localhost'),
            'port': os.getenv('DB_PORT', 5432),
            'database': os.getenv('DB_NAME', 'looklyy_trends'),
            'user': os.getenv('DB_USER', 'looklyy'),
            'password': os.getenv('DB_PASSWORD', '')
        }
    }
    
    # API Configuration
    API_CONFIG = {
        'host': '0.0.0.0',
        'port': 8000,
        'cors_origins': ['http://localhost:3000'],  # React app
        'rate_limit': '100/minute'
    }
    
    # LLM Configuration
    LLM_CONFIG = {
        'openai_api_key': os.getenv('OPENAI_API_KEY'),
        'model': 'gpt-4',
        'max_tokens': 500,
        'temperature': 0.3
    }
    
    # Ethical Crawling Rules
    ETHICAL_RULES = {
        'respect_robots_txt': True,
        'max_concurrent_requests': 3,
        'user_agent': 'LooklyyCrawler/1.0 (+https://looklyy.com/about)',
        'cache_duration': 3600,  # 1 hour cache
        'retry_attempts': 3,
        'backoff_factor': 2.0
    }

# Environment-specific configurations
class DevelopmentConfig(CrawlerConfig):
    DEBUG = True
    LOG_LEVEL = 'DEBUG'

class ProductionConfig(CrawlerConfig):
    DEBUG = False
    LOG_LEVEL = 'INFO'

# Get configuration based on environment
def get_config():
    env = os.getenv('ENVIRONMENT', 'development').lower()
    if env == 'production':
        return ProductionConfig()
    return DevelopmentConfig()
