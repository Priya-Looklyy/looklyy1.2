import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Submit waitlist function
export async function submitWaitlist(email: string, phone: string | null): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('waitlist')
      .insert([
        {
          email,
          phone_number: phone,
        },
      ])
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
