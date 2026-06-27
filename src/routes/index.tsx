import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GradientBackground } from "@/components/GradientBackground";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OutreachAI — Write Winning Proposals, Outreach & Pitches in Seconds" },
      { name: "description", content: "AI-powered writing for freelancers, LinkedIn networking and creator collaborations." },
      { property: "og:title", content: "OutreachAI" },
      { property: "og:description", content: "AI-powered writing for freelancers, LinkedIn networking and creator collaborations." },
    ],
  }),
  component: Index,
});

const features = [
  { icon: "📝", title: "Upwork & Fiverr Proposals", desc: "Generate personalized proposals that help freelancers win more jobs." },
  { icon: "💼", title: "LinkedIn Outreach", desc: "Write human-sounding networking and sales messages with high reply rates." },
  { icon: "🤝", title: "Creator Collaborations", desc: "Create sponsorship and partnership pitches for YouTubers and creators." },
];

const steps = [
  { icon: "📋", title: "Paste information", desc: "Drop in the job, profile or brief you're targeting." },
  { icon: "🎯", title: "Choose your mode", desc: "Pick Upwork, LinkedIn or Creator collab." },
  { icon: "⚡", title: "Generate with AI", desc: "Get a tailored, human-sounding draft in seconds." },
  { icon: "🚀", title: "Copy and send", desc: "One click to copy. Hit send and win replies." },
];

function Index() {
  return (
    <div className="relative min-h-screen">
      <GradientBackground />
      <Navbar />

      {/* HERO */}
      <section className="mx-auto max-w-6xl px-4 pt-20 pb-24 text-center md:pt-28">
        <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground animate-fade-up">
          <span className="h-1.5 w-1.5 rounded-full bg-success" /> New · Creator Collaboration mode is live
        </div>
        <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl animate-fade-up">
          Write Winning <span className="gradient-text">Proposals, Outreach</span> & Pitches in Seconds
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground md:text-lg animate-fade-up">
          AI-powered writing for freelancers, LinkedIn networking and creator collaborations.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row animate-fade-up">
          <Link to="/signup" className="btn-primary w-full rounded-full px-6 py-3 text-sm font-semibold sm:w-auto">
            Start Free — No Credit Card
          </Link>
          <a href="#how" className="btn-ghost w-full rounded-full px-6 py-3 text-sm font-semibold sm:w-auto">
            See How It Works
          </a>
        </div>
        <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground animate-fade-up">
          <span className="text-accent">★★★★★</span> Rated 4.9/5 by professionals
        </div>

        {/* preview card */}
        <div className="mx-auto mt-16 max-w-4xl animate-fade-up">
          <div className="card-surface p-2 md:p-3">
            <div className="rounded-2xl bg-[#0c0c14] p-6 text-left">
              <div className="mb-4 flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
                <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
              </div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">Your AI Proposal</p>
              <p className="mt-3 text-sm leading-relaxed text-foreground/90">
                Hi Sarah — I noticed your team is rebuilding the analytics dashboard in React. I've shipped 12 similar dashboards
                (most recently for a fintech doing 4M MRR) and can plug in by Monday. I'd love to send a 90-second Loom showing exactly
                how I'd approach your stack…
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                <span className="rounded-full border border-white/10 px-2 py-0.5">Tone: Confident</span>
                <span className="rounded-full border border-white/10 px-2 py-0.5">Upwork</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-accent">Features</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Everything you need to land the reply</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((f, i) => (
            <div key={f.title} className="card-surface p-6 animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
              <div className="grid h-12 w-12 place-items-center rounded-xl text-2xl"
                   style={{ background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.25)" }}>
                {f.icon}
              </div>
              <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="mx-auto max-w-6xl px-4 py-20">
        <div className="text-center">
          <p className="text-xs uppercase tracking-widest text-accent">How it works</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">From blank page to sent in under a minute</h2>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={s.title} className="card-surface relative p-6 animate-fade-up" style={{ animationDelay: `${i * 80}ms` }}>
              <span className="absolute right-5 top-5 text-xs font-semibold text-muted-foreground/60">0{i + 1}</span>
              <div className="text-3xl">{s.icon}</div>
              <h3 className="mt-4 font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link to="/generator" className="btn-primary inline-flex rounded-full px-6 py-3 text-sm font-semibold">
            Try the Generator
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
