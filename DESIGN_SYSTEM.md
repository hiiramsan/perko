# Perko — Sistema de Diseño Visual

## 1. Filosofía general

Estilo **moderno, limpio y profesional** con toques **brutalistas** controlados. La paleta es neutral (blancos, grises, slate) con acentos de color que vienen de los negocios. Las tarjetas de lealtad son el centro visual: cada una tiene su propio color dominante (elegido por el negocio). El fondo base es blanco con un patrón de **puntos finos** (dot-grid) que da textura sutil.

---

## 2. Paleta de colores

### 2.1 Colores del sistema (framework)

| Token | Valor | Uso |
|---|---|---|
| `bg-[#f7f8fa]` | Off-white cálido | Fondo principal de páginas (landing, auth, onboarding, cartera) |
| `bg-white` | `#ffffff` | Fondos de tarjetas, contenedores |
| `text-[#0f172a]` | Slate-900 | Texto principal (títulos, body) |
| `text-[#0f172a]/70` | Slate-900 al 70% | Texto secundario (descripciones) |
| `text-[#475569]` / `text-[#64748b]` | Slate-600/500 | Texto terciario (labels, hints) |
| `text-[#66736d]` | Gris-verde | Etiquetas de sección (uppercase, tracking) |
| `border-[#d5dde4]` / `border-[#dbe4ec]` | Gris claro | Bordes de cards |
| `border-gray-300` | `#d1d5db` | Bordes de inputs |
| `bg-[#e7edf2]` | Gris azulado claro | Progress bar background |

### 2.2 Colores de acento (brand)

| Color | Hex | Uso |
|---|---|---|
| Deep Ocean (primario) | `#05668D` | Botones primarios, links, acentos, progress bar fill |
| Deep Ocean hover | `#045676` / `#264653` | Hover de botones primarios |
| Forest | `#4f7a35` | Color default de tarjeta, badge |
| Coral | `#ef4f2f` | Acento secundario (links en auth) |
| Teal | `#2A9D8F` | Checkbox accent, iconos de verificación, focus rings de inputs |
| Orange highlight | `#FF9800` | Highlighter (subrayado, highlight) en landing |
| Sky blue | `#57b6d9` | Focus/hover de inputs, links en onboarding |

### 2.3 Colores de tarjetas (business)

Paleta predefinida en `onboarding/lib/constants.ts`:
- `#4f7a35` (Bosque), `#ef4f2f` (Coral), `#c58b00` (Ámbar), `#05668D` (Oceánico), `#7b4aa2` (Ciruela), `#c93d73` (Rosado)
- Además: selector de color libre con 32 colores predefinidos + color picker nativo + input HEX

### 2.4 Luminancia adaptativa

Todas las tarjetas y badges usan `getRelativeLuminance()` para elegir automáticamente colores de texto/stamps:
- Si `luminance > 0.58-0.62` → colores oscuros (`#0f172a`)
- Si no → colores claros (`#f8fbfd`, `#ffffff`)

---

## 3. Tipografía

| Propiedad | Valor |
|---|---|
| Font family | `IBM Plex Sans` vía `next/font` + fallback `sans-serif` |
| Títulos (h1) | `text-[2.25rem] font-bold tracking-[-0.035em]` (cartera), `text-3xl/4xl font-semibold tracking-tight` (landing) |
| Subtítulos | `text-sm font-semibold uppercase tracking-[0.3em] text-[#66736d]` (landing sections) |
| Body | `text-base text-[#0f172a]/70` (descripciones landing), `text-sm text-[#0f172a]` (general) |
| Labels de formularios | `text-xs font-semibold uppercase text-[#0f172a]` |
| Label de sistemas | `text-xs font-bold uppercase tracking-wide text-[#334155]` |

---

## 4. Bordes y radios

