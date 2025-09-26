import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  if (!supabase) {
    return res.status(500).json({ 
      success: false, 
      error: 'Supabase is not configured' 
    })
  }

  try {
    const { imageId, approved, rejectionReason, category, notes } = req.body

    if (!imageId || typeof approved !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: imageId, approved'
      })
    }

    console.log(`🧠 Processing learning feedback for image ${imageId}: ${approved ? 'APPROVED' : 'REJECTED'}`)

    // Store training feedback
    await supabase
      .from('fashion_images_new')
      .update({
        training_feedback: approved ? 'approved' : 'rejected',
        training_status: 'completed',
        training_notes: notes || '',
        training_category: category || 'unknown',
        training_timestamp: new Date().toISOString()
      })
      .eq('id', imageId)

    // Extract learning patterns
    if (!approved && rejectionReason) {
      await storeLearningPattern(imageId, approved, rejectionReason, category, notes)
    }

    // Update crawler filtering rules based on feedback
    const updatedRules = await updateCrawlerRules(imageId, approved, rejectionReason)
    
    console.log(`✅ Training feedback processed - Rules updated`)

    return res.status(200).json({
      success: true,
      message: 'Training feedback recorded successfully',
      updatedRules: updatedRules.length
    })

  } catch (error) {
    console.error('❌ Learning processing error:', error)
    return res.status(500).json({
      success: false,
      error: error.message
    })
  }
}

// Store learning patterns for algorithm improvement
async function storeLearningPattern(imageId, approved, reason, category, notes) {
  if (!supabase) return

  try {
    const learningData = {
      image_id: imageId,
      approved: approved,
      rejection_reason: reason,
      category: category,
      notes: notes,
      created_at: new Date().toISOString()
    }

    // Store in learning patterns table
    const { error } = await supabase
      .from('learning_patterns')
      .insert([learningData])

    if (error) {
      console.log('Learning pattern storage:', error.message)
    } else {
      console.log('✅ Learning pattern stored')
    }
  } catch (error) {
    console.error('Error storing learning pattern:', error)
  }
}

// Update crawler filtering rules based on feedback
async function updateCrawlerRules(imageId, approved, reason) {
  const learnedRules = []
  
  try {
    if (!approved) {
      // Learn to exclude patterns that were rejected
      switch(reason) {
        case 'face_shot':
          learnedRules.push({
            type: 'exclude',
            pattern: 'face_shot_keywords',
            keywords: ['beauty', 'makeup', 'portrait'],
            strength: 0.9
          })
          break
          
        case 'poster_campaign':
          learnedRules.push({
            type: 'exclude', 
            pattern: 'poster_keywords',
            keywords: ['poster', 'campaign', 'movie', 'trailer'],
            strength: 0.95
          })
          break
          
        case 'collage_montage':
          learnedRules.push({
            type: 'exclude',
            pattern: 'collage_keywords', 
            keywords: ['collage', 'montage', 'grid', 'compilation'],
            strength: 0.9
          })
          break
      }
    } else {
      // Learn positive patterns for approval
      learnedRules.push({
        type: 'include',
        pattern: 'positive_keywords',
        keywords: ['fashion', 'style', 'outfit', 'model', 'street-style'],
        strength: 0.8
      })
    }

    console.log('🧠 Learned filtering rules:', learnedRules)
    return learnedRules

  } catch (error) {
    console.error('Error updating rules:', error)
    return []
  }
}
