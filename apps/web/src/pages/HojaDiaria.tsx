import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/icons";
import { useToast } from "@/components/Toast";
import {
  DOTACION_MIN,
  MESES,
  TURNO_LABEL,
  conteoEstamentos,
  firmaElectronica,
  folioHoja,
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

const JORNADA: Record<"largo" | "noche", string> = { largo: "Jornada diurna", noche: "Jornada nocturna" };

interface Firma {
  por: string;
  codigo: string;
  firma: string;
  ts: string;
}

export function HojaDiaria({ unidad, year, month, day, personas, grid, jefatura, soloLectura, onClose }: Props) {
  const toast = useToast();
  const [firma, setFirma] = useState<Firma | null>(null);
  const [correo, setCorreo] = useState("");
  const [enviar, setEnviar] = useState(false);

  const dia1 = day + 1;
  const relevo = releva09(year, month, day);
  const folio = folioHoja(unidad, year, month, dia1);
  const fechaLarga = new Date(year, month, dia1).toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const min = DOTACION_MIN[unidad] ?? { largo: {}, noche: {} };
  const turnos = useMemo(
    () =>
      (["largo", "noche"] as const).map((t) => {
        const lista = rosterTurno(personas, grid, unidad, day, t);
        return { turno: t, lista, jefe: jefeDeTurno(lista), conteo: conteoEstamentos(lista, min[t] ?? {}) };
      }),
    [personas, grid, unidad, day, min],
  );

  const totalDeficit = turnos.reduce((a, s) => a + s.conteo.filter((c) => !c.ok).length, 0);
  const cumple = totalDeficit === 0;

  const validar = () => {
    const ts = new Date().toLocaleString("es-CL", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
    setFirma({ por: jefatura, codigo: folio, firma: firmaElectronica(`${folio}·${jefatura}·${Date.now()}`), ts });
    toast("Hoja validada y firmada electrónicamente");
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
        <span style={{ flex: 1 }} />
        {enviar ? (
          <span className="hoja-mail">
            <input
              className="field2"
              type="email"
              placeholder="correo@hospital.cl"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              autoFocus
            />
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
          {/* encabezado */}
          <header className="hoja-head">
            <div className="hoja-logo"><span className="logo" /> NEX&nbsp;Shift</div>
            <div className="hoja-title">
              <h1>Hoja de Programación Diaria</h1>
              <div className="hoja-sub">Unidad de {unidad} · Sede Central</div>
            </div>
            <div className="hoja-folio">
              <div className="hoja-folio-k">Folio</div>
              <div className="hoja-folio-v">{folio}</div>
            </div>
          </header>

          <div className="hoja-meta">
            <span><b>Fecha</b> {fechaLarga}</span>
            <span><b>Jornada</b> {relevo ? "Fin de semana / festivo (relevo 09:00)" : "Día hábil"}</span>
            <span><b>Turnos</b> Diurno y Nocturno</span>
          </div>

          {/* secciones por turno */}
          {turnos.map(({ turno, lista, jefe, conteo }) => (
            <section className="hoja-turno" key={turno}>
              <div className="hoja-turno-h">
                <span className="hoja-turno-t">{TURNO_LABEL[turno]}</span>
                <span className="hoja-turno-j">{JORNADA[turno]}</span>
                <span className="hoja-turno-hr">{horarioTurno(turno, relevo)}</span>
                <span style={{ flex: 1 }} />
                <span className="hoja-lider">
                  Jefe de turno: <b>{jefe ? jefe.nombre : "—"}</b>
                </span>
              </div>

              {lista.length === 0 ? (
                <div className="hoja-vacio">Sin personal asignado a este turno.</div>
              ) : (
                <table className="hoja-tabla">
                  <thead>
                    <tr>
                      <th style={{ width: 34 }}>N°</th>
                      <th>Nombre</th>
                      <th style={{ width: 130 }}>Estamento</th>
                      <th style={{ width: 90 }}>Rol</th>
                      <th style={{ width: 110 }}>Horario</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lista.map((p, i) => (
                      <tr key={p.id}>
                        <td className="mono">{i + 1}</td>
                        <td>{p.nombre}</td>
                        <td>{p.estamento}</td>
                        <td>{jefe && p.id === jefe.id ? "Jefe de turno" : p.lider ? "Líder" : "—"}</td>
                        <td className="mono">{horarioTurno(turno, relevo)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {/* validación de dotación por estamento */}
              <table className="hoja-dot">
                <thead>
                  <tr>
                    <th>Validación de dotación</th>
                    {conteo.map((c) => (
                      <th key={c.estamento}>{c.estamento}</th>
                    ))}
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
                      <td key={c.estamento} className={c.ok ? "hoja-ok" : "hoja-def"}>
                        {c.ok ? "✓ Cumple" : "⚠ Déficit"}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </section>
          ))}

          {/* validación / firma */}
          <footer className="hoja-firma">
            <div className={`hoja-firma-estado ${cumple ? "ok" : "def"}`}>
              {cumple ? "✓ Dotación conforme a los mínimos exigidos" : `⚠ ${totalDeficit} déficit(s) de dotación — requiere gestión`}
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
                  <Icon name="shield" size={14} /> Validar y firmar
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
