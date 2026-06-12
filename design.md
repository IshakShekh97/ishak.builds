# Cyber-Brutalist Terminal Design Blueprint

This document specifies the exact design strategy, layout guidelines, styling rules, and animation systems used to build the responsive, cyber-brutalist interfaces on this site. Use this guide to replicate or extend these exact visual effects.

---

## 1. Core Styling & Color Systems (Tailwind v4)

We employ a **high-contrast, raw industrial aesthetic** relying on stark lines, structural coordinates, and terminal layout parameters.

### Color Tokens (OKLCH Space)
- **Cream/Bone Base (Light Mode):** `--background: oklch(100% 0.00011 271.152)`. A soft, premium editorial paper texture.
- **Deep Ink Black (Dark Mode & Light HUD Text):** `--background: oklch(0% 0 0)`. Pure stark black contrast.
- **Safety Amber Accent:** `--accent: oklch(70.737% 0.18926 43.431)`. Used sparingly for highlights, borders, numbers, and blinking beacons.
- **Fine Borders:** `--border: oklch(0.75 0.015 30)` (light mode) / `oklch(0.24 0.015 30)` (dark mode). Used at low opacity (10%-20%) for drawing blueprint line grids.

### Custom Animation Utility (CRT Screen Flicker)
To create a live screen tube feel, the following keyframe is added to the Tailwind `@theme` block in `globals.css`:
```css
--animate-flicker: flicker 0.15s infinite;

@keyframes flicker {
  0%, 100% { opacity: 0.97; }
  50% { opacity: 1.0; }
}
```

---

## 2. Global Terminal Background (`TerminalBackground.tsx`)

The background serves as a permanent, responsive schematic overlay behind website components.

### Layout & Spacing
- Rendered fixed covering the viewport (`fixed inset-0 -z-10 w-screen h-screen overflow-hidden pointer-events-none`).
- **Junction Lines:** Thin vertical lines positioned at `left-[8%]` and `right-[8%]`; horizontal lines at `top-[12%]` and `bottom-[10%]`. These form a grid container dividing the screen.
- **Junction Ticks:** Small $2\times2\text{px}$ square ticks (`border border-accent/40 bg-background`) centered exactly at the intersections of the lines to act as grid corners.

### Visual Effects
- **Dot Matrix Grid:** Rendered using a CSS radial gradient overlaying `currentColor` at `0.12` opacity:
  `background-image: radial-gradient(currentColor 1.5px, transparent 1.5px); background-size: 32px 32px;`
- **CRT Scanlines:** Subtle linear gradient overlay:
  `background-image: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.2) 50%); background-size: 100% 4px;`
- **Glow & Flicker:** A radial gradient from center to edges (`to-foreground/1.5`) running the custom `animate-flicker` class.

### Animations
- **Boot Draw:** The four grid lines animate scale from `0` to `1` on mount using Framer Motion:
  ```typescript
  initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 1.2, ease: "easeInOut" }}
  ```
- **Live telemetry clock:** A millisecond-based ticker in the top-right corner updating at `100ms` intervals:
  `hh:mm:ss::ms` (formatted as tabular digits).

---

## 3. Pixelated HUD Preloader (`PixelPreloader.tsx`)

A full-screen, high-priority loader overlay block that simulates system initialization and dissolves into the page using scattered grid blocks.

### Layout & Responsive Grid
- Covers screen natively (`fixed inset-0 z-9999`).
- Grid cells amount is **exactly 160**. Columns and rows change responsively:
  - **Desktop:** `grid-cols-16 grid-rows-10` (16 columns, 10 rows).
  - **Mobile:** `grid-cols-8 grid-rows-20` (8 columns, 20 rows).
  - This ensures a solid overlay covers the viewport immediately on first paint.
  - Cells are colored `bg-background` to blend seamlessly with the page theme, eliminating visual jarring.

