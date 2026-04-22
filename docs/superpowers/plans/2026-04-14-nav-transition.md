# Nav Consolidation + Ripple Page Transition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove dead nav stubs, then replace the full-screen blur/fade page transition with an origin-aware circle ripple that expands from the clicked nav link.

**Architecture:** The click origin (screen coords) flows from `NavLinks` → `triggerPageTransition` → GSAP `clipPath` circle animation on the `PageTransition` overlay. No new global state. `TransitionLink` also gets origin support for use outside the nav.

**Tech Stack:** Next.js 15, GSAP, motion/react, TypeScript, SCSS modules, Tailwind CSS, Bun

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/components/nav/MobileMenuButton.tsx` | Delete | Dead code — not imported anywhere |
| `src/components/nav/MobilePageLabel.tsx` | Delete | Dead code — not imported anywhere |
| `src/lib/page-transition.ts` | Modify | Add `TRANSITION_CONFIG`, `origin` param, clipPath circle animation, `prefers-reduced-motion` guard |
| `src/components/page-transition/index.tsx` | Modify | Simplify to container + one dark overlay div + label span; add `aria-hidden` |
| `src/components/nav/NavLinks.tsx` | Modify | Add per-link refs, compute click origin, call transition with label; skip external hrefs |
| `src/components/transition-link/index.tsx` | Modify | Forward click coords to `triggerPageTransition` |

---

## Task 1: Delete dead nav stubs

**Files:**
- Delete: `src/components/nav/MobileMenuButton.tsx`
- Delete: `src/components/nav/MobilePageLabel.tsx`

- [ ] **Step 1: Confirm neither file is imported anywhere**

```bash
grep -r "MobileMenuButton\|MobilePageLabel" src/
```

Expected output: only the two files themselves appear (self-definitions only, no imports).

- [ ] **Step 2: Delete both files**

```bash
rm src/components/nav/MobileMenuButton.tsx src/components/nav/MobilePageLabel.tsx
```

- [ ] **Step 3: Verify build still passes**

```bash
bun run build
```

Expected: build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove unused MobileMenuButton and MobilePageLabel stubs"
```

---

## Task 2: Update `page-transition.ts` — config, origin, clipPath animation

**Files:**
- Modify: `src/lib/page-transition.ts`

- [ ] **Step 1: Replace the entire file with the new implementation**

```ts
import gsap from "gsap";

export const TRANSITION_CONFIG = {
  /** Total animation duration in seconds */
  duration: 1,
  /** Alpha of the dark circle overlay (0–1). Change to adjust darkness. */
  overlayOpacity: 0.92,
  /** GSAP easing for the circle expand/collapse */
  ease: [0.76, 0, 0.24, 1] as const,
};

let containerEl: HTMLElement | null = null;
let bgEl: HTMLElement | null = null;
let labelEl: HTMLElement | null = null;

export function registerTransitionElements(
  container: HTMLElement,
  bg: HTMLElement,
  label: HTMLElement
) {
  containerEl = container;
  bgEl = bg;
  labelEl = label;
}

export interface TransitionOptions {
  /** Screen coords of the click origin. Defaults to screen center. */
  origin?: { x: number; y: number };
  /** Override total duration (seconds). */
  duration?: number;
}

export function triggerPageTransition(
  href: string,
  text: string,
  push: (href: string) => void,
  options: TransitionOptions = {}
) {
  // Respect reduced-motion preference
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    push(href);
    return;
  }

  if (!containerEl || !bgEl || !labelEl) {
    push(href);
    return;
  }

  const cx = options.origin?.x ?? window.innerWidth / 2;
  const cy = options.origin?.y ?? window.innerHeight / 2;
  const duration = options.duration ?? TRANSITION_CONFIG.duration;
  const d = duration / 6;
  const ease = TRANSITION_CONFIG.ease;
  const at = `${cx}px ${cy}px`;

  if (labelEl) labelEl.textContent = text;

  gsap
    .timeline()
    .set(containerEl, { pointerEvents: "auto" })
    .set(bgEl, { clipPath: `circle(0% at ${at})`, opacity: TRANSITION_CONFIG.overlayOpacity })
    .set(labelEl, { opacity: 0 })
    // Expand circle from origin
    .to(bgEl, {
      clipPath: `circle(150% at ${at})`,
      duration: d * 2,
      ease,
    })
    // Label fades in while circle is full
    .to(labelEl, { opacity: 1, duration: d, ease: "power2.inOut" }, `-=${d * 0.5}`)
    .call(() => push(href))
    // Label fades out
    .to(labelEl, { opacity: 0, duration: d, ease: "power2.inOut" })
    // Circle collapses back to origin
    .to(bgEl, {
      clipPath: `circle(0% at ${at})`,
      duration: d * 2,
      ease,
    }, `-=${d * 0.5}`)
    .set(containerEl, { pointerEvents: "none" });
}
```

