"use client";

import { useEffect } from "react";
import { useRouteReady } from "@/hooks/useRouteReady";
import { useTransitionStore } from "@/store/transition";

export default function RouteReadyListener() {
	useRouteReady();
	const initMobile = useTransitionStore((s) => s.initMobile);
	useEffect(() => {
		initMobile();
		const mq = window.matchMedia("(max-width: 639px)");
		mq.addEventListener("change", initMobile);
		return () => mq.removeEventListener("change", initMobile);
	}, [initMobile]);
	return null;
}
