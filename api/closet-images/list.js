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
    console.log('👗 Reading closet images from subfolders...');

    // Path to the closet images folder
    const closetImagesPath = path.join(process.cwd(), 'public', 'closet-images');
    
    // Check if main folder exists
    if (!fs.existsSync(closetImagesPath)) {
      console.log('❌ Closet images folder not found');
      return res.status(200).json({
        success: true,
        hasImages: false,
        message: 'Closet images folder not found. Create folders at /public/closet-images/look-1 to look-25/',
        items: []
      });
    }

    // Read all subfolders (look-1 to look-25)
    const folders = fs.readdirSync(closetImagesPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
      .filter(name => name.startsWith('look-'))
      .sort((a, b) => {
        const numA = parseInt(a.split('-')[1]);
        const numB = parseInt(b.split('-')[1]);
        return numA - numB;
      });

    console.log(`📁 Found ${folders.length} look folders`);

    if (folders.length === 0) {
      return res.status(200).json({
        success: true,
        hasImages: false,
        message: 'No look folders found. Create folders look-1 to look-25 in /public/closet-images/',
        items: []
      });
    }

    const allClosetItems = [];
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];

    // Process each look folder
    folders.forEach((folderName, folderIndex) => {
      const folderPath = path.join(closetImagesPath, folderName);
      const lookNumber = parseInt(folderName.split('-')[1]);
      
      try {
        // Read images in this folder
        const files = fs.readdirSync(folderPath);
        const imageFiles = files.filter(file => {
          const ext = path.extname(file).toLowerCase();
          return imageExtensions.includes(ext);
        });

        // Create closet items from images in this folder
        imageFiles.forEach((fileName, imageIndex) => {
          const itemId = allClosetItems.length + 1;
          const fileNameWithoutExt = path.parse(fileName).name;
          
          // Generate item name based on folder and image
          const itemName = `${fileNameWithoutExt.replace(/[-_]/g, ' ')}`;
          
          allClosetItems.push({
            id: itemId,
            name: itemName,
            image: `/closet-images/${folderName}/${fileName}`,
            category: getCategoryFromLook(lookNumber),
            lookNumber: lookNumber,
            folderName: folderName
          });
        });

        console.log(`📸 Found ${imageFiles.length} items in ${folderName}`);
        
      } catch (folderError) {
        console.warn(`⚠️ Could not read folder ${folderName}:`, folderError.message);
      }
    });

    const response = {
      success: true,
      hasImages: allClosetItems.length > 0,
      message: `Found ${allClosetItems.length} closet items across ${folders.length} look folders`,
      totalItems: allClosetItems.length,
      totalFolders: folders.length,
      items: allClosetItems,
      folderPath: '/closet-images/',
      lastUpdated: new Date().toISOString()
    };

    console.log(`✅ Loaded ${allClosetItems.length} closet items from ${folders.length} look folders`);
    
    return res.status(200).json(response);

  } catch (error) {
    console.error('❌ Error reading closet images:', error);
    res.status(500).json({ 
      error: 'Failed to read closet images',
      details: error.message 
    });
  }
}

// Helper function to categorize items based on look number
function getCategoryFromLook(lookNumber) {
  const categories = ['tops', 'bottoms', 'outerwear', 'dresses', 'shoes', 'accessories'];
  return categories[lookNumber % categories.length];
}
