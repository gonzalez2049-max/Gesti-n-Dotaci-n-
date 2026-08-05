import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCandidatos } from "@/api/api";
import { PageHead, Skeleton } from "@/components/kit";
import { Icon } from "@/components/icons";
import { GuiaNexBar } from "@/pages/home/parts";
import { useToast } from "@/components/Toast";
import type { CandidatoNex } from "@nexshift/contracts";

type Phase = "contactar" | "contactando" | "aceptada" | "enJefatura" | "confirmada" | "sinCandidatos";
type Tone = "good" | "warn" | "crit" | "info";
const toneStyle = (t: Tone) => ({ ["--tn" as string]: `var(--${t})` });

const RECHAZOS = ["No disponible ese día", "Vengo saliendo de turno / descanso", "Motivo personal", "Distancia / traslado"];
const EVENTUALIDADES = ["En vacaciones esta semana", "Con licencia médica", "Ya tomó un extra esta semana", "Pide no ser considerado por ahora"];

interface Ev { hora: string; actor: string; titulo: string; detalle: string; tono: Tone }
function hm(min: number) {
  const base = 14 * 60 + 8 + min;
  return `${String(Math.floor(base / 60) % 24).padStart(2, "0")}:${String(base % 60).padStart(2, "0")}`;
}

const FLOW: { k: string; actor: string }[] = [
  { k: "Solicita", actor: "Jefatura" },
  { k: "Contacta", actor: "Gestión Central" },
  { k: "Responde", actor: "Funcionario" },
  { k: "Confirma", actor: "Jefatura" },
  { k: "Cubierta", actor: "—" },
];
const phaseStep: Record<Phase, number> = { contactar: 1, contactando: 2, aceptada: 3, enJefatura: 3, confirmada: 4, sinCandidatos: 2 };

