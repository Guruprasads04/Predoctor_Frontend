import { useReveal } from "@/hooks/use-reveal";
import { Upload, UserSearch, Cpu, ShieldAlert } from "lucide-react";

const steps = [
  { icon: Upload, title: "Upload Data", desc: "Stream EHR + monitor signals via secure ingest." },
  { icon: UserSearch, title: "Select Patient", desc: "Choose a bed or cohort to analyze." },
  { icon: Cpu, title: "Analyze", desc: "Time-series model evaluates a 6-hour window." },
  { icon: ShieldAlert, title: "Predict", desc: "Risk score, features, and recommended action." },
];

export const Workflow = () => {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="workflow" className="relative py-24 md:py-32 overflow-hidden">
      <div className="container">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-primary-glow">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-glow" /> Workflow
          </span>
          <h2 className="mt-4 font-display text-3xl md:text-5xl font-semibold tracking-tight text-gradient">
            From signal to insight in four steps
          </h2>
        </div>

        <div ref={ref} className="relative mt-14">
          {/* Connector line */}
          <div className="hidden md:block absolute top-10 left-[8%] right-[8%] h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          <div
            className="hidden md:block absolute top-10 left-[8%] h-px"
            style={{
              width: visible ? "84%" : "0%",
              background: "linear-gradient(90deg, hsl(var(--primary-glow)), hsl(var(--accent-glow)))",
              boxShadow: "0 0 12px hsl(var(--primary-glow) / 0.6)",
              transition: "width 2s cubic-bezier(0.22,1,0.36,1)",
            }}
          />

          <ol className="grid md:grid-cols-4 gap-6 md:gap-4 relative">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <li
                  key={s.title}
                  className="relative flex flex-col items-center text-center"
                  style={{
                    animation: visible
                      ? `fade-in-up 0.7s cubic-bezier(0.22,1,0.36,1) ${0.2 + i * 0.18}s both`
                      : undefined,
                    opacity: visible ? undefined : 0,
                  }}
                >
                  <div className="relative">
                    <span
                      aria-hidden
                      className="absolute inset-0 rounded-2xl blur-xl opacity-70 animate-glow-pulse"
                      style={{
                        background:
                          "radial-gradient(closest-side, hsl(var(--primary-glow) / 0.7), transparent 70%)",
                        animationDelay: `${i * 0.4}s`,
                      }}
                    />
                    <div className="relative h-20 w-20 rounded-2xl glass-strong glow-border flex items-center justify-center">
                      <Icon className="h-7 w-7 text-primary-glow" strokeWidth={1.8} />
                      <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-gradient-primary text-[11px] font-mono font-semibold flex items-center justify-center shadow-glow">
                        {i + 1}
                      </span>
                    </div>
                  </div>

                  <h3 className="mt-5 font-display text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-[220px]">{s.desc}</p>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
};
