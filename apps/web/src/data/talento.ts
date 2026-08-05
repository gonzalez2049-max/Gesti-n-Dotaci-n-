import type { Tono } from "@/data/home";

/**
 * Talento clínico — dos instrumentos separados (validado con el usuario):
 *
 * 1) NIVEL BENNER GLOBAL de la persona (Patricia Benner, "De novato a experto"):
 *    estadio holístico del profesional (I–V). Describe su desarrollo general,
 *    no una habilidad puntual.
 *
 * 2) MATRIZ DE COMPETENCIAS por habilidad clínica, con su PROPIA escala y
 *    rúbrica (no es Benner). Cada competencia se evalúa con criterios y
 *    evidencia. Umbral de habilitación = COMPETENTE (III): desde ahí la persona
 *    puede desempeñarse sin supervisión y queda ELEGIBLE en el Índice NEX.
 */

/* ---------- 1) Benner global (persona) ---------- */
export interface BennerNivel { n: number; nombre: string; corto: string; tono: Tono; desc: string }
export const BENNER: BennerNivel[] = [
  { n: 1, nombre: "Novato", corto: "I", tono: "crit", desc: "Sin experiencia; se guía por reglas y requiere apoyo constante." },
  { n: 2, nombre: "Principiante avanzado", corto: "II", tono: "warn", desc: "Desempeño aceptable con apoyo; reconoce situaciones recurrentes." },
  { n: 3, nombre: "Competente", corto: "III", tono: "info", desc: "Planifica de forma consciente y deliberada; 2–3 años de práctica." },
  { n: 4, nombre: "Proficiente", corto: "IV", tono: "acc", desc: "Percibe la situación como un todo; anticipa y prioriza." },
  { n: 5, nombre: "Experto", corto: "V", tono: "good", desc: "Dominio intuitivo; referente clínico, ya no depende de reglas." },
];
export const bennerDe = (n: number): BennerNivel => BENNER[Math.max(0, Math.min(4, n - 1))];

/* ---------- 2) Escala de competencia (por habilidad, con rúbrica) ---------- */
export interface CompNivel { n: number; nombre: string; corto: string; tono: Tono; rubrica: string; criterio: string }
export const COMP_NIVELES: CompNivel[] = [
  { n: 1, nombre: "No habilitado", corto: "I", tono: "crit", rubrica: "No ejecuta la competencia de forma segura. Formación teórica inicial o sin evidencia.", criterio: "Sin evaluación de desempeño aprobada." },
  { n: 2, nombre: "En desarrollo", corto: "II", tono: "warn", rubrica: "Ejecuta con supervisión directa. Conoce el procedimiento pero aún no es autónoma.", criterio: "Curso teórico aprobado + práctica supervisada iniciada." },
  { n: 3, nombre: "Competente", corto: "III", tono: "info", rubrica: "Ejecuta de forma autónoma y segura. Decide en situaciones estándar sin supervisión.", criterio: "Evaluación de desempeño aprobada + ≥ 20 turnos autónomos + V°B° de BPC." },
  { n: 4, nombre: "Experta", corto: "IV", tono: "good", rubrica: "Referente clínico. Resuelve casos complejos, enseña y actualiza protocolos.", criterio: "Competente + ≥ 2 años en la competencia + rol docente / mejora de protocolos." },
];
export const compDe = (n: number): CompNivel => COMP_NIVELES[Math.max(0, Math.min(3, n - 1))];
export const UMBRAL_HABILITADO = 3; // Competente (III)
export const habilitada = (n: number): boolean => n >= UMBRAL_HABILITADO;

/* ---------- Competencias (set clínico propuesto para UCI) ---------- */
export interface Competencia { corto: string; nombre: string; def: string }
export const COMPETENCIAS: Competencia[] = [
  { corto: "VMI", nombre: "Ventilación mecánica invasiva", def: "Programación, vigilancia y destete del paciente en VMI." },
  { corto: "DVA", nombre: "Drogas vasoactivas", def: "Preparación, titulación y monitoreo seguro de drogas vasoactivas." },
  { corto: "MH", nombre: "Monitoreo hemodinámico", def: "Instalación asistida e interpretación de monitoreo invasivo/no invasivo." },
  { corto: "VA", nombre: "Vía aérea avanzada", def: "Asistencia en intubación, manejo de TET/TQT y aspiración segura." },
  { corto: "RCP", nombre: "RCP avanzado (ACLS)", def: "Algoritmos ACLS, desfibrilación y liderazgo del paro cardiorrespiratorio." },
];

