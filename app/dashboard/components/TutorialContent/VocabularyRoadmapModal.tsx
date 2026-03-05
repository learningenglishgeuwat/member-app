'use client'

import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'
import {
  VOCABULARY_ROADMAP_ITEMS,
  VOCABULARY_ROADMAP_TOTAL_DAYS,
  VOCABULARY_ROADMAP_TOTAL_WORDS,
} from './roadmap-data/vocabulary-roadmap'

type VocabularyRoadmapModalProps = {
  isOpen: boolean
  onClose: () => void
  zIndex?: number
}

const VOCAB_ROADMAP_CHECKLIST_KEY = 'dashboard-vocabulary-roadmap-checklist-v1'

const VocabularyRoadmapModal: React.FC<VocabularyRoadmapModalProps> = ({
  isOpen,
  onClose,
  zIndex = 200,
}) => {
  const [checkedById, setCheckedById] = useState<Record<string, boolean>>(() => {
    if (typeof window === 'undefined') return {}
    try {
      const raw = localStorage.getItem(VOCAB_ROADMAP_CHECKLIST_KEY)
      if (!raw) return {}
      return JSON.parse(raw) as Record<string, boolean>
    } catch {
      return {}
    }
  })

  useEffect(() => {
    if (!isOpen) return
    localStorage.setItem(VOCAB_ROADMAP_CHECKLIST_KEY, JSON.stringify(checkedById))
  }, [checkedById, isOpen])

  const completedCount = useMemo(
    () => VOCABULARY_ROADMAP_ITEMS.filter((item) => checkedById[item.id]).length,
    [checkedById]
  )

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
        className="w-full max-w-[96vw] sm:max-w-6xl bg-slate-950 border border-green-500/30 rounded-2xl p-4 sm:p-6 md:p-8 shadow-[0_0_30px_rgba(34,197,94,0.2)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
              Vocabulary Roadmap
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Estimasi dibuat untuk belajar 30 menit per hari.
            </p>
            <p className="text-slate-300 text-xs sm:text-sm mt-2">
              Progress: <span className="text-green-300 font-semibold">{completedCount}/{VOCABULARY_ROADMAP_ITEMS.length}</span> topik selesai
              <span className="text-slate-500"> | Total kata: {VOCABULARY_ROADMAP_TOTAL_WORDS}</span>
              <span className="text-slate-500"> | Total estimasi: {VOCABULARY_ROADMAP_TOTAL_DAYS} hari</span>
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

        <div className="overflow-x-auto geuwat-table-scroll border border-slate-700/60 rounded-xl max-h-[56vh]">
          <table className="min-w-full geuwat-table-responsive text-xs sm:text-sm">
            <thead className="bg-slate-900/70 text-slate-200 sticky top-0">
              <tr>
                <th className="px-3 sm:px-4 py-3 text-left font-semibold">No</th>
                <th className="px-3 sm:px-4 py-3 text-left font-semibold">Topik</th>
                <th className="px-3 sm:px-4 py-3 text-left font-semibold">Fokus</th>
                <th className="px-3 sm:px-4 py-3 text-left font-semibold">Jumlah kata</th>
                <th className="px-3 sm:px-4 py-3 text-left font-semibold">Estimasi (30 menit/hari)</th>
                <th className="px-3 sm:px-4 py-3 text-left font-semibold">Checklist sudah dipelajari</th>
              </tr>
            </thead>
            <tbody>
              {VOCABULARY_ROADMAP_ITEMS.map((item, index) => (
                <tr key={item.id} className="border-t border-slate-800/70 text-slate-200">
                  <td className="px-3 sm:px-4 py-3">{index + 1}</td>
                  <td className="px-3 sm:px-4 py-3">
                    <Link
                      href={item.href}
                      className="text-green-300 hover:text-green-200 underline underline-offset-2"
                      onClick={onClose}
                    >
                      {item.title}
                    </Link>
                  </td>
                  <td className="px-3 sm:px-4 py-3 text-slate-300">{item.focus}</td>
                  <td className="px-3 sm:px-4 py-3 text-slate-300">{item.wordCount}</td>
                  <td className="px-3 sm:px-4 py-3 text-slate-300">
                    {item.estimatedDays} hari ({item.estimatedDays * 30} menit)
                  </td>
                  <td className="px-3 sm:px-4 py-3">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(checkedById[item.id])}
                        onChange={() => toggleChecked(item.id)}
                        className="h-4 w-4 accent-green-400"
                      />
                      <span className="text-slate-300">Sudah</span>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 rounded-lg border border-slate-700/60 bg-slate-900/50 p-3 text-[11px] sm:text-xs text-slate-300 space-y-1">
          <p className="font-semibold text-slate-200">Catatan</p>
          <p>1. Estimasi ini baseline untuk 30 menit per hari dengan pola belajar + review.</p>
          <p>2. Estimasi bisa berubah sesuai konsistensi latihan harian yang terbentuk.</p>
          <p>3. Semakin konsisten latihan, semakin cepat terbiasa dan akuisisi vocabulary makin stabil.</p>
          <p>4. Checklist &quot;Sudah&quot; dipakai saat topik selesai dipelajari minimal 1 putaran.</p>
        </div>

        <div className="mt-5 sm:mt-6 flex justify-end gap-2">
          <Link
            href="/skill/vocabulary"
            className="px-3 sm:px-4 py-2 rounded-lg bg-green-500/20 border border-green-500/40 text-green-200 hover:bg-green-500/30 transition-colors text-xs sm:text-sm"
            onClick={onClose}
          >
            Go to Vocabulary
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

export default VocabularyRoadmapModal
