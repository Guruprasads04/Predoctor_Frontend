import { Activity, Heart, TrendingUp, AlertTriangle } from "lucide-react";

// Animated SVG dashboard mockup — central hero visual
export const DashboardMock = () => {
  // Risk trend line points
  const points = "0,90 30,80 60,82 90,70 120,72 150,55 180,60 210,42 240,35 270,28 300,18";
  const bars = [62, 78, 45, 88, 70, 54, 92, 38];

  return (
    <div className="relative w-full max-w-[640px] mx-auto">
      {/* Halo glow behind */}
      <div
        aria-hidden
        className="absolute -inset-12 rounded-[3rem] blur-3xl opacity-70 animate-glow-pulse"
        style={{
          background:
            "radial-gradient(closest-side, hsl(var(--primary-glow) / 0.55), transparent 70%), radial-gradient(closest-side, hsl(var(--accent-glow) / 0.45), transparent 70%)",
        }}
      />

      {/* Floating tilted small card — top-left */}
      <div
        className="absolute -left-6 md:-left-14 top-8 z-20 glass-strong glow-border rounded-2xl p-3 md:p-4 w-[180px] md:w-[200px] shadow-card animate-float-slow"
        style={{ transform: "rotate(-6deg)" }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="h-7 w-7 rounded-lg bg-destructive/20 flex items-center justify-center">
            <AlertTriangle className="h-3.5 w-3.5 text-destructive" />
          </div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
            High Risk
          </span>
        </div>
        <div className="text-xl font-display font-semibold">87%</div>
        <div className="text-[11px] text-muted-foreground">Patient #ICU-0421</div>
        <div className="mt-2 h-1 rounded-full bg-secondary overflow-hidden">
          <div className="h-full w-[87%] bg-gradient-to-r from-destructive to-accent" />
        </div>
      </div>

      {/* Floating tilted small card — bottom-right */}
      <div
        className="absolute -right-4 md:-right-10 bottom-10 z-20 glass-strong glow-border rounded-2xl p-3 md:p-4 w-[180px] md:w-[210px] shadow-card animate-float"
        style={{ transform: "rotate(5deg)", animationDelay: "1.2s" }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="h-7 w-7 rounded-lg bg-cyan/20 flex items-center justify-center">
            <Heart className="h-3.5 w-3.5 text-cyan" />
          </div>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
            Vitals stable
          </span>
        </div>
        <div className="flex items-end gap-3">
          <div>
            <div className="text-[10px] text-muted-foreground">HR</div>
            <div className="text-base font-semibold">98 <span className="text-[10px] text-muted-foreground">bpm</span></div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground">SpO₂</div>
            <div className="text-base font-semibold">96<span className="text-[10px] text-muted-foreground">%</span></div>
          </div>
          <div>
            <div className="text-[10px] text-muted-foreground">Temp</div>
            <div className="text-base font-semibold">38.4°</div>
          </div>
        </div>
      </div>

      {/* Main dashboard panel */}
      <div className="relative z-10 glass-strong glow-border rounded-3xl p-5 md:p-6 shadow-card animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-accent/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-cyan/70" />
            </div>
            <span className="ml-3 text-xs font-mono text-muted-foreground">
              sepsialert.ai / dashboard
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-cyan">
            <span className="relative flex h-2 w-2">
              <span className="absolute inset-0 rounded-full bg-cyan animate-ping opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan" />
            </span>
            LIVE
          </div>
        </div>

        {/* Risk trend chart */}
        <div className="rounded-2xl bg-secondary/40 border border-border/60 p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-xs text-muted-foreground">Sepsis Risk Score (6h horizon)</div>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-display font-semibold text-gradient-brand">0.74</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-destructive">
                  <TrendingUp className="h-3 w-3" /> +12.4%
                </span>
              </div>
            </div>
            <div className="flex gap-1">
              {["1H", "6H", "24H"].map((t, i) => (
                <span
                  key={t}
                  className={`px-2 py-1 text-[10px] font-mono rounded-md ${
                    i === 1 ? "bg-primary/20 text-primary-glow border border-primary/30" : "text-muted-foreground"
                  }`}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <svg viewBox="0 0 300 100" className="w-full h-24 overflow-visible">
            <defs>
              <linearGradient id="lineGrad" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0%" stopColor="hsl(var(--primary-glow))" />
                <stop offset="100%" stopColor="hsl(var(--accent-glow))" />
              </linearGradient>
              <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary-glow))" stopOpacity="0.4" />
                <stop offset="100%" stopColor="hsl(var(--primary-glow))" stopOpacity="0" />
              </linearGradient>
            </defs>
            {/* grid */}
            {[20, 50, 80].map((y) => (
              <line key={y} x1="0" x2="300" y1={y} y2={y} stroke="hsl(var(--border))" strokeDasharray="2 4" strokeOpacity="0.4" />
            ))}
            {/* area under line */}
            <polygon
              points={`0,100 ${points} 300,100`}
              fill="url(#areaGrad)"
              className="animate-fade-in"
              style={{ animationDelay: "0.6s" }}
            />
            {/* main line */}
            <polyline
              points={points}
              fill="none"
              stroke="url(#lineGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="1000"
              style={{
                filter: "drop-shadow(0 0 6px hsl(var(--primary-glow) / 0.7))",
                animation: "draw-line 2.4s ease-out 0.3s forwards",
              }}
            />
            {/* end dot */}
            <circle cx="300" cy="18" r="4" fill="hsl(var(--accent-glow))" className="animate-pulse">
              <animate attributeName="r" values="4;6;4" dur="1.6s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>

        {/* Bottom row: feature importance + patient */}
        <div className="grid grid-cols-5 gap-3">
          <div className="col-span-3 rounded-2xl bg-secondary/40 border border-border/60 p-4">
            <div className="text-xs text-muted-foreground mb-3">Feature Importance</div>
            <div className="flex items-end justify-between gap-2 h-20">
              {bars.map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-t-md origin-bottom"
                    style={{
                      height: `${h}%`,
                      background:
                        i % 2 === 0
                          ? "linear-gradient(to top, hsl(var(--primary)), hsl(var(--primary-glow)))"
                          : "linear-gradient(to top, hsl(var(--accent)), hsl(var(--accent-glow)))",
                      boxShadow: "0 0 12px hsl(var(--primary-glow) / 0.3)",
                      animation: `bar-rise 0.9s cubic-bezier(0.22,1,0.36,1) ${0.4 + i * 0.08}s both`,
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-[9px] font-mono text-muted-foreground">
              <span>HR</span><span>Lac</span><span>WBC</span><span>BP</span><span>Temp</span><span>RR</span><span>SpO₂</span><span>pH</span>
            </div>
          </div>
          <div className="col-span-2 rounded-2xl bg-secondary/40 border border-border/60 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center text-xs font-semibold">
                JD
              </div>
              <div className="min-w-0">
                <div className="text-xs font-medium truncate">J. Doe · 64</div>
                <div className="text-[10px] text-muted-foreground">ICU-0421 · Bed 7</div>
              </div>
            </div>
            <div className="space-y-1.5 text-[10px] font-mono">
              <div className="flex justify-between"><span className="text-muted-foreground">Admit</span><span>4d 12h</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Lactate</span><span className="text-destructive">3.8</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">qSOFA</span><span className="text-accent-glow">2</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
