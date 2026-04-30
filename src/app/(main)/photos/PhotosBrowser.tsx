'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'motion/react';
import { Camera, AlignJustify, X } from 'lucide-react';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from 'amplify/data/resource';
import styles from './photos.module.scss';

const client = generateClient<Schema>();

type Album = NonNullable<Awaited<ReturnType<typeof client.queries.listAlbums>>['data']>[number];
type Photo = NonNullable<Awaited<ReturnType<typeof client.queries.listPhotos>>['data']>[number];

const PLACEHOLDER_RATIOS: [number, number][] = [
  [360, 418], [360, 385], [360, 233], [360, 252],
  [360, 223], [360, 207], [360, 442], [360, 455],
  [360, 267], [360, 313], [360, 316], [360, 413],
];

// Pre-compute the x/y/scale transform from a grid tile to the centered lightbox image.
// We derive the target size from the photo's aspect ratio + the viewport constraints,
// so we never need to measure the lightbox element itself.
function originTransform(rect: DOMRect, photo: Photo) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const pad = 64;
  const maxW = Math.min(vw - pad, 1200);
  const maxH = vh - pad - 40; // 40px for caption
  const ar = (photo.widthL && photo.heightL) ? photo.widthL / photo.heightL : rect.width / rect.height;
  let tw = maxW;
  let th = tw / ar;
  if (th > maxH) { th = maxH; tw = th * ar; }
  return {
    x: (rect.left + rect.width / 2) - vw / 2,
    y: (rect.top + rect.height / 2) - vh / 2,
    scale: rect.width / tw,
  };
}

