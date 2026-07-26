"use node";
// Actual Stripe processing for the webhook — split out from stripeWebhook.ts
// because Convex httpActions cannot run in the Node.js runtime ("use node"),
// only plain actions can. stripeWebhook.ts (no "use node") just extracts the
// raw body/signature from the HTTP request and calls `process` here.
//
// Precisa de STRIPE_SECRET_KEY_021, STRIPE_WEBHOOK_SECRET_021 e,
// opcionalmente, RESEND_API_KEY / ORDER_FROM_EMAIL_021 / ORDER_REPLY_TO_021 /
// ORDER_NOTIFY_EMAIL_021 / META_PIXEL_ID / META_CAPI_ACCESS_TOKEN nas env vars
// do Convex. Sem STRIPE_*_021, devolve 500 (o mesmo que o Supabase fazia) —
// nunca aceita um webhook sem poder verificar a assinatura. NUNCA testado
// com uma chave real (regra dura da migração) — só a lógica foi portada.

import Stripe from "stripe";
import { v } from "convex/values";
import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { customerConfirmationEmail, ownerNotificationEmail, sendEmail, type OrderEmailData } from "./lib/emails";

const META_GRAPH_VERSION = "v19.0";

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input.trim().toLowerCase());
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function sendMetaPurchase(session: Stripe.Checkout.Session): Promise<void> {
  const pixelId = process.env.META_PIXEL_ID;
  const accessToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !accessToken) {
    console.warn("Meta CAPI not configured — skipping Purchase");
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
        ...(session.metadata?.event_source_url ? { event_source_url: session.metadata.event_source_url } : {}),
        user_data: userData,
        custom_data: { currency, value, content_type: "product", content_ids: reference ? [reference] : [] },
      },
    ],
  };
  try {
    const res = await fetch(`https://graph.facebook.com/${META_GRAPH_VERSION}/${pixelId}/events?access_token=${accessToken}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) console.error("Meta CAPI Purchase failed:", res.status, await res.text());
  } catch (err) {
    console.error("Meta CAPI Purchase error:", err);
  }
}

async function sendOrderEmails(session: Stripe.Checkout.Session, artwork: {
  title: string | null; slug: string | null; primary_image_url: string | null;
  technique: string | null; custom_width_cm: string | null; custom_height_cm: string | null;
} | null): Promise<void> {
  try {
    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) { console.warn("RESEND_API_KEY not set — skipping confirmation emails"); return; }

    const siteUrl = process.env.SITE_URL_021 ?? process.env.SITE_URL ?? "https://abiliomarcos.com";
    const fromEmail = process.env.ORDER_FROM_EMAIL_021 || "Abílio Marcos <encomendas@abiliomarcos.com>";
    const replyTo = process.env.ORDER_REPLY_TO_021 || "marcos4011@gmail.com";
    const notifyTo = (process.env.ORDER_NOTIFY_EMAIL_021 || "marcos4011@gmail.com,bernardo@ardo.vc")
      .split(",").map((e) => e.trim()).filter(Boolean);

    const customerEmail = session.customer_details?.email || null;
    const amount = session.amount_total ? session.amount_total / 100 : 0;
    const currency = session.currency || "eur";

    const emailData: OrderEmailData = {
      artworkTitle: artwork?.title || session.metadata?.artwork_title || "a sua obra",
      artworkSlug: artwork?.slug || session.metadata?.artwork_slug || null,
      imageUrl: artwork?.primary_image_url || null,
      technique: artwork?.technique || null,
      widthCm: artwork?.custom_width_cm != null ? Number(artwork.custom_width_cm) : null,
      heightCm: artwork?.custom_height_cm != null ? Number(artwork.custom_height_cm) : null,
      amount, currency, customerEmail, sessionId: session.id, siteUrl,
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

function safeJsonParse(raw: string): unknown {
  try { return JSON.parse(raw); } catch { console.warn("Failed to parse order attribution metadata — storing null"); return null; }
}

export const processWebhook = internalAction({
  args: { body: v.string(), signature: v.string() },
  handler: async (ctx, args): Promise<{ status: number; body: string }> => {
    const stripeKey = process.env.STRIPE_SECRET_KEY_021;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET_021;
    if (!stripeKey || !webhookSecret) {
      return { status: 500, body: "Server configuration error" };
    }

    const stripe = new Stripe(stripeKey);
    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEventAsync(args.body, args.signature, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return { status: 400, body: `Webhook Error: ${err instanceof Error ? err.message : "invalid signature"}` };
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const artworkId = session.metadata?.artwork_id;
      const artworkTitle = session.metadata?.artwork_title;

      const artwork = artworkId
        ? await ctx.runQuery(internal.checkoutQueries.getArtworkForCheckout, { id: artworkId })
        : null;

      if (artwork?.availability === "sold") {
        console.warn(`Artwork ${artworkId} already sold — skipping duplicate webhook`);
        return { status: 200, body: JSON.stringify({ received: true, skipped: true }) };
      }

      const isNewOrder = await ctx.runMutation(internal.stripeWebhookMutations.recordOrderIfNew, {
        artwork_id: artworkId ?? null,
        artwork_title: artworkTitle ?? null,
        stripe_session_id: session.id,
        customer_email: session.customer_details?.email || null,
        amount: session.amount_total ? session.amount_total / 100 : 0,
        currency: session.currency || "eur",
        payment_status: session.payment_status || "paid",
        session_id: session.metadata?.session_id || null,
        attribution: session.metadata?.attribution ? safeJsonParse(session.metadata.attribution) : null,
      });

      if (isNewOrder) {
        await sendOrderEmails(session, artwork ? {
          title: artwork.title ?? null,
          slug: artwork.slug ?? null,
          primary_image_url: artwork.primary_image_url ?? null,
          technique: artwork.technique ?? null,
          custom_width_cm: artwork.custom_width_cm ?? null,
          custom_height_cm: artwork.custom_height_cm ?? null,
        } : null);
      }

      if (artworkId) {
        await ctx.runMutation(internal.stripeWebhookMutations.markArtworkSold, { artwork_id: artworkId });
      }

      await sendMetaPurchase(session);
    }

    return { status: 200, body: JSON.stringify({ received: true }) };
  },
});
