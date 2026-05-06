import { Linkedin, Twitter, Youtube } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo.png";
import footerLogo from "@/assets/logo-footer.png";
import productLogo from "@/assets/logo.png";

type FooterLink = {
  label: string;
  href: string;
};

const columns = [
  {
    title: "Platform",
    links: [
      { label: "Clinician Dashboard", href: "/#dashboard" },
      { label: "Patient Predictions", href: "/#workflow" },
      { label: "Risk Trend Analysis", href: "/#features" },
      { label: "Feature Importance", href: "/#explainability" },
      { label: "Clinical Insights", href: "/#explainability" },
      { label: "Explainability Reports", href: "/#explainability" },
    ],
  },
  {
    title: "Project",
    links: [
      { label: "Sepsis Prediction", href: "/#about-sepsis" },
      { label: "6-Hour Risk Forecast", href: "/#features" },
      { label: "ICU Monitoring", href: "/#dashboard" },
      { label: "CSV Upload Workflow", href: "/#workflow" },
      { label: "Prediction Review", href: "/#dashboard" },
      { label: "Analytics Overview", href: "/#features" },
    ],
  },
  // {
  //   title: "Contact",
  //   links: [
  //     { label: "About Predoctor AI", href: "/#home" },
  //     { label: "Clinical Support", href: "/#cta" },
  //     { label: "Technical Help", href: "/#cta" },
  //     { label: "Documentation", href: "/#workflow" },
  //   ],
  // },
];

export const Footer = () => {
  const [email, setEmail] = useState("");

  return (
    <footer id="about" className="relative border-t border-border/60 pt-20 pb-8 mt-12 overflow-hidden">
      {/* ambient glow */}
      <div
        aria-hidden
        className="absolute left-1/2 -bottom-40 -translate-x-1/2 w-[1100px] h-[500px] rounded-full blur-3xl opacity-30"
        style={{
          background:
            "radial-gradient(closest-side, hsl(var(--primary) / 0.45), transparent 70%)",
        }}
      />

      <div className="container relative">
        {/* Top: 4 columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-8">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-display text-xl md:text-2xl font-semibold text-primary-glow">
                {col.title}
              </h3>
              <ul className="mt-5 space-y-2.5 font-mono text-sm">
                {col.links.map((link: FooterLink) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-foreground/75 hover:text-primary-glow transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-display text-xl md:text-2xl font-semibold text-primary-glow leading-tight">
              Sign up for our newsletter to stay up to date
            </h3>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-5 flex flex-col gap-3"
            >
              <label className="sr-only" htmlFor="newsletter-email">
                Email
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full rounded-md bg-background/40 border border-border/70 px-4 py-3 text-sm font-mono text-foreground placeholder:text-muted-foreground/70 outline-none focus:border-primary/60 focus:shadow-glow transition-all"
              />
              <button
                type="submit"
                className="self-start rounded-md bg-foreground text-background px-6 py-2.5 text-sm font-medium hover:bg-foreground/90 transition-colors shadow-card"
              >
                contact us
              </button>
            </form>

            <div className="mt-6 flex items-center gap-4 text-muted-foreground">
              <a href="#" aria-label="LinkedIn" className="hover:text-primary-glow transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-primary-glow transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" aria-label="YouTube" className="hover:text-primary-glow transition-colors">
                <Youtube className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Giant outlined wordmark with logo */}
        <div className="mt-20 select-none pointer-events-none relative flex items-center gap-[2vw]" aria-hidden>
          <img
            src={footerLogo}
            alt=""
            className="shrink-0 h-[14vw] md:h-[12vw] w-auto object-contain drop-shadow-[0_0_30px_hsl(var(--primary)/0.45)]"
          />
          <div className="relative flex-1">
            {/* base outlined text */}
            <div
              className="font-display font-bold tracking-tight leading-none whitespace-nowrap text-[12vw] md:text-[10vw]"
              style={{
                WebkitTextStroke: "1px hsl(var(--primary) / 0.35)",
                color: "transparent",
              }}
            >
              Predoctor AI
            </div>
            {/* shimmering sweep overlay */}
            <div
              className="absolute inset-0 font-display font-bold tracking-tight leading-none whitespace-nowrap text-[12vw] md:text-[10vw] wordmark-shine"
            >
              Predoctor AI
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 sm:items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-primary-glow">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-cyan opacity-75 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan" />
            </span>
            <span>All systems operational</span>
          </div>

          <div className="flex items-center gap-6 text-muted-foreground">
            <span className="hidden sm:inline-flex items-center gap-2 text-foreground/80">
              <img
                src={productLogo}
                alt="Predoctor AI logo"
                className="h-5 w-5 object-contain"
              />
              <span className="font-display font-semibold tracking-tight">
                Predoctor <span className="ai-shine font-bold">AI</span>
              </span>
              <span className="ml-2 text-muted-foreground">© {new Date().getFullYear()}</span>
            </span>
            <a href="#" className="hover:text-foreground transition-colors">Privacy policy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms of service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
