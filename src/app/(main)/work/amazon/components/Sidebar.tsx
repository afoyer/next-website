"use client";

import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useMobileBreakpoint } from "@/components/nav/hooks";
import { cn } from "@/lib/utils";
import type { SectionNode } from "../sections";

const OPEN_WIDTH = 280;
const RAIL_WIDTH = 44;
const EASE = [0.4, 0, 0.2, 1] as const;

// ─── Sidebar (Cloudscape AppLayout navigation) ────────────────────────────────
//
// Desktop: open panel with a close chevron; collapses to a thin rail with an
// open chevron. Mobile: off-canvas drawer over a backdrop, toggled from a
// hamburger in a slim toolbar; closes when a link is tapped.

export function Sidebar({ title, sections }: { title: string; sections: SectionNode[] }) {
	const isMobile = useMobileBreakpoint();
	const [open, setOpen] = useState(true);
	const [activeId, setActiveId] = useState<string | null>(null);

	// Desktop starts open, mobile starts closed.
	useEffect(() => {
		setOpen(!isMobile);
	}, [isMobile]);

	// Keep the active item in sync with the URL hash (back/forward, deep links).
	useEffect(() => {
		const sync = () => setActiveId(window.location.hash.slice(1) || null);
		sync();
		window.addEventListener("hashchange", sync);
		return () => window.removeEventListener("hashchange", sync);
	}, []);

	// Lock body scroll while the mobile drawer is open.
	useEffect(() => {
		if (!isMobile || !open) return;
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.body.style.overflow = prev;
		};
	}, [isMobile, open]);

	const handleSelect = (id: string) => {
		setActiveId(id);
		if (isMobile) setOpen(false);
	};

	const nav = (
		<SidebarNav
			title={title}
			sections={sections}
			activeId={activeId}
			onSelect={handleSelect}
			onClose={() => setOpen(false)}
			closeIcon={isMobile ? <X size={20} /> : <ChevronLeft size={20} />}
		/>
	);

	if (isMobile) {
		return (
			<>
				{/* Mobile toolbar */}
				<div
					data-id="sidebar-toolbar"
					className="sticky top-0 z-30 -mx-4 -mt-16 flex items-center gap-3 border-b border-foreground/15 bg-background px-4 pt-[4.5rem] pb-2"
				>
					<button
						type="button"
						aria-label="Open navigation"
						aria-expanded={open}
						onClick={() => setOpen(true)}
						className="rounded-md p-1.5 text-foreground/80 hover:bg-foreground/10 hover:text-foreground"
					>
						<Menu size={20} />
					</button>
					<span className="text-sm font-semibold">{title}</span>
				</div>

				<AnimatePresence>
					{open && (
						<>
							<motion.button
								type="button"
								aria-label="Close navigation"
								onClick={() => setOpen(false)}
								className="fixed inset-0 z-40 bg-black/50"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.2 }}
							/>
							<motion.aside
								data-id="sidebar"
								className="fixed inset-y-0 left-0 z-50 w-[min(85vw,320px)] bg-background pt-16 shadow-2xl"
								initial={{ x: "-100%" }}
								animate={{ x: 0 }}
								exit={{ x: "-100%" }}
								transition={{ duration: 0.3, ease: EASE }}
							>
								{nav}
							</motion.aside>
						</>
					)}
				</AnimatePresence>
			</>
		);
	}

	return (
		<motion.aside
			data-id="sidebar"
			className="sticky top-32 h-[calc(100vh-8rem)] shrink-0 overflow-hidden border-r border-foreground/15"
			initial={false}
			animate={{ width: open ? OPEN_WIDTH : RAIL_WIDTH }}
			transition={{ duration: 0.3, ease: EASE }}
		>
			<AnimatePresence initial={false} mode="wait">
				{open ? (
					<motion.div
						key="open"
						className="h-full"
						style={{ width: OPEN_WIDTH }}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.15 }}
					>
						{nav}
					</motion.div>
				) : (
					<motion.div
						key="rail"
						className="flex justify-center pt-4"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.15 }}
					>
						<button
							type="button"
							aria-label="Open navigation"
							aria-expanded={false}
							onClick={() => setOpen(true)}
							className="rounded-md p-1.5 text-foreground/80 hover:bg-foreground/10 hover:text-foreground"
						>
							<ChevronRight size={20} />
						</button>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.aside>
	);
}

// ─── Nav panel contents ───────────────────────────────────────────────────────

function SidebarNav({
	title,
	sections,
	activeId,
	onSelect,
	onClose,
	closeIcon,
}: {
	title: string;
	sections: SectionNode[];
	activeId: string | null;
	onSelect: (id: string) => void;
	onClose: () => void;
	closeIcon: React.ReactNode;
}) {
	return (
		<nav aria-label={`${title} sections`} className="flex h-full flex-col">
			<div className="flex items-center justify-between px-7 py-5">
				<span className="text-xl font-bold">{title}</span>
				<button
					type="button"
					aria-label="Close navigation"
					aria-expanded
					onClick={onClose}
					className="rounded-md p-1.5 text-foreground/80 hover:bg-foreground/10 hover:text-foreground"
				>
					{closeIcon}
				</button>
			</div>
			<div className="h-px bg-foreground/15" />
			<ul className="flex flex-col gap-1 px-7 py-6 text-[15px]">
				{sections.map((section) => (
					<SidebarItem key={section.id} node={section} activeId={activeId} onSelect={onSelect} />
				))}
			</ul>
		</nav>
	);
}

function SidebarItem({
	node,
	activeId,
	onSelect,
	depth = 0,
}: {
	node: SectionNode;
	activeId: string | null;
	onSelect: (id: string) => void;
	depth?: number;
}) {
	const isActive = activeId === node.id;
	return (
		<li>
			<a
				href={`#${node.id}`}
				data-id={`nav-${node.id}`}
				aria-current={isActive ? "location" : undefined}
				onClick={() => onSelect(node.id)}
				className={cn(
					"block py-1.5 transition-colors",
					isActive ? "font-bold text-nav-accent" : "text-foreground/70 hover:text-foreground",
				)}
				style={{ paddingLeft: depth * 24 }}
			>
				{node.label}
			</a>
			{node.children && (
				<ul className="flex flex-col gap-1">
					{node.children.map((child) => (
						<SidebarItem
							key={child.id}
							node={child}
							activeId={activeId}
							onSelect={onSelect}
							depth={depth + 1}
						/>
					))}
				</ul>
			)}
		</li>
	);
}
