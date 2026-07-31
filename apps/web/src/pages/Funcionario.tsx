import { useState } from "react";
import { GuideStrip, Orb } from "@/components/ui";
import { PageHead } from "@/components/kit";
import { DonutGrad } from "@/components/Charts";
import { useToast } from "@/components/Toast";
import type { EstadoOferta } from "@nexshift/contracts";

const REASONS = ["No disponible ese día", "Vengo saliendo de turno / descanso", "Motivo personal", "Distancia / traslado", "Prefiero otro turno"];
const WEEK: [string, "largo" | "noche" | "libre"][] = [["Lun", "noche"], ["Mar", "libre"], ["Mié", "libre"], ["Jue", "largo"], ["Vie", "noche"], ["Sáb", "libre"], ["Dom", "largo"]];
const SHORT = { largo: "D", noche: "N", libre: "L" };

export function Funcionario() {
  const toast = useToast();
  const [oferta, setOferta] = useState<EstadoOferta | null>("recibida");
  const [reason, setReason] = useState(REASONS[0]);
  const [avail, setAvail] = useState<Record<string, boolean>>({});

  const tracker = (state: EstadoOferta) => {
    const steps: [string, string][] = state === "rechazada" ? [["Recibida", ""], ["Rechazada", "rej"]] : [["Recibida", ""], ["Aceptada", ""], ["Pend. confirmación", ""], ["Confirmada", ""]];
    const idx = { recibida: 0, aceptada: 2, confirmada: 3, rechazada: 1 }[state];
    return (
      <div className="tracker">
        {steps.map(([lbl], i) => (
          <span key={lbl} className={`tstep ${i < idx ? "done" : i === idx ? (state === "rechazada" ? "rej" : "cur") : ""}`}>{lbl}</span>
        ))}
      </div>
    );
  };

  return (
    <div className="page">
      <PageHead eyebrow="Mi espacio" title={<>Hola, Paula <span className="thin">· tu día</span></>} />
      <GuideStrip ocurre="Tienes 1 oferta por responder · próximo turno hoy 22:00" hacer="Acepta o rechaza la oferta de cubrir un turno" siguiente="Si aceptas, tu Jefatura confirma" />

      <div className="grid g2" style={{ marginTop: 12, gridTemplateColumns: "1.2fr .8fr", alignItems: "start" }}>
        <div className="card">
          <div className="eyebrow">Te pidieron cubrir un turno · Ahora</div>
          <div style={{ fontSize: 16, fontWeight: 660, margin: "4px 0 2px" }}>Urgencias · Largo 08:00–20:00 · mañana</div>
          {oferta && tracker(oferta)}
          {oferta === "recibida" && (
            <>
              <div style={{ background: "var(--surface-2)", borderRadius: 8, padding: "9px 11px", fontSize: 12.5, color: "var(--ink2)", margin: "4px 0 12px" }}>
                <b style={{ color: "var(--ink)" }}>Por qué te llega:</b> eres elegible (habilitada en Urgencias) y estás disponible.
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                <button className="btn prim" onClick={() => { setOferta("aceptada"); toast("Oferta aceptada · esperando confirmación"); }} type="button">Aceptar el turno</button>
                <select className="field" style={{ margin: 0, padding: "8px 9px" }} value={reason} onChange={(e) => setReason(e.target.value)}>{REASONS.map((r) => <option key={r}>{r}</option>)}</select>
                <button className="btn ghost" onClick={() => { setOferta("rechazada"); toast("Oferta rechazada · motivo registrado"); }} type="button">Rechazar</button>
              </div>
            </>
          )}
          {oferta === "aceptada" && (
            <div>
              <div style={{ fontSize: 13, color: "var(--ink2)", marginBottom: 10 }}>✓ Aceptaste · pendiente de confirmación de tu Jefatura.</div>
              <button className="btn ghost" onClick={() => { setOferta("confirmada"); toast("Cobertura confirmada · el turno es tuyo"); }} type="button">Simular: tu Jefatura confirma</button>
            </div>
          )}
          {oferta === "confirmada" && <div className="banner">🎉 <span><b>Confirmada · el turno es tuyo.</b> Ya aparece en tu calendario.</span></div>}
          {oferta === "rechazada" && <div style={{ fontSize: 13, color: "var(--ink2)" }}>Tu motivo quedó registrado. Se ofrecerá a otra persona.</div>}
        </div>

        <aside className="card" style={{ textAlign: "center" }}>
          <div className="eyebrow">Mi desarrollo</div>
          <div style={{ display: "flex", justifyContent: "center", margin: "12px 0" }}><DonutGrad pct={75} size={96} label="75%" /></div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Habilitarme en UCI</div>
          <div style={{ fontSize: 11.5, color: "var(--ink2)" }}>falta 1 evaluación</div>
        </aside>
      </div>

      <div className="sect">Mi semana</div>
      <div className="card">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 5 }}>
          {WEEK.map(([d, t], i) => (
            <div key={d} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 9, color: i === 4 ? "var(--accent-ink)" : "var(--ink3)", marginBottom: 3, fontWeight: i === 4 ? 700 : 400 }}>{d}</div>
              <div className={`cell ${t}`} style={i === 4 ? { outline: "2px solid var(--accent)", outlineOffset: 1 } : undefined}>{SHORT[t]}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid g4" style={{ marginTop: 12 }}>
        {[["Mi próximo turno", "22:00", "hoy·UCI"], ["Turnos (semana)", "4", ""], ["Feriado legal", "12", "días"], ["Certificación", "1", "por vencer"]].map(([l, v, u]) => (
          <div className="card hoverable kpi" key={l}><div className="lab">{l}</div><div className="big">{v}{u && <span className="u"> {u}</span>}</div></div>
        ))}
      </div>

      <div className="sect">Ofrecer disponibilidad</div>
      <div className="card">
        <div style={{ fontSize: 12.5, color: "var(--ink2)", marginBottom: 10 }}>Elige <b>día y turno</b>. Mejora tus opciones cuando surja una brecha compatible.</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
          {["Sáb", "Dom", "Lun próx."].map((d) => (
            <div key={d} style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <span style={{ width: 62, fontSize: 12, color: "var(--ink2)" }}>{d}</span>
              {["Largo", "Noche"].map((t) => {
                const k = `${d}|${t}`;
                return <button key={t} className={`btn ${avail[k] ? "prim" : "ghost"}`} style={{ padding: "6px 11px", fontSize: 12 }} onClick={() => setAvail((a) => ({ ...a, [k]: !a[k] }))} type="button">{t}</button>;
              })}
            </div>
          ))}
        </div>
        <button className="btn prim" style={{ marginTop: 12 }} onClick={() => { const s = Object.keys(avail).filter((k) => avail[k]); toast(s.length ? `Disponibilidad registrada: ${s.map((k) => k.replace("|", " ")).join(" · ")}` : "Elige al menos un día y turno"); }} type="button">
          Ofrecer disponibilidad
        </button>
      </div>

      <div className="prio">
        <span className="pl">◉ Prioritario</span>
        <span className="pt">Responder oferta — Urgencias, mañana 08:00</span>
        <button className="btn prim" onClick={() => { setOferta("aceptada"); toast("Oferta aceptada"); }} type="button"><Orb tone="good" /> Aceptar</button>
      </div>
    </div>
  );
}
