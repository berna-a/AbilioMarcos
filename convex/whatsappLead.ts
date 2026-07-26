// Portado de supabase/functions/resolve-whatsapp-lead-021/index.ts.
// Chamada server-to-server pelo AOS para ligar uma conversa de WhatsApp ao
// clique/campanha que a originou, via o código [cód: AB-XXXX]. Protegida por
// segredo partilhado (x-internal-secret), não por JWT de utilizador — mesmo
// contrato do original.
//
// Precisa de WHATSAPP_LEAD_RESOLVER_SECRET_021 nas env vars do Convex:
//   npx convex env set WHATSAPP_LEAD_RESOLVER_SECRET_021 <valor>
// Sem isto configurado, a rota rejeita SEMPRE (nunca abre por omissão).

import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, x-internal-secret",
};

export const handleResolveWhatsAppLead = httpAction(async (ctx, request) => {
  const expectedSecret = process.env.WHATSAPP_LEAD_RESOLVER_SECRET_021;
  const providedSecret = request.headers.get("x-internal-secret");
  if (!expectedSecret || providedSecret !== expectedSecret) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { ref_code } = await request.json();
    if (typeof ref_code !== "string" || !ref_code.trim()) {
      return new Response(JSON.stringify({ error: "ref_code is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const attribution = await ctx.runQuery(internal.whatsappLeadQueries.findByRefCode, {
      ref_code: ref_code.trim(),
    });

    if (!attribution) {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ attribution }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("resolve-whatsapp-lead-021 error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
