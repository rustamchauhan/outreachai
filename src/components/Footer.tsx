import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-white/5 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 md:flex-row">
        <Logo />
        <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} OutreachAI. All rights reserved.</p>
        <div className="flex gap-6 text-xs text-muted-foreground">
          <a href="/#features" className="hover:text-foreground transition-colors">Features</a>
          <Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
          <Link to="/login" className="hover:text-foreground transition-colors">Login</Link>
        </div>
      </div>
    </footer>
  );
}
