import type { SVGProps } from "react";

/**
 * Set de iconos de línea consistentes para toda la app (stroke = currentColor).
 * Referencia de trazo: 1.6px, esquinas redondeadas — estilo Linear/Vercel.
 * Un único componente <Icon name="..."/> mantiene la iconografía uniforme.
 */
export type IconName =
  | "bolt"
  | "pulse"
  | "clock"
  | "shield"
  | "users"
  | "user-plus"
  | "calendar"
  | "swap"
  | "gap"
  | "send"
  | "sparkles"
  | "arrow-right"
  | "arrow-up"
  | "arrow-down"
  | "check"
  | "bell"
  | "search"
  | "command"
  | "grid"
  | "chart"
  | "gauge"
  | "plane"
  | "graduation"
  | "settings"
  | "chevron-right"
  | "home"
  | "user"
  | "link"
  | "list"
  | "layers"
  | "dot";

const P: Record<IconName, JSX.Element> = {
  bolt: <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />,
  pulse: <path d="M2 12h4l2.5-7 4 15 3-8H22" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  shield: <path d="M12 3 5 6v5c0 4.5 3 8 7 10 4-2 7-5.5 7-10V6l-7-3Z" />,
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
      <path d="M16 5.2a3.2 3.2 0 0 1 0 5.6M17.5 20a5.5 5.5 0 0 0-3-4.9" />
    </>
  ),
  "user-plus": (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3.5 20a5.5 5.5 0 0 1 11 0" />
      <path d="M18 8v6M15 11h6" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="4.5" width="17" height="16" rx="2.5" />
      <path d="M3.5 9h17M8 2.5v4M16 2.5v4" />
    </>
  ),
  swap: <path d="M7 4 3 8l4 4M3 8h13M17 20l4-4-4-4M21 16H8" />,
  gap: (
    <>
      <path d="M12 3v6M12 15v6" />
      <circle cx="12" cy="12" r="2" />
    </>
  ),
  send: <path d="M21 3 3 10.5l7 2.5 2.5 7L21 3Z" />,
  sparkles: <path d="M12 3l1.8 4.7L18.5 9.5 13.8 11.3 12 16l-1.8-4.7L5.5 9.5l4.7-1.8L12 3ZM19 14l.9 2.3 2.3.9-2.3.9L19 20.4l-.9-2.3-2.3-.9 2.3-.9L19 14Z" />,
  "arrow-right": <path d="M5 12h14M13 6l6 6-6 6" />,
  "arrow-up": <path d="M12 19V5M6 11l6-6 6 6" />,
  "arrow-down": <path d="M12 5v14M6 13l6 6 6-6" />,
  check: <path d="M4 12.5 9.5 18 20 6" />,
  bell: <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6M9.5 20a2.5 2.5 0 0 0 5 0" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </>
  ),
  command: <path d="M9 6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6Z" />,
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
    </>
  ),
  chart: <path d="M4 4v16h16M8 15v2M12 11v6M16 7v10" />,
  gauge: (
    <>
      <path d="M4 18a8 8 0 1 1 16 0" />
      <path d="M12 18l4-5" />
    </>
  ),
  plane: <path d="M21 15.5 3 10V7l2 .5 3 2 6-1.5L11 3l2-.5 5 6 3 1v6Z" />,
  graduation: <path d="M12 4 2 9l10 5 10-5-10-5ZM6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5" />,
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
    </>
  ),
  "chevron-right": <path d="M9 5l7 7-7 7" />,
  home: (
    <>
      <path d="M3 11 12 3l9 8" />
      <path d="M5 9.5V20h14V9.5" />
      <path d="M10 20v-6h4v6" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="3.4" />
      <path d="M5.5 20a6.5 6.5 0 0 1 13 0" />
    </>
  ),
  link: <path d="M10 14a4 4 0 0 1 0-5.7l1.8-1.8a4 4 0 0 1 5.7 5.7l-1 1M14 10a4 4 0 0 1 0 5.7l-1.8 1.8a4 4 0 0 1-5.7-5.7l1-1" />,
  list: <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" />,
  layers: <path d="M12 3 3 8l9 5 9-5-9-5ZM3 13l9 5 9-5M3 18l9 5 9-5" />,
  dot: <circle cx="12" cy="12" r="3.5" />,
};

export function Icon({
  name,
  size = 18,
  strokeWidth = 1.6,
  ...rest
}: { name: IconName; size?: number; strokeWidth?: number } & Omit<SVGProps<SVGSVGElement>, "name">) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {P[name]}
    </svg>
  );
}
