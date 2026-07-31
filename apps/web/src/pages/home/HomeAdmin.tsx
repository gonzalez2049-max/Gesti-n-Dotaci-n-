import { Icon } from "@/components/icons";
import type { HomeAdmin as T } from "@/data/home";
import { GuiaNexBar, NarrativaHead, NexPanel, Timeline, toneStyle } from "./parts";

export function HomeAdmin({ d }: { d: T }) {
  return (
    <div className="page home-adm">
      <NarrativaHead n={d.narrativa} />
      <GuiaNexBar g={d.guia} />

      <div className="strat">
        <section className="panel salud">
          <div className="panel-h">
            <Icon name="shield" size={15} /> Salud del sistema
          </div>
          <div className="salud-grid">
            {d.salud.map((s, i) => (
              <div className="sh" key={i} style={toneStyle(s.estado)}>
                <span className="sh-ic"><Icon name={s.icon} size={16} /></span>
                <div className="sh-main">
                  <div className="sh-lab">{s.label}</div>
                  <div className="sh-val">{s.valor}</div>
                  <div className="sh-note">{s.nota}</div>
                </div>
                <span className="sh-led" />
              </div>
            ))}
          </div>
        </section>

        <NexPanel nex={d.nex} />
      </div>

      <Timeline eventos={d.timeline} titulo="Actividad reciente · auditoría" live />
    </div>
  );
}
