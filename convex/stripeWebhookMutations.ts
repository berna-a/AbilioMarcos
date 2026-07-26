import { internalMutation } from "./_generated/server";
import { v } from "convex/values";
import { nowPg } from "./lib/time";
import { Id } from "./_generated/dataModel";

// Dedup guard mirrors the original `select ... where stripe_session_id = ?`
// check before insert — Stripe retries webhooks, this must stay idempotent.
export const recordOrderIfNew = internalMutation({
  args: {
    artwork_id: v.union(v.string(), v.null()),
    artwork_title: v.union(v.string(), v.null()),
    stripe_session_id: v.string(),
    customer_email: v.union(v.string(), v.null()),
    amount: v.number(),
    currency: v.string(),
    payment_status: v.string(),
    session_id: v.union(v.string(), v.null()),
    attribution: v.any(),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const existing = await ctx.db
      .query("orders")
      .withIndex("by_stripe_session_id", (q) => q.eq("stripe_session_id", args.stripe_session_id))
      .first();
    if (existing) return false;

    await ctx.db.insert("orders", {
      artwork_id: args.artwork_id,
      artwork_title: args.artwork_title,
      stripe_session_id: args.stripe_session_id,
      customer_email: args.customer_email,
      amount: args.amount,
      currency: args.currency,
      payment_status: args.payment_status,
      shipping_status: "aguarda_envio",
      session_id: args.session_id,
      attribution: args.attribution,
      created_at: nowPg(),
    });
    return true;
  },
});

export const markArtworkSold = internalMutation({
  args: { artwork_id: v.string() },
  handler: async (ctx, args) => {
    let doc;
    try {
      doc = await ctx.db.get(args.artwork_id as Id<"artworks">);
    } catch {
      return;
    }
    if (!doc || doc.availability !== "available") return; // matches the original's `.eq('availability','available')` guard
    await ctx.db.patch(doc._id, { availability: "sold", updated_at: nowPg() });
  },
});
