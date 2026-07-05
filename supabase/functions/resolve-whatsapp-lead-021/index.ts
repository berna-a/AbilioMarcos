import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Deployed as `resolve-whatsapp-lead-021` on project hwpixsuovwxgilyfoszw (AOS).
// Chamada server-to-server pelo AOS (Convex) para ligar uma conversa de WhatsApp
// ao clique/campanha que a originou — via o código [cód: AB-XXXX] na 1.ª mensagem.
// Protegida por segredo partilhado (x-internal-secret), não por JWT de utilizador.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "content-type, x-internal-secret",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  const expectedSecret = Deno.env.get("WHATSAPP_LEAD_RESOLVER_SECRET_021");
  const providedSecret = req.headers.get("x-internal-secret");
  if (!expectedSecret || providedSecret !== expectedSecret) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { ref_code } = await req.json();
    if (typeof ref_code !== "string" || !ref_code.trim()) {
      return new Response(JSON.stringify({ error: "ref_code is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      db: { schema: "cliente_021" },
    });

    const { data, error } = await supabase
      .from("whatsapp_leads")
      .select("ref_code, session_id, attribution, artwork_id, artwork_title, created_at")
      .eq("ref_code", ref_code.trim())
      .maybeSingle();

    if (error) {
      console.error("resolve-whatsapp-lead-021: query error", error);
      return new Response(JSON.stringify({ error: "Internal error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!data) {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ attribution: data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("resolve-whatsapp-lead-021 error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
