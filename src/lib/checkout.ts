import { getConvexClient } from '@/lib/convexClient';
import { api } from '../../convex/_generated/api';
import { getAnalyticsSessionId, getAttribution } from '@/lib/analytics';

export interface CheckoutResult {
  url: string | null;
  error: string | null;
}

/** Invoke the createCheckoutSession Convex action and return either a Stripe
 *  URL or a useful error reason surfaced from the backend. */
export const createCheckoutSession = async (artworkId: string, lang?: string): Promise<CheckoutResult> => {
  try {
    const data = await getConvexClient().action(api.checkout.createCheckoutSession, {
      artwork_id: artworkId,
      lang: lang ?? 'pt',
      // Carimba a sessão com a origem (UTM/referrer/landing) para atribuição de comissão.
      session_id: getAnalyticsSessionId(),
      attribution: getAttribution(),
    });

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
