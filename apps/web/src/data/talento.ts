import type { Tono } from "@/data/home";

/**
 * Talento clínico según Patricia Benner — "De novato a experto" (1984):
 * 5 estadios de adquisición de competencia clínica. La habilitación avanza de
 * estadio y el paso final requiere el V°B° de Buenas Prácticas Clínicas (BPC).
 */
export interface BennerNivel {
  n: number;
  nombre: string;
  corto: string;
  tono: Tono;
  desc: string;
}
export const BENNER: BennerNivel[] = [
  { n: 1, nombre: "Novato", corto: "I", tono: "crit", desc: "Sin experiencia; actúa siguiendo reglas y requiere supervisión directa." },
  { n: 2, nombre: "Principiante avanzado", corto: "II", tono: "warn", desc: "Desempeño aceptable con apoyo; reconoce aspectos recurrentes." },
  { n: 3, nombre: "Competente", corto: "III", tono: "info", desc: "Planifica de forma consciente y deliberada; 2–3 años de práctica." },
  { n: 4, nombre: "Proficiente", corto: "IV", tono: "acc", desc: "Percibe la situación como un todo; anticipa y prioriza." },
  { n: 5, nombre: "Experto", corto: "V", tono: "good", desc: "Dominio intuitivo; no depende de reglas. Referente clínico." },
];
export const bennerDe = (n: number): BennerNivel => BENNER[Math.max(0, Math.min(4, n - 1))];

export const COMPETENCIAS = ["Ventilación mecánica", "Drogas vasoactivas", "RCP avanzado", "Monitoreo hemodinámico", "Manejo de vía aérea"];
export const COMPETENCIAS_CORTO = ["VM", "DVA", "RCP", "MH", "VA"];

export interface PersonaBenner {
  nombre: string;
  estamento: string;
  global: number;
  niveles: number[]; // por competencia (índice = COMPETENCIAS)
}
export const EQUIPO_BENNER: PersonaBenner[] = [
  { nombre: "Ana G.", estamento: "Enfermero/a", global: 5, niveles: [5, 5, 4, 5, 4] },
  { nombre: "Carla M.", estamento: "Enfermero/a", global: 4, niveles: [4, 4, 4, 3, 4] },
  { nombre: "Diego P.", estamento: "Enfermero/a", global: 3, niveles: [4, 3, 3, 2, 3] },
  { nombre: "Elena R.", estamento: "Enfermero/a", global: 4, niveles: [4, 4, 3, 4, 3] },
  { nombre: "Luis A.", estamento: "TENS", global: 3, niveles: [3, 3, 3, 2, 3] },
  { nombre: "Paula R.", estamento: "Enfermero/a", global: 2, niveles: [2, 1, 3, 2, 3] },
  { nombre: "Sofía D.", estamento: "TENS", global: 3, niveles: [3, 2, 3, 3, 4] },
];

export interface AccionPlan {
  id: string;
  tipo: string;
  nombre: string;
  responsable: string;
  estado: "done" | "curso" | "pend";
}
export interface PlanBenner {
  funcionario: string;
  competencia: string;
  desde: number;
  hasta: number;
  progreso: number;
  acciones: AccionPlan[];
}
export const PLAN_BENNER: PlanBenner = {
  funcionario: "Paula R.",
  competencia: "Ventilación mecánica",
  desde: 2,
  hasta: 3,
  progreso: 75,
  acciones: [
    { id: "a1", tipo: "Orientación", nombre: "Orientación clínica a UCI", responsable: "José M. · Jefatura", estado: "done" },
    { id: "a2", tipo: "Entrenamiento", nombre: "Ventilación mecánica supervisada", responsable: "Formación Clínica", estado: "done" },
    { id: "a3", tipo: "Práctica", nombre: "Práctica clínica evaluada (20 turnos)", responsable: "Enf. Clínica", estado: "curso" },
    { id: "a4", tipo: "Evaluación", nombre: "Evaluación de competencia (VM)", responsable: "Enf. Clínica evaluadora", estado: "pend" },
    { id: "a5", tipo: "V°B°", nombre: "Visto bueno de Buenas Prácticas Clínicas", responsable: "BPC · Subdirección", estado: "pend" },
  ],
};

/** Cola de validaciones que esperan el V°B° de BPC. */
export interface ValidacionVB {
  id: string;
  funcionario: string;
  unidad: string;
  competencia: string;
  desde: number;
  hasta: number;
  evaluador: string;
  fecha: string;
  estado: "pendiente" | "aprobada";
}
export const VALIDACIONES: ValidacionVB[] = [
  { id: "v1", funcionario: "Rodrigo P.", unidad: "UCI", competencia: "Drogas vasoactivas", desde: 2, hasta: 3, evaluador: "Enf. Clínica · M. Soto", fecha: "hoy 09:40", estado: "pendiente" },
  { id: "v2", funcionario: "Camila F.", unidad: "UCI", competencia: "Ventilación mecánica", desde: 3, hasta: 4, evaluador: "Enf. Clínica · M. Soto", fecha: "ayer 16:10", estado: "pendiente" },
  { id: "v3", funcionario: "Sofía D.", unidad: "UCI", competencia: "Manejo de vía aérea", desde: 3, hasta: 4, evaluador: "Enf. Clínica · P. Díaz", fecha: "lun 11:00", estado: "aprobada" },
];
