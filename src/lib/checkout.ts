import { supabase } from '@/lib/supabase';

export interface CheckoutResult {
  url: string | null;
  error: string | null;
}

/** Invoke the create-checkout edge function and return either a Stripe URL or
 *  a useful error reason surfaced from the backend. */
export const createCheckoutSession = async (artworkId: string): Promise<CheckoutResult> => {
  try {
    const { data, error } = await supabase.functions.invoke('create-checkout', {
      body: { artwork_id: artworkId },
    });

    if (error) {
      // Try to extract the backend error body returned by the edge function
      let backendMessage: string | null = null;
      const ctx = (error as { context?: Response }).context;
      if (ctx && typeof ctx.text === 'function') {
        try {
          const txt = await ctx.text();
          if (txt) {
            try {
              const parsed = JSON.parse(txt);
              backendMessage = parsed?.error ?? null;
            } catch {
              backendMessage = txt;
            }
          }
        } catch { /* ignore */ }
      }
      const message = backendMessage || error.message || 'Unknown checkout error';
      console.error('[checkout] edge function error:', message, { artworkId, raw: error });
      return { url: null, error: message };
    }

    if (!data?.url) {
      console.error('[checkout] missing url in response', { artworkId, data });
      return { url: null, error: 'No checkout URL returned' };
    }

    return { url: data.url, error: null };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Network error';
    console.error('[checkout] unexpected error:', message, { artworkId, error: e });
    return { url: null, error: message };
  }
};
