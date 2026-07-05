import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Deployed as `create-checkout-021` on project hwpixsuovwxgilyfoszw (AOS).
// Uses the *_021 secrets — isolated from the ARDO/AOS Stripe account.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Tradução da técnica (espelha src/i18n/techniques.ts). A `technique` na BD está
// em PT canónico; mostramos no idioma de navegação do utilizador.
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

/** Descrição do produto no idioma de navegação do utilizador. */
function buildDescription(technique: string | null | undefined, lang: string): string {
  const l = ORIGINAL_LABEL[lang] ? lang : "pt";
  const base = ORIGINAL_LABEL[l];
  const tech = (technique ?? "").toString().trim();
  if (!tech) return base;
  // PT é a base canónica; para os outros idiomas traduz-se pelo mapa (fallback: PT).
  const localized = l === "pt" ? tech : (TECHNIQUE_TRANSLATIONS[tech]?.[l] ?? tech);
  return `${base} — ${localized}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY_021");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY_021 not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      db: { schema: "cliente_021" },
    });

    const { artwork_id, lang, session_id, attribution } = await req.json();
    if (!artwork_id) {
      return new Response(JSON.stringify({ error: "artwork_id is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    // Idioma de navegação (pt/en/fr/de/es). Default: pt.
    const userLang = typeof lang === "string" && ORIGINAL_LABEL[lang] ? lang : "pt";

    // Fetch artwork
    const { data: artwork, error: artworkError } = await supabase
      .from("artworks")
      .select("id, title, slug, price, availability, status, primary_image_url, reference, technique")
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
        { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } }
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

    const siteUrl = Deno.env.get("SITE_URL_021") ?? Deno.env.get("SITE_URL");
    if (!siteUrl) throw new Error("SITE_URL_021 not configured");
    const origin = siteUrl.replace(/\/+$/, "");

    const lineItem: Stripe.Checkout.SessionCreateParams.LineItem = {
      quantity: 1,
      price_data: {
        currency: "eur",
        unit_amount: Math.round(artwork.price * 100),
        product_data: {
          name: artwork.title,
          description: buildDescription(artwork.technique, userLang),
          ...(artwork.primary_image_url ? { images: [artwork.primary_image_url] } : {}),
        },
      },
    };

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      // Recuperação de carrinho abandonado: ao expirar a sessão (24h), o Stripe
      // gera um link de recuperação e envia email ao cliente — desde que este
      // tenha fornecido email e o toggle "Recover abandoned carts" esteja ativo
      // no dashboard da conta Stripe do Abílio.
      after_expiration: { recovery: { enabled: true } },
      // Sem payment_method_types nem automatic_payment_methods: o Stripe Checkout
      // mostra por defeito todos os métodos ativos no dashboard (MB WAY, Multibanco,
      // SEPA, cartão, etc.). [automatic_payment_methods é de PaymentIntents, não Checkout.]
      line_items: [lineItem],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}&value=${artwork.price}`,
      cancel_url: `${origin}/checkout/cancel?artwork=${artwork.slug}`,
      metadata: {
        artwork_id: artwork.id,
        artwork_title: artwork.title,
        artwork_slug: artwork.slug,
        artwork_reference: artwork.reference || "",
        event_source_url: `${origin}/artwork/${artwork.slug}`,
        // Atribuição de origem (UTM/referrer/sessão) — necessária para comissão por lead.
        session_id: typeof session_id === "string" ? session_id : "",
        attribution: attribution ? JSON.stringify(attribution).slice(0, 500) : "",
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
