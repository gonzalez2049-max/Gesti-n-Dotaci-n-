import { Icon } from "@/components/icons";
import { Sparkline } from "@/components/Charts";
import { saludoHora } from "@/data/home";
import type { EventoTL, Heatmap as THeatmap, LiveStat, Narrativa as TNarrativa, Tono, UnidadEstado } from "@/data/home";

const semTono = (s: string): Tono => (s === "critico" ? "crit" : s === "riesgo" ? "warn" : s === "exceso" ? "info" : "good");

const toneVar: Record<Tono, string> = {
  good: "--good",
  warn: "--warn",
  crit: "--crit",
  info: "--info",
  acc: "--accent",
};
export const toneStyle = (t: Tono) => ({ ["--tn" as string]: `var(${toneVar[t]})` });

/* ---------- narrativa (el briefing que cuenta la historia) ---------- */
export function NarrativaHead({ n }: { n: TNarrativa }) {
  return (
    <header className="narr">
      <div className="narr-ctx">
        <span className="narr-live" />
        {n.contexto} · {new Date().toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long" })}
      </div>
      <h1 className="narr-h">
        {saludoHora()}, <span className="narr-name">{n.nombre}</span>.
      </h1>
      <p className="narr-p">
        {n.frase} {n.foco && <span className="narr-foco">{n.foco}</span>}
      </p>
      <div className="narr-chips">
        {n.chips.map((c, i) => (
          <span className="nchip" key={i} style={toneStyle(c.tono)}>
            <Icon name={c.icon} size={13} />
            {c.texto}
          </span>
        ))}
      </div>
    </header>
  );
}

/* ---------- línea de pulso (señal viva ambiental) ---------- */
export function PulseLine({ tone = "good", height = 46 }: { tone?: Tono; height?: number }) {
  const seg = "M0 23 H34 l4 -3 l3 6 l5 -17 l5 26 l4 -12 H120";
  return (
    <svg className="ecg" viewBox="0 0 240 46" preserveAspectRatio="none" style={{ height, ...toneStyle(tone) }} aria-hidden="true">
      <g className="ecg-g" fill="none" stroke="var(--tn)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {[0, 120, 240].map((x) => (
          <path key={x} d={seg} transform={`translate(${x} 0)`} />
        ))}
      </g>
      <circle className="ecg-dot" r="3.2" cy="23" fill="var(--tn)" />
    </svg>
  );
}

