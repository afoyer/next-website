"use client";
import { useRouter } from "next/navigation";
import { useTransitionStore } from "@/store/transition";

interface TransitionLinkProps {
	href: string;
	children: React.ReactNode;
	className?: string;
	callback?: () => void;
	onMouseEnter?: React.MouseEventHandler<HTMLAnchorElement>;
}

export default function TransitionLink({
	href,
	children,
	className,
	callback,
	onMouseEnter,
}: TransitionLinkProps) {
	const router = useRouter();

	function handleClick(e: React.MouseEvent) {
		e.preventDefault();
		useTransitionStore.getState().triggerTransition(() => {
			router.push(href);
			if (callback) callback();
		});
	}

	return (
		<a href={href} onClick={handleClick} className={className} onMouseEnter={onMouseEnter}>
			{children}
		</a>
	);
}
