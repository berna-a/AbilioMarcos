import { createRoot } from "react-dom/client";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import App from "./App.tsx";
import "./index.css";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);
const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined;

// Clerk nunca foi ligado antes desta migração — a chave só existe depois de
// o Bernardo criar a app no Clerk. Sem ela, o site público continua a
// funcionar normalmente (ConvexProvider simples); só o back-office fica
// bloqueado (ver src/contexts/AuthContext.tsx) em vez da app rebentar com o
// erro do Clerk ("Missing publishableKey").
const Root = clerkPublishableKey
  ? (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <App />
      </ConvexProviderWithClerk>
    </ClerkProvider>
  )
  : (
    <ConvexProvider client={convex}>
      <App />
    </ConvexProvider>
  );

createRoot(document.getElementById("root")!).render(Root);
