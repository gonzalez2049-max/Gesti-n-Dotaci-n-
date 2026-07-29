# 13 · Pantalla de Inicio — Supervisor / Coordinador

> **Objetivo de la pantalla:** que el perfil operativo pueda **detectar, priorizar y resolver** un problema de dotación **sin recorrer varios módulos**. Todo ocurre en Inicio; el detalle y la resolución se hacen en un **panel lateral**.
>
> Basado en las decisiones validadas en [12 · Inicio / Bandeja](./12-inicio-bandeja.md).

## 13.1 Diferencia Supervisor vs. Coordinador

Es **la misma pantalla** con distinto **alcance**, conmutable con un selector arriba:

| | Supervisor | Coordinador de Coberturas |
|--|-----------|---------------------------|
| Alcance | **Mi unidad** (p. ej. UCI) | **Todas las unidades** de la sede |
| Foco | Su servicio: aprobar, cubrir o escalar | El "fuego" transversal: resolver la cola |
| Puede | Resolver dentro de su unidad, **escalar** lo que no puede | Resolver en cualquier unidad, recibir **escaladas** |

El selector **Mi unidad ▸ / Todas las unidades ▸** cambia los datos, no la estructura.

## 13.2 Estructura de la pantalla

```
┌───────────────────────────────────────────────────────────────────────┐
│ CONTEXTO: NEX Shift · Sede Central · [Mi unidad ▾] · 🔎 · José ▾        │
├───────────────────────────────────────────────┬───────────────────────┤
│ ESTADO  🟠  Tu unidad: en riesgo                │                       │
│         Dotación 12 / 14 · faltan 2             │   PANEL LATERAL       │
│                                                 │   (detalle + resolver)│
│ INDICADORES (6 fijas, compactas)                │                       │
│  [Dotación] [Ausencias hoy] [Brechas]           │   Se abre al tocar    │
│  [Coberturas] [Turno en riesgo] [Reevaluac.]    │   una tarjeta o       │
│                                                 │   "Resolver".         │
│ ACCIONES PRIORITARIAS  (tarjetas compactas)     │                       │
│  ── Ahora ──                                    │   Aquí se elige el    │
│   ▸ Brecha crítica UCI · hoy 22:00  [Resolver]  │   reemplazo y se      │
│  ── Hoy ──                                      │   envía la oferta,    │
│   ▸ 3 permisos por responder        [Responder] │   sin cambiar de      │
│  ── Esta semana ──                              │   pantalla.           │
│   ▸ Brecha sábado 14:00             [Resolver]  │                       │
│  ── Para revisar ──                             │                       │
│   ▸ Nueva licencia médica           [Ver]       │                       │
└───────────────────────────────────────────────┴───────────────────────┘
```

Tres bloques de arriba hacia abajo — **estado, indicadores, acciones** — y un **panel lateral** que aparece a la derecha (o como cajón sobre el contenido en pantallas angostas).

## 13.3 Bloque 1 · Estado (una línea, un semáforo)

- Semáforo grande + frase clara: *"Tu unidad: en riesgo"*.
- Debajo, el dato duro en lenguaje de dotación: **Dotación 12 / 14 · faltan 2** (disponible / requerido).
- Para Coordinador, el estado es agregado: *"5 turnos con dotación insuficiente · 1 crítico ahora"*.

## 13.4 Bloque 2 · Indicadores principales (6, compactas y accionables)

Seis tarjetas compactas, siempre las mismas, cada una **abre su proceso** (muchas veces en el mismo panel lateral):

| Indicador | Ejemplo (Supervisor) | Señal | Abre |
|-----------|----------------------|-------|------|
| **Dotación actual vs. requerida** | 12 / 14 · faltan 2 | Ámbar | Panel: brechas de la unidad |
| **Ausencias del día** | 3 hoy | — | Panel: quiénes y por qué |
| **Brechas sin resolver** | 2 · 1 crítica | Rojo | Panel: lista priorizada |
| **Coberturas en proceso** | 1 · oferta enviada | — | Panel: estado del reemplazo |
| **Próximo turno en riesgo** | Hoy 22:00 · UCI | Rojo | Panel: resolución del turno |
| **Reevaluaciones pendientes** | 2 esta semana | Ámbar | Panel: personas y vencimientos |

