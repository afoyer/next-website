"use client";

import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationControls } from "motion/react";
import Link from "next/link";
import { House } from "lucide-react";
import Projects from "./projects";
import styles from "./component.module.scss";
import { changePath } from "./anims/change-path";
import { useNavScrollHide, useMobileBreakpoint } from "./hooks";
import { LeftContent } from "./LeftContent";
import { NavLogo } from "./NavLogo";
import { NavLinks } from "./NavLinks";
import { MobileMenu } from "./MobileMenu";
import { projects } from "./data";
import { useThemeStore } from "@/store/theme";

export default function Nav() {
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [menuOrigin, setMenuOrigin] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const mode = useThemeStore((s) => s.mode);
  const isMobile = useMobileBreakpoint();
  const pathName = usePathname();

  useNavScrollHide(navRef);

  const closeProjects = () => {
    timeoutRef.current = setTimeout(() => setIsProjectsOpen(false), 300);
  };

  const openProjects = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsProjectsOpen(true);
  };

  const handleLogoClick = () => {
    if (logoRef.current) {
      const rect = logoRef.current.getBoundingClientRect();
      setMenuOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    }
    setIsMobileMenuOpen((v) => !v);
  };

  const navControls = useAnimationControls();
  const ease = [0.76, 0, 0.24, 1] as const;

  // Entrance — runs once after mount when isMobile is correctly set by useLayoutEffect
  useEffect(() => {
    navControls.set({ y: isMobile ? -80 : 80, opacity: 0 });
    navControls.start({ y: 0, opacity: 1, transition: { duration: 0.6, ease } });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useGSAP(() => { changePath(pathName); }, { dependencies: [pathName, mode, isMobile] });

  const segment = pathName.split("/").filter(Boolean).pop();

  return (
    <>
      {/* Rendered outside <nav> so it escapes the z-151 stacking context */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        origin={menuOrigin}
        projects={projects}
      />

      <motion.nav
        ref={navRef}
        className="block z-[151] fixed w-full top-[10px] lg:top-auto bottom-auto lg:bottom-[33px]"
        initial={{ opacity: 0 }}
        animate={navControls}
      >
        <div className={styles.navbar}>
          <motion.header
            className={styles.nav_content}
            onHoverStart={openProjects}
            onHoverEnd={closeProjects}
          >
            {/* Desktop: left breadcrumb */}
            <motion.div
              key="home"
              initial="closed"
              animate="open"
              exit="closed"
              className={styles.left_content}
            >
              <LeftContent />
            </motion.div>

            {/* Logo — center on desktop, left on mobile */}
            <div ref={logoRef} className={styles.logo_wrapper}>
              <NavLogo onClick={isMobile ? handleLogoClick : undefined} />
            </div>

            {/* Mobile breadcrumb: | [house] /segment */}
            <AnimatePresence mode="wait">
              {isMobile && segment && (
                <motion.div
                  key={segment}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className={styles.mobile_breadcrumb}
                >
                  <Link href="/" aria-label="Home">
                    <House size={14} className="opacity-70" />
                  </Link>
                  <span className="opacity-50">/</span>
                  <span>{segment}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Desktop: right nav links */}
            <ul className={styles.right_content}>
              <NavLinks onLinkClick={() => setIsProjectsOpen(false)} />
            </ul>

            <AnimatePresence>
              {!isMobile && (
                <Projects
                  isOpen={isProjectsOpen}
                  setIsOpen={setIsProjectsOpen}
                  position="top"
                  projects={projects}
                />
              )}
            </AnimatePresence>
          </motion.header>
        </div>
      </motion.nav>
    </>
  );
}
