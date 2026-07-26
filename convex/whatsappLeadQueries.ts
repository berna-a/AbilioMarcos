import { internalQuery } from "./_generated/server";
import { v } from "convex/values";

export const findByRefCode = internalQuery({
  args: { ref_code: v.string() },
  handler: async (ctx, args) => {
    const doc = await ctx.db
      .query("whatsapp_leads")
      .withIndex("by_ref_code", (q) => q.eq("ref_code", args.ref_code))
      .first();
    if (!doc) return null;
    return {
      ref_code: doc.ref_code,
      session_id: doc.session_id,
      attribution: doc.attribution,
      artwork_id: doc.artwork_id,
      artwork_title: doc.artwork_title,
      created_at: doc.created_at,
    };
  },
});
