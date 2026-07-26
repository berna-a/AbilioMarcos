import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Public — footer/inline newsletter signup form. No auth.
export const subscribe = mutation({
  args: { email: v.string(), attribution: v.optional(v.any()) },
  handler: async (ctx, args) => {
    const email = args.email.trim().toLowerCase();
    const existing = await ctx.db
      .query("newsletter_subscribers")
      .filter((q) => q.eq(q.field("email"), email))
      .first();
    if (existing) return; // already subscribed — silent no-op, same UX as before
    await ctx.db.insert("newsletter_subscribers", {
      email,
      attribution: args.attribution ?? null,
      created_at: new Date().toISOString(),
    });
  },
});
