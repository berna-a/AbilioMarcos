import { supabase } from '@/lib/supabase';

export const createCheckoutSession = async (artworkId: string): Promise<string | null> => {
  const { data, error } = await supabase.functions.invoke('create-checkout', {
    body: { artwork_id: artworkId },
  });

  if (error) {
    console.error('Checkout error:', error);
    return null;
  }

  return data?.url || null;
};
