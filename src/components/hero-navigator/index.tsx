'use client';

import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import styles from './hero-navigator.module.scss';
import TransitionLink from '@/components/transition-link';

// ── constants ──────────────────────────────────────────────────────────────────

const PANEL_WIDTH = 148; // used in Task 5 strip animation
const ROW_HEIGHT = 48;
const NUB_HEIGHT = 20;
const SPRING = { type: 'spring' as const, stiffness: 380, damping: 36 }; // used in Task 5 and 6
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
  const [activeTab, setActiveTab] = useState<Tab>('main');
  // isExpanded drives strip translateX and shell height — wired in Task 5 and 6
  const [isExpanded, setIsExpanded] = useState(false);
  const [nubPos, setNubPos] = useState({ y: 0, opacity: 0 });

  const compactRef = useRef<HTMLDivElement>(null);
  const expandedRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<HTMLUListElement>(null);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTabClick = (tab: Tab) => {
    setActiveTab(tab);
    setIsExpanded(true);
    setNubPos(p => ({ ...p, opacity: 0 }));
  };

  const handleBack = () => {
    setIsExpanded(false);
    setNubPos(p => ({ ...p, opacity: 0 }));
    onPreview(null);
  };

  const handleRowEnter = (e: React.MouseEvent<HTMLLIElement>, item: NavItem) => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    const container = rowsRef.current;
    if (!container) return;
    const cRect = container.getBoundingClientRect();
    const rRect = e.currentTarget.getBoundingClientRect();
    setNubPos({
      y: rRect.top - cRect.top + (ROW_HEIGHT - NUB_HEIGHT) / 2,
      opacity: 1,
    });
    if (item.preview) onPreview(item.preview);
  };

  const handleRowLeave = () => {
    leaveTimer.current = setTimeout(() => {
      setNubPos(p => ({ ...p, opacity: 0 }));
      onPreview(null);
    }, 80);
  };

  const items = ITEMS[activeTab];

  return (
    <div className={styles.wrapper}>
      <motion.div className={styles.shell}>
        <motion.div
          className={styles.strip}
          animate={{ x: isExpanded ? -PANEL_WIDTH : 0 }}
          transition={SPRING}
        >

          {/* ── compact page ── */}
          <motion.div
            ref={compactRef}
            className={styles.page}
            animate={{ opacity: isExpanded ? 0.38 : 1 }}
            transition={SPRING}
          >
            {TABS.map(tab => (
              <button
                key={tab}
                className={styles.compact_row}
                onClick={() => handleTabClick(tab)}
              >
                <div className={styles.row_bg} style={{ backgroundColor: 'rgba(50,50,50,0.38)' }} />
                <span className={styles.row_label}>{TAB_LABELS[tab]}</span>
              </button>
            ))}
          </motion.div>

          {/* ── expanded page ── */}
          <div ref={expandedRef} className={styles.page}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.button
                key={`bc-${activeTab}`}
                className={styles.breadcrumb}
                onClick={handleBack}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
              >
                ← /{TAB_LABELS[activeTab]}
              </motion.button>
            </AnimatePresence>

            <ul ref={rowsRef} className={styles.rows}>
              {items.map(item => (
                <motion.li
                  key={item.label}
                  className={styles.expanded_row}
                  whileHover={{ filter: 'brightness(1.25)' }}
                  onMouseEnter={e => handleRowEnter(e, item)}
                  onMouseLeave={handleRowLeave}
                >
                  <div className={styles.row_bg} style={{ backgroundColor: item.gradient }} />
                  {item.external ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.row_link}
                    >
                      <span className={styles.row_label}>{item.label}</span>
                    </a>
                  ) : (
                    <TransitionLink href={item.href} label={item.label} className={styles.row_link}>
                      <span className={styles.row_label}>{item.label}</span>
                    </TransitionLink>
                  )}
                </motion.li>
              ))}

              {/* nub — always mounted, same key */}
              <motion.div
                key="nub"
                className={styles.nub}
                animate={{ y: nubPos.y, opacity: nubPos.opacity }}
                transition={NUB_SPRING}
              />
            </ul>
          </div>

        </motion.div>
      </motion.div>
    </div>
  );
}
