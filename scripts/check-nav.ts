// scripts/check-nav.ts
//
// Confirms every internal nav link in src/content/nav.ts has a page.
// Run with:  bun run check:nav

import { existsSync } from "node:fs";
import { NAV_SECTIONS, type NavSection } from "@/content/nav";

export function pagePathFor(href: string): string {
	return `src/app/(main)${href}/page.tsx`;
}

export function findMissingPages(
	sections: NavSection[],
	exists: (path: string) => boolean,
): string[] {
	const missing: string[] = [];
	for (const section of sections) {
		for (const item of section.items) {
			if (item.external || !item.href.startsWith("/")) continue;
			if (!exists(pagePathFor(item.href))) missing.push(item.href);
		}
	}
	return missing;
}

if (import.meta.main) {
	const missing = findMissingPages(NAV_SECTIONS, existsSync);
	if (missing.length > 0) {
		console.error("Nav links without a page:");
		for (const href of missing) console.error(`  ${href}  →  expected ${pagePathFor(href)}`);
		process.exit(1);
	}
	console.log(`check:nav ok — ${NAV_SECTIONS.flatMap((s) => s.items).length} links checked`);
}
