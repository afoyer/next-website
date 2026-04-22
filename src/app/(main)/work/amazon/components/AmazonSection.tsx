'use client';

import { motion } from "motion/react";
import CloudscapeContainer from "../cloudscape-container";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeInOut" as const, delay },
});

export function AmazonSection() {
  return (
    <>
      <motion.div {...fadeUp(0.1)}>
        <CloudscapeContainer header="Role">
          <p className="mb-4">
            I was a front end engineer working as part of{" "}
            <a
              href="https://aws.amazon.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#FB8C00] hover:text-amber-600"
            >
              AWS
            </a>{" "}
            on the Data Center Automation team as part of InfraMap. A
            topological view of data center monitoring at a global scale.
          </p>
        </CloudscapeContainer>
      </motion.div>

      <motion.div
        className="flex flex-wrap gap-4 items-stretch justify-center"
        {...fadeUp(0.2)}
      >
        <CloudscapeContainer header="Optimization" className="grow shrink basis-xs">
          <p className="mb-4">
            Reduced up to 80% of code used per page by creating a shared library
            of design patterns between two applications to streamline logic
            while accommodating for uniqueness between both applications.
          </p>
          <p>
            This allowed for a standardized approach to building new pages,
            while also allowing for customizations to be made for each
            application.
          </p>
        </CloudscapeContainer>

        <CloudscapeContainer header="Scale" className="grow shrink basis-xs">
          <p>
            Coordinated with sister and support teams to launch and configure
            monitoring for 50+ data centers.
          </p>
        </CloudscapeContainer>
      </motion.div>

      <CloudscapeContainer header="Work Done">
        <p>
          I helped build an entire new application run on premises to enhance
          data center monitoring, which involved creating an entire new
          front-end from scratch, incorporating Redux as well as routing.
        </p>
        <p className="mt-4">
          I also focused on front end performance, tackling querying and
          memoization of our application as well as reuse of code through more
          generic components that could be used across our applications. These
          changes and updates improved overall load times by up to a second, and
          reduced code lines by up to 80%.
        </p>
        <p className="mt-4">
          I also happened to convert our entire team to use Figma instead of
          Sketch, which helped with collaboration during COVID a lot.
        </p>
      </CloudscapeContainer>
    </>
  );
}
