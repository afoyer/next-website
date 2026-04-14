import { motion } from "motion/react";
import Link from "next/link";
import { useMemo } from "react";

const DEFAULT_DELAY = 0.05;
const STAGGER_DELAY = 0.2;

const linkHoverVariants = {
  hovered: ({ index, length }: { index: number; length: number }) => {
    return {
      y: "-100%",
      transition: {
        delay: DEFAULT_DELAY + (index / length) * STAGGER_DELAY,
      },
    };
  },
  notHovered: ({ index, length }: { index: number; length: number }) => {
    return {
      y: 0,
      transition: {
        delay: DEFAULT_DELAY + (index / length) * STAGGER_DELAY,
      },
    };
  },
};
const bottomLinkHoverVariants = {
  hovered: ({ index, length }: { index: number; length: number }) => {
    return {
      y: 0,
      transition: {
        duration: 0.2,
        delay: DEFAULT_DELAY + (index / length) * STAGGER_DELAY,
      },
    };
  },
  notHovered: ({ index, length }: { index: number; length: number }) => {
    return {
      y: "100%",
      transition: {
        duration: 0.2,
        delay: DEFAULT_DELAY + (index / length) * STAGGER_DELAY,
      },
    };
  },
};

export default function LinkHover({
  children,
  href,
  casing,
  className,
  onClick,
}: {
  children: string;
  href: string;
  casing?: "uppercase" | "lowercase";
  className?: string;
  onClick?: () => void;
}) {
  const text = useMemo(() => children.split(/(?<=.)/), [children]);
  return (
    <motion.div className={className} initial="notHovered" whileHover="hovered">
      <motion.div
        className={`overflow-hidden relative whitespace-nowrap block ${casing ?? ""}`}
        style={{
          lineHeight: casing === "lowercase" ? 1.1 : 0.9,
        }}
      >
        <Link href={href} onClick={onClick}>
          <motion.div>
            {text.map((char, index) => (
              <motion.span
                key={`top-${index}`}
                variants={linkHoverVariants}
                className={
                  char === " " ? "inline-block whitespace-pre" : "inline-block"
                }
                custom={{ index, length: text.length }}
              >
                {char}
              </motion.span>
            ))}
          </motion.div>
          <div className="absolute inset-0">
            {text.map((char, index) => (
              <motion.span
                key={`bottom-${index}`}
                variants={bottomLinkHoverVariants}
                className={
                  char === " " ? "inline-block whitespace-pre" : "inline-block"
                }
                custom={{ index, length: text.length }}
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </div>
        </Link>
      </motion.div>
    </motion.div>
  );
}
