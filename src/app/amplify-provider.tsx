"use client";

import { Amplify } from "aws-amplify";
import outputs from "../../amplify_outputs.json";
import { ReactNode, useRef } from "react";

export default function AmplifyProvider({ children }: { children: ReactNode }) {
  const configured = useRef(false);

  if (!configured.current) {
    Amplify.configure(outputs, { ssr: true });
    configured.current = true;
  }

  return <>{children}</>;
}
