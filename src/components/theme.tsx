import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

type Theme = "light" | "dark";

/** Default is light. Dark only if the user previously chose it. */
function readTheme(): Theme {
  try {
    const stored = localStorage.getItem("arzhub-theme");
    if (stored === "dark") return "dark";
    if (stored === "light") return "light";
  } catch {
    /* ignore */
  }
  return "light";
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const next = readTheme();
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
    setReady(true);
  }, []);

  function apply(next: Theme) {
    setTheme(next);
    const root = document.documentElement;
    root.classList.toggle("dark", next === "dark");
    try {
      localStorage.setItem("arzhub-theme", next);
    } catch {
      /* ignore */
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={theme === "dark" ? "حالت روشن" : "حالت تاریک"}
      onClick={() => apply(theme === "dark" ? "light" : "dark")}
    >
      {ready && theme === "dark" ? (
        <Sun className="size-5" strokeWidth={1.75} />
      ) : (
        <Moon className="size-5" strokeWidth={1.75} />
      )}
    </Button>
  );
}
