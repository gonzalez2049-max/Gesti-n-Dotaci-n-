import { useNavigate } from "react-router-dom";
import { Icon } from "@/components/icons";
import { Gauge } from "@/components/Gauge";
import type { HomeJefatura as T } from "@/data/home";
import { GuiaNexBar, Heatmap, NarrativaHead, PulseLine, Timeline, toneStyle } from "./parts";

const semTone = (s: string) => (s === "critico" ? "crit" : s === "riesgo" ? "warn" : s === "exceso" ? "info" : "good");
const semLabel: Record<string, string> = { critico: "Crítico", riesgo: "En riesgo", exceso: "Sobredotado", equilibrio: "Estable" };

type Tone = "good" | "warn" | "crit" | "info";
const RINGS: { label: string; pct: number; tone: Tone; center: string; sub: string }[] = [
  { label: "Dotación", pct: 86, tone: "warn", center: "12/14", sub: "esta noche" },
  { label: "Cobertura", pct: 88, tone: "good", center: "88%", sub: "objetivo 90%" },
  { label: "Ocupación UCI", pct: 74, tone: "info", center: "74%", sub: "camas activas" },
];

export function HomeJefatura({ d }: { d: T }) {
  const navigate = useNavigate();
  const opTone = semTone(d.operacion.semaforo);
  return (
    <div className="page home-jef">
      <NarrativaHead n={d.narrativa} />
      <GuiaNexBar g={d.guia} />

      {/* ---- SALA DE SITUACIÓN ---- */}
      <section className="panel sala" style={toneStyle(opTone as never)}>
        <div className="panel-h">
          <Icon name="pulse" size={15} /> Sala de Situación
          <span className={`ops-tag tn-${opTone}`}>{semLabel[d.operacion.semaforo]}</span>
          <span className="sala-live">
            <span className="sala-livedot" /> en vivo
          </span>
        </div>

        <PulseLine tone={opTone as never} />

        <div className="sala-rings">
          {RINGS.map((r) => (
            <div className="sr" key={r.label} style={toneStyle(r.tone)}>
              <Gauge pct={r.pct} tone={r.tone} size={104} center={r.center} sub={r.sub} />
              <div className="sr-lab">{r.label}</div>
            </div>
          ))}
        </div>

        <div className="sala-hm">
          <div className="sala-sub">
            <Icon name="grid" size={13} /> Cobertura por unidad · próximos 7 días
          </div>
          <Heatmap data={d.heatmap} />
        </div>
      </section>

      {/* ---- DECISIÓN + COPILOTO ---- */}
      <div className="focorow">
        <section className="panel foco" style={toneStyle("crit")}>
          <div className="panel-h">
            <Icon name="bolt" size={15} /> Decisión prioritaria
            <span className="foco-timer">
              <span className="foco-pulse" /> abierta hace {d.foco.minutos} min
            </span>
          </div>
          <div className="foco-title">{d.foco.titulo}</div>
          <div className="foco-sub">{d.foco.subt}</div>

          <div className="foco-recos">
            <div className="foco-recolab">Índice NEX · posibles reemplazos (los contacta Gestión Central)</div>
            {d.foco.candidatos.map((cand, i) => (
              <div className={`cand ${i === 0 ? "best" : ""}`} key={cand.nombre} style={toneStyle(cand.tono)}>
                <span className="cand-rank">{i + 1}</span>
                <div className="cand-info">
                  <div className="cand-name">
                    {cand.nombre}
                    {i === 0 && <span className="cand-badge">NEX recomienda</span>}
                  </div>
                  <div className="cand-det">{cand.detalle}</div>
                </div>
                <div className="cand-score">
                  <div className="cand-bar">
                    <span style={{ width: `${cand.score}%` }} />
                  </div>
                  <b>{cand.score}</b>
                </div>
              </div>
            ))}
          </div>

          <button className="btn prim foco-cta" type="button" onClick={() => navigate("/brechas")}>
            <Icon name="send" size={14} /> Solicitar cobertura a Gestión Central
          </button>
        </section>

        <Timeline eventos={d.timeline} titulo="Actividad en vivo" live />
      </div>
    </div>
  );
}
