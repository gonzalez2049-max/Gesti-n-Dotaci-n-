import { useNavigate } from "react-router-dom";
import { Icon } from "@/components/icons";
import type { HomeJefatura as T } from "@/data/home";
import { GuiaNexBar, LiveStatRow, NarrativaHead, NexPanel, PulseLine, Timeline, UnitTiles, toneStyle } from "./parts";

const semTone = (s: string) => (s === "critico" ? "crit" : s === "riesgo" ? "warn" : s === "exceso" ? "info" : "good");
const semLabel: Record<string, string> = { critico: "Crítico", riesgo: "En riesgo", exceso: "Sobredotado", equilibrio: "Estable" };

export function HomeJefatura({ d }: { d: T }) {
  const navigate = useNavigate();
  const opTone = semTone(d.operacion.semaforo);
  return (
    <div className="page home-jef">
      <NarrativaHead n={d.narrativa} />
      <GuiaNexBar g={d.guia} />

      <div className="ops">
        <section className="panel ops-live" style={toneStyle(opTone as never)}>
          <div className="panel-h">
            <Icon name="pulse" size={15} /> {d.operacion.titulo}
            <span className={`ops-tag tn-${opTone}`}>{semLabel[d.operacion.semaforo]}</span>
          </div>
          <PulseLine tone={opTone as never} />
          <UnitTiles unidades={d.operacion.unidades} />
        </section>

        <NexPanel nex={d.nex} />
      </div>

      <LiveStatRow stats={d.pulso} />

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
            <div className="foco-recolab">Índice NEX · mejores candidatos</div>
            {d.foco.candidatos.map((c, i) => (
              <div className={`cand ${i === 0 ? "best" : ""}`} key={c.nombre} style={toneStyle(c.tono)}>
                <span className="cand-rank">{i + 1}</span>
                <div className="cand-info">
                  <div className="cand-name">
                    {c.nombre}
                    {i === 0 && <span className="cand-badge">NEX recomienda</span>}
                  </div>
                  <div className="cand-det">{c.detalle}</div>
                </div>
                <div className="cand-score">
                  <div className="cand-bar">
                    <span style={{ width: `${c.score}%` }} />
                  </div>
                  <b>{c.score}</b>
                </div>
              </div>
            ))}
          </div>

          <button className="btn prim foco-cta" type="button" onClick={() => navigate("/brechas")}>
            <Icon name="send" size={14} /> Resolver esta brecha
          </button>
        </section>

        <Timeline eventos={d.timeline} titulo="Qué está pasando" />
      </div>
    </div>
  );
}
