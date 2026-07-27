import { httpRouter } from "convex/server";
import { auth } from "./auth";
import { handleStripeWebhook } from "./stripeWebhook";
import { handleResolveWhatsAppLead } from "./whatsappLead";

const http = httpRouter();

// Rotas do Convex Auth (troca de tokens, etc.) — login nativo, tudo dentro
// do Convex.
auth.addHttpRoutes(http);

// Configurar no dashboard Stripe do Abílio como:
//   {VITE_CONVEX_SITE_URL}/stripe-webhook-021
http.route({ path: "/stripe-webhook-021", method: "POST", handler: handleStripeWebhook });

// Chamada server-to-server pelo AOS para resolver atribuição de leads
// WhatsApp — protegida por segredo partilhado (x-internal-secret), não por
// JWT de utilizador. Ver convex/whatsappLead.ts.
http.route({ path: "/resolve-whatsapp-lead-021", method: "POST", handler: handleResolveWhatsAppLead });

export default http;