export default function PhotosBrowser() {
  const [selectedId, setSelectedId] = useState<string>('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightbox, setLightbox] = useState<{ photo: Photo; rect: DOMRect } | null>(null);

  const { data: albums = [], isLoading: albumsLoading } = useQuery({
    queryKey: ['albums'],
    queryFn: () => client.queries.listAlbums().then(({ data }) => data ?? []),
  });

  useEffect(() => {
    if (selectedId || albumsLoading) return;
    const firstSet = albums.find(a => a?.type === 'set');
    if (firstSet?.id) setSelectedId(firstSet.id);
  }, [albums, albumsLoading, selectedId]);

  const { data: photos = [], isFetching: photosLoading } = useQuery({
    queryKey: ['photos', selectedId],
    queryFn: () => client.queries.listPhotos({ albumId: selectedId }).then(({ data }) => data ?? []),
    enabled: !!selectedId,
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const activeLabel = albums.find(a => a?.id === selectedId)?.title ?? '';
  const handleSelect = (id: string) => { setSelectedId(id); setMenuOpen(false); };
  const isLoading = photosLoading || photos.length === 0;

  return (
    <>
      {/* ── mobile sticky header ───────────────────────────────────────── */}
      <div className={styles.mobile_header}>
        <span className={styles.mobile_label}>{activeLabel}</span>
        <button
          className={styles.mobile_toggle}
          onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open photo menu'}
        >
          {menuOpen ? <X size={20} /> : <AlignJustify size={20} />}
        </button>
      </div>

      {/* ── mobile overlay ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className={styles.overlay}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <AlbumList albums={albums} loading={albumsLoading} selectedId={selectedId} onSelect={handleSelect} />
          </motion.div>
        )}
      </AnimatePresence>

      <div className={styles.layout}>

        {/* ── desktop sidebar ─────────────────────────────────────────── */}
        <aside className={styles.sidebar}>
          <div className={styles.icons}>
            <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4.5" />
                <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <button aria-label="Camera roll">
              <Camera size={18} strokeWidth={1.5} />
            </button>
          </div>
          <AlbumList albums={albums} loading={albumsLoading} selectedId={selectedId} onSelect={handleSelect} />
        </aside>

        {/* ── masonry grid with album exit/enter transition ────────────── */}
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              className={styles.masonry}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              {PLACEHOLDER_RATIOS.map(([w, h], i) => (
                <div
                  key={i}
                  className={styles.tile_placeholder}
                  style={{ aspectRatio: `${w} / ${h}`, animationDelay: `${(i % 6) * 0.12}s` }}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key={selectedId}
              className={styles.masonry}
              exit={{ opacity: 0, transition: { duration: 0.18 } }}
            >
              {photos.map((photo, i) => {
                if (!photo) return null;
                const src = photo.urlL
                  ?? `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`;
                return (
                  <motion.div
                    key={photo.id}
                    className={styles.tile}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: 'easeOut', delay: i * 0.04 }}
                    onClick={e => setLightbox({ photo, rect: e.currentTarget.getBoundingClientRect() })}
                  >
                    <img
                      src={src}
                      alt={photo.title ?? ''}
                      className={styles.photo}
                      loading="lazy"
                      width={photo.widthL ?? undefined}
                      height={photo.heightL ?? undefined}
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── lightbox ──────────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightbox && (() => {
          const { photo, rect } = lightbox;
          const src = photo.urlL
            ?? `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_b.jpg`;
          const origin = originTransform(rect, photo);
          return (
            <motion.div
              className={styles.lightbox_backdrop}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.22 }}
              onClick={() => setLightbox(null)}
            >
              <div className={styles.lightbox_frame} onClick={e => e.stopPropagation()}>
                <motion.img
                  src={src}
                  alt={photo.title ?? ''}
                  className={styles.lightbox_img}
                  initial={origin}
                  animate={{ x: 0, y: 0, scale: 1 }}
                  exit={origin}
                  transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                />
                {photo.title && (
                  <motion.p
                    className={styles.lightbox_caption}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                  >
                    {photo.title}
                  </motion.p>
                )}
              </div>
              <button
                className={styles.lightbox_close}
                onClick={() => setLightbox(null)}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </>
  );
}

// ─── AlbumList ────────────────────────────────────────────────────────────────

function AlbumList({
  albums, loading, selectedId, onSelect,
}: {
  albums: Album[];
  loading: boolean;
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  if (loading) {
    return (
      <div className={styles.album_list}>
        <div className={styles.album_skeleton} style={{ width: '75%' }} />
        <div className={styles.subitems}>
          <div className={styles.album_skeleton} style={{ width: '55%' }} />
          <div className={styles.album_skeleton} style={{ width: '65%' }} />
        </div>
        <div className={styles.album_skeleton} style={{ width: '60%' }} />
        <div className={styles.subitems}>
          <div className={styles.album_skeleton} style={{ width: '50%' }} />
        </div>
      </div>
    );
  }

  const topLevel = albums.filter(a => !a?.parentId);
  const byParent: Record<string, Album[]> = {};
  for (const a of albums) {
    if (!a?.parentId) continue;
    (byParent[a.parentId] ??= []).push(a);
  }

  const isEntryActive = (entry: Album) => {
    if (entry?.type === 'set') return selectedId === entry.id;
    return (byParent[entry?.id ?? ''] ?? []).some(c => selectedId === c?.id);
  };

  return (
    <div className={styles.album_list}>
      {topLevel.map(entry => {
        if (!entry) return null;
        const active = isEntryActive(entry);
        const children = byParent[entry.id ?? ''] ?? [];
        const isSet = entry.type === 'set';

        return (
          <div key={entry.id}>
            <button
              className={`${styles.album_btn} ${active ? styles.active : ''}`}
              onClick={() => isSet ? onSelect(entry.id!) : undefined}
              style={!isSet ? { cursor: 'default' } : undefined}
            >
              {active && <span className={styles.dot} />}
              {entry.title}
            </button>
            {children.length > 0 && (
              <div className={styles.subitems}>
                {children.map(child => {
                  if (!child) return null;
                  const childActive = selectedId === child.id;
                  return (
                    <button
                      key={child.id}
                      className={`${styles.subitem} ${childActive ? styles.active : ''}`}
                      onClick={() => onSelect(child.id!)}
                    >
                      {child.title}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
