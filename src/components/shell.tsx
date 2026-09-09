import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowLeftRight, Home, LineChart, Star } from "lucide-react";
import { ThemeToggle } from "@/components/theme";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "خانه", icon: Home },
  { to: "/currencies", label: "بازار", icon: LineChart },
  { to: "/convert", label: "تبدیل", icon: ArrowLeftRight },
  { to: "/watchlist", label: "نشان‌ها", icon: Star },
] as const;

function isActive(pathname: string, to: string) {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(`${to}/`);
}

export function Shell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/75 backdrop-blur-xl backdrop-saturate-150">
        <div className="mx-auto flex h-[3.25rem] max-w-lg items-center justify-between gap-3 px-4 md:max-w-2xl">
          <Link to="/" className="min-w-0">
            <span className="block text-[1.05rem] font-semibold tracking-tight">
              ارزهاب
            </span>
          </Link>
          <div className="flex items-center gap-1">
            <nav className="hidden items-center gap-0.5 sm:flex">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors",
                    isActive(pathname, item.to)
                      ? "bg-card-2 text-foreground"
                      : "text-muted active:opacity-60",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-lg px-4 pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-3 md:max-w-2xl md:pb-12">
        {children}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/80 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl backdrop-saturate-150 md:hidden">
        <ul className="mx-auto grid max-w-lg grid-cols-4">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.to);
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex min-h-[3.25rem] flex-col items-center justify-center gap-0.5 text-[10px] font-medium",
                    active ? "text-accent" : "text-muted",
                  )}
                >
                  <Icon
                    className="size-[22px]"
                    strokeWidth={active ? 2.25 : 1.75}
                    fill={active && item.to === "/watchlist" ? "currentColor" : "none"}
                  />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
