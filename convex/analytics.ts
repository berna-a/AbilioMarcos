import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { nowPg, cutoffPg } from "./lib/time";
import { requireAdmin } from "./lib/auth";

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
      created_at: nowPg(),
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
      created_at: nowPg(),
    });
  },
});

// Admin — Analytics.tsx raw event feed (KPIs/tables computed client-side,
// same as the old supabase.from('analytics_events').select(...) did).
// `sinceDays: null` = all time (period 'all' in the UI).
export const getAnalyticsEventsAdmin = query({
  args: { sinceDays: v.union(v.number(), v.null()), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const limit = args.limit ?? 5000;
    if (args.sinceDays === null) {
      return ctx.db.query("analytics_events").order("desc").take(limit);
    }
    const since = cutoffPg(args.sinceDays);
    const rows = await ctx.db
      .query("analytics_events")
      .withIndex("by_created_at", (q) => q.gte("created_at", since))
      .collect();
    return rows.sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? "")).slice(0, limit);
  },
});

// Admin — lightweight count for a single event type in a day window (used by
// Dashboard.tsx's "Interesse de compra" KPI + its vs-previous-month delta).
// `untilDaysAgo` lets the caller ask for a 30-60-days-ago window instead of
// always "since N days ago, to now".
export const countEventsAdmin = query({
  args: { event_name: v.string(), sinceDaysAgo: v.number(), untilDaysAgo: v.optional(v.number()) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const since = cutoffPg(args.sinceDaysAgo);
    const rows = await ctx.db
      .query("analytics_events")
      .withIndex("by_event_name_and_created_at", (q) => q.eq("event_name", args.event_name).gte("created_at", since))
      .collect();
    if (args.untilDaysAgo === undefined) return rows.length;
    const until = cutoffPg(args.untilDaysAgo);
    return rows.filter((r) => (r.created_at ?? "") < until).length;
  },
});
