'use client'

import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'
import {
  SPEAKING_ROADMAP_ITEMS,
  SPEAKING_ROADMAP_TOTAL_DAYS,
  SPEAKING_ROADMAP_TOTAL_GOALS,
} from './roadmap-data/speaking-roadmap'
import { SPEAKING_GOALS } from '../../../skill/speaking/data/goals'
import { AUTHORED_SPEAKING_GOAL_IDS } from '../../../skill/speaking/data/details/authored-goals'
import {
  readSpeakingGoalCompletionMap,
  writeSpeakingGoalCompletionMap,
  type SpeakingGoalCompletionMap,
} from '../../../skill/speaking/data/progress'

type SpeakingRoadmapModalProps = {
  isOpen: boolean
  onClose: () => void
  zIndex?: number
}

type LessonDetailItem = {
  id: string
  label: string
  href: string
}

type LessonDetailGroup = {
  id: string
  title: string
  items: LessonDetailItem[]
}

type LessonDetailConfig = {
  phaseId: string
  title: string
  groups: LessonDetailGroup[]
}

const chunkArray = <T,>(items: T[], size: number): T[][] => {
  if (size <= 0) return [items]
  const chunks: T[][] = []
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size))
  }
  return chunks
}

const buildSpeakingLessonDetailConfigs = (): Record<string, LessonDetailConfig> => {
  const authoredSet = new Set<string>(AUTHORED_SPEAKING_GOAL_IDS)

  return Object.fromEntries(
    SPEAKING_ROADMAP_ITEMS.map((phase) => {
      const goalsInPhase = SPEAKING_GOALS.filter(
        (goal) => goal.phaseId === phase.id && authoredSet.has(goal.id),
      )

      const chunks = chunkArray(goalsInPhase, 6)
      const groups: LessonDetailGroup[] = chunks.map((chunk, index) => {
        const start = index * 6 + 1
        const end = start + chunk.length - 1
        return {
          id: `${phase.id}-chunk-${index + 1}`,
          title: `Goals ${start}-${end}`,
          items: chunk.map((goal) => ({
            id: goal.id,
            label: `${goal.goalOrder}. ${goal.goal}`,
            href: `/skill/speaking/cefr-a1/${goal.id}`,
          })),
        }
      })

      return [
        phase.id,
        {
          phaseId: phase.id,
          title: phase.title,
          groups,
        },
      ]
    }),
  )
}

const SPEAKING_LESSON_DETAIL_CONFIGS = buildSpeakingLessonDetailConfigs()

