import { Doc, Id } from "../_generated/dataModel";
import { QueryCtx } from "../_generated/server";

/**
 * Resolves an artwork's images for the client: prefers the Convex `_storage`
 * id (resolved fresh on every read, so it survives moving from `dev:` to
 * `prod:`) and falls back to the legacy absolute URL (still Supabase for a
 * handful of not-for-sale works, or a stale dev.convex.cloud URL for
 * anything not yet backfilled).
 */
export async function resolveArtworkImages(
  ctx: QueryCtx,
  artwork: Doc<"artworks">,
): Promise<Doc<"artworks">> {
  const primary_image_url = artwork.primary_storage_id
    ? (await ctx.storage.getUrl(artwork.primary_storage_id)) ?? artwork.primary_image_url
    : artwork.primary_image_url;

  let additional_images = artwork.additional_images;
  if (artwork.additional_storage_ids && artwork.additional_storage_ids.length > 0) {
    const urls = await Promise.all(
      artwork.additional_storage_ids.map((id: Id<"_storage">) => ctx.storage.getUrl(id)),
    );
    additional_images = urls.filter((u): u is string => !!u);
  }

  return { ...artwork, primary_image_url, additional_images };
}

export async function resolveArtworkImagesList(
  ctx: QueryCtx,
  artworks: Doc<"artworks">[],
): Promise<Doc<"artworks">[]> {
  return Promise.all(artworks.map((a) => resolveArtworkImages(ctx, a)));
}
