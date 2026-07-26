import { internalQuery } from "./_generated/server";
import { v } from "convex/values";
import { resolveArtworkImages } from "./lib/images";
import { Id } from "./_generated/dataModel";

// Internal — only called from checkout.ts and stripeWebhook.ts (both run
// server-side, after the caller already decided which artwork_id to use).
// Not exposed to the client: unlike the public artworks.* queries, this
// doesn't filter by status/availability — createCheckoutSession enforces
// those business rules itself and returns a clear error either way.
export const getArtworkForCheckout = internalQuery({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    let doc;
    try {
      doc = await ctx.db.get(args.id as Id<"artworks">);
    } catch {
      return null;
    }
    if (!doc) return null;
    return resolveArtworkImages(ctx, doc);
  },
});