export function Coberturas() {
  const toast = useToast();
  const { data, isLoading } = useQuery({ queryKey: ["cand", "b1"], queryFn: () => getCandidatos("b1") });
  const [descartados, setDescartados] = useState<Record<string, string>>({});
  const [contactado, setContactado] = useState<string | null>(null);
  const [phase, setPhase] = useState<Phase>("contactar");
  const [motivo, setMotivo] = useState(RECHAZOS[0]);
  const [obs, setObs] = useState(EVENTUALIDADES[0]);
  const [log, setLog] = useState<Ev[]>([
    { hora: hm(0), actor: "Jefatura", titulo: "Solicitud de cobertura", detalle: "UCI · Noche · hoy 20:00 · falta 1", tono: "crit" },
  ]);

  const disponibles = useMemo(() => (data ?? []).filter((c) => !descartados[c.id]), [data, descartados]);
  const cand = data?.find((c) => c.id === contactado) ?? null;
  const addLog = (e: Omit<Ev, "hora">) => setLog((l) => [{ ...e, hora: hm(l.length * 3) }, ...l]);

  const contactar = (c: CandidatoNex) => {
    setContactado(c.id);
    setPhase("contactando");
    addLog({ actor: "Gestión Central", titulo: `Contacta a ${c.nombre}`, detalle: `${c.tipoCobertura} · llamado en curso`, tono: "warn" });
  };
  const siguiente = (tipo: "rechazo" | "evento", texto: string) => {
    if (!cand) return;
    setDescartados((r) => ({ ...r, [cand.id]: texto }));
    addLog(
      tipo === "rechazo"
        ? { actor: "Funcionario", titulo: `${cand.nombre} rechazó`, detalle: `Motivo: ${texto}`, tono: "crit" }
        : { actor: "Funcionario", titulo: `${cand.nombre}: otra eventualidad`, detalle: `${texto} · considerar a futuro`, tono: "info" },
    );
    const quedan = disponibles.filter((c) => c.id !== cand.id);
    setContactado(null);
    if (quedan.length === 0) {
      setPhase("sinCandidatos");
      addLog({ actor: "Gestión Central", titulo: "Escalada a Coordinación", detalle: "Sin candidatos elegibles disponibles", tono: "crit" });
    } else {
      setPhase("contactar");
      addLog({ actor: "Gestión Central", titulo: `Sigue con ${quedan[0].nombre}`, detalle: "Siguiente en el Índice NEX", tono: "warn" });
    }
    toast(tipo === "rechazo" ? "Rechazo registrado · pasa al siguiente" : "Registrado para otra eventualidad");
  };
  const acepta = () => {
    if (!cand) return;
    setPhase("aceptada");
    addLog({ actor: "Funcionario", titulo: `${cand.nombre} aceptó`, detalle: "Disponible para el turno", tono: "good" });
    toast("Aceptó · enviá a la Jefatura para confirmar");
  };
  const enviarAJefatura = () => {
    if (!cand) return;
    setPhase("enJefatura");
    addLog({ actor: "Gestión Central", titulo: "Enviado a la Jefatura", detalle: `${cand.nombre} · pendiente de confirmación`, tono: "info" });
    toast("Enviado a la Jefatura de UCI");
  };
  const confirmar = () => {
    if (!cand) return;
    setPhase("confirmada");
    addLog({ actor: "Jefatura", titulo: "Confirmada por la Jefatura", detalle: `${cand.nombre} cubre el turno · brecha cerrada`, tono: "good" });
    toast("Cobertura confirmada · brecha cerrada");
  };
  const reset = () => {
    setDescartados({});
    setContactado(null);
    setPhase("contactar");
    setLog([{ hora: hm(0), actor: "Jefatura", titulo: "Solicitud de cobertura", detalle: "UCI · Noche · hoy 20:00 · falta 1", tono: "crit" }]);
  };

  const guia = {
    ocurre: "La Jefatura de UCI solicitó cubrir el turno noche de hoy (20:00).",
    hacer: "Contactá al #1 del Índice NEX y registrá su respuesta.",
    recomienda: `Empezar por ${data?.[0]?.nombre ?? "el #1"} — apoyo habilitado y libre.`,
    riesgo: "Si nadie acepta, se escala y la unidad abre bajo dotación.",
    siguiente: "Si acepta, se envía a la Jefatura para su confirmación final.",
    cta: "Ver Índice completo",
    ruta: "/brechas",
  };

  return (
    <div className="page">
      <PageHead
        eyebrow="Coberturas · Gestión Central de Dotación"
        title={<>Contactar y cubrir <span className="thin">— secuencial por NEX</span></>}
        actions={<button className="btn ghost" onClick={reset} type="button"><Icon name="arrow-right" size={13} /> Reiniciar</button>}
      />
      <GuiaNexBar g={guia} />

      {/* solicitud + flujo */}
      <section className="panel sol" style={toneStyle("crit")}>
        <div className="sol-head">
          <span className="sol-tag">Solicitud de la Jefatura</span>
          <span className="sol-title">UCI · Noche · hoy 20:00 · falta 1</span>
          <span className="sol-from">de José M. · Jefatura UCI</span>
        </div>
        <div className="flowbar">
          {FLOW.map((f, i) => {
            const step = phaseStep[phase];
            const done = i < step || phase === "confirmada";
            const cur = i === step && phase !== "confirmada";
            return (
              <div className={`flstep ${done ? "done" : ""} ${cur ? "cur" : ""}`} key={i}>
                <span className="flnode">{done ? <Icon name="check" size={13} /> : i + 1}</span>
                <span className="fltxt">
                  <b>{f.k}</b>
                  <small>{f.actor}</small>
                </span>
                {i < FLOW.length - 1 && <span className="flline" />}
              </div>
            );
          })}
        </div>
      </section>

      <div className="triage" style={{ marginTop: 14 }}>
        {/* ---- consola de contacto ---- */}
        <section className="panel">
          <div className="panel-h">
            <Icon name="sparkles" size={15} /> Índice NEX · contacto secuencial
          </div>

          {isLoading && <div style={{ display: "grid", gap: 8 }}>{[0, 1, 2].map((i) => <Skeleton key={i} h={64} />)}</div>}

          {phase === "contactar" && (
            <div className="foco-recos" style={{ margin: 0 }}>
              {disponibles.map((c, i) => {
                const t: Tone = c.score >= 80 ? "good" : "warn";
                return (
                  <div className={`cand ${i === 0 ? "best" : ""}`} key={c.id} style={toneStyle(t)}>
                    <span className="cand-rank">{i + 1}</span>
                    <div className="cand-info">
                      <div className="cand-name">
                        {c.nombre}
                        {i === 0 && <span className="cand-badge">NEX recomienda</span>}
                        {c.alerta && <span className="chip warn" style={{ marginLeft: 2 }}>{c.alerta}</span>}
                      </div>
                      <div className="cand-det">{c.tipoCobertura} · {c.razon} · {c.costo}</div>
                    </div>
                    <div className="cand-score" style={{ gap: 10 }}>
                      <div className="cand-bar"><span style={{ width: `${c.score}%` }} /></div>
                      <button className={`btn ${i === 0 ? "prim" : "ghost"}`} style={{ padding: "7px 12px", fontSize: 12 }} onClick={() => contactar(c)} type="button">
                        <Icon name="send" size={13} /> Contactar
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {phase === "contactando" && cand && (
            <div className="contact">
              <div className="contact-live"><span className="sala-livedot" /> Llamando a</div>
              <div className="contact-name">{cand.nombre}</div>
              <div className="contact-sub">{cand.tipoCobertura} · UCI · hoy 20:00 · responde en ≤ 30 min</div>
              <div className="contact-q">Registrá su respuesta:</div>
              <div className="contact-actions">
                <button className="btn prim" onClick={acepta} type="button"><Icon name="check" size={14} /> Acepta</button>
                <div className="resp-group">
                  <select className="field2" value={motivo} onChange={(e) => setMotivo(e.target.value)}>
                    {RECHAZOS.map((r) => <option key={r}>{r}</option>)}
                  </select>
                  <button className="btn ghost" onClick={() => siguiente("rechazo", motivo)} type="button">Rechaza</button>
                </div>
                <div className="resp-group">
                  <select className="field2" value={obs} onChange={(e) => setObs(e.target.value)}>
                    {EVENTUALIDADES.map((r) => <option key={r}>{r}</option>)}
                  </select>
                  <button className="btn ghost" onClick={() => siguiente("evento", obs)} type="button">Otra eventualidad</button>
                </div>
              </div>
            </div>
          )}

          {phase === "aceptada" && cand && (
            <div className="contact">
              <div className="contact-badge good"><Icon name="check" size={22} /></div>
              <div className="contact-name">{cand.nombre} aceptó</div>
              <div className="contact-sub">Ahora se envía a la Jefatura de UCI para su confirmación final.</div>
              <button className="btn prim" style={{ marginTop: 14 }} onClick={enviarAJefatura} type="button">
                <Icon name="send" size={14} /> Enviar a la Jefatura
              </button>
            </div>
          )}

          {phase === "enJefatura" && cand && (
            <div className="contact">
              <div className="contact-live" style={{ color: "var(--info)" }}><span className="sala-livedot" style={{ background: "var(--info)", boxShadow: "0 0 0 3px var(--info-s)" }} /> En la Jefatura</div>
              <div className="contact-name">Esperando confirmación</div>
              <div className="contact-sub">{cand.nombre} quedó a la espera de que la Jefatura de UCI confirme.</div>
              <button className="btn prim" style={{ marginTop: 14 }} onClick={confirmar} type="button">Simular: Jefatura confirma</button>
            </div>
          )}

          {phase === "confirmada" && cand && (
            <div className="contact center">
              <div className="contact-badge good lg"><Icon name="check" size={26} /></div>
              <div className="contact-name">Cobertura cubierta</div>
              <div className="contact-sub">{cand.nombre} cubre el turno · dotación UCI 5/5.</div>
              <button className="btn ghost" style={{ marginTop: 14 }} onClick={reset} type="button">Simular de nuevo</button>
            </div>
          )}

          {phase === "sinCandidatos" && (
            <div className="contact center">
              <div className="contact-badge crit lg"><Icon name="arrow-up" size={24} /></div>
              <div className="contact-name">Escalado a Coordinación</div>
              <div className="contact-sub">Ningún candidato elegible aceptó. Se notifica a la Subdirección.</div>
              <button className="btn ghost" style={{ marginTop: 14 }} onClick={reset} type="button">Reiniciar</button>
            </div>
          )}
        </section>

        {/* ---- trazabilidad ---- */}
        <aside className="panel triage-detail">
          <div className="panel-h">
            <Icon name="list" size={15} /> Trazabilidad · COB-2048
          </div>
          <ol className="trace">
            {log.map((e, i) => (
              <li className="trace-i" key={i} style={toneStyle(e.tono)}>
                <span className="trace-node" />
                <div className="trace-body">
                  <div className="trace-top">
                    <span className="trace-hora">{e.hora}</span>
                    <span className="trace-actor">{e.actor}</span>
                  </div>
                  <div className="trace-titulo">{e.titulo}</div>
                  <div className="trace-det">{e.detalle}</div>
                </div>
              </li>
            ))}
          </ol>
        </aside>
      </div>
    </div>
  );
}
