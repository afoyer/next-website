"use client";

import { motion } from "motion/react";
import { AsciiShimmer } from "@/components/ascii-shimmer";
import { EducationItem } from "./components/EducationItem";
import { fadeUp, staggerContainer } from "./components/motion";
import { PhotoCarousel } from "./components/PhotoCarousel";
import { Section } from "./components/Section";
import { Skill } from "./components/Skill";
import { ABOUT_BLURB, CAROUSEL_IMAGES, EDUCATION, SKILLS } from "./content";

export default function AboutPage() {
	return (
		<div className="relative">
			<AsciiShimmer className="z-0" />

			<div className="page relative z-10 flex min-h-screen w-full flex-col gap-16 pt-28 pb-16 lg:flex-row lg:items-center lg:gap-[100px] lg:pt-32">
				<motion.div
					variants={staggerContainer}
					initial="hidden"
					animate="show"
					className="flex min-w-0 flex-1 flex-col gap-5"
				>
					<Section id="about" title="About">
						<motion.p variants={fadeUp} className="text-xl font-medium">
							{ABOUT_BLURB}
						</motion.p>
					</Section>

					<Section id="education" title="Education">
						<ul className="flex flex-col gap-2.5 py-2.5">
							{EDUCATION.map((item) => (
								<EducationItem key={item.id} item={item} />
							))}
						</ul>
					</Section>

					<Section id="skills" title="Skills">
						<ul className="flex flex-wrap gap-x-10 gap-y-6 py-2.5">
							{SKILLS.map((skill) => (
								<Skill key={skill.id} skill={skill} />
							))}
						</ul>
					</Section>
				</motion.div>

				{/* Carousel is desktop-only: hidden and not mounted below lg. */}
				<div className="hidden w-[min(40vw,700px)] shrink-0 lg:block">
					<PhotoCarousel images={CAROUSEL_IMAGES} />
				</div>
			</div>
		</div>
	);
}
