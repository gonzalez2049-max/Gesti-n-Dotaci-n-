import { useMemo, useState } from "react";
import { useApp } from "@/app/store";
import { PageHead } from "@/components/kit";
import { Icon } from "@/components/icons";
import { GuiaNexBar } from "@/pages/home/parts";
import { useToast } from "@/components/Toast";
import {
  ESTADO_LABEL,
  ESTADO_TONO,
  PERIODOS,
  SOLICITUDES_SEED,
  TIPO_ICON,
  TIPO_LABEL,
  generarContenido,
  type ReporteContenido,
  type ReporteEstado,
  type ReporteTipo,
  type SolicitudReporte,
} from "@/data/reportes";
import type { Tono } from "@/data/home";

const toneStyle = (t: Tono) => ({ ["--tn" as string]: `var(--${t})` });

function Preview({ c }: { c: ReporteContenido }) {
  return (
    <div className="rep-preview">
      <div className="rep-resumen">{c.resumen}</div>
      <div className="rep-metrics">
        {c.metricas.map((m, i) => (
          <div className="rep-metric" key={i} style={toneStyle(m.tono)}>
            <div className="rep-mv">{m.valor}{m.unidad && <span className="rep-mu"> {m.unidad}</span>}</div>
            <div className="rep-ml">{m.label}</div>
          </div>
        ))}
      </div>
      <div className="rep-filas">
        {c.filas.map((f, i) => (
          <div className="rep-fila" key={i} style={f.tono ? toneStyle(f.tono) : undefined}>
            <span className="rep-fk">{f.k}</span>
            <span className={`rep-fv${f.tono ? " ton" : ""}`}>{f.v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------ Buenas Prácticas Clínicas (Subdirección): bandeja y envío ------------ */
function ReportesBPC() {
  const toast = useToast();
  const [items, setItems] = useState<SolicitudReporte[]>(SOLICITUDES_SEED);
  const [selId, setSelId] = useState<string>(SOLICITUDES_SEED[0].id);
  const sel = items.find((i) => i.id === selId) ?? null;
  const contenido = useMemo(() => (sel ? generarContenido(sel.tipo, sel.periodo) : null), [sel]);

  const pendientes = items.filter((i) => i.estado !== "enviado").length;

  const enviar = () => {
    if (!sel) return;
    setItems((xs) => xs.map((x) => (x.id === sel.id ? { ...x, estado: "enviado" as ReporteEstado } : x)));
    toast(`Reporte enviado a la Jefatura de ${sel.unidad}`);
  };

  const guia = {
    ocurre: `${pendientes} solicitud${pendientes === 1 ? "" : "es"} de reporte pendiente${pendientes === 1 ? "" : "s"} de las jefaturas.`,
    hacer: "Revisá el reporte propuesto y enviálo a la Jefatura.",
    recomienda: "NEX ya compiló los datos del período pedido.",
    riesgo: "Si no se envía, la Jefatura no tiene evidencia para su reunión de gestión.",
    siguiente: "La Jefatura recibe el reporte y puede pedir el siguiente.",
  };

  return (
    <div className="page">
      <PageHead eyebrow="Reportes · Buenas Prácticas Clínicas" title={<>Solicitudes de las <span className="thin">jefaturas</span></>} />
      <GuiaNexBar g={guia} />

      <div className="pl-stats" style={{ marginTop: 12 }}>
        <span className="plstat"><b>{items.length}</b> solicitudes</span>
        <span className="plstat warn"><b>{pendientes}</b> por enviar</span>
      </div>

      <div className="triage">
        <section className="panel">
          <div className="panel-h"><Icon name="list" size={15} /> Bandeja de solicitudes</div>
          <div className="brlist">
            {items.map((s) => {
              const tone = ESTADO_TONO[s.estado];
              return (
                <button key={s.id} className={`brow rail-${tone}${selId === s.id ? " on" : ""}`} style={toneStyle(tone)} onClick={() => setSelId(s.id)} type="button">
                  <span className="brow-orb tn-info" style={toneStyle("info")}><Icon name={TIPO_ICON[s.tipo]} size={16} /></span>
                  <span className="brow-body">
                    <span className="brow-top">
                      <span className="brow-t">{TIPO_LABEL[s.tipo]}</span>
                      <span className={`chip ${tone}`}>{ESTADO_LABEL[s.estado]}</span>
                    </span>
                    <span className="brow-w">{s.unidad} · {s.jefatura} · {s.periodo} · {s.fecha}</span>
                  </span>
                  <Icon name="chevron-right" size={16} />
                </button>
              );
            })}
          </div>
        </section>

        <aside className="panel triage-detail">
          {sel && contenido && (
            <>
              <div className="panel-h">
                <Icon name="sparkles" size={15} /> Reporte propuesto
                <span className={`ops-tag tn-${ESTADO_TONO[sel.estado]}`} style={toneStyle(ESTADO_TONO[sel.estado])}>{ESTADO_LABEL[sel.estado]}</span>
              </div>
              <div className="td-title">{TIPO_LABEL[sel.tipo]}</div>
              <div className="td-meta">{sel.unidad} · Jefatura {sel.jefatura} · {sel.periodo}</div>
              {sel.nota && <div className="td-causa"><Icon name="user" size={13} /> "{sel.nota}"</div>}
              <Preview c={contenido} />
              <div className="td-actions">
                {sel.estado === "enviado" ? (
                  <div className="rep-sent"><Icon name="check" size={16} /> Enviado a la Jefatura de {sel.unidad}</div>
                ) : (
                  <button className="btn prim" onClick={enviar} type="button"><Icon name="send" size={14} /> Enviar a la Jefatura</button>
                )}
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}

/* ---------------- Jefatura: solicitar y ver ---------------- */
function ReportesJefatura() {
  const toast = useToast();
  const seed = SOLICITUDES_SEED.filter((s) => s.jefatura === "José M.");
  const [items, setItems] = useState<SolicitudReporte[]>(seed);
  const [tipo, setTipo] = useState<ReporteTipo>("cobertura");
  const [periodo, setPeriodo] = useState(PERIODOS[1]);
  const [nota, setNota] = useState("");
  const [openId, setOpenId] = useState<string | null>(null);

  const solicitar = () => {
    const nuevo: SolicitudReporte = {
      id: `r${Date.now()}`,
      tipo,
      periodo,
      jefatura: "José M.",
      unidad: "UCI",
      nota: nota || undefined,
      estado: "solicitado",
      fecha: "recién",
    };
    setItems((xs) => [nuevo, ...xs]);
    setNota("");
    toast("Solicitud enviada a Buenas Prácticas Clínicas");
  };

  const guia = {
    ocurre: "Podés pedirle a Buenas Prácticas Clínicas el detalle de cómo se cubrió tu unidad.",
    hacer: "Elegí el tipo de reporte y el período, y solicitalo.",
    recomienda: "Para la reunión de gestión, pedí 'Cobertura de brechas' del mes.",
    riesgo: "Sin reporte, no tenés evidencia del esfuerzo de cobertura.",
    siguiente: "Buenas Prácticas Clínicas lo prepara y te lo envía acá.",
  };

  return (
    <div className="page">
      <PageHead eyebrow="Reportes · Jefatura" title={<>Solicitá reportes a <span className="thin">Buenas Prácticas Clínicas</span></>} />
      <GuiaNexBar g={guia} />

      <div className="triage" style={{ marginTop: 14 }}>
        <section className="panel">
          <div className="panel-h"><Icon name="send" size={15} /> Solicitar un reporte</div>
          <div className="rep-form">
            <label className="rep-field">
              <span>Tipo de reporte</span>
              <select value={tipo} onChange={(e) => setTipo(e.target.value as ReporteTipo)}>
                {(Object.keys(TIPO_LABEL) as ReporteTipo[]).map((t) => <option key={t} value={t}>{TIPO_LABEL[t]}</option>)}
              </select>
            </label>
            <label className="rep-field">
              <span>Período</span>
              <select value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
                {PERIODOS.map((p) => <option key={p}>{p}</option>)}
              </select>
            </label>
            <label className="rep-field">
              <span>Nota para Gestión Central (opcional)</span>
              <input value={nota} onChange={(e) => setNota(e.target.value)} placeholder="Ej: para la reunión del lunes" />
            </label>
            <button className="btn prim" onClick={solicitar} type="button"><Icon name="send" size={14} /> Solicitar reporte</button>
          </div>
        </section>

        <section className="panel">
          <div className="panel-h"><Icon name="list" size={15} /> Mis solicitudes</div>
          <div className="brlist">
            {items.map((s) => {
              const tone = ESTADO_TONO[s.estado];
              const open = openId === s.id;
              return (
                <div key={s.id}>
                  <button
                    className={`brow rail-${tone}${open ? " on" : ""}`}
                    style={toneStyle(tone)}
                    onClick={() => setOpenId(open ? null : s.estado === "enviado" ? s.id : null)}
                    type="button"
                  >
                    <span className="brow-orb tn-info" style={toneStyle("info")}><Icon name={TIPO_ICON[s.tipo]} size={16} /></span>
                    <span className="brow-body">
                      <span className="brow-top">
                        <span className="brow-t">{TIPO_LABEL[s.tipo]}</span>
                        <span className={`chip ${tone}`}>{ESTADO_LABEL[s.estado]}</span>
                      </span>
                      <span className="brow-w">{s.periodo} · {s.fecha}{s.estado === "enviado" ? " · toca para ver" : ""}</span>
                    </span>
                    <Icon name={s.estado === "enviado" ? "chevron-right" : "clock"} size={16} />
                  </button>
                  {open && s.estado === "enviado" && (
                    <div className="panel" style={{ marginTop: 8, borderRadius: "var(--r)" }}>
                      <Preview c={generarContenido(s.tipo, s.periodo)} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

export function Reportes() {
  const { profile } = useApp();
  if (profile === "subdireccion") return <ReportesBPC />;
  if (profile === "jefatura") return <ReportesJefatura />;
  return (
    <div className="page">
      <PageHead eyebrow="Reportes" title="Reportes" />
      <div className="empty card" style={{ marginTop: 14 }}>
        <div className="empty-w">Los reportes los administra Buenas Prácticas Clínicas (Subdirección); las jefaturas los solicitan.</div>
      </div>
    </div>
  );
}
