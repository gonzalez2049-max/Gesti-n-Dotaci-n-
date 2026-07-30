import { useId } from "react";

interface RingProps {
  pct: number;
  size?: number;
  label?: string;
}

/** Anillo de progreso con degradado de acento (doc 23). */
export function Ring({ pct, size = 54, label }: RingProps) {
  const id = useId().replace(/:/g, "");
  const r = (size - 9) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - Math.max(0, Math.min(100, pct)) / 100);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--accent)" />
          <stop offset="1" stopColor="var(--accent2)" />
        </linearGradient>
      </defs>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--hairline)" strokeWidth="5.5" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={`url(#${id})`}
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={off}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      {label && (
        <text
          x={size / 2}
          y={size / 2 + 4}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={size * 0.26}
          fontWeight="700"
          fill="var(--ink)"
        >
          {label}
        </text>
      )}
    </svg>
  );
}
