import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Public writes from anonymous visitors — no auth. Kept intentionally
// permissive (any event_name/properties shape) to match how the site has
// always tracked ad-hoc event properties; abuse risk is low (write-only,
// no read path exposed to the public).

export const trackEvent = mutation({
  args: {
    event_name: v.string(),
    properties: v.optional(v.any()),
    session_id: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("analytics_events", {
      event_name: args.event_name,
      properties: args.properties ?? {},
      session_id: args.session_id,
      created_at: new Date().toISOString(),
    });
  },
});

export const logWhatsAppLead = mutation({
  args: {
    ref_code: v.string(),
    session_id: v.optional(v.string()),
    attribution: v.optional(v.any()),
    artwork_id: v.optional(v.string()),
    artwork_title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("whatsapp_leads", {
      ref_code: args.ref_code,
      session_id: args.session_id ?? null,
      attribution: args.attribution ?? null,
      artwork_id: args.artwork_id ?? null,
      artwork_title: args.artwork_title ?? null,
      created_at: new Date().toISOString(),
    });
  },
});
