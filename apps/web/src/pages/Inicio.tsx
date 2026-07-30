import { useApp } from "@/app/store";
import { getInicioResumen } from "@/data/inicio";
import { Ring } from "@/components/Ring";
import { GuideStrip, Orb, PriorityBar, orbClass } from "@/components/ui";
import type { AccionPrioritaria } from "@nexshift/contracts";

const NIVEL_LABEL: Record<string, string> = {
  ahora: "Ahora",
  hoy: "Hoy",
  semana: "Esta semana",
  revisar: "Para revisar",
};

function ActionRow({ a }: { a: AccionPrioritaria }) {
  const primary = a.nivel === "ahora";
  return (
    <div className="card hoverable" style={{ marginBottom: 8 }}>
      <div className="acard">
        <Orb tone={orbClass(a.semaforo)} />
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span className={`lvltag ${a.nivel}`}>{NIVEL_LABEL[a.nivel]}</span>
            <span className="t">{a.titulo}</span>
          </div>
          <div className="w">{a.porque}</div>
        </div>
        <button className={`btn ${primary ? "prim" : "ghost"}`} type="button">
          {a.ctaLabel}
        </button>
      </div>
    </div>
  );
}

export function Inicio() {
  const { profile } = useApp();
  const data = getInicioResumen(profile);
  const { estado } = data;
  const pct = Math.round((estado.disponible / estado.requerido) * 100);

  return (
    <>
      <div className="eyebrow">Inicio</div>
      <h1 className="title">
        Qué necesita tu atención <span className="thin">ahora</span>
      </h1>

      <GuideStrip
        ocurre={data.guia.queOcurre}
        hacer={data.guia.queHacer}
        siguiente={data.guia.siguiente}
        cta={data.guia.cta}
      />

      <div
        className="grid g2"
        style={{ marginTop: 12, gridTemplateColumns: "1.1fr .9fr" }}
      >
        <div className="card hoverable">
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Orb tone={orbClass(estado.semaforo)} lg />
            <div>
              <div style={{ fontSize: 17, fontWeight: 680 }}>{estado.titular}</div>
              <div style={{ fontSize: 12, color: "var(--ink2)" }}>{estado.detalle}</div>
            </div>
            <div style={{ marginLeft: "auto" }} className="ringwrap">
              <Ring pct={pct} label={`${estado.disponible}/${estado.requerido}`} />
            </div>
          </div>
        </div>
        <div className="card hoverable kpi">
          <div className="lab">Tiempo medio de cobertura</div>
          <div className="big">
            31<span className="u">min</span>
          </div>
          <div
            style={{
              marginTop: 8,
              height: 4,
              borderRadius: 99,
              background: "var(--hairline)",
              overflow: "hidden",
            }}
          >
            <div style={{ height: "100%", width: "62%", background: "var(--grad)" }} />
          </div>
        </div>
      </div>

      <div className="sect">Acciones prioritarias</div>
      {data.accionesPrioritarias.map((a) => (
        <ActionRow key={a.id} a={a} />
      ))}

      <div className="sect">Mis indicadores</div>
      <div className="grid g4">
        {data.indicadores.map((i) => (
          <div className="card hoverable kpi" key={i.clave}>
            <div className="lab">{i.etiqueta}</div>
            <div className={`big ${i.tono !== "neutro" ? i.tono : ""}`}>
              {i.valor}
              {i.unidad && <span className="u"> {i.unidad}</span>}
            </div>
          </div>
        ))}
      </div>

      <PriorityBar text={data.accionPrioritaria} />
    </>
  );
}
