import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useApp } from "@/app/store";
import { getInicio } from "@/api/api";
import { Gauge } from "@/components/Gauge";
import { Sparkline } from "@/components/Charts";
import { Icon, type IconName } from "@/components/icons";
import type { AccionPrioritaria, Indicador, Semaforo } from "@nexshift/contracts";

const NIVEL_LABEL: Record<string, string> = {
  ahora: "Ahora",
  hoy: "Hoy",
  semana: "Esta semana",
  revisar: "Para revisar",
};

type Tone = "good" | "warn" | "crit" | "info";
const toneOf = (s?: Semaforo): Tone =>
  s === "critico" ? "crit" : s === "riesgo" ? "warn" : s === "exceso" ? "info" : "good";

const TIPO_ICON: Record<string, IconName> = {
  cobertura: "swap",
  solicitud: "calendar",
  oferta: "send",
  reevaluacion: "shield",
  ausencia: "plane",
  desarrollo: "graduation",
  malla: "calendar",
  config: "settings",
};

const IND_ICON: Record<string, IconName> = {
  dotacion: "users",
  ausencias: "plane",
  brechas: "gap",
  reeval: "shield",
  ofertas: "send",
  ofertas_sin: "send",
};

// Tendencias de ejemplo (prototipo) para dar vida a las tarjetas.
const SPARK: Record<string, number[]> = {
  dotacion: [13, 12, 14, 12, 11, 12, 12],
  ausencias: [1, 2, 1, 3, 2, 3, 3],
  brechas: [0, 1, 1, 2, 3, 2, 2],
  reeval: [4, 3, 3, 2, 2, 2, 2],
  ofertas: [0, 1, 2, 1, 2, 2, 2],
};

function nowHHMM(): string {
  return new Date().toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });
}

function MetricCard({ i }: { i: Indicador }) {
  const tone: Tone | "neutral" = i.tono === "neutro" ? "neutral" : i.tono;
  const spark = SPARK[i.clave] ?? [];
  const colorVar =
    tone === "crit" ? "--crit" : tone === "warn" ? "--warn" : tone === "good" ? "--good" : "--ink3";
  return (
    <div className="card hoverable metric">
      <div className="metric-top">
        <span className={`metric-ic ${tone}`}>
          <Icon name={IND_ICON[i.clave] ?? "dot"} size={16} />
        </span>
        <span className="metric-lab">{i.etiqueta}</span>
      </div>
      <div className="metric-row">
        <div className={`metric-val ${tone}`}>
          {i.valor}
          {i.unidad && <span className="metric-u">{i.unidad}</span>}
        </div>
        {spark.length > 0 && <Sparkline vals={spark} colorVar={colorVar} />}
      </div>
    </div>
  );
}

function SpotlightRow({ a, onGo }: { a: AccionPrioritaria; onGo: () => void }) {
  const tone = toneOf(a.semaforo);
  const spot = a.nivel === "ahora";
  return (
    <button type="button" onClick={onGo} className={`spot card hoverable rail-${tone}${spot ? " lead" : ""}`}>
      <span className={`spot-ic ${tone}`}>
        <Icon name={TIPO_ICON[a.tipo] ?? "dot"} size={spot ? 20 : 18} />
      </span>
      <span className="spot-body">
        <span className="spot-meta">
          <span className={`lvltag ${a.nivel}`}>{NIVEL_LABEL[a.nivel]}</span>
          {a.nueva && <span className="spot-new">Nueva</span>}
        </span>
        <span className="spot-title">{a.titulo}</span>
        <span className="spot-why">{a.porque}</span>
      </span>
      <span className={`spot-cta ${spot ? "prim" : ""}`}>
        {a.ctaLabel}
        <Icon name="arrow-right" size={15} />
      </span>
    </button>
  );
}

function LoadingInicio() {
  return (
    <div className="page">
      <div className="eyebrow">Centro de comando</div>
      <div className="cmd sk-cmd">
        <div className="sk" style={{ height: 150, borderRadius: "var(--r-lg)" }} />
      </div>
      <div className="metric-strip" style={{ marginTop: 12 }}>
        {[0, 1, 2, 3].map((k) => (
          <div key={k} className="sk" style={{ height: 92, borderRadius: "var(--r)" }} />
        ))}
      </div>
      <div style={{ display: "grid", gap: 10, marginTop: 18 }}>
        <div className="sk" style={{ height: 84, borderRadius: "var(--r)" }} />
        <div className="sk" style={{ height: 72, borderRadius: "var(--r)" }} />
      </div>
    </div>
  );
}

