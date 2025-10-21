import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || 'https://amcegyadzphuvqtlseuf.supabase.co'
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtY2VneWFkenBodXZxdGxzZXVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1OTY4MTAsImV4cCI6MjA3NDE3MjgxMH0.geKae1U4qgI3JmJUPNQ5p7uho_dDy3NHC-0nEFJlP00'

const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    console.log('🎨 Starting homepage demo images upload...')

    // Expect JSON with array of image URLs or base64 images
    const { images, operation } = req.body

    // Validate input
    if (!images || !Array.isArray(images)) {
      return res.status(400).json({ error: 'Images array is required' })
    }

    if (images.length === 0) {
      return res.status(400).json({ error: 'No images provided' })
    }

    if (images.length > 25) {
      return res.status(400).json({ error: 'Maximum 25 images allowed' })
    }

    console.log(`📸 Processing ${images.length} images for homepage demo`)

    // Validate that all images have required properties
    const validImages = images.filter(img => {
      const hasUrl = img.url || img.base64
      const hasName = img.name || img.alt
      if (!hasUrl || !hasName) {
        console.warn(`⚠️ Skipping invalid image data:`, img)
      }
      return hasUrl && hasName
    })

    if (validImages.length === 0) {
      return res.status(400).json({ error: 'No valid images found - ensure each image has url/base64 and name/alt' })
    }

    console.log(`✅ ${validImages.length} valid images to upload`)

    // Upload images to Supabase storage and organize by slider
    const uploadedImages = []
    const sliderStructure = [
      { key: 'slider1', title: 'Minimalist Chic', description: 'Clean lines meet modern sophistication', tag: 'Runway Inspired' },
      { key: 'slider2', title: 'Autumn Elegance', description: 'Warm tones for the season', tag: 'Seasonal' },
      { key: 'slider3', title: 'Street Style Edge', description: 'Urban fashion meets high style', tag: 'Celebrity' },
      { key: 'slider4', title: 'Classic Revival', description: 'Timeless pieces reimagined', tag: 'Vintage' },
      { key: 'slider5', title: 'Power Dressing', description: 'Confidence in every thread', tag: 'Business' }
    ]

    for (let i = 0; i < validImages.length; i++) {
      const imageData = validImages[i]
      const sliderIndex = Math.floor(i / 5) // 5 images per slider
      const imageIndex = i % 5 + 1 // Image position within slider (1-5)
      
      if (sliderIndex >= 5) {
        console.warn(`⚠️ Skipping image ${i + 1}: Too many images (max 25)`);
        break
      }

      const slider = sliderStructure[sliderIndex]
      const imageExtension = imageData.url ? 
        (imageData.url.split('.').pop()?.split('?')[0] || 'jpg') : 
        'jpg'
      const fileName = `homepage-demo/${slider.key}/image-${imageIndex}-${Date.now()}.${imageExtension}`
      
      try {
        let imageBuffer
        
        // Handle both URL and base64 inputs
        if (imageData.url) {
          // Download from URL
          const imageResponse = await fetch(imageData.url)
          if (!imageResponse.ok) {
            console.error(`❌ Failed to download image from ${imageData.url}`)
            continue
          }
          imageBuffer = await imageResponse.arrayBuffer()
        } else if (imageData.base64) {
          // Handle base64 data
          const base64Data = imageData.base64.replace(/^data:image\/[a-z]+;base64,/, '')
          imageBuffer = Buffer.from(base64Data, 'base64')
        } else {
          console.error(`❌ No valid image source for image ${i + 1}`)
          continue
        }
        
        // Upload to Supabase storage
        const { data, error } = await supabase.storage
          .from('fashion-images')
          .upload(fileName, imageBuffer, {
            cacheControl: '3600',
            upsert: true,
            contentType: 'image/jpeg'
          })

        if (error) {
          console.error(`❌ Upload failed for image ${i + 1}:`, error)
          continue
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from('fashion-images')
          .getPublicUrl(fileName)

        const uploadedImage = {
          id: i + 1,
          url: urlData.publicUrl,
          alt: imageData.alt || imageData.name || `${slider.title} Look ${imageIndex}`,
          fileName: fileName,
          sliderKey: slider.key,
          sliderIndex: sliderIndex + 1,
          originalName: imageData.name || imageData.alt || `Image ${i + 1}`
        }

        uploadedImages.push(uploadedImage)
        console.log(`✅ Uploaded: ${uploadedImage.originalName} -> ${slider.key}`)

      } catch (imageError) {
        console.error(`❌ Image processing error for image ${i + 1}:`, imageError)
        continue
      }
    }

    if (uploadedImages.length === 0) {
      return res.status(500).json({ error: 'Failed to upload any images' })
    }

    // Organize uploaded images by slider for response
    const organizedImages = {}
    sliderStructure.forEach((slider, index) => {
      organizedImages[slider.key] = {
        ...slider,
        id: index + 1,
        images: uploadedImages.filter(img => img.sliderKey === slider.key).map(img => ({
          id: img.id,
          url: img.url,
          alt: img.alt
        }))
      }
    })

    console.log(`🎉 Successfully uploaded ${uploadedImages.length} demo images`)
    console.log('📊 Slider distribution:', Object.keys(organizedImages).map(key => ({
      slider: key,
      count: organizedImages[key].images.length
    })))

    // Store in database for future reference
    try {
      const { data: dbData, error: dbError } = await supabase
        .from('homepage_demo_images')
        .upsert({
          id: 'current',
          images_data: JSON.stringify(organizedImages),
          uploaded_at: new Date().toISOString(),
          total_images: uploadedImages.length
        })

      if (dbError) {
        console.warn('⚠️ Database save warning:', dbError.message)
      } else {
        console.log('✅ Demo images saved to database')
      }
    } catch (dbError) {
      console.warn('⚠️ Database operation failed:', dbError.message)
    }

    res.status(200).json({
      success: true,
      message: `Successfully uploaded ${uploadedImages.length} demo images`,
      totalImages: uploadedImages.length,
      sliders: organizedImages,
      uploadedImages: uploadedImages.map(img => ({
        id: img.id,
        fileName: img.fileName,
        url: img.url,
        slider: img.sliderKey
      }))
    })

  } catch (error) {
    console.error('💥 Homepage demo images upload error:', error)
    res.status(500).json({ 
      error: 'Server error during upload',
      details: error.message 
    })
  }
}
