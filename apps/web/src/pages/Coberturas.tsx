import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCandidatos } from "@/api/api";
import { GuideStrip } from "@/components/ui";
import { PageHead, Skeleton } from "@/components/kit";
import { useToast } from "@/components/Toast";
import type { CandidatoNex } from "@nexshift/contracts";

const REASONS = ["No disponible ese día", "Vengo saliendo de turno / descanso", "Motivo personal", "Distancia / traslado", "Prefiero otro turno"];
type Phase = "select" | "waiting" | "accepted" | "confirmed" | "escalated";
interface Ev { hora: string; titulo: string; detalle: string }

function hm(min: number) {
  const base = 21 * 60 + 38 + min;
  return `${String(Math.floor(base / 60) % 24).padStart(2, "0")}:${String(base % 60).padStart(2, "0")}`;
}

export function Coberturas() {
  const toast = useToast();
  const { data, isLoading } = useQuery({ queryKey: ["cand", "b1"], queryFn: () => getCandidatos("b1") });
  const [rejected, setRejected] = useState<Record<string, string>>({});
  const [offered, setOffered] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("select");
  const [reason, setReason] = useState(REASONS[0]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [log, setLog] = useState<Ev[]>([{ hora: hm(0), titulo: "Brecha detectada", detalle: "UCI · Noche · falta 1" }]);

  const available = useMemo(() => (data ?? []).filter((c) => !rejected[c.id]), [data, rejected]);
  const offeredCand = data?.find((c) => c.id === offered) ?? null;
  const addLog = (e: Omit<Ev, "hora">) => setLog((l) => [...l, { ...e, hora: hm(l.length * 2) }]);

  const send = (c: CandidatoNex) => {
    setOffered(c.id);
    setPhase("waiting");
    addLog({ titulo: "Oferta enviada", detalle: `${c.nombre} · ${c.tipoCobertura}` });
  };
  const reject = () => {
    if (!offeredCand) return;
    setRejected((r) => ({ ...r, [offeredCand.id]: reason }));
    addLog({ titulo: `${offeredCand.nombre} rechazó`, detalle: `Motivo: ${reason}` });
    const next = available.filter((c) => c.id !== offeredCand.id);
    setOffered(null);
    if (next.length === 0) {
      setPhase("escalated");
      addLog({ titulo: "Escalada a Coordinación", detalle: "Sin candidatos viables" });
    } else {
      setPhase("select");
      addLog({ titulo: "Nueva búsqueda", detalle: "Reordena candidatos elegibles" });
    }
    toast("Oferta rechazada · motivo registrado");
  };
  const accept = () => {
    if (!offeredCand) return;
    setPhase("accepted");
    addLog({ titulo: `${offeredCand.nombre} aceptó`, detalle: "Pendiente de confirmación" });
    toast("Oferta aceptada · esperando confirmación");
  };
  const confirm = () => {
    if (!offeredCand) return;
    setPhase("confirmed");
    addLog({ titulo: "Confirmada por la Jefatura", detalle: "Asignación creada · brecha cerrada" });
    toast("Cobertura confirmada · brecha cerrada");
  };
  const reset = () => {
    setRejected({});
    setOffered(null);
    setPhase("select");
    setLog([{ hora: hm(0), titulo: "Brecha detectada", detalle: "UCI · Noche · falta 1" }]);
  };

  return (
    <div className="page">
      <PageHead eyebrow="Coberturas" title={<>El mejor candidato <span className="thin">y por qué</span></>} actions={<button className="btn ghost" onClick={reset} type="button">↺ Reiniciar</button>} />
      <GuideStrip ocurre="UCI · hoy 22:00 · falta 1" hacer="Enviá la oferta al #1 del Índice NEX" siguiente="Si rechaza, va al #2 (secuencial)" />
      <div className="banner" style={{ marginTop: 12 }}>🧭 <span>Solo candidatos elegibles. El <b>Índice NEX</b> ordena; no filtra.</span></div>

      <div className="grid g2" style={{ marginTop: 12, gridTemplateColumns: "1.5fr .9fr", alignItems: "start" }}>
        <div>
          {isLoading && [0, 1, 2].map((i) => <Skeleton key={i} h={70} style={{ marginBottom: 9 }} />)}

          {phase === "select" &&
            available.map((c, i) => (
              <div key={c.id} className="card hoverable" style={{ marginBottom: 9 }}>
                <div className="candrow">
                  <span className={`score${i > 0 ? " dim" : ""}`}>{c.score}</span>
                  <div>
                    <div style={{ fontWeight: 640 }}>{c.nombre} {c.recomendado && <span className="chip acc" style={{ marginLeft: 4 }}>⭐ recomendado</span>}{c.alerta && <span className="chip warn" style={{ marginLeft: 4 }}>{c.alerta}</span>}</div>
                    <div style={{ fontSize: 11.5, color: "var(--ink2)", marginTop: 1 }}>{c.tipoCobertura} · {c.razon} · <b>{c.costo}</b></div>
                    {expanded === c.id && (
                      <div style={{ marginTop: 10 }}>
                        {c.factores.map((f) => (
                          <div className="factorbar" key={f.clave}>
                            <span className="bt">{f.etiqueta}</span>
                            <span className="bar"><i style={{ width: `${f.valor}%` }} /></span>
                            <span className="bv">{f.valor}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <button className="btn ghost" style={{ marginTop: 8, padding: "5px 10px", fontSize: 11.5 }} onClick={() => setExpanded(expanded === c.id ? null : c.id)} type="button">
                      {expanded === c.id ? "Ocultar desglose" : "Ver desglose por factor"}
                    </button>
                  </div>
                  <button className={`btn ${i === 0 ? "prim" : "ghost"}`} onClick={() => send(c)} type="button">Enviar oferta</button>
                </div>
              </div>
            ))}

          {phase === "waiting" && offeredCand && (
            <div className="card">
              <div className="eyebrow">Esperando respuesta</div>
              <div style={{ fontSize: 16, fontWeight: 640, margin: "6px 0 2px" }}>{offeredCand.nombre}</div>
              <div style={{ fontSize: 12.5, color: "var(--ink2)" }}>Oferta enviada · UCI · hoy 22:00 · responde antes de 30 min</div>
              <div style={{ marginTop: 14, borderTop: "1px dashed var(--hairline)", paddingTop: 14 }}>
                <div className="eyebrow" style={{ marginBottom: 10 }}>Simular respuesta</div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                  <button className="btn prim" onClick={accept} type="button">Aceptar</button>
                  <select className="field" style={{ padding: "8px 9px", margin: 0 }} value={reason} onChange={(e) => setReason(e.target.value)}>
                    {REASONS.map((r) => <option key={r}>{r}</option>)}
                  </select>
                  <button className="btn ghost" onClick={reject} type="button">Rechazar</button>
                </div>
              </div>
            </div>
          )}

          {phase === "accepted" && offeredCand && (
            <div className="card">
              <div className="tracker">
                <span className="tstep done">Recibida</span>·<span className="tstep cur">Aceptada</span>·<span className="tstep">Pend. confirmación</span>·<span className="tstep">Confirmada</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 640 }}>{offeredCand.nombre} aceptó</div>
              <div style={{ fontSize: 12.5, color: "var(--ink2)", margin: "2px 0 12px" }}>Pendiente de tu confirmación (validación humana).</div>
              <button className="btn prim" onClick={confirm} type="button">Confirmar reemplazo</button>
            </div>
          )}

          {phase === "confirmed" && offeredCand && (
            <div className="card" style={{ textAlign: "center", padding: 22 }}>
              <div style={{ fontSize: 30 }}>🎉</div>
              <div style={{ fontSize: 16, fontWeight: 660, marginTop: 6 }}>Brecha cerrada</div>
              <div style={{ fontSize: 12.5, color: "var(--ink2)" }}>{offeredCand.nombre} cubre el turno · dotación 5/5.</div>
              <button className="btn ghost" style={{ marginTop: 12 }} onClick={reset} type="button">↺ Simular de nuevo</button>
            </div>
          )}

          {phase === "escalated" && (
            <div className="card" style={{ textAlign: "center", padding: 22 }}>
              <div style={{ fontSize: 26 }}>↥</div>
              <div style={{ fontSize: 16, fontWeight: 660, marginTop: 6 }}>Escalado a Coordinación</div>
              <div style={{ fontSize: 12.5, color: "var(--ink2)" }}>Ningún candidato elegible aceptó.</div>
              <button className="btn ghost" style={{ marginTop: 12 }} onClick={reset} type="button">↺ Reiniciar</button>
            </div>
          )}
        </div>

        <aside className="card" style={{ position: "sticky", top: 14 }}>
          <div className="eyebrow">Trazabilidad · COB-2048</div>
          <div style={{ marginTop: 12 }}>
            {log.map((e, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "14px 1fr", gap: 9, paddingBottom: 11 }}>
                <span className="orb good" style={{ width: 9, height: 9, marginTop: 4 }} />
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--ink3)" }}>{e.hora}</div>
                  <div style={{ fontSize: 12, fontWeight: 560 }}>{e.titulo}</div>
                  <div style={{ fontSize: 11.5, color: "var(--ink2)" }}>{e.detalle}</div>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
