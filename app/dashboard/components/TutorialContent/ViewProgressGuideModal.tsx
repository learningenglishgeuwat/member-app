'use client'

import React from 'react'

type ViewProgressGuideModalProps = {
  isOpen: boolean
  onClose: () => void
}

const ViewProgressGuideModal: React.FC<ViewProgressGuideModalProps> = ({ isOpen, onClose }) => {
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
              View Progress Overview
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Panduan singkat membaca halaman View Progress.
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
            <div className="font-semibold text-white mb-2">Bagian utama:</div>
            <div className="space-y-2 text-slate-300">
              <div>1. Average Score: rata-rata progress dari skill yang terbuka</div>
              <div>2. Skills Overview: daftar skill dan progress bar</div>
              <div>3. Topic Progress: detail per topik saat skill dipilih</div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-3 sm:p-4">
            <div className="font-semibold text-white mb-2">Cara pakai:</div>
            <div className="space-y-2 text-slate-300">
              <div>1. Klik skill yang tidak terkunci untuk melihat detail</div>
              <div>2. Klik topik untuk menampilkan progress bar</div>
              <div>3. Gunakan informasi ini untuk menentukan fokus belajar</div>
            </div>
          </div>

          <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-3 sm:p-4">
            <div className="font-semibold text-white mb-2">Catatan:</div>
            <div className="space-y-2 text-slate-300">
              <div>• Skill yang terkunci akan tampil tanpa persentase</div>
              <div>• Progress dihitung dari data latihan yang sudah disimpan</div>
              <div>• Data progress disimpan di LocalStorage pada perangkat ini</div>
              <div>• Risiko: data bisa hilang jika cache dibersihkan atau ganti perangkat/browser</div>
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

export default ViewProgressGuideModal
