# 23 · Sistema visual (UX/UI global)

> **Objetivo:** una interfaz **distinta, moderna e innovadora** que **guíe paso a paso**. Nada de colores planos ni dashboards genéricos: profundidad, degradados suaves, vidrio, microinteracciones y **orientación constante** — el sistema siempre dice *qué ocurre, qué hacer y cuál es el siguiente paso*.
>
> Este documento define el lenguaje visual global. Luego se aplica a Inicio, Programación, Brechas, Coberturas, Talento, Analítica, Administración y Funcionario (§23.14). Acompaña un **artefacto** que lo encarna en una app navegable.

## 23.1 Principios de experiencia

1. **Guía, no solo herramienta.** Cada pantalla propone el siguiente paso. El usuario nunca queda frente a una tabla sin saber qué hacer.
2. **Qué ocurre · Qué hacer · Siguiente.** Un patrón de guía presente en cada superficie (§23.9).
3. **La acción prioritaria siempre visible.** La cosa más importante del momento vive en un lugar fijo y luminoso.
4. **Rapidez y foco.** Menos clics, jerarquía nítida, lo urgente arriba y realzado.
5. **Misma identidad, cada perfil distinto.** Estructura y lenguaje comunes; **acento y aura propios por perfil** (§23.11).

## 23.2 Identidad visual

Concepto: **"sala de control clínica con profundidad"** — una interfaz que se siente **viva y tridimensional**, no impresa. Se logra con **capas**: un fondo con degradado y textura sutil, **tarjetas de vidrio** elevadas sobre él, **glows** de color en los puntos de energía (acción prioritaria, estado crítico) y **movimiento** discreto. **Nada es plano.**

## 23.3 Color y degradados

- **Neutros con carácter** (no gris puro): sesgo frío azul-teal. Fondo profundo en oscuro; casi-blanco frío en claro.
- **Degradado de marca:** teal → cian → índigo, usado con moderación en el logo, la acción primaria, el progreso y el "aura" activa.
- **Acento por perfil** (misma familia, distinto tono — §23.11).
- **Estados como orbes con glow** (semáforo de dotación reimaginado): **equilibrio** (esmeralda), **en riesgo** (ámbar), **crítico** (rosa/rojo), **exceso** (cian). Nunca color solo: siempre orbe + etiqueta/ícono.
- **Paleta de series** para gráficos (teal / azul / magenta) validada para daltonismo y contraste (ver [19](./19-analitica-inteligencia.md)).

## 23.4 Tipografía

- **Display** (títulos): peso alto, tracking ajustado, escala amplia. Lleva la personalidad.
- **Cuerpo:** legible, 400/500, ancho de línea cómodo.
- **Mono** (etiquetas, datos, IDs, "eyebrows"): el vocabulario de "sala de control". Mayúsculas con letter-spacing.
- **Escala tipográfica fija**; jerarquía por tamaño + peso + color de tinta (no por color de acento).

## 23.5 Profundidad y superficies

- **Fondo con profundidad:** degradado radial suave (dos focos de color a baja opacidad) + **grid/textura** casi imperceptible. Nunca un color plano.
- **Tarjetas de vidrio:** superficie translúcida con desenfoque (glassmorphism sobrio), **borde hairline con degradado** (más claro arriba), **sombra suave** + **highlight interior** superior. Con *fallback* sólido si no hay soporte.
- **Elevaciones:** 3 niveles (base, tarjeta, panel/overlay), cada uno con su sombra y desenfoque.

## 23.6 Componentes

| Componente | Descripción |
|-----------|-------------|
| **Tarjeta compacta** | Vidrio, radio generoso, densa pero respirada; hover con leve elevación. |
| **Botón primario** | Relleno con **degradado de acento**, glow sutil, texto claro. |
| **Botón secundario / ghost** | Vidrio o contorno hairline; para acciones no primarias. |
| **Chip / pill** | Etiquetas de estado, filtros, metadatos; mono, bordes suaves. |
| **Orbe de estado** | Punto con **glow radial** para el semáforo; tamaño según jerarquía. |
| **Panel lateral (drawer)** | Para detalle y resolución sin cambiar de pantalla; entra deslizando con desenfoque de fondo. |
| **Navegación contextual** | Barra lateral por área + barra de contexto superior; indicador activo que **se desliza**. |
| **Franja de guía** | El patrón *qué ocurre / qué hacer / siguiente* (§23.9). |
| **Barra de acción prioritaria** | Elemento fijo y luminoso con la acción #1 del momento. |
| **Anillo de progreso** | Para planes, competencias, cobertura de dotación. |

## 23.7 Microinteracciones

