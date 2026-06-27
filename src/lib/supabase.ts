/**
 * Supabase client — single shared instance for the whole app.
 *
 * The two env vars are PUBLIC (safe to expose in the browser):
 *   VITE_SUPABASE_URL      — your project URL
 *   VITE_SUPABASE_ANON_KEY — the anon/public key (NOT the service_role key)
 *
 * Add them to .env and they will be injected by Vite at build time.
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase env vars. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Persist session in localStorage so users stay logged in across refreshes
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
