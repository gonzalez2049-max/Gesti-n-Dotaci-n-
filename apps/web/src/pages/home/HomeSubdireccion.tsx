import { Icon } from "@/components/icons";
import { Sparkline } from "@/components/Charts";
import type { HomeSubdireccion as T } from "@/data/home";
import { GuiaNexBar, NarrativaHead, NexPanel, RedMap, Timeline, toneStyle } from "./parts";

const semTone = (s: string) => (s === "critico" ? "crit" : s === "riesgo" ? "warn" : s === "exceso" ? "info" : "good");

export function HomeSubdireccion({ d }: { d: T }) {
  const enRiesgo = d.red.filter((u) => u.semaforo === "riesgo" || u.semaforo === "critico");
  return (
    <div className="page home-sub">
      <NarrativaHead n={d.narrativa} />
      <GuiaNexBar g={d.guia} />

      <div className="strat">
        <section className="panel mapwrap">
          <div className="panel-h">
            <Icon name="grid" size={15} /> Mapa de la red
            <span className="sala-live">
              <span className="sala-livedot" /> en vivo
            </span>
          </div>
          <RedMap unidades={d.red} />
          <div className="map-legend">
            {d.red.map((u) => (
              <span className={`ml tn-${semTone(u.semaforo)}`} key={u.sigla} style={toneStyle(semTone(u.semaforo) as never)}>
                <span className="ml-dot" /> {u.sigla} <b>{u.disp}/{u.req}</b>
              </span>
            ))}
          </div>
        </section>

        <NexPanel nex={d.nex} />
      </div>

      <div className="focorow">
        <section className="panel">
          <div className="panel-h">
            <Icon name="chart" size={15} /> Salud de la red
            {enRiesgo.length > 0 && <span className="ops-tag tn-warn" style={toneStyle("warn")}>{enRiesgo.length} en riesgo</span>}
          </div>
          <div className="trends">
            {d.indicadores.map((k, i) => (
              <div className="trend" key={i} style={toneStyle(k.tono)}>
                <div className="trend-lab">{k.label}</div>
                <div className="trend-val">
                  {k.valor}
                  {k.unidad && <span className="trend-u">{k.unidad}</span>}
                </div>
                <div className="trend-foot">
                  <span className={`trend-delta dir-${k.dir}`}>
                    <Icon name={k.dir === "up" ? "arrow-up" : k.dir === "down" ? "arrow-down" : "arrow-right"} size={11} />
                    {k.delta}
                  </span>
                  <Sparkline vals={k.spark} colorVar={`--${k.tono === "acc" ? "accent" : k.tono}`} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <Timeline eventos={d.timeline} titulo="Señales estratégicas" live />
      </div>
    </div>
  );
}
