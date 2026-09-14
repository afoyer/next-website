import { Container } from "./Container";

export function OverviewCard() {
	return (
		<Container header="Overview">
			<dl className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div>
					<dt className="font-bold">Role</dt>
					<dd>Front End Engineer II</dd>
				</div>
				<div>
					<dt className="font-bold">Team</dt>
					<dd>InfraMap</dd>
				</div>
			</dl>
			<p>
				As part of{" "}
				<a
					href="https://aws.amazon.com/"
					target="_blank"
					rel="noopener noreferrer"
					className="text-nav-active-amazon hover:underline"
				>
					AWS
				</a>{" "}
				as a front-end engineer, I was responsible for designing and building user interfaces for
				data center operators (DCO), improving site monitoring and reducing critical failures on
				equipment before they happen through large scale frameworks and redesigns.
			</p>
		</Container>
	);
}
