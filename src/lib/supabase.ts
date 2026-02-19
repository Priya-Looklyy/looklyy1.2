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

// Submit waitlist function - now uses API route to access server-side env vars
export async function submitWaitlist(email: string, phone: string | null): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('🌐 Calling /api/waitlist with:', { email, phone: phone ? 'provided' : 'not provided' });
    
    const response = await fetch('/api/waitlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        phone,
      }),
    });

    console.log('📡 API response status:', response.status, response.statusText);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API error response:', errorText);
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = { error: errorText || 'Unknown error' };
      }
      return {
        success: false,
        error: errorData.error || `Server error: ${response.status}`,
      };
    }

    const result = await response.json();
    console.log('📥 API response data:', result);

    if (!result.success) {
      return {
        success: false,
        error: result.error || 'Failed to submit waitlist. Please try again.',
      };
    }

    console.log('✅ Waitlist submission successful via API');
    return {
      success: true,
    };
  } catch (err) {
    console.error('❌ Error calling waitlist API:', err);
    const errorMessage = err instanceof Error ? err.message : 'Network error';
    return {
      success: false,
      error: `Failed to submit: ${errorMessage}. Please check your connection and try again.`,
    };
  }
}
