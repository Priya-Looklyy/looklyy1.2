import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('📁 Reading demo images from folder...');

    // Path to the demo images folder
    const demoImagesPath = path.join(process.cwd(), 'public', 'demo-images');
    
    // Check if folder exists
    if (!fs.existsSync(demoImagesPath)) {
      console.log('❌ Demo images folder not found');
      return res.status(200).json({
        success: true,
        hasImages: false,
        message: 'Demo images folder not found. Upload images to /public/demo-images/',
        images: [],
        sliders: null
      });
    }

    // Read all files in the demo images directory
    const files = fs.readdirSync(demoImagesPath);
    
    // Filter for image files only
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return imageExtensions.includes(ext);
    });

    if (imageFiles.length === 0) {
      console.log('📁 No images found in demo-images folder');
      return res.status(200).json({
        success: true,
        hasImages: false,
        message: 'No images found in demo-images folder',
        images: [],
        sliders: null
      });
    }

    console.log(`📸 Found ${imageFiles.length} images in demo-images folder`);

    // Sort images by name to ensure consistent ordering
    imageFiles.sort();

    // Limit to 25 images max
    const limitedImages = imageFiles.slice(0, 25);

    // Convert to the format expected by frontend
    const images = limitedImages.map((fileName, index) => ({
      id: index + 1,
      url: `/demo-images/${fileName}`,
      name: path.parse(fileName).name.replace(/[-_]/g, ' '),
      alt: `${path.parse(fileName).name} demo image`
    }));

    // Organize into 5 sliders (5 images each)
    const sliderStructure = [
      { key: 'slider1', title: 'Minimalist Chic', description: 'Clean lines meet modern sophistication', tag: 'Runway Inspired' },
      { key: 'slider2', title: 'Autumn Elegance', description: 'Rich textures and warm palette', tag: 'Seasonal' },
      { key: 'slider3', title: 'Street Style Edge', description: 'Urban flair meets high fashion', tag: 'Celebrity' },
      { key: 'slider4', title: 'Classic Revival', description: 'Timeless elegance reimagined', tag: 'Vintage' },
      { key: 'slider5', title: 'Power Dressing', description: 'Confidence through curated style', tag: 'Business' }
    ];

    const sliders = {};
    
    sliderStructure.forEach((slider, sliderIndex) => {
      const startIndex = sliderIndex * 5;
      const sliderImages = images.slice(startIndex, startIndex + 5);
      
      if (sliderImages.length > 0) {
        sliders[slider.key] = {
          id: sliderIndex + 1,
          title: slider.title,
          description: slider.description,
          tag: slider.tag,
          images: sliderImages
        };
      }
    });

    const response = {
      success: true,
      hasImages: true,
      message: `Found ${limitedImages.length} images in demo-images folder`,
      totalImages: limitedImages.length,
      images: images,
      sliders: sliders,
      folderPath: '/demo-images/',
      lastUpdated: new Date().toISOString()
    };

    console.log(`✅ Organized ${limitedImages.length} images into ${Object.keys(sliders).length} sliders`);
    
    return res.status(200).json(response);

  } catch (error) {
    console.error('❌ Error reading demo images folder:', error);
    res.status(500).json({ 
      error: 'Failed to read demo images folder',
      details: error.message 
    });
  }
}
