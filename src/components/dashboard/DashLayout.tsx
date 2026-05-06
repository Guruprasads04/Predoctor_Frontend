import { ReactNode, useState } from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Home,
  ArrowLeft,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import logo from "@/assets/logo-nav.png";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/patients", label: "Patients", icon: Users },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
];

export const DashLayout = ({ children, title, subtitle }: { children: ReactNode; title: string; subtitle?: string }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <main className="relative min-h-screen">
      {/* Top bar */}
      <header className="fixed inset-x-0 top-0 z-40 py-3">
        <div className="container">
          <nav className="flex items-center justify-between rounded-2xl px-4 md:px-6 py-3 glass-strong shadow-card">
            <div className="flex items-center gap-3">
              <NavLink to="/" className="flex items-center gap-2.5 group">
                <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-background/60 border border-border/60 overflow-hidden">
                  <img src={logo} alt="Predoctor AI logo" className="h-6 w-6 object-contain" />
                  <span className="absolute inset-0 rounded-xl bg-gradient-primary blur-md opacity-40 group-hover:opacity-70 transition-opacity -z-10" />
                </span>
                <span className="font-display font-semibold text-lg tracking-tight">
                  Predoctor <span className="text-gradient-brand">AI</span>
                </span>
              </NavLink>
            </div>
            <NavLink
              to="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-lg hover:bg-secondary/50"
            >
              <ArrowLeft className="h-4 w-4" /> <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Back to home</span>
            </NavLink>
          </nav>
        </div>
      </header>

      <div className="container pt-28 pb-16">
        <div
          className={`grid grid-cols-1 gap-6 transition-[grid-template-columns] duration-300 ease-out ${
            collapsed ? "lg:grid-cols-[72px_1fr]" : "lg:grid-cols-[220px_1fr]"
          }`}
        >
          {/* Sidebar */}
          <aside className="hidden lg:block lg:sticky lg:top-28 lg:self-start lg:h-[calc(100vh-8rem)] lg:max-h-[calc(100vh-8rem)]">
            <div className="glass-strong glow-border rounded-2xl p-3 flex flex-col h-full relative">
              {/* Collapse toggle */}
              <button
                type="button"
                onClick={() => setCollapsed((c) => !c)}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                className="absolute -right-3 top-6 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-background border border-border/70 text-muted-foreground hover:text-foreground hover:border-primary/60 transition-colors shadow-card"
              >
                {collapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
              </button>

              <div className="space-y-1">
                {navItems.map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    title={collapsed ? label : undefined}
                    className={({ isActive }) =>
                      `flex items-center gap-3 ${
                        collapsed ? "justify-center px-2" : "px-3"
                      } py-2.5 rounded-xl text-sm transition-colors ${
                        isActive
                          ? "bg-gradient-primary text-foreground shadow-glow"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                      }`
                    }
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {!collapsed && <span className="truncate">{label}</span>}
                  </NavLink>
                ))}
              </div>

              <div className="mt-auto pt-3 border-t border-border/60 space-y-1">
                <button
                  type="button"
                  title={collapsed ? "Settings" : undefined}
                  onClick={() => toast("Settings", { description: "Settings panel coming soon." })}
                  className={`w-full flex items-center gap-3 ${
                    collapsed ? "justify-center px-2" : "px-3"
                  } py-2.5 rounded-xl text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors`}
                >
                  <Settings className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>Settings</span>}
                </button>
                <button
                  type="button"
                  title={collapsed ? "Logout" : undefined}
                  onClick={() => toast("Signed out", { description: "You have been logged out (mock)." })}
                  className={`w-full flex items-center gap-3 ${
                    collapsed ? "justify-center px-2" : "px-3"
                  } py-2.5 rounded-xl text-sm text-destructive/90 hover:text-destructive hover:bg-destructive/10 transition-colors`}
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  {!collapsed && <span>Logout</span>}
                </button>
              </div>
            </div>
          </aside>

          {/* Mobile horizontal nav */}
          <aside className="lg:hidden">
            <div className="glass-strong glow-border rounded-2xl p-2 flex items-center gap-1 overflow-x-auto">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition-colors whitespace-nowrap ${
                      isActive
                        ? "bg-gradient-primary text-foreground shadow-glow"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </NavLink>
              ))}
            </div>
          </aside>

          {/* Content */}
          <section className="min-w-0">
            <div className="mb-6">
              <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">
                <span className="text-gradient">{title}</span>
              </h1>
              {subtitle && <p className="text-muted-foreground mt-1.5 text-sm md:text-base">{subtitle}</p>}
            </div>
            {children}
          </section>
        </div>
      </div>
    </main>
  );
};
