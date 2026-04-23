import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

serve(async (req) => {
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!stripeKey || !webhookSecret) {
    console.error("Missing STRIPE_SECRET_KEY or STRIPE_WEBHOOK_SECRET");
    return new Response("Server configuration error", { status: 500 });
  }

  const stripe = new Stripe(stripeKey, {
    apiVersion: "2023-10-16",
    httpClient: Stripe.createFetchHttpClient(),
  });
  const cryptoProvider = Stripe.createSubtleCryptoProvider();

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    // Deno/Edge Runtime requires the async variant (Web Crypto is async)
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret,
      undefined,
      cryptoProvider,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", (err as Error).message);
    return new Response(`Webhook Error: ${(err as Error).message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const artworkId = session.metadata?.artwork_id;
    const artworkTitle = session.metadata?.artwork_title;

    // Guard against duplicate sales
    if (artworkId) {
      const { data: artwork } = await supabase
        .from("artworks")
        .select("availability")
        .eq("id", artworkId)
        .single();

      if (artwork?.availability === "sold") {
        console.warn(`Artwork ${artworkId} already sold — skipping duplicate webhook`);
        return new Response(JSON.stringify({ received: true, skipped: true }), {
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // Check for duplicate order by stripe_session_id
    const { data: existingOrder } = await supabase
      .from("orders")
      .select("id")
      .eq("stripe_session_id", session.id)
      .maybeSingle();

    if (!existingOrder) {
      const { error: orderError } = await supabase.from("orders").insert({
        artwork_id: artworkId || null,
        artwork_title: artworkTitle || null,
        stripe_session_id: session.id,
        customer_email: session.customer_details?.email || null,
        amount: session.amount_total ? session.amount_total / 100 : 0,
        currency: session.currency || "eur",
        payment_status: session.payment_status || "paid",
      });

      if (orderError) {
        console.error("Failed to insert order:", orderError);
      }
    }

    // Mark artwork as sold (atomic: only flips when still available)
    if (artworkId) {
      const { error: updateError } = await supabase
        .from("artworks")
        .update({ availability: "sold", updated_at: new Date().toISOString() })
        .eq("id", artworkId)
        .eq("availability", "available");

      if (updateError) {
        console.error("Failed to update artwork availability:", updateError);
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
