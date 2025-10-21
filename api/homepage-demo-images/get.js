import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL || 'https://amcegyadzphuvqtlseuf.supabase.co'
const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtY2VneWFkenBodXZxdGxzZXVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1OTY4MTAsImV4cCI6MjA3NDE3MjgxMH0.geKae1U4qgI3JmJUPNQ5p7uho_dDy3NHC-0nEFJlP00'

const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    console.log('📋 Fetching homepage demo images...')

    if (req.method === 'GET') {
      // Get the current demo images from database
      const { data, error } = await supabase
        .from('homepage_demo_images')
        .select('*')
        .eq('id', 'current')
        .single()

      if (error || !data) {
        console.log('No demo images found in database, returning empty state')
        return res.status(200).json({
          success: true,
          hasImages: false,
          message: 'No custom demo images uploaded yet',
          sliders: null
        })
      }

      const uploadedData = JSON.parse(data.images_data)
      
      return res.status(200).json({
        success: true,
        hasImages: true,
        message: `Found ${data.total_images} demo images`,
        sliders: uploadedData,
        uploadedAt: data.uploaded_at,
        totalImages: data.total_images
      })

    } else if (req.method === 'POST') {
      // Update the fashion database with new demo images
      const { operation } = req.body

      if (operation === 'get-latest') {
        // Get the latest uploaded images and return formatted data
        const { data, error } = await supabase
          .from('homepage_demo_images')
          .select('*')
          .eq('id', 'current')
          .single()

        if (error || !data) {
          return res.status(404).json({ error: 'No demo images found' })
        }

        const sliderData = JSON.parse(data.images_data)
        
        // Return in the format expected by the frontend fashionDatabase
        const formattedSliders = Object.values(sliderData).map((slider, index) => ({
          id: slider.id,
          title: slider.title,
          description: slider.description,
          tag: slider.tag,
          images: slider.images
        }))

        return res.status(200).json({
          success: true,
          message: 'Demo images retrieved successfully',
          sliders: formattedSliders,
          totalImages: data.total_images,
          uploadedAt: data.uploaded_at
        })
      }

      return res.status(400).json({ error: 'Invalid operation' })

    } else {
      return res.status(405).json({ error: 'Method not allowed' })
    }

  } catch (error) {
    console.error('❌ Error in homepage demo images API:', error)
    res.status(500).json({ 
      error: 'Server error',
      details: error.message 
    })
  }
}
