'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, useMotionValue } from 'motion/react';
import Link from 'next/link';
import Logo from '@/app/logo';
import { DarkModeToggle } from './DarkModeToggle';
import { useMobileBreakpoint } from './hooks';
import styles from './navigation.module.scss';
import TransitionLink from '../transition-link';
import { ExternalLink, Home } from 'lucide-react';
import Image from 'next/image';
import { useTransitionStore } from '@/store/transition';

// ─── types ────────────────────────────────────────────────────────────────────

type Tab = 'main' | 'projects' | 'work';

type NavItem = {
    label: string;
    href: string;
    gradient: string;
    preview?: string;
    external?: boolean;
};

// ─── data ─────────────────────────────────────────────────────────────────────
// mid-tone right-side colors — screen blend over #0a0a0a stays subtle

const ITEMS: Record<Tab, NavItem[]> = {
    main: [
        { label: 'about', href: '/about', gradient: '#888', preview: '/images/gifs/about-ascii.gif' },
        { label: 'linkedin', href: 'https://www.linkedin.com/in/aymeric-foyer/', gradient: '#778', external: true, preview: '/images/gifs/linkedin-ascii.gif' },
        { label: 'photos', href: '/photos', gradient: '#4a72a0', preview: '/images/gifs/photos-ascii.gif' },
        { label: 'resume', href: '/resume', gradient: '#4a72a0', preview: '/images/gifs/resume-ascii.gif' },
    ],
    projects: [
        { label: 'pantonify', href: '/projects/pantonify', gradient: '#307050', preview: '/images/gifs/pantonify-ascii.gif' },
        { label: 'radiosity', href: '/projects/radiosity', gradient: '#904030', preview: '/images/gifs/radiosity-ascii.gif' },
        { label: 'light', href: '/projects/light', gradient: '#6050a0', preview: '/images/gifs/presence-ascii.gif' },
    ],
    work: [
        { label: 'amazon', href: '/work/amazon', gradient: '#906020', preview: '/images/gifs/aws-ascii.gif' },
    ],
};

const EASE_SPRING = [0.34, 1.56, 0.64, 1] as [number, number, number, number];

const SHIMMER_URL = `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzAwIiBoZWlnaHQ9IjQ3NSIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZyI+CiAgICAgIDxzdG9wIHN0b3AtY29sb3I9IiNlZWUiIG9mZnNldD0iMjAlIiAvPgogICAgICA8c3RvcCBzdG9wLWNvbG9yPSIjZGRkIiBvZmZzZXQ9IjUwJSIgLz4KICAgICAgPHN0b3AtY29sb3I9IiNlZWUiIG9mZnNldD0iNzAlIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjcwMCIgaGVpZ2h0PSI0NzUiIGZpbGw9IiNlZWUiIC8+CiAgPHJlY3QgaWQ9InIiIHdpZHRoPSI3MDAiIGhlaWdodD0iNDc1IiBmaWxsPSJ1cmwoI2cpIiAvPgogIDxhbmltYXRlIHhsaW5rOmhyZWY9IiNyIiBhdHRyaWJ1dGVOYW1lPSJ4IiBmcm9tPSItNzAwIiB0bz0iNzAwIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgLz4KPC9zdmc+`

// ─── main component ───────────────────────────────────────────────────────────

