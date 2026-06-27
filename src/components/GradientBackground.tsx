export function GradientBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      <div
        className="absolute -top-32 left-1/4 h-[420px] w-[420px] rounded-full opacity-60 animate-float-blob"
        style={{ background: "radial-gradient(circle, rgba(167,139,250,0.45), transparent 60%)", filter: "blur(40px)" }}
      />
      <div
        className="absolute top-1/3 -right-20 h-[380px] w-[380px] rounded-full opacity-50 animate-float-blob"
        style={{ background: "radial-gradient(circle, rgba(37,99,235,0.45), transparent 60%)", filter: "blur(50px)", animationDelay: "3s" }}
      />
      <div
        className="absolute bottom-0 left-0 h-[300px] w-[300px] rounded-full opacity-40 animate-float-blob"
        style={{ background: "radial-gradient(circle, rgba(167,139,250,0.35), transparent 60%)", filter: "blur(40px)", animationDelay: "6s" }}
      />
    </div>
  );
}
