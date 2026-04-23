import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const REMEMBER_KEY = 'am_admin_remember';

/**
 * Migrates Supabase auth tokens between localStorage (persistent) and
 * sessionStorage (cleared when tab closes) based on Remember Me choice.
 * Supabase JS reads from localStorage by default at init; we mirror after login.
 */
function applyPersistencePreference(remember: boolean) {
  try {
    const tokenKey = Object.keys(localStorage).find((k) => k.startsWith('sb-') && k.endsWith('-auth-token'));
    if (!tokenKey) return;
    const value = localStorage.getItem(tokenKey);
    if (!value) return;
    if (remember) {
      sessionStorage.removeItem(tokenKey);
    } else {
      sessionStorage.setItem(tokenKey, value);
      localStorage.removeItem(tokenKey);
    }
  } catch {
    // best-effort
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If a session-only token exists, restore it into localStorage temporarily so
    // the supabase client can pick it up across reloads within the same tab.
    try {
      const sessionTokenKey = Object.keys(sessionStorage).find((k) => k.startsWith('sb-') && k.endsWith('-auth-token'));
      if (sessionTokenKey && !localStorage.getItem(sessionTokenKey)) {
        localStorage.setItem(sessionTokenKey, sessionStorage.getItem(sessionTokenKey)!);
      }
    } catch { /* noop */ }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string, rememberMe = true) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) {
      try { localStorage.setItem(REMEMBER_KEY, rememberMe ? '1' : '0'); } catch { /* noop */ }
      // Defer to next tick so supabase has flushed the token to localStorage
      setTimeout(() => applyPersistencePreference(rememberMe), 0);
    }
    return { error: error as Error | null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    try { localStorage.removeItem(REMEMBER_KEY); } catch { /* noop */ }
  };

  return (
    <AuthContext.Provider value={{ session, user: session?.user ?? null, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
