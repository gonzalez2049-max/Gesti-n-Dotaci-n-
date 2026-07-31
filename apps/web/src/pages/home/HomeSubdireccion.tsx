import { Icon } from "@/components/icons";
import { Sparkline } from "@/components/Charts";
import type { HomeSubdireccion as T } from "@/data/home";
import { GuiaNexBar, NarrativaHead, NexPanel, Timeline, UnitTiles, toneStyle } from "./parts";

export function HomeSubdireccion({ d }: { d: T }) {
  return (
    <div className="page home-sub">
      <NarrativaHead n={d.narrativa} />
      <GuiaNexBar g={d.guia} />

      <div className="strat">
        <section className="panel strat-ind">
          <div className="panel-h">
            <Icon name="chart" size={15} /> Salud de la red
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

        <NexPanel nex={d.nex} />
      </div>

      <div className="focorow">
        <section className="panel">
          <div className="panel-h">
            <Icon name="grid" size={15} /> Red por unidad
          </div>
          <UnitTiles unidades={d.red} />
        </section>

        <Timeline eventos={d.timeline} titulo="Señales estratégicas" />
      </div>
    </div>
  );
}