- [ ] **Step 2: Type-check**

```bash
bunx tsc --noEmit
```

Expected: no errors. (If errors appear about `registerTransitionElements` signature change, they will be fixed in Task 3.)

---

## Task 3: Simplify `PageTransition` component

**Files:**
- Modify: `src/components/page-transition/index.tsx`

The `registerTransitionElements` call now takes 3 args (container, bg, label) instead of 4 (container, blur, bg, label). The blur layer is removed.

- [ ] **Step 1: Replace the entire file**

```tsx
"use client";
import { useEffect, useRef } from "react";
import { registerTransitionElements, TRANSITION_CONFIG } from "@/lib/page-transition";

export default function PageTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current && bgRef.current && labelRef.current) {
      registerTransitionElements(
        containerRef.current,
        bgRef.current,
        labelRef.current
      );
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[200] pointer-events-none"
      aria-hidden="true"
      role="presentation"
    >
      {/* Dark circle overlay — GSAP drives clipPath on this element */}
      <div
        ref={bgRef}
        className="absolute inset-0"
        style={{
          backgroundColor: "var(--nav-bg)",
          opacity: TRANSITION_CONFIG.overlayOpacity,
          clipPath: "circle(0% at 50% 50%)",
        }}
      />
      {/* Destination label — sibling to bgRef so it renders above the circle */}
      <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
        <span
          ref={labelRef}
          className="text-[color:var(--nav-icon)] text-2xl font-medium uppercase tracking-widest opacity-0 select-none"
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
bunx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/lib/page-transition.ts src/components/page-transition/index.tsx
git commit -m "feat: replace blur/fade transition with origin-aware circle ripple"
```

---

## Task 4: Wire origin in `NavLinks`

**Files:**
- Modify: `src/components/nav/NavLinks.tsx`

Each nav link gets a `ref` so we can compute its center on click. External links (starting with `http`) fall back to plain navigation.

- [ ] **Step 1: Replace the entire file**

```tsx
"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import LinkHover from "../link-hover";
import { navLinks } from "./data";
import { triggerPageTransition } from "@/lib/page-transition";
import styles from "./component.module.scss";

type NavLinksProps = {
  onLinkClick?: () => void;
};

export function NavLinks({ onLinkClick }: NavLinksProps) {
  const router = useRouter();
  // One ref per link, keyed by index
  const linkRefs = useRef<(HTMLDivElement | null)[]>([]);

  return (
    <>
      {navLinks.map(({ label, href }, i) => {
        const isExternal = href.startsWith("http");

        const handleClick = isExternal
          ? onLinkClick
          : () => {
              onLinkClick?.();
              const el = linkRefs.current[i];
              const origin = el
                ? (() => {
                    const r = el.getBoundingClientRect();
                    return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
                  })()
                : undefined;
              triggerPageTransition(href, label, (url) => router.push(url), { origin });
            };

        return (
          <div
            key={label}
            ref={(el) => { linkRefs.current[i] = el; }}
          >
            <LinkHover
              className={`p-2 ${styles.navLink}`}
              href={isExternal ? href : "#"}
              onClick={handleClick}
            >
              {label}
            </LinkHover>
          </div>
        );
      })}
    </>
  );
}
```

