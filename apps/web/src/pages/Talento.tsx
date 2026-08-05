import { useState } from "react";
import { PageHead } from "@/components/kit";
import { DonutGrad } from "@/components/Charts";
import { Icon } from "@/components/icons";
import { GuiaNexBar, toneStyle } from "@/pages/home/parts";
import { useToast } from "@/components/Toast";
import { useApp } from "@/app/store";
import {
  BENNER,
  COMPETENCIAS,
  COMPETENCIAS_CORTO,
  EQUIPO_BENNER,
  PLAN_BENNER,
  VALIDACIONES,
  bennerDe,
  type AccionPlan,
  type PlanBenner,
  type ValidacionVB,
} from "@/data/talento";

/* ---------- primitivos Benner ---------- */
function BennerCell({ n, big }: { n: number; big?: boolean }) {
  const b = bennerDe(n);
  return (
    <span className={`bn${big ? " big" : ""}`} style={toneStyle(b.tono)} title={`Estadio ${b.corto} · ${b.nombre}`}>
      {b.corto}
    </span>
  );
}
function BennerLegend() {
  return (
    <div className="benner-leg">
      <span className="benner-leg-t">Escala de Benner:</span>
      {BENNER.map((b) => (
        <span className="bl" key={b.n} style={toneStyle(b.tono)} title={b.desc}>
          <span className="bn sm" style={toneStyle(b.tono)}>{b.corto}</span> {b.nombre}
        </span>
      ))}
    </div>
  );
}
function MatrizBenner() {
  return (
    <div className="tablewrap">
      <table className="matriz">
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>Funcionario</th>
            <th title="Nivel Benner global">Nivel</th>
            {COMPETENCIAS.map((c, i) => (
              <th key={c} title={c}>{COMPETENCIAS_CORTO[i]}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {EQUIPO_BENNER.map((p) => (
            <tr key={p.nombre}>
              <td className="nm">{p.nombre}<small style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--ink3)" }}>{p.estamento}</small></td>
              <td><BennerCell n={p.global} /></td>
              {p.niveles.map((n, i) => <td key={i}><BennerCell n={n} /></td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- plan de desarrollo (avance de estadio) ---------- */
function PlanCard({ plan, mio }: { plan: PlanBenner; mio?: boolean }) {
  const toast = useToast();
  const [acciones, setAcciones] = useState<AccionPlan[]>(plan.acciones);
  const done = acciones.filter((a) => a.estado === "done").length;
  const evaluables = acciones.filter((a) => a.tipo !== "V°B°");
  const evalDone = evaluables.every((a) => a.estado === "done");
  const vb = acciones.find((a) => a.tipo === "V°B°")!;
  const progreso = Math.round((done / acciones.length) * 100);
  const bDesde = bennerDe(plan.desde);
  const bHasta = bennerDe(plan.hasta);

  const avanzar = () => {
    const next = acciones.find((a) => a.tipo !== "V°B°" && a.estado !== "done");
    if (!next) return;
    setAcciones((xs) => xs.map((a) => (a.id === next.id ? { ...a, estado: "done" } : a)));
    toast("Acción completada");
  };

  return (
    <div className="strat" style={{ marginTop: 14 }}>
      <section className="panel">
        <div className="panel-h"><Icon name="graduation" size={15} /> {mio ? "Mi plan de desarrollo" : `Plan de ${plan.funcionario}`}</div>
        <div className="td-title" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {plan.competencia}
          <span className="benner-arrow"><BennerCell n={plan.desde} /> <Icon name="arrow-right" size={13} /> <BennerCell n={plan.hasta} /></span>
        </div>
        <div className="td-meta">De <b>{bDesde.nombre}</b> a <b>{bHasta.nombre}</b> (Benner)</div>

        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
          {acciones.map((a) => (
            <div className={`pstep${a.tipo === "V°B°" ? " vb" : ""}`} key={a.id}>
              <span className={`chip ${a.tipo === "V°B°" ? "acc" : ""}`}>{a.tipo}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 560 }}>{a.nombre}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--ink3)" }}>Responsable: {a.responsable}</div>
              </div>
              <span className={`chip ${a.estado === "done" ? "good" : a.estado === "curso" ? "info" : ""}`}>
                {a.estado === "done" ? "Completada" : a.estado === "curso" ? "En curso" : "Pendiente"}
              </span>
            </div>
          ))}
        </div>

        {!evalDone ? (
          <button className="btn prim" style={{ marginTop: 14 }} onClick={avanzar} type="button"><Icon name="check" size={14} /> Completar siguiente acción</button>
        ) : vb.estado !== "done" ? (
          <div className="aus-verdict warn" style={{ marginTop: 14 }}><Icon name="shield" size={15} /> Evaluación completa · pendiente del <b>V°B° de Buenas Prácticas Clínicas</b>.</div>
        ) : (
          <div className="aus-verdict good" style={{ marginTop: 14 }}><Icon name="check" size={15} /> Habilitada en {plan.competencia} · estadio {bHasta.nombre}.</div>
        )}
      </section>
      <aside className="panel" style={{ textAlign: "center" }}>
        <div className="panel-h" style={{ justifyContent: "center" }}><Icon name="pulse" size={15} /> Progreso</div>
        <div style={{ display: "flex", justifyContent: "center", margin: "10px 0" }}><DonutGrad pct={progreso} size={116} label={`${progreso}%`} /></div>
        <div style={{ fontSize: 12.5, color: "var(--ink2)" }}>{done} de {acciones.length} acciones</div>
      </aside>
    </div>
  );
}

/* ---------- Jefatura: matriz del equipo + plan ---------- */
function TalentoJefatura() {
  const [tab, setTab] = useState<"matriz" | "plan">("matriz");
  const guia = {
    ocurre: "Tu equipo tiene 1 enfermera en desarrollo (estadio II) para UCI.",
    hacer: "Avanzá su plan; la habilitación cierra con el V°B° de BPC.",
    recomienda: "Priorizá ventilación mecánica: es la competencia que falta.",
    riesgo: "Sin subir de estadio, el pool experto sigue frágil.",
    siguiente: "Completada la evaluación, BPC da el visto bueno.",
  };
  return (
    <div className="page">
      <PageHead eyebrow="Talento clínico · escala de Benner" title={<>De novato <span className="thin">a experto</span></>} />
      <GuiaNexBar g={guia} />
      <div className="pl-stats" style={{ marginTop: 12 }}>
        <span className="plstat good"><b>{EQUIPO_BENNER.filter((p) => p.global >= 4).length}</b> expertos/proficientes</span>
        <span className="plstat warn"><b>{EQUIPO_BENNER.filter((p) => p.global <= 2).length}</b> en desarrollo</span>
        <span style={{ flex: 1 }} />
        <div className="seg" role="group" aria-label="Vista">
          <button aria-pressed={tab === "matriz"} onClick={() => setTab("matriz")} type="button">Matriz Benner</button>
          <button aria-pressed={tab === "plan"} onClick={() => setTab("plan")} type="button">Plan individual</button>
        </div>
      </div>
      {tab === "matriz" ? (
        <section className="panel" style={{ marginTop: 14 }}>
          <div className="panel-h"><Icon name="grid" size={15} /> Matriz de competencias · nivel Benner</div>
          <MatrizBenner />
          <BennerLegend />
        </section>
      ) : (
        <PlanCard plan={PLAN_BENNER} />
      )}
    </div>
  );
}

/* ---------- Funcionario: mi desarrollo ---------- */
function MiDesarrollo() {
  const mi = EQUIPO_BENNER.find((p) => p.nombre === "Paula R.")!;
  const guia = {
    ocurre: `Estás en estadio ${bennerDe(mi.global).nombre} (Benner); avanzás hacia Competente en UCI.`,
    hacer: "Completá las acciones de tu plan de desarrollo.",
    recomienda: "Priorizá ventilación mecánica: es la que te falta para habilitarte.",
    riesgo: "Sin el estadio y el V°B°, no podés tomar turnos de UCI.",
    siguiente: "Tras la evaluación, Buenas Prácticas Clínicas da el V°B°.",
  };
  return (
    <div className="page">
      <PageHead eyebrow="Mi desarrollo · escala de Benner" title={<>Mi habilitación <span className="thin">en curso</span></>} />
      <GuiaNexBar g={guia} />
      <section className="panel" style={{ marginTop: 14 }}>
        <div className="panel-h"><Icon name="graduation" size={15} /> Mis competencias · nivel Benner</div>
        <div className="mi-benner">
          {COMPETENCIAS.map((c, i) => (
            <div className="mib" key={c}>
              <BennerCell n={mi.niveles[i]} big />
              <div className="mib-t">{c}</div>
              <div className="mib-l">{bennerDe(mi.niveles[i]).nombre}</div>
            </div>
          ))}
        </div>
        <BennerLegend />
      </section>
      <PlanCard plan={PLAN_BENNER} mio />
    </div>
  );
}

/* ---------- BPC (Subdirección): V°B° del talento clínico ---------- */
function CalidadBPC() {
  const toast = useToast();
  const [items, setItems] = useState<ValidacionVB[]>(VALIDACIONES);
  const [selId, setSelId] = useState<string>(VALIDACIONES[0].id);
  const sel = items.find((i) => i.id === selId) ?? null;
  const pend = items.filter((i) => i.estado === "pendiente").length;

  const guia = {
    ocurre: `${pend} habilitación${pend === 1 ? "" : "es"} espera${pend === 1 ? "" : "n"} tu visto bueno (V°B°).`,
    hacer: "Revisá la evaluación y da el V°B° para el avance de estadio.",
    recomienda: "El V°B° respalda la calidad clínica del avance según Benner.",
    riesgo: "Sin V°B°, la persona no queda habilitada aunque haya sido evaluada.",
    siguiente: "Con el V°B°, la habilitación queda firme y suma al pool experto.",
  };

  const aprobar = () => {
    if (!sel) return;
    setItems((xs) => xs.map((x) => (x.id === sel.id ? { ...x, estado: "aprobada" } : x)));
    toast(`V°B° otorgado a ${sel.funcionario} · ${sel.competencia}`);
  };

  return (
    <div className="page">
      <PageHead eyebrow="Calidad clínica · Buenas Prácticas Clínicas" title={<>Visto bueno del <span className="thin">talento clínico</span></>} />
      <GuiaNexBar g={guia} />
      <div className="pl-stats" style={{ marginTop: 12 }}>
        <span className="plstat"><b>{items.length}</b> validaciones</span>
        <span className="plstat warn"><b>{pend}</b> por revisar</span>
      </div>

      <div className="triage">
        <section className="panel">
          <div className="panel-h"><Icon name="shield" size={15} /> Validaciones · V°B° pendiente</div>
          <div className="brlist">
            {items.map((v) => {
              const tone = v.estado === "aprobada" ? "good" : "warn";
              return (
                <button key={v.id} className={`brow rail-${tone}${selId === v.id ? " on" : ""}`} style={toneStyle(tone)} onClick={() => setSelId(v.id)} type="button">
                  <span className="brow-orb" style={toneStyle(tone)}><Icon name="graduation" size={16} /></span>
                  <span className="brow-body">
                    <span className="brow-top">
                      <span className="brow-t">{v.funcionario}</span>
                      <span className="benner-arrow"><BennerCell n={v.desde} /> <Icon name="arrow-right" size={11} /> <BennerCell n={v.hasta} /></span>
                      <span className={`chip ${tone}`}>{v.estado === "aprobada" ? "V°B° dado" : "pendiente"}</span>
                    </span>
                    <span className="brow-w">{v.unidad} · {v.competencia} · {v.fecha}</span>
                  </span>
                  <Icon name="chevron-right" size={16} />
                </button>
              );
            })}
          </div>
        </section>

        <aside className="panel triage-detail">
          {sel && (
            <>
              <div className="panel-h"><Icon name="sparkles" size={15} /> Avance propuesto</div>
              <div className="td-title">{sel.funcionario}</div>
              <div className="td-meta">{sel.unidad} · {sel.competencia}</div>
              <div className="benner-jump">
                <div className="bj"><BennerCell n={sel.desde} big /><span>{bennerDe(sel.desde).nombre}</span></div>
                <Icon name="arrow-right" size={18} />
                <div className="bj"><BennerCell n={sel.hasta} big /><span>{bennerDe(sel.hasta).nombre}</span></div>
              </div>
              <div className="td-causa"><Icon name="user" size={13} /> Evaluó: {sel.evaluador}</div>
              <div className="td-actions">
                {sel.estado === "aprobada" ? (
                  <div className="rep-sent" style={{ marginTop: 4 }}><Icon name="check" size={16} /> V°B° otorgado · habilitación firme</div>
                ) : (
                  <button className="btn prim" onClick={aprobar} type="button"><Icon name="check" size={14} /> Dar V°B° (Buenas Prácticas Clínicas)</button>
                )}
              </div>
            </>
          )}
        </aside>
      </div>

      <section className="panel" style={{ marginTop: 14 }}>
        <div className="panel-h"><Icon name="grid" size={15} /> Matriz de la unidad · nivel Benner</div>
        <MatrizBenner />
        <BennerLegend />
      </section>
    </div>
  );
}

export function Talento() {
  const { profile } = useApp();
  if (profile === "subdireccion") return <CalidadBPC />;
  if (profile === "funcionario") return <MiDesarrollo />;
  return <TalentoJefatura />;
}
