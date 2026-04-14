import gsap from "gsap";

export const TRANSITION_CONFIG = {
  /** Total animation duration in seconds */
  duration: 1,
  /** Alpha of the dark circle overlay (0–1). Change to adjust darkness. */
  overlayOpacity: 0.92,
  /** GSAP easing for the circle expand/collapse */
  ease: "cubic-bezier(0.76, 0, 0.24, 1)",
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
