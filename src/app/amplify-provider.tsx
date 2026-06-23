"use client";

import { Amplify } from "aws-amplify";
import { type ReactNode, useRef } from "react";
import outputs from "../../amplify_outputs.json";

export default function AmplifyProvider({ children }: { children: ReactNode }) {
	const configured = useRef(false);

	if (!configured.current) {
		Amplify.configure(outputs, { ssr: true });
		configured.current = true;
	}

	return <>{children}</>;
}