export function Inicio() {
  const { profile } = useApp();
  const navigate = useNavigate();
  const { data, isLoading } = useQuery({
    queryKey: ["inicio", profile],
    queryFn: () => getInicio(profile),
  });

  if (isLoading || !data) return <LoadingInicio />;

  const { estado, guia } = data;
  const pct = Math.round((estado.disponible / estado.requerido) * 100);
  const tone = toneOf(estado.semaforo);
  const faltan = Math.max(0, estado.requerido - estado.disponible);
  const acciones = data.accionesPrioritarias;
  const lead = acciones.find((a) => a.nivel === "ahora") ?? acciones[0];
  const resto = acciones.filter((a) => a !== lead);

  const go = (a: AccionPrioritaria) =>
    navigate(a.tipo === "solicitud" || a.tipo === "ausencia" ? "/ausencias" : "/brechas");

  return (
    <div className="page">
      <div className="eyebrow">Centro de comando</div>

      {/* ---- HERO OPERATIVO ---- */}
      <section className={`cmd rail-${tone}`}>
        <div className="cmd-glow" aria-hidden="true" />
        <div className="cmd-main">
          <div className="cmd-live">
            <span className={`live-dot ${tone}`} />
            <span className="live-txt">Operación en vivo</span>
            <span className="live-ctx">{data.contexto}</span>
            <span className="live-time">
              <Icon name="clock" size={12} /> {nowHHMM()}
            </span>
          </div>
          <h1 className="cmd-title">{estado.titular}</h1>
          <p className="cmd-sub">{estado.detalle}</p>

          <div className="cmd-guide">
            <span className="cg-item">
              <span className="cg-k">Ocurre</span>
              {guia.queOcurre}
            </span>
            <span className="cg-item strong">
              <span className="cg-k acc">Hacé</span>
              {guia.queHacer}
            </span>
            <span className="cg-item">
              <span className="cg-k">Sigue</span>
              {guia.siguiente}
            </span>
          </div>

          <div className="cmd-actions">
            <button className="btn prim" type="button" onClick={() => navigate("/brechas")}>
              <Icon name="bolt" size={15} /> {guia.cta ?? "Ir a la acción"}
            </button>
            <button className="btn ghost" type="button" onClick={() => navigate("/programacion")}>
              <Icon name="calendar" size={15} /> Ver programación
            </button>
          </div>
        </div>

        <div className="cmd-gauge">
          <Gauge pct={pct} tone={tone} center={`${estado.disponible}/${estado.requerido}`} sub={`${pct}% dotación`} />
          <div className="cmd-legend">
            <span className={`cl ${tone}`}>
              <Icon name="gauge" size={13} /> {estado.unidad}
            </span>
            <span className="cl">
              <Icon name="user-plus" size={13} /> Faltan {faltan}
            </span>
          </div>
        </div>
      </section>

      {/* ---- INDICADORES VIVOS ---- */}
      <div className="metric-strip">
        {data.indicadores.map((i) => (
          <MetricCard key={i.clave} i={i} />
        ))}
      </div>

      {/* ---- ACCIONES PRIORITARIAS ---- */}
      <div className="sect-row">
        <div className="sect">Acciones prioritarias</div>
        <span className="sect-count">{acciones.length}</span>
      </div>

      {acciones.length === 0 ? (
        <div className="empty card">
          <span className="empty-ic">
            <Icon name="check" size={26} />
          </span>
          <div className="empty-t">Todo bajo control</div>
          <div className="empty-w">No hay acciones prioritarias ahora. Tu dotación está en verde.</div>
        </div>
      ) : (
        <div className="spot-list">
          {lead && <SpotlightRow a={lead} onGo={() => go(lead)} />}
          {resto.map((a) => (
            <SpotlightRow key={a.id} a={a} onGo={() => go(a)} />
          ))}
        </div>
      )}
    </div>
  );
}
