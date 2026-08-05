import type { Perfil, Semaforo } from "@nexshift/contracts";
import type { IconName } from "@/components/icons";

/** Datos del Home "Centro de Comando". Cada perfil tiene su propia narrativa,
 *  jerarquía y objetivo — no comparten layout. Prototipo con datos ficticios;
 *  la forma anticipa lo que luego servirá el backend (Brechas, Notificaciones,
 *  Analítica). */

export type Tono = "good" | "warn" | "crit" | "info" | "acc";

export function saludoHora(d = new Date()): string {
  const h = d.getHours();
  return h < 12 ? "Buenos días" : h < 20 ? "Buenas tardes" : "Buenas noches";
}

export interface Narrativa {
  nombre: string;
  contexto: string;
  frase: string; // el "briefing" que cuenta la situación
  foco?: string; // la expresión que se resalta
  chips: { icon: IconName; texto: string; tono: Tono }[];
}

export interface UnidadEstado {
  sigla: string;
  nombre: string;
  req: number;
  disp: number;
  semaforo: Semaforo;
  nota?: string;
  tendencia?: "up" | "down" | "flat";
}

export interface EventoTL {
  hora: string;
  icon: IconName;
  texto: string;
  meta?: string;
  tono: Tono;
  cuando: "pasado" | "ahora" | "futuro";
}


export interface LiveStat {
  icon: IconName;
  label: string;
  valor: string;
  unidad?: string;
  tono: Tono;
  spark?: number[];
}


/* ------------------------------ JEFATURA ------------------------------ */
export interface HeatCell {
  tono: Tono;
  txt: string; // ej "12/14"
}
export interface Heatmap {
  dias: string[];
  filas: { sigla: string; celdas: HeatCell[] }[];
}
const c = (tono: Tono, txt: string): HeatCell => ({ tono, txt });

export interface HomeJefatura {
  tipo: "jefatura";
  narrativa: Narrativa;
  operacion: { semaforo: Semaforo; titulo: string; unidades: UnidadEstado[] };
  heatmap: Heatmap;
  pulso: LiveStat[];
  foco: {
    titulo: string;
    subt: string;
    minutos: number;
  };
  timeline: EventoTL[];
}

const JEFATURA: HomeJefatura = {
  tipo: "jefatura",
  narrativa: {
    nombre: "José",
    contexto: "Jefatura · UCI · Sede Central",
    frase: "La UCI queda en riesgo esta noche: falta 1 enfermera para el turno de las 20:00.",
    foco: "Hay 3 reemplazos posibles en la unidad.",
    chips: [
      { icon: "gap", texto: "1 brecha crítica", tono: "crit" },
      { icon: "calendar", texto: "3 permisos por responder", tono: "warn" },
      { icon: "shield", texto: "2 reevaluaciones por vencer", tono: "info" },
    ],
  },
  operacion: {
    semaforo: "riesgo",
    titulo: "Operación en vivo",
    unidades: [
      { sigla: "UCI", nombre: "Cuidados Intensivos", req: 14, disp: 12, semaforo: "riesgo", nota: "falta 1 esta noche", tendencia: "down" },
      { sigla: "URG", nombre: "Urgencias", req: 10, disp: 9, semaforo: "riesgo", nota: "ajustado", tendencia: "flat" },
      { sigla: "MED", nombre: "Medicina", req: 16, disp: 16, semaforo: "equilibrio", nota: "completo", tendencia: "up" },
      { sigla: "PAB", nombre: "Pabellón", req: 8, disp: 8, semaforo: "equilibrio", nota: "completo", tendencia: "flat" },
    ],
  },
  heatmap: {
    dias: ["Vie", "Sáb", "Dom", "Lun", "Mar", "Mié", "Jue"],
    filas: [
      { sigla: "UCI", celdas: [c("crit", "12/14"), c("warn", "13/14"), c("warn", "13/14"), c("good", "14/14"), c("good", "14/14"), c("warn", "13/14"), c("good", "14/14")] },
      { sigla: "URG", celdas: [c("warn", "9/10"), c("warn", "9/10"), c("good", "10/10"), c("good", "10/10"), c("warn", "9/10"), c("good", "10/10"), c("good", "10/10")] },
      { sigla: "MED", celdas: [c("good", "16/16"), c("good", "16/16"), c("good", "16/16"), c("warn", "15/16"), c("good", "16/16"), c("good", "16/16"), c("good", "16/16")] },
      { sigla: "PAB", celdas: [c("good", "8/8"), c("good", "8/8"), c("warn", "7/8"), c("good", "8/8"), c("good", "8/8"), c("good", "8/8"), c("good", "8/8")] },
    ],
  },
  pulso: [
    { icon: "users", label: "Dotación", valor: "12/14", tono: "warn", spark: [14, 13, 12, 13, 12, 12] },
    { icon: "plane", label: "Ausencias hoy", valor: "3", tono: "info", spark: [1, 2, 2, 3, 2, 3] },
    { icon: "clock", label: "Cobertura media", valor: "31", unidad: "min", tono: "good", spark: [44, 40, 36, 33, 32, 31] },
    { icon: "check", label: "Malla publicada", valor: "96", unidad: "%", tono: "good", spark: [80, 86, 90, 93, 95, 96] },
  ],
  foco: {
    titulo: "Turno noche UCI · hoy 20:00",
    subt: "Falta 1 · unidad crítica · el turno empieza en horas",
    minutos: 22,
  },
  timeline: [
    { hora: "20:00", icon: "gap", texto: "Turno noche UCI · falta 1", meta: "en 6 h", tono: "crit", cuando: "futuro" },
    { hora: "ahora", icon: "pulse", texto: "Brecha crítica abierta · UCI", meta: "hace 22 min", tono: "crit", cuando: "ahora" },
    { hora: "13:40", icon: "send", texto: "Oferta enviada a 2 candidatos", meta: "sin respuesta", tono: "warn", cuando: "pasado" },
    { hora: "12:10", icon: "plane", texto: "Ana G. inició licencia médica", meta: "UCI · 5 días", tono: "info", cuando: "pasado" },
    { hora: "09:15", icon: "calendar", texto: "Malla de agosto publicada", meta: "UCI", tono: "good", cuando: "pasado" },
  ],
};

