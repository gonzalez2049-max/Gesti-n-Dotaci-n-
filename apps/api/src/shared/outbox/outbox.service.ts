import { Injectable } from "@nestjs/common";
import type { DomainEvent, TipoEvento } from "@nexshift/contracts";

/**
 * Patrón Outbox (doc 05 §5.4): el cambio de datos y el registro del evento se
 * guardan en la MISMA transacción; un relay publica luego al bus. Esto garantiza
 * la propagación (fuente única de verdad reactiva).
 *
 * Esqueleto para la fase de construcción del backend. La implementación real
 * escribirá en la tabla `outbox` dentro de la transacción de escritura y un
 * worker publicará a Redis/BullMQ con entrega at-least-once + idempotencia.
 */
@Injectable()
export class OutboxService {
  /**
   * Encola un evento de dominio en la tabla outbox dentro de la transacción
   * en curso (se inyectará el `tx` de Prisma en la implementación real).
   */
  async enqueue<TPayload extends Record<string, unknown>>(
    tipo: TipoEvento,
    event: Omit<DomainEvent<TPayload>, "tipo">,
  ): Promise<void> {
    // TODO(build): INSERT INTO outbox (...) usando la misma transacción.
    void tipo;
    void event;
  }
}
