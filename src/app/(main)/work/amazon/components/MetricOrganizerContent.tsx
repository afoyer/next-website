import Image from "next/image";
import { Container } from "./Container";

export function MetricOrganizerContent() {
	return (
		<>
			<Container header="What is it?">
				<p className="mb-4">
					MetricOrganizer (a.k.a. MO) is a framework that programmatically manages and lays out
					metrics based on a configuration, allowing non-technical users to generate their own pages
					while we handle the backend fetching and resolving of a defined metric on a data center
					level scale.
				</p>
				<div className="mb-4">
					This solution was built to address two main problems:
					<ul className="list-inside list-disc pt-2 pl-4">
						<li className="underline">
							Our database services had no relational knowledge of what metric had to do with a
							given context
						</li>
						<li className="underline">
							Data centers are often unique in their own way which meant having to build bespoke
							pages for each one
						</li>
					</ul>
					<p className="mt-4">
						On top of this, this solution had to be functional across different applications and
						uses, with extensibility for future metrics and types of metric fetching.
					</p>
				</div>
				<div className="relative aspect-video w-full overflow-hidden rounded-lg bg-foreground/5">
					<Image
						src="/images/amazon/mainpage.png"
						alt="MetricOrganizer UI screenshot"
						fill
						className="object-cover"
					/>
				</div>
			</Container>

			<Container>
				<p>
					This solution is built on top a grid layout system that extends further than just metrics.
					This allows us to place graphics as well as more logical layout containers and tabs to
					keep track of a data center&apos;s status.
				</p>
				<p className="mt-4">
					This layout system allows for dynamic loading through simple rendering techniques thanks
					to React and the templating standardization we set up for every configuration, allowing us
					to easily render many different equipments using only one configuration template.{" "}
					<b>
						It ultimately empowers us to render and populate{" "}
						<span className="font-bold underline">hundreds of thousands of metrics</span> over 50
						different pages, each having up to 30 different devices, in more than 50 different data
						centers worldwide (and growing!).
					</b>
				</p>
			</Container>

			<Container header="Extensibility">
				<p className="mb-4">
					On top of thinking about what features we wanted to support for the end user to have
					access to, I had to think about how a developer down the road would have to extend this
					framework for any unknown feature when this was created.
				</p>
				<p className="mb-4">
					This led to abstracting the definition of a point to how it is fetched, allowing us to key
					on what kind of fetching a point would need beforehand then making a large GraphQL query
					to fetch all the metrics with their specific needs.
				</p>
				<div className="flex flex-wrap items-center justify-center gap-4">
					<div className="relative aspect-video grow shrink basis-60 overflow-hidden rounded-lg bg-foreground/5">
						<Image
							src="/images/amazon/editing.jpg"
							alt="Editing interface screenshot"
							fill
							className="object-contain"
						/>
					</div>
					<div className="relative aspect-video grow shrink basis-60 overflow-hidden rounded-lg bg-foreground/5">
						<Image
							src="/images/amazon/json.png"
							alt="Extensibility flow diagram"
							fill
							className="object-contain"
						/>
					</div>
				</div>
			</Container>

			<Container header="Tooling">
				<p className="mb-4">
					Another section that we had to expand to enhance user experience (UX) was the ability to
					edit these configurations without the need to understand how the configuration files
					functioned. This lead to a large prototyping phase to understand flows and how to
					implement them.
				</p>
				<p className="text-sm text-foreground/60">
					Prototype of the MetricOrganizer configuration editor. This added functionality to auto
					suggest metrics, guardrailing potential errors, and making the editing process smoother.
				</p>
			</Container>
		</>
	);
}
