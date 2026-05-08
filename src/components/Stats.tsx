import { useReveal } from "@/hooks/use-reveal";
import { useCounter } from "@/hooks/use-counter";

const stats = [
  { value: 90, suffix: "%", label: "Prediction Accuracy", sub: "AUROC on held-out ICU set" },
  { value: 6, suffix: "h", label: "Early Detection", sub: "Median lead time before onset" },
  { value: 1000, suffix: "+", label: "ICU Records Processed", sub: "Time-series patient encounters" },
];

const StatItem = ({ stat, visible, delay }: { stat: typeof stats[0]; visible: boolean; delay: number }) => {
  const v = useCounter(stat.value, visible);
  return (
    <div
      className="relative glass-strong glow-border rounded-2xl p-6 md:p-8 card-hover"
      style={{
        animation: visible ? `fade-in-up 0.8s cubic-bezier(0.22,1,0.36,1) ${delay}s both` : undefined,
      }}
    >
      <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 rounded-full bg-primary/15 border border-primary/30 px-2 py-0.5 text-[10px] font-mono text-primary-glow">
        <span className="h-1.5 w-1.5 rounded-full bg-primary-glow animate-pulse" />
        verified
      </div>
      <div className="font-display text-4xl md:text-5xl font-semibold text-gradient-brand">
        {v.toLocaleString()}{stat.suffix}
      </div>
      <div className="mt-2 text-sm font-medium">{stat.label}</div>
      <div className="mt-1 text-xs text-muted-foreground">{stat.sub}</div>
    </div>
  );
};

export const Stats = () => {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <section className="relative py-20 md:py-28">
      <div ref={ref} className="container grid md:grid-cols-3 gap-5">
        {stats.map((s, i) => (
          <StatItem key={s.label} stat={s} visible={visible} delay={i * 0.12} />
        ))}
      </div>
    </section>
  );
};
