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
    const { review_type, sync_timestamp, images_available } = req.body

    console.log(`👁️ Setting up manual review: ${review_type} with ${images_available} images`)

    // Step 1: Get images that need review (untrained images)
    const { data: untrainedImages, error: fetchError } = await supabase
      .from('fashion_images_new')
      .select('*')
      .or('training_status.is.null,training_status.eq.pending')
      .order('created_at', { ascending: false })
      .limit(100) // Limit to 100 images for review

    if (fetchError) {
      console.error('❌ Error fetching untrained images:', fetchError.message)
      return res.status(500).json({ success: false, error: `Failed to fetch untrained images: ${fetchError.message}` })
    }

    console.log(`📋 Found ${untrainedImages?.length || 0} images needing review`)

    // Step 2: Create review session
    const reviewSession = {
      session_id: `review_${Date.now()}`,
      review_type: review_type,
      sync_timestamp: sync_timestamp,
      total_images: untrainedImages?.length || 0,
      images_reviewed: 0,
      images_approved: 0,
      images_rejected: 0,
      images_duplicates: 0,
      status: 'active',
      created_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString() // 6 hours
    }

    // Step 3: Store review session in database
    const { data: sessionData, error: sessionError } = await supabase
      .from('review_sessions')
      .insert([reviewSession])
      .select()

    if (sessionError) {
      console.error('❌ Error creating review session:', sessionError.message)
      return res.status(500).json({ success: false, error: `Failed to create review session: ${sessionError.message}` })
    }

    console.log(`✅ Created review session: ${reviewSession.session_id}`)

    // Step 4: Mark images as queued for review
    if (untrainedImages && untrainedImages.length > 0) {
      const { error: updateError } = await supabase
        .from('fashion_images_new')
        .update({ 
          training_status: 'queued',
          review_session_id: reviewSession.session_id,
          queued_at: new Date().toISOString()
        })
        .in('id', untrainedImages.map(img => img.id))

      if (updateError) {
        console.error('❌ Error updating image status:', updateError.message)
        return res.status(500).json({ success: false, error: `Failed to queue images: ${updateError.message}` })
      }

      console.log(`✅ Queued ${untrainedImages.length} images for review`)
    }

    // Step 5: Send notification (if configured)
    try {
      // This would integrate with your notification system
      console.log(`📧 Review notification: ${untrainedImages?.length || 0} images ready for review`)
    } catch (notificationError) {
      console.log('⚠️ Notification failed, continuing anyway:', notificationError.message)
    }

    return res.status(200).json({
      success: true,
      message: 'Manual review setup completed successfully',
      review_session: {
        session_id: reviewSession.session_id,
        total_images: untrainedImages?.length || 0,
        review_url: `https://looklyy04.vercel.app/training?session=${reviewSession.session_id}`,
        expires_at: reviewSession.expires_at
      },
      images_queued: untrainedImages?.length || 0,
      setup_timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Error setting up manual review:', error)
    return res.status(500).json({ success: false, error: error.message })
  }
}
