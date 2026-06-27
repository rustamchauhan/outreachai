import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Logo } from "@/components/Logo";
import { GradientBackground } from "@/components/GradientBackground";
import { UpgradeModal } from "@/components/UpgradeModal";
import { generateOutreach, type GenerateMode } from "@/lib/api";
import {
  getUsedCount,
  incrementUsedCount,
  getRemainingCount,
  hasReachedLimit,
  FREE_LIMIT,
} from "@/lib/rateLimit";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/lib/auth";

export const Route = createFileRoute("/generator")({
  head: () => ({
    meta: [
      { title: "Generator — OutreachAI" },
      { name: "description", content: "Generate proposals, outreach and pitches with AI." },
    ],
  }),
  component: GeneratorPage,
});

type TabId = GenerateMode;
const TABS: { id: TabId; label: string }[] = [
  { id: "upwork", label: "📝 Upwork / Fiverr" },
  { id: "linkedin", label: "💼 LinkedIn Outreach" },
  { id: "creator", label: "🤝 Creator Collaboration" },
];

function GeneratorPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<TabId>("upwork");
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [used, setUsed] = useState(0);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  useEffect(() => {
    setUsed(getUsedCount());
  }, []);

  // Route guard — redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      navigate({ to: "/login" });
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-accent" />
      </div>
    );
  }

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleGenerate = async (mode: GenerateMode, fields: Record<string, string>) => {
    if (hasReachedLimit()) {
      setUpgradeOpen(true);
      return;
    }
    setLoading(true);
    setOutput("");
    setError("");
    try {
      const result = await generateOutreach({ mode, fields });
      setOutput(result.text);
      const next = incrementUsedCount();
      setUsed(next);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const remaining = Math.max(0, FREE_LIMIT - used);

  return (
    <div className="relative min-h-screen">
      <GradientBackground />

      <header className="sticky top-0 z-40">
        <div className="mx-auto mt-4 max-w-7xl px-4">
          <div className="glass flex items-center justify-between rounded-2xl px-4 py-3">
            <Logo />
            <div className="flex items-center gap-3">
              <Link to="/pricing" className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline">
                Upgrade
              </Link>
              <button
                onClick={async () => { await signOut(); navigate({ to: "/" }); }}
                className="hidden text-sm text-muted-foreground hover:text-foreground sm:inline"
              >
                Sign out
              </button>
              <div
                className="grid h-9 w-9 place-items-center rounded-full text-sm font-semibold"
                style={{ background: "var(--gradient-primary)" }}
                title={user.email}
              >
                {initials}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 pb-24 pt-8">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">AI Generator</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Pick a mode and let AI draft your next reply-magnet.
          </p>
        </div>

        <div className="glass mt-6 flex flex-wrap gap-1.5 rounded-2xl p-1.5">
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); setOutput(""); setError(""); }}
                className={`flex-1 min-w-[140px] rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
                  active ? "text-white shadow-lg" : "text-muted-foreground hover:text-foreground"
                }`}
                style={active ? { background: "var(--blue)", boxShadow: "0 8px 24px -8px rgba(37,99,235,0.6)" } : undefined}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="card-surface p-6">
            {tab === "upwork" && <UpworkForm onGenerate={handleGenerate} loading={loading} />}
            {tab === "linkedin" && <LinkedInForm onGenerate={handleGenerate} loading={loading} />}
            {tab === "creator" && <CreatorForm onGenerate={handleGenerate} loading={loading} />}
          </div>

          <div className="card-surface flex flex-col p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                Your AI {tab === "upwork" ? "Proposal" : tab === "linkedin" ? "Message" : "Pitch"}
              </h2>
              <button
                onClick={copy}
                disabled={!output}
                className="btn-ghost rounded-full px-3 py-1.5 text-xs font-medium disabled:opacity-40"
              >
                {copied ? "✅ Copied!" : "📋 Copy"}
              </button>
            </div>

            <div className="mt-4 flex-1 min-h-[360px] rounded-2xl border border-white/8 bg-[#0c0c14] p-5 text-sm leading-relaxed">
              {loading ? (
                <div className="flex h-full items-center justify-center">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-accent" />
                </div>
              ) : error ? (
                <p className="text-destructive">{error}</p>
              ) : output ? (
                <p className="whitespace-pre-wrap text-foreground/90">{output}</p>
              ) : (
                <p className="text-muted-foreground">Your generated output will appear here.</p>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>{remaining} / {FREE_LIMIT} Free Generations Remaining</span>
              <Link to="/pricing" className="text-accent hover:underline">Upgrade</Link>
            </div>
          </div>
        </div>
      </main>

      <UpgradeModal open={upgradeOpen} onClose={() => setUpgradeOpen(false)} />
    </div>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <input {...props} className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent/60" />
    </label>
  );
}
function TextArea({ label, ...props }: { label: string } & React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <textarea {...props} className="mt-1.5 min-h-[110px] w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent/60" />
    </label>
  );
}
function Select({ label, options, ...props }: { label: string; options: string[] } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <select {...props} className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none transition-colors focus:border-accent/60">
        {options.map((o) => <option key={o} value={o} className="bg-[#0c0c14]">{o}</option>)}
      </select>
    </label>
  );
}
function GenerateButton({ children, loading }: { children: React.ReactNode; loading: boolean }) {
  return (
    <button type="submit" disabled={loading} className="btn-primary mt-2 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold disabled:opacity-70">
      {loading ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : "✨"}
      {children}
    </button>
  );
}

