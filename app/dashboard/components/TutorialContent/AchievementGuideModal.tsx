'use client'

import React from 'react'

type AchievementGuideModalProps = {
  isOpen: boolean
  onClose: () => void
}

const AchievementGuideModal: React.FC<AchievementGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[90vw] sm:max-w-2xl bg-black border border-purple-500/30 rounded-2xl p-4 sm:p-6 md:p-8 shadow-[0_0_30px_rgba(168,85,247,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
              Achievement Content Overview
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Panduan singkat memahami halaman Achievements.
            </p>
          </div>
          <button
            className="text-slate-400 hover:text-white transition-colors text-sm"
            onClick={onClose}
            type="button"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 sm:space-y-4 text-slate-200 text-xs sm:text-sm">
          <div className="bg-black/60 border border-slate-700/50 rounded-xl p-3 sm:p-4">
            <div className="font-semibold text-white mb-2">Apa yang akan kamu pelajari:</div>
            <div className="space-y-2 text-slate-300">
              <div>1. Memahami struktur Achievement CPU Pronunciation dan apa arti setiap kategori.</div>
              <div>2. Mengetahui area latihan mana yang perlu ditingkatkan untuk membuka setiap badge.</div>
              <div>3. Menetapkan target: setiap kategori butuh minimal 80% untuk unlock.</div>
              <div>4. Menggunakan fitur halaman untuk melacak progress dan membuat rencana belajar lebih efektif.</div>
            </div>
          </div>

          <div className="bg-black/60 border border-slate-700/50 rounded-xl p-3 sm:p-4">
            <div className="font-semibold text-white mb-2">Strategi belajar cepat:</div>
            <div className="space-y-2 text-slate-300">
              <div>1. Fokus dulu pada satu kategori yang paling rendah progresnya, lalu kembangkan secara bertahap.</div>
              <div>2. Gunakan roadmap latihan sebagai panduan harian agar tiap sesi lebih terarah.</div>
              <div>3. Evaluasi kembali progress dan sesuaikan target mingguan untuk hasil lebih stabil.</div>
            </div>
          </div>

          <div className="bg-black/60 border border-slate-700/50 rounded-xl p-3 sm:p-4">
            <div className="font-semibold text-white mb-2">Langkah praktis:</div>
            <div className="space-y-2 text-slate-300">
              <div>1. Klik CPU chip untuk langsung menuju View Progress dan lihat detail tugas.</div>
              <div>2. Jika chip belum unlock, gunakan itu sebagai sinyal untuk memperkuat topik terkait.</div>
              <div>3. Kerjakan latihan pengucapan dan roadmap secara konsisten setiap hari.</div>
              <div>4. Review kembali hasil latihan dan terus tingkatkan sampai badge terbuka.</div>
            </div>
          </div>
        </div>

        <div className="mt-5 sm:mt-6 flex justify-end">
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

export default AchievementGuideModal
