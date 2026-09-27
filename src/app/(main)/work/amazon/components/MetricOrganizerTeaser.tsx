import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { amazon, METRIC_ORGANIZER_HREF } from "../content";
import { Container } from "./Container";

export function MetricOrganizerTeaser() {
	const copy = amazon.metricOrganizer;
	return (
		<Container
			header="Overview"
			media={
				<Image
					src={copy.image}
					alt={copy.imageAlt}
					fill
					sizes="(min-width: 1024px) 75vw, 100vw"
					className="object-cover object-top"
				/>
			}
		>
			<p className="mb-5">{copy.summary}</p>
			<Link
				href={METRIC_ORGANIZER_HREF}
				data-id="mo-teaser-link"
				className="inline-flex items-center gap-2 rounded-full border-2 border-nav-accent px-4 py-1.5 text-sm font-bold text-nav-accent hover:bg-nav-accent/10"
			>
				{copy.cta}
				<ArrowRight size={16} />
			</Link>
		</Container>
	);
}
