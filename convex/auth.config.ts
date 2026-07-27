// Liga o Convex ao Convex Auth (login nativo — ver ESTADO.md e
// convex/auth.ts). `CONVEX_SITE_URL` é preenchido automaticamente pela
// própria plataforma Convex em cada deployment — não há nenhum valor
// manual a copiar de um painel externo. Os JWTs são assinados com
// `JWT_PRIVATE_KEY` e validados com `JWKS` (ambos gerados e guardados como
// env vars do próprio deployment — ver relatório da migração para o
// comando usado).
export default {
  providers: [
    {
      domain: process.env.CONVEX_SITE_URL,
      applicationID: "convex",
    },
  ],
};
