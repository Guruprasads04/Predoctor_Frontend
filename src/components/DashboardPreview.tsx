import { useEffect, useRef } from "react";
import { useReveal } from "@/hooks/use-reveal";
import { CheckCircle2 } from "lucide-react";

export const DashboardPreview = () => {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const wrapRef = useRef<HTMLDivElement>(null);

  // subtle parallax on mouse move
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      el.style.setProperty("--rx", `${y * -4}deg`);
      el.style.setProperty("--ry", `${x * 6}deg`);
    };
    const reset = () => {
      el.style.setProperty("--rx", `0deg`);
      el.style.setProperty("--ry", `0deg`);
    };
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", reset);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", reset);
    };
  }, []);

  // multi-line chart points
  const lineA = "0,80 40,72 80,60 120,55 160,40 200,46 240,30 280,22 320,18";
  const lineB = "0,90 40,84 80,82 120,76 160,70 200,68 240,62 280,58 320,54";

  return (
    <section id="dashboard" className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30" aria-hidden />
      <div ref={ref} className="container grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <div
          className="max-w-xl"
          style={{ animation: visible ? "fade-in-up 0.8s ease-out both" : undefined }}
        >
          <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-accent-glow">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-glow" /> Live Dashboard
          </span>
          <h2 className="mt-4 font-display text-3xl md:text-5xl font-semibold tracking-tight text-gradient">
            Visualize Patient Risk in Real Time
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Stream-processed signals from monitors and EHRs are fused into a single
            risk trajectory — so deterioration is visible the moment it starts to bend.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "Sub-second update for vitals and labs",
              "Confidence bands and trend slope indicators",
              "Bedside-to-charge-nurse alert routing",
            ].map((t) => (
              <li key={t} className="flex items-start gap-3 text-sm">
                <CheckCircle2 className="h-5 w-5 text-cyan mt-0.5 shrink-0" />
                <span className="text-muted-foreground">{t}</span>
              </li>
            ))}
          </ul>
        </div>

        <div
          ref={wrapRef}
          className="relative"
          style={{
            perspective: "1200px",
            animation: visible ? "fade-in-up 0.9s 0.15s ease-out both" : undefined,
          }}
        >
          <div
            className="relative glass-strong glow-border rounded-3xl p-6 shadow-card transition-transform duration-300"
            style={{ transform: "rotateX(var(--rx,0)) rotateY(var(--ry,0))" }}
          >
            {/* halo */}
            <div
              aria-hidden
              className="absolute -inset-8 -z-10 rounded-[3rem] blur-3xl opacity-60"
              style={{
                background:
                  "radial-gradient(closest-side, hsl(var(--accent-glow) / 0.4), transparent 70%), radial-gradient(closest-side, hsl(var(--primary-glow) / 0.4), transparent 70%)",
              }}
            />

            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs text-muted-foreground">Cohort Risk · ICU East</div>
                <div className="text-2xl font-display font-semibold mt-0.5">12 patients monitored</div>
              </div>
              <div className="flex gap-1">
                {["6H", "24H", "7D"].map((t, i) => (
                  <span
                    key={t}
                    className={`px-2.5 py-1 text-[11px] font-mono rounded-md ${
                      i === 0 ? "bg-primary/20 text-primary-glow border border-primary/30" : "text-muted-foreground border border-border"
                    }`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-secondary/40 border border-border/60 p-4">
              <svg viewBox="0 0 320 100" className="w-full h-40 overflow-visible">
                <defs>
                  <linearGradient id="dpA" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stopColor="hsl(var(--primary-glow))" />
                    <stop offset="100%" stopColor="hsl(var(--accent-glow))" />
                  </linearGradient>
                  <linearGradient id="dpAreaA" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary-glow))" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="hsl(var(--primary-glow))" stopOpacity="0" />
                  </linearGradient>
                </defs>
                {[20, 50, 80].map((y) => (
                  <line key={y} x1="0" x2="320" y1={y} y2={y} stroke="hsl(var(--border))" strokeDasharray="2 4" strokeOpacity="0.4" />
                ))}
                <polygon points={`0,100 ${lineA} 320,100`} fill="url(#dpAreaA)" />
                <polyline
                  points={lineB}
                  fill="none"
                  stroke="hsl(var(--cyan))"
                  strokeOpacity="0.7"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                />
                <polyline
                  points={lineA}
                  fill="none"
                  stroke="url(#dpA)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="1000"
                  style={{
                    filter: "drop-shadow(0 0 6px hsl(var(--primary-glow) / 0.7))",
                    animation: visible ? "draw-line 2.4s ease-out 0.5s forwards" : undefined,
                  }}
                />
              </svg>
            </div>

            {/* mini stats row */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { l: "Avg. Risk", v: "0.42", c: "text-primary-glow" },
                { l: "High-Risk", v: "3", c: "text-destructive" },
                { l: "Stable", v: "9", c: "text-cyan" },
              ].map((s) => (
                <div key={s.l} className="rounded-xl bg-secondary/40 border border-border/60 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">{s.l}</div>
                  <div className={`mt-1 text-lg font-display font-semibold ${s.c}`}>{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* floating mini stat card */}
          <div
            className="absolute -top-6 -right-2 md:-right-6 glass-strong glow-border rounded-2xl p-3 shadow-card animate-float"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">Alerts (24h)</div>
            <div className="text-xl font-display font-semibold text-gradient-brand">14</div>
          </div>
        </div>
      </div>
    </section>
  );
};
