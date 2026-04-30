'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import styles from './hero-navigator.module.scss';
import TransitionLink from '@/components/transition-link';

// ── constants ──────────────────────────────────────────────────────────────────

const PANEL_WIDTH = 148;
const ROW_HEIGHT = 48;
const NUB_HEIGHT = 20;
const SPRING = { type: 'spring' as const, stiffness: 380, damping: 36 };
const NUB_SPRING = { type: 'spring' as const, stiffness: 500, damping: 40 };

// ── types ──────────────────────────────────────────────────────────────────────

type Tab = 'main' | 'projects' | 'work';

type NavItem = {
  label: string;
  href: string;
  gradient: string;
  preview?: string;
  external?: boolean;
};

// ── data ───────────────────────────────────────────────────────────────────────

const ITEMS: Record<Tab, NavItem[]> = {
  main: [
    { label: 'about',    href: '/about',                                     gradient: '#888',    preview: '/images/gifs/about-ascii.gif'    },
    { label: 'linkedin', href: 'https://www.linkedin.com/in/aymeric-foyer/', gradient: '#778',    preview: '/images/gifs/linkedin-ascii.gif', external: true },
    { label: 'photos',   href: '/photos',                                    gradient: '#4a72a0', preview: '/images/gifs/photos-ascii.gif'   },
    { label: 'resume',   href: '/resume',                                    gradient: '#4a72a0', preview: '/images/gifs/resume-ascii.gif'   },
  ],
  projects: [
    { label: 'pantonify', href: '/projects/pantonify', gradient: '#307050', preview: '/images/gifs/pantonify-ascii.gif' },
    { label: 'radiosity', href: '/projects/radiosity', gradient: '#904030', preview: '/images/gifs/radiosity-ascii.gif' },
    { label: 'light',     href: '/projects/light',     gradient: '#6050a0', preview: '/images/gifs/presence-ascii.gif' },
  ],
  work: [
    { label: 'amazon', href: '/work/amazon', gradient: '#906020', preview: '/images/gifs/aws-ascii.gif' },
  ],
};

const TAB_LABELS: Record<Tab, string> = { main: 'me', projects: 'projects', work: 'work' };
const TABS: Tab[] = ['main', 'projects', 'work'];

// ── component ─────────────────────────────────────────────────────────────────

type Props = { onPreview: (src: string | null) => void };

export default function HeroNavigator({ onPreview }: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.shell}>
        <div className={styles.strip}>
          <div className={styles.page}>
            {/* compact page — Task 3 */}
          </div>
          <div className={styles.page}>
            {/* expanded page — Task 4 */}
          </div>
        </div>
      </div>
    </div>
  );
}