/* ---------------------------- SUBDIRECCIÓN ---------------------------- */
export interface HomeSubdireccion {
  tipo: "subdireccion";
  narrativa: Narrativa;
  indicadores: { label: string; valor: string; unidad?: string; delta: string; tono: Tono; dir: "up" | "down" | "flat"; spark: number[] }[];
  red: UnidadEstado[];
  timeline: EventoTL[];
}

const SUBDIRECCION: HomeSubdireccion = {
  tipo: "subdireccion",
  narrativa: {
    nombre: "Dra. Rivas",
    contexto: "Subdirección · Sede Central",
    frase: "La red está estable, pero el ausentismo en UCI subió 18% este mes.",
    foco: "Conviene revisar el patrón antes de la próxima malla.",
    chips: [
      { icon: "chart", texto: "Cobertura global 94%", tono: "good" },
      { icon: "arrow-up", texto: "Ausentismo +18% UCI", tono: "warn" },
      { icon: "list", texto: "2 reportes por preparar", tono: "info" },
    ],
  },
  indicadores: [
    { label: "Cobertura global", valor: "94", unidad: "%", delta: "+2,1", tono: "good", dir: "up", spark: [89, 90, 91, 92, 93, 94] },
    { label: "Ausentismo", valor: "6,2", unidad: "%", delta: "+18% UCI", tono: "warn", dir: "up", spark: [4.8, 5.1, 5.4, 5.6, 5.9, 6.2] },
    { label: "Equidad de carga", valor: "0,82", delta: "estable", tono: "good", dir: "flat", spark: [0.8, 0.81, 0.82, 0.82, 0.81, 0.82] },
    { label: "Horas extra", valor: "128", unidad: "h", delta: "−9%", tono: "good", dir: "down", spark: [168, 158, 150, 142, 134, 128] },
  ],
  red: [
    { sigla: "UCI", nombre: "Cuidados Intensivos", req: 14, disp: 12, semaforo: "riesgo", nota: "ausentismo al alza", tendencia: "down" },
    { sigla: "URG", nombre: "Urgencias", req: 10, disp: 9, semaforo: "riesgo", nota: "ajustado", tendencia: "flat" },
    { sigla: "MED", nombre: "Medicina", req: 16, disp: 16, semaforo: "equilibrio", tendencia: "up" },
    { sigla: "PAB", nombre: "Pabellón", req: 8, disp: 8, semaforo: "equilibrio", tendencia: "flat" },
    { sigla: "NEO", nombre: "Neonatología", req: 9, disp: 7, semaforo: "riesgo", nota: "2 licencias", tendencia: "down" },
  ],
  timeline: [
    { hora: "Este mes", icon: "arrow-up", texto: "Ausentismo UCI +18%", meta: "3er mes al alza", tono: "warn", cuando: "ahora" },
    { hora: "Sem 30", icon: "calendar", texto: "Mallas de agosto publicadas a tiempo", meta: "5 unidades", tono: "good", cuando: "pasado" },
    { hora: "Sem 29", icon: "chart", texto: "Cobertura global superó 92%", tono: "good", cuando: "pasado" },
    { hora: "Próx.", icon: "shield", texto: "Reevaluación trimestral RCP", meta: "48 personas", tono: "info", cuando: "futuro" },
  ],
};