### Staggered Pixel Exit Animation
When loading completes, all 160 grid cells animate `scale` to `0` and `opacity` to `0`. Each cell uses a **deterministic delay** calculated from its index, scattering the transition randomly:
```typescript
const getCellDelay = (index: number) => {
  return Math.abs(Math.sin(index * 42.12) * 0.7); // Delays up to 0.7s
};
```
Exit transition settings:
```typescript
transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1], delay: getCellDelay(i) }}
```

### Typographic Slogans Background
Massive text watermark overlays centered under the HUD console (`text-4xl sm:text-7xl md:text-[9vw] font-black text-foreground/15 uppercase`).
- **Outline Styling:** Styled using transparent fill and sharp stroke:
  `style={{ WebkitTextStroke: "1.5px currentColor", color: "transparent" }}`
- **Rotated Messages:**
  - `0% - 33%`: `"ISHAK.BUILDS"`
  - `34% - 66%`: `"BUILD DIFFERENT"`
  - `67% - 100%`: `"BEST OF BESTS"`
- Animations: Text rotates with a fading scale/blur AnimatePresence transition on phase changes.

### HUD Telemetry Layout
- **Top Bar:** Pinned title `// INITIALIZING INTERFACE // ISHAK.BUILDS.CORE_V2.0` and a blinking neon diagnostic beacon.
- **Center Focus:** Floating percentage loader count (`text-7xl sm:text-9xl`) backed by a blocky LED progress bar (20 responsive segments filled sequentially).
- **Bottom Bar:** Dynamic diagnostics parameters collapsing from a single 6-column row (desktop) to 2-columns (mobile) containing:
  - `VIEWPORT_RES`
  - `ENGINE_PLATFORM`
  - `CLOCK_TIME`
  - `CORE_LATENCY`
  - `DIAG_LOAD`
  - `CONNECTION_SEC`

---

## 4. Reusable Pixel Hover Button (`PixelButton.tsx`)

A stylized action component featuring a staggered grid Segment-Wipe on cursor hover.

### Animation Strategy
- Button is configured with `relative overflow-hidden z-10 border-2 border-foreground`.
- Inside, behind the text (which is layered at `z-10`), we place an absolute `grid grid-cols-8` containing 8 vertical block segments.
- On hover, the blocks scale up vertically (`scaleY: 1`) using staggered delays, filling the background color. On hover exit, they scale back down to `0`.
- Segment delays:
  ```typescript
  const delay = Math.abs(Math.sin(index * 1.5)) * 0.12;
  ```
- Alternating origin lines: odd cells originate from top (`originY: 0`) and even cells from bottom (`originY: 1`) to create a zipper pixel wipe.
- The button text flips dynamically (`text-background` on hover, `text-foreground` normally).

---

## 5. Scroll-Animated Responsive Navbar (`Navbar.tsx`)

A reactive navigation container that compresses and sticks to the top of the viewport when scrolled.

### Positioning & Transformations
- Uses React scroll listeners to toggle a client-side boolean `isScrolled` when vertical offset scroll exceeds `20px`.
- **Floating State (scrollY <= 20px):**
  - Offset: `top-4 left-4 right-4`
  - Spacing: `p-4 sm:p-6`
  - Border: Full `border-2 border-accent`
  - Background: `bg-transparent backdrop-blur-sm`
- **Docked State (scrollY > 20px):**
  - Offset: `top-0 left-0 right-0`
  - Spacing: `p-3 sm:p-4`
  - Border: Only bottom border (`border-b-2 border-accent`)
  - Background: Solid themed block `bg-background/90 backdrop-blur-md shadow-md`

### Mobile Adaptation
- The system status info `[ SYSTEM STATUS: ACTIVE ]` is hidden (`hidden md:inline-block`) to preserve space.
- Elements wrap cleanly and buttons compact padding margins (`px-4 py-2.5` on mobile vs `px-6 py-3` on desktop).

### Bracket Formatting
All text fields and components adopt terminal monospace brackets:
- Title logo: `[ISHAK.BUILDS]`
- Code version: `[VER_2026.06]`
- Button target: `[CONNECT]`
- Status indicator: `[SYSTEM STATUS: ACTIVE]`
