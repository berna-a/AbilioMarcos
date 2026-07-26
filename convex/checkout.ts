"use node";
// Portado de supabase/functions/create-checkout-021/index.ts.
//
// Precisa de STRIPE_SECRET_KEY_021 e SITE_URL_021 nas env vars do Convex:
//   npx convex env set STRIPE_SECRET_KEY_021 sk_test_...   (ou sk_live_...)
//   npx convex env set SITE_URL_021 https://abiliomarcos.com
// Mesma conta Stripe do Abílio já usada em produção — não tenho acesso ao
// valor da secret key, só quem já a tem (Bernardo/Abílio) a pode definir.
// NUNCA testei esta action com uma chave real (regra dura da migração).

import Stripe from "stripe";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

const TECHNIQUE_TRANSLATIONS: Record<string, Record<string, string>> = {
  "Óleo sobre tela": { en: "Oil on canvas", fr: "Huile sur toile", de: "Öl auf Leinwand", es: "Óleo sobre lienzo" },
  "Óleo s/ tela": { en: "Oil on canvas", fr: "Huile sur toile", de: "Öl auf Leinwand", es: "Óleo sobre lienzo" },
  "Acrílico sobre tela": { en: "Acrylic on canvas", fr: "Acrylique sur toile", de: "Acryl auf Leinwand", es: "Acrílico sobre lienzo" },
  "Acrílico s/ tela": { en: "Acrylic on canvas", fr: "Acrylique sur toile", de: "Acryl auf Leinwand", es: "Acrílico sobre lienzo" },
  "T. mista s/ tela": { en: "Mixed media on canvas", fr: "Technique mixte sur toile", de: "Mischtechnik auf Leinwand", es: "Técnica mixta sobre lienzo" },
  "T.mista s/tela": { en: "Mixed media on canvas", fr: "Technique mixte sur toile", de: "Mischtechnik auf Leinwand", es: "Técnica mixta sobre lienzo" },
  "T. mista s/ platex": { en: "Mixed media on board", fr: "Technique mixte sur panneau", de: "Mischtechnik auf Platte", es: "Técnica mixta sobre panel" },
  "Óleo s/ platex": { en: "Oil on board", fr: "Huile sur panneau", de: "Öl auf Platte", es: "Óleo sobre panel" },
  "Óleo sobre platex": { en: "Oil on board", fr: "Huile sur panneau", de: "Öl auf Platte", es: "Óleo sobre panel" },
  "T.M.": { en: "Mixed media", fr: "Technique mixte", de: "Mischtechnik", es: "Técnica mixta" },
  "Acrílico sobre tela (diptíco)": { en: "Acrylic on canvas (diptych)", fr: "Acrylique sur toile (diptyque)", de: "Acryl auf Leinwand (Diptychon)", es: "Acrílico sobre lienzo (díptico)" },
};

const ORIGINAL_LABEL: Record<string, string> = {
  pt: "Pintura original",
  en: "Original painting",
  fr: "Peinture originale",
  de: "Originalgemälde",
  es: "Pintura original",
};

function buildDescription(technique: string | null | undefined, lang: string): string {
  const l = ORIGINAL_LABEL[lang] ? lang : "pt";
  const base = ORIGINAL_LABEL[l];
  const tech = (technique ?? "").toString().trim();
  if (!tech) return base;
  const localized = l === "pt" ? tech : (TECHNIQUE_TRANSLATIONS[tech]?.[l] ?? tech);
  return `${base} — ${localized}`;
}

export const createCheckoutSession = action({
  args: {
    artwork_id: v.string(),
    lang: v.optional(v.string()),
    session_id: v.optional(v.string()),
    attribution: v.optional(v.any()),
  },
  handler: async (ctx, args): Promise<{ url: string }> => {
    const stripeKey = process.env.STRIPE_SECRET_KEY_021;
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY_021 not configured");
    const siteUrl = process.env.SITE_URL_021 ?? process.env.SITE_URL;
    if (!siteUrl) throw new Error("SITE_URL_021 not configured");
    const origin = siteUrl.replace(/\/+$/, "");

    const userLang = typeof args.lang === "string" && ORIGINAL_LABEL[args.lang] ? args.lang : "pt";

    const artwork = await ctx.runQuery(internal.checkoutQueries.getArtworkForCheckout, {
      id: args.artwork_id,
    });
    if (!artwork) throw new Error("Artwork not found");

    if (artwork.status !== "published" || artwork.availability !== "available") {
      throw new Error("This artwork is not available for purchase");
    }
    const price = Number(artwork.price);
    if (!price || price <= 0) throw new Error("This artwork does not have a price set");
    if (price > 2999) throw new Error("This artwork is inquiry-only");

    const stripe = new Stripe(stripeKey);

    const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = {
      quantity: 1,
      price_data: {
        currency: "eur",
        unit_amount: Math.round(price * 100),
        product_data: {
          name: artwork.title ?? "",
          description: buildDescription(artwork.technique, userLang),
          ...(artwork.primary_image_url ? { images: [artwork.primary_image_url] } : {}),
        },
      },
    };

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      // Recuperação de carrinho abandonado — igual ao comportamento anterior
      // no Supabase (v13): ao expirar a sessão (24h), o Stripe envia um link
      // de recuperação ao cliente se o toggle estiver activo no dashboard.
      after_expiration: { recovery: { enabled: true } },
      line_items: [lineItem],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&value=${price}`,
      cancel_url: `${origin}/checkout/cancel?artwork=${artwork.slug}`,
      metadata: {
        artwork_id: artwork._id,
        artwork_title: artwork.title ?? "",
        artwork_slug: artwork.slug ?? "",
        artwork_reference: artwork.reference ?? "",
        event_source_url: `${origin}/artwork/${artwork.slug}`,
        session_id: typeof args.session_id === "string" ? args.session_id : "",
        attribution: args.attribution ? JSON.stringify(args.attribution).slice(0, 500) : "",
      },
    });

    if (!session.url) throw new Error("Stripe did not return a checkout URL");
    return { url: session.url };
  },
});
