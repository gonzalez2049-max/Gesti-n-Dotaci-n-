# 22 · Inicio del Funcionario

> **Qué es:** la primera pantalla del **enfermero/a** (y de todo funcionario) al entrar a NEX Shift. Mismo principio que el resto del sistema — **"tu trabajo te llega, no vas a buscarlo"** — pero centrado en **la persona**: su turno, sus pendientes, las ofertas para cubrir, sus permisos, sus certificaciones y su desarrollo.
>
> Cierra el recorrido de perfiles: es el **lado del funcionario** de flujos que ya diseñamos (coberturas, ausencias, habilitación, desarrollo).

## 22.1 Propósito y alcance

- **Personal y acotado:** el funcionario ve **solo lo suyo**. No ve brechas de gestión, ni la cola de coberturas, ni otros candidatos, ni costos.
- **Orientado a la acción:** lo primero son las **cosas que solo él puede hacer** — aceptar/rechazar una oferta, responder por una certificación, revisar su permiso.
- **Lenguaje claro:** el mismo vocabulario operativo de [12 · Inicio](./12-inicio-bandeja.md#128-vocabulario-claro-para-el-usuario) (turno, reemplazo, certificación, permiso).

## 22.2 Anatomía

```
┌──────────────────────────────────────────────────────────────┐
│ (0) SALUDO + ESTADO PERSONAL                                 │
│     "Hola, Paula. Tu próximo turno: hoy 22:00 · UCI."        │
│     "Tienes 1 oferta por responder."                        │
├──────────────────────────────────────────────────────────────┤
│ (1) MIS ACCIONES  (Ahora · Hoy · Esta semana · Para revisar) │
│     🔴 Te pidieron cubrir un turno   [Responder]             │
│     🟠 Renueva tu certificación      [Agendar]              │
│     🟡 Avanza tu plan de desarrollo  [Ver]                  │
│     ⚪ Tu permiso fue aprobado        [Ver]                  │
├───────────────────────────────┬──────────────────────────────┤
│ (2) MIS INDICADORES            │ (3) MI SEMANA                │
│  próximo turno · turnos ·      │  L M X J V S D (mis turnos)  │
│  ofertas · feriado legal ·     │                              │
│  certificación por vencer ·    │ (4) OFRECER DISPONIBILIDAD   │
│  mi plan de desarrollo         │  "Estoy disponible para…"    │
└───────────────────────────────┴──────────────────────────────┘
```

Mismo esqueleto que el Inicio operativo ([13](./13-inicio-supervisor-coordinador.md)), pero cada elemento habla de **la persona**.

## 22.3 Mis acciones (lo primero)

Una sola lista, ordenada por los mismos niveles (Ahora/Hoy/Esta semana/Para revisar). Ejemplos:

| Nivel | Acción típica | Abre |
|-------|---------------|------|
| 🔴 **Ahora** | *Te pidieron cubrir un turno* (con plazo de respuesta). | Panel de respuesta (aceptar/rechazar). |
| 🟠 **Hoy** | *Renueva tu certificación* (por vencer). | Agendar recertificación (Desarrollo). |
| 🟡 **Esta semana** | *Avanza tu plan de desarrollo* (te falta una acción). | Mi desarrollo. |
| ⚪ **Para revisar** | *Tu permiso fue aprobado* · *se publicó tu turno*. | Mis permisos / Mi calendario. |

## 22.4 Aceptar o rechazar una cobertura (lado del funcionario)

Es la acción más importante de esta pantalla. Al abrir una oferta, el funcionario ve **lo justo para decidir**:

- **Qué turno:** unidad, horario, fecha.
- **Por qué le llega:** es **elegible** (habilitado) y está disponible.
- **Hasta cuándo puede responder:** el plazo según urgencia (hoy 30 min · mañana 2 h · posteriores 6 h — [14](./14-flujo-resolucion-cobertura.md)).

Dos caminos:
- **Aceptar** → la cobertura queda *Aceptada* y **a la espera de la confirmación de su Supervisor** (la validación humana de [14](./14-flujo-resolucion-cobertura.md)). El funcionario lo ve reflejado.
- **Rechazar** → **pide un motivo** (obligatorio, [14](./14-flujo-resolucion-cobertura.md)); el sistema lo registra y reofrece al siguiente. Sin culpa ni fricción.

**Estado completo de la cobertura (confirmado).** El funcionario ve **todo el recorrido de su oferta**, no solo el resultado:

```
Oferta recibida → Aceptada → Pendiente de confirmación → Confirmada
                ↘ Rechazada
```

En cada momento sabe exactamente en qué punto está ("aceptaste, esperando confirmación de tu supervisor", "confirmada: el turno es tuyo").

> El funcionario **no ve** a los demás candidatos ni el ranking: solo su propia oferta.

## 22.5 Ofrecer disponibilidad (proactivo)

El funcionario puede **ofrecerse** para cubrir ventanas. **Confirmado: la disponibilidad se registra por día y turno** (p. ej. *"sábado, turno Noche"*), no solo por día. Esto:
- Lo hace aparecer antes cuando surge una brecha **compatible** con ese día y turno.
- **Mejora su posición** en el Índice NEX (cercanía/disponibilidad), sin saltarse la elegibilidad.
- Es voluntario y reversible.

## 22.6 Mi desarrollo, mis competencias y vencimientos

Ventana personal a [Habilitación](./17-habilitacion-competencias.md) y [Desarrollo](./20-desarrollo-profesional.md):
- **Mis competencias** y en qué **unidades estoy habilitado**.
- **Qué vence pronto** (mi "reevaluación pendiente").
- **Mi plan de desarrollo** con su progreso (p. ej. *"habilitarme en UCI: 75%"*).

Así el funcionario entiende **cómo crece** y qué gana (más turnos, más unidades).

## 22.7 Trazabilidad de mi propia cobertura

Coherente con lo validado en [14 §14.5](./14-flujo-resolucion-cobertura.md): el funcionario ve el **historial de su propia oferta y cobertura** (qué le ofrecieron, qué respondió, en qué quedó) — **nunca** la información de otros candidatos.

## 22.8 Qué ve y qué NO ve

| Ve | No ve |
|----|-------|
| Su próximo turno y su semana. | La malla completa de la unidad. |
| Las ofertas dirigidas a él. | La cola de brechas / otras coberturas. |
| El estado de sus permisos y su saldo. | Solicitudes de otros. |
| Sus competencias, vencimientos y su plan. | La matriz del equipo. |
| El historial de su propia cobertura. | Otros candidatos, ranking o costos. |

## 22.9 Decisiones validadas

- ✅ **Orden:** estado y acciones primero; el **calendario después**.
- ✅ **Disponibilidad por día y turno** (no solo por día).
- ✅ **Saldos visibles:** feriado legal, permisos administrativos y compensatorios (fuente RR.HH.).
- ✅ **Estado completo de la cobertura:** oferta recibida · aceptada · pendiente de confirmación · confirmada · rechazada.

Con este módulo se cierra el recorrido de los cinco perfiles. Índice del sistema: [00 · Índice](./00-indice.md) y la **portada navegable**.
