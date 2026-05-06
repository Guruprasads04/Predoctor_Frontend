import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo-nav.png";

const links = [
  { label: "Home", href: "#home", route: false },
  { label: "Features", href: "#features", route: false },
  { label: "Dashboard", href: "/dashboard", route: true },
  { label: "Patients", href: "/patients", route: true },
  { label: "Analytics", href: "/analytics", route: true },
  { label: "About Sepsis", href: "#about-sepsis", route: false },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="container">
        <nav
          className={`flex items-center justify-between rounded-2xl px-4 md:px-6 py-3 transition-all duration-500 ${
            scrolled
              ? "glass-strong shadow-card"
              : "bg-background/20 backdrop-blur-md border border-border/40"
          }`}
        >
          <a href="#home" className="flex items-center gap-2.5 group">
            <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-background/60 border border-border/60 overflow-hidden">
              <img src={logo} alt="Predoctor AI logo" className="h-6 w-6 object-contain" />
              <span className="absolute inset-0 rounded-xl bg-gradient-primary blur-md opacity-40 group-hover:opacity-70 transition-opacity -z-10" />
            </span>
            <span className="font-display font-semibold text-lg tracking-tight">
              Predoctor <span className="text-gradient-brand">AI</span>
            </span>
          </a>

          <ul className="hidden lg:flex items-center gap-1">
            {links.map((l) =>
              l.route ? (
                <li key={l.label}>
                  <Link
                    to={l.href}
                    className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50"
                  >
                    {l.label}
                  </Link>
                </li>
              ) : (
                <li key={l.label}>
                  <a
                    href={l.href}
                    className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50"
                  >
                    {l.label}
                  </a>
                </li>
              ),
            )}
          </ul>

          <Link
            to="/dashboard"
            className="group relative inline-flex items-center gap-1 sm:gap-2 rounded-lg sm:rounded-xl px-2.5 sm:px-4 md:px-5 py-1.5 sm:py-2.5 text-[11px] sm:text-sm font-medium text-foreground bg-gradient-primary shadow-glow hover:shadow-glow-strong transition-shadow duration-300 whitespace-nowrap shrink-0"
          >
            <span className="relative z-10">Start Analysis</span>
            <span className="relative z-10 transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </nav>
      </div>
    </header>
  );
};
