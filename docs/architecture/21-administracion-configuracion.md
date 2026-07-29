# 21 · Administración y Configuración (M9)

> **Qué es:** el **panel de control** del sistema. Aquí viven todas las perillas que a lo largo de la arquitectura dijimos "configurable por el Administrador": usuarios, roles y permisos, estructura organizativa, estamentos, jornadas y turnos, reglas, requisitos, **pesos del Índice NEX**, catálogos y **auditoría**.
>
> **Dos garantías centrales:** todo cambio queda **auditado** (quién, cuándo, valor anterior → nuevo) y **se propaga** automáticamente a los módulos afectados (fuente única de verdad).

## 21.1 Principios

1. **Un solo lugar para gobernar.** Todo lo configurable del sistema se administra desde aquí; los módulos **consumen** esa configuración, no la duplican.
2. **Todo cambio se audita.** Ninguna perilla se mueve sin dejar rastro: actor, fecha, valor previo y nuevo, motivo cuando corresponde.
3. **Todo cambio se propaga.** Cambiar un umbral o un peso **recalcula** lo que depende de él, sin tocar cada módulo a mano (ver §21.9).
4. **Separación de funciones.** Solo el **Administrador** configura. Cambios sobre los **permisos mismos** llevan auditoría reforzada.
5. **Ámbito jerárquico.** Hay valores **globales** y **anulaciones por unidad** (una UCI puede tener reglas propias sobre la base global).

## 21.2 Áreas de administración

| Área | Qué se administra |
|------|-------------------|
| **Usuarios y accesos** | Usuarios, roles de seguridad, permisos (RBAC), vínculo usuario↔funcionario. |
| **Estructura organizativa** | Organización, sedes, unidades (criticidad), **estamentos**. |
| **Jornadas y turnos** | Turnos y horarios, **patrones** (cuarto turno y otros), tipos de jornada/contrato y topes. |
| **Reglas** | Reglas duras de malla, de ausencias, de cobertura y umbrales de alerta. |
| **Requisitos y catálogos** | Competencias, requisitos mínimos por unidad×estamento, tipos de ausencia, capacitaciones, motivos de rechazo. |
| **Pesos del Índice NEX** | Pesos de los factores (global, por urgencia, por unidad). |
| **Auditoría** | Registro append-only de todos los cambios y acciones sensibles. |

## 21.3 Usuarios, roles y permisos (RBAC)

- **Usuarios:** identidad de acceso; puede vincularse a un **funcionario** (para que su rol de sistema y su ficha operativa sean la misma persona). Estado, último acceso, método de autenticación.
- **Roles de seguridad:** Administrador, Subdirección, Supervisor, Coordinador de Coberturas, Funcionario. Un usuario puede tener **más de un rol** y **alcance por unidad**.
- **Permisos (RBAC):** la **matriz de [06 · Roles](./06-roles-y-navegacion.md)** se materializa aquí: por rol, qué puede hacer en cada módulo (Crear/Leer/Editar/Aprobar) y con qué **alcance** (propio / unidad / transversal / global).
- **La matriz es la fuente de verdad de la seguridad:** las pantallas y las APIs derivan de ella; cambiarla aquí cambia lo que cada perfil ve y puede hacer.

## 21.4 Estructura organizativa y estamentos

- **Organización → sedes → unidades**, con la **criticidad** de cada unidad (alimenta la severidad de brechas y el índice de unidades críticas).
- **Estamentos:** categorías profesionales (enfermero/a, TENS, matrón/a, médico/a…). Los **requisitos mínimos** y las **reglas** pueden variar por estamento.

## 21.5 Jornadas y turnos

- **Turnos y horarios:** definición de los bloques (p. ej. Largo 08–20, Noche 20–08, Libre).
- **Patrones:** el **cuarto turno** (Largo → Noche → Libre → Libre) como base, con **excepciones y otros patrones** configurables.
- **Tipos de jornada/contrato:** FTE, **topes de horas** semanales/mensuales que usan la malla y el Índice NEX.

## 21.6 Reglas

Centraliza los umbrales que cada módulo aplica:

