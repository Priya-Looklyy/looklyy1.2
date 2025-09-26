import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (!supabase) {
    return res.status(500).json({ 
      success: false, 
      error: 'Supabase is not configured' 
    })
  }

  try {
    console.log('🚀 Starting simple HTTP crawler (Vercel compatible)...')
    
    if (!supabase) {
      return res.status(500).json({ 
        success: false, 
        error: 'Supabase is not configured' 
      })
    }

    // URLs to crawl with category mapping - EXPANDED Harper's Bazaar Coverage for Maximum Content
    const urlsToCrawl = [
      // SPECIFIC HIGH-QUALITY ARTICLES - Full-size fashion images
      { url: 'https://www.harpersbazaar.com/fashion/trends/a65837104/wide-leg-jeans-outfit-ideas/', category: 'street-style', subcategory: 'outfit-ideas', trendScore: 0.99 },
      
      // CELEBRITY STYLE - COMPREHENSIVE Coverage
      { url: 'https://www.harpersbazaar.com/fashion/celebrity-style/', category: 'celebrity-style', subcategory: 'general', trendScore: 0.98 },
      { url: 'https://www.harpersbazaar.com/fashion/celebrity-style/red-carpet/', category: 'celebrity-style', subcategory: 'red-carpet', trendScore: 0.97 },
      { url: 'https://www.harpersbazaar.com/fashion/celebrity-style/met-gala/', category: 'celebrity-style', subcategory: 'met-gala', trendScore: 0.96 },
      { url: 'https://www.harpersbazaar.com/fashion/celebrity-style/oscars/', category: 'celebrity-style', subcategory: 'oscars', trendScore: 0.95 },
      { url: 'https://www.harpersbazaar.com/fashion/celebrity-style/golden-globes/', category: 'celebrity-style', subcategory: 'golden-globes', trendScore: 0.94 },
      { url: 'https://www.harpersbazaar.com/fashion/celebrity-style/cannes/', category: 'celebrity-style', subcategory: 'cannes', trendScore: 0.93 },
      { url: 'https://www.harpersbazaar.com/fashion/celebrity-style/emmys/', category: 'celebrity-style', subcategory: 'emmys', trendScore: 0.92 },
      { url: 'https://www.harpersbazaar.com/fashion/celebrity-style/grahams/', category: 'celebrity-style', subcategory: 'grahams', trendScore: 0.91 },
      { url: 'https://www.harpersbazaar.com/fashion/celebrity-style/street-style/', category: 'celebrity-style', subcategory: 'street-style', trendScore: 0.90 },
      { url: 'https://www.harpersbazaar.com/fashion/celebrity-style/off-duty/', category: 'celebrity-style', subcategory: 'off-duty', trendScore: 0.89 },
      
      // RUNWAY - COMPREHENSIVE Runway Coverage
      { url: 'https://www.harpersbazaar.com/fashion/runway/', category: 'runway', subcategory: 'general', trendScore: 0.98 },
      { url: 'https://www.harpersbazaar.com/fashion/runway/spring-2025/', category: 'runway', subcategory: 'spring-2025', trendScore: 0.99 },
      { url: 'https://www.harpersbazaar.com/fashion/runway/fall-2024/', category: 'runway', subcategory: 'fall-2024', trendScore: 0.97 },
      { url: 'https://www.harpersbazaar.com/fashion/runway/paris-fashion-week/', category: 'runway', subcategory: 'paris-fw', trendScore: 0.96 },
      { url: 'https://www.harpersbazaar.com/fashion/runway/new-york-fashion-week/', category: 'runway', subcategory: 'nyfw', trendScore: 0.95 },
      { url: 'https://www.harpersbazaar.com/fashion/runway/milan-fashion-week/', category: 'runway', subcategory: 'milan-fw', trendScore: 0.94 },
      { url: 'https://www.harpersbazaar.com/fashion/runway/london-fashion-week/', category: 'runway', subcategory: 'lfw', trendScore: 0.93 },
      { url: 'https://www.harpersbazaar.com/fashion/runway/couture/', category: 'runway', subcategory: 'couture', trendScore: 0.92 },
      { url: 'https://www.harpersbazaar.com/fashion/runway/ready-to-wear/', category: 'runway', subcategory: 'rtw', trendScore: 0.91 },
      { url: 'https://www.harpersbazaar.com/fashion/runway/cruise/', category: 'runway', subcategory: 'cruise', trendScore: 0.90 },
      
      // DESIGNERS - COMPREHENSIVE Designer Coverage
      { url: 'https://www.harpersbazaar.com/fashion/designers/', category: 'designers', subcategory: 'general', trendScore: 0.98 },
      { url: 'https://www.harpersbazaar.com/fashion/designers/spring-2025/', category: 'designers', subcategory: 'spring-2025', trendScore: 0.97 },
      { url: 'https://www.harpersbazaar.com/fashion/designers/fall-2024/', category: 'designers', subcategory: 'fall-2024', trendScore: 0.96 },
      { url: 'https://www.harpersbazaar.com/fashion/designers/chanel/', category: 'designers', subcategory: 'chanel', trendScore: 0.95 },
      { url: 'https://www.harpersbazaar.com/fashion/designers/dior/', category: 'designers', subcategory: 'dior', trendScore: 0.94 },
      { url: 'https://www.harpersbazaar.com/fashion/designers/gucci/', category: 'designers', subcategory: 'gucci', trendScore: 0.93 },
      { url: 'https://www.harpersbazaar.com/fashion/designers/louis-vuitton/', category: 'designers', subcategory: 'louis-vuitton', trendScore: 0.92 },
      { url: 'https://www.harpersbazaar.com/fashion/designers/balenciaga/', category: 'designers', subcategory: 'balenciaga', trendScore: 0.91 },
      { url: 'https://www.harpersbazaar.com/fashion/designers/prada/', category: 'designers', subcategory: 'prada', trendScore: 0.90 },
      { url: 'https://www.harpersbazaar.com/fashion/designers/versace/', category: 'designers', subcategory: 'versace', trendScore: 0.89 },
      
      // TRENDS - COMPREHENSIVE Trend Coverage
      { url: 'https://www.harpersbazaar.com/fashion/trends/', category: 'trends', subcategory: 'general', trendScore: 0.95 },
      { url: 'https://www.harpersbazaar.com/fashion/trends/fall-2024/', category: 'trends', subcategory: 'fall-2024', trendScore: 0.94 },
      { url: 'https://www.harpersbazaar.com/fashion/trends/spring-2025/', category: 'trends', subcategory: 'spring-2025', trendScore: 0.93 },
      { url: 'https://www.harpersbazaar.com/fashion/trends/street-style/', category: 'trends', subcategory: 'street-style', trendScore: 0.92 },
      { url: 'https://www.harpersbazaar.com/fashion/trends/color-trends/', category: 'trends', subcategory: 'color-trends', trendScore: 0.91 },
      { url: 'https://www.harpersbazaar.com/fashion/trends/accessories/', category: 'trends', subcategory: 'accessories', trendScore: 0.90 },
      { url: 'https://www.harpersbazaar.com/fashion/trends/denim/', category: 'trends', subcategory: 'denim', trendScore: 0.89 },
      { url: 'https://www.harpersbazaar.com/fashion/', category: 'trends', subcategory: 'general', trendScore: 0.88 },
      
      // STREET STYLE - COMPREHENSIVE Street Style Coverage
      { url: 'https://www.harpersbazaar.com/fashion/street-style/', category: 'street-style', subcategory: 'general', trendScore: 0.90 },
      { url: 'https://www.harpersbazaar.com/fashion/street-style/paris-fashion-week/', category: 'street-style', subcategory: 'paris-fw', trendScore: 0.89 },
      { url: 'https://www.harpersbazaar.com/fashion/street-style/new-york-fashion-week/', category: 'street-style', subcategory: 'nyfw', trendScore: 0.88 },
      { url: 'https://www.harpersbazaar.com/fashion/street-style/milan-fashion-week/', category: 'street-style', subcategory: 'milan-fw', trendScore: 0.87 },
      { url: 'https://www.harpersbazaar.com/fashion/street-style/london-fashion-week/', category: 'street-style', subcategory: 'lfw', trendScore: 0.86 },
      { url: 'https://www.harpersbazaar.com/fashion/street-style/daily/', category: 'street-style', subcategory: 'daily', trendScore: 0.85 },
      
      // BEAUTY & LIFESTYLE - Additional Content Areas
      { url: 'https://www.harpersbazaar.com/beauty/', category: 'celebrity-style', subcategory: 'beauty', trendScore: 0.84 },
      { url: 'https://www.harpersbazaar.com/culture/', category: 'celebrity-style', subcategory: 'culture', trendScore: 0.83 }
    ]
    
    let totalImages = 0
    let storedImages = 0
    let pagesCrawled = 0
    const errors = []
    const allFashionImages = []
    
    // Crawl each URL with proper error handling
    for (const urlData of urlsToCrawl) {
      try {
        console.log(`🎯 Crawling: ${urlData.url} (${urlData.category})`)
        pagesCrawled++
        
        const response = await fetch(urlData.url, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
          }
        })
        
        if (!response.ok) {
          console.log(`❌ Failed to fetch ${urlData.url}: ${response.status}`)
          errors.push(`HTTP ${response.status} for ${urlData.url}`)
          continue
        }
        
        const html = await response.text()
        
        // Extract all images from HTML
        const imageMatches = html.match(/<img[^>]+src="([^"]+)"/gi) || []
        const images = imageMatches.map(match => {
          const srcMatch = match.match(/src="([^"]+)"/)
          const altMatch = match.match(/alt="([^"]*)"/)
          return {
            src: srcMatch ? srcMatch[1] : '',
            alt: altMatch ? altMatch[1] : ''
          }
        })
        
        console.log(`📸 Found ${images.length} images on ${urlData.url}`)
        totalImages += images.length
        
        // Filter for fashion images - prioritize full-size people, avoid collages
        const fashionImages = images.filter(img => {
          const src = img.src.toLowerCase()
          const alt = img.alt.toLowerCase()
          
          // Must be a valid image URL
          if (!src || !src.includes('http')) return false
          
          // Convert relative URLs to absolute URLs
          let absoluteUrl = src
          if (src.startsWith('//')) {
            absoluteUrl = 'https:' + src
          } else if (src.startsWith('/')) {
            absoluteUrl = 'https://www.harpersbazaar.com' + src
          } else if (!src.startsWith('http')) {
            absoluteUrl = 'https://www.harpersbazaar.com/' + src
          }
          
          // STRICT filtering - NO movie posters, campaigns, or brand artwork
          const excludeKeywords = [
            'icon', 'logo', 'button', 'svg', 'avatar', 'thumbnail',
            'social', 'share', 'like', 'heart', 'pin', 'star',
            'badge', 'sponsor', 'ad', 'banner', 'header', 'footer',
            'nav', 'sidebar', 'menu', 'search', 'arrow', 'play',
            'close', 'checkmark', 'magnifying', '_assets', 'design-tokens',
            'facebook', 'twitter', 'instagram', 'pinterest', 'youtube',
            
            // AGGRESSIVE face/collage filtering
            'beauty', 'makeup', 'skincare', 'portrait', 'headshot', 'close-up', 'closeup',
            'face', 'facial', 'beauty-shot', 'beauty-shoot', 'beauty-campaign',
            'makeup-look', 'skincare-routine', 'beauty-tips', 'beauty-trends',
            'beauty-editorial', 'beauty-photoshoot', 'beauty-campaign',
            'head-and-shoulders', 'headshot', 'portrait-photo', 'portrait-shot',
            'beauty-feature', 'beauty-spread', 'beauty-story', 'beauty-article',
            'model-face', 'celebrity-face', 'star-face', 'cropped-face', 'face-crop',
            'facial-beauty', 'selfie', 'mugshot', 'beauty-photo', 'makeup-model',
            'red-carpet-model', 'closeup-model', 'facial-shot', 'beauty-closeup',
            'closeup', 'upper-body', 'head-and', 'model-portrait',
            
            // Collage, montage, poster content - BLOCK ALL
            'collage', 'montage', 'grid', 'compilation', 'collection', 'mosaic',
            'gallery', 'gallery-grid', 'photo-grid', 'image-grid', 'image-collage',
            'multi-image', 'image-collection', 'fashion-collage', 'style-collage',
            'lookbook-collection', 'mood-board', 'moodboard', 'inspiration-board',
            'product-showcase', 'brand-showcase', 'trend-roundup', 'style-guide',
            'fashion-compilation', 'style-compilation', 'trend-compilation',
            
            // MOVIE POSTER & BRAND CAMPAIGNS - BLOCK STRICTLY
            'poster', 'movie', 'film', 'trailer', 'promotional', 'brand-campaign',
            'marc-jacobs', 'heaven', 'vanna', 'gabbriette', 'iris-law',
            'brand-collection', 'fashion-campaign', 'model-portfolio',
            'editorial-spread', 'magazine-layout', 'design-spread',
            'brand-artwork', 'creative-director', 'artwork', 'creative-campaign',
            'music-video', 'video-stills', 'album-cover', 'artistic-portrait',
            'artwork-gallery', 'creative-shoot', 'fashion-social', 'brand-content',
            'cinematic', 'stills', 'scene', 'director', 'photoshoot',
            'showcase', 'highlight', 'feature', 'spread', 'layout', 'editorial',
            'stage', 'performance', 'music', 'album', 'record', 'single'
          ]
          
          if (excludeKeywords.some(keyword => absoluteUrl.includes(keyword) || alt.includes(keyword))) {
            return false
          }
          
          // Must be common image formats
          if (!absoluteUrl.match(/\.(jpg|jpeg|png|webp)(\?|$)/i)) {
            return false
          }
          
          // BLOCK ALL cinema/poster/campaign content - STRICTER CHECK
          const urlName = absoluteUrl.slice(absoluteUrl.lastIndexOf('/') + 1).toLowerCase()
          const isCinemaContent = alt.includes('heaven') || alt.includes('marc jacobs') ||
                                alt.includes('brand') || alt.includes('campaign') ||
                                alt.includes('poster') || alt.includes('cover') ||
                                alt.includes('layout') || alt.includes('artwork') ||
                                alt.includes('marc') || alt.includes('heaven') ||
                                alt.includes('gabbriette') || alt.includes('iris-law') ||
                                urlName.includes('poster') || urlName.includes('campaign') ||
                                urlName.includes('brand') || urlName.includes('movie') ||
                                urlName.includes('heaven') || urlName.includes('marc') ||
                                urlName.includes('layout') || urlName.includes('artwork')
                                
          if (isCinemaContent) {
            return false
          }
          
          // Look for fashion-related content - BALANCED approach
          const fashionKeywords = [
            // Core fashion terms
            'fashion', 'style', 'runway', 'trend', 'look', 'outfit',
            'model', 'celebrity', 'street', 'designer', 'collection',
            'show', 'photo', 'image', 'editorial', 'shoot',
            'campaign', 'dress', 'clothing', 'apparel', 'beauty',
            'harpersbazaar', 'bazaar', 'wearing', 'styled', 'ensemble',
            'fashion-week', 'red-carpet', 'street-style', 'runway-show',
            'woman', 'man', 'person', 'people', 'girl', 'boy',
            'jacket', 'shirt', 'pants', 'shoes', 'bag', 'accessory',
            'hair', 'makeup', 'jewelry', 'watch', 'sunglasses',
            'jeans', 'coat', 'blazer', 'trench', 'boots', 'heels',
            'outfit-ideas', 'street-style', 'getty', 'edward-berthelot',
            
            // Celebrity & Event terms
            'celebrity', 'actress', 'actor', 'star', 'famous', 'celebrity-style',
            'red-carpet', 'met-gala', 'oscars', 'golden-globes', 'cannes',
            'emmys', 'grahams', 'awards', 'ceremony', 'event', 'gala',
            'premiere', 'launch', 'party', 'after-party', 'afterparty',
            'movie', 'film', 'premiere', 'screening', 'festival',
            'instagram', 'social', 'media', 'influencer', 'blogger',
            
            // Fashion specific terms
            'couture', 'ready-to-wear', 'rtw', 'cruise', 'pre-fall',
            'spring', 'fall', 'summer', 'winter', 'seasonal',
            'paris', 'milan', 'london', 'new-york', 'nyfw', 'pfw', 'mfw', 'lfw',
            'designer', 'brand', 'luxury', 'haute', 'pret-a-porter',
            'dress', 'gown', 'evening-wear', 'cocktail', 'formal',
            'casual', 'smart-casual', 'business', 'formal', 'semi-formal',
            'suit', 'tuxedo', 'tux', 'blazer', 'sport-coat',
            
            // Style types  
            'bohemian', 'minimalist', 'vintage', 'retro', 'classic',
            'edgy', 'romantic', 'preppy', 'chic', 'sophisticated',
            'tomboy', 'feminine', 'masculine', 'androgynous', 'neutral',
            'colorful', 'monochrome', 'maximalist', 'scandinavian',
            
            // Specific clothing items
            'dress', 'skirt', 'pants', 'leggings', 'jeans', 'shorts',
            'shirt', 'blouse', 'tank', 'tee', 't-shirt', 'button-down',
            'sweater', 'cardigan', 'pullover', 'hoodie', 'sweatshirt',
            'coat', 'jacket', 'blazer', 'trench', 'parka', 'bomber',
            'shoes', 'boots', 'heels', 'sneakers', 'flats', 'sandals',
            'handbag', 'purse', 'clutch', 'tote', 'crossbody', 'backpack',
            
            // Colors & patterns
            'black', 'white', 'neutral', 'colorful', 'bold', 'bright',
            'earth-tone', 'pastel', 'vibrant', 'rich', 'deep',
            'print', 'pattern', 'striped', 'polka-dot', 'floral',
            'plaid', 'checkered', 'polka', 'leopard', 'animal-print',
            
            // Photography & Image terms
            'portrait', 'headshot', 'full-length', 'full-body', 'close-up',
            'getty', 'rex', 'shutterstock', 'unsplash', 'freepik',
            'edward-berthelot', 'christian-vierig', 'raimonda',
            'street-style', 'backstage', 'behind-scenes', 'candid',
            'posing', 'walking', 'sitting', 'standing', 'movement',
            
            // Brand & Designer names (common ones)
            'chanel', 'dior', 'gucci', 'louis-vuitton', 'hermes',
            'prada', 'versace', 'balenciaga', 'marc-jacobs', 'yves-saint-laurent',
            'valentino', 'dolce-gabbana', 'givenchy', 'alexander-mcqueen',
            'stella-mccartney', 'zac-posen', 'oscar-de-la-renta',
            
            // Location & Event terms
            'manhattan', 'beverly-hills', 'hamptons', 'tribeca',
            'studio', 'set', 'location', 'venue', 'hotel', 'restaurant',
            'museum', 'gallery', 'theater', 'theatre', 'concerthall'
          ]
          
          // Include images with broader fashion relevance
          const fullBodyKeywords = [
            'full', 'body', 'outfit', 'ensemble', 'look', 'styled',
            'wearing', 'dressed', 'fashion', 'street', 'runway',
            'model', 'celebrity', 'person', 'woman', 'man', 'wear',
            'style', 'clothes', 'clothing', 'apparel'
          ]
          
          // Face shot detection - exclude images that are clearly face-focused
          const faceShotKeywords = [
            'beauty', 'makeup', 'skincare', 'portrait', 'headshot', 'close-up',
            'face', 'facial', 'beauty-shot', 'beauty-shoot', 'beauty-campaign',
            'makeup-look', 'skincare-routine', 'beauty-tips', 'beauty-trends',
            'beauty-editorial', 'beauty-photoshoot', 'beauty-campaign',
            'head-and-shoulders', 'headshot', 'portrait-photo', 'portrait-shot',
            'beauty-feature', 'beauty-spread', 'beauty-story', 'beauty-article',
            'closeup', 'headshot', 'portrait', 'beauty', 'makeup', 'skincare'
          ]
          
          const isFaceShot = faceShotKeywords.some(keyword => 
            absoluteUrl.includes(keyword) || alt.includes(keyword)
          )
          
          // ULTRA-AGGRESSIVE Collage Detection based on visual patterns common in the screenshots
          const isCompositeBusinessImage = alt.includes('shown here') ||
                                          alt.includes('round-up') ||
                                          alt.includes('header') ||
                                          alt.includes('overview shot') ||
                                          alt.includes('featured selection') ||
                                          alt.includes('circle') ||
                                          alt.includes('rings') ||
                                          alt.includes('watch') &&
                                          (alt.includes('jewelry') ||
                                          alt.includes('fashion collection')) || 
                                          /woman wearing.*diamond|ring|jewelry/i.test(alt) ||
                                          /collection.*jewelry/i.test(alt) ||
                                          /(multiple|crew|group)/.test(alt) ||
                                          // Additional EXTREMELY SPECIFIC content blocking from the multi-part shots
                                          alt.includes('overlay') ||
                                          alt.includes('overlapping') ||
                                          alt.includes('layered') ||  
                                          alt.includes('combining') || 
                                          alt.includes('together') || 
                                          alt.includes('featuring') && (alt.includes('elements')) ||
                                          /composed.*model|model.*posed/i.test(alt) || 
                                          /woven.*fabric|mounted.*jewelry|full.*length.*run/i.test(alt) ||       
                                          absoluteUrl.includes('frameworks') ||
                                          absoluteUrl.includes('blends') ||
                                          absoluteUrl.includes('bundled') ||
                                          absoluteUrl.includes('faceted-multi') ||
                                          /complex layout image|multi-striated|framed collection/i.test(alt) ||
                                          (absoluteUrl.toLowerCase().includes('archive') && 
                                           absoluteUrl.toLowerCase().includes('.jpg'))
          
          const hasFashionKeyword = fashionKeywords.some(keyword => 
            absoluteUrl.includes(keyword) || alt.includes(keyword)
          )
          
          const hasFullBodyKeyword = fullBodyKeywords.some(keyword => 
            alt.includes(keyword)
          )
          
          // Check for image size indicators (larger images are more likely to be full-body)
          const isLargeImage = absoluteUrl.includes('1200') || 
                              absoluteUrl.includes('800') || 
                              absoluteUrl.includes('600') ||
                              absoluteUrl.includes('crop=1.00xw') ||
                              absoluteUrl.includes('resize=1200') ||
                              absoluteUrl.includes('resize=800')
          
          // Only exclude very small images (200px, 300px), keep 360px+ for now
          const isVerySmallImage = absoluteUrl.includes('resize=200') ||
                                  absoluteUrl.includes('resize=300')
          
          if (isVerySmallImage) return false
          
          // Check for face shot indicators in image dimensions/crop parameters
          const isFaceShotCrop = absoluteUrl.includes('crop=face') ||
                                absoluteUrl.includes('crop=center') ||
                                absoluteUrl.includes('crop=top') ||
                                absoluteUrl.includes('crop=1:1') ||
                                absoluteUrl.includes('square') ||
                                absoluteUrl.includes('portrait-crop')
          
          // Define all exclusion checks for comprehensive final filtering
          const isCollagePattern = absoluteUrl.includes('collage') ||
                                  absoluteUrl.includes('montage') ||
                                  absoluteUrl.includes('grid') ||
                                  absoluteUrl.includes('compilation') ||
                                  absoluteUrl.includes('collection-') ||
                                  absoluteUrl.includes('gallery-') ||
                                  absoluteUrl.includes('image-grid') ||
                                  absoluteUrl.includes('photo-collage') ||
                                  absoluteUrl.includes('fashion-grid') ||
                                  absoluteUrl.includes('lookbook-') ||
                                  absoluteUrl.includes('moodboard') ||
                                  absoluteUrl.includes('frameworks') ||
                                  absoluteUrl.includes('overlays') ||
                                  absoluteUrl.includes('composite') ||
                                  absoluteUrl.includes('assembled') ||
                                  absoluteUrl.includes('combined') ||
                                  (absoluteUrl.includes('grid-') && absoluteUrl.includes('jpg')) ||
                                  // URL patterns that suggest multi-content images
                                  /-collage/.test(absoluteUrl) ||
                                  /-montage/.test(absoluteUrl) ||
                                  /-overview/.test(absoluteUrl) ||
                                  /-gallery/.test(absoluteUrl) ||
                                  /-roundup/.test(absoluteUrl)
          
          const isCollageDescription = alt.includes('collage') ||
                                      alt.includes('montage') ||
                                      alt.includes('grid') ||
                                      alt.includes('compilation') ||
                                      alt.includes('collection of') ||
                                      alt.includes('multiple images') ||
                                      alt.includes('image montage') ||
                                      alt.includes('photo collage') ||
                                      (alt.includes('multi') && alt.includes('image')) ||
                                      alt.includes('mix of') ||
                                      alt.includes('various looks') ||
                                      alt.includes('fashion roundup') ||
                                      alt.includes('style roundup') ||
                                      alt.includes('trends roundup') ||
                                      alt.includes('style guide') ||
                                      alt.includes('multiple looks') ||
                                      alt.includes('various fashion') ||
                                      alt.includes('different styles') ||
                                      alt.includes('several images') ||
                                      alt.includes('group of') ||
                                      alt.includes('assorted') ||
                                      alt.includes('gallery') ||
                                      alt.includes('moodboard') ||
                                      alt.includes('lookbook') ||
                                      alt.includes('overview') ||
                                      alt.includes('highlights') ||
                                      alt.includes('showcasing') ||
                                      alt.includes('featuring multiple') ||
                                      alt.includes('behind the scenes')
          
          // Be ULTRA permissive - include almost all images from Harper's Bazaar domains
          const isFromHarpersBazaar = absoluteUrl.includes('harpersbazaar') || 
                                     absoluteUrl.includes('hips.hearstapps.com') ||
                                     absoluteUrl.includes('hearstapps.com') ||
                                     absoluteUrl.includes('getty') ||
                                     absoluteUrl.includes('rex') ||
                                     absoluteUrl.includes('shutterstock')
          
          // CRITICAL: Re-check for exclusions AFTER all URL analysis to ensure they are NEVER overridden
          const finalExcludeCheck = isCollagePattern || isCollageDescription || isFaceShotCrop || isFaceShot || isCompositeBusinessImage
          if (finalExcludeCheck) {
            return false // NEVER include these types regardless of domain
          }
          
          // Additional visual pattern checks that might indicate collages/montages
          // Check for image filename patterns often associated with editorial collages  
          const rootFilename = absoluteUrl.split('/').pop() || ''
          const looksLikeCollageFile = /\d+-panel/i.test(rootFilename) ||
                                     /\d+-grid/i.test(rootFilename) ||
                                     /collage/i.test(rootFilename) ||
                                     /montage/i.test(rootFilename) ||
                                     /roundup/i.test(rootFilename) ||
                                     /editorial/i.test(rootFilename) && (rootFilename.includes('table') || rootFilename.includes('slideshow'))
          
          // Strict exclusion for overlapping layout images- block if image has been used for complex editorials
          const hasDocumentaryStyleContent = alt.includes('display') || alt.includes('layout') || alt.includes('arrangement') ||
                                            alt.includes('showcase') || alt.includes('arranging') ||
                                            alt.includes('compilation') || alt.includes('editorial') ||
                                            alt.includes('shifts') || alt.includes('trends') && alt.includes('pack') ||
                                            alt.includes('archive') || alt.includes('collection') ||
                                            alt.includes('behind') || alt.includes('front') ||
                                            alt.includes('curated') // More comprehensive coverage  
          
          // MEGA-STRICT BLOCKER: Check EVERY possible exclusion FIRST
          if (looksLikeCollageFile || hasDocumentaryStyleContent || isCompositeBusinessImage) {
            return false // BLOCK WITHOUT EXCEPTION - REGARDLESS OF DOMAIN
          }
          
          // If image passes ALL exclusion tests, then check if it's from preferred domains
          if (isFromHarpersBazaar) {
            // Allow fashion content but block faces
            return (hasFashionKeyword || hasFullBodyKeyword) && !isFaceShot
          }
          
          // For non-Harper's domains, be selective but not excessive
          return (hasFashionKeyword || hasFullBodyKeyword) && !isFaceShot
        }).map(img => {
          let processedSrc = img.src.startsWith('//') ? 'https:' + img.src :
                            img.src.startsWith('/') ? 'https://www.harpersbazaar.com' + img.src :
                            img.src.startsWith('http') ? img.src :
                            'https://www.harpersbazaar.com/' + img.src
          
          // Remove resize parameters to get original larger images
          processedSrc = processedSrc.replace(/&resize=\d+:\*/g, '')
          processedSrc = processedSrc.replace(/&resize=\d+:\d+/g, '')
          processedSrc = processedSrc.replace(/resize=\d+:\*/g, '')
          processedSrc = processedSrc.replace(/resize=\d+:\d+/g, '')
          
          return {
            src: processedSrc,
            alt: img.alt,
            category: urlData.category,
            subcategory: urlData.subcategory,
            trendScore: urlData.trendScore,
            sourceUrl: urlData.url,
            crawledAt: new Date().toISOString()
          }
        })
        
        console.log(`✨ Found ${fashionImages.length} fashion images on ${urlData.url}`)
        allFashionImages.push(...fashionImages)
        
      } catch (error) {
        console.log(`❌ Error crawling ${urlData.url}:`, error.message)
        errors.push(`Error crawling ${urlData.url}: ${error.message}`)
      }
    }
    
    // Remove duplicates and store unique images - more robust deduplication
    const seenUrls = new Set()
    const uniqueImages = allFashionImages.filter(img => {
      if (seenUrls.has(img.src)) {
        return false
      }
      seenUrls.add(img.src)
      return true
    })
    
    console.log(`🎨 Total unique fashion images found: ${uniqueImages.length}`)
    
    // CLEAR DATABASE FIRST - Complete refresh ensures only new filtered content
    console.log('🗑️ Clearing old unfiltered images from database...')
    const { error: clearError } = await supabase
      .from('fashion_images_new')
      .delete()
      .neq('id', 0) // Delete all records (id is never 0)
    
    if (clearError) {
      console.log('❌ Database clear error:', clearError.message)
      return res.status(500).json({
        success: false,
        error: `Database clear failed: ${clearError.message}`
      })
    }
    
    console.log('✅ Database cleared - fresh start guaranteed')
    
    // Store images in Supabase - FLOOD WITH CONTENT for amazing user experience
    for (const image of uniqueImages.slice(0, 500)) { // Store up to 500 images
      try {
        const { error } = await supabase
          .from('fashion_images_new')
          .insert([{
            original_url: image.src,
            title: `Harper's Bazaar ${image.category.charAt(0).toUpperCase() + image.category.slice(1)} Look ${storedImages + 1}`,
            description: image.alt || `Latest ${image.category} trend from Harper's Bazaar`,
            category: image.category
          }])
        
        if (!error) {
          storedImages++
          console.log(`✅ Stored image: ${image.src}`)
        } else {
          console.log(`❌ Database error:`, error.message)
          errors.push(`Database error: ${error.message}`)
        }
      } catch (error) {
        console.log(`❌ Storage error:`, error.message)
        errors.push(`Storage error: ${error.message}`)
      }
    }
    
    const result = {
      success: true,
      message: 'Simple HTTP crawler completed successfully (Vercel compatible)',
      results: {
        pages_crawled: pagesCrawled,
        total_images_found: totalImages,
        unique_fashion_images: uniqueImages.length,
        images_stored: storedImages,
        errors: errors.length,
        status: errors.length === 0 ? 'success' : 'partial'
      }
    }
    
    console.log('🎉 Crawler completed:', result)
    return res.status(200).json(result)
    
  } catch (error) {
    console.error('Crawler error:', error)
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}