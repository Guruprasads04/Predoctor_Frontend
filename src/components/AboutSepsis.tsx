import { AlertTriangle, Activity, HeartPulse, Bug, Clock, ShieldAlert } from "lucide-react";
import { useReveal } from "@/hooks/use-reveal";

const causes = [
  {
    icon: Bug,
    title: "Bacterial Infections",
    text: "Most common trigger — pneumonia, UTIs, abdominal or bloodstream infections that escape local control.",
  },
  {
    icon: ShieldAlert,
    title: "Weakened Immunity",
    text: "Elderly patients, newborns, chemotherapy, diabetes, or chronic disease dramatically raise risk.",
  },
  {
    icon: Activity,
    title: "Invasive Procedures",
    text: "Catheters, ventilators, surgical wounds and IV lines can introduce pathogens into the bloodstream.",
  },
];

const effects = [
  {
    icon: HeartPulse,
    title: "Circulatory Collapse",
    text: "Blood pressure drops, organs lose perfusion — leading to septic shock.",
    accent: "from-rose-500/30 to-rose-500/0",
  },
  {
    icon: AlertTriangle,
    title: "Multi-Organ Failure",
    text: "Kidneys, lungs, liver and heart begin to shut down within hours if untreated.",
    accent: "from-amber-500/30 to-amber-500/0",
  },
  {
    icon: Clock,
    title: "Mortality Window",
    text: "Risk of death rises ~8% for every hour treatment is delayed after onset.",
    accent: "from-primary/30 to-primary/0",
  },
];

