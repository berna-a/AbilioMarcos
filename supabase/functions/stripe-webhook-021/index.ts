import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import {
  customerConfirmationEmail,
  ownerNotificationEmail,
  sendEmail,
  type OrderEmailData,
} from "./emails.ts";

// Deployed as `stripe-webhook-021` on project hwpixsuovwxgilyfoszw (AOS).

const META_GRAPH_VERSION = "v19.0";

/** SHA-256 hex of a normalized (trimmed, lowercased) string — required by Meta CAPI for PII. */
async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input.trim().toLowerCase());
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Server-side Purchase via Meta Conversions API.
 * event_id is `purchase_<session.id>` — identical to the browser pixel on the
 * success page, so Meta deduplicates the two into a single Purchase.
 * Skips silently (logs only) if the CAPI secrets are not configured.
 */
async function sendMetaPurchase(session: Stripe.Checkout.Session): Promise<void> {
  const pixelId = Deno.env.get("META_PIXEL_ID");
  const accessToken = Deno.env.get("META_CAPI_ACCESS_TOKEN");
  if (!pixelId || !accessToken) {
    console.warn("Meta CAPI not configured (META_PIXEL_ID / META_CAPI_ACCESS_TOKEN) — skipping Purchase");
    return;
  }

  const email = session.customer_details?.email;
  const reference = session.metadata?.artwork_reference || "";
  const value = session.amount_total ? session.amount_total / 100 : 0;
  const currency = (session.currency || "eur").toUpperCase();

  const userData: Record<string, unknown> = {};
  if (email) userData.em = [await sha256Hex(email)];

  const payload = {
    data: [
      {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: `purchase_${session.id}`,
        action_source: "website",
        ...(session.metadata?.event_source_url
          ? { event_source_url: session.metadata.event_source_url }
          : {}),
        user_data: userData,
        custom_data: {
          currency,
          value,
          content_type: "product",
          content_ids: reference ? [reference] : [],
        },
      },
    ],
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/${META_GRAPH_VERSION}/${pixelId}/events?access_token=${accessToken}`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }
    );
    if (!res.ok) {
      console.error("Meta CAPI Purchase failed:", res.status, await res.text());
    }
  } catch (err) {
    console.error("Meta CAPI Purchase error:", err);
  }
}

/**
 * Confirmation email to the buyer + notification to Abílio/ARDO.
 * Isolated so a mail failure NEVER fails the webhook (Stripe would otherwise
 * retry and risk a duplicate order). Degrades silently if RESEND_API_KEY unset.
 */
async function sendOrderEmails(args: {
  session: Stripe.Checkout.Session;
  artwork: {
    title: string | null;
    slug: string | null;
    primary_image_url: string | null;
    technique: string | null;
    custom_width_cm: number | null;
    custom_height_cm: number | null;
  } | null;
}): Promise<void> {
  const { session, artwork } = args;
  try {
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) {
      console.warn("RESEND_API_KEY not set — skipping confirmation emails");
      return;
    }

    const siteUrl = Deno.env.get("SITE_URL_021") ?? Deno.env.get("SITE_URL") ?? "https://abiliomarcos.com";
    const fromEmail = Deno.env.get("ORDER_FROM_EMAIL_021") || "Abílio Marcos <encomendas@abiliomarcos.com>";
    const replyTo = Deno.env.get("ORDER_REPLY_TO_021") || "marcos4011@gmail.com";
    const notifyTo = (Deno.env.get("ORDER_NOTIFY_EMAIL_021") || "marcos4011@gmail.com,bernardo@ardo.partners")
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);

    const customerEmail = session.customer_details?.email || null;
    const amount = session.amount_total ? session.amount_total / 100 : 0;
    const currency = session.currency || "eur";

    const emailData: OrderEmailData = {
      artworkTitle: artwork?.title || session.metadata?.artwork_title || "a sua obra",
      artworkSlug: artwork?.slug || session.metadata?.artwork_slug || null,
      imageUrl: artwork?.primary_image_url || null,
      technique: artwork?.technique || null,
      widthCm: artwork?.custom_width_cm ?? null,
      heightCm: artwork?.custom_height_cm ?? null,
      amount,
      currency,
      customerEmail,
      sessionId: session.id,
      siteUrl,
    };

    if (customerEmail) {
      const { subject, html } = customerConfirmationEmail(emailData);
      const r = await sendEmail({ apiKey: resendKey, from: fromEmail, to: [customerEmail], replyTo, subject, html });
      if (!r.ok) console.error("Customer email failed:", r.status, r.body);
    }

    if (notifyTo.length) {
      const { subject, html } = ownerNotificationEmail(emailData);
      const r = await sendEmail({ apiKey: resendKey, from: fromEmail, to: notifyTo, replyTo: customerEmail || replyTo, subject, html });
      if (!r.ok) console.error("Owner email failed:", r.status, r.body);
    }
  } catch (mailErr) {
    console.error("Email send error (non-fatal):", mailErr);
  }
}

serve(async (req) => {
  // Conta Stripe PRÓPRIA do Abílio (isolada da do ARDO)
  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY_021");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET_021");
  if (!stripeKey || !webhookSecret) {
    return new Response("Server configuration error", { status: 500 });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new Response("Missing signature", { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      db: { schema: "cliente_021" },
    });

    const artworkId = session.metadata?.artwork_id;
    const artworkTitle = session.metadata?.artwork_title;

    // Full artwork record — reused for the duplicate guard AND the emails.
    let artwork:
      | {
          availability: string | null;
          title: string | null;
          slug: string | null;
          primary_image_url: string | null;
          technique: string | null;
          custom_width_cm: number | null;
          custom_height_cm: number | null;
        }
      | null = null;

    // Guard against duplicate sales
    if (artworkId) {
      const { data } = await supabase
        .from("artworks")
        .select("availability, title, slug, primary_image_url, technique, custom_width_cm, custom_height_cm")
        .eq("id", artworkId)
        .single();
      artwork = data;

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
      if (orderError) console.error("Failed to insert order:", orderError);

      // Buyer confirmation + owner notification (only on a genuinely new order).
      await sendOrderEmails({ session, artwork });
    }

    // Mark artwork as sold
    if (artworkId) {
      const { error: updateError } = await supabase
        .from("artworks")
        .update({ availability: "sold", updated_at: new Date().toISOString() })
        .eq("id", artworkId)
        .eq("availability", "available");
      if (updateError) console.error("Failed to update artwork availability:", updateError);
    }

    // Server-side Purchase (Meta CAPI) — deduped against the browser pixel by event_id
    await sendMetaPurchase(session);
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { "Content-Type": "application/json" },
  });
});
