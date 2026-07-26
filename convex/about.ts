import { query } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

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
