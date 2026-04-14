import gsap from "gsap";

export const TRANSITION_CONFIG = {
  /** Total animation duration in seconds */
  duration: 1.5,
  /** Alpha of the dark circle overlay (0–1). Change to adjust darkness. */
  overlayOpacity: 0.92,
  /** GSAP easing for the circle expand/collapse */
  ease: "cubic-bezier(0.76, 0, 0.24, 1)",
};

/**
 * Maps known hrefs to the CSS variable that holds their accent colour.
 * Add an entry here whenever a page gets a dedicated colour.
 * Falls back to --nav-bg for any unrecognised route.
 */
const PAGE_COLOR_VARS: Record<string, string> = {
  "/about": "--nav-link-active-about",
  "/projects/pantonify": "--nav-link-active-spotify",
  "/work/amazon": "--nav-link-active-linkedin",
};

function getPageColor(href: string): string {
  const varName = PAGE_COLOR_VARS[href] ?? "--nav-bg";
  return (
    getComputedStyle(document.documentElement).getPropertyValue(varName).trim() ||
    "#292929"
  );
}

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
  const phaseDuration = duration / 6;
  const ease = TRANSITION_CONFIG.ease;
  const at = `${cx}px ${cy}px`;
  const screenCenter = `${window.innerWidth / 2}px ${window.innerHeight / 2}px`;

  labelEl.textContent = text;
  bgEl.style.backgroundColor = getPageColor(href);

  gsap
    .timeline()
    .set(containerEl, { pointerEvents: "auto" })
    .set(bgEl, { clipPath: `circle(0% at ${at})`, opacity: TRANSITION_CONFIG.overlayOpacity })
    .set(labelEl, { opacity: 0 })
    // Expand circle from click origin
    .to(bgEl, {
      clipPath: `circle(150% at ${at})`,
      duration: phaseDuration * 2,
      ease,
    })
    // Label fades in while circle is full
    .to(labelEl, { opacity: 1, duration: phaseDuration, ease: "power2.inOut" }, `-=${phaseDuration * 0.5}`)
    .call(() => push(href))
    // Label fades out
    .to(labelEl, { opacity: 0, duration: phaseDuration, ease: "power2.inOut" })
    // Circle collapses out from screen center
    .to(bgEl, {
      clipPath: `circle(0% at ${screenCenter})`,
      duration: phaseDuration * 2,
      ease,
    }, `-=${phaseDuration * 0.5}`)
    .set(containerEl, { pointerEvents: "none" });
}
