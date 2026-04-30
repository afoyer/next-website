"use client";
import { useRef } from "react";
import { useRouter } from "next/navigation";
import { triggerPageTransition } from "@/lib/page-transition";

interface TransitionLinkProps {
  href: string;
  label: string;
  children: React.ReactNode;
  className?: string;
  callback?: () => void;
}

export default function TransitionLink({
  href,
  label,
  children,
  className,
  callback
}: TransitionLinkProps) {
  const router = useRouter();
  const ref = useRef<HTMLAnchorElement>(null);

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    const el = ref.current;
    let origin: { x: number; y: number } | undefined;
    if (el) {
      const r = el.getBoundingClientRect();
      origin = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    }
    triggerPageTransition(href, label, (url) => router.push(url), { origin });
    if (callback) callback();
  }

  return (
    <a ref={ref} href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
