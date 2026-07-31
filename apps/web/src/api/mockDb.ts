import type {
  Brecha,
  CandidatoNex,
  ConfigRegla,
  AuditEntry,
  MallaSemana,
  PlanDesarrollo,
  Serie,
  SolicitudAusencia,
  CompetenciaPersona,
} from "@nexshift/contracts";

/**
 * Base de datos simulada en memoria. Es la ÚNICA pieza que cambiará cuando
 * conectemos el backend real (PostgreSQL/Prisma/NestJS): la interfaz `api`
 * (api.ts) mantendrá la misma firma y las pantallas no se tocan.
 */

export const db = {
  brechas: [
    {
      id: "b1",
      unidad: "UCI",
      turno: "Noche",
      fecha: "hoy",
      rol: "Enfermero/a",
      severidad: "critica",
      semaforo: "critico",
      deficit: 1,
      minutosAbierta: 22,
      estado: "detectada",
      causa: "Licencia médica de Ana (aprobada hace 22 min)",
    },
    {
      id: "b2",
      unidad: "Urgencias",
      turno: "Largo",
      fecha: "mañana",
      rol: "Enfermero/a",
      severidad: "alta",
      semaforo: "riesgo",
      deficit: 1,
      minutosAbierta: 8,
      estado: "detectada",
      causa: "Aumento de dotación requerida por demanda prevista",
    },
    {
      id: "b3",
      unidad: "Pabellón",
      turno: "Largo",
      fecha: "hoy",
      rol: "Enfermero/a de pabellón",
      severidad: "alta",
      semaforo: "riesgo",
      deficit: 1,
      minutosAbierta: 45,
      estado: "escalada",
      causa: "Escalada a Subdirección: la jefatura no encontró reemplazo interno",
    },
    {
      id: "b4",
      unidad: "Med. Interna",
      turno: "Largo",
      fecha: "sábado",
      rol: "Enfermero/a",
      severidad: "media",
      semaforo: "exceso",
      deficit: 2,
      minutosAbierta: 0,
      estado: "detectada",
      causa: "Vacaciones programadas de dos integrantes",
    },
  ] as Brecha[],

  candidatos: {
    b1: [
      { id: "c1", nombre: "Carla M.", tipoCobertura: "Equipo de apoyo", razon: "Habilitada en UCI · no deja otra brecha", costo: "Sin costo extra", costoTono: "good", score: 85, recomendado: true, factores: [{ clave: "costo", etiqueta: "Costo", valor: 95 }, { clave: "idoneidad", etiqueta: "Idoneidad", valor: 90 }, { clave: "disp", etiqueta: "Disponibilidad", valor: 85 }, { clave: "equidad", etiqueta: "Equidad", valor: 70 }, { clave: "cercania", etiqueta: "Cercanía", valor: 80 }, { clave: "continuidad", etiqueta: "Continuidad", valor: 75 }] },
      { id: "c2", nombre: "Diego P.", tipoCobertura: "Reasignación · M. Interna", razon: "Habilitado · su unidad queda en equilibrio", costo: "Sin costo extra", costoTono: "good", score: 82, recomendado: false, factores: [{ clave: "costo", etiqueta: "Costo", valor: 90 }, { clave: "idoneidad", etiqueta: "Idoneidad", valor: 80 }, { clave: "disp", etiqueta: "Disponibilidad", valor: 70 }, { clave: "equidad", etiqueta: "Equidad", valor: 85 }, { clave: "cercania", etiqueta: "Cercanía", valor: 85 }, { clave: "continuidad", etiqueta: "Continuidad", valor: 80 }] },
      { id: "c3", nombre: "Elena R.", tipoCobertura: "Reasignación", razon: "Habilitada · certificación RCP por vencer", costo: "Sin costo extra", costoTono: "good", score: 75, recomendado: false, alerta: "RCP por vencer · 6 días", factores: [{ clave: "costo", etiqueta: "Costo", valor: 85 }, { clave: "idoneidad", etiqueta: "Idoneidad", valor: 65 }, { clave: "disp", etiqueta: "Disponibilidad", valor: 75 }, { clave: "equidad", etiqueta: "Equidad", valor: 80 }, { clave: "cercania", etiqueta: "Cercanía", valor: 70 }, { clave: "continuidad", etiqueta: "Continuidad", valor: 70 }] },
      { id: "c4", nombre: "Ana G.", tipoCobertura: "Hora extra · de la unidad", razon: "Es de la unidad · disponible de inmediato", costo: "Hora extra · +8 h (costo alto)", costoTono: "warn", score: 64, recomendado: false, alerta: "Ha cubierto mucho esta semana", factores: [{ clave: "costo", etiqueta: "Costo", valor: 45 }, { clave: "idoneidad", etiqueta: "Idoneidad", valor: 88 }, { clave: "disp", etiqueta: "Disponibilidad", valor: 55 }, { clave: "equidad", etiqueta: "Equidad", valor: 40 }, { clave: "cercania", etiqueta: "Cercanía", valor: 90 }, { clave: "continuidad", etiqueta: "Continuidad", valor: 95 }] },
    ],
  } as Record<string, CandidatoNex[]>,

  malla: {
    unidad: "UCI",
    dias: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    requerido: { largo: 2, noche: 2 },
    estado: "borrador",
    personas: [
      { id: "p1", nombre: "Ana G.", celdas: ["largo", "noche", "libre", "libre", "largo", "noche", "libre"], turnosSemana: 4 },
      { id: "p2", nombre: "Carla M.", celdas: ["noche", "libre", "largo", "noche", "libre", "libre", "largo"], turnosSemana: 4 },
      { id: "p3", nombre: "Diego P.", celdas: ["libre", "largo", "noche", "libre", "libre", "largo", "noche"], turnosSemana: 4 },
      { id: "p4", nombre: "Elena R.", celdas: ["largo", "noche", "libre", "libre", "largo", "noche", "libre"], turnosSemana: 4 },
      { id: "p5", nombre: "Luis A.", celdas: ["noche", "libre", "largo", "noche", "libre", "libre", "largo"], turnosSemana: 4 },
    ],
  } as MallaSemana,

  solicitudes: [
    { id: "s1", funcionario: "Ana G.", tipo: "Vacaciones", rango: "Jue 12 – Dom 15 · 4 días", saldo: "Saldo: 12 días", generaBrechas: 1, estado: "pendiente", impacto: [{ turno: "UCI · Jue Noche", resultado: "1/2", tono: "crit" }, { turno: "UCI · Vie Noche", resultado: "2/2", tono: "good" }] },
    { id: "s2", funcionario: "Luis A.", tipo: "Permiso administrativo", rango: "Vie 13 · turno tarde", saldo: "Saldo: 3 permisos", generaBrechas: 0, estado: "pendiente", impacto: [{ turno: "UCI · Vie Largo", resultado: "2/2", tono: "good" }] },
    { id: "s3", funcionario: "Carla M.", tipo: "Capacitación", rango: "Mié 11 · día completo", saldo: "—", generaBrechas: 0, estado: "pendiente", impacto: [{ turno: "UCI · Mié Largo", resultado: "2/2", tono: "warn" }] },
  ] as SolicitudAusencia[],

  competencias: {
    lista: ["Ventilación mecánica", "Drogas vasoactivas", "RCP avanzado", "Triage", "Manejo de pabellón"],
    personas: [
      { nombre: "Ana G.", estados: { "Ventilación mecánica": "vigente", "Drogas vasoactivas": "vigente", "RCP avanzado": "vigente", Triage: "vigente", "Manejo de pabellón": "noHabilitado" } },
      { nombre: "Carla M.", estados: { "Ventilación mecánica": "vigente", "Drogas vasoactivas": "vigente", "RCP avanzado": "vigente", Triage: "vigente", "Manejo de pabellón": "vigente" } },
      { nombre: "Diego P.", estados: { "Ventilación mecánica": "vigente", "Drogas vasoactivas": "vigente", "RCP avanzado": "vigente", Triage: "noHabilitado", "Manejo de pabellón": "noHabilitado" } },
      { nombre: "Elena R.", estados: { "Ventilación mecánica": "vigente", "Drogas vasoactivas": "vigente", "RCP avanzado": "porVencer", Triage: "vigente", "Manejo de pabellón": "noHabilitado" } },
      { nombre: "Paula R.", estados: { "Ventilación mecánica": "enProceso", "Drogas vasoactivas": "enProceso", "RCP avanzado": "vigente", Triage: "vigente", "Manejo de pabellón": "noHabilitado" } },
      { nombre: "Sofía D.", estados: { "Ventilación mecánica": "noHabilitado", "Drogas vasoactivas": "noHabilitado", "RCP avanzado": "vigente", Triage: "noHabilitado", "Manejo de pabellón": "vigente" } },
    ] as CompetenciaPersona[],
  },

  plan: {
    funcionario: "Paula R.",
    objetivo: "Habilitar en UCI",
    progreso: 25,
    acciones: [
      { id: "pa1", tipo: "Orientación", nombre: "Orientación a UCI", responsable: "José M. · Jefatura UCI", estado: "done" },
      { id: "pa2", tipo: "Entrenamiento", nombre: "Entrenamiento: Ventilación mecánica", responsable: "Formación Clínica", estado: "curso" },
      { id: "pa3", tipo: "Entrenamiento", nombre: "Entrenamiento: Drogas vasoactivas", responsable: "Formación Clínica", estado: "pend" },
      { id: "pa4", tipo: "Evaluación", nombre: "Evaluación de desempeño (VM + DVA)", responsable: "Enf. Clínica · evaluadora", estado: "pend" },
    ],
  } as PlanDesarrollo,

  reglas: [
    { clave: "descanso", etiqueta: "Descanso mínimo entre jornadas", valor: 12, unidad: "h", propaga: "valida la malla" },
    { clave: "noches", etiqueta: "Máximo de noches consecutivas", valor: 3, unidad: "", propaga: "valida la malla" },
    { clave: "tope", etiqueta: "Tope de horas por semana", valor: 44, unidad: "h", propaga: "valida malla y pool elegible" },
    { clave: "plazoHoy", etiqueta: "Plazo de respuesta · hoy", valor: 30, unidad: "min", propaga: "reoferta al siguiente candidato" },
    { clave: "porVencer", etiqueta: "Umbral «por vencer»", valor: 30, unidad: "días", propaga: "recalcula reevaluaciones" },
    { clave: "cupos", etiqueta: "Cupos simultáneos por unidad", valor: 2, unidad: "", propaga: "limita aprobaciones de ausencia" },
  ] as ConfigRegla[],

  pesosNex: [
    { clave: "Costo", valor: 25 },
    { clave: "Idoneidad", valor: 20 },
    { clave: "Disponibilidad", valor: 20 },
    { clave: "Equidad", valor: 15 },
    { clave: "Cercanía", valor: 10 },
    { clave: "Continuidad", valor: 10 },
  ],

  auditoria: [
    { hora: "08:55", area: "Estructura", accion: "Alta de usuario: p.ramirez", detalle: "Jefatura · UCI" },
    { hora: "08:40", area: "Reglas", accion: "Umbral RCP: 30 → 45 días", detalle: "propagó a alertas de reevaluación" },
    { hora: "08:22", area: "Pesos NEX", accion: "Peso Costo: 25 → 20", detalle: "re-ordena recomendaciones" },
  ] as AuditEntry[],

  usuarios: [
    { usuario: "j.morales", rol: "Jefatura", alcance: "UCI", estado: "Activo" },
    { usuario: "m.lagos", rol: "Jefatura", alcance: "Sede Central", estado: "Activo" },
    { usuario: "p.ramirez", rol: "Jefatura", alcance: "UCI", estado: "Activo" },
    { usuario: "admin", rol: "Administrador", alcance: "Global", estado: "Activo" },
  ],

  planner: {
    requerido: {
      UCI: { largo: 2, noche: 2 },
      Urgencias: { largo: 3, noche: 2 },
      "Pabellón": { largo: 2, noche: 1 },
    } as Record<string, { largo: number; noche: number }>,
    personas: [
      { id: "f1", nombre: "Ana González", iniciales: "AG", estamento: "Enfermero/a", unidad: "UCI", equipo: "Equipo A", patronOffset: 0, habilitado: true },
      { id: "f2", nombre: "Carla Muñoz", iniciales: "CM", estamento: "Enfermero/a", unidad: "UCI", equipo: "Equipo A", patronOffset: 1, habilitado: true },
      { id: "f3", nombre: "Diego Pérez", iniciales: "DP", estamento: "Enfermero/a", unidad: "UCI", equipo: "Equipo B", patronOffset: 2, habilitado: true },
      { id: "f4", nombre: "Elena Rojas", iniciales: "ER", estamento: "Enfermero/a", unidad: "UCI", equipo: "Equipo B", patronOffset: 3, habilitado: true },
      { id: "f5", nombre: "Luis Araya", iniciales: "LA", estamento: "TENS", unidad: "UCI", equipo: "Equipo A", patronOffset: 0, habilitado: true },
      { id: "f6", nombre: "Paula Reyes", iniciales: "PR", estamento: "Enfermero/a", unidad: "UCI", equipo: "Apoyo", patronOffset: 2, habilitado: false },
      { id: "f7", nombre: "Sofía Díaz", iniciales: "SD", estamento: "TENS", unidad: "UCI", equipo: "Equipo B", patronOffset: 1, habilitado: true },
      { id: "f8", nombre: "Tomás Vega", iniciales: "TV", estamento: "Enfermero/a", unidad: "UCI", equipo: "Apoyo", patronOffset: 3, habilitado: true },
      { id: "f9", nombre: "Rocío Silva", iniciales: "RS", estamento: "Enfermero/a", unidad: "Urgencias", equipo: "Equipo A", patronOffset: 0, habilitado: true },
      { id: "f10", nombre: "Mateo Fuentes", iniciales: "MF", estamento: "TENS", unidad: "Urgencias", equipo: "Equipo A", patronOffset: 2, habilitado: true },
      { id: "f11", nombre: "Javiera Soto", iniciales: "JS", estamento: "Enfermero/a", unidad: "Urgencias", equipo: "Equipo B", patronOffset: 1, habilitado: true },
      { id: "f12", nombre: "Camila Torres", iniciales: "CT", estamento: "Matrón/a", unidad: "Pabellón", equipo: "Equipo A", patronOffset: 0, habilitado: true },
      { id: "f13", nombre: "Ignacio Bravo", iniciales: "IB", estamento: "Enfermero/a", unidad: "Pabellón", equipo: "Equipo B", patronOffset: 2, habilitado: true },
    ],
  },

  analitica: {
    kpis: [
      { clave: "cobertura", etiqueta: "Cobertura de dotación", valor: "91", unidad: "%", delta: "▼ 3 pts", tono: "warn", spark: [95, 94, 93, 93, 92, 91] },
      { clave: "ausentismo", etiqueta: "Ausentismo", valor: "9,1", unidad: "%", delta: "▲ 2,9 pts", tono: "crit", spark: [6.2, 6.8, 7.1, 7.9, 8.4, 9.1] },
      { clave: "tiempo", etiqueta: "Tiempo medio cobertura", valor: "42", unidad: "min", delta: "▲ 14", tono: "warn", spark: [28, 31, 30, 35, 38, 42] },
      { clave: "costo", etiqueta: "Costo coberturas / mes", valor: "101", unidad: "UF", delta: "▲ 74%", tono: "crit", spark: [48, 55, 62, 75, 89, 101] },
    ],
    ausentismo: { labels: ["Feb", "Mar", "Abr", "May", "Jun", "Jul"], series: [{ nombre: "Ausentismo", colorVar: "--c1", valores: [6.2, 6.8, 7.1, 7.9, 8.4, 9.1] }], unidad: "%" } as Serie,
    costos: { labels: ["Feb", "Mar", "Abr", "May", "Jun", "Jul"], series: [{ nombre: "Hora extra", colorVar: "--c1", valores: [30, 34, 38, 45, 52, 58] }, { nombre: "Adicional", colorVar: "--c2", valores: [8, 9, 9, 10, 11, 12] }, { nombre: "Externo", colorVar: "--c3", valores: [10, 12, 15, 20, 26, 31] }] } as Serie,
    unidadesCriticas: [
      { unidad: "UCI", valor: 82, tono: "crit", factores: ["Brecha crónica", "Ausentismo 11%", "Pool frágil (5)"] },
      { unidad: "Urgencias", valor: 74, tono: "crit", factores: ["Ausentismo 10%", "Tiempo de cobertura alto"] },
      { unidad: "Pabellón", valor: 58, tono: "warn", factores: ["Pool frágil (4)", "Certificación por vencer"] },
      { unidad: "Med. Interna", valor: 41, tono: "warn", factores: ["Sobrecarga moderada"] },
    ],
  },
};

export type Db = typeof db;
