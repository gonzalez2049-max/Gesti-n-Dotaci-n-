# NEX Shift

**Plataforma web de inteligencia operativa para la gestión de dotación, turnos, coberturas y talento clínico.**

NEX Shift guía al usuario desde la **detección de una brecha** de dotación hasta su **resolución**, integrando en un solo sistema:

- Programación de turnos (malla)
- Gestión de ausencias
- Coberturas
- Habilitación y competencias del personal
- Desarrollo profesional
- Analítica e inteligencia operativa

## Principio rector

> **Una única fuente de verdad (SSOT).** Cualquier cambio en un módulo se propaga automáticamente a todos los módulos relacionados mediante un modelo reactivo basado en eventos de dominio. No hay datos duplicados ni pantallas que "se olviden" de actualizarse.

## Estado del proyecto

Fase actual: **Construcción — base técnica + módulo Inicio.** La arquitectura funcional y visual está completa (docs 01–23) y validada. La app web con el **Inicio funcionando** ya está en el repositorio.

## Desarrollo (monorepo)

Stack (doc 07): monorepo **pnpm**, frontend **React + TypeScript + Vite**, backend **NestJS + PostgreSQL (Prisma) + Redis** (Outbox/eventos), contratos compartidos.

```
apps/
  web/         # Frontend React+TS+Vite — Inicio funcionando (Supervisor/Coordinador)
  api/         # Backend NestJS (andamiaje: módulo Inicio + Outbox + Prisma)
packages/
  contracts/   # Tipos, DTOs y eventos de dominio (fuente única del contrato)
infra/
  docker-compose.yml   # PostgreSQL + Redis
docs/
  architecture/        # 23 documentos de arquitectura funcional, técnica y visual
  prototipos/          # prototipos visuales navegables (HTML)
  portada/             # portada navegable del sistema
```

### Ejecutar el frontend (Inicio)

```bash
pnpm install
pnpm dev          # http://localhost:5173  → módulo Inicio
pnpm build        # build de producción del frontend
pnpm typecheck
```

Cambia de **perfil** (Supervisor / Coordinador) y de **tema** (claro/oscuro) desde la barra superior. La navegación funciona en **escritorio** (barra lateral) y **móvil** (barra inferior).

### Backend e infraestructura (siguiente fase)

```bash
pnpm infra:up                              # PostgreSQL + Redis (Docker)
pnpm --filter @nexshift/api install        # deps del backend
cp apps/api/.env.example apps/api/.env
pnpm --filter @nexshift/api prisma:generate
pnpm api                                   # NestJS en http://localhost:4000/api
```

> El backend está **andamiado** (módulo Inicio que devuelve el mismo contrato `InicioResumen`, patrón Outbox y esquema Prisma inicial). Se completará módulo a módulo siguiendo el [roadmap](./docs/architecture/10-roadmap.md).

## Documentación de arquitectura

Toda la arquitectura vive en [`docs/architecture/`](./docs/architecture/00-indice.md). Empieza por el índice:

👉 **[docs/architecture/00-indice.md](./docs/architecture/00-indice.md)**

| Documento | Contenido |
|-----------|-----------|
| [00 · Índice](./docs/architecture/00-indice.md) | Mapa de la documentación |
| [01 · Visión, alcance y glosario](./docs/architecture/01-vision-alcance-glosario.md) | Qué es, qué resuelve, vocabulario común |
| [02 · Modelo de dominio](./docs/architecture/02-modelo-de-dominio.md) | Entidades y relaciones del negocio |
| [03 · Módulos funcionales](./docs/architecture/03-modulos-funcionales.md) | Los 10 módulos y sus responsabilidades |
| [04 · Flujo brecha → resolución](./docs/architecture/04-flujo-brecha-a-resolucion.md) | El flujo central de la plataforma |
| [05 · Fuente única de verdad](./docs/architecture/05-fuente-unica-de-verdad.md) | Cómo se propaga cada cambio |
| [06 · Roles y navegación](./docs/architecture/06-roles-y-navegacion.md) | Perfiles, permisos y menús |
| [07 · Arquitectura técnica](./docs/architecture/07-arquitectura-tecnica.md) | Stack, capas y despliegue |
| [08 · Modelo de datos](./docs/architecture/08-modelo-de-datos.md) | Esquema de datos (SSOT física) |
| [09 · Eventos de dominio](./docs/architecture/09-eventos-de-dominio.md) | Catálogo de eventos reactivos |
| [10 · Roadmap de construcción](./docs/architecture/10-roadmap.md) | Orden de construcción por fases |

## Perfiles de usuario

Administrador · Dirección · Supervisor · Coordinador de Coberturas · Funcionario.
Ver [06 · Roles y navegación](./docs/architecture/06-roles-y-navegacion.md).
