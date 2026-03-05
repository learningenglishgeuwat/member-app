'use client'

import Link from 'next/link'
import React from 'react'

type SpeakingGuideModalProps = {
  isOpen: boolean
  onClose: () => void
}

const SpeakingGuideModal: React.FC<SpeakingGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[90vw] sm:max-w-2xl bg-slate-950 border border-pink-500/30 rounded-2xl p-4 sm:p-6 md:p-8 shadow-[0_0_30px_rgba(255,0,255,0.2)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
              Speaking Guide
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Panduan singkat memakai roadmap Speaking dari phase sampai detail goal.
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
            <div className="font-semibold text-white mb-2">Yang ada di menu Speaking:</div>
            <div className="space-y-2 text-slate-300">
              <div>1. Learning Phases (A1.1, A1.2, A1.3, dst)</div>
              <div>2. Domain filter (daily, work, public, emergency, legal, finance)</div>
              <div>3. Goal cards berisi situasi + key sentences</div>
              <div>4. Toggle terjemahan Indonesia</div>
              <div>5. Search goal di phase aktif</div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-3 sm:p-4">
            <div className="font-semibold text-white mb-2">Alur belajar yang disarankan:</div>
            <div className="space-y-2 text-slate-300">
              <div>1. Mulai dari phase paling dasar yang aktif</div>
              <div>2. Pilih goal sesuai domain yang kamu butuhkan</div>
              <div>3. Hafalkan key sentences dulu, lalu praktekkan respons cepat</div>
              <div>4. Buka detail goal untuk latihan dialog, IPA, dan TTS</div>
              <div>5. Tandai completed kalau goal sudah konsisten dipakai</div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-3 sm:p-4">
            <div className="font-semibold text-white mb-2">Tips latihan cepat:</div>
            <div className="space-y-2 text-slate-300">
              <div>1. Fokus 1 goal per sesi agar hasil lebih terasa</div>
              <div>2. Gunakan terjemahan hanya sebagai bantuan awal</div>
              <div>3. Ulang kalimat target pakai suara keras + recording</div>
            </div>
          </div>
        </div>

        <div className="mt-5 sm:mt-6 flex justify-end gap-2">
          <Link
            href="/skill/speaking"
            className="px-3 sm:px-4 py-2 rounded-lg bg-pink-500/20 border border-pink-500/40 text-pink-200 hover:bg-pink-500/30 transition-colors text-xs sm:text-sm"
            onClick={onClose}
          >
            Go to Speaking Menu
          </Link>
          <button
            className="px-3 sm:px-4 py-2 rounded-lg bg-pink-500/20 border border-pink-500/40 text-pink-200 hover:bg-pink-500/30 transition-colors text-xs sm:text-sm"
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

export default SpeakingGuideModal
