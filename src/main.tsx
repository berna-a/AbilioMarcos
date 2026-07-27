import { createRoot } from "react-dom/client";
import { ConvexReactClient } from "convex/react";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import App from "./App.tsx";
import "./index.css";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

// Convex Auth — login nativo (ver ESTADO.md). Não depende de nenhuma chave
// externa: as chaves JWT vivem dentro do próprio deployment Convex
// (`JWT_PRIVATE_KEY`/`JWKS`, geradas durante a migração), por isso funciona
// imediatamente em qualquer ambiente que já tenha `VITE_CONVEX_URL` configurado.
createRoot(document.getElementById("root")!).render(
  <ConvexAuthProvider client={convex}>
    <App />
  </ConvexAuthProvider>,
);
