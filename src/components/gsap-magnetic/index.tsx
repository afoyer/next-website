import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface GsapMagneticProps {
  children: React.ReactNode;
  className?: string;
  scale?: number;
}

function GsapMagnetic({ children, scale = 1, ...props }: GsapMagneticProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!ref.current) return;
    const mouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { width, height, top, left } = ref.current!.getBoundingClientRect();
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      gsap.to(ref.current, {
        x: x * scale,
        y: y * scale,
        duration: 0.5,
        ease: "linear",
        overwrite: true,
      });
    };
    const mouseLeave = () => {
      gsap.to(ref.current, {
        x: 0,
        y: 0,
        duration: 0.4,
        ease: "expo.inOut",
        overwrite: true,
      });
    };
    ref.current!.addEventListener("mousemove", mouseMove);
    ref.current!.addEventListener("mouseleave", mouseLeave);
    return () => {
      ref.current!.removeEventListener("mousemove", mouseMove);
      ref.current!.removeEventListener("mouseleave", mouseLeave);
    };
  });

  return (
    <div ref={ref} {...props}>
      {children}
    </div>
  );
}

export default GsapMagnetic;
export type { GsapMagneticProps };
