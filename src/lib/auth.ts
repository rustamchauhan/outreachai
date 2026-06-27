/**
 * Auth helpers — backed by Supabase.
 *
 * All functions are async and throw a plain Error on failure
 * so callers can catch and display the message directly.
 */

import { supabase } from "./supabase";

export interface User {
  id: string;
  email: string;
  name: string;
}

// ─── helpers ────────────────────────────────────────────────────────────────

function mapUser(supabaseUser: { id: string; email?: string; user_metadata?: { full_name?: string; name?: string } }): User {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? "",
    name:
      supabaseUser.user_metadata?.full_name ??
      supabaseUser.user_metadata?.name ??
      supabaseUser.email?.split("@")[0] ??
      "User",
  };
}

// ─── public API ─────────────────────────────────────────────────────────────

/** Returns the currently signed-in user, or null. */
export async function getCurrentUser(): Promise<User | null> {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  return mapUser(data.user);
}

/** Sign in with email + password. Throws a user-friendly error on failure. */
export async function signIn(email: string, password: string): Promise<User> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(friendlyAuthError(error.message));
  if (!data.user) throw new Error("Sign in failed. Please try again.");
  return mapUser(data.user);
}

/** Create a new account and sign in. Throws a user-friendly error on failure. */
export async function signUp(name: string, email: string, password: string): Promise<User> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
      // After email confirmation the user lands back at /generator
      emailRedirectTo: `${window.location.origin}/generator`,
    },
  });
  if (error) throw new Error(friendlyAuthError(error.message));
  if (!data.user) throw new Error("Sign up failed. Please try again.");
  return mapUser(data.user);
}

/** Sign out the current user. */
export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

/** Sign in with Google OAuth (opens a popup/redirect). */
export async function signInWithGoogle(): Promise<void> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: `${window.location.origin}/generator` },
  });
  if (error) throw new Error(friendlyAuthError(error.message));
}

// ─── password validation ─────────────────────────────────────────────────────

/** Returns an error message if the password is too weak, otherwise null. */
export function validatePassword(password: string): string | null {
  if (password.length < 8) return "Password must be at least 8 characters.";
  if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
  if (!/[0-9]/.test(password)) return "Password must contain at least one number.";
  return null;
}

// ─── error message mapping ───────────────────────────────────────────────────

/** Turns Supabase's raw error messages into friendly ones. */
function friendlyAuthError(message: string): string {
  if (message.includes("Invalid login credentials")) return "Incorrect email or password.";
  if (message.includes("Email not confirmed")) return "Please confirm your email before logging in. Check your inbox.";
  if (message.includes("User already registered")) return "An account with this email already exists. Try logging in.";
  if (message.includes("Password should be")) return "Password is too weak. Use at least 8 characters.";
  if (message.includes("rate limit")) return "Too many attempts. Please wait a moment and try again.";
  return message;
}
