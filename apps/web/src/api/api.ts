import type {
  Brecha,
  CandidatoNex,
  InicioResumen,
  MallaSemana,
  Perfil,
  PlannerPersona,
  PlannerRequerido,
  SolicitudAusencia,
  Turno,
} from "@nexshift/contracts";
import { db } from "./mockDb";
import { getInicioResumen } from "@/data/inicio";

/**
 * Capa de datos (contrato del cliente). HOY resuelve contra el mock en memoria
 * con una latencia simulada. MAÑANA cada función hará `fetch()` al backend
 * NestJS — la firma no cambia, así que las pantallas quedan intactas.
 */

const LATENCY = 220;
const wait = <T>(value: T, ms = LATENCY): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));

/* ---- Inicio ---- */
export const getInicio = (perfil: Perfil): Promise<InicioResumen> =>
  wait(getInicioResumen(perfil));

/* ---- Brechas ---- */
export interface FiltroBrechas {
  q?: string;
  severidad?: "todas" | "critica" | "alta" | "media";
  estado?: "todas" | "detectada" | "enGestion" | "escalada";
}
export function getBrechas(f: FiltroBrechas = {}): Promise<Brecha[]> {
  let list = db.brechas.slice();
  if (f.severidad && f.severidad !== "todas") list = list.filter((b) => b.severidad === f.severidad);
  if (f.estado && f.estado !== "todas") list = list.filter((b) => b.estado === f.estado);
  if (f.q) {
    const q = f.q.toLowerCase();
    list = list.filter((b) => (b.unidad + b.rol + b.causa + b.turno).toLowerCase().includes(q));
  }
  const rank = { critica: 0, alta: 1, media: 2, baja: 3 };
  list.sort((a, b) => rank[a.severidad] - rank[b.severidad] || b.minutosAbierta - a.minutosAbierta);
  return wait(list);
}
export const getBrecha = (id: string): Promise<Brecha | undefined> =>
  wait(db.brechas.find((b) => b.id === id));

/* ---- Coberturas ---- */
export const getCandidatos = (brechaId: string): Promise<CandidatoNex[]> => {
  const base = db.candidatos[brechaId] ?? db.candidatos.b1;
  const pesos = Object.fromEntries(db.pesosNex.map((p) => [p.clave.toLowerCase(), p.valor]));
  const mapKey: Record<string, string> = { costo: "costo", idoneidad: "idoneidad", disp: "disponibilidad", equidad: "equidad", cercania: "cercanía", continuidad: "continuidad" };
  const scored = base.map((c) => {
    let sw = 0;
    let s = 0;
    for (const f of c.factores) {
      const w = pesos[mapKey[f.clave]] ?? 10;
      sw += w;
      s += w * f.valor;
    }
    return { ...c, score: sw ? Math.round(s / sw) : c.score };
  });
  scored.sort((a, b) => b.score - a.score);
  scored.forEach((c, i) => (c.recomendado = i === 0));
  return wait(scored);
};

export function enviarOferta(brechaId: string): Promise<void> {
  const b = db.brechas.find((x) => x.id === brechaId);
  if (b) b.estado = "enGestion";
  return wait(undefined);
}
export function cerrarBrecha(brechaId: string): Promise<void> {
  const i = db.brechas.findIndex((x) => x.id === brechaId);
  if (i >= 0) db.brechas.splice(i, 1);
  return wait(undefined);
}

/* ---- Programación ---- */
export const getMalla = (): Promise<MallaSemana> => wait(db.malla);
export function publicarMalla(): Promise<void> {
  db.malla.estado = "publicada";
  return wait(undefined);
}
export function rotarCelda(personaId: string, dia: number): Promise<void> {
  const cycle: Record<Turno, Turno> = {
    largo: "noche",
    noche: "libre",
    libre: "largo",
    cambio: "libre",
    feriado: "libre",
    permiso: "libre",
    descanso: "libre",
  };
  const p = db.malla.personas.find((x) => x.id === personaId);
  if (p) {
    p.celdas[dia] = cycle[p.celdas[dia]];
    p.turnosSemana = p.celdas.filter((c) => c === "largo" || c === "noche").length;
    db.malla.estado = "borrador";
  }
  return wait(undefined, 60);
}

/* ---- Programación · planner mensual ---- */
export interface PlannerData {
  personas: PlannerPersona[];
  requerido: Record<string, PlannerRequerido>;
}
export const getPlanner = (): Promise<PlannerData> =>
  wait({
    personas: db.planner.personas as PlannerPersona[],
    requerido: db.planner.requerido,
  });

/* ---- Ausencias ---- */
export const getSolicitudes = (): Promise<SolicitudAusencia[]> => wait(db.solicitudes);
export function responderSolicitud(id: string, aprobar: boolean): Promise<void> {
  const s = db.solicitudes.find((x) => x.id === id);
  if (s) s.estado = aprobar ? "aprobada" : "rechazada";
  return wait(undefined);
}

/* ---- Analítica ---- */
export const getAnalitica = () => wait(db.analitica);

/* ---- Administración ---- */
export const getConfig = () =>
  wait({ reglas: db.reglas, pesosNex: db.pesosNex, auditoria: db.auditoria, usuarios: db.usuarios });
export function setRegla(clave: string, valor: number): Promise<void> {
  const r = db.reglas.find((x) => x.clave === clave);
  if (r && r.valor !== valor) {
    db.auditoria.unshift({ hora: nowHM(), area: "Reglas", accion: `${r.etiqueta}: ${r.valor} → ${valor}`, detalle: `Actor: Admin · ${r.propaga}` });
    r.valor = valor;
  }
  return wait(undefined, 80);
}
export function setPesoNex(clave: string, valor: number): Promise<void> {
  const p = db.pesosNex.find((x) => x.clave === clave);
  if (p) p.valor = valor;
  return wait(undefined, 60);
}

function nowHM(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
