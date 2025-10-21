#!/usr/bin/env node

// Script to upload 25 images to the homepage demo
// Usage: node scripts/upload-demo-images.js

import fetch from 'node-fetch';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

// Example: Replace these with your actual image URLs or paths
const DEMO_IMAGES = [
  // Slider 1: Minimalist Chic (5 images)
  {
    url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400&h=600&fit=crop',
    name: 'Minimalist Look 1',
    alt: 'Clean white outfit with minimal accessories'
  },
  {
    url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=600&fit=crop',
    name: 'Minimalist Look 2', 
    alt: 'Simple black and white ensemble'
  },
  {
    url: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400&h=600&fit=crop',
    name: 'Minimalist Look 3',
    alt: 'Neutral tones with clean lines'
  },
  {
    url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop',
    name: 'Minimalist Look 4',
    alt: 'Effortless minimal style'
  },
  {
    url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=600&fit=crop',
    name: 'Minimalist Look 5',
    alt: 'Clean sophisticated look'
  },
  
  // Slider 2: Autumn Elegance (5 images)
  {
    url: 'https://images.unsplash.com/photo-1544957992-20349e4a0b5a?w=400&h=600&fit=crop',
    name: 'Autumn Look 1',
    alt: 'Warm autumn colors and textures'
  },
  {
    url: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=600&fit=crop',
    name: 'Autumn Look 2',
    alt: 'Cozy fall fashion ensemble'
  },
  {
    url: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=600&fit=crop',
    name: 'Autumn Look 3',
    alt: 'Rich autumn palette styling'
  },
  {
    url: 'https://images.unsplash.com/photo-1562572159-4efc207f5aff?w=400&h=600&fit=crop',
    name: 'Autumn Look 4',
    alt: 'Elegant fall outfit'
  },
  {
    url: 'https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=400&h=600&fit=crop',
    name: 'Autumn Look 5',
    alt: 'Seasonal warm tones'
  },
  
  // Slider 3: Street Style Edge (5 images)
  {
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop',
    name: 'Street Style 1',
    alt: 'Urban street fashion look'
  },
  {
    url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=400&h=600&fit=crop',
    name: 'Street Style 2',
    alt: 'Edgy streetwear ensemble'
  },
  {
    url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&h=600&fit=crop',
    name: 'Street Style 3',
    alt: 'Modern street style outfit'
  },
  {
    url: 'https://images.unsplash.com/photo-1571513722275-4b41940f54b8?w=400&h=600&fit=crop',
    name: 'Street Style 4',
    alt: 'Contemporary urban look'
  },
  {
    url: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=600&fit=crop',
    name: 'Street Style 5',
    alt: 'Trendy street fashion'
  },
  
  // Slider 4: Classic Revival (5 images)
  {
    url: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=400&h=600&fit=crop',
    name: 'Classic Look 1',
    alt: 'Timeless classic style'
  },
  {
    url: 'https://images.unsplash.com/photo-1566479179817-c0c8b7c5a6d5?w=400&h=600&fit=crop',
    name: 'Classic Look 2',
    alt: 'Elegant vintage-inspired outfit'
  },
  {
    url: 'https://images.unsplash.com/photo-1583292650898-7d22cd27ca6f?w=400&h=600&fit=crop',
    name: 'Classic Look 3',
    alt: 'Refined classic fashion'
  },
  {
    url: 'https://images.unsplash.com/photo-1589156280159-27698a70f29e?w=400&h=600&fit=crop',
    name: 'Classic Look 4',
    alt: 'Sophisticated classic look'
  },
  {
    url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=600&fit=crop',
    name: 'Classic Look 5',
    alt: 'Timeless elegance'
  },
  
  // Slider 5: Power Dressing (5 images)
  {
    url: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=600&fit=crop',
    name: 'Power Look 1',
    alt: 'Professional power outfit'
  },
  {
    url: 'https://images.unsplash.com/photo-1616847220575-8a2b92db89b7?w=400&h=600&fit=crop',
    name: 'Power Look 2',
    alt: 'Confident business attire'
  },
  {
    url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=600&fit=crop',
    name: 'Power Look 3',
    alt: 'Executive style ensemble'
  },
  {
    url: 'https://images.unsplash.com/photo-1630734277837-ebe62757b6e0?w=400&h=600&fit=crop',
    name: 'Power Look 4',
    alt: 'Strong professional look'
  },
  {
    url: 'https://images.unsplash.com/photo-1633113093730-e05e6d6e2a4e?w=400&h=600&fit=crop',
    name: 'Power Look 5',
    alt: 'Bold confident style'
  }
];

async function uploadDemoImages() {
  try {
    console.log('🚀 Starting upload of 25 demo images...');
    
    const response = await fetch(`${API_BASE_URL}/homepage-demo-images/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        images: DEMO_IMAGES
      })
    });

    const result = await response.json();

    if (response.ok && result.success) {
      console.log('✅ Success! Demo images uploaded successfully');
      console.log(`📊 Uploaded ${result.totalImages} images across 5 sliders`);
      console.log('📋 Slider distribution:');
      
      Object.keys(result.sliders).forEach(sliderKey => {
        const slider = result.sliders[sliderKey];
        console.log(`   ${sliderKey}: ${slider.images.length} images - ${slider.title}`);
      });
      
      console.log('\n🎉 Your demo homepage is now updated!');
      
    } else {
      console.error('❌ Upload failed:', result.error || result.message);
    }

  } catch (error) {
    console.error('💥 Error uploading demo images:', error.message);
  }
}

// Run the upload
uploadDemoImages();
