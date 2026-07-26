/**
 * Every `created_at` column migrated from Supabase is a Postgres timestamp
 * string — "2026-07-26 18:00:00.038148+00" (space separator, no "T", no "Z",
 * explicit "+00"). dashboard.ts range-queries analytics_events by comparing
 * these strings lexicographically (cheaper than a real Date column migration
 * for 28k+ rows). If new inserts used `Date#toISOString()` instead
 * ("2026-07-26T18:00:00.000Z"), the "T" (0x54) vs " " (0x20) mismatch would
 * silently corrupt those range comparisons for same-day boundaries. Always
 * insert `created_at` via this helper, not `new Date().toISOString()`.
 */
export function nowPg(): string {
  return new Date().toISOString().replace("T", " ").replace("Z", "+00");
}

/** Midnight UTC `days` ago, in the same Postgres-style shape as `nowPg()` —
 * for `.gte("created_at", cutoffPg(days))` range queries. */
export function cutoffPg(days: number): string {
  const d = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  return `${d} 00:00:00.000+00`;
}