| Elemento | Border radius | Shadow |
|---|---|---|
| Cards (grandes) | `rounded-2xl` (`16px`) | `shadow-[0_18px_40px_-25px_rgba(15,23,42,0.35)]` |
| Stamp cards | `rounded-[2rem]` (`32px`) | `shadow-[0_22px_50px_-20px_rgba(15,23,42,0.6)] ring-1 ring-white/20` |
| Auth card | `rounded-none` (recto) | `shadow-[10px_10px_0_0_rgba(0,0,0,0.95)]` con `border border-black` |
| Inputs | `rounded-lg` (`8px`) | — |
| Inputs (onboarding) | `rounded-2xl` (`16px`) | — |
| Botones primarios | `rounded-lg` / `rounded-full` | — |
| Botones landing | `rounded-full` (`9999px`) | — |
| Badges / F.A.Q items | `rounded-2xl` | — |
| Color swatches | `rounded-full` | — |

---

## 5. Background patterns

### Dot grid (fondo recurrente)

```tsx
style={{
  background: '#ffffff',
  backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0, 0, 0, 0.35) 1px, transparent 0)',
  backgroundSize: '20px 20px',
}}
```

Usado en: landing page, auth pages, onboarding page.

### Blur circles decorativos

```tsx
<div className="absolute -top-1/2 -left-1/4 h-130 w-130 rounded-full bg-[#d8e6df] blur-[130px]" />
<div className="absolute -bottom-1/2 -right-1/4 h-110 w-110 rounded-full bg-[#e6ece9] blur-[120px]" />
```

Usado en: auth pages, onboarding page. Siempre detrás del contenido (z-0).

---

## 6. Componentes compartidos

### 6.1 StampCard / StampPreviewCard

- **Uso**: StampCard en cartera (wallet), StampPreviewCard en onboarding + landing
- **Grid**: 5 columnas × 2 filas = 10 stamps
- **Stamps**: círculos de `h-8 w-8 sm:h-9 sm:w-9` a `h-10 w-10 sm:h-12 sm:w-12`
- **Filled**: `BadgeCheck` icon de lucide, color adaptativo por luminancia
- **Empty**: círculo relleno con opacidad reducida (mezcla de color base + blanco)
- **Animación**: `animate-stamp-pop` (scale 0 → 1.25 → 1 con rotación -20° → 0°)
- **Preview**: cicla stamps automáticamente cada 420ms (0 → 10 → 0)

### 6.2 Highlighter (rough-notation)

- Envuelve texto en landing para animaciones de subrayado, highlight, box, circle
- Se activa con `IntersectionObserver` (motion `useInView`, `once: true`)
- Colores: `#FF9800` (highlight/underline), `#000000` (box), `#05668D` (circle)

### 6.3 Marquee

- Carrusel infinito de testimonios (horizontal en desktop, vertical en mobile)
- `--duration: 20s` (horizontal) o `22s` (vertical)
- `repeat: 4` (4 copias del contenido)
- `pauseOnHover` activo

### 6.4 Botones

**Landing CTA (primario)**:
```tsx
rounded-full bg-[#05668D] px-8 py-4 text-base font-semibold text-white
transition-all duration-200 hover:bg-[#045676] hover:scale-[1.02] active:scale-[0.98]
hover:ring-2 hover:ring-[#264653] hover:ring-offset-2 hover:ring-offset-[#f7f8fa]
```

**Landing CTA (outline)**:
```tsx
rounded-full border border-[#9da5af] bg-white px-8 py-4 text-base font-semibold text-[#0f172a]
transition-all duration-200 hover:border-[#7a838f] hover:text-[#1f2a44]
hover:ring-2 hover:ring-[#94a3b8] hover:ring-offset-2
```

**Auth primario (PrimaryAuthButton)**:
```tsx
w-full rounded-lg bg-[#05668D] py-3 font-bold uppercase tracking-wider text-white
hover:bg-[#264653] disabled:cursor-not-allowed disabled:opacity-60
```

**Auth secundario / Google**:
```tsx
w-full rounded-lg border-2 border-[#dbe4ec] py-3 font-bold uppercase tracking-wider text-[#0f172a]
hover:border-[#cfd8e1] hover:bg-[#f8fbfd]
```

