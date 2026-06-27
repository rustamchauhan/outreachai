import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "./Logo";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/auth";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    setSigningOut(true);
    await signOut();
    setSigningOut(false);
    navigate({ to: "/" });
  }

  // Initials avatar from user's name
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : null;

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="mx-auto mt-4 max-w-6xl px-4">
        <nav className="glass flex items-center justify-between rounded-2xl px-4 py-3">
          <Logo />

          {/* Desktop nav */}
          <div className="hidden items-center gap-8 md:flex">
            <a href="/#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Features
            </a>
            <Link to="/pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              Pricing
            </Link>

            {user ? (
              <>
                <Link to="/generator" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Generator
                </Link>
                <button
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
                >
                  {signingOut ? "Signing out…" : "Sign out"}
                </button>
                <div
                  className="grid h-9 w-9 place-items-center rounded-full text-xs font-semibold"
                  style={{ background: "var(--gradient-primary)" }}
                  title={user.email}
                >
                  {initials}
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Login
                </Link>
                <Link to="/signup" className="btn-primary rounded-full px-4 py-2 text-sm font-medium">
                  Get Started Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden btn-ghost rounded-lg p-2"
            aria-label="Toggle menu"
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
            </svg>
          </button>
        </nav>

        {/* Mobile menu */}
        {open && (
          <div className="glass mt-2 flex flex-col gap-3 rounded-2xl p-4 md:hidden animate-fade-up">
            <a href="/#features" onClick={() => setOpen(false)} className="text-sm text-muted-foreground">
              Features
            </a>
            <Link to="/pricing" onClick={() => setOpen(false)} className="text-sm">
              Pricing
            </Link>
            {user ? (
              <>
                <Link to="/generator" onClick={() => setOpen(false)} className="text-sm">
                  Generator
                </Link>
                <button
                  onClick={() => { setOpen(false); handleSignOut(); }}
                  className="text-left text-sm text-muted-foreground"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="text-sm">
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setOpen(false)}
                  className="btn-primary rounded-full px-4 py-2 text-center text-sm font-medium"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
