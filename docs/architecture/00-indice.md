# NEX Shift · Arquitectura — Índice

Este directorio define **cómo está pensado el sistema antes de construir pantallas**. Se lee en orden, de lo funcional a lo técnico.

## Cómo leer esta documentación

1. **[01 · Visión, alcance y glosario](./01-vision-alcance-glosario.md)** — qué problema resuelve NEX Shift y el vocabulario común. Empieza aquí.
2. **[02 · Modelo de dominio](./02-modelo-de-dominio.md)** — las entidades del negocio (funcionario, turno, brecha, cobertura…) y cómo se relacionan.
3. **[03 · Módulos funcionales](./03-modulos-funcionales.md)** — los 10 módulos, qué hace cada uno y de qué depende.
4. **[04 · Flujo brecha → resolución](./04-flujo-brecha-a-resolucion.md)** — el recorrido central de la plataforma, de la detección de una brecha a su cierre.
5. **[05 · Fuente única de verdad (SSOT)](./05-fuente-unica-de-verdad.md)** — el mecanismo por el que un cambio actualiza automáticamente todo lo relacionado.
6. **[06 · Roles y navegación](./06-roles-y-navegacion.md)** — los 5 perfiles, sus permisos y la navegación específica de cada uno.
7. **[07 · Arquitectura técnica](./07-arquitectura-tecnica.md)** — stack, capas, tiempo real y despliegue.
8. **[08 · Modelo de datos](./08-modelo-de-datos.md)** — el esquema físico que materializa la SSOT.
9. **[09 · Eventos de dominio](./09-eventos-de-dominio.md)** — el catálogo de eventos que hacen reactivo al sistema.
10. **[10 · Roadmap de construcción](./10-roadmap.md)** — en qué orden construiremos, fase por fase.

## Principios de arquitectura (resumen)

| # | Principio | Consecuencia práctica |
|---|-----------|------------------------|
| 1 | **Fuente única de verdad** | Cada dato tiene un solo dueño. Nada se copia; se referencia. |
| 2 | **Reactividad por eventos** | Todo cambio emite un evento de dominio; los módulos afectados recalculan solos. |
| 3 | **La brecha es el eje** | Toda la plataforma orbita alrededor de detectar y cerrar brechas de dotación. |
| 4 | **Habilitación primero** | Nadie cubre un puesto para el que no está habilitado. La competencia es una restricción dura. |
| 5 | **Trazabilidad total** | Cada decisión (ausencia, cobertura, cambio de malla) queda auditada con quién, cuándo y por qué. |
| 6 | **Seguridad por rol** | Lo que se ve y lo que se puede hacer depende del perfil (RBAC), no de la pantalla. |
| 7 | **Monolito modular** | Módulos con fronteras claras; se pueden separar en servicios más adelante sin reescribir el dominio. |

## Convenciones

- **Estados** se escriben en `Mayúscula inicial` (p. ej. `Brecha.Detectada`).
- **Eventos de dominio** se nombran en pasado y en inglés técnico para el código, con etiqueta en español para negocio (p. ej. `AbsenceApproved` / *Ausencia aprobada*).
- Los diagramas usan **Mermaid** y se renderizan directamente en GitHub.
