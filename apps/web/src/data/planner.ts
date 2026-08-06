import type { PlannerPersona, PlannerRequerido, Turno } from "@nexshift/contracts";

export const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];
export const DOW = ["D", "L", "M", "M", "J", "V", "S"];

/** Ciclo base de cuarto turno: Largo → Noche → Libre → Libre. */
const CICLO: Turno[] = ["largo", "noche", "libre", "libre"];

/** Los 4 turnos rotativos del cuarto turno. Cada persona pertenece a uno
 *  (según su fase de rotación); el personal de Apoyo flota, sin turno fijo. */
export const TURNOS = ["A", "B", "C", "D"] as const;
export function turnoDe(p: { patronOffset: number; equipo: string }): string {
  return p.equipo === "Apoyo" ? "Apoyo" : TURNOS[p.patronOffset % 4];
}

/** Letra del turno (A/B/C/D) del grupo que cubre un turno (largo/noche) ese día.
 *  En el ciclo, largo = fase 0 y noche = fase 1. */
export function grupoDelTurno(dia: number, turno: "largo" | "noche"): string {
  const fase = turno === "largo" ? 0 : 1;
  return TURNOS[(((fase - dia) % 4) + 4) % 4];
}

/** Festivos (demo). Clave "año-mes" (mes 0-based) → días 1-based del mes.
 *  Agosto 2026: 15 · Asunción de la Virgen. */
const FESTIVOS: Record<string, number[]> = {
  "2026-7": [15],
};
export function esFestivo(year: number, month: number, dia1: number): boolean {
  return (FESTIVOS[`${year}-${month}`] ?? []).includes(dia1);
}
/** En fin de semana y festivos el relevo de la mañana se corre a las 09:00. */
export function releva09(year: number, month: number, dia0: number): boolean {
  const dow = new Date(year, month, dia0 + 1).getDay();
  return dow === 0 || dow === 6 || esFestivo(year, month, dia0 + 1);
}

/** Horario de cada turno del cuarto turno.
 *  Día hábil:  Largo 08:00–20:00 · Noche 20:00–08:00 (12 h).
 *  Fin de semana y festivos: el relevo de la mañana pasa a las 09:00, así
 *  que el Largo ENTRA 09:00 y la Noche SALE 09:00. */
export function horarioTurno(t: Turno, relevo09: boolean): string {
  if (t === "largo") return relevo09 ? "09:00–20:00" : "08:00–20:00";
  if (t === "noche") return relevo09 ? "20:00–09:00" : "20:00–08:00";
  return "";
}

