import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

/**
 * Single source of truth for online checkout eligibility.
 * MUST mirror `isOnlineCheckoutEligible` in src/lib/types.ts.
 *
 * Eligibility rule (ALL must be true):
 *   - status === 'published'
 *   - availability === 'available' (excludes 'sold' AND 'not_for_sale')
 *   - price is a positive finite number
 */
function checkEligibility(artwork: {
  status: string | null;
  availability: string | null;
  price: number | null;
}): { ok: true } | { ok: false; reason: string; httpStatus: number } {
  if (artwork.status !== "published") {
    return { ok: false, reason: "artwork_not_published", httpStatus: 409 };
  }
  if (artwork.availability === "sold") {
    return { ok: false, reason: "artwork_sold", httpStatus: 409 };
  }
  if (artwork.availability === "not_for_sale") {
    return { ok: false, reason: "artwork_not_for_sale", httpStatus: 409 };
  }
  if (artwork.availability !== "available") {
    return { ok: false, reason: "artwork_unavailable", httpStatus: 409 };
  }
  const price = artwork.price;
  if (price == null || !Number.isFinite(price) || price <= 0) {
    return { ok: false, reason: "artwork_no_valid_price", httpStatus: 400 };
  }
  return { ok: true };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { artwork_id } = await req.json();
    if (!artwork_id) {
      return new Response(JSON.stringify({ error: "artwork_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: artwork, error: artworkError } = await supabase
      .from("artworks")
      .select("id, title, slug, price, availability, status, primary_image_url")
      .eq("id", artwork_id)
      .single();

    if (artworkError || !artwork) {
      console.error("[create-checkout] artwork not found", { artwork_id, artworkError });
      return new Response(JSON.stringify({ error: "Artwork not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const eligibility = checkEligibility({
      status: artwork.status,
      availability: artwork.availability,
      price: artwork.price,
    });

    if (!eligibility.ok) {
      // Detailed internal log + structured error response so the frontend
      // can surface a useful reason and we can debug stale data quickly.
      console.error("[create-checkout] not eligible", {
        artwork_id,
        slug: artwork.slug,
        status: artwork.status,
        availability: artwork.availability,
        price: artwork.price,
        reason: eligibility.reason,
      });
      return new Response(
        JSON.stringify({
          error: "This artwork is not available for purchase",
          reason: eligibility.reason,
        }),
        { status: eligibility.httpStatus, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
      httpClient: Stripe.createFetchHttpClient(),
    });

    const siteUrl = Deno.env.get("SITE_URL") || "https://abiliomarcos.com";
    const origin = siteUrl.replace(/\/+$/, "");

    const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = {
      quantity: 1,
      price_data: {
        currency: "eur",
        unit_amount: Math.round(artwork.price! * 100),
        product_data: {
          name: artwork.title,
          description: artwork.technique || "Original painting",
          ...(artwork.primary_image_url ? { images: [artwork.primary_image_url] } : {}),
        },
      },
    };

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [lineItem],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel?artwork=${artwork.slug}`,
      metadata: {
        artwork_id: artwork.id,
        artwork_title: artwork.title,
        artwork_slug: artwork.slug,
      },
    });

    console.log("[create-checkout] session created", {
      artwork_id: artwork.id,
      slug: artwork.slug,
      session_id: session.id,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[create-checkout] unexpected error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
