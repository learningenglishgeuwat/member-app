'use client'

import Link from 'next/link'
import React from 'react'

type VocabularyGuideModalProps = {
  isOpen: boolean
  onClose: () => void
}

const VocabularyGuideModal: React.FC<VocabularyGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[90vw] sm:max-w-2xl bg-slate-950 border border-green-500/30 rounded-2xl p-4 sm:p-6 md:p-8 shadow-[0_0_30px_rgba(57,255,20,0.2)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
              Vocabulary Guide
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Panduan singkat memakai halaman Vocabulary dari hub sampai detail kata.
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
            <div className="font-semibold text-white mb-2">Yang ada di menu Vocabulary:</div>
            <div className="space-y-2 text-slate-300">
              <div>1. Search topic untuk cari topik lebih cepat</div>
              <div>2. Topic cards berisi ringkasan + jumlah kata</div>
              <div>3. Pagination topic untuk pindah halaman daftar topik</div>
              <div>4. Halaman detail topic: kata, IPA, terjemahan, dan contoh kalimat</div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-3 sm:p-4">
            <div className="font-semibold text-white mb-2">Cara belajar yang disarankan:</div>
            <div className="space-y-2 text-slate-300">
              <div>1. Pilih satu topik (contoh: Color, Family, Daily Routines)</div>
              <div>2. Dengarkan kata per kata dengan Play Word</div>
              <div>3. Latih kalimat dengan Play Example</div>
              <div>4. Gunakan toggle IPA + terjemahan untuk memperjelas makna</div>
              <div>5. Gunakan Play All untuk latihan ritme dan pengulangan</div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-3 sm:p-4">
            <div className="font-semibold text-white mb-2">Tips cepat:</div>
            <div className="space-y-2 text-slate-300">
              <div>1. Fokus 1 topik per sesi supaya retention lebih kuat</div>
              <div>2. Ulangi kata yang sulit lewat mode flashcard</div>
              <div>3. Simpan progres rutin setelah latihan selesai</div>
            </div>
          </div>
        </div>

        <div className="mt-5 sm:mt-6 flex justify-end gap-2">
          <Link
            href="/skill/vocabulary"
            className="px-3 sm:px-4 py-2 rounded-lg bg-green-500/20 border border-green-500/40 text-green-200 hover:bg-green-500/30 transition-colors text-xs sm:text-sm"
            onClick={onClose}
          >
            Go to Vocabulary Menu
          </Link>
          <button
            className="px-3 sm:px-4 py-2 rounded-lg bg-green-500/20 border border-green-500/40 text-green-200 hover:bg-green-500/30 transition-colors text-xs sm:text-sm"
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

export default VocabularyGuideModal
