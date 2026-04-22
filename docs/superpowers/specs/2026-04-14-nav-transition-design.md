# Nav Consolidation + Ripple Page Transition

**Date:** 2026-04-14  
**Status:** Approved

---

## Overview

Two related goals:
1. Lightly consolidate the nav component — remove dead stubs, keep the clean file split.
2. Replace the current full-screen blur/fade page transition with an origin-aware circle ripple that expands from the clicked nav link, shows the destination label, and uses a darker overlay.

---

## Part 1 — Nav Consolidation

### What changes

- **Delete `MobileMenuButton.tsx` and `MobilePageLabel.tsx`** if they are empty stubs not referenced anywhere. If they have content, inline them into `index.tsx` (they are single-use, small).
- **No other file merges.** The existing split — `NavLinks`, `LeftContent`, `NavLogo`, `MobileMenu`, `Projects`, `DarkModeToggle`, `hooks/`, `data/`, `anims/` — is already well-bounded and stays as-is.
- All UI and behavior remains identical after the consolidation.

### What does NOT change

- `MobileMenu` (the full-screen circle menu triggered by the logo on mobile) — untouched.
- `Projects` hover panel — untouched.
- `LinkHover` per-character stagger animation — untouched.
- SCSS module, CSS variables, theme tokens — untouched.

---

## Part 2 — Ripple Page Transition

### Approach

Extend the existing `triggerPageTransition` plumbing (Option A). No new global state. The origin coordinate flows as a parameter from the click site down to the animation function.

### Files changed

| File | Change |
|---|---|
| `src/lib/page-transition.ts` | Add `origin` param, switch animation to `clipPath` circle reveal, add `TRANSITION_CONFIG`, add `prefers-reduced-motion` guard |
| `src/components/page-transition/index.tsx` | Simplify to container + one dark overlay div + label span; remove blur/solid-bg layers |
| `src/components/nav/NavLinks.tsx` | Add per-link `ref`, compute origin on click, call transition with origin + label |
| `src/components/transition-link/index.tsx` | Pass origin from click event to `triggerPageTransition` |

### Animation design

**Trigger:** user clicks a desktop nav link.

**Timeline** (total ~1s, configurable):
1. Dark circle expands from click origin: `circle(0% at {x}px {y}px)` → `circle(150% at {x}px {y}px)` — ~0.4s
2. Destination label fades in (centered) while circle is full — ~0.2s
3. `router.push(href)` fires
4. Label fades out — ~0.15s
5. Circle collapses back — ~0.4s, `pointer-events: none` restored

**Label text:** destination page name passed as the existing `text` argument to `triggerPageTransition`. In `NavLinks`, this is the `label` field from `navLinks` data (e.g. `"about"`, `"photos"`). In `Projects`, this is `project.title`.

### Configurability

Single `TRANSITION_CONFIG` constant at the top of `page-transition.ts`:

```ts
const TRANSITION_CONFIG = {
  duration: 1,          // total animation duration in seconds
  overlayOpacity: 0.92, // alpha of the dark circle overlay
  ease: [0.76, 0, 0.24, 1] as const,
};
```

### Theming (dark/light mode)

The overlay color uses `var(--nav-bg)` — the same CSS variable already used by `MobileMenu`. This means:
- Dark/light overlay color is controlled entirely by the theme token in `globals.css`.
- No hardcoded colors in animation code.
- To make it darker: adjust `overlayOpacity` in `TRANSITION_CONFIG` or update `--nav-bg` per theme.

### Accessibility

- `PageTransition` container: `aria-hidden="true"` + `role="presentation"` — screen readers skip it entirely.
- `prefers-reduced-motion`: if the media query matches, `triggerPageTransition` calls `push(href)` immediately with no animation.
- Nav link text content is already descriptive; no additional `aria-label` needed on non-icon links.
- The `House` icon link in `LeftContent` already carries `aria-label="Home"` — no change needed.
- `pointer-events: none` is restored on the overlay after animation completes so keyboard navigation is never blocked.

### External links

Links with an `href` starting with `http` (e.g. LinkedIn) are treated as plain `<a>` navigations — no transition is triggered. `NavLinks` checks `href.startsWith("http")` before calling `triggerPageTransition` and falls back to default browser navigation.

### Origin fallback

If `origin` is not provided (e.g. a `TransitionLink` used outside the nav where no ref is available), the circle originates from the screen center — same behavior as before, no regression.

---

## Out of scope

- Mobile nav links do not get the ripple transition (mobile uses the `MobileMenu` circle pattern instead).
- External links (e.g. LinkedIn) navigate normally — no transition.
- No changes to GSAP registration, `useGSAP`, or the `changePath` animation.
