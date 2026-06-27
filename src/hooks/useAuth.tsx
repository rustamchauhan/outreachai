/**
 * useAuth — React hook that provides the current user and auth state
 * to any component in the tree.
 *
 * Usage:
 *   const { user, loading } = useAuth();
 *   if (loading) return <Spinner />;
 *   if (!user) return <Redirect to="/login" />;
 */

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@/lib/auth";

interface AuthState {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthState>({ user: null, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user;
      setState({
        loading: false,
        user: u
          ? {
              id: u.id,
              email: u.email ?? "",
              name:
                u.user_metadata?.full_name ??
                u.user_metadata?.name ??
                u.email?.split("@")[0] ??
                "User",
            }
          : null,
      });
    });

    // Listen for auth state changes (login, logout, token refresh)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user;
      setState({
        loading: false,
        user: u
          ? {
              id: u.id,
              email: u.email ?? "",
              name:
                u.user_metadata?.full_name ??
                u.user_metadata?.name ??
                u.email?.split("@")[0] ??
                "User",
            }
          : null,
      });
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

/** Returns the current auth state. Must be used inside <AuthProvider>. */
export function useAuth(): AuthState {
  return useContext(AuthContext);
}
