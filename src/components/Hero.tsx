import { Particles } from "./Particles";
import { DashboardMock } from "./DashboardMock";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const DASHBOARD_ROUTE = "/dashboard";
export const Hero = () => {
  return (
    <section id="home" className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
      {/* Grid + particles */}
      <div className="absolute inset-0 grid-bg opacity-40" aria-hidden />
      <Particles count={28} />

      {/* Glow halo */}
      <div
        aria-hidden
        className="absolute left-1/2 top-32 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-3xl opacity-60 animate-glow-pulse"
        style={{
          background:
            "radial-gradient(closest-side, hsl(var(--primary) / 0.5), transparent 70%), radial-gradient(closest-side, hsl(var(--accent) / 0.4), transparent 70%)",
        }}
      />

      <div className="container relative">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Tag */}
          {/* <div
            className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-medium text-muted-foreground animate-fade-in-up"
            style={{ animationDelay: "0.05s" }}
          >
            <Sparkles className="h-3.5 w-3.5 text-primary-glow" />
            <span>AI-Powered ICU Monitoring</span>
            <span className="ml-1 inline-flex items-center gap-1 text-[10px] font-mono text-cyan">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse" /> v2.1
            </span>
          </div> */}

          {/* Heading */}
          <h1
            className="mt-6 font-display text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] animate-fade-in-up"
            style={{ animationDelay: "0.15s" }}
          >
            <span className="text-gradient">Predict Sepsis</span>{" "}
            <span className="text-gradient">Before It</span>{" "}
            <span className="relative inline-block">
              <span className="text-gradient-brand">Becomes Critical</span>
              <span
                aria-hidden
                className="absolute -inset-x-4 -inset-y-2 -z-10 blur-2xl opacity-60"
                style={{ background: "linear-gradient(90deg, hsl(var(--primary-glow) / 0.5), hsl(var(--accent-glow) / 0.5))" }}
              />
            </span>
          </h1>

          {/* Subtext */}
          <p
            className="mt-6 max-w-2xl text-base md:text-lg text-muted-foreground leading-relaxed animate-fade-in-up"
            style={{ animationDelay: "0.3s" }}
          >
            Analyze ICU patient time-series data and detect sepsis risk within a 6-hour
            horizon using machine learning trained on 1,000+ clinical records.
          </p>

          {/* CTAs */}
          <div
            className="mt-8 flex flex-wrap items-center justify-center gap-3 animate-fade-in-up"
            style={{ animationDelay: "0.45s" }}
          >
            <Link
              to={DASHBOARD_ROUTE}
              className="group relative inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium bg-gradient-primary shadow-glow hover:shadow-glow-strong transition-shadow duration-300"
            >

              <span>Start Analysis</span>
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </Link>
            <a
              href="#dashboard"
              className="inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium glass border-border/60 hover:border-primary/50 hover:text-primary-glow transition-all duration-300"
            >
              <span className="h-2 w-2 rounded-full bg-cyan animate-pulse" />
              View Demo
            </a>
          </div>

          {/* Tiny credibility row */}
          <div
            className="mt-8 flex items-center gap-6 text-[11px] font-mono text-muted-foreground animate-fade-in"
            style={{ animationDelay: "0.7s" }}
          >
            <span>HIPAA-aware</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>Time-series ML</span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span>Explainable AI</span>
          </div>
        </div>

        {/* Dashboard mock */}
        <div
          className="mt-20 md:mt-24 animate-fade-in-up"
          style={{ animationDelay: "0.6s" }}
        >
          <DashboardMock />
        </div>
      </div>
    </section>
  );
};
