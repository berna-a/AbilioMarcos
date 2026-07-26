// One-off migration helpers, run by hand via `npx convex run backfill:<fn>`.
// Not called from the frontend. Kept in the repo (rather than deleted after
// use) so the exact steps are auditable and re-runnable if new artworks slip
// through with a raw Supabase/dev-Convex URL again.

import { internalAction } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

/**
 * Rewrites every artwork's image references to Convex `_storage` ids.
 *
 * IMPORTANT: the token in a Convex download URL
 * (`https://<deployment>.convex.cloud/api/storage/<token>`) is NOT the same
 * value as `Id<"_storage">` — it looks like a UUID, but Convex ids use a
 * different (base32, no dashes) encoding, so `v.id("_storage")` rejects it.
 * There is no supported way to derive the real storage id from that URL.
 * The only safe fix is to fetch the bytes from whatever URL is on file
 * (Convex-dev or Supabase, doesn't matter) and re-store them, exactly like a
 * fresh upload — that's what this does for every artwork uniformly. It's a
 * few dozen extra MB of storage for images that already had a valid id, but
 * it is correct and needs no reverse-engineering of Convex internals.
 *
 * Idempotent-ish: artworks that already have `primary_storage_id` and no
 * legacy `primary_image_url` left are skipped (already migrated).
 *
 * `dryRun: true` (default) only reports what WOULD change — no writes, no
 * network fetches.
 */
export const migrateArtworkImages = internalAction({
  args: { dryRun: v.optional(v.boolean()) },
  handler: async (ctx, args): Promise<{
    total: number;
    alreadyDone: number;
    fetched: number;
    failed: { id: string; title: string | null | undefined; error: string }[];
  }> => {
    const dryRun = args.dryRun ?? true;
    const artworks = await ctx.runQuery(internal.backfillQueries.listArtworksForImageBackfill, {});

    let alreadyDone = 0;
    let fetched = 0;
    const failed: { id: string; title: string | null | undefined; error: string }[] = [];

    for (const a of artworks) {
      const needsPrimary = !!a.primary_image_url;
      const additionalUrls = a.additional_images ?? [];

      if (!needsPrimary && additionalUrls.length === 0) {
        alreadyDone += 1;
        continue;
      }

      try {
        let primaryStorageId: Id<"_storage"> | undefined = a.primary_storage_id ?? undefined;
        if (needsPrimary && a.primary_image_url) {
          if (!dryRun) {
            const res = await fetch(a.primary_image_url);
            if (!res.ok) throw new Error(`fetch ${res.status} for ${a.primary_image_url}`);
            const blob = await res.blob();
            primaryStorageId = await ctx.storage.store(blob);
          }
          fetched += 1;
        }

        const additionalStorageIds: Id<"_storage">[] = [...(a.additional_storage_ids ?? [])];
        for (const url of additionalUrls) {
          if (!dryRun) {
            const res = await fetch(url);
            if (!res.ok) throw new Error(`fetch ${res.status} for ${url}`);
            const blob = await res.blob();
            additionalStorageIds.push(await ctx.storage.store(blob));
          }
          fetched += 1;
        }

        if (!dryRun) {
          await ctx.runMutation(internal.backfillQueries.patchArtworkStorage, {
            id: a._id,
            primary_storage_id: primaryStorageId,
            additional_storage_ids: additionalStorageIds.length > 0 ? additionalStorageIds : undefined,
          });
        }
      } catch (e) {
        failed.push({ id: a._id, title: a.title, error: e instanceof Error ? e.message : String(e) });
      }
    }

    return { total: artworks.length, alreadyDone, fetched, failed };
  },
});