export interface PersonaComp { nombre: string; estamento: string; benner: number; comp: number[] }
export const EQUIPO: PersonaComp[] = [
  { nombre: "Ana G.", estamento: "Enfermero/a", benner: 5, comp: [4, 4, 4, 3, 4] },
  { nombre: "Carla M.", estamento: "Enfermero/a", benner: 4, comp: [3, 3, 3, 3, 4] },
  { nombre: "Diego P.", estamento: "Enfermero/a", benner: 3, comp: [3, 2, 2, 2, 3] },
  { nombre: "Elena R.", estamento: "Enfermero/a", benner: 4, comp: [3, 3, 2, 3, 3] },
  { nombre: "Luis A.", estamento: "TENS", benner: 3, comp: [2, 2, 2, 1, 3] },
  { nombre: "Paula R.", estamento: "Enfermero/a", benner: 2, comp: [2, 1, 2, 2, 3] },
  { nombre: "Sofía D.", estamento: "TENS", benner: 3, comp: [2, 2, 3, 2, 3] },
];

/** Resultado operativo: por competencia, cuántos habilitados (III+) hay en la unidad. */
export function coberturaCompetencias() {
  return COMPETENCIAS.map((c, i) => {
    const hab = EQUIPO.filter((p) => habilitada(p.comp[i])).length;
    return { ...c, idx: i, hab, total: EQUIPO.length, tono: (hab <= 2 ? "crit" : hab <= 3 ? "warn" : "good") as Tono };
  });
}

/* ---------- Plan: avanzar una competencia a Competente = habilitación ---------- */
export interface AccionPlan { id: string; tipo: string; nombre: string; responsable: string; estado: "done" | "curso" | "pend" }
export interface PlanComp { funcionario: string; competenciaIdx: number; desde: number; hasta: number; acciones: AccionPlan[] }
export const PLAN: PlanComp = {
  funcionario: "Paula R.",
  competenciaIdx: 0, // VMI
  desde: 2,
  hasta: 3,
  acciones: [
    { id: "a1", tipo: "Teoría", nombre: "Curso de ventilación mecánica", responsable: "Formación Clínica", estado: "done" },
    { id: "a2", tipo: "Práctica", nombre: "Práctica supervisada en VMI", responsable: "Enf. Clínica", estado: "done" },
    { id: "a3", tipo: "Turnos", nombre: "20 turnos autónomos evaluados", responsable: "Jefatura · registro", estado: "curso" },
    { id: "a4", tipo: "Evaluación", nombre: "Evaluación de desempeño (VMI)", responsable: "Enf. Clínica evaluadora", estado: "pend" },
    { id: "a5", tipo: "V°B°", nombre: "Visto bueno de Buenas Prácticas Clínicas", responsable: "BPC · Subdirección", estado: "pend" },
  ],
};

/** Validaciones que esperan el V°B° de BPC (habilitación a Competente). */
export interface ValidacionVB { id: string; funcionario: string; unidad: string; competenciaIdx: number; desde: number; hasta: number; evaluador: string; fecha: string; estado: "pendiente" | "aprobada" }
export const VALIDACIONES: ValidacionVB[] = [
  { id: "v1", funcionario: "Diego P.", unidad: "UCI", competenciaIdx: 1, desde: 2, hasta: 3, evaluador: "Enf. Clínica · M. Soto", fecha: "hoy 09:40", estado: "pendiente" },
  { id: "v2", funcionario: "Sofía D.", unidad: "UCI", competenciaIdx: 0, desde: 2, hasta: 3, evaluador: "Enf. Clínica · M. Soto", fecha: "ayer 16:10", estado: "pendiente" },
  { id: "v3", funcionario: "Elena R.", unidad: "UCI", competenciaIdx: 2, desde: 2, hasta: 3, evaluador: "Enf. Clínica · P. Díaz", fecha: "lun 11:00", estado: "aprobada" },
];
