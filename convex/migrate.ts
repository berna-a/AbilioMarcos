import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";

export const updateArtworkImages = mutation({
  args: {
    id: v.id("artworks"),
    primary_image_url: v.optional(v.string()),
    secondary_image_urls: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const patch: Record<string, unknown> = {};
    if (args.primary_image_url !== undefined) {
      patch.primary_image_url = args.primary_image_url;
    }
    if (args.secondary_image_urls !== undefined) {
      patch.secondary_image_urls = args.secondary_image_urls;
    }
    await ctx.db.patch(args.id, patch as Partial<Doc<"artworks">>);
  },
});

export const updateAboutImages = mutation({
  args: {
    id: v.id("about_content"),
    hero_image_url: v.optional(v.string()),
    portrait_image_url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const patch: Record<string, unknown> = {};
    if (args.hero_image_url !== undefined) {
      patch.hero_image_url = args.hero_image_url;
    }
    if (args.portrait_image_url !== undefined) {
      patch.portrait_image_url = args.portrait_image_url;
    }
    await ctx.db.patch(args.id, patch as Partial<Doc<"about_content">>);
  },
});
