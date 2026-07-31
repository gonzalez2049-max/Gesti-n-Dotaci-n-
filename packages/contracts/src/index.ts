import { z } from "zod";

/**
 * @nexshift/contracts — Fuente única del contrato.
 * Tipos y esquemas (zod) compartidos por `web` y `api`.
 * Alineado con docs/architecture (perfiles, niveles de prioridad, cuarto turno,
 * estados de cobertura/habilitación y catálogo de eventos de dominio).
 */

/* ------------------------------------------------------------------ */
/* Perfiles y seguridad                                                */
/* ------------------------------------------------------------------ */
export const Perfil = z.enum([
  "administrador",
  "subdireccion",
  "supervisor",
  "coordinador",
  "funcionario",
]);
export type Perfil = z.infer<typeof Perfil>;

/* ------------------------------------------------------------------ */
/* Vocabulario operativo (docs 12–18)                                  */
/* ------------------------------------------------------------------ */

/** Niveles de prioridad de las acciones en Inicio (doc 12). */
export const NivelPrioridad = z.enum(["ahora", "hoy", "semana", "revisar"]);
export type NivelPrioridad = z.infer<typeof NivelPrioridad>;

/** Semáforo de dotación / estado (doc 11 §11.7). */
export const Semaforo = z.enum(["equilibrio", "riesgo", "critico", "exceso"]);
export type Semaforo = z.infer<typeof Semaforo>;

/** Turnos base: sistema de cuarto turno (doc 15). */
export const Turno = z.enum(["largo", "noche", "libre"]);
export type Turno = z.infer<typeof Turno>;

export const SeveridadBrecha = z.enum(["critica", "alta", "media", "baja"]);
export type SeveridadBrecha = z.infer<typeof SeveridadBrecha>;

/** Estados de una cobertura, lado gestión (doc 14). */
export const EstadoCobertura = z.enum([
  "propuesta",
  "ofertaEnviada",
  "aceptada",
  "confirmada",
  "aplicada",
  "rechazada",
  "cerrada",
  "escalada",
]);
export type EstadoCobertura = z.infer<typeof EstadoCobertura>;

/** Estado de la habilitación (doc 17). */
export const EstadoHabilitacion = z.enum([
  "vigente",
  "porVencer",
  "reevaluacionRequerida",
  "enProceso",
  "vencida",
  "noHabilitado",
]);
export type EstadoHabilitacion = z.infer<typeof EstadoHabilitacion>;

/* ------------------------------------------------------------------ */
/* Modelos para la pantalla de Inicio (docs 12, 13, 22)                */
/* ------------------------------------------------------------------ */

/** Estado de dotación de una unidad (disponible vs. requerido). */
export const EstadoDotacion = z.object({
  unidad: z.string(),
  requerido: z.number().int().nonnegative(),
  disponible: z.number().int().nonnegative(),
  semaforo: Semaforo,
  titular: z.string(), // "Tu unidad: en riesgo"
  detalle: z.string(), // "Faltan 2 · 1 esta noche"
});
export type EstadoDotacion = z.infer<typeof EstadoDotacion>;

/** Franja de guía: qué ocurre / qué hacer / siguiente (doc 23 §23.9). */
export const Guia = z.object({
  queOcurre: z.string(),
  queHacer: z.string(),
  siguiente: z.string(),
  cta: z.string().optional(),
});
export type Guia = z.infer<typeof Guia>;

/** Indicador (KPI) compacto de Inicio. */
export const Indicador = z.object({
  clave: z.string(),
  etiqueta: z.string(),
  valor: z.string(),
  unidad: z.string().optional(),
  tono: z.enum(["neutro", "good", "warn", "crit"]).default("neutro"),
  abre: z.string().optional(), // ruta/proceso que abre (doc 12 §12.5)
});
export type Indicador = z.infer<typeof Indicador>;

/** Tipo de acción/tarea que puede aparecer en el centro de trabajo. */
export const TipoAccion = z.enum([
  "cobertura",
  "solicitud",
  "reevaluacion",
  "ausencia",
  "oferta",
  "desarrollo",
  "malla",
  "config",
]);
export type TipoAccion = z.infer<typeof TipoAccion>;

/** Una acción prioritaria (tarjeta compacta en Inicio). */
export const AccionPrioritaria = z.object({
  id: z.string(),
  nivel: NivelPrioridad,
  tipo: TipoAccion,
  titulo: z.string(),
  porque: z.string(), // el "por qué" en una línea (doc 12 §12.3)
  ctaLabel: z.string(),
  semaforo: Semaforo.optional(),
  nueva: z.boolean().default(false),
});
export type AccionPrioritaria = z.infer<typeof AccionPrioritaria>;

/** Resumen completo que alimenta la pantalla de Inicio de un perfil. */
export const InicioResumen = z.object({
  perfil: Perfil,
  saludo: z.string(),
  contexto: z.string(), // "Sede Central · UCI"
  estado: EstadoDotacion,
  guia: Guia,
  accionPrioritaria: z.string(), // texto de la barra fija
  accionesPrioritarias: z.array(AccionPrioritaria),
  indicadores: z.array(Indicador),
});
export type InicioResumen = z.infer<typeof InicioResumen>;

