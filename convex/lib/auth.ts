import { MutationCtx, QueryCtx } from "../_generated/server";

/**
 * Admin gate for the back-office.
 *
 * Decision (documented, not asked mid-migration — see final report): the old
 * `user_roles` table keyed admins by their Supabase Auth UUID
 * (`user_id`). Once auth moves to Clerk, those UUIDs are meaningless — Clerk
 * mints its own user ids. Rather than block the whole back-office port on a
 * new admin-management UI, admin access is gated by e-mail against the
 * `ADMIN_EMAILS` Convex env var (comma-separated), e.g.:
 *
 *   npx convex env set ADMIN_EMAILS "bernardo@abreu.me,abilio@example.com"
 *
 * Whoever owns the Convex project can update this list without a code
 * change or redeploy. If/when a proper in-app role manager is wanted, this
 * is the one place to swap out.
 */
export async function requireAdmin(ctx: QueryCtx | MutationCtx): Promise<{ email: string }> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity || !identity.email) {
    throw new Error("Not authenticated");
  }
  const allowlist = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (!allowlist.includes(identity.email.toLowerCase())) {
    throw new Error("Not authorized");
  }
  return { email: identity.email };
}
