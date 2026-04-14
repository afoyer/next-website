import gsap from "gsap";
import styles from "../component.module.scss";

function getNavColor(varName: string): string {
  return (
    getComputedStyle(document.documentElement).getPropertyValue(varName).trim() ||
    "#1d1d1d"
  );
}

/**
 * Changes the background color of the navbar based on the path name.
 * Uses CSS variables so colors respond to dark/light mode.
 */
export function changePath(pathName: string) {
  // Mobile nav has no background — skip to avoid overriding the transparent SCSS default
  if (window.matchMedia("(max-width: 1023px)").matches) return;

  const selector = `.${styles.nav_content}`;
  const duration = 0.5;
  const ease = "power2.inOut";

  if (pathName === "/projects/pantonify") {
    gsap.to(selector, {
      backgroundColor: getNavColor("--nav-link-active-spotify"),
      duration,
      ease,
    });
  } else if (pathName === "/about") {
    gsap.to(selector, {
      backgroundColor: getNavColor("--nav-link-active-about"),
      duration,
      ease,
    });
  } else {
    gsap.to(selector, {
      backgroundColor: getNavColor("--nav-bg"),
      duration,
      ease,
    });
  }
}
