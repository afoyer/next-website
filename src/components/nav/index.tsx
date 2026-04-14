"use client";

import { useGSAP } from "@gsap/react";
import { usePathname } from "next/navigation";
import { useRef, useState } from "react";
import { motion } from "motion/react";
import Projects from "./projects";
import styles from "./component.module.scss";
import { changePath } from "./anims/change-path";
import { useNavScrollHide } from "./hooks";
import { LeftContent } from "./LeftContent";
import { NavLogo } from "./NavLogo";
import { NavLinks } from "./NavLinks";
import { MobileMenuButton } from "./MobileMenuButton";
import { projects } from "./data";
import { useThemeStore } from "@/store/theme";

export default function Nav() {
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const mode = useThemeStore((s) => s.mode);

  useNavScrollHide(navRef);

  const closeProjects = () => {
    timeoutRef.current = setTimeout(() => {
      setIsProjectsOpen(false);
    }, 300);
  };

  const openProjects = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsProjectsOpen(true);
  };

  const pathName = usePathname();

  useGSAP(
    () => {
      changePath(pathName);
    },
    {
      dependencies: [pathName, mode],
    },
  );

  return (
    <nav
      ref={navRef}
      className="block z-[151] fixed w-full top-[10px] lg:top-auto bottom-auto lg:bottom-[33px] z-51"
    >
      <div className={styles.navbar}>
        <motion.header
          className={styles.nav_content}
          onHoverStart={openProjects}
          onHoverEnd={closeProjects}
        >
          <motion.div
            key="home"
            initial="closed"
            animate="open"
            exit="closed"
            className={styles.left_content}
          >
            <LeftContent />
          </motion.div>

          <div className="h-full flex items-center justify-center overflow-hidden">
            <NavLogo />
          </div>

          <ul className={styles.right_content}>
            <NavLinks onLinkClick={() => setIsProjectsOpen(false)} />
          </ul>

          <MobileMenuButton
            isOpen={isProjectsOpen}
            onClick={() => setIsProjectsOpen(!isProjectsOpen)}
          />

          <Projects
            isOpen={isProjectsOpen}
            setIsOpen={setIsProjectsOpen}
            position="top"
            projects={projects}
          />
        </motion.header>
      </div>
    </nav>
  );
}
