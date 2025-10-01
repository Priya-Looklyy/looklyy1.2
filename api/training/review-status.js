import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') return res.status(200).end()

  if (!supabase) {
    return res.status(500).json({ success: false, error: 'Supabase not configured' })
  }

  try {
    const { session_id } = req.query

    console.log(`📊 Checking review status for session: ${session_id || 'latest'}`)

    // Step 1: Get the latest active review session
    let sessionQuery = supabase
      .from('review_sessions')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(1)

    if (session_id) {
      sessionQuery = supabase
        .from('review_sessions')
        .select('*')
        .eq('session_id', session_id)
        .single()
    }

    const { data: session, error: sessionError } = await sessionQuery

    if (sessionError) {
      console.error('❌ Error fetching review session:', sessionError.message)
      return res.status(500).json({ success: false, error: `Failed to fetch review session: ${sessionError.message}` })
    }

    if (!session) {
      return res.status(404).json({ 
        success: false, 
        error: 'No active review session found',
        review_completed: false
      })
    }

    console.log(`📋 Review session found: ${session.session_id}`)

    // Step 2: Check if session has expired
    const now = new Date()
    const expiresAt = new Date(session.expires_at)
    
    if (now > expiresAt) {
      console.log(`⏰ Review session expired: ${session.session_id}`)
      
      // Mark session as expired
      await supabase
        .from('review_sessions')
        .update({ status: 'expired' })
        .eq('session_id', session.session_id)

      return res.status(200).json({
        success: true,
        review_completed: false,
        session_expired: true,
        session_id: session.session_id,
        expires_at: session.expires_at
      })
    }

    // Step 3: Get review statistics for this session
    const { data: reviewStats, error: statsError } = await supabase
      .from('fashion_images_new')
      .select('training_status, category')
      .eq('review_session_id', session.session_id)

    if (statsError) {
      console.error('❌ Error fetching review stats:', statsError.message)
      return res.status(500).json({ success: false, error: `Failed to fetch review stats: ${statsError.message}` })
    }

    // Step 4: Calculate review progress
    const totalImages = reviewStats?.length || 0
    const reviewedImages = reviewStats?.filter(img => 
      img.training_status === 'approved' || 
      img.training_status === 'rejected' ||
      img.category?.includes('_approved') ||
      img.category?.includes('_rejected') ||
      img.category?.includes('_duplicate')
    ).length || 0

    const approvedImages = reviewStats?.filter(img => 
      img.training_status === 'approved' || img.category?.includes('_approved')
    ).length || 0

    const rejectedImages = reviewStats?.filter(img => 
      img.training_status === 'rejected' || img.category?.includes('_rejected')
    ).length || 0

    const duplicateImages = reviewStats?.filter(img => 
      img.category?.includes('_duplicate')
    ).length || 0

    const isCompleted = reviewedImages >= totalImages && totalImages > 0

    console.log(`📊 Review progress: ${reviewedImages}/${totalImages} (${Math.round(reviewedImages/totalImages*100)}%)`)

    // Step 5: If completed, mark session as completed
    if (isCompleted && session.status === 'active') {
      console.log(`✅ Review session completed: ${session.session_id}`)
      
      await supabase
        .from('review_sessions')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString(),
          images_reviewed: reviewedImages,
          images_approved: approvedImages,
          images_rejected: rejectedImages,
          images_duplicates: duplicateImages
        })
        .eq('session_id', session.session_id)
    }

    return res.status(200).json({
      success: true,
      review_completed: isCompleted,
      session_id: session.session_id,
      review_progress: {
        total_images: totalImages,
        images_reviewed: reviewedImages,
        images_approved: approvedImages,
        images_rejected: rejectedImages,
        images_duplicates: duplicateImages,
        completion_percentage: totalImages > 0 ? Math.round(reviewedImages/totalImages*100) : 0
      },
      session_info: {
        created_at: session.created_at,
        expires_at: session.expires_at,
        status: isCompleted ? 'completed' : session.status
      },
      review_url: `https://looklyy04.vercel.app/training?session=${session.session_id}`
    })

  } catch (error) {
    console.error('❌ Error checking review status:', error)
    return res.status(500).json({ success: false, error: error.message })
  }
}
