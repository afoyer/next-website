"use client";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
// gsap ships Flip.js (runtime) but flip.d.ts (types); suppressing the program-level
// TS1149 casing collision needs ts-ignore — the expect-error variant is reported unused.
// biome-ignore lint/suspicious/noTsIgnore: see above
// @ts-ignore
import { Flip } from "gsap/Flip";

gsap.registerPlugin(Flip);

export default function Logo({ className }: { className?: string }) {
	useGSAP(() => {
		const state = Flip.getState(".af-logo", ".af-nav-logo");
		Flip.from(state, { duration: 1, ease: "power2.inOut" });
	});
	return (
		<svg
			width="267"
			height="157"
			viewBox="0 0 267 157"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			className={`h-full w-full af-logo ${className || ""}`}
			aria-label="AF Logo"
		>
			<path
				d="M0.340022 153.889C-0.547286 155.218 0.405368 157 2.00337 157H24.2634C24.6826 157 25.0911 156.868 25.4314 156.624L58.9079 132.54C59.1043 132.399 59.3247 132.295 59.5584 132.232L100.565 121.248C101.836 120.908 103.083 121.865 103.083 123.18V155C103.083 156.105 103.978 157 105.083 157H116.173V2C116.173 0.895431 115.277 0 114.173 0H103.083L0.340022 153.889ZM103.083 83.0228C103.083 83.9008 102.51 84.6762 101.671 84.9344L64.0917 96.4965C62.3518 97.0318 60.8596 95.1535 61.7744 93.5798L99.3538 28.933C100.381 27.1667 103.083 27.8951 103.083 29.9381V83.0228Z"
				fill="currentColor"
			/>
			<path
				d="M116.173 2C116.173 0.895431 115.277 0 114.173 0H103.083H264.046C265.701 0 266.639 1.89529 265.637 3.21184L247.357 27.2118C246.979 27.7085 246.39 28 245.766 28H150.503C149.398 28 148.503 28.8954 148.503 30V48V67.5644C148.503 68.6751 149.408 69.573 150.518 69.5643L211.338 69.0853C213.013 69.0721 213.961 71.001 212.927 72.3193L204.489 83.0817L195.511 95.2551C195.134 95.7663 194.537 96.0681 193.902 96.0681H150.503C149.398 96.0681 148.503 96.9635 148.503 98.0681V155C148.503 156.105 147.607 157 146.503 157H116.173"
				fill="currentColor"
			/>
		</svg>
	);
}