| Grupo | Reglas configurables |
|-------|----------------------|
| **Malla (duras)** | Descanso mínimo entre jornadas, máximo de noches consecutivas, tope de horas, dotación mínima de seguridad. |
| **Ausencias** | Cupos simultáneos **por unidad, tipo y estamento**, antelación mínima, exigencias de documentación. |
| **Cobertura** | Plazos por urgencia (hoy 30 min · mañana 2 h · posteriores 6 h), jerarquía de opciones de cobertura, envío secuencial. |
| **Brechas** | Fórmula/umbrales de **severidad** (magnitud, criticidad, proximidad). |
| **Habilitación** | Umbral **"por vencer"** (30 días por defecto, **por competencia**). |

## 21.7 Requisitos y catálogos

- **Catálogo de competencias** (ventilación mecánica, drogas vasoactivas, RCP, triage, pabellón…).
- **Requisitos mínimos por unidad × estamento** (lo único que bloquea una cobertura en otra unidad — ver [17](./17-habilitacion-competencias.md)).
- **Catálogo de tipos de ausencia** (con sus atributos: requiere aprobación, afecta disponibilidad, consume saldo…).
- **Catálogo de capacitaciones** (orientaciones, cursos, entrenamientos) que usan los planes de [Desarrollo](./20-desarrollo-profesional.md).
- **Motivos de rechazo** de cobertura, motivos de excepción, etc.

## 21.8 Pesos del Índice NEX

- Configuración de los **pesos de los seis factores** del [Índice NEX](./18-indice-nex.md): global, **perfiles por urgencia** (urgente/planificado) y **por unidad**.
- Aquí se administra **quién puede ajustarlos** (Administrador; y, si se define, Coordinador para su operación — decisión pendiente de validar).
- **No** se configura aquí la compuerta de habilitación (eso es requisito, no peso): la elegibilidad es dura; NEX solo ordena.

## 21.9 Propagación de cambios (SSOT reactiva)

Cambiar configuración **no es** editar un texto muerto: dispara recálculos. Ejemplos:

| Cambio de configuración | Se propaga a… |
|-------------------------|---------------|
| Sube la **criticidad** de una unidad | Severidad de sus brechas y ranking de unidades críticas. |
| Cambia un **requisito mínimo** de unidad | Re-evalúa la **elegibilidad** (quién puede cubrirla). |
| Ajusta los **pesos NEX** | **Re-ordena** las recomendaciones de cobertura. |
| Baja el **umbral "por vencer"** | Recalcula alertas de reevaluación pendientes. |
| Cambia el **tope de horas** | Afecta validación de malla y el pool elegible. |
| Cambia **cupos simultáneos** de ausencia | Cambia qué solicitudes se pueden aprobar. |

Cada cambio emite `ConfiguracionCambiada`; los módulos afectados reaccionan ([09 · Eventos](./09-eventos-de-dominio.md)).

## 21.10 Auditoría

- **Registro append-only** (no editable, no borrable) de: cambios de configuración, altas/bajas de usuarios y roles, cambios de permisos, **excepciones autorizadas** (p. ej. habilitación de excepción — solo Administrador), y acciones sensibles.
- Cada entrada: **actor · fecha/hora · entidad · valor anterior → nuevo · motivo** (cuando aplica).
- **Consultable y filtrable** por actor, entidad, tipo y período.
- **Subdirección** puede **leer** la auditoría (transparencia), pero **no configurar**.

## 21.11 Quién accede

| Perfil | Acceso a Administración |
|--------|-------------------------|
| **Administrador** | Total: todas las áreas. |
| **Subdirección** | Solo lectura de **auditoría** e indicadores; no configura. |
| **Supervisor / Coordinador / Funcionario** | Sin acceso (su configuración operativa vive en sus propios módulos). |

## 21.12 Qué validar

1. **¿Las áreas de §21.2** cubren todo lo que necesitas configurar, o falta algún catálogo/regla?
2. **¿El modelo de anulaciones por unidad** (global + override por unidad) es necesario, o basta con configuración global?
3. **¿Quién ajusta los pesos NEX** — solo Administrador, o también Coordinador para su operación?
4. **¿La auditoría** debe registrar también las **lecturas sensibles** (quién consultó qué), o solo los cambios?
5. **¿Se requiere doble confirmación / flujo de aprobación** para cambios críticos (permisos, reglas duras), o basta con auditar?