export const AboutSepsis = () => {
  const header = useReveal<HTMLDivElement>();
  const grid1 = useReveal<HTMLDivElement>();
  const grid2 = useReveal<HTMLDivElement>();

  return (
    <section id="about-sepsis" className="relative py-24 md:py-32 overflow-hidden">
      {/* ambient glow */}
      <div
        aria-hidden
        className="absolute left-1/2 top-1/3 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-3xl opacity-40"
        style={{
          background:
            "radial-gradient(closest-side, hsl(var(--accent) / 0.4), transparent 70%)",
        }}
      />
      <div className="absolute inset-0 grid-bg opacity-20" aria-hidden />

      <div className="container relative">
        {/* Header */}
        <div ref={header.ref} className={`max-w-3xl mx-auto text-center reveal ${header.visible ? "is-visible" : ""}`}>
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs font-mono uppercase tracking-wider text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
            Clinical Briefing
          </div>
          <h2 className="mt-5 font-display text-3xl md:text-5xl font-semibold tracking-tight leading-[1.08]">
            <span className="text-gradient">Understanding</span>{" "}
            <span className="text-gradient-brand">Sepsis</span>
          </h2>
          <p className="mt-5 text-base md:text-lg text-muted-foreground leading-relaxed">
            Sepsis is the body's <span className="text-foreground">extreme, dysregulated response</span> to infection.
            Instead of fighting the pathogen locally, the immune system triggers widespread inflammation that damages
            the patient's own tissues and organs. It affects <span className="text-foreground">~49 million people</span> globally
            each year and causes <span className="text-foreground">11 million deaths</span> — one every 2.8 seconds.
          </p>
        </div>

        {/* What is it — highlight card */}
        <div className="mt-14 grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 glass-strong rounded-2xl p-7 md:p-9 glow-border relative overflow-hidden">
            <div
              aria-hidden
              className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-50"
              style={{ background: "radial-gradient(closest-side, hsl(var(--primary) / 0.5), transparent 70%)" }}
            />
            <div className="relative">
              <div className="text-xs font-mono uppercase tracking-wider text-primary-glow">What is it</div>
              <h3 className="mt-2 font-display text-2xl md:text-3xl font-semibold">
                A medical emergency hidden in vital signs
              </h3>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Sepsis develops when chemicals released into the bloodstream to fight an infection trigger inflammation
                throughout the body. This cascade can rapidly progress to <span className="text-foreground">severe sepsis</span> and
                <span className="text-foreground"> septic shock</span>, where blood pressure plummets and vital organs
                lose oxygen. Early signs — rising lactate, altered heart rate variability, falling blood pressure — are
                subtle and easily missed by traditional ICU monitoring.
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Tachycardia", "Hypotension", "↑ Lactate", "↑ Respiratory rate", "Altered mentation", "Fever / hypothermia"].map((s) => (
                  <span key={s} className="rounded-lg border border-border/60 bg-secondary/40 px-3 py-1.5 text-xs font-mono text-foreground/80">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-7 relative overflow-hidden">
            <div className="text-xs font-mono uppercase tracking-wider text-cyan">By the numbers</div>
            <ul className="mt-4 space-y-5">
              <li>
                <div className="font-display text-3xl font-semibold text-gradient-brand">49M</div>
                <div className="text-xs text-muted-foreground mt-1">cases worldwide each year</div>
              </li>
              <li>
                <div className="font-display text-3xl font-semibold text-gradient-brand">1 in 3</div>
                <div className="text-xs text-muted-foreground mt-1">ICU deaths involve sepsis</div>
              </li>
              <li>
                <div className="font-display text-3xl font-semibold text-gradient-brand">~8%</div>
                <div className="text-xs text-muted-foreground mt-1">higher mortality per hour of delay</div>
              </li>
            </ul>
          </div>
        </div>

        {/* Causes */}
        <div ref={grid1.ref} className={`mt-16 reveal ${grid1.visible ? "is-visible" : ""}`}>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">How it's caused</div>
              <h3 className="mt-2 font-display text-2xl md:text-3xl font-semibold">Common triggers</h3>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Any infection can lead to sepsis, but these scenarios most commonly precede ICU presentation.
            </p>
          </div>

          <div className="mt-8 grid md:grid-cols-3 gap-5">
            {causes.map(({ icon: Icon, title, text }, i) => (
              <div
                key={title}
                className="group glass rounded-2xl p-6 hover:border-primary/40 hover:-translate-y-1 transition-all duration-300"
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
                  <Icon className="h-5 w-5 text-primary-foreground" strokeWidth={2.2} />
                </div>
                <div className="mt-5 font-display text-lg font-semibold">{title}</div>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Effects */}
        <div ref={grid2.ref} className={`mt-16 reveal ${grid2.visible ? "is-visible" : ""}`}>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">What it does</div>
              <h3 className="mt-2 font-display text-2xl md:text-3xl font-semibold">The clinical cascade</h3>
            </div>
            <p className="text-sm text-muted-foreground max-w-md">
              Without rapid intervention, sepsis progresses through predictable — but accelerating — stages.
            </p>
          </div>

          <div className="mt-8 grid md:grid-cols-3 gap-5">
            {effects.map(({ icon: Icon, title, text, accent }, i) => (
              <div
                key={title}
                className="relative glass-strong rounded-2xl p-6 overflow-hidden hover:-translate-y-1 transition-all duration-300"
              >
                <div aria-hidden className={`absolute -inset-1 -z-0 bg-gradient-to-br ${accent} blur-2xl opacity-60`} />
                <div className="relative">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                    <span className="h-px flex-1 bg-border/60" />
                    <Icon className="h-5 w-5 text-primary-glow" strokeWidth={2.2} />
                  </div>
                  <div className="mt-4 font-display text-lg font-semibold">{title}</div>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{text}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Closing line */}
          <div className="mt-10 glass rounded-2xl p-6 md:p-7 flex flex-col md:flex-row md:items-center gap-4 md:gap-6 border border-primary/20">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
              <Clock className="h-5 w-5 text-primary-foreground" strokeWidth={2.2} />
            </div>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
              <span className="text-foreground font-medium">Time is tissue.</span>{" "}
              Predoctor AI surfaces the earliest signals hours before clinical onset — so teams can act while sepsis is still reversible.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