export default function Navigation() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<Tab>('main');
    const [previewSrc, setPreviewSrc] = useState<string | null>(null);
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const pathname = usePathname();
    const isMobile = useMobileBreakpoint();
    const containerRef = useRef<HTMLUListElement | null>(null);
    const [position, setPosition] = useState({ top: 0, height: 0, opacity: 0 });
    const phase = useTransitionStore(s => s.phase);
    const registerPreviewEl = useTransitionStore(s => s.registerPreviewEl);
    const updatePreview = useTransitionStore(s => s.updatePreview);
    // Callback ref: auto-registers the preview element with the store as it mounts/unmounts
    const previewImgContainerRef = useCallback((el: HTMLDivElement | null) => {
        registerPreviewEl(el);
    }, [registerPreviewEl]);
    const isLanding = pathname === '/';

    useEffect(() => { setIsOpen(false); }, [pathname]);
    const segment = pathname
    const currentItems = ITEMS[activeTab];

    // ── open/close helpers ────────────────────────────────────────────────────
    const scheduleClose = () => {
        closeTimer.current = setTimeout(() => setIsOpen(false), 200);
    };
    const cancelClose = () => {
        if (closeTimer.current) clearTimeout(closeTimer.current);
    };
    const openTab = (tab: Tab) => {
        cancelClose();
        setIsOpen(true);
        setActiveTab(tab);
    };
    const handleMobileTabClick = (tab: Tab) => {
        if (isOpen && activeTab === tab) {
            setIsOpen(false);
        } else {
            cancelClose();
            setIsOpen(true);
            setActiveTab(tab);
        }
    };
    const handleMouseEnter = (e: React.MouseEvent<HTMLLIElement>) => {
        const element = e.currentTarget;
        const ref = containerRef.current;
        if (ref !== null) {
            const container = ref.getBoundingClientRect();
            const target = element.getBoundingClientRect();
            console.log(target.top, container.top)
            setPosition({
                // Calculate position relative to the parent container
                top: (target.top - container.top) / 2,
                height: target.height,
                opacity: 1,
            });
        }


    };

    // AnimatePresence at the top level transitions between /landing-page and the real nav
    return (
        <motion.div animate={{ opacity: phase === 'idle' ? 1 : 0 }} transition={{ duration: 0.25 }}>
        <AnimatePresence mode="wait" initial={false}>
            {isLanding ? (
                /* // ── /landing-page label ────────────────────────────────────────── */
                <div className="flex items-center justify-between">
                <motion.div
                    key="landing"
                    className="text-black/50 dark:text-white/35 text-xs font-medium"
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -8 }}
                    transition={{ duration: 0.25, ease: EASE_SPRING }}
                >
                    /landing-page
                </motion.div>
                <DarkModeToggle className="fill-black/50 dark:fill-white/35" />
                </div>

            ) : (

                // ── main nav ─────────────────────────────────────────────────────
                <motion.div
                    key="nav"
                    className="w-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <nav className={styles.nav}>

                        {/* ── floating menu (left) ───────────────────────────────────── */}
                        <div
                            className={styles.floating_menu}
                            onMouseLeave={!isMobile ? scheduleClose : undefined}
                            onMouseEnter={!isMobile ? cancelClose : undefined}
                        >

                            {/* ─ DESKTOP header ─ */}
                            {!isMobile && (
                                <div className={styles.header}>

                                    {/* logo tile — BL radius animates to reveal pill shape when closed */}
                                    <motion.div
                                        className={styles.logo_tile}
                                        animate={{
                                            borderTopLeftRadius: 10,
                                            borderBottomLeftRadius: isOpen ? 0 : 10,
                                        }}
                                        transition={{ duration: 0.15 }}
                                        onMouseEnter={() => openTab('main')}
                                    >
                                        <Link href="/" className={styles.logo_btn} aria-label="Home">
                                            <Logo className={styles.logo_svg} />
                                        </Link>
                                    </motion.div>

                                    {/* breadcrumb ↔ tabs animated swap */}
                                    <AnimatePresence mode="wait" initial={false}>
                                        {isOpen ? (
                                            <motion.div
                                                key="tabs"
                                                className={styles.tab_bar}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.12 }}
                                            >
                                                <TabSlider activeTab={activeTab} />
                                                <button
                                                    className={`${styles.tab} ${styles.tab_projects}`}
                                                    onMouseEnter={() => openTab('projects')}
                                                >
                                                    projects
                                                </button>
                                                <button
                                                    className={`${styles.tab} ${styles.tab_work}`}
                                                    onMouseEnter={() => openTab('work')}
                                                >
                                                    work
                                                </button>
                                            </motion.div>
                                        ) : (
                                            <motion.div
                                                key="breadcrumb"
                                                className={styles.breadcrumb}
                                                initial={{ opacity: 0, x: -8 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                exit={{ opacity: 0, x: -8 }}
                                                transition={{ duration: 0.2, ease: EASE_SPRING }}
                                            >
                                                <AnimatePresence mode="wait">
                                                    <motion.span
                                                        key={segment}
                                                        initial={{ opacity: 0, x: -6 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: 6 }}
                                                        transition={{ duration: 0.18 }}
                                                    >
                                                        {segment}
                                                    </motion.span>
                                                </AnimatePresence>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}

                            {/* ─ MOBILE header ─ */}
                            {isMobile && (
                                <div className={styles.mobile_nav}>
                                    <AnimatePresence mode="wait" initial={false}>
                                        {isOpen ? (
                                            /* open: full logo tile + tabs */
                                            <motion.div
                                                key="mobile-open"
                                                className={styles.mobile_open}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.15 }}
                                            >
                                                <div
                                                    className={styles.logo_tile}
                                                    style={{ borderRadius: '10px 0 0 0' }}
                                                >
                                                    <button
                                                        className={styles.logo_btn}
                                                        onClick={() => setIsOpen(false)}
                                                        aria-label="Close menu"
                                                    >
                                                        <Logo className={styles.logo_svg} />
                                                    </button>
                                                </div>
                                                <div
                                                    className={styles.logo_tile}
                                                >
                                                    <Link href="/"
                                                        className={styles.logo_btn}
                                                        aria-label="home"
                                                    >
                                                        <Home />
                                                    </Link>
                                                </div>
                                                <div className={styles.tab_bar}>
                                                    <TabSlider activeTab={activeTab} />
                                                    <button
                                                        className={`${styles.tab} ${styles.tab_projects}`}
                                                        onClick={() => handleMobileTabClick('projects')}
                                                    >
                                                        projects
                                                    </button>
                                                    <button
                                                        className={`${styles.tab} ${styles.tab_work}`}
                                                        onClick={() => handleMobileTabClick('work')}
                                                    >
                                                        work
                                                    </button>
                                                </div>
                                            </motion.div>
                                        ) : (
                                            /* closed: small logo only */
                                            <motion.button
                                                key="mobile-closed"
                                                className={styles.logo_small}
                                                onClick={() => openTab('main')}
                                                aria-label="Open menu"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.15 }}
                                            >
                                                <Logo className={styles.logo_svg} />
                                            </motion.button>
                                        )}
                                    </AnimatePresence>

                                    {/* spacer pushes toggle to far right */}
                                    <div className={styles.mobile_spacer} />
                                    <div className={styles.mobile_toggle}>
                                        <DarkModeToggle className="fill-white w-5 h-5" />
                                    </div>
                                </div>
                            )}

                            {/* ─ dropdown (shared) ─ */}
                            <AnimatePresence mode="wait">
                                {isOpen && (
                                    <motion.ul
                                        key={activeTab}
                                        ref={containerRef}
                                        className={styles.dropdown}
                                        role="list"
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                        variants={{
                                            visible: { transition: { staggerChildren: 0.045 } },
                                            hidden: { transition: { staggerChildren: 0.025, staggerDirection: -1 } },
                                        }}
                                    >
                                        {currentItems.map(item => (
                                            <DropdownItem
                                                key={item.label}
                                                item={item}
                                                pathname={pathname}
                                                onPreview={setPreviewSrc}
                                                onStorePreview={updatePreview}
                                                onClose={scheduleClose}
                                                onMouseEnter={handleMouseEnter}
                                            />
                                        ))}
                                    </motion.ul>
                                )}
                            </AnimatePresence>

                            {/* ─ hover preview (desktop only) ─ */}
                            <AnimatePresence>
                                {isOpen && previewSrc && !isMobile && (
                                    <motion.div
                                        ref={previewImgContainerRef}
                                        key={"preview"}
                                        className={styles.preview}
                                        initial={{ opacity: 0, scale: 0.92, y: position.top + 8 }}
                                        animate={{ opacity: 1, scale: 1, y: position.top }}
                                        exit={{ opacity: 0, scale: 0.92, y: position.top + 8 }}
                                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                                    >
                                        <Image fill src={previewSrc} key={previewSrc} alt="" className={styles.preview_img} unoptimized placeholder='blur' blurDataURL={SHIMMER_URL} />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* theme toggle (desktop only — right side of full-width nav) */}
                        {!isMobile && (
                            <div className='h-full grid content-center aspect-square'>
                                <DarkModeToggle className="fill-white sm:fill-black sm:dark:fill-white" />
                            </div>
                        )}
                    </nav>
                </motion.div>
            )}
        </AnimatePresence>
        </motion.div>
    );
}

