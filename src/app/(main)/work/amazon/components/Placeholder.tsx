import { Container } from "./Container";

export function Placeholder({ children }: { children: string }) {
	return (
		<Container>
			<p className="italic text-foreground/50">{children}</p>
		</Container>
	);
}
