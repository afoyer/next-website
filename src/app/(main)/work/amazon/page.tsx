'use client';

import { useState, useRef, useEffect } from 'react';
import { useScroll, AnimatePresence, motion } from 'motion/react';
import "./index.css";
import { AwsLogoHeader } from "./components/AwsLogoHeader";
import { AmazonSection } from "./components/AmazonSection";
import { MetricOrganizerSection } from "./components/MetricOrganizerSection";
import { StickyImagePanel } from "./components/StickyImagePanel";
import CloudscapeContainer from './cloudscape-container';
import { Atom, ArrowUpDown, Code, FunctionSquare, Database, Server } from 'lucide-react';

// ─── Constants ───────────────────────────────────────────────────────────────

const TECHNOLOGIES = [
  { label: 'React', icon: <Atom className="inline-block align-middle" /> },
  { label: 'GraphQL', icon: <ArrowUpDown className="inline-block align-middle" /> },
  { label: 'TypeScript', icon: <Code className="inline-block align-middle" /> },
  { label: 'Lambda', icon: <FunctionSquare className="inline-block align-middle" /> },
  { label: 'S3', icon: <Database className="inline-block align-middle" /> },
  { label: 'Redis', icon: <Server className="inline-block align-middle" /> },
];

const STEPS = [
  { label: 'Overview',      image: '/images/amazon/mainpage.png' },
  { label: 'What is it?',   image: '/images/amazon/mainpage.png' },
  { label: 'Extensibility', image: '/images/amazon/json.png'     },
  { label: 'Tooling',       image: '/images/amazon/editing.jpg'  },
];

// ─── Step content ─────────────────────────────────────────────────────────────

function WhatIsItStep() {
  return (
    <div className="space-y-4">
      <h1 className="cloudscape-page-header pb-2">MetricOrganizer</h1>
      <CloudscapeContainer header="What is it?">
        <p className="mb-4">
          MetricOrganizer (a.k.a. MO) is a framework that programmatically manages and
          lays out metrics based on a configuration, allowing non-technical users to
          generate their own pages while we handle the backend fetching and resolving of
          a defined metric on a data center level scale.
        </p>
        <div className="mb-4">
          This solution was built to address two main problems:
          <ul className="pt-2 pl-4 list-disc list-inside">
            <li className="underline">
              Our database services had no relational knowledge of what metric had to do
              with a given context
            </li>
            <li className="underline">
              Data centers are often unique in their own way which meant having to build
              bespoke pages for each one
            </li>
          </ul>
          <p className="mt-4">
            On top of this, this solution had to be functional across different
            applications and uses, with extensibility for future metrics and types of
            metric fetching.
          </p>
        </div>
      </CloudscapeContainer>
      <CloudscapeContainer>
        <p>
          This solution is built on top a grid layout system that extends further than
          just metrics. This allows us to place graphics as well as more logical layout
          containers and tabs to keep track of a data center&apos;s status.
        </p>
        <p className="mt-4">
          This layout system allows for dynamic loading through simple rendering
          techniques thanks to React and the templating standardization we set up for
          every configuration, allowing us to easily render many different equipments
          using only one configuration template.{' '}
          <b>
            It ultimately empowers us to render and populate{' '}
            <span className="underline font-bold">hundreds of thousands of metrics</span>{' '}
            over 50 different pages, each having up to 30 different devices, in more than
            50 different data centers worldwide (and growing!).
          </b>
        </p>
      </CloudscapeContainer>
    </div>
  );
}

function ExtensibilityStep() {
  return (
    <div className="space-y-4">
      <CloudscapeContainer header="Extensibility">
        <p className="mb-4">
          On top of thinking about what features we wanted to support for the end user
          to have access to, I had to think about how a developer down the road would
          have to extend this framework for any unknown feature when this was created.
        </p>
        <p>
          This led to abstracting the definition of a point to how it is fetched,
          allowing us to key on what kind of fetching a point would need beforehand then
          making a large GraphQL query to fetch all the metrics with their specific
          needs.
        </p>
      </CloudscapeContainer>
      <CloudscapeContainer header="Configuration schema">
        <p className="text-gray-400 italic">
          Placeholder — describe how the configuration schema is structured and how
          developers define new metric types.
        </p>
      </CloudscapeContainer>
      <CloudscapeContainer header="Adding a new metric type">
        <p className="text-gray-400 italic">
          Placeholder — walk through the steps a developer follows to register a new
          metric, from schema definition to GraphQL resolver.
        </p>
      </CloudscapeContainer>
    </div>
  );
}

