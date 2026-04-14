import gsap from "gsap";

let containerEl: HTMLElement | null = null;
let blurEl: HTMLElement | null = null;
let bgEl: HTMLElement | null = null;
let labelEl: HTMLElement | null = null;

export function registerTransitionElements(
  container: HTMLElement,
  blur: HTMLElement,
  bg: HTMLElement,
  label: HTMLElement
) {
  containerEl = container;
  blurEl = blur;
  bgEl = bg;
  labelEl = label;
}

// duration = total transition time in seconds
export function triggerPageTransition(
  href: string,
  text: string,
  push: (href: string) => void,
  duration = 1
) {
  if (!containerEl || !blurEl || !bgEl || !labelEl) {
    push(href);
    return;
  }

  labelEl.textContent = text;
  const d = duration / 6;

  gsap
    .timeline()
    .set(containerEl, { pointerEvents: "auto" })
    .set([blurEl, bgEl, labelEl], { opacity: 0 })
    .set(blurEl, { backdropFilter: "blur(0px)" })
    // blur in
    .to(blurEl, { opacity: 1, backdropFilter: "blur(16px)", duration: d, ease: "power2.inOut" })
    // solid bg fades in (overlaps with blur)
    .to(bgEl, { opacity: 1, duration: d, ease: "power2.inOut" }, `-=${d * 0.5}`)
    // text fades in
    .to(labelEl, { opacity: 1, duration: d + 0.5, ease: "power2.inOut" })
    .call(() => push(href))
    // reverse: text out
    .to(labelEl, { opacity: 0, duration: d, ease: "power2.inOut" })
    // solid bg fades out
    .to(bgEl, { opacity: 0, duration: d, ease: "power2.inOut" })
    // blur out (overlaps with bg)
    .to(blurEl, { opacity: 0, backdropFilter: "blur(0px)", duration: d, ease: "power2.inOut" }, `-=${d * 0.5}`)
    .set(containerEl, { pointerEvents: "none" });
}
