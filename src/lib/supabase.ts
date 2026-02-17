import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

// Create Supabase client with fallback for missing env vars
let supabase: ReturnType<typeof createClient>;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables. Supabase features will be disabled.');
  // Create a mock client that won't crash the app
  supabase = createClient('https://placeholder.supabase.co', 'placeholder-key');
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };

// Submit waitlist function
export async function submitWaitlist(email: string, phone: string | null): Promise<{ success: boolean; error?: string }> {
  // Check if Supabase is properly configured
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
  
  if (!url || !key) {
    console.warn('Supabase not configured. Registration will be simulated.');
    // Simulate success for development/testing
    return {
      success: true,
    };
  }

  try {
    const { data, error } = await supabase
      .from('waitlist')
      .insert([
        {
          email,
          phone_number: phone,
        },
      ] as any)
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return {
        success: false,
        error: error.message || 'Failed to submit waitlist',
      };
    }

    return {
      success: true,
    };
  } catch (err) {
    console.error('Error submitting waitlist:', err);
    const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
    return {
      success: false,
      error: errorMessage,
    };
  }
}
