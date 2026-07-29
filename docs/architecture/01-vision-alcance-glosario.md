# 01 · Visión, alcance y glosario

## 1.1 Visión

NEX Shift es una **plataforma de inteligencia operativa** para organizaciones clínicas (hospitales, clínicas, servicios asistenciales). Su propósito no es solo "armar la malla de turnos", sino **cerrar el ciclo completo de la dotación**:

> **Detectar** una brecha entre el personal necesario y el disponible → **priorizarla** → **resolverla** con la mejor cobertura posible → **aprender** de lo ocurrido para anticipar la próxima.

La diferencia con una planilla o un sistema de turnos tradicional es que NEX Shift **conecta la programación con las ausencias, las competencias del personal, el desarrollo profesional y la analítica** en un único sistema reactivo: cuando algo cambia (una licencia médica, una habilitación que vence, un turno que se modifica), el sistema **recalcula automáticamente** el impacto y, si aparece una brecha, la pone frente a quien debe resolverla.

## 1.2 Problema que resuelve

| Dolor actual | Cómo lo resuelve NEX Shift |
|--------------|----------------------------|
| Las brechas se descubren tarde (el día del turno). | Motor de detección continua: la brecha aparece en cuanto se genera su causa. |
| Se cubre con quien esté disponible, sin verificar habilitación. | La habilitación es una **restricción dura**: el sistema solo ofrece candidatos válidos. |
| La información vive en planillas separadas y desactualizadas. | Fuente única de verdad: un cambio se refleja en todos los módulos al instante. |
| No se sabe el costo real de las coberturas. | Cada opción de cobertura muestra su costo e impacto antes de confirmarla. |
| No hay memoria: los mismos problemas se repiten. | Analítica y forecasting sobre datos históricos reales del propio sistema. |
| El desarrollo del personal está desconectado de la operación. | El plan de desarrollo alimenta las habilitaciones que amplían la capacidad de cobertura. |

## 1.3 Alcance

### Dentro del alcance (v1 → v3)
- Gestión de personal, unidades y dotación objetivo.
- Habilitación y competencias con vencimientos.
- Programación de turnos (malla) por unidad.
- Gestión de ausencias con flujo de aprobación.
- Motor de detección de brechas.
- Gestión y resolución de coberturas.
- Desarrollo profesional (planes, formación, carrera).
- Analítica, KPIs y forecasting.
- Administración, seguridad (RBAC) y auditoría.
- Notificaciones y bandeja de tareas.

### Fuera del alcance (por ahora)
- Nómina/remuneraciones (se integra vía API, no se calcula aquí).
- Ficha clínica del paciente (NEX Shift gestiona **personal**, no pacientes).
- Marcaje biométrico de asistencia (se puede integrar como fuente externa).

## 1.4 Glosario (vocabulario común)

Este glosario es **normativo**: los términos aquí definidos son los que usan el código, la base de datos y las pantallas.

| Término | Definición |
|---------|-----------|
| **Organización** | Entidad raíz (institución de salud). Contiene sedes. |
| **Sede** | Ubicación física (edificio/campus). Contiene unidades. |
| **Unidad / Servicio** | Área operativa con dotación propia (UCI, Urgencias, Pabellón, Medicina Interna…). Es donde se producen las brechas. |
| **Funcionario** | Persona que trabaja en la organización (enfermero/a, TENS, médico/a, matrón/a, kinesiólogo/a, auxiliar…). Es el recurso que se asigna a turnos. |
| **Rol clínico / Profesión** | Categoría del funcionario que determina qué puestos puede ocupar (p. ej. *Enfermero/a*). |
| **Competencia** | Capacidad específica y verificable (p. ej. *Manejo de ventilación mecánica*). |
| **Habilitación** | Estado que confirma que un funcionario **puede trabajar** en un contexto (unidad/puesto) porque cumple las competencias, certificaciones y vigencias requeridas. Puede vencer. |
| **Puesto** | Requerimiento de dotación: un rol clínico necesario en una unidad, turno y fecha, con las competencias exigidas. |
| **Dotación objetivo** | Cantidad de funcionarios de cada rol que una unidad necesita por turno (la "demanda"). |
| **Turno** | Bloque horario definido (Mañana, Tarde, Noche, u otros). |
| **Malla / Programación** | Conjunto de asignaciones de funcionarios a turnos para un período y unidad. |
| **Asignación** | Vínculo de un funcionario a un turno concreto (fecha, unidad, puesto). |
| **Ausencia** | Ventana de tiempo en que un funcionario no está disponible (vacaciones, licencia médica, permiso, formación). |
| **Disponibilidad** | Oferta neta de personal para un puesto = asignados − ausentes − no habilitados. |
| **Brecha** | Déficit (o exceso) entre la dotación objetivo y la disponibilidad para un puesto. El objeto central de la plataforma. |
| **Cobertura** | Acción que resuelve una brecha (reasignación, pool/flotante, cambio de turno, llamado voluntario, hora extra, contratación externa). |
| **Pool / Personal flotante** | Funcionarios no fijos de una unidad, disponibles para cubrir brechas transversalmente. |
| **Plan de desarrollo** | Ruta de formación de un funcionario que lo lleva a adquirir nuevas competencias/habilitaciones. |
| **KPI** | Indicador clave (tasa de cobertura, ausentismo, brecha acumulada, costo de coberturas, tiempo de resolución…). |
| **Evento de dominio** | Hecho de negocio ya ocurrido que dispara recálculos (`AbsenceApproved`, `GapDetected`…). Ver [09](./09-eventos-de-dominio.md). |

## 1.5 Perfiles (resumen)

Ver detalle en [06 · Roles y navegación](./06-roles-y-navegacion.md).

- **Administrador** — configura el sistema, datos maestros, usuarios y seguridad.
- **Dirección** — visión estratégica, KPIs, costos y aprobaciones de alto impacto.
- **Supervisor** — gestiona la dotación y la malla de **su unidad**; aprueba ausencias.
- **Coordinador de Coberturas** — resuelve brechas de forma **transversal** entre unidades; gestiona el pool.
- **Funcionario** — ve su turno, solicita ausencias, ofrece disponibilidad y acepta coberturas.