function UpworkForm({ onGenerate, loading }: { onGenerate: (mode: GenerateMode, fields: Record<string, string>) => void; loading: boolean }) {
  return (
    <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); onGenerate("upwork", Object.fromEntries(fd.entries()) as Record<string, string>); }}>
      <TextArea label="Job Description" name="job" placeholder="Paste the job posting here…" required />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your Name" name="name" placeholder="Jane Doe" required />
        <Field label="Years of Experience" name="years" placeholder="5" />
      </div>
      <Field label="Skills" name="skills" placeholder="React, TypeScript, Node" required />
      <Select label="Tone" name="tone" options={["Professional", "Friendly", "Confident", "Direct"]} />
      <Field label="Personal Touch" name="touch" placeholder="Something specific you noticed about the client" />
      <GenerateButton loading={loading}>Generate Proposal</GenerateButton>
    </form>
  );
}
function LinkedInForm({ onGenerate, loading }: { onGenerate: (mode: GenerateMode, fields: Record<string, string>) => void; loading: boolean }) {
  return (
    <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); onGenerate("linkedin", Object.fromEntries(fd.entries()) as Record<string, string>); }}>
      <Select label="Goal" name="goal" options={["Connect and introduce myself", "Apply for a job", "Cold sales", "Partnership", "Ask for advice"]} />
      <Field label="Recipient Name & Title" name="recipient" placeholder="Sarah Chen, Head of Marketing" required />
      <TextArea label="Recipient Bio" name="bio" placeholder="What's in their profile?" />
      <TextArea label="My Background" name="background" placeholder="Short summary of who you are" required />
      <Field label="What I Want" name="want" placeholder="A 15-min intro call" required />
      <Select label="Message Format" name="format" options={["Connection Note", "LinkedIn InMail", "Email"]} />
      <GenerateButton loading={loading}>Write My Message</GenerateButton>
    </form>
  );
}
function CreatorForm({ onGenerate, loading }: { onGenerate: (mode: GenerateMode, fields: Record<string, string>) => void; loading: boolean }) {
  return (
    <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.currentTarget); onGenerate("creator", Object.fromEntries(fd.entries()) as Record<string, string>); }}>
      <Field label="Pitch Type" name="pitch" placeholder="Sponsorship, partnership, collab…" required />
      <Field label="Creator Name & Niche" name="creator" placeholder="Ali Abdaal — productivity" required />
      <TextArea label="Audience and Content Style" name="audience" placeholder="Who watches them and how they make content" />
      <TextArea label="My Brand" name="brand" placeholder="Tell them about your brand" required />
      <Field label="Offer" name="offer" placeholder="Flat fee + revenue share" required />
      <TextArea label="Why We Are A Good Fit" name="fit" placeholder="The overlap that makes this obvious" />
      <Select label="Tone" name="tone" options={["Professional", "Friendly", "Casual"]} />
      <GenerateButton loading={loading}>Write My Pitch</GenerateButton>
    </form>
  );
}
