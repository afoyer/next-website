"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { type TransitionStore, useTransitionStore } from "@/store/transition";

// Minimum time to hold at full-screen before the ripple fires (ms)
const MIN_HOLD_MS = 150;

export function useRouteReady() {
	const pathname = usePathname();
	const phase = useTransitionStore((s: TransitionStore) => s.phase);
	const onRouteReady = useTransitionStore((s: TransitionStore) => s.onRouteReady);

	const holdStartRef = useRef<number | null>(null);
	const transitionPathnameRef = useRef<string>(pathname);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const scheduleRouteReady = () => {
		if (timerRef.current) clearTimeout(timerRef.current);
		const holdStart = holdStartRef.current ?? Date.now();
		const delay = Math.max(0, MIN_HOLD_MS - (Date.now() - holdStart));
		timerRef.current = setTimeout(onRouteReady, delay);
	};

	useEffect(() => {
		if (phase === "expanding") {
			transitionPathnameRef.current = pathname;
		}
		if (phase === "holding") {
			holdStartRef.current = Date.now();
			// Fast navigation: route already changed while we were expanding
			if (pathname !== transitionPathnameRef.current) {
				scheduleRouteReady();
			}
		}
		if (phase === "idle") {
			if (timerRef.current) clearTimeout(timerRef.current);
			holdStartRef.current = null;
		}
	}, [phase]);

	// Route completed after expand: pathname changes while holding
	useEffect(() => {
		if (phase !== "holding") return;
		if (pathname === transitionPathnameRef.current) return;
		scheduleRouteReady();
	}, [pathname]);
}