/* ---------- timeline de eventos ---------- */
export function Timeline({ eventos, titulo = "Línea de tiempo", live }: { eventos: EventoTL[]; titulo?: string; live?: boolean }) {
  return (
    <section className="tl-wrap" aria-label={titulo}>
      <div className="panel-h">
        <Icon name="pulse" size={15} /> {titulo}
        {live && (
          <span className="tl-live">
            <i /> en vivo
          </span>
        )}
      </div>
      <ol className="tl">
        {eventos.map((e, i) => (
          <li className={`tl-item ${e.cuando}`} key={i} style={toneStyle(e.tono)}>
            <span className="tl-node">
              <Icon name={e.icon} size={13} />
            </span>
            <span className="tl-hora">{e.hora}</span>
            <span className="tl-body">
              <span className="tl-txt">{e.texto}</span>
              {e.meta && <span className="tl-meta">{e.meta}</span>}
            </span>
            {e.cuando === "ahora" && <span className="tl-nowtag">ahora</span>}
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ---------- fila de indicadores vivos (no tarjetas repetidas) ---------- */
export function LiveStatRow({ stats }: { stats: LiveStat[] }) {
  return (
    <div className="lsr">
      {stats.map((s, i) => (
        <div className="ls" key={i} style={toneStyle(s.tono)}>
          <span className="ls-ic">
            <Icon name={s.icon} size={14} />
          </span>
          <div className="ls-main">
            <div className="ls-lab">{s.label}</div>
            <div className="ls-val">
              {s.valor}
              {s.unidad && <span className="ls-u">{s.unidad}</span>}
            </div>
          </div>
          {s.spark && <Sparkline vals={s.spark} colorVar={toneVar[s.tono]} />}
        </div>
      ))}
    </div>
  );
}

/* ---------- heatmap de cobertura (unidad × día) ---------- */
export function Heatmap({ data }: { data: THeatmap }) {
  return (
    <div className="hm-wrap">
      <div className="hm" style={{ gridTemplateColumns: `40px repeat(${data.dias.length}, 1fr)` }}>
        <div className="hm-corner" />
        {data.dias.map((d, i) => (
          <div className="hm-dh" key={i}>
            {d}
          </div>
        ))}
        {data.filas.map((f) => (
          <div className="hm-row" key={f.sigla} style={{ display: "contents" }}>
            <div className="hm-rh">{f.sigla}</div>
            {f.celdas.map((cell, i) => (
              <div className={`hm-cell tn-bg-${cell.tono}`} key={i} title={`${f.sigla} · ${data.dias[i]} · ${cell.txt}`}>
                <span>{cell.txt}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="hm-legend">
        <span><i className="tn-bg-good" /> Completo</span>
        <span><i className="tn-bg-warn" /> Ajustado</span>
        <span><i className="tn-bg-crit" /> Déficit</span>
      </div>
    </div>
  );
}

/* ---------- mapa de la red (nodos por unidad) ---------- */
export function RedMap({ unidades }: { unidades: UnidadEstado[] }) {
  const W = 520;
  const H = 300;
  const cx = W / 2;
  const cy = H / 2;
  const R = 108;
  const n = unidades.length;
  return (
    <svg className="redmap" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Mapa de la red">
      {unidades.map((u, i) => {
        const a = (-90 + (i * 360) / n) * (Math.PI / 180);
        const x = cx + R * Math.cos(a);
        const y = cy + R * Math.sin(a);
        const t = semTono(u.semaforo);
        return <line key={`e${u.sigla}`} x1={cx} y1={cy} x2={x} y2={y} className={`rm-edge tn-${t}`} />;
      })}
      <circle cx={cx} cy={cy} r={30} className="rm-hub" />
      <text x={cx} y={cy - 2} className="rm-hubt">
        Sede
      </text>
      <text x={cx} y={cy + 10} className="rm-hubt sm">
        Central
      </text>
      {unidades.map((u, i) => {
        const a = (-90 + (i * 360) / n) * (Math.PI / 180);
        const x = cx + R * Math.cos(a);
        const y = cy + R * Math.sin(a);
        const t = semTono(u.semaforo);
        const r = 15 + Math.min(9, u.req / 2);
        return (
          <g key={u.sigla} className={`rm-node tn-${t} ${t !== "good" ? "alert" : ""}`}>
            <title>{`${u.nombre} · ${u.disp}/${u.req}`}</title>
            <circle cx={x} cy={y} r={r} className="rm-dot" />
            <text x={x} y={y + 1} className="rm-sig">
              {u.sigla}
            </text>
            <text x={x} y={y + r + 13} className="rm-lab">
              {u.disp}/{u.req}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* ---------- mosaico de unidades ---------- */
export function UnitTiles({ unidades }: { unidades: UnidadEstado[] }) {
  const tono = (s: string): Tono => (s === "critico" ? "crit" : s === "riesgo" ? "warn" : s === "exceso" ? "info" : "good");
  return (
    <div className="units">
      {unidades.map((u) => {
        const t = tono(u.semaforo);
        const pct = Math.round((u.disp / u.req) * 100);
        return (
          <div className={`unit tn-${t}`} key={u.sigla} style={toneStyle(t)}>
            <div className="unit-top">
              <span className="unit-sig">{u.sigla}</span>
              <span className="unit-dot" />
              {u.tendencia && u.tendencia !== "flat" && (
                <Icon name={u.tendencia === "up" ? "arrow-up" : "arrow-down"} size={12} />
              )}
            </div>
            <div className="unit-name">{u.nombre}</div>
            <div className="unit-bar">
              <span style={{ width: `${Math.min(100, pct)}%` }} />
            </div>
            <div className="unit-foot">
              <b>{u.disp}/{u.req}</b>
              <span>{u.nota}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
