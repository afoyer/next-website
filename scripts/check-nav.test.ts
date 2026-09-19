import { describe, expect, test } from "bun:test";
import type { NavSection } from "@/content/nav";
import { findMissingPages } from "./check-nav";

const sections: NavSection[] = [
	{
		id: "main",
		label: "me",
		items: [
			{ label: "about", href: "/about", gradient: "#888" },
			{ label: "linkedin", href: "https://example.com", gradient: "#888", external: true },
		],
	},
	{
		id: "projects",
		label: "projects",
		items: [{ label: "ghost", href: "/projects/ghost", gradient: "#888" }],
	},
];

describe("findMissingPages", () => {
	test("returns hrefs whose page file does not exist", () => {
		const exists = (path: string) => path === "src/app/(main)/about/page.tsx";
		expect(findMissingPages(sections, exists)).toEqual(["/projects/ghost"]);
	});

	test("ignores external links", () => {
		const exists = () => true;
		expect(findMissingPages(sections, exists)).toEqual([]);
	});

	test("checks the expected file path", () => {
		const seen: string[] = [];
		findMissingPages(sections, (p) => {
			seen.push(p);
			return true;
		});
		expect(seen).toEqual([
			"src/app/(main)/about/page.tsx",
			"src/app/(main)/projects/ghost/page.tsx",
		]);
	});
});
