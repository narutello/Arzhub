import { useEffect } from "react";

const RELOAD_KEY = "arzhub-chunk-reload";

/** Detect Vite/browser errors when an old tab loads a removed hashed chunk. */
export function isChunkLoadError(error: unknown): boolean {
  const msg = error instanceof Error ? error.message : String(error ?? "");
  return (
    /Failed to fetch dynamically imported module/i.test(msg) ||
    /error loading dynamically imported module/i.test(msg) ||
    /Importing a module script failed/i.test(msg) ||
    /Loading chunk [\w-]+ failed/i.test(msg)
  );
}

/** Full reload once per short window to pick up the new deploy (avoids loops). */
export function reloadForNewDeploy(): void {
  if (typeof window === "undefined") return;
  try {
    const last = Number(sessionStorage.getItem(RELOAD_KEY) ?? "0");
    if (last && Date.now() - last < 12_000) return;
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
  } catch {
    // ignore storage failures
  }
  window.location.reload();
}

/** Listens for Vite preload failures and reloads onto the current deploy. */
export function ChunkLoadRecovery() {
  useEffect(() => {
    const onPreloadError = (event: Event) => {
      event.preventDefault();
      reloadForNewDeploy();
    };
    window.addEventListener("vite:preloadError", onPreloadError);
    return () => {
      window.removeEventListener("vite:preloadError", onPreloadError);
    };
  }, []);

  return null;
}
