# 12 · Inicio / Bandeja — el centro de acción

> **Qué es:** la primera vista al entrar a NEX Shift. **No es un dashboard decorativo**: es el lugar donde el usuario ve *qué está pasando*, *qué necesita su atención* y *qué hacer ahora*. Cambia según el perfil.
>
> **Regla de oro:** cada elemento de Inicio **abre directamente el proceso** que lo resuelve. Si algo no lleva a una acción o a una información útil, no está en Inicio.
>
> **Lenguaje:** escrito para que un enfermero/a lo entienda de un vistazo. Evitamos jerga técnica; usamos palabras del día a día del turno (ver vocabulario en §12.8).

## 12.1 Las tres preguntas que responde Inicio

Inicio está ordenado para responder, en este orden:

1. **¿Qué está pasando ahora?** → el **estado** (el semáforo de tu turno/unidad).
2. **¿Qué necesita mi atención?** → las **acciones prioritarias** (lo urgente y lo riesgoso, primero).
3. **¿Qué hago ahora?** → cada tarjeta tiene un **botón que abre el proceso**.

Todo lo demás (turnos próximos, ausencias recientes, certificaciones por vencer) cuelga de estas tres preguntas.

## 12.2 Anatomía de Inicio (estructura funcional)

```
┌──────────────────────────────────────────────────────────────┐
│ (0) SALUDO + ESTADO                                           │
│     "Hola, Ana. Turno noche · UCI."                           │
│     🟢/🟡/🔴  "Tu unidad está cubierta" / "Faltan 2 personas" │
├──────────────────────────────────────────────────────────────┤
│ (1) ACCIONES PRIORITARIAS  (lo primero, ordenado por riesgo)  │
│     🔴 Ahora   · tarjeta con "qué pasa · por qué · [Abrir]"   │
│     🟠 Hoy     · ...                                          │
│     🟡 Semana  · ...                                          │
│     ⚪ Info     · ...                                          │
├───────────────────────────────┬──────────────────────────────┤
│ (2) INDICADORES (resumen)      │ (3) CÓMO SE ORDENA           │
│  · Estado de dotación          │  riesgo · urgencia ·         │
│  · Turnos próximos             │  fecha · acción requerida    │
│  · Turnos sin cubrir           │                              │
│  · Solicitudes pendientes      │  (explica por qué algo está  │
│  · Coberturas sin resolver     │   arriba)                    │
│  · Ausencias recientes         │                              │
│  · Certificaciones por vencer  │                              │
└───────────────────────────────┴──────────────────────────────┘
```

- **Zona 0 — Estado:** de un vistazo, en lenguaje claro y con semáforo. Es "el titular" del día.
- **Zona 1 — Acciones prioritarias:** el corazón. **Una sola lista** que junta todo lo que requiere acción (turnos sin cubrir, permisos por responder, ofertas, certificaciones por vencer) y lo **ordena por prioridad**, no por módulo. El usuario no quiere revisar seis cajitas; quiere saber *qué hacer primero*.
- **Zona 2 — Indicadores:** el resumen de cada tema, con su número y su acceso directo. Sirve para "ir a mirar" algo puntual aunque no sea urgente.
- **Zona 3 — Cómo se ordena:** transparencia. Explica por qué una tarjeta está arriba (ver §12.3).

## 12.3 Cómo se prioriza (el orden de las tarjetas)

Cada acción recibe una prioridad según **cuatro factores**, en palabras simples:

| Factor | Pregunta que responde | Ejemplo que sube la prioridad |
|--------|------------------------|-------------------------------|
| **Riesgo** | ¿Qué tan grave es si no se resuelve? | UCI o Urgencias; turno bajo el mínimo seguro. |
| **Urgencia** | ¿Cuánto tiempo hay para actuar? | Falta cubrir el turno de esta noche. |
| **Fecha** | ¿Para cuándo es? | Hoy pesa más que el sábado que viene. |
| **Acción requerida** | ¿Depende de mí? | Solo tú puedes aprobar ese permiso. |

Con eso, cada tarjeta cae en un **nivel** con nombre claro:

| Nivel | Significado | Color |
|-------|-------------|-------|
| 🔴 **Ahora** | Grave e inminente. Resolver ya. | Rojo |
| 🟠 **Hoy** | Importante. Resolver durante el día. | Ámbar |
| 🟡 **Esta semana** | Planificar con tiempo. | Azul |
| ⚪ **Para saber** | Solo enterarse, sin acción. | Neutro |

Cada tarjeta muestra su **"por qué"** en una línea: *"UCI · turno de esta noche · falta 1 enfermero/a"*. Nada de números sin contexto.

## 12.4 Qué ve cada perfil en su Inicio

Inicio **cambia según quién entra**. Mismo esqueleto, distinto contenido y alcance.

| Perfil | Su estado (Zona 0) | Sus acciones típicas (Zona 1) | Alcance |
|--------|--------------------|-------------------------------|---------|
| **Funcionario** (enfermero/a) | Su próximo turno y si tiene algo pendiente. | Ofertas para cubrir (aceptar/rechazar), estado de sus permisos, sus certificaciones por vencer, su malla publicada. | Solo lo suyo. |
| **Supervisor** | Dotación **de su unidad**. | Permisos de su equipo por responder, turnos sin cubrir de su unidad, certificaciones del equipo por vencer, licencias nuevas. | Su(s) unidad(es). |
| **Coordinador de Coberturas** | Dónde está "el fuego" (todas las unidades). | Turnos sin cubrir priorizados, ofertas enviadas sin respuesta, brechas escaladas, pool disponible. | Transversal. |
| **Dirección** | Semáforo por sede/unidad. | Brechas críticas o repetidas, aprobaciones de alto costo, tendencias (ausentismo, costo). | Toda la organización. |
| **Administrador** | Salud del sistema. | Usuarios sin rol, configuraciones pendientes, avisos de integración. | Sistema. |

