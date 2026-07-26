import { createContext, useContext, ReactNode } from 'react';
import { useAuth as useClerkAuthState, useClerk, useSignIn, useUser } from '@clerk/clerk-react';

export interface User {
  id: string;
  email?: string;
}

export interface Session {
  user: User;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Decidido durante a migração (ver relatório): em vez de a app rebentar
// quando ainda não há chave Clerk configurada, o back-office fica bloqueado
// de forma previsível ("autenticação não configurada") e o site público
// continua a funcionar. Assim que `VITE_CLERK_PUBLISHABLE_KEY` for definida
// (main.tsx passa a montar o ClerkProvider real), este ramo troca sozinho.
const CLERK_ENABLED = !!import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const DisabledAuthProvider = ({ children }: { children: ReactNode }) => (
  <AuthContext.Provider
    value={{
      session: null,
      user: null,
      loading: false,
      signIn: async () => ({ error: new Error('Autenticação não configurada (falta VITE_CLERK_PUBLISHABLE_KEY).') }),
      signOut: async () => {},
    }}
  >
    {children}
  </AuthContext.Provider>
);

const ClerkAuthProvider = ({ children }: { children: ReactNode }) => {
  const { isLoaded: authLoaded } = useClerkAuthState();
  const { isLoaded: userLoaded, isSignedIn, user: clerkUser } = useUser();
  const { signIn: clerkSignIn, isLoaded: signInLoaded, setActive } = useSignIn();
  const clerk = useClerk();

  const loading = !authLoaded || !userLoaded;

  const user: User | null = isSignedIn && clerkUser
    ? { id: clerkUser.id, email: clerkUser.primaryEmailAddress?.emailAddress }
    : null;

  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    if (!signInLoaded || !clerkSignIn) {
      return { error: new Error('Autenticação ainda a carregar — tenta novamente.') };
    }
    try {
      const result = await clerkSignIn.create({ identifier: email, password });
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        return { error: null };
      }
      // Estados intermédios (2FA, verificação adicional) não estão a ser
      // pedidos pelo back-office do Abílio — tratados como falha de login.
      return { error: new Error(`Login incompleto (estado: ${result.status}).`) };
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Credenciais inválidas.';
      return { error: new Error(message) };
    }
  };

  const signOut = async () => {
    await clerk.signOut();
  };

  return (
    <AuthContext.Provider value={{ session: user ? { user } : null, user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  return CLERK_ENABLED ? <ClerkAuthProvider>{children}</ClerkAuthProvider> : <DisabledAuthProvider>{children}</DisabledAuthProvider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
