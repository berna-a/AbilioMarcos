import { ConvexHttpClient } from "convex/browser";

// Token do Convex Auth para autenticar os clientes HTTP "one-off" abaixo.
// Só existe em memória (nunca em localStorage próprio) — é o AuthContext
// (via `useAuthToken()`) que o mantém sincronizado sempre que a sessão
// muda. Sem isto, todas as queries/mutations gate-adas por `requireAdmin`
// (convex/lib/auth.ts) falhariam com "Not authenticated", porque um
// `ConvexHttpClient` novo não sabe nada da sessão do browser a menos que
// alguém lhe chame `.setAuth(token)` explicitamente (ver ESTADO.md).
let currentAuthToken: string | null = null;

export function setConvexAuthToken(token: string | null) {
  currentAuthToken = token;
}

/** Shared Convex HTTP client for one-off queries/mutations from plain (non-React) lib code. */
export function getConvexClient(): ConvexHttpClient {
  const url = (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_CONVEX_URL)
    ? import.meta.env.VITE_CONVEX_URL
    : "https://deafening-cormorant-584.eu-west-1.convex.cloud";
  const client = new ConvexHttpClient(url);
  if (currentAuthToken) {
    client.setAuth(currentAuthToken);
  }
  return client;
}