function ToolingStep() {
  return (
    <div className="space-y-4">
      <CloudscapeContainer header="Tooling">
        <p>
          Another section that we had to expand to enhance user experience (UX) was the
          ability to edit these configurations without the need to understand how the
          configuration files functioned. This lead to a large prototyping phase to
          understand flows and how to implement them.
        </p>
      </CloudscapeContainer>
      <CloudscapeContainer header="Auto-suggest & guardrailing">
        <p className="text-gray-400 italic">
          Placeholder — explain how the editor surfaces metric suggestions and prevents
          invalid configurations at authoring time.
        </p>
      </CloudscapeContainer>
      <CloudscapeContainer header="Prototyping process">
        <p className="text-gray-400 italic">
          Placeholder — describe the design and prototyping phases that informed the
          final editor UX, including user testing with non-technical operators.
        </p>
      </CloudscapeContainer>
    </div>
  );
}

const STEP_COMPONENTS = [AmazonSection, WhatIsItStep, ExtensibilityStep, ToolingStep];

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({
  activeStep,
  onStepClick,
}: {
  activeStep: number;
  onStepClick: (step: number) => void;
}) {
  return (
    <div className="flex items-center gap-6 px-8 py-4 bg-white dark:bg-[#161d26] border-b border-gray-100 dark:border-gray-800">
      {STEPS.map((s, i) => (
        <button
          key={i}
          onClick={() => onStepClick(i)}
          className={`text-sm font-medium pb-1 border-b-2 transition-all duration-200 ${
            i === activeStep
              ? 'text-[#FB8C00] border-[#FB8C00]'
              : 'text-gray-400 dark:text-gray-500 border-transparent hover:text-gray-600 dark:hover:text-gray-300'
          }`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AmazonWindowContent() {
  const [activeStep, setActiveStep] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ['start start', 'end end'],
  });

  useEffect(() => {
    return scrollYProgress.on('change', (progress) => {
      setActiveStep(Math.min(Math.floor(progress * STEPS.length), STEPS.length - 1));
    });
  }, [scrollYProgress]);

  const scrollToStep = (step: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollable = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: el.offsetTop + (step / STEPS.length) * scrollable, behavior: 'smooth' });
  };

  const StepComponent = STEP_COMPONENTS[activeStep];
  const activeImage = STEPS[activeStep].image;

  return (
    <div className="amazon-page bg-white dark:bg-[#161d26] px-2 sm:px-24">
      <AwsLogoHeader />

      {/* ── Desktop: scroll-driven pinned layout ────────────────────────────── */}
      <div className="hidden sm:block">
        {/* Tall container — 1 step = 100vh of scroll distance */}
        <div ref={scrollRef} style={{ height: `${STEPS.length * 100}vh` }}>
          <div className="sticky top-10 h-screen py-20 grid grid-cols-[1fr_2fr] overflow-hidden">

            {/* Left: step nav at top + crossfading content below */}
            <div className="flex flex-col overflow-hidden min-h-0">
              <StepIndicator activeStep={activeStep} onStepClick={scrollToStep} />
              <div className="flex-1 flex flex-col justify-center px-8 py-6 overflow-y-auto min-h-0">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <StepComponent />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Right: image panel */}
            <div className="p-4 overflow-hidden min-h-0">
              <StickyImagePanel src={activeImage} />
            </div>

          </div>
        </div>
      </div>

      {/* ── Mobile: stacked layout (unchanged) ──────────────────────────────── */}
      <div className="sm:hidden px-6 pb-20 space-y-4">
        <AmazonSection />
        <MetricOrganizerSection />
      </div>

      {/* ── Technologies — always visible ───────────────────────────────────── */}
      <div className="px-6 sm:px-8 pb-12">
        <CloudscapeContainer header="Technologies">
          <p className="mb-4">This solution was built using the following tools:</p>
          <ul className="pt-2 pl-4 list-disc list-inside space-y-1">
            {TECHNOLOGIES.map(({ label, icon }) => (
              <li key={label}>{label} {icon}</li>
            ))}
          </ul>
        </CloudscapeContainer>
      </div>
    </div>
  );
}
