"use client";

import { motion } from "motion/react";
import { Menu } from "lucide-react";

type MobileMenuButtonProps = {
  isOpen: boolean;
  onClick: () => void;
};

export function MobileMenuButton({ isOpen, onClick }: MobileMenuButtonProps) {
  return (
    <div className="absolute right-2 top-50% block lg:hidden overflow-hidden">
      <button
        onClick={onClick}
        className="flex items-center justify-center"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2, ease: [0.76, 0, 0.24, 1] }}
        >
          <Menu size={28} />
        </motion.div>
      </button>
    </div>
  );
}
