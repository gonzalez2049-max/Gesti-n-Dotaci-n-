import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPlanner } from "@/api/api";
import { PageHead, SearchInput, Segmented } from "@/components/kit";
import { useToast } from "@/components/Toast";
import { useApp } from "@/app/store";
import {
  MESES,
  DOW,
  SHORT,
  TURNO_LABEL,
  TURNOS_EDIT,
  coberturaDia,
  diasDelMes,
  generarGrid,
  horarioTurno,
  nochesDelMes,
  releva09,
  turnoDe,
  turnosDelMes,
} from "@/data/planner";
import type { PlannerPersona, Turno } from "@nexshift/contracts";

type Zoom = "mes" | "quincena" | "semana";
type Vista = "borrador" | "publicada" | "comparar";
const CW: Record<Zoom, number> = { mes: 30, quincena: 48, semana: 78 };
const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const cloneGrid = (g: Record<string, Turno[]>) => Object.fromEntries(Object.entries(g).map(([k, v]) => [k, [...v]]));

export function Programacion() {
  const toast = useToast();
  const { profile } = useApp();
  const soloLectura = profile === "funcionario" || profile === "subdireccion";
  const { data } = useQuery({ queryKey: ["planner"], queryFn: getPlanner });

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [zoom, setZoom] = useState<Zoom>("mes");
  const [win, setWin] = useState(0);
  const [vista, setVista] = useState<Vista>("borrador");
  const [unidad, setUnidad] = useState("UCI");
  const [estamento, setEstamento] = useState("todos");
  const [turno, setTurno] = useState("todos");
  const [q, setQ] = useState("");
  const [selPersona, setSelPersona] = useState<string | null>(null);
  const [edit, setEdit] = useState<{ p: string; d: number; x: number; y: number } | null>(null);
  const [pubV, setPubV] = useState(0);

  const cache = useRef<Record<string, Record<string, Turno[]>>>({});
  const pub = useRef<Record<string, Record<string, Turno[]>>>({});
  const [grid, setGrid] = useState<Record<string, Turno[]>>({});
  const monthKey = `${year}-${month}`;
  const n = diasDelMes(year, month);

  useEffect(() => {
    if (!data) return;
    if (!cache.current[monthKey]) cache.current[monthKey] = generarGrid(data.personas, year, month);
    setGrid(cache.current[monthKey]);
    setWin(0);
  }, [data, monthKey, year, month]);

  const personas = data?.personas ?? [];
  const unidades = useMemo(() => Array.from(new Set(personas.map((p) => p.unidad))), [personas]);
  const estamentos = useMemo(() => Array.from(new Set(personas.map((p) => p.estamento))), [personas]);
  const req = data?.requerido[unidad] ?? { largo: 0, noche: 0 };

  const unitPersonas = personas.filter((p) => p.unidad === unidad);
  const unitIds = unitPersonas.map((p) => p.id);
  const visibles = unitPersonas.filter(
    (p) =>
      (estamento === "todos" || p.estamento === estamento) &&
      (turno === "todos" || turnoDe(p) === turno) &&
      (!q || p.nombre.toLowerCase().includes(q.toLowerCase())),
  );

  const editable = !soloLectura && vista !== "publicada";
  const viewGrid = vista === "publicada" ? pub.current[monthKey] ?? grid : grid;

  const windowSize = zoom === "mes" ? n : zoom === "quincena" ? Math.min(15, n) : Math.min(7, n);
  const maxWin = Math.max(0, n - windowSize);
  const winC = clamp(win, 0, maxWin);
  const days = Array.from({ length: windowSize }, (_, i) => winC + i);
  const cw = CW[zoom];

  const setCell = (p: string, d: number, t: Turno) => {
    const cur = cache.current[monthKey];
    const g = { ...cur, [p]: [...cur[p]] };
    g[p][d] = t;
    cache.current[monthKey] = g;
    setGrid(g);
  };
  const moveCell = (fp: string, fd: number, tp: string, td: number) => {
    if (!editable) return;
    const cur = cache.current[monthKey];
    const g = { ...cur };
    g[fp] = [...cur[fp]];
    if (tp !== fp) g[tp] = [...cur[tp]];
    const val = g[fp][fd];
    g[tp][td] = val;
    if (!(fp === tp && fd === td)) g[fp][fd] = "libre";
    cache.current[monthKey] = g;
    setGrid(g);
  };
  const publicar = () => {
    pub.current[monthKey] = cloneGrid(cache.current[monthKey]);
    setPubV((v) => v + 1);
    toast("Malla publicada · es la fuente de verdad");
  };

  const changed = (p: string, d: number) => {
    if (vista !== "comparar") return false;
    const snap = pub.current[monthKey];
    return snap ? snap[p]?.[d] !== grid[p]?.[d] : false;
  };

  const deficitDias = useMemo(() => {
    let c = 0;
    for (let d = 0; d < n; d++) {
      const cov = coberturaDia(viewGrid, unitIds, d, req);
      if (cov.defLargo > 0 || cov.defNoche > 0) c++;
    }
    return c;
  }, [viewGrid, unitIds, req, n]);

  const persona = selPersona ? personas.find((p) => p.id === selPersona) : null;

  const nextMonth = (dir: number) => {
    let m = month + dir;
    let y = year;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setMonth(m);
    setYear(y);
  };

  return (
    <div className="page" style={{ ["--cw"]: `${cw}px` } as React.CSSProperties}>
      <PageHead
        eyebrow={soloLectura ? "Mi programación · solo lectura" : "Programación · planner mensual"}
        title={soloLectura ? <>Mi malla <span className="thin">del mes</span></> : <>Centro operativo <span className="thin">de dotación</span></>}
        actions={soloLectura ? undefined : <button className="btn prim" onClick={publicar} disabled={!editable} type="button">Publicar malla</button>}
      />
      <div className="pltoolbar">
        <div className="monthnav">
          <button className="navbtn2" onClick={() => nextMonth(-1)} aria-label="Mes anterior" type="button">‹</button>
          <span className="mlabel">{MESES[month]} {year}</span>
          <button className="navbtn2" onClick={() => nextMonth(1)} aria-label="Mes siguiente" type="button">›</button>
        </div>
        <Segmented value={zoom} onChange={(z) => { setZoom(z); setWin(0); }} ariaLabel="Zoom" options={[{ value: "mes", label: "Mes" }, { value: "quincena", label: "Quincena" }, { value: "semana", label: "Semana" }]} />
        {zoom !== "mes" && (
          <div className="monthnav">
            <button className="navbtn2" onClick={() => setWin((w) => clamp(w - windowSize, 0, maxWin))} disabled={winC === 0} aria-label="Días anteriores" type="button">‹</button>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--ink3)" }}>{winC + 1}–{winC + windowSize}</span>
            <button className="navbtn2" onClick={() => setWin((w) => clamp(w + windowSize, 0, maxWin))} disabled={winC >= maxWin} aria-label="Días siguientes" type="button">›</button>
          </div>
        )}
        <span className="spacer" style={{ flex: 1 }} />
        {!soloLectura && (
          <Segmented value={vista} onChange={setVista} ariaLabel="Vista" options={[{ value: "borrador", label: "Borrador" }, { value: "publicada", label: "Publicada" }, { value: "comparar", label: "Comparar" }]} />
        )}
      </div>

      <div className="pltoolbar" style={{ marginTop: 0 }}>
        <FilterSelect label="Unidad" value={unidad} onChange={setUnidad} options={unidades} />
        <FilterSelect label="Estamento" value={estamento} onChange={setEstamento} options={["todos", ...estamentos]} />
        <FilterSelect label="Turno" value={turno} onChange={setTurno} options={["todos", "A", "B", "C", "D", "Apoyo"]} />
        <span className="spacer" style={{ flex: 1 }} />
        <SearchInput value={q} onChange={setQ} placeholder="Buscar funcionario…" />
      </div>

      <div className="pl-stats">
        <span className="plstat crit"><b>{deficitDias}</b> día{deficitDias === 1 ? "" : "s"} con déficit</span>
        <span className="plstat"><b>{unitIds.length}</b> personas · {unidad}</span>
        <span className={`plstat ${pub.current[monthKey] ? "good" : "warn"}`}>
          {pub.current[monthKey] ? "● Malla publicada" : "● Borrador"}
        </span>
        <span style={{ flex: 1 }} />
        <span className="plhint">{soloLectura ? "Vista de la malla · solo lectura" : "Toca una celda para editar · arrastra para mover un turno"}</span>
      </div>

      <div className="pl-console">
        <div className="gridcard">
          <div className="gridscroll">
            <table className="pl">
              <thead>
                <tr>
                  <th className="namecol">Funcionario</th>
                  {days.map((d) => {
                    const dow = new Date(year, month, d + 1).getDay();
                    const wknd = dow === 0 || dow === 6;
                    return (
                      <th key={d} className={`dayhead${wknd ? " wknd" : ""}`}>
                        <div className="dl">{DOW[dow]}</div>
                        <div className="dn">{d + 1}</div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {visibles.map((p) => (
                  <tr key={p.id}>
                    <td className="namecol">
                      <div className="namecell" onClick={() => setSelPersona(p.id)}>
                        <span className="av2">{p.iniciales}</span>
                        <span className="nm2">{p.nombre.split(" ")[0]} {p.nombre.split(" ")[1]?.[0]}.<small>{p.estamento} · <TurnoBadge p={p} /></small></span>
                      </div>
                    </td>
                    {days.map((d) => {
                      const t = viewGrid[p.id]?.[d] ?? "libre";
                      const dow = new Date(year, month, d + 1).getDay();
                      const wknd = dow === 0 || dow === 6;
                      const hor = horarioTurno(t, releva09(year, month, d));
                      return (
                        <td className="pltd" key={d}>
                          <button
                            className={`plcell ${t}${wknd ? " wknd" : ""}${changed(p.id, d) ? " changed" : ""}`}
                            draggable={editable && t !== "libre"}
                            onDragStart={(e) => e.dataTransfer.setData("text/plain", `${p.id}|${d}`)}
                            onDragOver={(e) => { if (editable) { e.preventDefault(); e.currentTarget.classList.add("dragover"); } }}
                            onDragLeave={(e) => e.currentTarget.classList.remove("dragover")}
                            onDrop={(e) => {
                              e.preventDefault();
                              e.currentTarget.classList.remove("dragover");
                              const [fp, fd] = e.dataTransfer.getData("text/plain").split("|");
                              moveCell(fp, Number(fd), p.id, d);
                            }}
                            onClick={(e) => editable && setEdit({ p: p.id, d, x: e.clientX, y: e.clientY })}
                            title={`${p.nombre} · ${d + 1} ${MESES[month]}${hor ? ` · ${TURNO_LABEL[t]} ${hor}` : ` · ${TURNO_LABEL[t]}`}`}
                            type="button"
                          >
                            {SHORT[t]}
                          </button>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
              <tfoot>
                {(["largo", "noche"] as const).map((turno) => (
                  <tr key={turno}>
                    <td className="covlabel">{turno === "largo" ? "Largo" : "Noche"} · req {req[turno]}</td>
                    {days.map((d) => {
                      const cov = coberturaDia(viewGrid, unitIds, d, req);
                      const cnt = turno === "largo" ? cov.largo : cov.noche;
                      const def = turno === "largo" ? cov.defLargo : cov.defNoche;
                      const cls = def > 0 ? "def" : def < 0 ? "exc" : "ok";
                      return (
                        <td key={d} className="pltd">
                          <div
                            className={`covcell ${cls}`}
                            title={def > 0 ? `Déficit ${def}` : def < 0 ? `Exceso ${-def}` : "OK"}
                          >
                            {cnt}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tfoot>
            </table>
          </div>
          <div className="pl-legend" style={{ padding: "10px 12px" }}>
            <span><span className="sw largo">L</span> Largo</span>
            <span><span className="sw noche">N</span> Noche</span>
            <span><span className="sw cambio">CT</span> Cambio de turno</span>
            <span><span className="sw descanso">DC</span> Descanso comp.</span>
            <span><span className="sw permiso">PA</span> Permiso adm.</span>
            <span><span className="sw feriado">FL</span> Feriado legal</span>
            <span><span className="sw libre"></span> Libre</span>
            <span className="pl-legend-sep" />
            <span className="pl-hor">Largo <b>08–20</b> · Noche <b>20–08</b> · finde/festivo relevo <b>09:00</b></span>
            <span className="pl-legend-sep" />
            <span><span className="sw" style={{ background: "var(--crit-s)", color: "var(--crit)" }}>!</span> Déficit</span>
            <span><span className="sw" style={{ background: "var(--info-s)", color: "var(--info)" }}>+</span> Exceso</span>
            {vista === "comparar" && <span><span className="sw" style={{ boxShadow: "inset 0 0 0 2px var(--warn)" }}></span> Cambiado</span>}
            {pubV > 0 && <span style={{ color: "var(--good)" }}>● Publicada disponible</span>}
          </div>
        </div>

        {persona && (
          <aside className="pl-nex pl-side">
            <div className="pl-nex-head">
              <div>
                <div className="eyebrow">{persona.estamento} · {persona.unidad}</div>
                <div className="pl-nex-t">{persona.nombre}</div>
              </div>
              <button className="dclose" onClick={() => setSelPersona(null)} aria-label="Cerrar" type="button">✕</button>
            </div>
            <PersonaDetalle persona={persona} celdas={grid[persona.id]} n={n} />
          </aside>
        )}
      </div>

      {/* editor popover */}
      {edit && (
        <>
          <div style={{ position: "fixed", inset: 0, zIndex: 65 }} onClick={() => setEdit(null)} />
          <div className="popover popover-grid" style={{ left: Math.min(edit.x, window.innerWidth - 232), top: Math.min(edit.y, window.innerHeight - 250) }}>
            {TURNOS_EDIT.map((t) => (
              <button key={t} className={`pop-turno ${t}`} onClick={() => { setCell(edit.p, edit.d, t); setEdit(null); }} type="button">
                <span className={`sw ${t}`}>{SHORT[t] || "—"}</span>
                {TURNO_LABEL[t]}
              </button>
            ))}
          </div>
        </>
      )}

    </div>
  );
}

function TurnoBadge({ p, chip }: { p: PlannerPersona; chip?: boolean }) {
  const t = turnoDe(p);
  if (t === "Apoyo") return <span className={chip ? "chip" : "tbadge apoyo"}>Apoyo</span>;
  return <span className={chip ? `chip tn-turno tn-${t}` : `tbadge t-${t}`} title={`Turno ${t}`}>Turno {t}</span>;
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "var(--ink3)" }}>
      <span style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: ".04em", fontSize: 9.5 }}>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} style={{ fontFamily: "inherit", fontSize: 12.5, padding: "6px 9px", border: "1px solid var(--hairline)", borderRadius: 8, background: "var(--surface)", color: "var(--ink)", textTransform: "capitalize" }}>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

function MiniStat({ label, value, tone }: { label: string; value: string; tone: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--surface-2)", borderRadius: 8, padding: "8px 11px" }}>
      <span style={{ fontSize: 11.5, color: "var(--ink2)" }}>{label}</span>
      <span style={{ fontFamily: "var(--font-mono)", fontWeight: 700, fontSize: 13, color: tone === "neutro" ? "var(--ink)" : `var(--${tone === "crit" ? "crit" : tone})` }}>{value}</span>
    </div>
  );
}

function PersonaDetalle({ persona, celdas, n }: { persona: PlannerPersona; celdas: Turno[] | undefined; n: number }) {
  const turnos = turnosDelMes(celdas);
  const noches = nochesDelMes(celdas);
  const libres = n - turnos;
  return (
    <>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", margin: "4px 0 14px" }}>
        <span className="chip">{persona.unidad}</span>
        <TurnoBadge p={persona} chip />
        <span className={`chip ${persona.habilitado ? "good" : "warn"}`}>{persona.habilitado ? "Habilitado ✓" : "En proceso"}</span>
      </div>
      <div className="grid g2" style={{ gridTemplateColumns: "1fr 1fr" }}>
        <MiniStat label="Turnos del mes" value={String(turnos)} tone="neutro" />
        <MiniStat label="Horas estimadas" value={`${turnos * 12} h`} tone="neutro" />
        <MiniStat label="Noches" value={String(noches)} tone={noches > 8 ? "warn" : "neutro"} />
        <MiniStat label="Días libres" value={String(libres)} tone="neutro" />
      </div>
      <div className="sect">Horarios del cuarto turno</div>
      <div className="pl-horbox">
        <div className="pl-horrow"><span className="sw largo">L</span><b>Largo</b><span>08:00–20:00 · hábil</span><em>09:00–20:00 · finde/festivo</em></div>
        <div className="pl-horrow"><span className="sw noche">N</span><b>Noche</b><span>20:00–08:00 · hábil</span><em>20:00–09:00 · finde/festivo</em></div>
        <div className="pl-hornote">En fin de semana y festivos el relevo de la mañana se corre a las 09:00.</div>
      </div>
      <div className="sect">Distribución del mes</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        {(celdas ?? []).map((t, i) => (
          <span key={i} className={`plcell ${t}`} style={{ width: 18, minWidth: 18, height: 20, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8 }}>{SHORT[t]}</span>
        ))}
      </div>
      <div className="tcr" style={{ marginTop: 14 }}>El tope de referencia es ~16 turnos/mes. {turnos > 16 ? <b style={{ color: "var(--warn)" }}>Sobre el tope: revisar carga.</b> : "Dentro del rango."}</div>
    </>
  );
}
