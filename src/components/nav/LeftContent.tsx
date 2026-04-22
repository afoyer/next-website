"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { House } from "lucide-react";

const pathVariants = {
  open: {
    opacity: 1,
    x: 0,
  },
  closed: {
    opacity: 0,
    x: -20,
  },
};

export function LeftContent() {
  const pathName = usePathname();

  return (
    <AnimatePresence mode="wait">
      {pathName !== "/" && (
        <>
          <motion.span
            key="home-link"
            variants={pathVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            <Link href="/" className="">
              <House size={28} className="translate-y-[2px] mr-2" />
            </Link>
          </motion.span>
          <motion.p
            key="path-separator"
            variants={pathVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            /
          </motion.p>
          <motion.p
            key={pathName}
            variants={pathVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ duration: 0.2, ease: "easeInOut" }}
          >
            {pathName.split("/").pop()}
          </motion.p>
        </>
      )}
    </AnimatePresence>
  );
}
