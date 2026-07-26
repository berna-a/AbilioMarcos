// HTTP entry point for the Stripe webhook. Convex httpActions cannot run in
// the Node.js runtime, so this file has no "use node" and does the minimum
// possible here (pull the raw body + signature off the request) before
// handing off to the internalAction in stripeWebhookAction.ts, which does
// the actual Stripe SDK work.
//
// Endpoint once wired in the Stripe dashboard:
//   {VITE_CONVEX_SITE_URL}/stripe-webhook-021

import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

export const handleStripeWebhook = httpAction(async (ctx, request) => {
  const signature = request.headers.get("stripe-signature");
  if (!signature) return new Response("Missing signature", { status: 400 });

  const body = await request.text();
  const result = await ctx.runAction(internal.stripeWebhookAction.processWebhook, { body, signature });
  return new Response(result.body, {
    status: result.status,
    headers: { "Content-Type": "application/json" },
  });
});
