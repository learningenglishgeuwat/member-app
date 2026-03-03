'use client'

import Link from 'next/link'
import React from 'react'

type GrammarGuideModalProps = {
  isOpen: boolean
  onClose: () => void
}

const GrammarGuideModal: React.FC<GrammarGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[90vw] sm:max-w-2xl bg-slate-950 border border-teal-500/30 rounded-2xl p-4 sm:p-6 md:p-8 shadow-[0_0_30px_rgba(20,184,166,0.2)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
              Grammar Guide
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Panduan singkat memahami struktur halaman Grammar dan alur belajarnya.
            </p>
          </div>
          <button
            className="text-slate-400 hover:text-white transition-colors text-sm"
            onClick={onClose}
            type="button"
            aria-label="Close"
          >
            x
          </button>
        </div>

        <div className="space-y-3 sm:space-y-4 text-slate-200 text-xs sm:text-sm">
          <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-3 sm:p-4">
            <div className="font-semibold text-white mb-2">Isi menu Grammar:</div>
            <div className="space-y-2 text-slate-300">
              <div>1. Grammar Resource sebagai jalur utama materi</div>
              <div>2. Grammar for Speaking (status locked)</div>
              <div>3. Grammar for Writing (status locked)</div>
              <div>4. Analisis Grammar for Speaking (status locked)</div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-3 sm:p-4">
            <div className="font-semibold text-white mb-2">Cara pakai yang disarankan:</div>
            <div className="space-y-2 text-slate-300">
              <div>1. Masuk ke Grammar Resource terlebih dulu</div>
              <div>2. Pilih topik dasar sebelum ke topik lanjutan</div>
              <div>3. Baca konsep, contoh, lalu ulang dengan kalimat sendiri</div>
              <div>4. Kembali rutin ke topik yang sering salah saat speaking/writing</div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-3 sm:p-4">
            <div className="font-semibold text-white mb-2">Fokus latihan:</div>
            <div className="space-y-2 text-slate-300">
              <div>1. Foundation Grammar untuk fondasi</div>
              <div>2. Tense & Aspect untuk ketepatan waktu</div>
              <div>3. Functional Sentence Forms untuk komunikasi harian</div>
              <div>4. Expansion & Complex Structures untuk level lanjut</div>
            </div>
          </div>
        </div>

        <div className="mt-5 sm:mt-6 flex justify-end gap-2">
          <Link
            href="/skill/grammar"
            className="px-3 sm:px-4 py-2 rounded-lg bg-teal-500/20 border border-teal-500/40 text-teal-200 hover:bg-teal-500/30 transition-colors text-xs sm:text-sm"
            onClick={onClose}
          >
            Go to Grammar Menu
          </Link>
          <button
            className="px-3 sm:px-4 py-2 rounded-lg bg-teal-500/20 border border-teal-500/40 text-teal-200 hover:bg-teal-500/30 transition-colors text-xs sm:text-sm"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default GrammarGuideModal
