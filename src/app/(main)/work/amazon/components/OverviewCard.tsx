import { amazon } from "../content";
import { Container } from "./Container";

export function OverviewCard() {
	return (
		<Container header="Overview">
			<dl className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
				<div>
					<dt className="font-bold">Role</dt>
					<dd>{amazon.role}</dd>
				</div>
				<div>
					<dt className="font-bold">Team</dt>
					<dd>{amazon.team}</dd>
				</div>
			</dl>
			<p>
				As part of{" "}
				<a
					href={amazon.companyUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="text-nav-active-amazon hover:underline"
				>
					AWS
				</a>{" "}
				{amazon.overview}
			</p>
		</Container>
	);
}
