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
  f1: [3, 7], // Ana G. · UCI
  f4: [14, 18], // Elena R. · UCI
  f7: [9, 11], // Sofía D. · UCI
  f9: [6, 9], // Rocío S. · Urgencias
};

/** Marcas especiales de ejemplo para mostrar los tipos de celda. [día0-based, tipo]. */
const ESPECIALES: Record<string, [number, Turno][]> = {
  f2: [[13, "cambio"]], // cambio de turno
  f3: [[16, "feriado"]], // feriado legal
  f5: [[19, "permiso"]], // permiso administrativo
  f6: [[23, "descanso"]], // descanso compensatorio
  f8: [[27, "cambio"]],
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
