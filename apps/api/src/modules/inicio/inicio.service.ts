import { Injectable } from "@nestjs/common";
import type { InicioResumen, Perfil } from "@nexshift/contracts";

/**
 * Servicio de aplicación del Inicio. En esta fase devuelve datos de ejemplo;
 * más adelante compondrá la respuesta desde Brechas (M5), Notificaciones (M10)
 * y Personal (M1), leyendo los read models — sin lógica de negocio aquí.
 */
@Injectable()
export class InicioService {
  resumen(perfil: Perfil): InicioResumen {
    if (perfil === "coordinador") {
      return {
        perfil,
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
        accionesPrioritarias: [],
        indicadores: [],
      };
    }
    return {
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
      accionesPrioritarias: [],
      indicadores: [],
    };
  }
}
