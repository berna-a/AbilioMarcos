import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

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

    // Fetch artwork
    const { data: artwork, error: artworkError } = await supabase
      .from("artworks")
      .select("id, title, slug, price, availability, status, primary_image_url")
      .eq("id", artwork_id)
      .single();

    if (artworkError || !artwork) {
      return new Response(JSON.stringify({ error: "Artwork not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (artwork.status !== "published" || artwork.availability !== "available") {
      return new Response(
        JSON.stringify({ error: "This artwork is not available for purchase" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!artwork.price || artwork.price <= 0) {
      return new Response(
        JSON.stringify({ error: "This artwork does not have a price set" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Only allow checkout for direct_purchase or hybrid (price <= 2999)
    if (artwork.price > 2999) {
      return new Response(
        JSON.stringify({ error: "This artwork is inquiry-only" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });

    const siteUrl = Deno.env.get("SITE_URL");
    if (!siteUrl) throw new Error("SITE_URL not configured");
    const origin = siteUrl.replace(/\/+$/, "");

    const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = {
      quantity: 1,
      price_data: {
        currency: "eur",
        unit_amount: Math.round(artwork.price * 100),
        product_data: {
          name: artwork.title,
          description: "Original oil on canvas",
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

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