/* ----------------------------- FUNCIONARIO ---------------------------- */
export interface HomeFuncionario {
  tipo: "funcionario";
  narrativa: Narrativa;
  proximoTurno: { fecha: string; hora: string; unidad: string; tipo: string; horas: number; en: string };
  oferta?: { texto: string; plazo: string; incentivo: string };
  bienestar: { turnosMes: number; noches: number; libres: number; carga: number; mensaje: string; tono: Tono };
  timeline: EventoTL[];
}

const FUNCIONARIO: HomeFuncionario = {
  tipo: "funcionario",
  narrativa: {
    nombre: "Paula",
    contexto: "Enfermera · UCI",
    frase: "Tu próximo turno es hoy a las 20:00 en UCI.",
    foco: "Tenés 1 oferta de cobertura esperando tu respuesta.",
    chips: [
      { icon: "clock", texto: "Turno hoy 20:00", tono: "acc" },
      { icon: "send", texto: "1 oferta pendiente", tono: "warn" },
      { icon: "plane", texto: "12 días de feriado legal", tono: "info" },
    ],
  },
  proximoTurno: { fecha: "Hoy", hora: "20:00", unidad: "UCI", tipo: "Noche", horas: 12, en: "empieza en 6 h" },
  oferta: {
    texto: "Cubrir turno noche · UCI · sábado 20:00",
    plazo: "Responde en 2 h",
    incentivo: "+1 libre compensatorio",
  },
  bienestar: {
    turnosMes: 14,
    noches: 4,
    libres: 8,
    carga: 70,
    mensaje: "Tu carga está equilibrada este mes.",
    tono: "good",
  },
  timeline: [
    { hora: "Hoy 20:00", icon: "pulse", texto: "Turno noche · UCI", meta: "12 h", tono: "acc", cuando: "futuro" },
    { hora: "Mañana", icon: "check", texto: "Libre", tono: "good", cuando: "futuro" },
    { hora: "Vie", icon: "calendar", texto: "Turno largo · UCI", meta: "12 h", tono: "info", cuando: "futuro" },
    { hora: "Sáb", icon: "check", texto: "Libre", tono: "good", cuando: "futuro" },
  ],
};

/* ----------------------------- ADMINISTRADOR -------------------------- */
export interface HomeAdmin {
  tipo: "administrador";
  narrativa: Narrativa;
  salud: { icon: IconName; label: string; valor: string; estado: Tono; nota: string }[];
  timeline: EventoTL[];
}

const ADMINISTRADOR: HomeAdmin = {
  tipo: "administrador",
  narrativa: {
    nombre: "Admin",
    contexto: "Administración · Global",
    frase: "Sistema estable. 2 cambios de reglas se están propagando.",
    foco: "No hay incidencias abiertas.",
    chips: [
      { icon: "check", texto: "Sin incidencias", tono: "good" },
      { icon: "settings", texto: "2 reglas propagándose", tono: "info" },
      { icon: "users", texto: "48 usuarios activos", tono: "acc" },
    ],
  },
  salud: [
    { icon: "settings", label: "Reglas activas", valor: "12", estado: "good", nota: "2 propagándose" },
    { icon: "settings", label: "Reglas de dotación", valor: "OK", estado: "good", nota: "editado hace 2 h" },
    { icon: "swap", label: "Integración RRHH", valor: "En línea", estado: "good", nota: "sync 08:00" },
    { icon: "shield", label: "Reevaluaciones", valor: "88%", estado: "warn", nota: "al día" },
  ],
  timeline: [
    { hora: "08:55", icon: "user-plus", texto: "Alta de usuario: p.ramirez", meta: "Jefatura · UCI", tono: "info", cuando: "pasado" },
    { hora: "08:40", icon: "settings", texto: "Umbral RCP: 30 → 45 días", meta: "propagó a alertas", tono: "warn", cuando: "pasado" },
    { hora: "08:22", icon: "settings", texto: "Umbral de descanso: 12 → 11 h", meta: "propaga a mallas", tono: "acc", cuando: "pasado" },
  ],
};

