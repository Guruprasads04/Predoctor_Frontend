import { Particles } from "./Particles";
import { Link } from "react-router-dom";


const links = [
  { label: "Home", href: "#home", route: false },
  { label: "Features", href: "#features", route: false },
  { label: "Dashboard", href: "/dashboard", route: true },
  
];
export const CTASection = () => {
  return (
    <section id="cta" className="relative py-24 md:py-32">
      <div className="container">
        <div className="relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] glass-strong glow-border p-10 md:p-16 text-center">
          {/* gradient bg */}
          <div
            aria-hidden
            className="absolute inset-0 opacity-90"
            style={{
              background:
                "radial-gradient(ellipse 70% 80% at 50% 0%, hsl(var(--primary) / 0.4), transparent 70%), radial-gradient(ellipse 60% 70% at 80% 100%, hsl(var(--accent) / 0.4), transparent 70%), radial-gradient(ellipse 60% 70% at 20% 100%, hsl(var(--cyan) / 0.18), transparent 70%)",
            }}
          />
          <div aria-hidden className="absolute inset-0 grid-bg opacity-30" />
          <Particles count={20} />

          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-primary-glow">
              <span className="h-1.5 w-1.5 rounded-full bg-primary-glow animate-pulse" /> Ready to deploy
            </span>
            <h2 className="mt-5 font-display text-4xl md:text-6xl font-semibold tracking-tight">
              <span className="text-gradient">Start Early Detection.</span>{" "}
              <span className="text-gradient-brand">Save Lives.</span>
            </h2>
            <p className="mt-5 max-w-xl mx-auto text-muted-foreground">
              Pilot Predoctor AI in your unit. Set up takes under a day with our clinical onboarding team.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="/dashboard"
                className="group relative inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-medium bg-gradient-primary shadow-glow-strong transition-shadow duration-300"
              >
                Go to Dashboard
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </a>
              <a
                href="#features"
                className="inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-medium glass border-border/60 hover:border-primary/50 transition-colors"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
