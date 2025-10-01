import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') return res.status(200).end()

  if (!supabase) {
    return res.status(500).json({ success: false, error: 'Supabase not configured' })
  }

  try {
    const { sync_type, crawl_timestamp } = req.body

    console.log(`🔄 Starting user database sync: ${sync_type} at ${crawl_timestamp}`)

    if (sync_type === 'heart_marked_only') {
      // Step 1: Get all images from global database
      const { data: globalImages, error: globalError } = await supabase
        .from('fashion_images_new')
        .select('*')
        .order('created_at', { ascending: false })

      if (globalError) {
        console.error('❌ Error fetching global images:', globalError.message)
        return res.status(500).json({ success: false, error: `Failed to fetch global images: ${globalError.message}` })
      }

      console.log(`📊 Found ${globalImages?.length || 0} images in global database`)

      // Step 2: Get user's heart-marked (approved) images
      const { data: userApproved, error: userError } = await supabase
        .from('user_favorites')
        .select('image_id, original_url')
        .eq('is_heart_marked', true)

      if (userError) {
        console.error('❌ Error fetching user favorites:', userError.message)
        return res.status(500).json({ success: false, error: `Failed to fetch user favorites: ${userError.message}` })
      }

      console.log(`❤️ Found ${userApproved?.length || 0} heart-marked images`)

      // Step 3: Create approved URLs set for fast lookup
      const approvedUrls = new Set(userApproved?.map(fav => fav.original_url) || [])

      // Step 4: Filter global images to keep only heart-marked ones
      const imagesToKeep = globalImages?.filter(img => approvedUrls.has(img.original_url)) || []
      const imagesToRemove = globalImages?.filter(img => !approvedUrls.has(img.original_url)) || []

      console.log(`✅ Will keep ${imagesToKeep.length} heart-marked images`)
      console.log(`🗑️ Will remove ${imagesToRemove.length} non-heart-marked images`)

      // Step 5: Remove non-heart-marked images from global database
      let removedCount = 0
      if (imagesToRemove.length > 0) {
        const { error: deleteError } = await supabase
          .from('fashion_images_new')
          .delete()
          .in('id', imagesToRemove.map(img => img.id))

        if (deleteError) {
          console.error('❌ Error removing non-heart-marked images:', deleteError.message)
          return res.status(500).json({ success: false, error: `Failed to remove images: ${deleteError.message}` })
        }

        removedCount = imagesToRemove.length
        console.log(`✅ Successfully removed ${removedCount} non-heart-marked images`)
      }

      // Step 6: Update user database with current heart-marked images
      if (imagesToKeep.length > 0) {
        // Clear existing user database
        const { error: clearError } = await supabase
          .from('user_database')
          .delete()
          .neq('id', 0) // Delete all records

        if (clearError) {
          console.error('⚠️ Error clearing user database:', clearError.message)
          // Continue anyway
        }

        // Insert heart-marked images into user database
        const userImages = imagesToKeep.map(img => ({
          original_url: img.original_url,
          title: img.title,
          description: img.description,
          category: img.category,
          is_heart_marked: true,
          synced_at: new Date().toISOString(),
          global_image_id: img.id
        }))

        const { error: insertError } = await supabase
          .from('user_database')
          .insert(userImages)

        if (insertError) {
          console.error('❌ Error inserting into user database:', insertError.message)
          return res.status(500).json({ success: false, error: `Failed to sync user database: ${insertError.message}` })
        }

        console.log(`✅ Successfully synced ${userImages.length} images to user database`)
      }

      return res.status(200).json({
        success: true,
        message: 'User database sync completed successfully',
        stats: {
          total_global_images: globalImages?.length || 0,
          heart_marked_images: userApproved?.length || 0,
          images_kept: imagesToKeep.length,
          images_removed: removedCount,
          user_database_synced: imagesToKeep.length
        },
        sync_timestamp: new Date().toISOString()
      })

    } else {
      return res.status(400).json({ success: false, error: 'Invalid sync_type. Use "heart_marked_only"' })
    }

  } catch (error) {
    console.error('❌ Error in user database sync:', error)
    return res.status(500).json({ success: false, error: error.message })
  }
}
