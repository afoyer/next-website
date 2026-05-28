"use client";

import { useEffect } from "react";

import { colors } from "@/lib/tokens";
import { useThemeStore } from "@/store/theme";

function toKebab(key: string): string {
	return key.replace(/([A-Z])/g, "-$1").toLowerCase();
}

export function ThemeSync() {
	const mode = useThemeStore((s) => s.mode);

	useEffect(() => {
		document.documentElement.style.colorScheme = mode;
		document.documentElement.setAttribute("data-theme", mode);

		for (const [key, mapping] of Object.entries(colors)) {
			document.documentElement.style.setProperty(`--${toKebab(key)}`, mapping[mode]);
		}
	}, [mode]);

	return null;
}
