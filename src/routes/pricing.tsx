import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GradientBackground } from "@/components/GradientBackground";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — OutreachAI" },
      { name: "description", content: "Simple plans for freelancers, professionals and creators." },
      { property: "og:title", content: "OutreachAI Pricing" },
      { property: "og:description", content: "Simple plans for freelancers, professionals and creators." },
    ],
  }),
  component: PricingPage,
});

function PlanCard({
  name, price, features, cta, highlight, badge,
}: { name: string; price: string; features: string[]; cta: string; highlight?: boolean; badge?: string }) {
  return (
    <div
      className={`card-surface relative flex flex-col p-8 ${highlight ? "ring-1 ring-accent/50" : ""}`}
      style={highlight ? { background: "linear-gradient(180deg, rgba(167,139,250,0.10), rgba(37,99,235,0.06))" } : undefined}
    >
      {badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold text-white"
              style={{ background: "var(--gradient-primary)" }}>
          {badge}
        </span>
      )}
      <h3 className="text-lg font-semibold">{name}</h3>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-4xl font-bold">{price}</span>
        <span className="text-sm text-muted-foreground">/month</span>
      </div>
      <ul className="mt-6 flex-1 space-y-3 text-sm">
        {features.map(f => (
          <li key={f} className="flex items-center gap-2">
            <span className="text-success">✓</span> {f}
          </li>
        ))}
      </ul>
      <Link
        to="/success"
        className={`mt-8 rounded-full px-5 py-3 text-center text-sm font-semibold transition-all ${highlight ? "btn-primary" : "btn-ghost"}`}
      >
        {cta}
      </Link>
    </div>
  );
}

function PricingPage() {
  return (
    <div className="relative min-h-screen">
      <GradientBackground />
      <Navbar />
      <section className="mx-auto max-w-6xl px-4 pt-16 pb-24">
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-accent">Pricing</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-5xl">Choose your plan</h1>
          <p className="mx-auto mt-3 max-w-xl text-muted-foreground">Cancel anytime. Upgrade or downgrade with one click.</p>
        </div>
        <div className="mx-auto mt-16 grid max-w-3xl gap-6 md:grid-cols-2">
          <PlanCard
            name="Pro"
            price="$19"
            features={["Unlimited generations", "Upwork mode", "LinkedIn mode"]}
            cta="Get Pro"
          />
          <PlanCard
            name="Creator"
            price="$29"
            features={["Everything in Pro", "Creator Collaboration mode", "Priority AI"]}
            cta="Get Creator"
            highlight
            badge="Most Popular"
          />
        </div>
      </section>
      <Footer />
    </div>
  );
}
