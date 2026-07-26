import { httpRouter } from "convex/server";
import { handleStripeWebhook } from "./stripeWebhook";
import { handleResolveWhatsAppLead } from "./whatsappLead";

const http = httpRouter();

// Configurar no dashboard Stripe do Abílio como:
//   {VITE_CONVEX_SITE_URL}/stripe-webhook-021
http.route({ path: "/stripe-webhook-021", method: "POST", handler: handleStripeWebhook });

// Chamada server-to-server pelo AOS para resolver atribuição de leads
// WhatsApp — protegida por segredo partilhado (x-internal-secret), não por
// JWT de utilizador. Ver convex/whatsappLead.ts.
http.route({ path: "/resolve-whatsapp-lead-021", method: "POST", handler: handleResolveWhatsAppLead });

export default http;