- **Hover:** las tarjetas se **elevan** levemente y ganan borde luminoso.
- **Activo:** aura/glow del color de acento.
- **Navegación:** el indicador de sección **se desliza** entre ítems.
- **Panel lateral:** entra deslizando; el fondo se **desenfoca**.
- **Progreso y contadores:** se **animan** al aparecer; el orbe crítico **pulsa** suave.
- **Reveal guiado:** el contenido aparece en secuencia corta al entrar a una pantalla.
- **`prefers-reduced-motion`:** todo lo anterior se **desactiva** o reduce.

## 23.8 Iconografía

- **Lineal, consistente**, mismo grosor de trazo y esquinas; un solo set. En el producto final se prefieren íconos vectoriales propios; en los prototipos se usan marcadores simples. **No** decorar con emojis dispersos.

## 23.9 Estados guiados

- **Patrón de guía** en cada pantalla:
  - **▸ Qué ocurre** — el titular del momento (estado).
  - **◉ Qué hacer** — la acción concreta (botón).
  - **→ Siguiente** — qué viene después.
- **Acción prioritaria siempre visible** (barra fija).
- **Estados vacíos con guía:** "Todo al día — tu próximo turno es…", nunca un vacío mudo.
- **Carga:** *skeletons* con el mismo lenguaje, no spinners genéricos.

## 23.10 Navegación contextual (shell)

```
┌───────────────────────────────────────────────────────────┐
│ BARRA DE CONTEXTO: marca · sede/unidad · perfil · buscar   │
├───────────┬───────────────────────────────────────────────┤
│ NAV       │ CABECERA: título + FRANJA DE GUÍA             │
│ LATERAL   ├───────────────────────────────────────────────┤
│ (por área)│ CONTENIDO (tarjetas / listas / gráficos)      │
│ indicador │                                    ┌──────────┐│
│ deslizante│                                    │ PANEL    ││
│           │ ┌ BARRA DE ACCIÓN PRIORITARIA ┐    │ LATERAL  ││
└───────────┴─┴─────────────────────────────┴────┴──────────┴┘
```

## 23.11 Temas por perfil

Misma estructura y lenguaje; **acento y aura distintos**:

| Perfil | Aura / acento |
|--------|---------------|
| **Supervisor** | Teal (operación, "casa"). |
| **Coordinador** | Cian-azul (urgencia, coberturas). |
| **Subdirección** | Índigo-violeta (analítico). |
| **Administrador** | Acero-teal (control, sistema). |
| **Funcionario** | Esmeralda-teal (personal, calma). |

Al cambiar de perfil, cambia el **acento**, el fondo-aura y la **acción prioritaria** — pero se reconoce como el mismo NEX Shift.

## 23.12 Responsive

- **Escritorio:** nav lateral + panel lateral en columna.
- **Tablet:** nav colapsa a íconos; panel como drawer.
- **Móvil:** nav inferior o menú; panel a pantalla completa; tarjetas a una columna; **la acción prioritaria se mantiene visible**. El Funcionario se diseña *mobile-first*.

## 23.13 Accesibilidad

- Contraste AA en texto y estados; **estado nunca solo por color** (orbe + etiqueta/ícono).
- **Foco visible** en teclado; navegación operable sin mouse.
- `prefers-reduced-motion` respetado; `prefers-color-scheme` + toggle (claro/oscuro con igual cuidado).

## 23.14 Aplicación por pantalla

| Pantalla | Cómo se ve con el sistema |
|----------|---------------------------|
| **Inicio** | Orbe de estado grande + franja de guía + acciones prioritarias en tarjetas compactas + KPIs con anillos/sparklines. |
| **Programación** | Malla de vidrio; celdas con color de turno; validación en vivo con orbes; panel lateral para editar. |
| **Brechas** | Lista priorizada con orbes de severidad; la crítica arriba y luminosa; panel de detalle. |
| **Coberturas** | Candidatos del Índice NEX en tarjetas con **puntaje en degradado**; razón en lenguaje claro; acción primaria "Enviar oferta". |
| **Talento** | Anillos de progreso de competencias/planes; matriz de vidrio; el cierre del lazo resaltado. |
| **Analítica** | Tarjetas-gráfico de vidrio con degradados suaves; tendencia · causa · recomendación; banner de "apoyo, no ejecuta". |
| **Administración** | Grupos de configuración en vidrio; cada cambio con su propagación; auditoría como línea de tiempo. |
| **Funcionario** | *Mobile-first*, cálido; su turno, la oferta con rastreador de estado, su desarrollo con anillo. |

## 23.15 Qué validar

1. **¿El concepto "sala de control con profundidad"** (vidrio, degradados, glows) es la dirección que buscas, o prefieres algo más sobrio / más audaz?
2. **¿Los acentos por perfil** son los correctos, o quieres otros colores por rol?
3. **¿La franja de guía** (qué ocurre / qué hacer / siguiente) en cada pantalla te hace sentido?
4. **¿La acción prioritaria fija** es útil, o intrusiva?
5. **¿Mobile-first para el Funcionario** y escritorio para los perfiles de gestión es el enfoque correcto?