export function diasDelMes(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}
export function primerDow(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

/** Ausencias de ejemplo (vacaciones/licencias) que crean déficits reales
 *  para demostrar alertas y déficits. [díaInicio, díaFin] 0-based. */
const AUSENCIAS: Record<string, [number, number]> = {
  u02: [3, 7], // Turno A · enfermero · vacaciones
  u13: [14, 18], // Turno B · enfermero · licencia
  u28: [9, 11], // Turno C · TENS
  f9: [6, 9], // Rocío S. · Urgencias
};

/** Marcas especiales de ejemplo para mostrar los tipos de celda. [día0-based, tipo]. */
const ESPECIALES: Record<string, [number, Turno][]> = {
  u03: [[13, "cambio"]], // cambio de turno
  u14: [[16, "feriado"]], // feriado legal
  u25: [[19, "permiso"]], // permiso administrativo
  u36: [[23, "descanso"]], // descanso compensatorio
};

/** Genera la malla base del mes desde el patrón + desfase de cada persona. */
export function generarGrid(personas: PlannerPersona[], year: number, month: number): Record<string, Turno[]> {
  const n = diasDelMes(year, month);
  const grid: Record<string, Turno[]> = {};
  for (const p of personas) {
    grid[p.id] = Array.from({ length: n }, (_, d) => CICLO[(d + p.patronOffset) % 4]);
    const aus = AUSENCIAS[p.id];
    if (aus) {
      for (let d = aus[0]; d <= Math.min(aus[1], n - 1); d++) grid[p.id][d] = "libre";
    }
    for (const [d, t] of ESPECIALES[p.id] ?? []) {
      if (d < n) grid[p.id][d] = t;
    }
  }
  return grid;
}

export interface Cobertura {
  largo: number;
  noche: number;
  defLargo: number; // requerido - largo (positivo = déficit)
  defNoche: number;
}
export function coberturaDia(grid: Record<string, Turno[]>, ids: string[], dia: number, req: PlannerRequerido): Cobertura {
  let largo = 0;
  let noche = 0;
  for (const id of ids) {
    const t = grid[id]?.[dia];
    if (t === "largo") largo++;
    else if (t === "noche") noche++;
  }
  return { largo, noche, defLargo: req.largo - largo, defNoche: req.noche - noche };
}

export function turnosDelMes(celdas: Turno[] | undefined): number {
  return (celdas ?? []).filter((t) => t === "largo" || t === "noche" || t === "cambio").length;
}
export function nochesDelMes(celdas: Turno[] | undefined): number {
  return (celdas ?? []).filter((t) => t === "noche").length;
}

/* ---------------- Hoja de programación diaria ---------------- */

/** Orden y etiqueta corta de estamentos para la hoja diaria. */
export const EST_ORDEN = ["Enfermero/a", "TENS", "Auxiliar", "Matrón/a"] as const;
export const EST_CORTO: Record<string, string> = {
  "Enfermero/a": "Enf.",
  TENS: "TENS",
  Auxiliar: "Aux.",
  "Matrón/a": "Matrón",
};

/** Dotación mínima exigida por unidad y turno, por estamento.
 *  La Jefatura valida la hoja contra estos mínimos. */
export const DOTACION_MIN: Record<string, Record<"largo" | "noche", Record<string, number>>> = {
  UCI: {
    largo: { "Enfermero/a": 4, TENS: 3, Auxiliar: 1 },
    noche: { "Enfermero/a": 3, TENS: 2, Auxiliar: 1 },
  },
  Urgencias: {
    largo: { "Enfermero/a": 2, TENS: 1 },
    noche: { "Enfermero/a": 1, TENS: 1 },
  },
  "Pabellón": {
    largo: { "Enfermero/a": 1, "Matrón/a": 1 },
    noche: { "Enfermero/a": 1 },
  },
};

export interface PersonaTurno {
  id: string;
  nombre: string;
  estamento: string;
  unidad: string;
  equipo: string;
  lider?: boolean;
}

/** Personal de una unidad que trabaja un turno (largo/noche) en un día. */
export function rosterTurno<T extends PersonaTurno>(
  personas: T[],
  grid: Record<string, Turno[]>,
  unidad: string,
  dia: number,
  turno: "largo" | "noche",
): T[] {
  const orden = (e: string) => {
    const i = EST_ORDEN.indexOf(e as (typeof EST_ORDEN)[number]);
    return i < 0 ? 99 : i;
  };
  return personas
    .filter((p) => p.unidad === unidad && grid[p.id]?.[dia] === turno)
    .sort((a, b) => orden(a.estamento) - orden(b.estamento) || a.nombre.localeCompare(b.nombre));
}

/** Jefe de turno: el líder presente; si no hay, el primer enfermero.
 *  Si no hay enfermero en el turno, no hay jefe designado (déficit de liderazgo). */
export function jefeDeTurno<T extends PersonaTurno>(lista: T[]): T | null {
  return lista.find((p) => p.lider && p.estamento === "Enfermero/a") ?? lista.find((p) => p.estamento === "Enfermero/a") ?? null;
}

/** Cuenta por estamento y compara con el mínimo exigido. */
export function conteoEstamentos(
  lista: PersonaTurno[],
  min: Record<string, number>,
): { estamento: string; min: number; presentes: number; ok: boolean }[] {
  const claves = Array.from(new Set([...Object.keys(min), ...lista.map((p) => p.estamento)]));
  claves.sort((a, b) => EST_ORDEN.indexOf(a as never) - EST_ORDEN.indexOf(b as never));
  return claves.map((e) => {
    const presentes = lista.filter((p) => p.estamento === e).length;
    const m = min[e] ?? 0;
    return { estamento: e, min: m, presentes, ok: presentes >= m };
  });
}

const SIGLA: Record<string, string> = { UCI: "UCI", Urgencias: "URG", "Pabellón": "PAB" };
/** Folio / código interno de validación: HPD-<UNIDAD>-<AAAAMMDD>. */
export function folioHoja(unidad: string, year: number, month: number, dia1: number): string {
  const mm = String(month + 1).padStart(2, "0");
  const dd = String(dia1).padStart(2, "0");
  return `HPD-${SIGLA[unidad] ?? unidad.slice(0, 3).toUpperCase()}-${year}${mm}${dd}`;
}

/** Firma electrónica simulada: hash corto y estable de la semilla de validación. */
export function firmaElectronica(seed: string): string {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const hex = (h >>> 0).toString(16).toUpperCase().padStart(8, "0");
  return `${hex.slice(0, 4)}-${hex.slice(4)}`;
}

export const SHORT: Record<Turno, string> = {
  largo: "L",
  noche: "N",
  libre: "",
  cambio: "CT",
  feriado: "FL",
  permiso: "PA",
  descanso: "DC",
};
export const TURNO_LABEL: Record<Turno, string> = {
  largo: "Largo",
  noche: "Noche",
  libre: "Libre",
  cambio: "Cambio de turno",
  feriado: "Feriado legal",
  permiso: "Permiso administrativo",
  descanso: "Descanso compensatorio",
};
/** Orden para el editor de celda. */
export const TURNOS_EDIT: Turno[] = ["largo", "noche", "cambio", "descanso", "permiso", "feriado", "libre"];
export const TURNO_HORAS: Record<Turno, number> = { largo: 12, noche: 12, libre: 0, cambio: 12, feriado: 0, permiso: 0, descanso: 0 };
