'use client'

import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'
import {
  PRONUNCIATION_ROADMAP_CHECKLIST_ENABLED_IDS,
  PRONUNCIATION_ROADMAP_ITEMS,
  PRONUNCIATION_ROADMAP_TOTAL_DAYS,
} from './roadmap-data/pronunciation-roadmap'

type PronunciationRoadmapModalProps = {
  isOpen: boolean
  onClose: () => void
  zIndex?: number
}

const ROADMAP_CHECKLIST_KEY = 'dashboard-pronunciation-roadmap-checklist-v1'

const PronunciationRoadmapModal: React.FC<PronunciationRoadmapModalProps> = ({
  isOpen,
  onClose,
  zIndex = 200,
}) => {
  const [checkedById, setCheckedById] = useState<Record<string, boolean>>(() => {
    if (typeof window === 'undefined') return {}
    try {
      const raw = localStorage.getItem(ROADMAP_CHECKLIST_KEY)
      if (!raw) return {}
      return JSON.parse(raw) as Record<string, boolean>
    } catch {
      return {}
    }
  })

  useEffect(() => {
    if (!isOpen) return
    localStorage.setItem(ROADMAP_CHECKLIST_KEY, JSON.stringify(checkedById))
  }, [checkedById, isOpen])

  const completedCount = useMemo(
    () => PRONUNCIATION_ROADMAP_CHECKLIST_ENABLED_IDS.filter((id) => checkedById[id]).length,
    [checkedById]
  )

  const totalDays = useMemo(() => PRONUNCIATION_ROADMAP_TOTAL_DAYS, [])

  const toggleChecked = (id: string) => {
    setCheckedById((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
      style={{ zIndex }}
    >
      <div
        className="w-full max-w-[96vw] sm:max-w-5xl bg-slate-950 border border-purple-500/30 rounded-2xl p-4 sm:p-6 md:p-8 shadow-[0_0_30px_rgba(168,85,247,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
              Pronunciation Roadmap
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Estimasi dibuat untuk belajar 30 menit per hari.
            </p>
            <p className="text-slate-300 text-xs sm:text-sm mt-2">
              Progress: <span className="text-cyan-300 font-semibold">{completedCount}/{PRONUNCIATION_ROADMAP_CHECKLIST_ENABLED_IDS.length}</span> materi selesai
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
                <th className="px-3 sm:px-4 py-3 text-left font-semibold">Materi</th>
                <th className="px-3 sm:px-4 py-3 text-left font-semibold">Fokus</th>
                <th className="px-3 sm:px-4 py-3 text-left font-semibold">Estimasi (30 menit/hari)</th>
                <th className="px-3 sm:px-4 py-3 text-left font-semibold">Checklist sudah dipelajari</th>
              </tr>
            </thead>
            <tbody>
              {PRONUNCIATION_ROADMAP_ITEMS.map((item, index) => (
                <tr key={item.id} className="border-t border-slate-800/70 text-slate-200">
                  <td className="px-3 sm:px-4 py-3">{index + 1}</td>
                  <td className="px-3 sm:px-4 py-3">
                    <Link
                      href={item.href}
                      className="text-cyan-300 hover:text-cyan-200 underline underline-offset-2"
                      onClick={onClose}
                    >
                      {item.title}
                    </Link>
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-slate-300">{item.focus}</td>
                  <td className="px-3 sm:px-4 py-3 text-slate-300">
                    {item.estimatedDays} hari ({item.estimatedDays * 30} menit)
                  </td>
                  <td className="px-3 sm:px-4 py-3">
                    {item.id === 'text-practice' ? (
                      <span className="text-slate-500">-</span>
                    ) : (
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={Boolean(checkedById[item.id])}
                          onChange={() => toggleChecked(item.id)}
                          className="h-4 w-4 accent-cyan-400"
                        />
                        <span className="text-slate-300">Sudah</span>
                      </label>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 rounded-lg border border-slate-700/60 bg-slate-900/50 p-3 text-[11px] sm:text-xs text-slate-300 space-y-1">
          <p className="font-semibold text-slate-200">Catatan</p>
          <p>1. Estimasi dihitung untuk ritme belajar 30 menit per hari.</p>
          <p>2. Estimasi bisa berubah tergantung konsistensi latihan harian yang terbentuk.</p>
          <p>3. Semakin konsisten berlatih, kamu akan semakin terbiasa dan proses belajarnya bisa lebih cepat.</p>
          <p>4. Jika satu materi masih belum nyaman, tambah 1-2 hari buffer sebelum lanjut.</p>
          <p>5. Checklist &quot;Sudah&quot; dipakai saat materi sudah kamu selesaikan minimal 1 putaran latihan.</p>
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

export default PronunciationRoadmapModal

