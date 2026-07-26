import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./lib/auth";

// Public — the contact form. No auth (anonymous visitor submitting a lead).
export const createInquiry = mutation({
  args: {
    artwork_id: v.optional(v.union(v.string(), v.null())),
    artwork_title: v.optional(v.union(v.string(), v.null())),
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.union(v.string(), v.null())),
    message: v.string(),
    budget_range: v.optional(v.union(v.string(), v.null())),
    attribution: v.optional(v.any()),
    session_id: v.optional(v.union(v.string(), v.null())),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("inquiries", {
      ...args,
      status: "new",
      created_at: new Date().toISOString(),
    });
  },
});

// Admin — back-office inbox (Inquiries.tsx, Dashboard.tsx "leads recentes").
export const getInquiries = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const list = await ctx.db.query("inquiries").collect();
    return list.sort(
      (a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime(),
    );
  },
});

export const updateInquiryStatus = mutation({
  args: { id: v.id("inquiries"), status: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.id, { status: args.status });
  },
});
