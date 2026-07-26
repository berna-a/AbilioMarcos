import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";
import { requireAdmin } from "./lib/auth";

// Legacy field carried over from the Supabase migration — not yet declared
// in the Convex schema, so it's added here via intersection instead of `any`.
type WithDisplayOrder<T> = T & { display_order?: number };

export const getAboutSections = query({
  args: {},
  handler: async (ctx) => {
    const list = await ctx.db.query("about_content").collect();
    return list.sort(
      (a: WithDisplayOrder<Doc<"about_content">>, b: WithDisplayOrder<Doc<"about_content">>) =>
        (a.display_order || 0) - (b.display_order || 0)
    );
  },
});

export const getAboutContent = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("about_content").first();
  },
});

export const getExhibitions = query({
  args: {},
  handler: async (ctx) => {
    const list = await ctx.db.query("about_exhibitions").collect();
    return list.sort(
      (a: WithDisplayOrder<Doc<"about_exhibitions">>, b: WithDisplayOrder<Doc<"about_exhibitions">>) =>
        (a.display_order || 0) - (b.display_order || 0)
    );
  },
});

// Admin — only used by Artworks.tsx's "Traduzir tudo" bulk backfill button,
// which touches both artworks and about_content. The full About admin page
// (AboutContent.tsx) already ran on stub read-only functions before this
// migration (updateAboutSection etc. in src/lib/about-content.ts always
// returned false) and stays that way — out of scope here, not a regression.
export const getAllAboutContentAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    return ctx.db.query("about_content").collect();
  },
});

export const updateAboutTranslations = mutation({
  args: {
    id: v.id("about_content"),
    title_translations: v.optional(v.any()),
    content_translations: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const patch: { title_translations?: unknown; content_translations?: unknown } = {};
    if (args.title_translations !== undefined) patch.title_translations = args.title_translations;
    if (args.content_translations !== undefined) patch.content_translations = args.content_translations;
    await ctx.db.patch(args.id, patch);
  },
});
