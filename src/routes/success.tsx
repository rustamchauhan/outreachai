import { createFileRoute, Link } from "@tanstack/react-router";
import { GradientBackground } from "@/components/GradientBackground";

export const Route = createFileRoute("/success")({
  head: () => ({
    meta: [
      { title: "Welcome to Pro — OutreachAI" },
      { name: "description", content: "You're all set." },
    ],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  return (
    <div className="relative grid min-h-screen place-items-center px-4">
      <GradientBackground />
      <div className="card-surface max-w-md p-10 text-center animate-fade-up">
        <div className="text-6xl">🎉</div>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight">Welcome to OutreachAI Pro</h1>
        <p className="mt-2 text-sm text-muted-foreground">You're all set.</p>
        <Link to="/generator" className="btn-primary mt-7 inline-flex rounded-full px-6 py-3 text-sm font-semibold">
          Start Writing
        </Link>
      </div>
    </div>
  );
}
