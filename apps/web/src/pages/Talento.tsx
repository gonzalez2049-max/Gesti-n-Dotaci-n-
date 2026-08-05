import { useState } from "react";
import { PageHead } from "@/components/kit";
import { DonutGrad } from "@/components/Charts";
import { Icon } from "@/components/icons";
import { Drawer } from "@/components/Drawer";
import { GuiaNexBar, toneStyle } from "@/pages/home/parts";
import { useToast } from "@/components/Toast";
import { useApp } from "@/app/store";
import {
  COMPETENCIAS,
  COMP_NIVELES,
  EQUIPO,
  PLAN,
  UMBRAL_HABILITADO,
  VALIDACIONES,
  bennerDe,
  coberturaCompetencias,
  compDe,
  habilitada,
  type AccionPlan,
  type PersonaComp,
  type ValidacionVB,
} from "@/data/talento";

/* ---------- primitivos ---------- */
function CompCell({ n }: { n: number }) {
  const c = compDe(n);
  return <span className={`bn${habilitada(n) ? " hab" : ""}`} style={toneStyle(c.tono)}>{c.corto}</span>;
}
function BennerBadge({ n, big }: { n: number; big?: boolean }) {
  const b = bennerDe(n);
  return <span className={`bn benner${big ? " big" : ""}`} style={toneStyle(b.tono)} title={`Benner ${b.corto} · ${b.nombre}`}>{b.corto}</span>;
}
function CompLegend() {
  return (
    <div className="benner-leg">
      <span className="benner-leg-t">Competencia:</span>
      {COMP_NIVELES.map((c) => (
        <span className="bl" key={c.n} title={c.rubrica}>
          <span className={`bn sm${c.n >= UMBRAL_HABILITADO ? " hab" : ""}`} style={toneStyle(c.tono)}>{c.corto}</span> {c.nombre}
        </span>
      ))}
      <span className="benner-leg-hab"><span className="hab-ring" /> = habilitada (Competente+)</span>
    </div>
  );
}

