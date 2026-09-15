import { cn } from "@/lib/utils";

/**
 * Renders a country flag.
 * For Iran (IRT) uses the historical Lion and Sun flag (SVG).
 * For others uses the Unicode emoji from currency.flag.
 */
export function Flag({
  code,
  emoji,
  className,
  size = "md",
}: {
  code: string;
  emoji: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeClass =
    size === "sm" ? "text-base" : size === "lg" ? "text-2xl" : "text-xl";

  if (code === "IRT") {
    const px = size === "sm" ? 18 : size === "lg" ? 28 : 22;
    return (
      <span
        className={cn("inline-flex shrink-0 leading-none", className)}
        aria-hidden
        title="شیر و خورشید"
      >
        <LionAndSunFlag width={px} height={Math.round(px * 0.6)} />
      </span>
    );
  }

  return (
    <span className={cn(sizeClass, "leading-none shrink-0", className)} aria-hidden>
      {emoji}
    </span>
  );
}

/** Simplified Lion and Sun tricolor flag (pre-1979 style) */
function LionAndSunFlag({
  width = 22,
  height = 13,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 30 18"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="پرچم شیر و خورشید"
    >
      {/* Green stripe */}
      <rect x="0" y="0" width="30" height="6" fill="#239f40" />
      {/* White stripe */}
      <rect x="0" y="6" width="30" height="6" fill="#ffffff" />
      {/* Red stripe */}
      <rect x="0" y="12" width="30" height="6" fill="#da0000" />
      {/* Thin border */}
      <rect
        x="0.25"
        y="0.25"
        width="29.5"
        height="17.5"
        fill="none"
        stroke="rgba(0,0,0,0.12)"
        strokeWidth="0.5"
      />
      {/* Sun (behind lion) */}
      <circle cx="15" cy="9" r="3.2" fill="#f4c430" />
      {/* Sun rays */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
        const rad = (deg * Math.PI) / 180;
        const x1 = 15 + Math.cos(rad) * 3.4;
        const y1 = 9 + Math.sin(rad) * 3.4;
        const x2 = 15 + Math.cos(rad) * 4.4;
        const y2 = 9 + Math.sin(rad) * 4.4;
        return (
          <line
            key={deg}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#f4c430"
            strokeWidth="0.7"
            strokeLinecap="round"
          />
        );
      })}
      {/* Lion body (simplified side view facing left in LTR, will look fine) */}
      <ellipse cx="14.5" cy="10.2" rx="2.4" ry="1.5" fill="#c4a035" />
      {/* Lion head */}
      <circle cx="12.2" cy="9.2" r="1.35" fill="#c4a035" />
      {/* Mane hint */}
      <circle cx="12.5" cy="8.5" r="0.9" fill="#b8912e" opacity="0.7" />
      {/* Sword (simplified vertical) */}
      <line
        x1="16.2"
        y1="6.8"
        x2="16.2"
        y2="11.5"
        stroke="#6b5b2a"
        strokeWidth="0.55"
        strokeLinecap="round"
      />
      <line
        x1="15.5"
        y1="7.2"
        x2="16.9"
        y2="7.2"
        stroke="#6b5b2a"
        strokeWidth="0.45"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Text fallback for places that only support plain text (e.g. <option>) */
export function flagText(code: string, emoji: string): string {
  if (code === "IRT") return "🦁☀️";
  return emoji;
}
