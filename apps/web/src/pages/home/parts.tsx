import { useNavigate } from "react-router-dom";
import { Icon } from "@/components/icons";
import { Ring } from "@/components/Ring";
import { Sparkline } from "@/components/Charts";
import { saludoHora } from "@/data/home";
import type { EventoTL, GuiaNex, LiveStat, Narrativa as TNarrativa, NexInsight, Tono, UnidadEstado } from "@/data/home";
import type { IconName } from "@/components/icons";

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

/* ---------- guía contextual · Marco NEX de 5 preguntas ---------- */
export function GuiaNexBar({ g }: { g: GuiaNex }) {
  const navigate = useNavigate();
  const pasos: { k: string; icon: IconName; txt: string; cls: string }[] = [
    { k: "Qué ocurre", icon: "pulse", txt: g.ocurre, cls: "" },
    { k: "Qué hacer", icon: "bolt", txt: g.hacer, cls: "do" },
    { k: "NEX recomienda", icon: "sparkles", txt: g.recomienda, cls: "nex" },
    { k: "Si no actúo", icon: "arrow-down", txt: g.riesgo, cls: "risk" },
    { k: "Siguiente paso", icon: "arrow-right", txt: g.siguiente, cls: "" },
  ];
  return (
    <section className="guia5" aria-label="Guía contextual NEX">
      <div className="g5-steps">
        {pasos.map((p, i) => (
          <div className={`g5-step ${p.cls}`} key={i}>
            <div className="g5-k">
              <Icon name={p.icon} size={12} /> {p.k}
            </div>
            <div className="g5-t">{p.txt}</div>
          </div>
        ))}
      </div>
      {g.cta && g.ruta && (
        <button className="btn prim g5-cta" type="button" onClick={() => navigate(g.ruta!)}>
          <Icon name="bolt" size={14} /> {g.cta}
        </button>
      )}
    </section>
  );
}

/* ---------- panel de IA NEX ---------- */
export function NexPanel({ nex }: { nex: NexInsight }) {
  const navigate = useNavigate();
  return (
    <aside className="nex" aria-label="Recomendación NEX">
      <div className="nex-glow" aria-hidden="true" />
      <div className="nex-head">
        <span className="nex-orb">
          <Icon name="sparkles" size={15} />
        </span>
        <div className="nex-id">
          NEX · Inteligencia
          <span className="nex-think">
            analizando <i /><i /><i />
          </span>
        </div>
        {nex.confianza != null && (
          <div className="nex-conf">
            <Ring pct={nex.confianza} size={44} label={`${nex.confianza}`} />
            <span>confianza</span>
          </div>
        )}
      </div>

      <div className="nex-reco">{nex.titulo}</div>
      <p className="nex-razon">{nex.razon}</p>

      <div className="nex-impacto">
        {nex.impacto.map((im, i) => (
          <span className="nex-imp" key={i}>
            <Icon name="arrow-right" size={12} /> {im}
          </span>
        ))}
      </div>

      <div className="nex-actions">
        <button className="btn prim" type="button" onClick={() => navigate(nex.ruta)}>
          <Icon name="bolt" size={14} /> {nex.accion}
        </button>
        {nex.alternativas && (
          <button className="btn ghost" type="button" onClick={() => navigate(nex.ruta)}>
            Ver {nex.alternativas}
          </button>
        )}
      </div>
    </aside>
  );
}

/* ---------- timeline de eventos ---------- */
export function Timeline({ eventos, titulo = "Línea de tiempo" }: { eventos: EventoTL[]; titulo?: string }) {
  return (
    <section className="tl-wrap" aria-label={titulo}>
      <div className="panel-h">
        <Icon name="pulse" size={15} /> {titulo}
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
