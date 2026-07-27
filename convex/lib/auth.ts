import { getAuthUserId } from "@convex-dev/auth/server";
import { MutationCtx, QueryCtx } from "../_generated/server";

/**
 * Admin gate for the back-office.
 *
 * Decision (documented, not asked mid-migration — see final report): the old
 * `user_roles` table keyed admins by their Supabase Auth UUID
 * (`user_id`). Those UUIDs are meaningless under Convex Auth — each auth
 * provider mints its own user ids. Rather than block the
 * whole back-office port on a new admin-management UI, admin access is
 * gated by e-mail against the `ADMIN_EMAILS` Convex env var
 * (comma-separated), e.g.:
 *
 *   npx convex env set ADMIN_EMAILS "bernardo@abreu.me,abilio@example.com"
 *
 * Whoever owns the Convex project can update this list without a code
 * change or redeploy. If/when a proper in-app role manager is wanted, this
 * is the one place to swap out.
 */
export async function requireAdmin(ctx: QueryCtx | MutationCtx): Promise<{ email: string }> {
  // `ctx.auth.getUserIdentity()` NÃO chega a ter `email` sob o provider
  // Password do Convex Auth — só devolve `issuer`/`subject`/`tokenIdentifier`
  // (confirmado 27-07-2026: causava "Not authenticated" em todas as queries
  // admin, sempre, independentemente de qualquer sessão). O email real vive
  // na tabela `users` (authTables), à mesma que `convex/users.ts:viewer` usa
  // — por isso o gate tem de ir lá buscar, tal como o resto do back-office.
  const userId = await getAuthUserId(ctx);
  if (!userId) {
    throw new Error("Not authenticated");
  }
  const user = await ctx.db.get(userId);
  if (!user || !user.email) {
    throw new Error("Not authenticated");
  }
  const allowlist = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (!allowlist.includes(user.email.toLowerCase())) {
    throw new Error("Not authorized");
  }
  return { email: user.email };
}
