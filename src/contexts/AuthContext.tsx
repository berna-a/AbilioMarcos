import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuthActions, useAuthToken, useConvexAuth } from '@convex-dev/auth/react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { setConvexAuthToken } from '@/lib/convexClient';

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

// Login nativo via Convex Auth (ver ESTADO.md). Não há chave externa
// nenhuma que possa faltar — as chaves JWT vivem no próprio deployment
// Convex — por isso já não existe um "modo desligado" (o antigo
// DisabledAuthProvider): a autenticação está sempre disponível assim que o
// site fala com o Convex.
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { isLoading: authLoading, isAuthenticated } = useConvexAuth();
  const { signIn: convexSignIn, signOut: convexSignOut } = useAuthActions();
  // `"skip"` evita a query enquanto não há sessão — devolve `undefined`
  // (ainda a carregar) ou `null` (sem conta) consoante o caso.
  const viewer = useQuery(api.users.viewer, isAuthenticated ? {} : 'skip');

  // Mantém o `ConvexHttpClient` de src/lib/convexClient.ts (usado por
  // Dashboard/Artworks/Orders/Analytics/etc. fora de hooks React) autenticado
  // com o mesmo token da sessão actual — sem isto, essas queries/mutations
  // gate-adas por `requireAdmin` falhavam sempre com "Not authenticated".
  const token = useAuthToken();
  useEffect(() => {
    setConvexAuthToken(token ?? null);
  }, [token]);

  const loading = authLoading || (isAuthenticated && viewer === undefined);

  const user: User | null =
    isAuthenticated && viewer ? { id: viewer.id, email: viewer.email } : null;

  const signIn = async (email: string, password: string): Promise<{ error: Error | null }> => {
    try {
      await convexSignIn('password', { email, password, flow: 'signIn' });
      return { error: null };
    } catch (e) {
      // A mensagem crua do Convex Auth ("Invalid credentials" etc.) não é
      // para mostrar ao utilizador — Login.tsx já traduz qualquer erro
      // não-nulo para "email ou password incorretos".
      const message = e instanceof Error ? e.message : 'Credenciais inválidas.';
      return { error: new Error(message) };
    }
  };

  const signOut = async () => {
    await convexSignOut();
  };

  return (
    <AuthContext.Provider value={{ session: user ? { user } : null, user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
