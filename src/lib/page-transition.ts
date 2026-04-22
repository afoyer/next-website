import gsap from "gsap";

export const TRANSITION_CONFIG = {
  /** Total animation duration in seconds */
  duration: 1.5,
  /** Alpha of the dark circle overlay (0–1). Change to adjust darkness. */
  overlayOpacity: 1,
  /** GSAP easing for the circle expand/collapse */
  ease: "power2.inOut",
};

/**
 * Maps known hrefs to the CSS variable that holds their accent colour.
 * Add an entry here whenever a page gets a dedicated colour.
 * Falls back to --nav-bg for any unrecognised route.
 */
const PAGE_COLOR_VARS: Record<string, string> = {
  "/about": "--nav-link-active-about",
  "/projects/pantonify": "--nav-link-active-spotify",
  "/work/amazon": "--nav-link-active-amazon",
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

  // Non-null refs guaranteed by the guard above
  const bg = bgEl;
  const label = labelEl;
  const container = containerEl;

  label.textContent = text;
  bg.style.backgroundColor = getPageColor(href);

  // Proxy used to drive the mask-radius during the exit phase
  const maskProxy = { r: 0 };

  const setMask = (r: number) => {
    const v = `${r}%`;
    bg.style.maskImage = `radial-gradient(circle at ${screenCenter}, transparent ${v}, black ${v})`;
  };

  gsap
    .timeline()
    .set(container, { pointerEvents: "auto" })
    .set(bg, { clipPath: `circle(0% at ${at})`, opacity: TRANSITION_CONFIG.overlayOpacity })
    .set(label, { opacity: 0 })
    // Expand circle from click origin
    .to(bg, {
      clipPath: `circle(150% at ${at})`,
      duration: phaseDuration * 2,
      ease,
    })
    // Label fades in while circle is full
    .to(label, { opacity: 1, duration: phaseDuration*0.8, ease: "power2.inOut" }, `-=${phaseDuration * 2}`)
    .call(() => push(href))
    // Label fades out
    .to(label, { opacity: 0, duration: phaseDuration, ease: "power2.inOut" })
    // Switch from clip-path to mask for the opening exit
    .call(() => {
      gsap.set(bg, { clipPath: "none" });
      maskProxy.r = 0;
      setMask(0);
    })
    // Hole expands from screen center, revealing the new page
    .to(maskProxy, {
      r: 150,
      duration: phaseDuration * 2,
      ease,
      onUpdate: () => setMask(maskProxy.r),
      onComplete: () => {
        bg.style.maskImage = "";
        gsap.set(bg, { clipPath: "circle(0% at 50% 50%)" });
      },
    })
    .set(container, { pointerEvents: "none" });
}