/* ---------- matriz ---------- */
function MatrizComp({ onCell }: { onCell?: (p: PersonaComp, i: number) => void }) {
  return (
    <div className="tablewrap">
      <table className="matriz">
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>Funcionario</th>
            <th title="Nivel Benner global (holístico)">Benner</th>
            {COMPETENCIAS.map((c) => <th key={c.corto} title={`${c.nombre} — ${c.def}`}>{c.corto}</th>)}
          </tr>
        </thead>
        <tbody>
          {EQUIPO.map((p) => (
            <tr key={p.nombre}>
              <td className="nm">{p.nombre}<small style={{ display: "block", fontFamily: "var(--font-mono)", fontSize: 9, color: "var(--ink3)" }}>{p.estamento}</small></td>
              <td><BennerBadge n={p.benner} /></td>
              {p.comp.map((n, i) => (
                <td key={i}>
                  <button className="cellbtn" onClick={() => onCell?.(p, i)} type="button" title="Ver rúbrica">
                    <CompCell n={n} />
                  </button>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ---------- resultado: cobertura de competencias de la unidad ---------- */
function Cobertura() {
  const cob = coberturaCompetencias();
  return (
    <section className="panel">
      <div className="panel-h"><Icon name="shield" size={15} /> Cobertura de competencias · UCI</div>
      <div className="cob-note">Solo quienes están <b>Competentes (III o más)</b> pueden cubrir el turno de esa competencia — y son los que aparecen elegibles en el Índice NEX.</div>
      <div className="cob-list">
        {cob.map((c) => (
          <div className="cob" key={c.corto} style={toneStyle(c.tono)}>
            <div className="cob-main">
              <span className="cob-nombre">{c.nombre}</span>
              <span className="cob-def">{c.def}</span>
            </div>
            <div className="cob-bar"><span style={{ width: `${(c.hab / c.total) * 100}%` }} /></div>
            <b className="cob-n">{c.hab}<small>/{c.total}</small></b>
          </div>
        ))}
      </div>
    </section>
  );
}

function ComoSeMide() {
  return (
    <div className="pl-nex-empty" style={{ marginTop: 12 }}>
      <b>¿Cómo se asigna el nivel?</b> Por evidencia, no a criterio: <b>II En desarrollo</b> = curso + práctica supervisada · <b>III Competente</b> (habilitada) = evaluación de desempeño aprobada + ≥ 20 turnos autónomos + <b>V°B° de BPC</b> · <b>IV Experta</b> = + experiencia y rol docente. El <b>Benner global</b> es aparte: el estadio del profesional como un todo.
    </div>
  );
}

/* ---------- plan ---------- */
function PlanCard({ mio }: { mio?: boolean }) {
  const toast = useToast();
  const [acciones, setAcciones] = useState<AccionPlan[]>(PLAN.acciones);
  const comp = COMPETENCIAS[PLAN.competenciaIdx];
  const evalDone = acciones.filter((a) => a.tipo !== "V°B°").every((a) => a.estado === "done");
  const vbDone = acciones.find((a) => a.tipo === "V°B°")!.estado === "done";
  const done = acciones.filter((a) => a.estado === "done").length;
  const progreso = Math.round((done / acciones.length) * 100);
  const avanzar = () => {
    const next = acciones.find((a) => a.tipo !== "V°B°" && a.estado !== "done");
    if (!next) return;
    setAcciones((xs) => xs.map((a) => (a.id === next.id ? { ...a, estado: "done" } : a)));
    toast("Acción completada");
  };
  return (
    <div className="strat" style={{ marginTop: 14 }}>
      <section className="panel">
        <div className="panel-h"><Icon name="graduation" size={15} /> {mio ? "Mi plan de habilitación" : `Plan de ${PLAN.funcionario}`}</div>
        <div className="td-title" style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          {comp.nombre}
          <span className="benner-arrow"><CompCell n={PLAN.desde} /> <Icon name="arrow-right" size={13} /> <CompCell n={PLAN.hasta} /></span>
        </div>
        <div className="td-meta">De <b>{compDe(PLAN.desde).nombre}</b> a <b>{compDe(PLAN.hasta).nombre}</b> — al llegar a Competente queda <b>habilitada</b>.</div>
        <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 8 }}>
          {acciones.map((a) => (
            <div className={`pstep${a.tipo === "V°B°" ? " vb" : ""}`} key={a.id}>
              <span className={`chip ${a.tipo === "V°B°" ? "acc" : ""}`}>{a.tipo}</span>
              <div><div style={{ fontSize: 13, fontWeight: 560 }}>{a.nombre}</div><div style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, color: "var(--ink3)" }}>Responsable: {a.responsable}</div></div>
              <span className={`chip ${a.estado === "done" ? "good" : a.estado === "curso" ? "info" : ""}`}>{a.estado === "done" ? "Completada" : a.estado === "curso" ? "En curso" : "Pendiente"}</span>
            </div>
          ))}
        </div>
        {!evalDone ? (
          <button className="btn prim" style={{ marginTop: 14 }} onClick={avanzar} type="button"><Icon name="check" size={14} /> Completar siguiente acción</button>
        ) : !vbDone ? (
          <div className="aus-verdict warn" style={{ marginTop: 14 }}><Icon name="shield" size={15} /> Evaluación completa · pendiente del <b>V°B° de Buenas Prácticas Clínicas</b>.</div>
        ) : (
          <div className="aus-verdict good" style={{ marginTop: 14 }}><Icon name="check" size={15} /> Habilitada en {comp.nombre} (Competente).</div>
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

/* ---------- rúbrica (drawer lateral) ---------- */
function RubricaDrawer({ sel, onClose }: { sel: { p: PersonaComp; i: number } | null; onClose: () => void }) {
  const comp = sel ? COMPETENCIAS[sel.i] : null;
  const nivel = sel ? sel.p.comp[sel.i] : 0;
  const c = compDe(nivel);
  const hab = habilitada(nivel);
  const siguiente = nivel < 4 ? compDe(nivel + 1) : null;
  return (
    <Drawer open={!!sel} onClose={onClose} eyebrow={comp ? comp.nombre : ""} title={sel ? sel.p.nombre : ""}>
      {sel && comp && (
        <>
          <div className="td-causa" style={{ marginTop: 4 }}><Icon name="pulse" size={13} /> {comp.def}</div>
          <div className="sect" style={{ marginTop: 14 }}>Nivel actual</div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 6 }}>
            <span className={`bn big${hab ? " hab" : ""}`} style={toneStyle(c.tono)}>{c.corto}</span>
            <div><div style={{ fontWeight: 680 }}>{c.nombre}</div><div className={`chip ${hab ? "good" : "warn"}`} style={{ marginTop: 4 }}>{hab ? "✓ Habilitada" : "No habilitada aún"}</div></div>
          </div>
          <div className="rubrica-box">{c.rubrica}</div>
          <div className="sect" style={{ marginTop: 12 }}>Cómo se evalúa este nivel</div>
          <div className="rubrica-crit">{c.criterio}</div>
          {siguiente && (
            <>
              <div className="sect" style={{ marginTop: 14 }}>Para subir a {siguiente.nombre}</div>
              <div className="rubrica-crit">{siguiente.criterio}</div>
            </>
          )}
          <div className="sect" style={{ marginTop: 14 }}>Benner global de la persona</div>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 6 }}>
            <BennerBadge n={sel.p.benner} /> <span style={{ fontSize: 12.5, color: "var(--ink2)" }}>{bennerDe(sel.p.benner).nombre} — {bennerDe(sel.p.benner).desc}</span>
          </div>
        </>
      )}
    </Drawer>
  );
}

/* ---------- Jefatura ---------- */
function TalentoJefatura() {
  const [tab, setTab] = useState<"matriz" | "plan">("matriz");
  const [sel, setSel] = useState<{ p: PersonaComp; i: number } | null>(null);
  const guia = {
    ocurre: "Para armar turnos seguros necesitás saber quién está habilitado en cada competencia.",
    hacer: "Revisá la cobertura y avanzá a los que están en desarrollo.",
    recomienda: "Priorizá las competencias con menos habilitados (brecha de la unidad).",
    riesgo: "Si una competencia queda sin habilitados suficientes, no podés cubrir ese turno.",
    siguiente: "Al llegar a Competente y con V°B° de BPC, la persona queda elegible en el Índice NEX.",
  };
  return (
    <div className="page">
      <PageHead eyebrow="Talento clínico · competencias y Benner" title={<>Quién puede cubrir <span className="thin">cada competencia</span></>} />
      <GuiaNexBar g={guia} />
      <div className="ops" style={{ marginTop: 14, gridTemplateColumns: "1fr 1fr" }}>
        <Cobertura />
        <section className="panel">
          <div className="panel-h"><Icon name="graduation" size={15} /> Benner global del equipo</div>
          <div className="cob-list">
            {EQUIPO.map((p) => (
              <div className="cob" key={p.nombre} style={toneStyle(bennerDe(p.benner).tono)}>
                <div className="cob-main"><span className="cob-nombre">{p.nombre}</span><span className="cob-def">{bennerDe(p.benner).nombre}</span></div>
                <BennerBadge n={p.benner} />
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="pl-stats" style={{ marginTop: 14 }}>
        <span className="plstat"><b>{EQUIPO.length}</b> en la unidad</span>
        <span style={{ flex: 1 }} />
        <div className="seg" role="group" aria-label="Vista">
          <button aria-pressed={tab === "matriz"} onClick={() => setTab("matriz")} type="button">Matriz</button>
          <button aria-pressed={tab === "plan"} onClick={() => setTab("plan")} type="button">Plan individual</button>
        </div>
      </div>

      {tab === "matriz" ? (
        <section className="panel">
          <div className="panel-h"><Icon name="grid" size={15} /> Matriz de competencias · tocá una celda para ver la rúbrica</div>
          <MatrizComp onCell={(p, i) => setSel({ p, i })} />
          <CompLegend />
          <ComoSeMide />
        </section>
      ) : (
        <PlanCard />
      )}
      <RubricaDrawer sel={sel} onClose={() => setSel(null)} />
    </div>
  );
}

/* ---------- Funcionario ---------- */
function MiDesarrollo() {
  const mi = EQUIPO.find((p) => p.nombre === "Paula R.")!;
  const [sel, setSel] = useState<{ p: PersonaComp; i: number } | null>(null);
  const guia = {
    ocurre: `Sos ${bennerDe(mi.benner).nombre} (Benner). Estás habilitada en ${mi.comp.filter(habilitada).length} de ${mi.comp.length} competencias.`,
    hacer: "Avanzá las competencias en desarrollo con tu plan.",
    recomienda: "Empezá por Ventilación mecánica: te falta para cubrir turnos de UCI.",
    riesgo: "Sin llegar a Competente no podés tomar esos turnos sola.",
    siguiente: "Tras la evaluación, Buenas Prácticas Clínicas da el V°B° y quedás habilitada.",
  };
  return (
    <div className="page">
      <PageHead eyebrow="Mi desarrollo · competencias y Benner" title={<>Mis competencias <span className="thin">y habilitación</span></>} />
      <GuiaNexBar g={guia} />
      <section className="panel" style={{ marginTop: 14 }}>
        <div className="panel-h"><Icon name="graduation" size={15} /> Mis competencias · tocá para ver la rúbrica
          <span className="ops-tag" style={{ marginLeft: "auto", ...toneStyle(bennerDe(mi.benner).tono) }}>Benner: {bennerDe(mi.benner).nombre}</span>
        </div>
        <div className="mi-benner">
          {COMPETENCIAS.map((c, i) => (
            <button className="mib cellbtn" key={c.corto} onClick={() => setSel({ p: mi, i })} type="button">
              <CompCell n={mi.comp[i]} />
              <div className="mib-t">{c.nombre}</div>
              <div className="mib-l">{compDe(mi.comp[i]).nombre}{habilitada(mi.comp[i]) ? " · habilitada" : ""}</div>
            </button>
          ))}
        </div>
        <CompLegend />
      </section>
      <PlanCard mio />
      <RubricaDrawer sel={sel} onClose={() => setSel(null)} />
    </div>
  );
}

/* ---------- BPC (Subdirección): V°B° ---------- */
function CalidadBPC() {
  const toast = useToast();
  const [items, setItems] = useState<ValidacionVB[]>(VALIDACIONES);
  const [selId, setSelId] = useState<string>(VALIDACIONES[0].id);
  const sel = items.find((i) => i.id === selId) ?? null;
  const pend = items.filter((i) => i.estado === "pendiente").length;
  const guia = {
    ocurre: `${pend} habilitación${pend === 1 ? "" : "es"} a Competente espera${pend === 1 ? "" : "n"} tu visto bueno (V°B°).`,
    hacer: "Revisá la evaluación y da el V°B° para dejar la habilitación firme.",
    recomienda: "El V°B° respalda que la competencia se evaluó con la rúbrica y la evidencia.",
    riesgo: "Sin V°B°, la persona no queda habilitada aunque haya aprobado la evaluación.",
    siguiente: "Con el V°B°, pasa a Competente y se vuelve elegible en el Índice NEX.",
  };
  const aprobar = () => {
    if (!sel) return;
    setItems((xs) => xs.map((x) => (x.id === sel.id ? { ...x, estado: "aprobada" } : x)));
    toast(`V°B° otorgado · ${sel.funcionario} habilitado/a`);
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
                    <span className="brow-top"><span className="brow-t">{v.funcionario}</span><span className="benner-arrow"><CompCell n={v.desde} /> <Icon name="arrow-right" size={11} /> <CompCell n={v.hasta} /></span><span className={`chip ${tone}`}>{v.estado === "aprobada" ? "V°B° dado" : "pendiente"}</span></span>
                    <span className="brow-w">{v.unidad} · {COMPETENCIAS[v.competenciaIdx].nombre} · {v.fecha}</span>
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
              <div className="panel-h"><Icon name="sparkles" size={15} /> Habilitación propuesta</div>
              <div className="td-title">{sel.funcionario}</div>
              <div className="td-meta">{sel.unidad} · {COMPETENCIAS[sel.competenciaIdx].nombre}</div>
              <div className="benner-jump">
                <div className="bj"><CompCell n={sel.desde} /><span>{compDe(sel.desde).nombre}</span></div>
                <Icon name="arrow-right" size={18} />
                <div className="bj"><CompCell n={sel.hasta} /><span>{compDe(sel.hasta).nombre}</span></div>
              </div>
              <div className="rubrica-crit">{compDe(sel.hasta).criterio}</div>
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
      <Cobertura />
    </div>
  );
}

export function Talento() {
  const { profile } = useApp();
  if (profile === "subdireccion") return <CalidadBPC />;
  if (profile === "funcionario") return <MiDesarrollo />;
  return <TalentoJefatura />;
}
