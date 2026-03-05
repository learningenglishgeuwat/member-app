'use client'

import Link from 'next/link'
import React from 'react'

type PronunciationGuideModalProps = {
  isOpen: boolean
  onClose: () => void
}

const PronunciationGuideModal: React.FC<PronunciationGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[90vw] sm:max-w-2xl bg-slate-950 border border-purple-500/30 rounded-2xl p-4 sm:p-6 md:p-8 shadow-[0_0_30px_rgba(168,85,247,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
              Pronunciation Guide
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Panduan singkat memahami menu dan alur latihan Pronunciation.
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
            <div className="font-semibold text-white mb-2">Isi menu Pronunciation:</div>
            <div className="space-y-2 text-slate-300">
              <div>1. Alphabet</div>
              <div>2. Phonetic Symbols</div>
              <div>3. Stressing</div>
              <div>4. Intonation</div>
              <div>5. Final Sound</div>
              <div>6. American /t/</div>
              <div>7. Text Practice</div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-3 sm:p-4">
            <div className="font-semibold text-white mb-2">Urutan belajar yang disarankan:</div>
            <div className="space-y-2 text-slate-300">
              <div>1. Mulai dari Alphabet untuk fondasi bunyi</div>
              <div>2. Lanjut ke Phonetic Symbols untuk akurasi IPA</div>
              <div>3. Latih Stressing dan Intonation untuk ritme</div>
              <div>4. Kuatkan Final Sound dan American /t/ untuk natural speech</div>
              <div>5. Tutup sesi dengan Text Practice</div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-3 sm:p-4">
            <div className="font-semibold text-white mb-2">Tips pemakaian:</div>
            <div className="space-y-2 text-slate-300">
              <div>1. Pakai Play/Stop untuk dengar model pengucapan</div>
              <div>2. Gunakan recording panel untuk latihan dan evaluasi</div>
              <div>3. Simpan progress setiap selesai latihan</div>
            </div>
          </div>
        </div>

        <div className="mt-5 sm:mt-6 flex justify-end gap-2">
          <Link
            href="/skill/pronunciation"
            className="px-3 sm:px-4 py-2 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-200 hover:bg-cyan-500/30 transition-colors text-xs sm:text-sm"
            onClick={onClose}
          >
            Go to Pronunciation Menu
          </Link>
          <button
            className="px-3 sm:px-4 py-2 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-200 hover:bg-purple-500/30 transition-colors text-xs sm:text-sm"
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

export default PronunciationGuideModal
