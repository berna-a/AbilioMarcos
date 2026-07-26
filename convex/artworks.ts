import { query } from "./_generated/server";
import { v } from "convex/values";

export const getPublishedArtworks = query({
  args: {},
  handler: async (ctx) => {
    const list = await ctx.db.query("artworks").collect();
    return list.filter(
      (a) =>
        a.status === "published" &&
        ["available", "exhibition"].includes(a.availability || "") &&
        a.primary_image_url
    ).sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0));
  },
});

export const getFeaturedArtworks = query({
  args: {},
  handler: async (ctx) => {
    const list = await ctx.db.query("artworks").collect();
    return list
      .filter((a) => a.status === "published" && a.is_featured)
      .sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0))
      .slice(0, 3);
  },
});

export const getRecentArtworks = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 6;
    const list = await ctx.db.query("artworks").collect();
    return list
      .filter(
        (a) =>
          a.status === "published" &&
          ["available", "exhibition"].includes(a.availability || "") &&
          a.primary_image_url
      )
      .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
      .slice(0, limit);
  },
});

export const getArtworkBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const item = await ctx.db
      .query("artworks")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (item && item.status === "published") {
      return item;
    }
    return null;
  },
});

export const getRelatedArtworks = query({
  args: { currentId: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 3;
    const list = await ctx.db.query("artworks").collect();
    return list
      .filter((a) => a.status === "published" && a._id !== args.currentId && a.old_id !== args.currentId)
      .sort((a, b) => (Number(b.year) || 0) - (Number(a.year) || 0))
      .slice(0, limit);
  },
});

export const getArtworksBySlugs = query({
  args: { slugs: v.array(v.string()) },
  handler: async (ctx, args) => {
    const list = await ctx.db.query("artworks").collect();
    const map = new Map(list.map((a) => [a.slug, a]));
    return args.slugs.map((s) => map.get(s)).filter(Boolean);
  },
});
