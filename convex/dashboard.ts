// Portado das 3 RPCs Postgres (cliente_021.dashboard_*) que o Dashboard.tsx
// chamava via supabase.rpc(...). Mesma lógica, reimplementada em JS sobre as
// tabelas Convex em vez de SQL/generate_series.
import { query, QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./lib/auth";
import { resolveArtworkImages } from "./lib/images";
import { cutoffPg as cutoffTimestamp } from "./lib/time";
import { Doc } from "./_generated/dataModel";

async function eventsSince(ctx: QueryCtx, eventName: string, since: string): Promise<Doc<"analytics_events">[]> {
  return ctx.db
    .query("analytics_events")
    .withIndex("by_event_name_and_created_at", (q) =>
      q.eq("event_name", eventName).gte("created_at", since),
    )
    .collect();
}

export const artworkEngagement = query({
  args: { p_days: v.optional(v.number()), p_limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const days = args.p_days ?? 30;
    const limit = args.p_limit ?? 20;
    const since = cutoffTimestamp(days);

    const [views, interests] = await Promise.all([
      eventsSince(ctx, "artwork_view", since),
      eventsSince(ctx, "acquire_online_clicked", since),
    ]);

    const viewCounts = new Map<string, number>();
    for (const e of views) {
      const slug = e.properties?.slug;
      if (typeof slug === "string") viewCounts.set(slug, (viewCounts.get(slug) ?? 0) + 1);
    }
    const interestCounts = new Map<string, number>();
    for (const e of interests) {
      const slug = e.properties?.slug;
      if (typeof slug === "string") interestCounts.set(slug, (interestCounts.get(slug) ?? 0) + 1);
    }

    const slugs = [...viewCounts.keys()];
    const artworksBySlug = new Map<string, Doc<"artworks">>();
    await Promise.all(
      slugs.map(async (slug) => {
        const a = await ctx.db
          .query("artworks")
          .withIndex("by_slug", (q) => q.eq("slug", slug))
          .first();
        if (a) artworksBySlug.set(slug, a);
      }),
    );

    const rows = await Promise.all(
      slugs
        .filter((slug) => artworksBySlug.has(slug))
        .map(async (slug) => {
          const a = artworksBySlug.get(slug)!;
          const resolved = await resolveArtworkImages(ctx, a);
          const viewCount = viewCounts.get(slug) ?? 0;
          const interestCount = interestCounts.get(slug) ?? 0;
          return {
            slug,
            title: a.title ?? "",
            image: resolved.primary_image_url ?? null,
            views: viewCount,
            interests: interestCount,
            rate: viewCount > 0 ? Math.round((interestCount / viewCount) * 1000) / 10 : 0,
          };
        }),
    );

    return rows.sort((a, b) => b.views - a.views).slice(0, limit);
  },
});

export const dailyVisits = query({
  args: { p_days: v.optional(v.number()) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const days = args.p_days ?? 30;
    const since = cutoffTimestamp(days);
    const pageViews = await eventsSince(ctx, "page_view", since);

    const counts = new Map<string, number>();
    for (const e of pageViews) {
      const day = (e.created_at ?? "").slice(0, 10); // "YYYY-MM-DD"
      if (day) counts.set(day, (counts.get(day) ?? 0) + 1);
    }

    const out: { day: string; visits: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
      out.push({ day: d, visits: counts.get(d) ?? 0 });
    }
    return out;
  },
});

const TAG_DIMENSIONS = ["theme", "dominant_color", "art_style"] as const;
type TagDimension = (typeof TAG_DIMENSIONS)[number];

export const tagBreakdown = query({
  args: { p_days: v.optional(v.number()), p_dimension: v.string() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    if (!TAG_DIMENSIONS.includes(args.p_dimension as TagDimension)) {
      throw new Error("invalid dimension");
    }
    const dimension = args.p_dimension as TagDimension;
    const days = args.p_days ?? 30;
    const since = cutoffTimestamp(days);

    const [views, interests] = await Promise.all([
      eventsSince(ctx, "artwork_view", since),
      eventsSince(ctx, "acquire_online_clicked", since),
    ]);

    const slugsInvolved = new Set<string>();
    for (const e of views) if (typeof e.properties?.slug === "string") slugsInvolved.add(e.properties.slug);
    for (const e of interests) if (typeof e.properties?.slug === "string") slugsInvolved.add(e.properties.slug);

    const tagBySlug = new Map<string, string>();
    await Promise.all(
      [...slugsInvolved].map(async (slug) => {
        const a = await ctx.db
          .query("artworks")
          .withIndex("by_slug", (q) => q.eq("slug", slug))
          .first();
        const tag = (a?.[dimension] as string | null | undefined) || "(sem classificação)";
        tagBySlug.set(slug, tag);
      }),
    );

    const viewsByTag = new Map<string, number>();
    for (const e of views) {
      const slug = e.properties?.slug;
      if (typeof slug !== "string") continue;
      const tag = tagBySlug.get(slug) ?? "(sem classificação)";
      viewsByTag.set(tag, (viewsByTag.get(tag) ?? 0) + 1);
    }
    const interestsByTag = new Map<string, number>();
    for (const e of interests) {
      const slug = e.properties?.slug;
      if (typeof slug !== "string") continue;
      const tag = tagBySlug.get(slug) ?? "(sem classificação)";
      interestsByTag.set(tag, (interestsByTag.get(tag) ?? 0) + 1);
    }

    const tags = new Set([...viewsByTag.keys(), ...interestsByTag.keys()]);
    const rows = [...tags].map((tag) => {
      const v = viewsByTag.get(tag) ?? 0;
      const i = interestsByTag.get(tag) ?? 0;
      return { tag, views: v, interests: i, rate: v > 0 ? Math.round((i / v) * 1000) / 10 : 0 };
    });
    return rows.sort((a, b) => b.views - a.views);
  },
});

