import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { requireAdmin } from "./lib/auth";
import { nowPg } from "./lib/time";
import { resolveArtworkImages, resolveArtworkImagesList } from "./lib/images";

const ArtworkFields = {
  title: v.string(),
  slug: v.string(),
  year: v.number(),
  description: v.optional(v.union(v.string(), v.null())),
  status: v.string(),
  availability: v.string(),
  exhibition_name: v.optional(v.union(v.string(), v.null())),
  price: v.optional(v.union(v.number(), v.null())),
  technique: v.optional(v.union(v.string(), v.null())),
  // Stored as strings in every existing record (verified against live data)
  // — kept that way rather than widening the schema, since ~93 rows already
  // use v.union(v.string(), v.null()).
  custom_width_cm: v.optional(v.union(v.string(), v.null())),
  custom_height_cm: v.optional(v.union(v.string(), v.null())),
  reference: v.optional(v.union(v.string(), v.null())),
  is_featured: v.optional(v.boolean()),
  theme: v.optional(v.union(v.string(), v.null())),
  dominant_color: v.optional(v.union(v.string(), v.null())),
  art_style: v.optional(v.union(v.string(), v.null())),
  title_translations: v.optional(v.any()),
  description_translations: v.optional(v.any()),
};

// Full unfiltered list for the admin table (Artworks.tsx) — the public
// queries in artworks.ts only ever return published/available works.
export const getAllArtworksAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const list = await ctx.db.query("artworks").collect();
    return resolveArtworkImagesList(ctx, list);
  },
});

// Lightweight — Dashboard.tsx just needs the "sold" count, not full docs
// with resolved image URLs for all 94 artworks.
export const getAvailabilityCountsAdmin = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx);
    const list = await ctx.db.query("artworks").collect();
    const counts: Record<string, number> = {};
    for (const a of list) {
      const key = a.availability ?? "unknown";
      counts[key] = (counts[key] ?? 0) + 1;
    }
    return counts;
  },
});

export const getArtworkByIdAdmin = query({
  args: { id: v.id("artworks") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const a = await ctx.db.get(args.id);
    if (!a) return null;
    return resolveArtworkImages(ctx, a);
  },
});

export const createArtwork = mutation({
  args: ArtworkFields,
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    return ctx.db.insert("artworks", {
      title: args.title,
      slug: args.slug,
      year: args.year,
      status: args.status,
      availability: args.availability,
      is_featured: args.is_featured,
      description: args.description ?? null,
      exhibition_name: args.exhibition_name ?? null,
      price: args.price ?? null,
      technique: args.technique ?? null,
      custom_width_cm: args.custom_width_cm ?? null,
      custom_height_cm: args.custom_height_cm ?? null,
      reference: args.reference ?? null,
      theme: args.theme ?? null,
      dominant_color: args.dominant_color ?? null,
      art_style: args.art_style ?? null,
      title_translations: args.title_translations ?? null,
      description_translations: args.description_translations ?? null,
      // Required-but-nullable legacy fields — every new artwork starts
      // without them; images are attached afterwards via setPrimaryImage.
      primary_image_url: null,
      additional_images: null,
      purchase_url: null,
      size_category: null,
      created_at: nowPg(),
      updated_at: nowPg(),
    });
  },
});

// Partial patch — covers both the full ArtworkForm save and the quick
// inline edits on the list page (availability dropdown, ★ toggle).
export const updateArtwork = mutation({
  args: {
    id: v.id("artworks"),
    patch: v.object({
      title: v.optional(v.string()),
      slug: v.optional(v.string()),
      year: v.optional(v.number()),
      description: v.optional(v.union(v.string(), v.null())),
      status: v.optional(v.string()),
      availability: v.optional(v.string()),
      exhibition_name: v.optional(v.union(v.string(), v.null())),
      price: v.optional(v.union(v.number(), v.null())),
      technique: v.optional(v.union(v.string(), v.null())),
      custom_width_cm: v.optional(v.union(v.string(), v.null())),
      custom_height_cm: v.optional(v.union(v.string(), v.null())),
      reference: v.optional(v.union(v.string(), v.null())),
      is_featured: v.optional(v.boolean()),
      theme: v.optional(v.union(v.string(), v.null())),
      dominant_color: v.optional(v.union(v.string(), v.null())),
      art_style: v.optional(v.union(v.string(), v.null())),
      title_translations: v.optional(v.any()),
      description_translations: v.optional(v.any()),
    }),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.id, { ...args.patch, updated_at: nowPg() });
  },
});

export const deleteArtwork = mutation({
  args: { id: v.id("artworks") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.delete(args.id);
  },
});

// Image upload flow: ArtworkForm calls files.generateUploadUrl (admin-gated)
// to get a short-lived upload URL, POSTs the file to it directly (browser →
// Convex, no server round-trip for bytes), then calls one of these to attach
// the resulting storageId to the artwork.
export const setPrimaryImage = mutation({
  args: { id: v.id("artworks"), storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.id, { primary_storage_id: args.storageId, primary_image_url: null });
  },
});

export const addAdditionalImage = mutation({
  args: { id: v.id("artworks"), storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const a = await ctx.db.get(args.id);
    if (!a) throw new Error("Artwork not found");
    const next = [...(a.additional_storage_ids ?? []), args.storageId];
    await ctx.db.patch(args.id, { additional_storage_ids: next, additional_images: null });
  },
});

export const removeAdditionalImage = mutation({
  args: { id: v.id("artworks"), storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    const a = await ctx.db.get(args.id);
    if (!a) throw new Error("Artwork not found");
    const next = (a.additional_storage_ids ?? []).filter((s) => s !== args.storageId);
    await ctx.db.patch(args.id, { additional_storage_ids: next });
  },
});

// Bulk replace — ArtworkForm builds the final list locally (add/remove any
// number of times before Guardar) and reconciles in one call on submit,
// rather than one round-trip per add/remove while editing a draft.
export const setAdditionalImages = mutation({
  args: { id: v.id("artworks"), storageIds: v.array(v.id("_storage")) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx);
    await ctx.db.patch(args.id, {
      additional_storage_ids: args.storageIds,
      additional_images: null,
    });
  },
});
