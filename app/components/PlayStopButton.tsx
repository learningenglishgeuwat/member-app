'use client';

/**
 * PlayStopButton — Komponen terpusat untuk semua button Play/Stop di ControlCenter.
 *
 * ✅ CARA MENGUBAH UI SEMUA HALAMAN:
 *    Cukup edit file ini. Semua halaman yang menggunakan komponen ini akan otomatis berubah.
 *
 * Props:
 *  - isActive   : boolean  — true = sedang playing (tampilkan Stop), false = idle (tampilkan Play)
 *  - label      : string   — label teks button, contoh: 'ALPHABET', 'TEXT', 'PRACTICE'
 *  - onClick    : function — handler klik button
 *  - disabled   : boolean  — optional, disable button
 *  - size       : 'sm' | 'md' — ukuran icon (default: 'md')
 *  - className  : string   — optional extra class untuk wrapper button
 */

import React from 'react';
import { Play, Square } from 'lucide-react';

// ─────────────────────────────────────────────
// 🎨 KONFIGURASI TEMA — Edit bagian ini untuk mengubah tampilan semua halaman
// ─────────────────────────────────────────────

const THEME = {
  // Warna icon saat STOP aktif (hanya icon, bukan card)
  stopIconColor: '#E53935',

  // Style button — SAMA untuk idle maupun aktif (card tidak berubah warna)
  cardClass: 'bg-[#1a1f24] border-white/10 text-white/80 hover:bg-cyan-900/20 hover:border-cyan-500/30',

  // Icon hover saat idle
  iconIdleClass: 'fill-transparent stroke-current group-hover:fill-cyan-400 group-hover:stroke-cyan-400 group-hover:text-cyan-400',

  // Label prefix saat aktif (STOP) vs idle (PLAY)
  stopPrefix: 'STOP',
  playPrefix: 'PLAY',
} as const;

// ─────────────────────────────────────────────

interface PlayStopButtonProps {
  isActive: boolean;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

// Optional integration with ControlCenter navigator: when `sectionId` is provided,
// the button will request the ControlCenter to open that section (and optionally
// navigate to a different path) before triggering the provided onClick.
interface PlayStopButtonPropsExtended extends PlayStopButtonProps {
  sectionId?: string;
  targetPath?: string;
  scrollItemKey?: string;
  'data-tour'?: string;
}

import { useSectionNavigator } from './ControlCenter/ControlCenter'

export function PlayStopButton({
  isActive,
  label,
  onClick,
  disabled = false,
  size = 'md',
  className = '',
  sectionId,
  targetPath,
  scrollItemKey,
  'data-tour': dataTour,
}: PlayStopButtonPropsExtended) {
  const iconSize = size === 'sm'
    ? 'w-2 h-2 sm:w-2.5 sm:h-2.5'
    : 'w-2.5 h-2.5 sm:w-3 sm:h-3';
  const navigator = useSectionNavigator()

  const handleClick = () => {
    if (disabled) return

    const resolvedSectionId = sectionId ?? label.toLowerCase().replace(/[^a-z0-9-_]/gi, '')

    if (resolvedSectionId && navigator?.openSection) {
      try {
        navigator.openSection(resolvedSectionId, targetPath)
      } catch {
        // ignore
      }
      // delay calling onClick slightly to allow scroll/open to happen
      if (!isActive) {
        setTimeout(() => onClick(), 80)
        return
      }
    }

    // If a specific item key was provided, dispatch a global scroll event
    if (scrollItemKey && typeof window !== 'undefined') {
      try {
        window.dispatchEvent(new CustomEvent('geuwat:scroll-to', { detail: { key: scrollItemKey } }))
      } catch {}
      // small delay so scroll can start before playing
      setTimeout(() => onClick(), 80)
      return
    }

    onClick()
  }

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      data-tour={dataTour}
      className={[
        'w-full border px-1 py-0.5 sm:px-2 sm:py-1',
        'font-mono text-[7px] sm:text-[8.5px] uppercase',
        'rounded-sm sm:rounded-md',
        'flex items-center justify-between',
        'transition-all group',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        THEME.cardClass,
        className,
      ].join(' ')}
    >
      <span className="tracking-widest font-bold">
        {isActive ? `${THEME.stopPrefix} ${label}` : `${THEME.playPrefix} ${label}`}
      </span>

      {isActive ? (
        <Square
          className={`${iconSize} transition-colors`}
          style={{ fill: THEME.stopIconColor, stroke: THEME.stopIconColor, color: THEME.stopIconColor }}
        />
      ) : (
        <Play
          className={`${iconSize} transition-colors ${THEME.iconIdleClass}`}
        />
      )}
    </button>
  );
}

export default PlayStopButton;
