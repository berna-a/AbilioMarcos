import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

export const listArtworksForImageBackfill = internalQuery({
  args: {},
  handler: async (ctx) => {
    const list = await ctx.db.query("artworks").collect();
    return list.map((a) => ({
      _id: a._id,
      title: a.title,
      primary_image_url: a.primary_image_url,
      additional_images: a.additional_images,
      primary_storage_id: a.primary_storage_id,
      additional_storage_ids: a.additional_storage_ids,
    }));
  },
});

export const patchArtworkStorage = internalMutation({
  args: {
    id: v.id("artworks"),
    primary_storage_id: v.optional(v.id("_storage")),
    additional_storage_ids: v.optional(v.array(v.id("_storage"))),
  },
  handler: async (ctx, args) => {
    const patch: Record<string, unknown> = {};
    if (args.primary_storage_id) {
      patch.primary_storage_id = args.primary_storage_id;
      // Storage id resolves the URL at read time from here on — drop the
      // baked-in absolute URL so nothing keeps pointing at one deployment.
      patch.primary_image_url = null;
    }
    if (args.additional_storage_ids && args.additional_storage_ids.length > 0) {
      patch.additional_storage_ids = args.additional_storage_ids;
      patch.additional_images = null;
    }
    if (Object.keys(patch).length > 0) {
      await ctx.db.patch(args.id, patch as never);
    }
  },
});
