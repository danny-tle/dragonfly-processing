import type { ReactNode } from "react";
import type { QuickTipIcon } from "@/data/support";

/** Small caps label followed by a rule, as in the support page design ("QUICK TIPS ——"). */
export function SectionHeading({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h2 id={id} className="flex items-center gap-4 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
      <span className="shrink-0">{children}</span>
      <span aria-hidden="true" className="h-px flex-1 bg-border" />
    </h2>
  );
}

const iconStyles: Record<QuickTipIcon, string> = {
  charge: "bg-sativa/15 text-sativa",
  inhale: "bg-calm-light/30 text-[#3f8e99]",
  alert: "bg-soothe-light/30 text-soothe-deep",
  power: "bg-sage/15 text-sage",
  clock: "bg-calm-light/30 text-[#3f8e99]",
};

/** Line icons for the quick tip cards, drawn on a 24px grid. */
export function TipIcon({ icon }: { icon: QuickTipIcon }) {
  const paths: Record<QuickTipIcon, ReactNode> = {
    charge: <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />,
    inhale: (
      <>
        <path d="M3 8h11a3 3 0 1 0-3-3" />
        <path d="M3 12h16" />
        <path d="M3 16h11a3 3 0 1 1-3 3" />
      </>
    ),
    alert: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7.5v5.5" />
        <path d="M12 16.5h.01" />
      </>
    ),
    power: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="m8.5 12 2.5 2.5 4.5-5" />
      </>
    ),
    clock: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </>
    ),
  };

  return (
    <span className={`grid size-10 place-items-center rounded-lg ${iconStyles[icon]}`}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className="size-5"
      >
        {paths[icon]}
      </svg>
    </span>
  );
}

/** Colour for a temperature on the Ember guide's cool-to-hot scale (298–446 °F). */
export function temperatureColor(temp: number) {
  const t = Math.min(Math.max((temp - 298) / (446 - 298), 0), 1);
  return `hsl(${Math.round(205 - 205 * t)} 70% 48%)`;
}
