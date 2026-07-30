import type { InicioResumen, Perfil } from "@nexshift/contracts";

/**
 * Datos de ejemplo del Inicio por perfil. En producción esto vendrá del
 * backend (módulo Notificaciones/Bandeja + Brechas), pero la forma es la misma
 * (contrato `InicioResumen`). Sirve para tener el Inicio "funcionando" ya.
 */
const SUPERVISOR: InicioResumen = {
  perfil: "supervisor",
  saludo: "Hola, José",
  contexto: "Sede Central · UCI",
  estado: {
    unidad: "UCI",
    requerido: 14,
    disponible: 12,
    semaforo: "riesgo",
    titular: "Tu unidad: en riesgo",
    detalle: "Faltan 2 esta semana · 1 es esta noche",
  },
  guia: {
    queOcurre: "Tu unidad está en riesgo — falta 1 esta noche.",
    queHacer: "Resolvé lo marcado como Ahora",
    siguiente: "La dotación vuelve al verde",
    cta: "Ir a la acción",
  },
  accionPrioritaria: "Turno sin cubrir — UCI, hoy 22:00",
  accionesPrioritarias: [
    {
      id: "a1",
      nivel: "ahora",
      tipo: "cobertura",
      titulo: "Turno con dotación insuficiente — UCI, hoy 22:00",
      porque: "Falta 1 · unidad crítica · turno en horas",
      ctaLabel: "Resolver",
      semaforo: "critico",
      nueva: true,
    },
    {
      id: "a2",
      nivel: "hoy",
      tipo: "solicitud",
      titulo: "3 permisos por responder",
      porque: "1 afecta el turno del jueves",
      ctaLabel: "Responder",
      semaforo: "riesgo",
      nueva: true,
    },
    {
      id: "a3",
      nivel: "semana",
      tipo: "cobertura",
      titulo: "Turno sin cubrir — sábado 14:00",
      porque: "Hay tiempo para organizar",
      ctaLabel: "Resolver",
      semaforo: "exceso",
      nueva: false,
    },
  ],
  indicadores: [
    { clave: "dotacion", etiqueta: "Dotación", valor: "12/14", tono: "warn" },
    { clave: "ausencias", etiqueta: "Ausencias del día", valor: "3", tono: "neutro" },
    { clave: "brechas", etiqueta: "Brechas sin resolver", valor: "2", unidad: "1 crítica", tono: "crit" },
    { clave: "reeval", etiqueta: "Reevaluaciones", valor: "2", unidad: "por vencer", tono: "warn" },
  ],
};

const COORDINADOR: InicioResumen = {
  perfil: "coordinador",
  saludo: "Hola, Marta",
  contexto: "Sede Central · Todas las unidades",
  estado: {
    unidad: "Sede Central",
    requerido: 75,
    disponible: 68,
    semaforo: "critico",
    titular: "5 turnos sin cubrir",
    detalle: "1 crítico está pasando ahora en UCI",
  },
  guia: {
    queOcurre: "1 brecha crítica pasando en UCI.",
    queHacer: "Abrila y enviá la oferta al recomendado",
    siguiente: "El Índice NEX ya tiene 5 candidatos",
    cta: "Resolver ahora",
  },
  accionPrioritaria: "Brecha crítica — UCI, 22 min abierta",
  accionesPrioritarias: [
    {
      id: "c1",
      nivel: "ahora",
      tipo: "cobertura",
      titulo: "UCI · hoy 22:00 · falta 1",
      porque: "22 min abierta · 3 reemplazos habilitados",
      ctaLabel: "Resolver",
      semaforo: "critico",
      nueva: true,
    },
    {
      id: "c2",
      nivel: "ahora",
      tipo: "cobertura",
      titulo: "Urgencias · mañana 08:00 · falta 1",
      porque: "Turno inminente · 2 del equipo de apoyo",
      ctaLabel: "Resolver",
      semaforo: "critico",
      nueva: true,
    },
    {
      id: "c3",
      nivel: "hoy",
      tipo: "oferta",
      titulo: "2 ofertas enviadas sin respuesta",
      porque: "Esperan hace 40 min · quizá reofrecer",
      ctaLabel: "Ver",
      semaforo: "riesgo",
      nueva: false,
    },
  ],
  indicadores: [
    { clave: "dotacion", etiqueta: "Dotación", valor: "68/75", unidad: "faltan 7", tono: "warn" },
    { clave: "ausencias", etiqueta: "Ausencias del día", valor: "11", tono: "neutro" },
    { clave: "brechas", etiqueta: "Brechas sin resolver", valor: "5", unidad: "1 crítica", tono: "crit" },
    { clave: "ofertas", etiqueta: "Ofertas sin respuesta", valor: "2", tono: "warn" },
  ],
};

export function getInicioResumen(perfil: Perfil): InicioResumen {
  return perfil === "coordinador" ? COORDINADOR : SUPERVISOR;
}