> Ejemplo del contraste: para un **Funcionario**, "esta noche falta un enfermero en UCI" aparece como *"Te ofrecieron cubrir un turno esta noche"*. Para el **Coordinador**, la misma brecha aparece como *"UCI · esta noche · falta 1 · 22 min abierta · 3 candidatos"*. Es **el mismo hecho**, mostrado según lo que cada uno puede hacer con él.

## 12.5 Cada indicador abre su proceso (contrato de navegación)

Ningún indicador es "solo para mirar": **todos abren el proceso correspondiente**.

| Indicador (lenguaje claro) | Qué muestra | Se ordena por | Abre → |
|----------------------------|-------------|---------------|--------|
| **Estado de dotación** | Semáforo de tu unidad/turno. | Riesgo | Coberturas / Programación |
| **Turnos próximos** | Tus próximos turnos (o los del equipo). | Fecha | Mi calendario / Programación |
| **Turnos sin cubrir** *(brechas activas)* | Cuántos puestos faltan y dónde. | Riesgo + urgencia | Panel de resolución de cobertura |
| **Solicitudes pendientes** | Permisos o cambios por responder. | Acción requerida | Aprobación de solicitudes |
| **Coberturas sin resolver** | Reemplazos por gestionar o confirmar. | Urgencia | Panel de resolución de cobertura |
| **Ausencias recientes** | Licencias nuevas que afectan el turno. | Fecha | Ausencias |
| **Certificaciones por vencer** *(reevaluaciones)* | Habilitaciones que caducan pronto. | Fecha | Ficha de la persona / Habilitación |
| **Acciones prioritarias** | La lista combinada y ordenada. | Los 4 factores | Cada proceso, según la tarjeta |

## 12.6 Comportamiento y experiencia

1. **Un vistazo basta.** El estado se entiende sin leer números: semáforo + una frase clara.
2. **De la tarjeta a la acción en un clic.** El botón de cada tarjeta abre el proceso (muchas veces en el **panel de acción contextual**, sin salir de Inicio — ver [11 §11.2](./11-marco-y-experiencia.md#112-el-marco-de-la-aplicación-app-shell)).
3. **Se ordena por prioridad, no por módulo.** Lo más riesgoso y urgente, arriba.
4. **En vivo.** Si una brecha se cubre o un permiso se aprueba, la tarjeta **desaparece sola** de tu lista.
5. **Vacío bueno.** Si no hay nada urgente, se dice con claridad: *"Todo al día. Tu próximo turno es hoy 22:00 en UCI."* No se inventan métricas para llenar espacio.
6. **Sin alarmismo, pero claro.** El rojo se usa solo cuando de verdad es crítico, para que signifique algo.
7. **Nunca ofrece lo imposible.** Si una acción no la puedes hacer tú, no aparece como tuya.

## 12.7 Estados de una tarjeta de acción

Una acción prioritaria pasa por estados visibles:

```
Nueva → Vista → En curso → Resuelta (desaparece)
```

- **Nueva:** recién llegó (marca de "nuevo").
- **Vista:** ya la miraste, sigue pendiente.
- **En curso:** empezaste a resolverla (p. ej. enviaste una oferta de cobertura).
- **Resuelta:** se completó y sale de la lista automáticamente.

## 12.8 Vocabulario claro (para el usuario)

Traducimos los términos internos a palabras del día a día. **En la interfaz mandan las de la derecha.**

| Término interno | En la pantalla (claro) |
|-----------------|------------------------|
| Brecha activa | **Turno sin cubrir** / *Falta gente* |
| Cobertura sin resolver | **Reemplazo por confirmar** |
| Dotación | **Personal del turno** / *el equipo* |
| Dotación objetivo | **Cuánta gente se necesita** |
| Habilitación / reevaluación por vencer | **Certificación por renovar** |
| Solicitud (ausencia/cambio) | **Permiso** / *cambio de turno* |
| Ausencia | **Licencia** / *permiso* |
| Severidad crítica | **Urgente / turno en riesgo** |
| Oferta de cobertura | **Te pidieron cubrir un turno** |
| Pool / flotante | **Equipo de apoyo** |

## 12.9 Qué queda por validar

1. **¿El orden de las tres preguntas** (estado → atención → acción) es el correcto para tu día a día?
2. **¿Los cuatro factores de prioridad** (riesgo, urgencia, fecha, acción requerida) reflejan cómo decides tú qué es lo primero?
3. **¿Los niveles "Ahora / Hoy / Esta semana / Para saber"** son claros, o prefieres otras palabras?
4. **¿El vocabulario de §12.8** es el que usan realmente los enfermeros/as de tu servicio? (¡corrígeme las palabras!)
5. **¿Falta algún indicador** que mires siempre al empezar tu turno?

Con esto validado, avanzamos a la **pantalla** de Inicio para el primer perfil (propongo empezar por **Funcionario**, que es el más usado, o por **Supervisor/Coordinador**, donde vive la resolución de coberturas).
