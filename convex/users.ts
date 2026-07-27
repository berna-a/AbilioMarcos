import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";

/**
 * Utilizador autenticado actual (via Convex Auth) — usado pelo back-office
 * para mostrar o email na sidebar (AdminLayout) e para o AuthContext saber
 * se há sessão. Não é gate de admin: isso continua a ser feito por
 * `requireAdmin` (convex/lib/auth.ts) em cada mutation/query sensível.
 */
export const viewer = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return null;
    }
    const user = await ctx.db.get(userId);
    if (user === null) {
      return null;
    }
    return { id: user._id as string, email: user.email };
  },
});
