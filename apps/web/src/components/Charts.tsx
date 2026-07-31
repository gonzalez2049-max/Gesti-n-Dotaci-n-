import { useId } from "react";
import type { Serie } from "@nexshift/contracts";

function cssVar(name: string): string {
  if (typeof window === "undefined") return "#0a8f84";
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "#0a8f84";
}

/** Línea con área, sin ejes dobles (doc 19 / dataviz). */
export function LineChart({ serie, yMax }: { serie: Serie; yMax: number }) {
  const W = 320;
  const H = 120;
  const x0 = 6;
  const x1 = 312;
  const y0 = 8;
  const y1 = 96;
  const s = serie.series[0];
  const n = serie.labels.length;
  const X = (i: number) => x0 + (i * (x1 - x0)) / (n - 1);
  const Y = (v: number) => y1 - (v / yMax) * (y1 - y0);
  const col = cssVar(s.colorVar);
  const d = s.valores.map((v, i) => `${i ? "L" : "M"}${X(i)} ${Y(v)}`).join(" ");
  const area = `${d} L${X(n - 1)} ${y1} L${X(0)} ${y1} Z`;
  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={s.nombre}>
      {[0, 0.5, 1].map((t) => (
        <line key={t} x1={x0} y1={y1 - t * (y1 - y0)} x2={x1} y2={y1 - t * (y1 - y0)} stroke="var(--hairline)" />
      ))}
      <path d={area} fill={col} opacity="0.1" />
      <path d={d} fill="none" stroke={col} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {s.valores.map((v, i) => (
        <circle key={i} cx={X(i)} cy={Y(v)} r="3" fill={col}>
          <title>{`${serie.labels[i]}: ${v}${serie.unidad ?? ""}`}</title>
        </circle>
      ))}
    </svg>
  );
}

/** Barras apiladas por categoría (doc 19). */
export function StackedBars({ serie, yMax }: { serie: Serie; yMax: number }) {
  const W = 320;
  const H = 130;
  const x0 = 6;
  const x1 = 312;
  const y0 = 6;
  const y1 = 104;
  const n = serie.labels.length;
  const bw = Math.min(30, (x1 - x0) / n - 8);
  const Y = (v: number) => (v / yMax) * (y1 - y0);
  return (
    <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img">
      {[0, 0.5, 1].map((t) => (
        <line key={t} x1={x0} y1={y1 - t * (y1 - y0)} x2={x1} y2={y1 - t * (y1 - y0)} stroke="var(--hairline)" />
      ))}
      {serie.labels.map((lab, i) => {
        const cx = x0 + (i + 0.5) * ((x1 - x0) / n);
        let acc = 0;
        return (
          <g key={lab}>
            {serie.series.map((ss, si) => {
              const v = ss.valores[i];
              const h = Y(v);
              const yTop = y1 - acc - h;
              acc += h;
              return (
                <rect key={si} x={cx - bw / 2} y={yTop} width={bw} height={Math.max(h - 2, 1)} rx={si === serie.series.length - 1 ? 3 : 2} fill={cssVar(ss.colorVar)}>
                  <title>{`${lab} · ${ss.nombre}: ${v}`}</title>
                </rect>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

/** Sparkline compacto para KPIs. */
export function Sparkline({ vals, colorVar = "--accent" }: { vals: number[]; colorVar?: string }) {
  const W = 92;
  const H = 26;
  const mn = Math.min(...vals);
  const mx = Math.max(...vals);
  const r = mx - mn || 1;
  const d = vals
    .map((v, i) => `${i ? "L" : "M"}${(i * W) / (vals.length - 1)} ${H - 2 - ((v - mn) / r) * (H - 4)}`)
    .join(" ");
  return (
    <svg className="spark" viewBox={`0 0 ${W} ${H}`} style={{ width: 92 }} aria-hidden="true">
      <path d={d} fill="none" stroke={cssVar(colorVar)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Anillo con degradado (reexport ligero para gráficos). */
export function DonutGrad({ pct, size = 54, label }: { pct: number; size?: number; label?: string }) {
  const id = useId().replace(/:/g, "");
  const r = (size - 9) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - pct / 100);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--accent)" />
          <stop offset="1" stopColor="var(--accent2)" />
        </linearGradient>
      </defs>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--hairline)" strokeWidth="5.5" />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={`url(#${id})`} strokeWidth="5.5" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      {label && (
        <text x={size / 2} y={size / 2 + 4} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={size * 0.26} fontWeight="700" fill="var(--ink)">
          {label}
        </text>
      )}
    </svg>
  );
}
