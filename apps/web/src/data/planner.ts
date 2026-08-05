import type { NexRec, PlannerPersona, PlannerRequerido, Turno } from "@nexshift/contracts";

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

export function diasDelMes(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}
export function primerDow(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

/** Ausencias de ejemplo (vacaciones/licencias) que crean déficits reales
 *  para demostrar alertas y recomendaciones NEX. [díaInicio, díaFin] 0-based. */
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

/** Recomendaciones NEX para cubrir un déficit de (día, turno) — en tiempo real. */
export function nexRecs(
  personas: PlannerPersona[],
  grid: Record<string, Turno[]>,
  dia: number,
  _turno: "largo" | "noche",
): NexRec[] {
  const recs: NexRec[] = [];
  const libres = personas.filter((p) => grid[p.id]?.[dia] === "libre");
  const conCarga = libres
    .map((p) => ({ p, carga: turnosDelMes(grid[p.id]), hab: p.habilitado }))
    .sort((a, b) => a.carga - b.carga);

  for (const { p, carga, hab } of conCarga) {
    if (!hab) continue; // elegibilidad dura: no habilitados no aparecen
    const cargaScore = Math.max(0, 100 - carga * 4);
    const apoyo = p.equipo === "Apoyo";
    const esHoraExtra = carga >= 15;
    recs.push({
      id: p.id,
      tipo: esHoraExtra ? "horaExtra" : apoyo ? "reemplazo" : "reasignacion",
      nombre: p.nombre,
      detalle: esHoraExtra
        ? `Hora extra · ${carga} turnos este mes`
        : apoyo
          ? `Equipo de apoyo · ${carga} turnos · sin costo extra`
          : `${p.equipo} · ${carga} turnos · reasignación`,
      score: Math.round((apoyo ? 8 : esHoraExtra ? -10 : 0) + cargaScore * 0.9 + (hab ? 8 : 0)),
      costoTono: esHoraExtra ? "warn" : "good",
    });
  }
  recs.sort((a, b) => b.score - a.score);
  return recs.slice(0, 4);
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