/* ------------------------------------------------------------------ */
/* Eventos de dominio (docs 05, 09) — envoltura común                  */
/* ------------------------------------------------------------------ */

export const TipoEvento = z.enum([
  "AusenciaAprobada",
  "AusenciaRegistrada",
  "BrechaDetectada",
  "BrechaCerrada",
  "OfertaEnviada",
  "CoberturaAceptada",
  "CoberturaRechazada",
  "CoberturaConfirmada",
  "HabilitacionPorVencer",
  "HabilitacionVencida",
  "HabilitacionValidada", // validación final humana (doc 20)
  "AccionFormativaCompletada",
  "ConfiguracionCambiada",
]);
export type TipoEvento = z.infer<typeof TipoEvento>;

/** Envoltura de evento de dominio (doc 09 §9.1). */
export const DomainEvent = z.object({
  id: z.string().uuid(),
  tipo: TipoEvento,
  version: z.number().int().positive().default(1),
  ocurridoAt: z.string().datetime(),
  actor: z.string(),
  agregado: z.object({ tipo: z.string(), id: z.string() }),
  correlacionId: z.string().optional(),
  payload: z.record(z.unknown()),
});
export type DomainEvent<TPayload = Record<string, unknown>> = Omit<
  z.infer<typeof DomainEvent>,
  "payload"
> & { payload: TPayload };

/* ------------------------------------------------------------------ */
/* Modelos de lectura por módulo (read models)                         */
/* Tipos que consumen las pantallas. Los sirve el mock hoy y el backend */
/* mañana, sin cambiar la interfaz.                                     */
/* ------------------------------------------------------------------ */

export interface Unidad {
  id: string;
  nombre: string;
  criticidad: "alta" | "media" | "baja";
}

/** Brecha (read model, doc 13/14). */
export interface Brecha {
  id: string;
  unidad: string;
  turno: "Largo" | "Noche";
  fecha: string; // "hoy" | "mañana" | "sábado"
  rol: string;
  severidad: SeveridadBrecha;
  semaforo: Semaforo;
  deficit: number;
  minutosAbierta: number;
  estado: "detectada" | "enGestion" | "resuelta" | "cerrada" | "escalada";
  causa: string;
}

/** Candidato del Índice NEX (doc 18). */
export interface CandidatoNex {
  id: string;
  nombre: string;
  tipoCobertura: string; // "Equipo de apoyo" | "Reasignación" | "Hora extra"...
  razon: string;
  costo: string;
  costoTono: "good" | "warn" | "neutro";
  score: number; // 0–100
  recomendado: boolean;
  alerta?: string;
  factores: { clave: string; etiqueta: string; valor: number }[];
}

export interface EventoTrazabilidad {
  hora: string;
  titulo: string;
  detalle: string;
  tono: "sys" | "ok" | "rej" | "neutro";
}

/** Programación / Malla (doc 15). */
export interface MallaPersona {
  id: string;
  nombre: string;
  celdas: Turno[]; // 7 días
  turnosSemana: number;
}
export interface MallaSemana {
  unidad: string;
  dias: string[];
  requerido: { largo: number; noche: number };
  personas: MallaPersona[];
  estado: "borrador" | "publicada";
}

/** Ausencias (doc 16). */
export interface ImpactoDotacion {
  turno: string;
  resultado: string; // "1/2"
  tono: "good" | "warn" | "crit";
}
export interface SolicitudAusencia {
  id: string;
  funcionario: string;
  tipo: "Vacaciones" | "Permiso administrativo" | "Capacitación" | "Licencia médica";
  rango: string;
  saldo: string;
  impacto: ImpactoDotacion[];
  generaBrechas: number;
  estado: "pendiente" | "aprobada" | "rechazada";
}

/** Talento / Desarrollo (doc 20). */
export interface CompetenciaPersona {
  nombre: string;
  estados: Record<string, EstadoHabilitacion>; // competencia -> estado
}
export interface AccionPlan {
  id: string;
  tipo: "Orientación" | "Entrenamiento" | "Evaluación" | "Certificación" | "Recertificación";
  nombre: string;
  responsable: string;
  estado: "done" | "curso" | "pend";
}
export interface PlanDesarrollo {
  funcionario: string;
  objetivo: string;
  progreso: number;
  acciones: AccionPlan[];
}

/** Analítica (doc 19). */
export interface Serie {
  labels: string[];
  series: { nombre: string; colorVar: string; valores: number[] }[];
  unidad?: string;
}

/** Administración (doc 21). */
export interface ConfigRegla {
  clave: string;
  etiqueta: string;
  valor: number;
  unidad: string;
  propaga: string;
}
export interface AuditEntry {
  hora: string;
  area: string;
  accion: string;
  detalle: string;
}

/** Funcionario (doc 22). */
export type EstadoOferta = "recibida" | "aceptada" | "confirmada" | "rechazada";

export const CONTRACTS_VERSION = "0.1.0";
