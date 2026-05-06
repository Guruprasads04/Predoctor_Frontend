import { useReveal } from "@/hooks/use-reveal";

const features = [
  { name: "Lactate", weight: 92, change: "+0.18" },
  { name: "Heart Rate Variability", weight: 78, change: "+0.11" },
  { name: "WBC Count", weight: 71, change: "+0.09" },
  { name: "Mean Arterial Pressure", weight: 64, change: "-0.07" },
  { name: "Respiratory Rate", weight: 58, change: "+0.05" },
  { name: "Temperature", weight: 44, change: "+0.04" },
];

const insights = [
  "Lactate trending upward over last 3 hours — strongest signal in window.",
  "HRV decreasing — autonomic instability detected.",
  "WBC elevation aligns with inflammatory response trajectory.",
  "Recommend: re-check lactate in 60 min, consider broad-spectrum coverage.",
];

export const Explainability = () => {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="explainability" className="relative py-24 md:py-32">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-cyan">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan" /> Explainable AI
          </span>
          <h2 className="mt-4 font-display text-3xl md:text-5xl font-semibold tracking-tight text-gradient">
            Understand Every Prediction
          </h2>
          <p className="mt-4 text-muted-foreground">
            Every risk score comes with the features driving it — no black boxes, no surprises at the bedside.
          </p>
        </div>

        <div ref={ref} className="mt-14 grid lg:grid-cols-2 gap-5">
          {/* Bars */}
          <div
            className="glass-strong glow-border rounded-2xl p-6 md:p-8"
            style={{ animation: visible ? "fade-in-up 0.8s ease-out both" : undefined }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-xs uppercase tracking-wider font-mono text-muted-foreground">Feature Importance</div>
                <div className="mt-1 font-display text-lg font-semibold">Patient ICU-0421 · t = now</div>
              </div>
              <span className="text-[10px] font-mono text-primary-glow">SHAP values</span>
            </div>
            <div className="space-y-4">
              {features.map((f, i) => (
                <div key={f.name}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-foreground/90">{f.name}</span>
                    <span className="font-mono text-muted-foreground">
                      <span className={f.change.startsWith("+") ? "text-destructive" : "text-cyan"}>{f.change}</span>
                    </span>
                  </div>
                  <div className="h-2.5 rounded-full bg-secondary/60 overflow-hidden">
                    <div
                      className="h-full rounded-full origin-left"
                      style={{
                        width: visible ? `${f.weight}%` : "0%",
                        background:
                          "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent-glow)))",
                        boxShadow: "0 0 12px hsl(var(--primary-glow) / 0.4)",
                        transition: `width 1.2s cubic-bezier(0.22,1,0.36,1) ${0.2 + i * 0.1}s`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Insights */}
          <div
            className="glass-strong glow-border rounded-2xl p-6 md:p-8"
            style={{ animation: visible ? "fade-in-up 0.8s 0.15s ease-out both" : undefined }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-xs uppercase tracking-wider font-mono text-muted-foreground">AI Insights</div>
                <div className="mt-1 font-display text-lg font-semibold">Clinical Summary</div>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono text-cyan">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan animate-pulse" /> generated 12s ago
              </span>
            </div>

            <ul className="space-y-4">
              {insights.map((t, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-sm"
                  style={{
                    animation: visible
                      ? `fade-in-up 0.6s cubic-bezier(0.22,1,0.36,1) ${0.4 + i * 0.12}s both`
                      : undefined,
                  }}
                >
                  <span className="mt-1 inline-block h-2 w-2 shrink-0 rounded-full bg-gradient-primary shadow-glow" />
                  <span className="text-muted-foreground leading-relaxed">{t}</span>
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-6 border-t border-border/60 flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Confidence</span>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-32 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full w-[88%] bg-gradient-primary" />
                </div>
                <span className="text-xs font-mono text-primary-glow">88%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
