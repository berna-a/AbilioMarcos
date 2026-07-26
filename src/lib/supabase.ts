// Supabase Client Stub (Migrated to Convex)
export const supabase = new Proxy({}, {
  get(_target, prop) {
    console.warn(`[Supabase Deprecated] Call to supabase.${String(prop)} intercepted. Migrate this call to Convex.`);
    if (prop === 'auth') {
      return {
        getSession: async () => ({ data: { session: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signInWithPassword: async () => ({ error: new Error("Supabase auth deprecated") }),
        signOut: async () => {},
      };
    }
    if (prop === 'from') {
      return () => ({
        select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }), in: () => ({}), not: () => ({}) }),
        insert: async () => ({ error: null }),
        update: () => ({ eq: async () => ({ error: null }) }),
        delete: () => ({ eq: async () => ({ error: null }) }),
      });
    }
    if (prop === 'functions') {
      return {
        invoke: async () => ({ data: null, error: null }),
      };
    }
    return () => ({});
  }
});
