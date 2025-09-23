import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://amcegyadzphuvqtlseuf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtY2VneWFkenBodXZxdGxzZXVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1OTY4MTAsImV4cCI6MjA3NDE3MjgxMH0.geKae1U4qgI3JmJUPNQ5p7uho_dDy3NHC-0nEFJlP00'

const supabase = createClient(supabaseUrl, supabaseKey)

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  try {
    const { imageUrl, fileName } = req.body

    if (!imageUrl || !fileName) {
      return res.status(400).json({ message: 'Image URL and filename are required' })
    }

    // Download image from URL
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      return res.status(400).json({ message: 'Failed to download image' })
    }

    const imageBuffer = await imageResponse.arrayBuffer()
    const imageBlob = new Blob([imageBuffer])

    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from('fashion-images')
      .upload(fileName, imageBlob, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) {
      console.error('Upload error:', error)
      return res.status(500).json({ message: 'Failed to upload image: ' + error.message })
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('fashion-images')
      .getPublicUrl(fileName)

    res.status(200).json({
      success: true,
      path: data.path,
      url: urlData.publicUrl,
      fileName: fileName
    })

  } catch (error) {
    console.error('Storage upload error:', error)
    res.status(500).json({ message: 'Server error: ' + error.message })
  }
}
