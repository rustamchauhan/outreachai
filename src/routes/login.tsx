import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { GradientBackground } from "@/components/GradientBackground";
import { signIn, signInWithGoogle } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — OutreachAI" },
      { name: "description", content: "Login to your OutreachAI account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Already signed in → redirect to generator
  if (!authLoading && user) {
    navigate({ to: "/generator" });
    return null;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setInfo("");
    const fd = new FormData(e.currentTarget);
    const email = (fd.get("email") as string).trim();
    const password = fd.get("password") as string;

    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      navigate({ to: "/generator" });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Login failed.";
      if (msg.includes("confirm your email")) {
        setInfo(msg);
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError("");
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      // Supabase redirects the page — no need to navigate manually
    } catch (err) {
      setError(err instanceof Error ? err.message : "Google sign-in failed.");
      setGoogleLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen">
      <GradientBackground />
      <Navbar />
      <section className="mx-auto flex max-w-md flex-col px-4 pt-16 pb-24">
        <div className="card-surface p-8 animate-fade-up">
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="mt-1 text-sm text-muted-foreground">Login to continue writing.</p>

          {/* Google sign-in */}
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googleLoading}
            className="btn-ghost mt-6 flex w-full items-center justify-center gap-3 rounded-full px-5 py-3 text-sm font-medium disabled:opacity-60"
          >
            {googleLoading ? (
              <Spinner />
            ) : (
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
            )}
            Continue with Google
          </button>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/8" />
            <span className="text-xs text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-white/8" />
          </div>

          {error && (
            <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}
          {info && (
            <div className="mb-4 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent">
              {info}
            </div>
          )}

          <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
            <Field label="Email" name="email" type="email" placeholder="you@company.com" autoComplete="email" required />
            <Field
              label="Password"
              name="password"
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-primary mt-2 flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold disabled:opacity-70"
            >
              {loading && <Spinner />}
              {loading ? "Logging in…" : "Login"}
            </button>
          </form>

          <div className="mt-5 flex items-center justify-between text-xs">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              Forgot password?
            </a>
            <Link to="/signup" className="text-accent hover:underline">
              Create account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <input
        {...props}
        className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none transition-colors focus:border-accent/60 focus:bg-white/[0.07]"
      />
    </label>
  );
}

function Spinner() {
  return <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />;
}
