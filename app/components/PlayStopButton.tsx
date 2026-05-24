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

export function PlayStopButton({
  isActive,
  label,
  onClick,
  disabled = false,
  size = 'md',
  className = '',
}: PlayStopButtonProps) {
  const iconSize = size === 'sm'
    ? 'w-3 h-3 sm:w-4 sm:h-4'
    : 'w-4 h-4 sm:w-5 sm:h-5';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        'w-full border px-2 py-1.5 sm:px-4 sm:py-3',
        'font-mono text-[8px] sm:text-xs uppercase',
        'rounded-lg sm:rounded-xl',
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
