'use client';

import { useRef, useEffect } from 'react';
import { motion, useInView } from 'motion/react';
import Image from 'next/image';
import {
  ArrowUpDown,
  Atom,
  Code,
  Database,
  FunctionSquare,
  Server,
} from 'lucide-react';
import CloudscapeContainer from '../cloudscape-container';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: 'easeInOut' as const, delay },
});



const VIEW_MARGIN = '-30% 0px -30% 0px' as const;

export function MetricOrganizerSection({
  onActive,
  hideImages = false,
}: {
  onActive?: (step: number) => void;
  hideImages?: boolean;
}) {
  const whatIsItRef = useRef<HTMLDivElement>(null);
  const extensibilityRef = useRef<HTMLDivElement>(null);
  const toolingRef = useRef<HTMLDivElement>(null);

  const whatIsItInView = useInView(whatIsItRef, { margin: VIEW_MARGIN });
  const extensibilityInView = useInView(extensibilityRef, { margin: VIEW_MARGIN });
  const toolingInView = useInView(toolingRef, { margin: VIEW_MARGIN });

  useEffect(() => {
    if (whatIsItInView) onActive?.(1);
  }, [whatIsItInView, onActive]);

  useEffect(() => {
    if (extensibilityInView) onActive?.(2);
  }, [extensibilityInView, onActive]);

  useEffect(() => {
    if (toolingInView) onActive?.(3);
  }, [toolingInView, onActive]);

  return (
    <>
      <motion.h1
        className="cloudscape-page-header py-4 text-center sm:text-left sm:pl-0"
        {...fadeUp(0)}
      >
        MetricOrganizer
      </motion.h1>

      {/* "What is it?" + inline image (image hidden on desktop) */}
      <div ref={whatIsItRef} id="step-1" className="flex flex-wrap gap-4 items-stretch justify-center sm:flex-col sm:min-h-screen sm:justify-center">
        <motion.div className="grow shrink basis-xs flex flex-col gap-4" {...fadeUp(0.1)}>
          <CloudscapeContainer header="What is it?">
            <p className="mb-4">
              MetricOrganizer (a.k.a. MO) is a framework that programmatically
              manages and lays out metrics based on a configuration, allowing
              non-technical users to generate their own pages while we handle
              the backend fetching and resolving of a defined metric on a data
              center level scale.
            </p>
            <div className="mb-4">
              This solution was built to address two main problems:
              <ul className="pt-2 pl-4 list-disc list-inside">
                <li className="underline">
                  Our database services had no relational knowledge of what
                  metric had to do with a given context
                </li>
                <li className="underline">
                  Data centers are often unique in their own way which meant
                  having to build bespoke pages for each one
                </li>
              </ul>
              <p className="mt-4">
                On top of this, this solution had to be functional across
                different applications and uses, with extensibility for future
                metrics and types of metric fetching.
              </p>
            </div>
          </CloudscapeContainer>

          <CloudscapeContainer>
            <p>
              This solution is built on top a grid layout system that extends
              further than just metrics. This allows us to place graphics as
              well as more logical layout containers and tabs to keep track of
              a data center&apos;s status.
            </p>
            <p className="mt-4">
              This layout system allows for dynamic loading through simple
              rendering techniques thanks to React and the templating
              standardization we set up for every configuration, allowing us
              to easily render many different equipments using only one
              configuration template.{' '}
              <b>
                It ultimately empowers us to render and populate{' '}
                <span className="underline font-bold">
                  hundreds of thousands of metrics
                </span>{' '}
                over 50 different pages, each having up to 30 different
                devices, in more than 50 different data centers worldwide (and
                growing!).
              </b>
            </p>
          </CloudscapeContainer>
        </motion.div>

        {/* Inline image — visible on mobile only */}
        <motion.div
          className={`grow shrink basis-xs sticky top-1 self-start ${hideImages ? 'sm:hidden' : ''}`}
          {...fadeUp(0.2)}
        >
          <CloudscapeContainer>
            <div className="relative w-full aspect-video rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
              <Image
                src="/images/amazon/mainpage.png"
                alt="MetricOrganizer UI screenshot"
                fill
                className="object-cover"
              />
            </div>
          </CloudscapeContainer>
        </motion.div>
      </div>

      {/* Extensibility */}
      <div ref={extensibilityRef} id="step-2" className="flex flex-col gap-4 sm:min-h-screen sm:justify-center">
        <CloudscapeContainer header="Extensibility">
          <p className="mb-4">
            On top of thinking about what features we wanted to support for the
            end user to have access to, I had to think about how a developer down
            the road would have to extend this framework for any unknown feature
            when this was created.
          </p>
          <p className="mb-4">
            This led to abstracting the definition of a point to how it is
            fetched, allowing us to key on what kind of fetching a point would
            need beforehand then making a large GraphQL query to fetch all the
            metrics with their specific needs.
          </p>
          {/* Inline images — visible on mobile only */}
          <div className={`flex justify-center flex-wrap items-center gap-8 ${hideImages ? 'sm:hidden' : ''}`}>
            <div className="relative grow shrink basis-50 aspect-video rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
              <Image
                src="/images/amazon/editing.jpg"
                alt="Editing interface screenshot"
                fill
                className="object-contain"
              />
            </div>
            <div className="relative grow shrink basis-50 aspect-video rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
              <Image
                src="/images/amazon/json.png"
                alt="Extensibility flow diagram"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </CloudscapeContainer>

        {/* Placeholder — replace with real content */}
        <CloudscapeContainer header="Configuration schema">
          <p className="text-gray-400 italic">
            Placeholder — describe how the configuration schema is structured and how developers define new metric types.
          </p>
        </CloudscapeContainer>

        <CloudscapeContainer header="Adding a new metric type">
          <p className="text-gray-400 italic">
            Placeholder — walk through the steps a developer follows to register a new metric, from schema definition to GraphQL resolver.
          Another section that we had to expand to enhance user experience (UX)
            was the ability to edit these configurations without the need to
            understand how the configuration files functioned. This lead to a
            large prototyping phase to understand flows and how to implement them. Another section that we had to expand to enhance user experience (UX)
            was the ability to edit these configurations without the need to
            understand how the configuration files functioned. This lead to a
            large prototyping phase to understand flows and how to implement them. Another section that we had to expand to enhance user experience (UX)
            was the ability to edit these configurations without the need to
            understand how the configuration files functioned. This lead to a
            large prototyping phase to understand flows and how to implement them.
          </p>
        </CloudscapeContainer>
      </div>

      {/* Tooling */}
      <div ref={toolingRef} id="step-3" className="flex flex-col gap-4 sm:min-h-screen sm:justify-center">
        <CloudscapeContainer header="Tooling">
          <p className="mb-4">
            Another section that we had to expand to enhance user experience (UX)
            was the ability to edit these configurations without the need to
            understand how the configuration files functioned. This lead to a
            large prototyping phase to understand flows and how to implement them.
          </p>
          {/* Inline image + caption — visible on mobile only */}
          <div className={`flex justify-center flex-wrap items-center gap-4 ${hideImages ? 'sm:hidden' : ''}`}>
            <div className="relative grow shrink basis-70 aspect-video rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
              <Image
                src="/images/amazon/editing.jpg"
                alt="MetricOrganizer configuration editor prototype"
                fill
                className="object-cover"
              />
            </div>
            <p className="text-center text-sm grow shrink basis-50 min-w-50">
              Prototype of the MetricOrganizer configuration editor. This added
              functionality to auto suggest metrics, guardrailing potential
              errors, and making the editing process smoother.
            </p>
          </div>
        </CloudscapeContainer>

        {/* Placeholder — replace with real content */}
        <CloudscapeContainer header="Auto-suggest & guardrailing">
          <p className="text-gray-400 italic">
            Placeholder — explain how the editor surfaces metric suggestions and prevents invalid configurations at authoring time.
          </p>
        </CloudscapeContainer>

        <CloudscapeContainer header="Prototyping process">
          <p className="text-gray-400 italic">
            Placeholder — describe the design and prototyping phases that informed the final editor UX, including user testing with non-technical operators.
          </p>
        </CloudscapeContainer>
      </div>
    </>
  );
}
