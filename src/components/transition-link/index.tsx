"use client";
import { useRouter } from "next/navigation";
import { triggerPageTransition } from "@/lib/page-transition";

interface TransitionLinkProps {
  href: string;
  label: string;
  children: React.ReactNode;
  className?: string;
}

export default function TransitionLink({
  href,
  label,
  children,
  className,
}: TransitionLinkProps) {
  const router = useRouter();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    triggerPageTransition(href, label, (url) => router.push(url));
  }

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  );
}
