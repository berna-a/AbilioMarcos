import { v } from "convex/values";
import { createAccount, modifyAccountCredentials } from "@convex-dev/auth/server";
import { internalAction } from "./_generated/server";

/**
 * Bootstrap de contas de admin (email+password) para o back-office, via
 * Convex Auth.
 *
 * `internalAction` de propósito: só é chamável via `npx convex run` (CLI
 * autenticada com a admin key do deployment) ou de outra função interna —
 * nunca pelo browser. As passwords nunca ficam em código nem em commits;
 * passa-as como argumento do `convex run` a partir do terminal, ex.:
 *
 *   npx convex run authAdmin:createAdmin '{"email":"nome@dominio.pt","password":"..."}'
 *   npx convex run authAdmin:createAdmin --prod '{"email":"nome@dominio.pt","password":"..."}'
 *
 * Não há flow nativo de "email verification" configurado (ver convex/auth.ts)
 * por isso a conta fica imediatamente utilizável em signIn — não é preciso
 * nenhum passo de verificação por email.
 */
export const createAdmin = internalAction({
  args: {
    email: v.string(),
    password: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, { email, password, name }) => {
    const { user } = await createAccount(ctx, {
      provider: "password",
      account: { id: email, secret: password },
      profile: { email, name: name ?? email },
    });
    return { userId: user._id, email: user.email };
  },
});

/**
 * Alternativa mais próxima ao "reset de password pelo próprio utilizador"
 * enquanto não houver um provider de email (Resend) ligado a este projecto
 * — ver limitação documentada no relatório da migração. Troca a password de
 * UMA conta existente identificada por email; não precisa de sessão activa
 * porque corre pela CLI (equivalente a um admin do Convex a repor a
 * password directamente).
 *
 *   npx convex run authAdmin:resetAdminPassword '{"email":"...","newPassword":"..."}'
 */
export const resetAdminPassword = internalAction({
  args: { email: v.string(), newPassword: v.string() },
  handler: async (ctx, { email, newPassword }) => {
    await modifyAccountCredentials(ctx, {
      provider: "password",
      account: { id: email, secret: newPassword },
    });
  },
});
