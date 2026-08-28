# Sala de Situación — la luz que recorre el electro

Documento de los cambios hechos para que, en el panel **Sala de Situación** del
Inicio, la línea de pulso deje de mostrar un "blob" plano y en su lugar una
**luz recorra el trazado del electro** (subiendo y bajando por los picos), como
un monitor cardíaco.

---

## 1. El problema

La línea de pulso (`PulseLine`) dibujaba el electro con un `<svg>` que usa
`preserveAspectRatio="none"` para estirarse a todo el ancho. Sobre ese trazo
había un **punto** (`<circle>`) que se animaba con `translateX` a lo largo de la
**línea base** (siempre a la misma altura, `cy=23`).

Dos consecuencias visuales:

1. **Se veía plano**: el punto se movía en horizontal por el centro, nunca subía
   ni bajaba por los picos del electro.
2. **Se veía como un "blob"**: al estirar el SVG solo en horizontal, el círculo
   se deformaba en una elipse ancha y difusa → el "blob" del medio.

```tsx
// ANTES — punto que se desliza plano y se deforma
const seg = "M0 23 H34 l4 -3 l3 6 l5 -17 l5 26 l4 -12 H120";
<svg className="ecg" viewBox="0 0 240 46" preserveAspectRatio="none" ...>
  <g className="ecg-g" ...>
    {[0, 120, 240].map((x) => <path d={seg} transform={`translate(${x} 0)`} />)}
  </g>
  <circle className="ecg-dot" r="3.2" cy="23" fill="var(--tn)" />
</svg>
```

```css
/* ANTES — el trazo scrollea y el punto viaja plano en X */
.ecg-g  { animation: ecgscroll 3s linear infinite; opacity: .85; }
@keyframes ecgscroll { to { transform: translateX(-120px); } }
.ecg-dot { animation: ecgdot 3s linear infinite; filter: drop-shadow(0 0 5px var(--tn)); }
@keyframes ecgdot { from { transform: translateX(0); } to { transform: translateX(240px); } }
```

---

## 2. La solución

En lugar de mover un punto por encima del trazo, **la luz es el propio trazo**:
se dibuja el electro completo y se hace correr un **segmento brillante** a lo
largo de ese path con `stroke-dasharray` + `stroke-dashoffset` animado. Como el
segmento sigue el path, sube y baja por los picos exactamente igual que la onda.
Nada de círculos que se deformen → adiós al "blob".

Se dibujan **tres capas del mismo path**:

| Capa | Clase | Rol |
|------|-------|-----|
| Trazo base | `.ecg-base` | El electro completo, tenue (referencia fija). |
| Halo | `.ecg-glow` | Segmento ancho y difuminado → resplandor de la luz. |
| Luz | `.ecg-run` | Segmento fino y brillante → la "cabeza" de la luz. |

Además se subió la densidad a **4 latidos** para que se lea más como un monitor.

---

## 3. Cambios por archivo

### `apps/web/src/pages/home/parts.tsx` — componente `PulseLine`

```tsx
// DESPUÉS — path de 4 latidos + 3 capas (base tenue, halo, luz)
export function PulseLine({ tone = "good", height = 46 }: { tone?: Tono; height?: number }) {
  const beats = 4;
  let d = "M0 23";
  for (let i = 0; i < beats; i++) {
    const x = i * 120;
    d += ` H${x + 34} l4 -3 l3 6 l5 -17 l5 26 l4 -12 H${x + 120}`;
  }
  const W = beats * 120;
  return (
    <svg className="ecg" viewBox={`0 0 ${W} 46`} preserveAspectRatio="none" style={{ height, ...toneStyle(tone) }} aria-hidden="true">
      <path className="ecg-base" d={d} fill="none" stroke="var(--tn)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      <path className="ecg-glow" d={d} pathLength={100} fill="none" stroke="var(--tn)" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      <path className="ecg-run"  d={d} pathLength={100} fill="none" stroke="var(--tn)" strokeWidth="2"   strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
```

Claves:

- **`d` se construye en un bucle** de `beats` latidos; cada latido es la misma
  "firma" del electro (línea base → complejo QRS → línea base), desplazada 120 px.
- **`pathLength={100}`** normaliza el largo del path a 100 unidades, así el
  `dasharray`/`dashoffset` no dependen del largo geométrico real.
- El **punto `<circle>` desapareció**; ya no hay nada que se deforme.

### `apps/web/src/styles/global.css` — animación de la luz

```css
/* DESPUÉS — trazo base tenue + luz que recorre el path */
.ecg-base { opacity: 0.24; }

.ecg-run  { stroke-dasharray: 3 97; stroke-dashoffset: 0; filter: drop-shadow(0 0 3px var(--tn)); animation: ecgrun 2.6s linear infinite; }
.ecg-glow { stroke-dasharray: 9 91; stroke-dashoffset: 0; opacity: 0.5; filter: blur(2px);        animation: ecgrun 2.6s linear infinite; }

@keyframes ecgrun { to { stroke-dashoffset: -100; } }
```

Cómo funciona:

- `stroke-dasharray: 3 97` = un guion visible de **3** unidades y un hueco de
  **97** (3 + 97 = 100 = `pathLength`). O sea: un único segmento corto sobre un
  trazo "invisible".
- Animar `stroke-dashoffset` de `0` a `-100` **arrastra ese segmento a lo largo
  de todo el path**, una vuelta completa por ciclo. Como empieza y termina en la
  línea base, el loop es continuo y sin salto.
- `.ecg-glow` hace lo mismo con un guion más ancho (**9**), semitransparente y
  con `blur(2px)` → el resplandor detrás de la luz.
- El color es `var(--tn)`, el tono del panel (naranja "en riesgo", verde
  "estable", etc.), así la luz combina con el estado.

### `apps/web/src/styles/global.css` — `prefers-reduced-motion`

Se actualizaron las clases en la regla de "movimiento reducido" para apagar la
nueva animación (antes apuntaba a `.ecg-g` / `.ecg-dot`):

```css
@media (prefers-reduced-motion: reduce) {
  .ecg-run, .ecg-glow, /* …resto de animaciones… */ { animation: none !important; }
}
```

---

## 4. Parámetros para ajustar

| Quiero… | Dónde | Cómo |
|---------|-------|------|
| Más/menos rápido | `.ecg-run` y `.ecg-glow` | Cambiar `2.6s` (menor = más rápido). Mantener ambos iguales. |
| Estela más larga | `.ecg-run` | Subir el primer valor del `dasharray` (ej. `6 94`). |
| Halo más grande | `.ecg-glow` | Subir `stroke-width` (`3.4`) y/o `blur(2px)`. |
| Trazo base más visible | `.ecg-base` | Subir `opacity` (`0.24` → `0.4`). |
| Más/menos latidos | `PulseLine` | Cambiar `const beats = 4`. |
| Luz tipo destello blanco | `.ecg-run` | Poner `stroke: #fff` (en vez de `var(--tn)`) y dejar el halo con `var(--tn)`. |

---

## 5. Resumen

- **Antes:** un punto (`<circle>`) viajaba plano por la línea base y, al estirarse
  el SVG, se veía como un "blob".
- **Después:** el electro se dibuja completo y una **luz (segmento del propio
  trazo)** lo recorre siguiendo los picos, con halo, en loop continuo y con el
  color del estado del panel.

**Archivos tocados:** `apps/web/src/pages/home/parts.tsx` (componente `PulseLine`)
y `apps/web/src/styles/global.css` (clases `.ecg-base`, `.ecg-run`, `.ecg-glow`,
keyframe `ecgrun` y la regla de `prefers-reduced-motion`).
