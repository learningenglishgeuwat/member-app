'use client'

import Link from 'next/link'
import React, { useMemo } from 'react'

type SpeakingRoadmapModalProps = {
  isOpen: boolean
  onClose: () => void
}

type SpeakingRoadmapItem = {
  id: string
  title: string
  href: string
  focus: string
  goalCount: number
  estimatedDays: number
}

const SPEAKING_ROADMAP_ITEMS: SpeakingRoadmapItem[] = [
  {
    id: 'cefr-a1-1',
    title: 'Survival Response',
    href: '/skill/speaking?phase=cefr-a1-1',
    focus: 'Respons cepat, minta repeat, dan konfirmasi instruksi dasar.',
    goalCount: 12,
    estimatedDays: 18,
  },
  {
    id: 'cefr-a1-2',
    title: 'Identity and Daily Needs',
    href: '/skill/speaking?phase=cefr-a1-2',
    focus: 'Perkenalan diri, kebutuhan harian, izin, dan janji sederhana.',
    goalCount: 12,
    estimatedDays: 18,
  },
  {
    id: 'cefr-a1-3',
    title: 'Simple Transaction and Direction',
    href: '/skill/speaking?phase=cefr-a1-3',
    focus: 'Transaksi dasar, arah, klarifikasi langkah, dan penutupan interaksi.',
    goalCount: 12,
    estimatedDays: 24,
  },
]

const SpeakingRoadmapModal: React.FC<SpeakingRoadmapModalProps> = ({ isOpen, onClose }) => {
  const totalDays = useMemo(
    () => SPEAKING_ROADMAP_ITEMS.reduce((sum, item) => sum + item.estimatedDays, 0),
    []
  )

  const totalGoals = useMemo(
    () => SPEAKING_ROADMAP_ITEMS.reduce((sum, item) => sum + item.goalCount, 0),
    []
  )

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[96vw] sm:max-w-5xl bg-slate-950 border border-pink-500/30 rounded-2xl p-4 sm:p-6 md:p-8 shadow-[0_0_30px_rgba(236,72,153,0.2)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
              Speaking Roadmap
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Estimasi dibuat untuk belajar 30 menit per hari.
            </p>
            <p className="text-slate-300 text-xs sm:text-sm mt-2">
              <span className="text-slate-500">Total goals: {totalGoals}</span>
              <span className="text-slate-500"> | Total estimasi: {totalDays} hari</span>
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

        <div className="overflow-x-auto geuwat-table-scroll border border-slate-700/60 rounded-xl">
          <table className="min-w-full geuwat-table-responsive text-xs sm:text-sm">
            <thead className="bg-slate-900/70 text-slate-200">
              <tr>
                <th className="px-3 sm:px-4 py-3 text-left font-semibold">No</th>
                <th className="px-3 sm:px-4 py-3 text-left font-semibold">Phase</th>
                <th className="px-3 sm:px-4 py-3 text-left font-semibold">Fokus</th>
                <th className="px-3 sm:px-4 py-3 text-left font-semibold">Goal</th>
                <th className="px-3 sm:px-4 py-3 text-left font-semibold">Estimasi (30 menit/hari)</th>
              </tr>
            </thead>
            <tbody>
              {SPEAKING_ROADMAP_ITEMS.map((item, index) => (
                <tr key={item.id} className="border-t border-slate-800/70 text-slate-200">
                  <td className="px-3 sm:px-4 py-3">{index + 1}</td>
                  <td className="px-3 sm:px-4 py-3">
                    <Link
                      href={item.href}
                      className="text-pink-300 hover:text-pink-200 underline underline-offset-2"
                      onClick={onClose}
                    >
                      {item.title}
                    </Link>
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-slate-300">{item.focus}</td>
                  <td className="px-3 sm:px-4 py-3 text-slate-300">{item.goalCount}</td>
                  <td className="px-3 sm:px-4 py-3 text-slate-300">
                    {item.estimatedDays} hari ({item.estimatedDays * 30} menit)
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 rounded-lg border border-slate-700/60 bg-slate-900/50 p-3 text-[11px] sm:text-xs text-slate-300 space-y-1">
          <p className="font-semibold text-slate-200">Catatan</p>
          <p>1. Estimasi ini baseline untuk ritme 30 menit per hari dengan latihan aktif.</p>
          <p>2. Estimasi bisa berubah tergantung konsistensi latihan yang terbentuk.</p>
          <p>3. Semakin konsisten berlatih, semakin cepat terbiasa dan progres speaking biasanya lebih cepat.</p>
        </div>

        <div className="mt-5 sm:mt-6 flex justify-end gap-2">
          <Link
            href="/skill/speaking"
            className="px-3 sm:px-4 py-2 rounded-lg bg-pink-500/20 border border-pink-500/40 text-pink-200 hover:bg-pink-500/30 transition-colors text-xs sm:text-sm"
            onClick={onClose}
          >
            Go to Speaking
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

export default SpeakingRoadmapModal
