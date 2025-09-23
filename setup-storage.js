// Setup script to create Supabase storage bucket for Looklyy
// Run this to create the fashion-images bucket

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://amcegyadzphuvqtlseuf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtY2VneWFkenBodXZxdGxzZXVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1OTY4MTAsImV4cCI6MjA3NDE3MjgxMH0.geKae1U4qgI3JmJUPNQ5p7uho_dDy3NHC-0nEFJlP00'

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupStorage() {
  try {
    console.log('Setting up Supabase storage for Looklyy...')
    
    // Create the fashion-images bucket
    const { data, error } = await supabase.storage.createBucket('fashion-images', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      fileSizeLimit: 10485760 // 10MB
    })

    if (error) {
      if (error.message.includes('already exists')) {
        console.log('✅ Bucket "fashion-images" already exists')
      } else {
        console.error('❌ Error creating bucket:', error.message)
        return
      }
    } else {
      console.log('✅ Successfully created bucket "fashion-images"')
    }

    // Test upload a sample image
    console.log('Testing image upload...')
    
    // Create a simple test image (1x1 pixel PNG)
    const testImageData = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
    const testImageBuffer = Buffer.from(testImageData, 'base64')
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('fashion-images')
      .upload('test-image.png', testImageBuffer, {
        contentType: 'image/png'
      })

    if (uploadError) {
      console.error('❌ Error uploading test image:', uploadError.message)
    } else {
      console.log('✅ Test image uploaded successfully')
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('fashion-images')
        .getPublicUrl('test-image.png')
      
      console.log('📸 Test image URL:', urlData.publicUrl)
    }

    console.log('\n🎉 Storage setup complete!')
    console.log('You can now:')
    console.log('1. Go to your Supabase dashboard > Storage')
    console.log('2. See the "fashion-images" bucket')
    console.log('3. Upload images through the API or dashboard')

  } catch (error) {
    console.error('❌ Setup failed:', error.message)
  }
}

setupStorage()