**Onboarding navegación**:
```tsx
// Back:
rounded-lg border border-[#c8d3de] bg-white px-6 py-2.5 text-sm font-semibold text-[#334155]
// Next (disabled):
rounded-lg bg-[#dfe8ef] px-8 py-2.5 text-sm font-semibold text-[#6b7d8d]
// Next (enabled):
bg-[#0f172a] text-white hover:bg-[#1e293b]
```

### 6.5 Form fields

**Auth**:
```tsx
w-full rounded-lg border border-gray-300 px-4 py-3
focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#2f6a4f]
```

**Onboarding**:
```tsx
w-full rounded-2xl border border-[#dbe4ec] bg-white px-4 py-3 text-[#0f172a]
placeholder:text-[#9aa8b6] focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#2A9D8F]
```

**Link/Business name (onboarding)**:
```tsx
border-b-2 border-[#57b6d9] pb-2  // underline style
bg-transparent text-lg text-[#0f172a] placeholder:text-[#9aa8b6]
```

---

## 7. Landing page — secciones

### Hero
- **Header**: Logo "Perk" + `BadgeCheck` icon (brand mark)
- **Background**: 3 floating stamp cards (`animate-float-1/2/3` con `-8°` a `+6°` rotation, translateY -10 a -15px)
- **Headline**: `text-4xl sm:text-5xl font-bold` con `Highlighter underline #FF9800`
- **Subtitle**: `text-lg sm:text-xl text-[#0f172a]/70`
- **CTAs**: 2 botones `rounded-full` ("Soy negocio" con `Store`, "Soy cliente" con `User`)

### How It Works
- **Label**: `text-xs font-semibold uppercase tracking-[0.3em] text-[#66736d]`
- **Title**: `text-3xl sm:text-4xl font-semibold tracking-tight` con `Highlighter box`
- **Cards**: `aspect-square rounded-3xl border-2 border-black bg-white shadow-[0_18px_40px_-28px_rgba(15,23,42,0.45)]`
- **Step numbers**: `h-10 w-10 rounded-full bg-black text-white font-semibold` (posicionado absolute)

### Social Proof
- **Testimonial cards**: `rounded-2xl border border-blue-400/40 bg-slate-50/80 hover:bg-white/80` con quote SVG icon en `#05668D`
- **Layout**: Desktop: `Marquee` horizontal (2 rows). Mobile: `Marquee` vertical (1 row visible)

### FAQ
- **Accordion**: `rounded-2xl border` con transiciones de `grid-template-rows`
- **Closed**: bg `white`, border `#e2e8f0`, text `#0f172a`
- **Open**: bg `#0f172a`, text `white`, Plus icon rota 45°

### Footer
- **Brand**: "Perk" + `BadgeCheck` icon
- **Columns**: Company links + Social links
- **Section labels**: `text-xs font-semibold uppercase tracking-[0.18em] text-[#66736d]`

---

## 8. Auth pages (login / register)

### AuthPageShell
- **Form card**: Brutalista — `rounded-none border border-black bg-white shadow-[10px_10px_0_0_rgba(0,0,0,0.95)]`
- **Title**: `text-xl sm:text-2xl font-bold text-center text-[#0f172a]`
- **Footer link**: `font-bold text-[#05668D]` (login) o `text-[#ef4f2f]` (cuando es onClick)
- **Google button**: borde `border-2 border-[#dbe4ec]`, texto uppercase bold tracking-wider, logo SVG multi-color de Google
- **Divider**: "O" entre líneas `h-px flex-1 bg-gray-300`

### Login form
- Email field + Password field + "Recuérdame" checkbox (accent `#05668D`)
- Error: `bg-red-50 text-red-600 border-l-4 border-red-500`

### Register form
- Full name + Email + Password + Confirm password + Términos checkbox
- **Bottom link**: `w-full rounded-lg border border-[#9da5af] bg-white py-3 text-center font-bold uppercase`

