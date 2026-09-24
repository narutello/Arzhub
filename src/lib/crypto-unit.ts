import { useCallback, useEffect, useState } from "react";

export type CryptoUnit = "IRT" | "USD";

const KEY = "arzhub-crypto-unit";

function readUnit(): CryptoUnit {
  if (typeof window === "undefined") return "IRT";
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "USD" ? "USD" : "IRT";
  } catch {
    return "IRT";
  }
}

export function useCryptoUnit() {
  const [unit, setUnitState] = useState<CryptoUnit>("IRT");

  useEffect(() => {
    setUnitState(readUnit());
  }, []);

  const setUnit = useCallback((next: CryptoUnit) => {
    setUnitState(next);
    try {
      window.localStorage.setItem(KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  return { unit, setUnit };
}
