import { useId } from "react";

type Tone = "good" | "warn" | "crit" | "info";

const STROKE: Record<Tone, [string, string]> = {
  good: ["var(--good)", "#38d38f"],
  warn: ["var(--warn)", "#e6b24d"],
  crit: ["var(--crit)", "#ff6b70"],
  info: ["var(--info)", "#5aa2f0"],
};

/**
 * Medidor de comando: arco de 270° con degradado por semáforo, glow suave y
 * animación de barrido al montar. Núcleo tipográfico grande (estado operativo).
 */
export function Gauge({
  pct,
  tone,
  size = 168,
  center,
  sub,
}: {
  pct: number;
  tone: Tone;
  size?: number;
  center: string;
  sub?: string;
}) {
  const id = useId().replace(/:/g, "");
  const sw = 13;
  const r = (size - sw) / 2 - 4;
  const cx = size / 2;
  const cy = size / 2;
  const gap = 90; // grados de apertura inferior
  const sweep = 360 - gap;
  const c = 2 * Math.PI * r;
  const arc = c * (sweep / 360);
  const p = Math.max(0, Math.min(100, pct));
  const filled = arc * (p / 100);
  const rot = 90 + gap / 2; // arranca abajo-izquierda
  const [c0, c1] = STROKE[tone];
  return (
    <div className="gauge" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={`gauge-svg t-${tone}`}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={c0} />
            <stop offset="1" stopColor={c1} />
          </linearGradient>
        </defs>
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="var(--hairline)"
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={`${arc} ${c}`}
          transform={`rotate(${rot} ${cx} ${cy})`}
        />
        <circle
          className="gauge-fill"
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth={sw}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${c}`}
          transform={`rotate(${rot} ${cx} ${cy})`}
        />
      </svg>
      <div className="gauge-core">
        <div className="gauge-val">{center}</div>
        {sub && <div className="gauge-sub">{sub}</div>}
      </div>
    </div>
  );
}
