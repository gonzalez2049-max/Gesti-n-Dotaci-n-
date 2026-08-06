import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/icons";
import { useToast } from "@/components/Toast";
import {
  DOTACION_MIN,
  MESES,
  conteoEstamentos,
  firmaElectronica,
  folioHoja,
  grupoDelTurno,
  horarioTurno,
  jefeDeTurno,
  releva09,
  rosterTurno,
} from "@/data/planner";
import type { PlannerPersona, Turno } from "@nexshift/contracts";

interface Props {
  unidad: string;
  year: number;
  month: number;
  day: number; // índice 0-based del día del mes
  personas: PlannerPersona[];
  grid: Record<string, Turno[]>;
  jefatura: string;
  soloLectura: boolean;
  onClose: () => void;
}

type Tt = "largo" | "noche";
const TT_LABEL: Record<Tt, string> = { largo: "Turno Largo · Día", noche: "Turno Noche" };
const JORNADA: Record<Tt, string> = { largo: "Jornada diurna", noche: "Jornada nocturna" };

interface Firma {
  por: string;
  codigo: string;
  firma: string;
  ts: string;
}

export function HojaDiaria({ unidad, year, month, day, personas, grid, jefatura, soloLectura, onClose }: Props) {
  const toast = useToast();
  const [turno, setTurno] = useState<Tt>("largo");
  const [firmas, setFirmas] = useState<Partial<Record<Tt, Firma>>>({});
  const [correo, setCorreo] = useState("");
  const [enviar, setEnviar] = useState(false);

  const dia1 = day + 1;
  const relevo = releva09(year, month, day);
  const fechaLarga = new Date(year, month, dia1).toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const min = DOTACION_MIN[unidad] ?? { largo: {}, noche: {} };
  const { lista, jefe, conteo, grupo } = useMemo(() => {
    const l = rosterTurno(personas, grid, unidad, day, turno);
    return { lista: l, jefe: jefeDeTurno(l), conteo: conteoEstamentos(l, min[turno] ?? {}), grupo: grupoDelTurno(day, turno) };
  }, [personas, grid, unidad, day, turno, min]);

  const folio = `${folioHoja(unidad, year, month, dia1)}-${grupo}`;
  const deficit = conteo.filter((c) => !c.ok).length;
  const cumple = deficit === 0;
  const firma = firmas[turno];

  const validar = () => {
    const ts = new Date().toLocaleString("es-CL", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
    setFirmas((f) => ({ ...f, [turno]: { por: jefatura, codigo: folio, firma: firmaElectronica(`${folio}·${jefatura}·${Date.now()}`), ts } }));
    toast(`Hoja del ${turno === "largo" ? "día" : "turno noche"} validada y firmada`);
  };

  const enviarCorreo = () => {
    if (!correo.trim()) return;
    toast(`Hoja enviada a ${correo.trim()}`);
    setEnviar(false);
    setCorreo("");
  };

  return createPortal(
    <div className="hoja-overlay" role="dialog" aria-label="Hoja de programación diaria">
      <div className="hoja-scrim" onClick={onClose} />

      <div className="hoja-bar">
        <span className="hoja-bar-t">
          <Icon name="calendar" size={15} /> Hoja diaria · {unidad} · {dia1} {MESES[month]}
        </span>
        <div className="hoja-seg" role="group" aria-label="Turno">
          <button className={turno === "largo" ? "on" : ""} onClick={() => setTurno("largo")} type="button">Largo (día)</button>
          <button className={turno === "noche" ? "on" : ""} onClick={() => setTurno("noche")} type="button">Noche</button>
        </div>
        <span style={{ flex: 1 }} />
        {enviar ? (
          <span className="hoja-mail">
            <input className="field2" type="email" placeholder="correo@hospital.cl" value={correo} onChange={(e) => setCorreo(e.target.value)} autoFocus />
            <button className="btn prim" onClick={enviarCorreo} type="button"><Icon name="send" size={13} /> Enviar</button>
            <button className="btn ghost" onClick={() => setEnviar(false)} type="button">Cancelar</button>
          </span>
        ) : (
          <>
            <button className="btn ghost" onClick={() => setEnviar(true)} type="button"><Icon name="send" size={14} /> Correo</button>
            <button className="btn ghost" onClick={() => window.print()} type="button"><Icon name="list" size={14} /> Imprimir / PDF</button>
            <button className="btn ghost" onClick={onClose} type="button">✕ Cerrar</button>
          </>
        )}
      </div>

      <div className="hoja-wrap">
        <article className="hoja">
          <header className="hoja-head">
            <div className="hoja-logo"><span className="logo" /> NEX&nbsp;Shift</div>
            <div className="hoja-title">
              <h1>Hoja de Programación Diaria</h1>
              <div className="hoja-sub">{TT_LABEL[turno]} · Unidad de {unidad} · Sede Central</div>
            </div>
            <div className="hoja-folio">
              <div className="hoja-folio-k">Folio</div>
              <div className="hoja-folio-v">{folio}</div>
            </div>
          </header>

          <div className="hoja-meta">
            <span><b>Fecha</b> {fechaLarga}</span>
            <span><b>Turno</b> <span className={`hoja-grupo t-${grupo}`}>Turno {grupo}</span></span>
            <span><b>Jornada</b> {JORNADA[turno]}</span>
            <span><b>Horario</b> {horarioTurno(turno, relevo)}{relevo ? " (relevo 09:00)" : ""}</span>
            <span><b>Jefe de turno</b> {jefe ? jefe.nombre : "— sin enfermero designado"}</span>
          </div>

          {lista.length === 0 ? (
            <div className="hoja-vacio">Sin personal asignado a este turno en la fecha seleccionada.</div>
          ) : (
            <table className="hoja-tabla">
              <thead>
                <tr>
                  <th style={{ width: 34 }}>N°</th>
                  <th>Nombre</th>
                  <th style={{ width: 130 }}>Estamento</th>
                  <th style={{ width: 96 }}>Rol</th>
                  <th style={{ width: 110 }}>Horario</th>
                </tr>
              </thead>
              <tbody>
                {lista.map((p, i) => (
                  <tr key={p.id}>
                    <td className="mono">{i + 1}</td>
                    <td>{p.nombre}</td>
                    <td>{p.estamento}</td>
                    <td>{jefe && p.id === jefe.id ? "Jefe de turno" : "—"}</td>
                    <td className="mono">{horarioTurno(turno, relevo)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <table className="hoja-dot">
            <thead>
              <tr>
                <th>Validación de dotación</th>
                {conteo.map((c) => <th key={c.estamento}>{c.estamento}</th>)}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Mínimo exigido</td>
                {conteo.map((c) => <td className="mono" key={c.estamento}>{c.min}</td>)}
              </tr>
              <tr>
                <td>Presentes</td>
                {conteo.map((c) => <td className="mono" key={c.estamento}>{c.presentes}</td>)}
              </tr>
              <tr>
                <td>Estado</td>
                {conteo.map((c) => (
                  <td key={c.estamento} className={c.ok ? "hoja-ok" : "hoja-def"}>{c.ok ? "✓ Cumple" : "⚠ Déficit"}</td>
                ))}
              </tr>
            </tbody>
          </table>

          <footer className="hoja-firma">
            <div className={`hoja-firma-estado ${cumple ? "ok" : "def"}`}>
              {cumple ? "✓ Dotación conforme a los mínimos exigidos para este turno" : `⚠ ${deficit} déficit(s) de dotación en este turno — requiere gestión`}
            </div>

            {firma ? (
              <div className="hoja-firma-box firmada">
                <div className="hoja-firma-row">
                  <div>
                    <div className="hoja-firma-k">Validado por</div>
                    <div className="hoja-firma-v">{firma.por}</div>
                    <div className="hoja-firma-rol">Jefatura de {unidad}</div>
                  </div>
                  <div>
                    <div className="hoja-firma-k">Código interno de validación</div>
                    <div className="hoja-firma-v mono">{firma.codigo}</div>
                  </div>
                  <div>
                    <div className="hoja-firma-k">Firma electrónica</div>
                    <div className="hoja-firma-sig mono">{firma.firma}</div>
                    <div className="hoja-firma-rol">Firmado {firma.ts}</div>
                  </div>
                </div>
                <div className="hoja-firma-sello"><Icon name="shield" size={13} /> Documento firmado electrónicamente · válido sin firma manuscrita</div>
              </div>
            ) : soloLectura ? (
              <div className="hoja-firma-box pendiente">
                <Icon name="clock" size={14} /> Pendiente de validación por la Jefatura de {unidad}.
              </div>
            ) : (
              <div className="hoja-firma-box pendiente">
                <div>
                  <div className="hoja-firma-k">Validado por</div>
                  <div className="hoja-firma-v">{jefatura} · Jefatura de {unidad}</div>
                </div>
                <button className="btn prim" onClick={validar} type="button">
                  <Icon name="shield" size={14} /> Validar y firmar {turno === "largo" ? "el día" : "la noche"}
                </button>
              </div>
            )}
          </footer>
        </article>
      </div>
    </div>,
    document.body,
  );
}
