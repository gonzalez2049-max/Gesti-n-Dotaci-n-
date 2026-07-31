import type { Perfil, Semaforo } from "@nexshift/contracts";
import type { IconName } from "@/components/icons";

/** Datos del Home "Centro de Comando". Cada perfil tiene su propia narrativa,
 *  jerarquía y objetivo — no comparten layout. Prototipo con datos ficticios;
 *  la forma anticipa lo que luego servirá el backend (Brechas, Notificaciones,
 *  Índice NEX, Analítica). */

export type Tono = "good" | "warn" | "crit" | "info" | "acc";

export function saludoHora(d = new Date()): string {
  const h = d.getHours();
  return h < 12 ? "Buenos días" : h < 20 ? "Buenas tardes" : "Buenas noches";
}

export interface Narrativa {
  nombre: string;
  contexto: string;
  frase: string; // el "briefing" que cuenta la situación
  foco?: string; // la palabra/expresión que NEX resalta
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

export interface NexInsight {
  titulo: string;
  razon: string;
  confianza?: number; // 0..100
  accion: string;
  ruta: string;
  impacto: string[];
  alternativas?: string;
}

export interface LiveStat {
  icon: IconName;
  label: string;
  valor: string;
  unidad?: string;
  tono: Tono;
  spark?: number[];
}

/** Marco NEX: las 5 preguntas que toda pantalla debe responder. */
export interface GuiaNex {
  ocurre: string; // ¿qué ocurre?
  hacer: string; // ¿qué debo hacer?
  recomienda: string; // ¿qué recomienda NEX?
  riesgo: string; // ¿qué pasa si no actúo?
  siguiente: string; // ¿cuál es el siguiente paso?
  cta?: string;
  ruta?: string;
}

/* ------------------------------ JEFATURA ------------------------------ */
export interface HomeJefatura {
  tipo: "jefatura";
  narrativa: Narrativa;
  guia: GuiaNex;
  operacion: { semaforo: Semaforo; titulo: string; unidades: UnidadEstado[] };
  pulso: LiveStat[];
  foco: {
    titulo: string;
    subt: string;
    minutos: number;
    candidatos: { nombre: string; detalle: string; score: number; tono: Tono }[];
  };
  timeline: EventoTL[];
  nex: NexInsight;
}

const JEFATURA: HomeJefatura = {
  tipo: "jefatura",
  narrativa: {
    nombre: "José",
    contexto: "Jefatura · UCI · Sede Central",
    frase: "La UCI queda en riesgo esta noche: falta 1 enfermera para el turno de las 22:00.",
    foco: "NEX ya identificó 3 reemplazos habilitados.",
    chips: [
      { icon: "gap", texto: "1 brecha crítica", tono: "crit" },
      { icon: "calendar", texto: "3 permisos por responder", tono: "warn" },
      { icon: "shield", texto: "2 reevaluaciones por vencer", tono: "info" },
    ],
  },
  guia: {
    ocurre: "La UCI queda con 1 enfermera menos en el turno noche (22:00).",
    hacer: "Enviá la oferta al candidato recomendado.",
    recomienda: "Camila F. — apoyo habilitado, sin costo extra (Índice NEX 92).",
    riesgo: "Si no actuás, la UCI abre la noche en dotación crítica.",
    siguiente: "Camila confirma y la dotación vuelve a verde.",
    cta: "Resolver brecha",
    ruta: "/brechas",
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
  pulso: [
    { icon: "users", label: "Dotación", valor: "12/14", tono: "warn", spark: [14, 13, 12, 13, 12, 12] },
    { icon: "plane", label: "Ausencias hoy", valor: "3", tono: "info", spark: [1, 2, 2, 3, 2, 3] },
    { icon: "clock", label: "Cobertura media", valor: "31", unidad: "min", tono: "good", spark: [44, 40, 36, 33, 32, 31] },
    { icon: "check", label: "Malla publicada", valor: "96", unidad: "%", tono: "good", spark: [80, 86, 90, 93, 95, 96] },
  ],
  foco: {
    titulo: "Turno noche UCI · hoy 22:00",
    subt: "Falta 1 · unidad crítica · el turno empieza en horas",
    minutos: 22,
    candidatos: [
      { nombre: "Camila F.", detalle: "Apoyo · 11 turnos · sin costo extra", score: 92, tono: "good" },
      { nombre: "Rodrigo P.", detalle: "UCI · 13 turnos · reasignación", score: 84, tono: "good" },
      { nombre: "Nadia S.", detalle: "Hora extra · 16 turnos", score: 61, tono: "warn" },
    ],
  },
  timeline: [
    { hora: "22:00", icon: "gap", texto: "Turno noche UCI · falta 1", meta: "en 6 h", tono: "crit", cuando: "futuro" },
    { hora: "ahora", icon: "pulse", texto: "Brecha crítica abierta · UCI", meta: "hace 22 min", tono: "crit", cuando: "ahora" },
    { hora: "13:40", icon: "send", texto: "Oferta enviada a 2 candidatos", meta: "sin respuesta", tono: "warn", cuando: "pasado" },
    { hora: "12:10", icon: "plane", texto: "Ana G. inició licencia médica", meta: "UCI · 5 días", tono: "info", cuando: "pasado" },
    { hora: "09:15", icon: "calendar", texto: "Malla de agosto publicada", meta: "UCI", tono: "good", cuando: "pasado" },
  ],
  nex: {
    titulo: "Asigná a Camila F. al turno noche",
    razon:
      "Es personal de apoyo habilitado en UCI, con la menor carga del equipo (11 turnos) y sin costo de hora extra. Supera a las otras dos opciones en el Índice NEX.",
    confianza: 92,
    accion: "Enviar oferta a Camila",
    ruta: "/brechas",
    impacto: ["Cierra la brecha crítica", "Dotación vuelve a verde", "Sin hora extra"],
    alternativas: "2 candidatos más",
  },
};

/* ---------------------------- SUBDIRECCIÓN ---------------------------- */
export interface HomeSubdireccion {
  tipo: "subdireccion";
  narrativa: Narrativa;
  guia: GuiaNex;
  indicadores: { label: string; valor: string; unidad?: string; delta: string; tono: Tono; dir: "up" | "down" | "flat"; spark: number[] }[];
  red: UnidadEstado[];
  nex: NexInsight;
  timeline: EventoTL[];
}

const SUBDIRECCION: HomeSubdireccion = {
  tipo: "subdireccion",
  narrativa: {
    nombre: "Dra. Rivas",
    contexto: "Subdirección · Sede Central",
    frase: "La red está estable, pero el ausentismo en UCI subió 18% este mes.",
    foco: "NEX detectó un patrón que conviene revisar antes de la próxima malla.",
    chips: [
      { icon: "chart", texto: "Cobertura global 94%", tono: "good" },
      { icon: "arrow-up", texto: "Ausentismo +18% UCI", tono: "warn" },
      { icon: "graduation", texto: "5 planes cerrados", tono: "info" },
    ],
  },
  guia: {
    ocurre: "El ausentismo en UCI creció 18% por tercer mes consecutivo.",
    hacer: "Revisá la malla de UCI antes de la próxima publicación.",
    recomienda: "Sumar 1 cupo estable reduce ~40% la hora extra proyectada.",
    riesgo: "Si no se ajusta, sube la hora extra y el riesgo de brechas nocturnas.",
    siguiente: "Se simula la nueva malla y se valida con la Jefatura.",
    cta: "Ver análisis de UCI",
    ruta: "/analitica",
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
  nex: {
    titulo: "Revisá la malla de UCI para septiembre",
    razon:
      "El ausentismo y las horas extra en UCI crecen tres meses seguidos. Incorporar 1 cupo estable reduciría la hora extra proyectada cerca de un 40% y estabilizaría la dotación nocturna.",
    confianza: 78,
    accion: "Ver análisis de UCI",
    ruta: "/analitica",
    impacto: ["−40% hora extra proyectada", "Dotación nocturna estable", "Menor riesgo de brecha"],
  },
  timeline: [
    { hora: "Este mes", icon: "arrow-up", texto: "Ausentismo UCI +18%", meta: "3er mes al alza", tono: "warn", cuando: "ahora" },
    { hora: "Sem 30", icon: "graduation", texto: "5 planes de desarrollo completados", meta: "habilitaciones", tono: "good", cuando: "pasado" },
    { hora: "Sem 29", icon: "chart", texto: "Cobertura global superó 92%", tono: "good", cuando: "pasado" },
    { hora: "Próx.", icon: "shield", texto: "Reevaluación trimestral RCP", meta: "48 personas", tono: "info", cuando: "futuro" },
  ],
};

/* ----------------------------- FUNCIONARIO ---------------------------- */
export interface HomeFuncionario {
  tipo: "funcionario";
  narrativa: Narrativa;
  guia: GuiaNex;
  proximoTurno: { fecha: string; hora: string; unidad: string; tipo: string; horas: number; en: string };
  oferta?: { texto: string; plazo: string; incentivo: string };
  bienestar: { turnosMes: number; noches: number; libres: number; carga: number; mensaje: string; tono: Tono };
  desarrollo: { plan: string; progreso: number; nota: string };
  timeline: EventoTL[];
}

const FUNCIONARIO: HomeFuncionario = {
  tipo: "funcionario",
  narrativa: {
    nombre: "Paula",
    contexto: "Enfermera · UCI",
    frase: "Tu próximo turno es hoy a las 22:00 en UCI.",
    foco: "Tenés 1 oferta de cobertura esperando tu respuesta.",
    chips: [
      { icon: "clock", texto: "Turno hoy 22:00", tono: "acc" },
      { icon: "send", texto: "1 oferta pendiente", tono: "warn" },
      { icon: "graduation", texto: "Habilitación 75%", tono: "info" },
    ],
  },
  guia: {
    ocurre: "Tenés un turno noche hoy 22:00 y 1 oferta de cobertura pendiente.",
    hacer: "Respondé la oferta: aceptar o rechazar.",
    recomienda: "Aceptar suma +1 libre compensatorio y tu carga sigue equilibrada.",
    riesgo: "Si no respondés en 2 h, la oferta pasa al siguiente candidato.",
    siguiente: "Si aceptás, tu Jefatura confirma el turno.",
    cta: "Responder oferta",
    ruta: "/coberturas",
  },
  proximoTurno: { fecha: "Hoy", hora: "22:00", unidad: "UCI", tipo: "Noche", horas: 12, en: "empieza en 6 h" },
  oferta: {
    texto: "Cubrir turno noche · UCI · sábado 22:00",
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
  desarrollo: { plan: "Habilitación UCI", progreso: 75, nota: "Falta la validación final de tu Jefatura." },
  timeline: [
    { hora: "Hoy 22:00", icon: "pulse", texto: "Turno noche · UCI", meta: "12 h", tono: "acc", cuando: "futuro" },
    { hora: "Mañana", icon: "check", texto: "Libre", tono: "good", cuando: "futuro" },
    { hora: "Vie", icon: "calendar", texto: "Turno largo · UCI", meta: "12 h", tono: "info", cuando: "futuro" },
    { hora: "Mié próx.", icon: "shield", texto: "Vence reevaluación RCP", tono: "warn", cuando: "futuro" },
  ],
};

/* ----------------------------- ADMINISTRADOR -------------------------- */
export interface HomeAdmin {
  tipo: "administrador";
  narrativa: Narrativa;
  guia: GuiaNex;
  salud: { icon: IconName; label: string; valor: string; estado: Tono; nota: string }[];
  nex: NexInsight;
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
  guia: {
    ocurre: "Cambiaste el umbral de RCP (30 → 45 días); se está propagando.",
    hacer: "Revisá las reevaluaciones afectadas por el cambio.",
    recomienda: "2 personas quedan “por vencer”: conviene avisar a sus jefaturas.",
    riesgo: "Si no se revisa, podrían caducar habilitaciones sin aviso.",
    siguiente: "Se notifica a las jefaturas y se recalculan las alertas.",
    cta: "Ver reevaluaciones",
    ruta: "/administracion",
  },
  salud: [
    { icon: "settings", label: "Reglas activas", valor: "12", estado: "good", nota: "2 propagándose" },
    { icon: "sparkles", label: "Pesos NEX", valor: "OK", estado: "good", nota: "editado hace 2 h" },
    { icon: "swap", label: "Integración RRHH", valor: "En línea", estado: "good", nota: "sync 08:00" },
    { icon: "shield", label: "Reevaluaciones", valor: "88%", estado: "warn", nota: "al día" },
  ],
  nex: {
    titulo: "Revisá el umbral de RCP que cambiaste",
    razon:
      "Subiste el umbral de reevaluación de RCP de 30 a 45 días. Con este cambio, 2 personas quedan marcadas como “por vencer” a partir de hoy.",
    accion: "Ver reevaluaciones afectadas",
    ruta: "/administracion",
    impacto: ["2 personas por vencer", "Alertas recalculadas", "Sin bloqueo de habilitación"],
  },
  timeline: [
    { hora: "08:55", icon: "user-plus", texto: "Alta de usuario: p.ramirez", meta: "Jefatura · UCI", tono: "info", cuando: "pasado" },
    { hora: "08:40", icon: "settings", texto: "Umbral RCP: 30 → 45 días", meta: "propagó a alertas", tono: "warn", cuando: "pasado" },
    { hora: "08:22", icon: "sparkles", texto: "Peso Costo NEX: 25 → 20", meta: "re-ordena recomendaciones", tono: "acc", cuando: "pasado" },
  ],
};

export type HomeData = HomeJefatura | HomeSubdireccion | HomeFuncionario | HomeAdmin;

export function getHome(perfil: Perfil): HomeData {
  switch (perfil) {
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
