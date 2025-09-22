# Looklyy Fashion Crawler Backend

A comprehensive crawler system for extracting trending fashion content from major fashion magazines and websites.

## 🏗️ Architecture

### 1. **Crawler/Scraper Layer**
- **Base Crawler**: Abstract class with common functionality
- **Site-Specific Crawlers**: Harper's Bazaar, Elle, Vogue
- **Ethical Crawling**: robots.txt compliance, rate limiting
- **Quality Filtering**: Magazine-quality image detection

### 2. **Content Processing Layer**
- **Text Cleaning**: Remove ads, normalize content
- **LLM Enhancement**: GPT-4 powered trend analysis
- **Categorization**: Auto-categorize fashion content
- **Trend Scoring**: Algorithm-based trending scores

### 3. **Storage Layer**
- **PostgreSQL Database**: Structured trend data storage
- **SQLAlchemy ORM**: Type-safe database operations
- **Async Support**: High-performance async operations

### 4. **API Layer**
- **FastAPI**: Modern, fast API framework
- **RESTful Endpoints**: Clean API design
- **CORS Support**: React frontend integration
- **Rate Limiting**: API protection

## 🚀 Quick Start

### Installation
```bash
cd backend
pip install -r requirements.txt
```

### Environment Setup
```bash
# Create .env file
cp .env.example .env

# Add your API keys
OPENAI_API_KEY=your_openai_key_here
DB_PASSWORD=your_db_password
```

### Database Setup
```bash
# Install PostgreSQL
# Create database: looklyy_trends

# Run migrations
python -c "from database.db_manager import db_manager; db_manager.create_tables()"
```

### Run Crawler
```bash
# Start the crawler system
python main.py

# Or run API server only
uvicorn api.trending_api:app --reload --port 8000
```

## 📊 API Endpoints

### Get Trending Looks
```
GET /trends/latest?limit=50&category=runway_fashion
```

### Get Featured Looks (Home Page)
```
GET /trends/featured?limit=25
```

### Search Trends
```
GET /trends/search?q=minimalist&category=street_style
```

### Trigger Manual Crawl (Admin)
```
POST /admin/crawl?sites=harpers_bazaar&sections=trends_path
```

## 🎯 Target Sites

### Harper's Bazaar
- **URL**: harpersbazaar.com
- **Sections**: /fashion/trends/, /fashion/runway/, /celebrity/style/
- **Strategy**: Static HTML scraping
- **Quality**: High-end fashion content

### Elle Magazine  
- **URL**: elle.com
- **Sections**: /fashion/trends/, /fashion/runway/, /fashion/celebrity-style/
- **Strategy**: Playwright (JS-heavy, lazy loading)
- **Quality**: Contemporary fashion trends

### Vogue
- **URL**: vogue.com  
- **Sections**: /fashion/trends/, /fashion/runway/, /fashion/celebrity-style/
- **Strategy**: Static HTML with careful rate limiting
- **Quality**: Premium fashion authority

## 🧠 Content Processing

### LLM Enhancement (GPT-4)
- **Summary Generation**: Concise trend summaries
- **Keyword Extraction**: Fashion-specific keywords
- **Style Categorization**: Automatic style classification
- **Trend Strength**: AI-powered trend confidence scores

### Quality Filtering
- **Image Requirements**: Min 400x600px, magazine quality
- **Content Relevance**: Fashion-focused content only
- **Duplicate Detection**: URL-based deduplication

## 🛡️ Ethical Crawling

### Compliance
- **robots.txt**: Always check and respect
- **Rate Limiting**: 2-3 second delays between requests
- **User Agent**: Proper identification as LooklyyCrawler
- **Caching**: 1-hour cache to reduce server load

### Best Practices
- **Respectful Crawling**: Never overwhelm target servers
- **Content Attribution**: Maintain source links and attribution
- **Fair Use**: Educational/research purposes only

## 📈 Data Schema

```sql
trending_looks:
  id, source_site, source_url, title, description, summary,
  primary_image_url, additional_images, category, tags, season,
  trend_score, engagement_score, published_date, crawled_at,
  is_active, is_featured
```

## 🔄 Scheduling

- **Daily Full Crawl**: 6:00 AM (all sections)
- **Quick Updates**: Every 4 hours (trends only)
- **Score Updates**: Every hour (trend decay)

## 🎨 Frontend Integration

The crawler populates the React frontend with:
- **Home Page**: Top 25 featured looks (5 sliders × 5 images)
- **Trending Page**: Pinterest-style browsable content
- **Real-time Updates**: Fresh fashion content daily

## 🧪 Testing

```bash
# Test individual crawler
python -c "from crawlers.harpers_bazaar_crawler import HarpersBazaarCrawler; # test code"

# Test API endpoints
curl http://localhost:8000/trends/latest

# Test database connection
python -c "from database.db_manager import db_manager; print('DB Connected!')"
```

Ready to crawl the fashion world! 🕷️✨
