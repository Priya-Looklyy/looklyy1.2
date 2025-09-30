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
    const { imageId, approved, reason } = req.body

    if (!imageId || approved === undefined) {
      return res.status(400).json({ success: false, error: 'Image ID and approval status are required' })
    }

    console.log(`Processing training feedback for image ${imageId}: Approved=${approved}, Reason=${reason}`)

    // Update the image's training status
    const { error: updateError } = await supabase
      .from('fashion_images_new')
      .update({
        training_status: approved ? 'approved' : 'rejected',
        training_feedback: approved ? 'approved' : reason,
        training_timestamp: new Date().toISOString(),
        needs_training: false
      })
      .eq('id', imageId)

    if (updateError) {
      console.error('Error updating image training status:', updateError)
      return res.status(500).json({ success: false, error: updateError.message })
    }

    // Store learning patterns (if learning_patterns table exists)
    try {
      const { data: imageData, error: fetchError } = await supabase
        .from('fashion_images_new')
        .select('original_url, description, category')
        .eq('id', imageId)
        .single()

      if (!fetchError && imageData) {
        const patterns = []
        
        // Extract patterns from rejection reason
        if (!approved && reason) {
          patterns.push({
            pattern_type: 'rejection_reason_keyword',
            pattern_value: reason.toLowerCase(),
            feedback_type: 'rejected',
            confidence_score: 0.8
          })
        }

        // Extract patterns from URL/description
        if (!approved) {
          const text = `${imageData.original_url} ${imageData.description || ''}`.toLowerCase()
          
          // Common negative patterns
          const negativePatterns = ['poster', 'trailer', 'movie', 'face', 'headshot', 'portrait', 'selfie', 'collage', 'icon', 'logo']
          negativePatterns.forEach(pattern => {
            if (text.includes(pattern)) {
              patterns.push({
                pattern_type: 'content_keyword',
                pattern_value: pattern,
                feedback_type: 'rejected',
                confidence_score: 0.7
              })
            }
          })
        }

        // Store patterns if any were found
        if (patterns.length > 0) {
          const patternsWithImageId = patterns.map(p => ({ ...p, image_id: imageId }))
          
          const { error: patternError } = await supabase
            .from('learning_patterns')
            .insert(patternsWithImageId)

          if (patternError) {
            console.log('Pattern storage failed (table may not exist):', patternError.message)
          } else {
            console.log(`Stored ${patterns.length} learning patterns`)
          }
        }
      }
    } catch (patternError) {
      console.log('Pattern extraction failed:', patternError.message)
    }

    return res.status(200).json({ 
      success: true, 
      message: 'Training feedback processed successfully'
    })

  } catch (error) {
    console.error('Error processing training feedback:', error)
    return res.status(500).json({ success: false, error: error.message })
  }
}
