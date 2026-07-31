import type { IconName } from "@/components/icons";
import type { Tono } from "@/data/home";

/** Canal de reportes Jefatura ⇄ Gestión Central:
 *  la Jefatura solicita, Gestión Central prepara y envía. Prototipo con datos
 *  ficticios; la forma anticipa lo que luego servirá el backend. */

export type ReporteTipo = "cobertura" | "contactos" | "horasExtra" | "ausencias";
export type ReporteEstado = "solicitado" | "preparando" | "enviado";

/** Firma del reporte: quién lo valida y envía (Buenas Prácticas Clínicas). */
export interface Firma {
  nombre: string;
  rol: string;
  fecha: string;
}

/** Firmante por defecto: el/la Coordinador/a de Buenas Prácticas Clínicas. */
export const FIRMANTE_BPC = {
  nombre: "EU. Marcela Ortiz",
  rol: "Coordinadora · Buenas Prácticas Clínicas · Subdirección",
};

export function fechaFirma(d = new Date()): string {
  return d.toLocaleString("es-CL", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }).replace(".", "");
}

export interface SolicitudReporte {
  id: string;
  tipo: ReporteTipo;
  periodo: string;
  jefatura: string;
  unidad: string;
  nota?: string;
  estado: ReporteEstado;
  fecha: string;
  firma?: Firma;
}

export const TIPO_LABEL: Record<ReporteTipo, string> = {
  cobertura: "Cobertura de brechas",
  contactos: "Contactos y respuestas",
  horasExtra: "Horas extra y costos",
  ausencias: "Ausencias del período",
};
export const TIPO_ICON: Record<ReporteTipo, IconName> = {
  cobertura: "swap",
  contactos: "send",
  horasExtra: "clock",
  ausencias: "plane",
};
export const ESTADO_LABEL: Record<ReporteEstado, string> = {
  solicitado: "Solicitado",
  preparando: "En preparación",
  enviado: "Enviado",
};
export const ESTADO_TONO: Record<ReporteEstado, Tono> = {
  solicitado: "warn",
  preparando: "info",
  enviado: "good",
};

export const PERIODOS = ["Última semana", "Este mes", "Último trimestre"];

export interface Metrica { label: string; valor: string; unidad?: string; tono: Tono }
export interface ReporteContenido {
  resumen: string;
  metricas: Metrica[];
  filas: { k: string; v: string; tono?: Tono }[];
}

export function generarContenido(tipo: ReporteTipo, periodo: string): ReporteContenido {
  switch (tipo) {
    case "cobertura":
      return {
        resumen: `${periodo}: 12 brechas detectadas, 10 cubiertas (83%). Tiempo medio de cobertura 31 min.`,
        metricas: [
          { label: "Brechas", valor: "12", tono: "info" },
          { label: "Cubiertas", valor: "10", tono: "good" },
          { label: "Tiempo medio", valor: "31", unidad: "min", tono: "good" },
          { label: "Escaladas", valor: "2", tono: "warn" },
        ],
        filas: [
          { k: "Noche", v: "6 brechas · 5 cubiertas" },
          { k: "Largo", v: "6 brechas · 5 cubiertas" },
          { k: "Sin cubrir", v: "2 · escaladas a Coordinación", tono: "crit" },
        ],
      };
    case "contactos":
      return {
        resumen: `${periodo}: 48 contactos realizados. 71% de aceptación.`,
        metricas: [
          { label: "Contactos", valor: "48", tono: "info" },
          { label: "Aceptaron", valor: "34", tono: "good" },
          { label: "Rechazaron", valor: "9", tono: "warn" },
          { label: "Otra eventualidad", valor: "5", tono: "info" },
        ],
        filas: [
          { k: "Aceptación", v: "71% (34/48)", tono: "good" },
          { k: "Motivo top de rechazo", v: "Vengo saliendo de turno (4)" },
          { k: "Eventualidades", v: "3 vacaciones · 2 licencia" },
        ],
      };
    case "horasExtra":
      return {
        resumen: `${periodo}: 128 h extra, equivalentes a ~$1.9M. 9 personas involucradas.`,
        metricas: [
          { label: "Horas extra", valor: "128", unidad: "h", tono: "warn" },
          { label: "Costo estimado", valor: "$1,9M", tono: "warn" },
          { label: "Personas", valor: "9", tono: "info" },
          { label: "vs. mes previo", valor: "−9%", tono: "good" },
        ],
        filas: [
          { k: "UCI", v: "72 h · 5 personas", tono: "warn" },
          { k: "Urgencias", v: "40 h · 3 personas" },
          { k: "Recomendación NEX", v: "1 cupo estable reduciría ~40%", tono: "info" },
        ],
      };
    case "ausencias":
      return {
        resumen: `${periodo}: 14 ausencias. Ausentismo 6,2% (al alza en UCI).`,
        metricas: [
          { label: "Ausencias", valor: "14", tono: "info" },
          { label: "Licencias", valor: "6", tono: "warn" },
          { label: "Vacaciones", valor: "5", tono: "good" },
          { label: "Permisos", valor: "3", tono: "info" },
        ],
        filas: [
          { k: "Ausentismo", v: "6,2% · +18% en UCI", tono: "warn" },
          { k: "Unidad más afectada", v: "UCI (5 ausencias)" },
          { k: "Impacto en brechas", v: "4 brechas originadas por ausencia" },
        ],
      };
  }
}

/** Solicitudes de ejemplo en la bandeja de Gestión Central. */
export const SOLICITUDES_SEED: SolicitudReporte[] = [
  { id: "r0", tipo: "ausencias", periodo: "Este mes", jefatura: "José M.", unidad: "UCI", estado: "enviado", fecha: "lun 10:20", firma: { ...FIRMANTE_BPC, fecha: "28 jul, 10:20" } },
  { id: "r1", tipo: "cobertura", periodo: "Este mes", jefatura: "José M.", unidad: "UCI", nota: "Para la reunión de gestión del lunes.", estado: "solicitado", fecha: "hoy 09:12" },
  { id: "r2", tipo: "contactos", periodo: "Última semana", jefatura: "José M.", unidad: "UCI", estado: "preparando", fecha: "ayer 17:40" },
  { id: "r3", tipo: "horasExtra", periodo: "Último trimestre", jefatura: "Ana T.", unidad: "Pabellón", estado: "enviado", fecha: "lun 11:05", firma: { ...FIRMANTE_BPC, fecha: "29 jul, 11:05" } },
];
