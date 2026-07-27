import { Password } from "@convex-dev/auth/providers/Password";
import { convexAuth } from "@convex-dev/auth/server";

// Login nativo do Convex (ver ESTADO.md). Só o provider Password está
// activo — email+password, igual ao que o Supabase Auth fazia antes. Sem
// `reset`/`verify` configurados (precisariam de um provider de email tipo
// Resend, que não está ligado a este projecto) — ver nota em
// convex/authAdmin.ts sobre a limitação de reset de password por email.
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password],
});
