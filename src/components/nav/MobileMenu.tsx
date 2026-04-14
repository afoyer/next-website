"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { navLinks } from "./data";
import { DarkModeToggle } from "./DarkModeToggle";
import type { Project } from "./projects";

const EASE_SMOOTH = [0.76, 0, 0.24, 1] as [number, number, number, number];

const itemVariants = {
  open: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.34, 1.56, 0.64, 1] as [number, number, number, number] },
  },
  closed: {
    opacity: 0,
    y: 16,
    transition: { duration: 0.15, ease: "easeIn" as const },
  },
};

type MobileMenuProps = {
  isOpen: boolean;
  onClose: () => void;
  origin: { x: number; y: number };
  projects: Project[];
};

export function MobileMenu({ isOpen, onClose, origin, projects }: MobileMenuProps) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const at = `${origin.x}px ${origin.y}px`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="mobile-menu"
          className="fixed inset-0 z-[150] flex flex-col lg:hidden"
          style={{ backgroundColor: "color-mix(in srgb, var(--nav-bg) 92%, transparent)" }}
          initial={{ clipPath: `circle(0% at ${at})` }}
          animate={{
            clipPath: `circle(150% at ${at})`,
            transition: { duration: 0.65, ease: EASE_SMOOTH },
          }}
          exit={{
            clipPath: `circle(0% at ${at})`,
            transition: { duration: 0.5, ease: EASE_SMOOTH, delay: 0.05 },
          }}
        >
          {/* Blur layer */}
          <div className="absolute inset-0 -z-10 backdrop-blur-2xl" />

          {/* Close button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, transition: { delay: 0.4, duration: 0.2 } }}
            exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.1 } }}
            onClick={onClose}
            aria-label="Close menu"
            className="absolute top-3 right-4 z-10 flex items-center justify-center w-9 h-9 rounded-full"
            style={{
              color: "var(--nav-icon)",
              backgroundColor: "color-mix(in srgb, var(--nav-icon) 10%, transparent)",
            }}
          >
            <X size={20} />
          </motion.button>

          {/* Content fades in after circle opens */}
          <motion.div
            className="flex flex-col justify-between h-full pt-[72px] pb-10 px-6 overflow-y-auto"
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ delayChildren: 0.35, staggerChildren: 0.07 }}
          >
            {/* Nav links */}
            <nav className="flex flex-col gap-2 mt-6">
              {navLinks.map(({ label, href }) => (
                <motion.div key={label} variants={itemVariants}>
                  <Link
                    href={href}
                    onClick={onClose}
                    className="block text-5xl font-bold uppercase py-2"
                    style={{ color: "var(--nav-icon)" }}
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Projects grid */}
            <div className="mt-8">
              <motion.p
                variants={itemVariants}
                className="text-xs font-semibold uppercase tracking-widest mb-3 opacity-50"
                style={{ color: "var(--nav-icon)" }}
              >
                Projects
              </motion.p>
              <div className="grid grid-cols-2 gap-3">
                {projects.map((project, i) => (
                  <motion.div
                    key={project.link + i}
                    variants={itemVariants}
                    className="relative aspect-video rounded-xl overflow-hidden"
                  >
                    <Link href={project.link} onClick={onClose} className="block w-full h-full">
                      {project.image.startsWith("/") && (
                        <Image
                          src={project.image}
                          alt={project.title || "Project"}
                          fill
                          sizes="50vw"
                          className="object-cover opacity-70"
                        />
                      )}
                      {project.title && (
                        <span
                          className="absolute inset-0 flex items-end p-2 text-xs font-semibold"
                          style={{ color: "var(--nav-icon)" }}
                        >
                          {project.title}
                        </span>
                      )}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Dark mode toggle */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-3 mt-8"
              style={{ color: "var(--nav-icon)" }}
            >
              <DarkModeToggle className="w-8 h-8" />
              <span className="text-sm font-medium uppercase tracking-widest opacity-60">Theme</span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
