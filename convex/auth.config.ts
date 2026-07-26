// Liga o Convex ao Clerk: valida os JWTs que o Clerk emite no browser antes
// de os aceitar em ctx.auth.getUserIdentity() (usado por requireAdmin em
// convex/lib/auth.ts). `domain` é o "Frontend API URL" do projecto Clerk
// (Dashboard Clerk → API Keys), não um domínio à escolha.
//
//   npx convex env set CLERK_JWT_ISSUER_DOMAIN https://<algo>.clerk.accounts.dev
//
// Sem isto configurado, o `npx convex dev`/`deploy` recusa-se a fazer push
// de qualquer função (não só as de auth) — por isso está temporariamente a
// "https://REPLACE-ME.clerk.accounts.dev", um domínio que não existe e que
// nenhum JWT real vai corresponder. Enquanto isto não for trocado pelo
// domínio real (Dashboard Clerk → API Keys → "Frontend API URL"),
// getUserIdentity() devolve sempre null e requireAdmin() falha sempre com
// "Not authenticated" — seguro por omissão, nunca deixa passar um admin
// falso, só bloqueia o back-office até estar configurado a sério.
export default {
  providers: [
    {
      domain: process.env.CLERK_JWT_ISSUER_DOMAIN,
      applicationID: "convex",
    },
  ],
};
