import { useNavigate } from "react-router-dom";
import { Icon } from "@/components/icons";
import type { HomeGestion as T } from "@/data/home";
import { LiveStatRow, NarrativaHead, Timeline, toneStyle } from "./parts";

export function HomeGestion({ d }: { d: T }) {
  const navigate = useNavigate();
  return (
    <div className="page home-gestion">
      <NarrativaHead n={d.narrativa} />

      <div className="ops ops-solo">
        <section className="panel">
          <div className="panel-h">
            <Icon name="swap" size={15} /> Cola de solicitudes
            <span className="sala-live">
              <span className="sala-livedot" /> en vivo
            </span>
          </div>
          <div className="cola">
            {d.cola.map((s, i) => (
              <button className={`cola-row rail-${s.tono}`} key={i} style={toneStyle(s.tono)} onClick={() => navigate("/coberturas")} type="button">
                <span className="cola-unit">
                  <span className="cola-sig">{s.unidad}</span>
                  <span className="cola-turno">{s.turno} · {s.fecha}</span>
                </span>
                <span className="cola-mid">
                  <span className={`cola-estado tn-${s.tono}`}>{s.estado}</span>
                  <span className="cola-det">{s.detalle}</span>
                </span>
                <span className="cola-jef">
                  <span className="cola-jlabel">Jefatura</span>
                  {s.jefatura}
                </span>
                <Icon name="chevron-right" size={16} />
              </button>
            ))}
          </div>
        </section>
      </div>

      <LiveStatRow stats={d.pulso} />

      <section className="panel tl-panel">
        <Timeline eventos={d.timeline} titulo="Contactos en curso" live />
      </section>
    </div>
  );
}