// ─── TabSlider ────────────────────────────────────────────────────────────────

function TabSlider({ activeTab }: { activeTab: Tab }) {
    return (
        <motion.div
            className={styles.tab_indicator}
            animate={{
                opacity: activeTab !== 'main' ? 1 : 0,
                x: activeTab === 'work' ? 116 : 0,
                width: activeTab === 'work' ? 115 : 116,
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 40 }}
        />
    );
}

// ─── DropdownItem ─────────────────────────────────────────────────────────────

type DropdownItemProps = {
    item: NavItem;
    pathname: string;
    onPreview: (src: string | null) => void;
    onStorePreview: (src: string) => void;
    onClose?: () => void;
    onMouseEnter: (e: React.MouseEvent<HTMLLIElement>) => void;
};

function DropdownItem({ item, pathname, onPreview, onStorePreview, onClose, onMouseEnter }: DropdownItemProps) {
    const isActive = pathname === item.href;

    return (
        <motion.li
            className={`${styles.dropdown_item} ${isActive ? styles.item_active : ''}`}
            variants={{
                visible: { opacity: 1, y: 0, transition: { duration: 0.22, ease: EASE_SPRING } },
                hidden: { opacity: 0, y: -6, transition: { duration: 0.14, ease: 'easeIn' as const } },
            }}
            whileHover={{ filter: 'brightness(1.3)' }}
            onMouseEnter={(e) => {
                if (item.preview) {
                    onPreview(item.preview)
                    onStorePreview(item.preview)
                }
                onMouseEnter(e)
            }}
            onMouseLeave={() => {
                onPreview(null)
            }}
        >
            <div className={styles.item_bg} style={{ backgroundColor: item.gradient }} />
            {item.external ? (
                <a href={item.href} target="_blank" rel="noopener noreferrer" className={styles.item_link}>
                    <span className={styles.item_label}>{item.label}</span>
                    <ExternalLink />
                </a>
            ) : (
                isActive ? (
                    <span className={`${styles.item_link} ${styles.item_active}`}>
                        <span className={styles.item_label}>{item.label}</span>
                    </span>
                ) :
                    <TransitionLink href={item.href} className={styles.item_link} callback={onClose}>
                        <span className={styles.item_label}>{item.label}</span>
                    </TransitionLink>
            )}
        </motion.li>
    );
}
