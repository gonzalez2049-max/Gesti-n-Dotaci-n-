import { useState } from "react";
import { PageHead } from "@/components/kit";
import { DonutGrad } from "@/components/Charts";
import { Icon } from "@/components/icons";
import { GuiaNexBar, toneStyle } from "@/pages/home/parts";
import { useToast } from "@/components/Toast";

type Oferta = "recibida" | "aceptada" | "confirmada" | "rechazada" | "evento";
const RECHAZOS = ["No disponible ese día", "Vengo saliendo de turno / descanso", "Motivo personal", "Distancia / traslado"];
const EVENTUALIDADES = ["Estoy en vacaciones", "Con licencia médica", "Ya tomé un extra esta semana"];
const WEEK: [string, string][] = [["Lun", "N"], ["Mar", ""], ["Mié", ""], ["Jue", "L"], ["Vie", "N"], ["Sáb", ""], ["Dom", "L"]];
const CLS: Record<string, string> = { L: "largo", N: "noche", "": "libre" };

export function Funcionario() {
  const toast = useToast();
  const [oferta, setOferta] = useState<Oferta>("recibida");
  const [reason, setReason] = useState(RECHAZOS[0]);
  const [obs, setObs] = useState(EVENTUALIDADES[0]);
  const [avail, setAvail] = useState<Record<string, boolean>>({});

  const guia = {
    ocurre: "Tenés 1 oferta de cobertura por responder y tu próximo turno es hoy 20:00.",
    hacer: "Aceptá, rechazá o pedí que te consideren para otra eventualidad.",
    recomienda: "Aceptar suma +1 libre compensatorio y tu carga sigue equilibrada.",
    riesgo: "Si no respondés en 2 h, Gestión Central sigue con el siguiente.",
    siguiente: "Si aceptás, Gestión Central lo envía a tu Jefatura para confirmar.",
  };

  const stepIdx = { recibida: 0, aceptada: 1, confirmada: 3, rechazada: 0, evento: 0 }[oferta];

  return (
    <div className="page">
      <PageHead eyebrow="Mi espacio" title={<>Hola, Paula <span className="thin">· tu día</span></>} />
      <GuiaNexBar g={guia} />

      <div className="fx" style={{ marginTop: 14 }}>
        <section className="panel oferta" style={toneStyle("warn")}>
          <div className="panel-h"><Icon name="send" size={15} /> Oferta de Gestión Central</div>
          <div className="of-txt">Urgencias · Largo 08:00–20:00 · mañana</div>
          <div className="of-tags" style={{ marginTop: 8 }}>
            <span className="of-tag"><Icon name="clock" size={12} /> Responde en 2 h</span>
            <span className="of-tag acc"><Icon name="sparkles" size={12} /> +1 libre compensatorio</span>
          </div>

          <div className="flowbar" style={{ margin: "16px 0" }}>
            {["Recibida", "Aceptada", "A Jefatura", "Confirmada"].map((k, i) => (
              <div className={`flstep ${i < stepIdx || oferta === "confirmada" ? "done" : ""} ${i === stepIdx && oferta !== "confirmada" && oferta !== "rechazada" ? "cur" : ""}`} key={i}>
                <span className="flnode">{i < stepIdx || oferta === "confirmada" ? <Icon name="check" size={12} /> : i + 1}</span>
                <span className="fltxt"><b>{k}</b></span>
                {i < 3 && <span className="flline" />}
              </div>
            ))}
          </div>

          {oferta === "recibida" && (
            <div className="contact-actions">
              <button className="btn prim" onClick={() => { setOferta("aceptada"); toast("Aceptaste · Gestión Central lo envía a tu Jefatura"); }} type="button"><Icon name="check" size={14} /> Aceptar el turno</button>
              <div className="resp-group">
                <select className="field2" value={reason} onChange={(e) => setReason(e.target.value)}>{RECHAZOS.map((r) => <option key={r}>{r}</option>)}</select>
                <button className="btn ghost" onClick={() => { setOferta("rechazada"); toast("Rechazada · motivo registrado"); }} type="button">Rechazar</button>
              </div>
              <div className="resp-group">
                <select className="field2" value={obs} onChange={(e) => setObs(e.target.value)}>{EVENTUALIDADES.map((r) => <option key={r}>{r}</option>)}</select>
                <button className="btn ghost" onClick={() => { setOferta("evento"); toast("Registrado · te consideran para otra eventualidad"); }} type="button">Otra eventualidad</button>
              </div>
            </div>
          )}
          {oferta === "aceptada" && (
            <>
              <div className="aus-verdict good"><Icon name="check" size={15} /> Aceptaste · pendiente de confirmación de tu Jefatura.</div>
              <button className="btn ghost" style={{ marginTop: 10 }} onClick={() => { setOferta("confirmada"); toast("Confirmada · el turno es tuyo"); }} type="button">Simular: tu Jefatura confirma</button>
            </>
          )}
          {oferta === "confirmada" && <div className="aus-verdict good"><Icon name="check" size={15} /> Confirmada · el turno es tuyo. Ya aparece en tu calendario.</div>}
          {oferta === "rechazada" && <div className="firma-hint"><Icon name="arrow-right" size={13} /> Tu motivo quedó registrado. Gestión Central sigue con el siguiente.</div>}
          {oferta === "evento" && <div className="firma-hint"><Icon name="user" size={13} /> Registrado · te consideran para una próxima eventualidad.</div>}
        </section>

        <section className="panel bienestar" style={{ textAlign: "center" }}>
          <div className="panel-h" style={{ justifyContent: "center" }}><Icon name="graduation" size={15} /> Mi desarrollo</div>
          <div style={{ display: "flex", justifyContent: "center", margin: "8px 0 6px" }}><DonutGrad pct={75} size={104} label="75%" /></div>
          <div style={{ fontSize: 13.5, fontWeight: 640 }}>Habilitarme en UCI</div>
          <div style={{ fontSize: 11.5, color: "var(--ink2)" }}>falta 1 evaluación · valida tu Jefatura</div>
        </section>
      </div>

      <section className="panel" style={{ marginTop: 14 }}>
        <div className="panel-h"><Icon name="calendar" size={15} /> Mi semana</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6 }}>
          {WEEK.map(([d, t], i) => (
            <div key={d} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 9.5, color: i === 4 ? "var(--accent-ink)" : "var(--ink3)", marginBottom: 4, fontWeight: i === 4 ? 700 : 400 }}>{d}</div>
              <div className={`plcell ${CLS[t]}`} style={{ height: 46, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, ...(i === 4 ? { outline: "2px solid var(--accent)", outlineOffset: 1 } : {}) }}>{t}</div>
            </div>
          ))}
        </div>
      </section>

      <div className="lsr" style={{ marginTop: 14 }}>
        {[["clock", "Mi próximo turno", "20:00", "hoy · UCI"], ["pulse", "Turnos (semana)", "4", ""], ["plane", "Feriado legal", "12", "días"], ["shield", "Certificación", "1", "por vencer"]].map(([ic, l, v, u]) => (
          <div className="ls" key={l} style={toneStyle("acc")}>
            <span className="ls-ic"><Icon name={ic as never} size={14} /></span>
            <div className="ls-main">
              <div className="ls-lab">{l}</div>
              <div className="ls-val">{v}{u && <span className="ls-u"> {u}</span>}</div>
            </div>
          </div>
        ))}
      </div>

      <section className="panel" style={{ marginTop: 14 }}>
        <div className="panel-h"><Icon name="sparkles" size={15} /> Ofrecer disponibilidad</div>
        <div style={{ fontSize: 12.5, color: "var(--ink2)", marginBottom: 12 }}>Elegí <b>día y turno</b>. Mejora tus opciones cuando surja una brecha compatible.</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {["Sáb", "Dom", "Lun próx."].map((d) => (
            <div key={d} style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ width: 68, fontSize: 12.5, color: "var(--ink2)" }}>{d}</span>
              {["Largo", "Noche"].map((t) => {
                const k = `${d}|${t}`;
                return <button key={t} className={`btn ${avail[k] ? "prim" : "ghost"}`} style={{ padding: "7px 13px", fontSize: 12 }} onClick={() => setAvail((a) => ({ ...a, [k]: !a[k] }))} type="button">{t}</button>;
              })}
            </div>
          ))}
        </div>
        <button className="btn prim" style={{ marginTop: 14 }} onClick={() => { const s = Object.keys(avail).filter((k) => avail[k]); toast(s.length ? `Disponibilidad registrada: ${s.map((k) => k.replace("|", " ")).join(" · ")}` : "Elegí al menos un día y turno"); }} type="button">
          <Icon name="check" size={14} /> Ofrecer disponibilidad
        </button>
      </section>
    </div>
  );
}
