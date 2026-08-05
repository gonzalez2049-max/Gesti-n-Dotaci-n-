import type { InicioResumen, Perfil } from "@nexshift/contracts";

/**
 * Datos de ejemplo del Inicio por perfil. En producción esto vendrá del
 * backend (módulo Notificaciones/Bandeja + Brechas), pero la forma es la misma
 * (contrato `InicioResumen`). Sirve para tener el Inicio "funcionando" ya.
 */
const JEFATURA: InicioResumen = {
  perfil: "jefatura",
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
  accionPrioritaria: "Turno sin cubrir — UCI, hoy 20:00",
  accionesPrioritarias: [
    {
      id: "a1",
      nivel: "ahora",
      tipo: "cobertura",
      titulo: "Turno con dotación insuficiente — UCI, hoy 20:00",
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

// Supervisor/a y Coordinador/a se unificaron en una sola Jefatura, por lo que
// el Inicio de la jefatura es único. Los demás perfiles reutilizan esta base
// hasta tener su propio resumen (Subdirección → Analítica, Funcionario → Mi espacio).
export function getInicioResumen(_perfil: Perfil): InicioResumen {
  return JEFATURA;
}