## 13.5 Bloque 3 · Acciones prioritarias (tarjetas compactas)

- Una sola lista, **agrupada por nivel** (Ahora / Hoy / Esta semana / Para revisar) y ordenada por los 4 factores.
- Cada tarjeta es **compacta**: nivel + qué pasa + una línea de "por qué" + **una acción directa**.
- La acción directa depende del tipo:
  - Brecha → **Resolver** (abre panel con reemplazos).
  - Solicitud → **Responder** (aprobar/rechazar en el panel).
  - Reevaluación → **Ver** (personas y vencimientos).
  - Licencia nueva → **Ver** (detalle e impacto).

## 13.6 El panel lateral: resolver sin salir de Inicio

Es lo que evita "recorrer varios módulos". Al tocar **Resolver** en una brecha, el panel muestra **todo lo necesario para decidir**:

```
┌─ PANEL: Resolver turno con dotación insuficiente ──────────┐
│ 🔴 Ahora · Crítica                                         │
│ UCI · Turno noche 22:00–06:00 · hoy · Enfermero/a          │
│ Dotación: requerido 5 · disponible 4 · falta 1            │
│ Causa: licencia médica de Ana (aprobada hace 22 min)      │
│                                                            │
│ REEMPLAZOS DISPONIBLES  (solo personal habilitado)         │
│  1 ⭐ Carla M. · Equipo de apoyo · habilitada UCI ✓        │
│       0 h extra · impacto bajo         [Enviar oferta]     │
│  2  Diego P. · Reasignación (M. Interna) · habilitado ✓    │
│       deja su unidad en equilibrio     [Enviar oferta]     │
│  3  Rodrigo S. · Hora extra · habilitado ✓                 │
│       +8 h (sobre tope ⚠) · costo alto [Enviar oferta]     │
│                                                            │
│  ⓘ 2 personas no aparecen: reevaluación vencida           │
│                                                            │
│  [Escalar a Coordinación]                                  │
└────────────────────────────────────────────────────────────┘
```

Claves del panel:
1. **Contexto completo arriba:** qué falta, dónde, cuándo y **por qué** (la causa).
2. **Solo opciones válidas:** el sistema oculta a quien no está habilitado o superaría su tope; lo dice explícitamente para dar confianza.
3. **Comparables de un vistazo:** cada reemplazo muestra tipo, habilitación, horas e impacto/costo. El recomendado va marcado (⭐).
4. **Acción en el panel:** *Enviar oferta* deja la cobertura **en gestión** (la tarjeta pasa a "En curso") sin abrir otro módulo.
5. **Salida de escape:** *Escalar a Coordinación* cuando no hay opción viable.

## 13.7 El recorrido en la pantalla (detectar → priorizar → resolver)

1. **Detectar:** el estado en ámbar/rojo y el indicador "Brechas sin resolver" avisan.
2. **Priorizar:** la tarjeta crítica está en **Ahora**, arriba de todo, con su "por qué".
3. **Resolver:** un toque en **Resolver** abre el panel; se elige el reemplazo recomendado y se **envía la oferta**. La tarjeta pasa a *En curso*; al aceptar la persona, **desaparece** y la dotación vuelve a 14/14.

Todo sin salir de Inicio.

## 13.8 Reglas de experiencia específicas

- **Compacto por defecto, detalle bajo demanda:** las tarjetas no abruman; el detalle vive en el panel.
- **Una acción principal por tarjeta:** nada de menús con seis opciones.
- **En vivo:** lo resuelto se va solo; los contadores de arriba bajan al instante.
- **Confianza:** el panel siempre explica *por qué* falta gente y *por qué* estos candidatos (y no otros).
- **Lenguaje operativo** de [12 §12.8](./12-inicio-bandeja.md#128-vocabulario-claro-para-el-usuario) en toda la pantalla.

## 13.9 Qué validar de esta pantalla

1. ¿El **panel lateral** con reemplazos comparables es la forma correcta de resolver, o esperas algo distinto?
2. ¿El orden **estado → indicadores → acciones** funciona, o prefieres las acciones primero?
3. ¿Los **reemplazos** deben mostrar el **costo** explícito (hora extra, refuerzo) al Supervisor, o eso solo lo ve Dirección/Coordinador?
4. ¿*Escalar a Coordinación* es el paso correcto cuando el Supervisor no puede cubrir?
