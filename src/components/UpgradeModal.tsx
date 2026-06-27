import { Link } from "@tanstack/react-router";

export function UpgradeModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="glass relative w-full max-w-md rounded-3xl p-8 animate-fade-up">
        <div className="text-center">
          <div className="text-5xl">🎉</div>
          <h2 className="mt-4 text-2xl font-semibold">You've Used Your 5 Free Generations</h2>
          <p className="mt-2 text-sm text-muted-foreground">Upgrade to unlock unlimited AI writing.</p>
        </div>
        <ul className="mt-6 space-y-3 text-sm">
          {["Unlimited generations", "All 3 modes", "Priority processing"].map(f => (
            <li key={f} className="flex items-center gap-2">
              <span className="text-success">✓</span> {f}
            </li>
          ))}
        </ul>
        <div className="mt-7 flex flex-col gap-3">
          <Link to="/pricing" className="btn-primary rounded-full px-5 py-3 text-center text-sm font-semibold">
            Upgrade Now
          </Link>
          <button onClick={onClose} className="text-center text-sm text-muted-foreground hover:text-foreground transition-colors">
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}
