// Note: Supabase operations are handled via API routes (/api/waitlist)
// This allows us to use server-side environment variables securely
// No client-side Supabase client is needed for the waitlist forms

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
