import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRates } from "@/lib/market";
import { CACHE_KEY, type MarketResult, type Snapshot } from "@/lib/types";

function readLocalSnapshot(): Snapshot | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Snapshot;
  } catch {
    return null;
  }
}

export function useMarket(initial: MarketResult) {
  const [offline, setOffline] = useState(false);
  const [local, setLocal] = useState<Snapshot | null>(null);

  useEffect(() => {
    setOffline(typeof navigator !== "undefined" ? !navigator.onLine : false);
    setLocal(readLocalSnapshot());
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  const query = useQuery({
    queryKey: ["rates"],
    queryFn: () => getRates(),
    initialData: initial,
    refetchInterval: 60_000,
    staleTime: 45_000,
  });

  useEffect(() => {
    const snap = query.data?.snapshot;
    if (query.data?.ok && snap) {
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify(snap));
      } catch {
        /* ignore */
      }
    }
  }, [query.data]);

  const snapshot = query.data?.snapshot ?? local;
  const error = query.data?.error ?? (query.isError ? "قیمت‌ها به‌روزرسانی نشد." : null);
  const stale = Boolean(query.data && !query.data.ok && snapshot);

  return {
    snapshot,
    error,
    stale,
    offline,
    isLoading: !snapshot && query.isLoading,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
}
