import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowLeftRight, Home, LineChart, Star } from "lucide-react";
import { ThemeToggle } from "@/components/theme";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "خانه", icon: Home },
  { to: "/currencies", label: "ارزها", icon: LineChart },
  { to: "/convert", label: "تبدیل", icon: ArrowLeftRight },
  { to: "/watchlist", label: "نشان‌شده", icon: Star },
] as const;

function isActive(pathname: string, to: string) {
  if (to === "/") return pathname === "/";
  return pathname === to || pathname.startsWith(`${to}/`);
}

export function Shell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-12 max-w-lg items-center justify-between gap-3 px-4 md:max-w-2xl">
          <Link to="/" className="text-[17px] font-semibold tracking-tight">
            ارزهاب
          </Link>
          <div className="flex items-center gap-1">
            <nav className="hidden items-center gap-0.5 md:flex">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-[13px] font-medium transition-colors",
                    isActive(pathname, item.to)
                      ? "bg-card-2 text-foreground"
                      : "text-muted hover:text-foreground",
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

      <main className="mx-auto w-full max-w-lg px-4 pb-28 pt-4 md:max-w-2xl md:pb-12">
        {children}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/85 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden">
        <ul className="mx-auto grid max-w-lg grid-cols-4">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.to);
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex min-h-[52px] flex-col items-center justify-center gap-0.5 text-[10px] font-medium",
                    active ? "text-accent" : "text-subtle",
                  )}
                >
                  <Icon
                    className="size-[22px]"
                    strokeWidth={active ? 2.25 : 1.75}
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
