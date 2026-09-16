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

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.28-.01-1.02-.02-2-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.3 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.05.14 3.01.4 2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.62-5.48 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.29 0 .32.22.7.83.58C20.56 21.8 24 17.3 24 12 24 5.37 18.63 0 12 0z" />
    </svg>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4">
          <div className="flex items-center gap-5">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/favicon.svg"
                alt=""
                width={28}
                height={28}
                className="size-7 shrink-0 rounded-md"
              />
              <span className="text-lg font-semibold tracking-tight">ارزهاب</span>
              <span className="hidden text-xs text-subtle sm:inline">بازار آزاد</span>
            </Link>
            <nav className="hidden items-center gap-1 md:flex">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm transition-colors duration-150",
                    isActive(pathname, item.to)
                      ? "bg-card-2 text-foreground"
                      : "text-muted hover:text-foreground",
                  )}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-4 pb-20 pt-6 md:pb-8">{children}</main>

      <footer className="mx-auto w-full max-w-5xl px-4 pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-5">
        <div className="flex items-center justify-center border-t border-border py-2.5">
          <a
            href="https://github.com/narutello/Arzhub"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="inline-flex items-center justify-center rounded-md p-1 text-subtle transition-colors hover:text-foreground"
          >
            <GitHubIcon className="size-4" />
          </a>
        </div>
      </footer>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm md:hidden">
        <ul className="grid grid-cols-4">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active = isActive(pathname, item.to);
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex min-h-14 flex-col items-center justify-center gap-1 text-[0.6875rem]",
                    active ? "text-foreground" : "text-muted",
                  )}
                >
                  <Icon className="size-5" strokeWidth={active ? 2 : 1.6} />
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