/* --------------------------- GESTIÓN CENTRAL -------------------------- */
export interface ColaItem {
  unidad: string;
  turno: string;
  fecha: string;
  jefatura: string;
  estado: string; // etiqueta del paso actual
  detalle: string;
  tono: Tono;
}
export interface HomeGestion {
  tipo: "gestion";
  narrativa: Narrativa;
  cola: ColaItem[];
  pulso: LiveStat[];
  timeline: EventoTL[];
}

const GESTION: HomeGestion = {
  tipo: "gestion",
  narrativa: {
    nombre: "Nadia",
    contexto: "Gestión Central de Dotación",
    frase: "Tenés 3 solicitudes de cobertura en cola; 1 es de UCI para esta noche.",
    foco: "La cola ya está priorizada para contactar.",
    chips: [
      { icon: "swap", texto: "3 en cola", tono: "crit" },
      { icon: "clock", texto: "1 esperando Jefatura", tono: "warn" },
      { icon: "check", texto: "Tasa aceptación 72%", tono: "good" },
    ],
  },
  cola: [
    { unidad: "UCI", turno: "Noche · hoy 20:00", fecha: "falta 1", jefatura: "José M.", estado: "Por contactar", detalle: "Primero en la lista: Camila F.", tono: "crit" },
    { unidad: "Urgencias", turno: "Largo · mañana 08:00", fecha: "falta 1", jefatura: "José M.", estado: "Contactando", detalle: "Rodrigo P. · llamado en curso (2/4)", tono: "warn" },
    { unidad: "Pabellón", turno: "Largo · sábado", fecha: "falta 1", jefatura: "Ana T.", estado: "Esperando Jefatura", detalle: "Sofía D. aceptó · pendiente confirmación", tono: "info" },
  ],
  pulso: [
    { icon: "swap", label: "Solicitudes en cola", valor: "3", tono: "crit", spark: [1, 2, 2, 3, 2, 3] },
    { icon: "send", label: "Contactos hoy", valor: "14", tono: "info", spark: [6, 9, 11, 12, 13, 14] },
    { icon: "check", label: "Tasa aceptación", valor: "72", unidad: "%", tono: "good", spark: [64, 66, 69, 70, 71, 72] },
    { icon: "clock", label: "Tiempo medio", valor: "31", unidad: "min", tono: "good", spark: [45, 41, 37, 34, 32, 31] },
  ],
  timeline: [
    { hora: "ahora", icon: "swap", texto: "Nueva solicitud · UCI noche", meta: "de Jefatura José M.", tono: "crit", cuando: "ahora" },
    { hora: "21:20", icon: "send", texto: "Llamado a Rodrigo P. · Urgencias", meta: "sin respuesta aún", tono: "warn", cuando: "pasado" },
    { hora: "21:05", icon: "check", texto: "Sofía D. aceptó · Pabellón", meta: "enviado a Jefatura", tono: "good", cuando: "pasado" },
    { hora: "20:40", icon: "user", texto: "Marta R. pidió 'otra eventualidad'", meta: "en vacaciones esta semana", tono: "info", cuando: "pasado" },
  ],
};


export type HomeData = HomeJefatura | HomeGestion | HomeSubdireccion | HomeFuncionario | HomeAdmin;

export function getHome(perfil: Perfil): HomeData {
  switch (perfil) {
    case "gestion":
      return GESTION;
    case "subdireccion":
      return SUBDIRECCION;
    case "funcionario":
      return FUNCIONARIO;
    case "administrador":
      return ADMINISTRADOR;
    default:
      return JEFATURA;
  }
}
