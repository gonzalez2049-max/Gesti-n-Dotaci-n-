import { useState } from "react";
import { Icon } from "@/components/icons";
import { Ring } from "@/components/Ring";
import { useToast } from "@/components/Toast";
import type { HomeFuncionario as T } from "@/data/home";
import { NarrativaHead, Timeline, toneStyle } from "./parts";

export function HomeFuncionario({ d }: { d: T }) {
  const toast = useToast();
  const [oferta, setOferta] = useState<"pend" | "ok" | "no" | "evt">("pend");

  return (
    <div className="page home-fx">
      <NarrativaHead n={d.narrativa} />

      <div className="fx">
        <section className="panel turno-hero" style={toneStyle("acc")}>
          <div className="th-glow" aria-hidden="true" />
          <div className="th-eyebrow">
            <span className="th-pulse" /> Tu próximo turno
          </div>
          <div className="th-main">
            <div className="th-when">
              <span className="th-day">{d.proximoTurno.fecha}</span>
              <span className="th-time">{d.proximoTurno.hora}</span>
            </div>
            <div className="th-info">
              <span className="th-chip tipo">{d.proximoTurno.tipo}</span>
              <span className="th-unit">
                <Icon name="pulse" size={14} /> {d.proximoTurno.unidad}
              </span>
              <span className="th-horas">{d.proximoTurno.horas} h · {d.proximoTurno.en}</span>
            </div>
          </div>
        </section>

        {d.oferta && (
          <section className="panel oferta" style={toneStyle("warn")}>
            <div className="panel-h">
              <Icon name="send" size={15} /> Oferta de Gestión Central
            </div>
            {oferta === "pend" ? (
              <>
                <div className="of-txt">{d.oferta.texto}</div>
                <div className="of-tags">
                  <span className="of-tag"><Icon name="clock" size={12} /> {d.oferta.plazo}</span>
                  <span className="of-tag acc"><Icon name="sparkles" size={12} /> {d.oferta.incentivo}</span>
                </div>
                <div className="of-actions">
                  <button className="btn prim" type="button" onClick={() => { setOferta("ok"); toast("Aceptaste · vuelve a Gestión Central para confirmar con tu Jefatura"); }}>
                    <Icon name="check" size={14} /> Aceptar
                  </button>
                  <button className="btn ghost" type="button" onClick={() => { setOferta("no"); toast("Rechazada · Gestión Central sigue con el siguiente"); }}>
                    Rechazar
                  </button>
                  <button className="btn ghost" type="button" onClick={() => { setOferta("evt"); toast("Registrado · te consideran para otra eventualidad"); }}>
                    Otra eventualidad
                  </button>
                </div>
              </>
            ) : (
              <div className="of-done">
                <span className={`of-badge ${oferta === "ok" ? "ok" : "no"}`}>
                  <Icon name={oferta === "ok" ? "check" : "arrow-right"} size={22} />
                </span>
                <div>
                  {oferta === "ok"
                    ? "Aceptada — Gestión Central la envía a tu Jefatura para confirmar."
                    : oferta === "evt"
                      ? "Registrado — te consideran para una próxima eventualidad."
                      : "Rechazada — gracias por responder."}
                </div>
              </div>
            )}
          </section>
        )}
      </div>

      <div className="focorow">
        <section className="panel bienestar" style={toneStyle(d.bienestar.tono)}>
          <div className="panel-h">
            <Icon name="pulse" size={15} /> Tu carga este mes
          </div>
          <div className="bien">
            <Ring pct={d.bienestar.carga} size={92} label={`${d.bienestar.turnosMes}`} />
            <div className="bien-side">
              <div className="bien-msg">{d.bienestar.mensaje}</div>
              <div className="bien-stats">
                <span><b>{d.bienestar.turnosMes}</b> turnos</span>
                <span><b>{d.bienestar.noches}</b> noches</span>
                <span><b>{d.bienestar.libres}</b> libres</span>
              </div>
            </div>
          </div>
        </section>

        <Timeline eventos={d.timeline} titulo="Tu semana" />
      </div>
    </div>
  );
}