const SpeakingRoadmapModal: React.FC<SpeakingRoadmapModalProps> = ({
  isOpen,
  onClose,
  zIndex = 200,
}) => {
  const [checkedByGoalId, setCheckedByGoalId] = useState<SpeakingGoalCompletionMap>(() => {
    if (typeof window === 'undefined') return {}
    return readSpeakingGoalCompletionMap()
  })

  const [lessonDetailPopup, setLessonDetailPopup] = useState<null | { config: LessonDetailConfig; activeGroupIndex: number }>(
    null,
  )

  useEffect(() => {
    if (!isOpen) return
    writeSpeakingGoalCompletionMap(checkedByGoalId)
  }, [checkedByGoalId, isOpen])

  useEffect(() => {
    if (!lessonDetailPopup) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLessonDetailPopup(null)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [lessonDetailPopup])

  const getLessonDetailItemCount = (config: LessonDetailConfig) =>
    config.groups.reduce((total, group) => total + group.items.length, 0)

  const getGoalsInPhase = (phaseId: string) =>
    SPEAKING_LESSON_DETAIL_CONFIGS[phaseId]?.groups.flatMap((group) => group.items.map((item) => item.id)) ?? []

  const isPhaseCompleted = (phaseId: string) => {
    const goalIds = getGoalsInPhase(phaseId)
    if (goalIds.length === 0) return false
    return goalIds.every((goalId) => checkedByGoalId[goalId] === true)
  }

  const toggleGoalChecked = (goalId: string) => {
    setCheckedByGoalId((prev) => ({ ...prev, [goalId]: !Boolean(prev[goalId]) }))
  }

  const togglePhaseChecked = (phaseId: string) => {
    const goalIds = getGoalsInPhase(phaseId)
    if (goalIds.length === 0) return

    setCheckedByGoalId((prev) => {
      const next = { ...prev }
      const allDone = goalIds.every((goalId) => next[goalId] === true)
      const nextValue = !allDone
      goalIds.forEach((goalId) => {
        next[goalId] = nextValue
      })
      return next
    })
  }

  const openLessonDetailPopup = (phaseId: string) => {
    const config = SPEAKING_LESSON_DETAIL_CONFIGS[phaseId]
    if (!config) return
    if (getLessonDetailItemCount(config) <= 1) return
    setLessonDetailPopup({ config, activeGroupIndex: 0 })
  }

  const closeLessonDetailPopup = () => setLessonDetailPopup(null)

  const navigateLessonDetailPopup = (direction: -1 | 1) => {
    setLessonDetailPopup((prev) => {
      if (!prev) return prev
      const totalGroups = prev.config.groups.length
      if (totalGroups <= 1) return prev
      const nextIndex = (prev.activeGroupIndex + direction + totalGroups) % totalGroups
      return { ...prev, activeGroupIndex: nextIndex }
    })
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
      style={{ zIndex }}
    >
      <div
        className="w-full max-w-[96vw] sm:max-w-5xl bg-slate-950 border border-pink-500/30 rounded-2xl p-4 sm:p-6 md:p-8 shadow-[0_0_30px_rgba(236,72,153,0.2)]"
        onClick={(e) => e.stopPropagation()}
      >
        {lessonDetailPopup ? (
          <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: zIndex + 10 }}>
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm" onClick={closeLessonDetailPopup} />
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="speaking-lesson-detail-popup-title"
              className="relative w-full max-w-lg rounded-2xl border border-slate-700/60 bg-slate-900/90 shadow-[0_30px_120px_rgba(0,0,0,0.55)] overflow-hidden"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3 p-4 border-b border-slate-700/50">
                <div className="min-w-0">
                  <div
                    id="speaking-lesson-detail-popup-title"
                    className="text-sm sm:text-base font-display font-bold text-white truncate"
                  >
                    {lessonDetailPopup.config.title}
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-400 font-mono">Checklist lesson (lihat detail)</div>
                </div>
                <button
                  type="button"
                  onClick={closeLessonDetailPopup}
                  className="shrink-0 px-2 py-1 rounded-md text-slate-200 hover:text-white hover:bg-slate-800/70 transition-colors text-sm"
                  aria-label="Close"
                >
                  X
                </button>
              </div>

              {lessonDetailPopup.config.groups.length > 1 ? (
                <div className="flex items-center justify-between gap-2 px-4 py-2 border-b border-slate-700/40">
                  <button
                    type="button"
                    onClick={() => navigateLessonDetailPopup(-1)}
                    className="px-2 py-1 rounded-md border border-slate-700/60 bg-slate-900/40 text-slate-200 hover:bg-slate-800/60 transition-colors text-xs"
                    aria-label="Previous category"
                  >
                    Prev
                  </button>
                  <div className="flex flex-col items-center min-w-0">
                    <div className="text-xs sm:text-sm text-slate-200 font-semibold truncate max-w-[220px]">
                      {lessonDetailPopup.config.groups[lessonDetailPopup.activeGroupIndex]?.title ?? ''}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {lessonDetailPopup.activeGroupIndex + 1}/{lessonDetailPopup.config.groups.length}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigateLessonDetailPopup(1)}
                    className="px-2 py-1 rounded-md border border-slate-700/60 bg-slate-900/40 text-slate-200 hover:bg-slate-800/60 transition-colors text-xs"
                    aria-label="Next category"
                  >
                    Next
                  </button>
                </div>
              ) : null}

              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-300 ease-out"
                  style={{ transform: `translateX(-${lessonDetailPopup.activeGroupIndex * 100}%)` }}
                >
                  {lessonDetailPopup.config.groups.map((group) => (
                    <div key={group.id} className="w-full shrink-0 p-4">
                      <div className="max-h-[55vh] overflow-y-auto space-y-3 pr-1 flex flex-col items-center">
                        {group.items.map((item) => {
                          const checkboxId = `${lessonDetailPopup.config.phaseId}-${item.id}`
                          const checked = Boolean(checkedByGoalId[item.id])
                          return (
                            <div key={item.id} className="flex items-center justify-center gap-3">
                              <input
                                id={checkboxId}
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleGoalChecked(item.id)}
                                className="h-4 w-4 accent-pink-400"
                              />
                              <Link
                                href={item.href}
                                onClick={() => {
                                  closeLessonDetailPopup()
                                  onClose()
                                }}
                                className="text-[11px] sm:text-xs font-semibold leading-tight text-slate-200 underline underline-offset-2 decoration-slate-600/60 hover:text-pink-200 hover:decoration-pink-300/80 transition-colors text-center max-w-[420px]"
                                title="Open goal"
                              >
                                {item.label}
                              </Link>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-white">
              Speaking Roadmap
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              Estimasi dibuat untuk belajar 30 menit per hari.
            </p>
            <p className="text-slate-300 text-xs sm:text-sm mt-2">
              <span className="text-slate-500">Total goals: {SPEAKING_ROADMAP_TOTAL_GOALS}</span>
              <span className="text-slate-500"> | Total estimasi: {SPEAKING_ROADMAP_TOTAL_DAYS} hari</span>
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
                <th className="px-3 sm:px-4 py-3 text-left font-semibold">Checklist sudah dipelajari</th>
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
                  <td className="px-3 sm:px-4 py-3">
                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={isPhaseCompleted(item.id)}
                          onChange={() => togglePhaseChecked(item.id)}
                          className="h-4 w-4 accent-pink-400"
                        />
                        <span className="text-slate-300">Sudah</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => openLessonDetailPopup(item.id)}
                        className="text-[11px] sm:text-xs text-slate-400 underline underline-offset-2 decoration-slate-600/60 hover:text-pink-200 hover:decoration-pink-300/80 transition-colors"
                      >
                        (lihat detail)
                      </button>
                    </div>
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
          <p>4. Checklist &quot;Sudah&quot; dipakai saat goal selesai dipelajari minimal 1 putaran.</p>
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