> **Note:** For external links, `href` is passed through normally so the browser handles navigation. For internal links, `href="#"` prevents the default `<Link>` navigation — the transition fires the router push instead.

- [ ] **Step 2: Type-check**

```bash
bunx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/nav/NavLinks.tsx
git commit -m "feat: wire click-origin refs in NavLinks for ripple transition"
```

---

## Task 5: Forward click coords in `TransitionLink`

**Files:**
- Modify: `src/components/transition-link/index.tsx`

`TransitionLink` is used for non-nav links (e.g. project cards). Extract the click coords from the event so the ripple originates from the element, not the screen center.

- [ ] **Step 1: Replace the entire file**

```tsx
"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { triggerPageTransition } from "@/lib/page-transition";

interface TransitionLinkProps {
  href: string;
  label: string;
  children: React.ReactNode;
  className?: string;
}

export default function TransitionLink({
  href,
  label,
  children,
  className,
}: TransitionLinkProps) {
  const router = useRouter();
  const ref = useRef<HTMLAnchorElement>(null);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    const el = ref.current;
    const origin = el
      ? (() => {
          const r = el.getBoundingClientRect();
          return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
        })()
      : { x: e.clientX, y: e.clientY };
    triggerPageTransition(href, label, (url) => router.push(url), { origin });
  }

  return (
    <a ref={ref} href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
```

- [ ] **Step 2: Type-check**

```bash
bunx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Full build**

```bash
bun run build
```

Expected: build succeeds with no errors or type errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/transition-link/index.tsx
git commit -m "feat: forward element center as ripple origin in TransitionLink"
```

---

## Task 6: Manual verification

- [ ] **Step 1: Start the dev server**

```bash
bun dev
```

- [ ] **Step 2: Verify desktop nav ripple**

Open `http://localhost:3000` in a browser. Click "about" in the desktop nav (visible at ≥1024px width). Verify:
- A dark circle expands from the "about" link position
- "about" text appears centered while the circle is full
- The page navigates to `/about`
- The circle collapses after navigation

- [ ] **Step 3: Verify origin accuracy for each link**

Click "photos" and (if on desktop) observe the ripple originates from the "photos" link, not from center screen.

- [ ] **Step 4: Verify external link fallback**

Click "linkedin". Verify no transition fires and the browser navigates directly to the external URL.

- [ ] **Step 5: Verify dark/light mode contrast**

Toggle dark/light mode via the logo tap. Confirm the overlay color shifts with the theme (uses `var(--nav-bg)`) and the label remains legible in both modes.

- [ ] **Step 6: Verify reduced-motion fallback**

In browser DevTools → Rendering → "Emulate CSS media feature prefers-reduced-motion: reduce". Click a nav link. Verify the page navigates immediately with no animation.

- [ ] **Step 7: Verify mobile nav is unaffected**

At <1024px width, tap the logo to open the mobile menu. Verify the circle menu still opens from the logo, unchanged.

---

## Self-Review Notes

- **Spec coverage:**
  - ✅ Delete dead stubs (Task 1)
  - ✅ `TRANSITION_CONFIG` with duration, opacity, ease (Task 2)
  - ✅ `origin` param with screen-center fallback (Task 2)
  - ✅ `prefers-reduced-motion` guard (Task 2)
  - ✅ `aria-hidden` + `role="presentation"` (Task 3)
  - ✅ Circle reveal from click origin (Tasks 2+3)
  - ✅ Darker overlay (Task 3 — uses `--nav-bg` at 0.92 opacity)
  - ✅ Label shows destination name (Task 2 — `labelEl.textContent = text`)
  - ✅ External links skip transition (Task 4)
  - ✅ `TransitionLink` forwards origin (Task 5)
  - ✅ Dark/light mode via CSS variable (Task 3)

- **No placeholders present.**
- **Type signatures consistent:** `registerTransitionElements(container, bg, label)` — 3 args — matches across Tasks 2 and 3. `triggerPageTransition(href, text, push, options?)` matches across Tasks 2, 4, and 5.