---

## 9. Onboarding wizard

### Layout general
- **Container**: `max-w-7xl rounded-2xl border border-[#d5dde4] bg-white shadow-[0_18px_40px_-25px_rgba(15,23,42,0.35)]`
- **Progress bar**: `h-1.5 w-full bg-[#e7edf2]` con fill `bg-[#05668D] transition-all duration-500`
- **Dual column**: `lg:grid-cols-[1.1fr_0.9fr]` (form izquierda, preview derecha)

### Preview lateral
- Antes de elegir sistemas: `StampPreviewCard` con animación `stamp-bounce` (translateY 0 → -12px) y `shadow-pulse`
- Después de sistemas: `BadgeCheck` con animación `checkmark-pulse` (scale 0.2→1→0.2 cada 2.2s) y borde `border-pulse` (glow azul cada 3s)

### Fases
1. **Business**: Input inline `border-b-2 border-[#57b6d9] bg-transparent`
2. **Logo**: Drag & drop zone `rounded-xl border-2 border-dashed border-[#c6d3de] bg-[#f8fbfd] hover:border-[#57b6d9]`
3. **Link**: Input inline con prefijo `perko.com/`, slug se autogenera con `buildSlug()`
4. **Color**: Grid de 32+ colores predefinidos + color picker nativo + input HEX
5. **Systems**: Combobox con tarjetas seleccionables (2 columnas, checkmark circular)
6. **Rewards/Points**: Inputs `rounded-2xl border border-[#dbe4ec]` con labels uppercase

---

## 10. Animaciones clave

| Nombre | Duración | Easing | Propósito |
|---|---|---|---|
| `stamp-pop` | 0.5s | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Nuevos stamps en tarjeta |
| `float-1/2/3` | 5-7s | `ease-in-out` | Tarjetas flotantes en Hero |
| `stamp-bounce` | 2s | `ease-in-out` | Preview card en onboarding |
| `shadow-pulse` | 2s | `ease-in-out` | Sombra de preview card |
| `border-pulse` | 3s | `ease-in-out` | Glow azul en aside de sistemas |
| `checkmark-pulse` | 2.2s | `linear` | BadgeCheck animado en aside |
| `marquee` | 20-22s | `linear` | Testimonios infinitos |
| Card stack | 0.42s | `cubic-bezier(0.34,1.36,0.64,1)` | Reordenamiento de tarjetas en cartera |
| Bottom sheet | 0.38s | `cubic-bezier(0.34,1.2,0.64,1)` | QR sheet en cartera |

---

## 11. Wallet / Cartera

- **Mobile stack**: Cards apiladas con `PEEK_HEIGHT: 72px`, solo la activa se ve completa. `bringToActive` reordena con transición CSS en `top` y `transform`.
- **Desktop**: Grid `grid-cols-2 lg:grid-cols-3 gap-7` con hover `hover:-translate-y-1.5`
- **Bottom sheet**: `rounded-t-[32px] bg-white` con drag handle, mini preview de card, QR code, y card code
- **GlassNavbar**: Barra inferior glassmorphism (`backdrop-blur`) con 3 tabs (Wallet, Join, Profile)

---

## 12. Patrones de layout recurrentes

- **Section**: `relative z-10 my-8 w-full pt-10 pl-10 pr-6 sm:pl-12 sm:pr-8 md:pl-16 md:pr-12 lg:pl-24 lg:pr-16 xl:pl-32 xl:pr-24`
- **Section label line**: `text-xs/sm font-semibold uppercase tracking-[0.3em] text-[#66736d]`
- **Section title**: `text-3xl sm:text-4xl font-semibold tracking-tight text-[#0f172a]`
- **Section description**: `text-base sm:text-lg text-[#0f172a]/70`
- **Blur overlay (modal/sheet)**: `fixed inset-0 z-40 bg-black/15 backdrop-blur-[6px]`
- **Loading state**: `flex min-h-screen items-center justify-center text-[#4f6b83]`
