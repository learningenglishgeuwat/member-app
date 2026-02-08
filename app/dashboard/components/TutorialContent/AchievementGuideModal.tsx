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
        className="w-full max-w-[90vw] sm:max-w-2xl bg-slate-950 border border-purple-500/30 rounded-2xl p-4 sm:p-6 md:p-8 shadow-[0_0_30px_rgba(168,85,247,0.25)]"
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
          <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-3 sm:p-4">
            <div className="font-semibold text-white mb-2">Yang bisa kamu lihat:</div>
            <div className="space-y-2 text-slate-300">
              <div>1. Tier kamu saat ini (Rookie/Pro/Legend)</div>
              <div>2. Syarat upgrade tier dan jumlah referral</div>
              <div>3. Bonus referral dan cashback per tier</div>
              <div>4. Saldo referral dan akses penarikan</div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-3 sm:p-4">
            <div className="font-semibold text-white mb-2">Tips cepat:</div>
            <div className="space-y-2 text-slate-300">
              <div>1. Pastikan status akun aktif untuk mendapatkan benefit</div>
              <div>2. Cek progress referral secara berkala</div>
              <div>3. Gunakan referral code agar progres tercatat</div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-3 sm:p-4">
            <div className="font-semibold text-white mb-2">Tutorial withdrawal:</div>
            <div className="space-y-2 text-slate-300">
              <div>1. Klik kartu “Current Balance” (ikon petir)</div>
              <div>2. Isi amount minimal Rp 50.000 (kelipatan 50.000)</div>
              <div>3. Pilih Wallet Type (GoPay/Dana)</div>
              <div>4. Klik tombol “Withdraw”</div>
              <div>5. Status akan menjadi Pending sampai disetujui admin</div>
              <div>Catatan: Ada biaya admin Rp 5.000 per penarikan</div>
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
