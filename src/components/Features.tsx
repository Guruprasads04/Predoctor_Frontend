import { useReveal } from "@/hooks/use-reveal";
import {
  HeartPulse,
  Waves,
  Sparkles,
  ChartSpline,
  Siren,
  Stethoscope,
} from "lucide-react";

const features = [
  {
    icon: HeartPulse,
    title: "Real-Time ICU Monitoring",
    desc: "Continuous ingestion of vitals, labs, and ventilator data with sub-minute latency.",
  },
  {
    icon: Waves,
    title: "Time-Series Prediction Engine",
    desc: "Sequence models trained on 6-hour rolling windows surface deterioration trends.",
  },
  {
    icon: Sparkles,
    title: "Explainable AI Insights",
    desc: "SHAP-based feature attribution shows clinicians why a risk score is rising.",
  },
  {
    icon: ChartSpline,
    title: "Risk Trend Visualization",
    desc: "Smooth, interactive charts reveal trajectory and confidence bands at a glance.",
  },
  {
    icon: Siren,
    title: "Early Warning Alerts",
    desc: "Tiered notifications route to nurses, residents, or attendings based on severity.",
  },
  {
    icon: Stethoscope,
    title: "Patient Management System",
    desc: "Unit-wide cohort view with watchlists, notes, and shift handover summaries.",
  },
];

export const Features = () => {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <section id="features" className="relative py-24 md:py-32">
      <div className="container">
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-[11px] font-mono uppercase tracking-wider text-primary-glow">
            <span className="h-1.5 w-1.5 rounded-full bg-primary-glow" /> Capabilities
          </span>
          <h2 className="mt-4 font-display text-3xl md:text-5xl font-semibold tracking-tight text-gradient">
            Everything an ICU team needs to act earlier
          </h2>
          <p className="mt-4 text-muted-foreground">
            Built for clinical workflows: clear, fast, and explainable from the bedside to the analytics dashboard.
          </p>
        </div>

        <div ref={ref} className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="group relative glass-strong glow-border rounded-2xl p-6 card-hover"
                style={{
                  animation: visible
                    ? `fade-in-up 0.7s cubic-bezier(0.22,1,0.36,1) ${i * 0.08}s both`
                    : undefined,
                  opacity: visible ? undefined : 0,
                }}
              >
                <div className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 to-accent/30 border border-primary/30">
                  <Icon className="h-5 w-5 text-primary-glow" strokeWidth={2} />
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-xl bg-primary/30 blur-md opacity-0 group-hover:opacity-80 transition-opacity"
                  />
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>

                {/* <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground group-hover:text-primary-glow transition-colors">
                  Learn more <span className="transition-transform group-hover:translate-x-1">→</span>
                </div> */}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
