'use client'

import Link from 'next/link'
import React, { useEffect, useMemo, useState } from 'react'
import {
  PRONUNCIATION_ROADMAP_CHECKLIST_ENABLED_IDS,
  PRONUNCIATION_ROADMAP_ITEMS,
  PRONUNCIATION_ROADMAP_TOTAL_DAYS,
} from './roadmap-data/pronunciation-roadmap'
import { useHaptic } from '@/lib/haptic/useHaptic'

type PronunciationRoadmapModalProps = {
  isOpen: boolean
  onClose: () => void
  zIndex?: number
}

const ROADMAP_CHECKLIST_KEY = 'dashboard-pronunciation-roadmap-checklist-v1'
const ROADMAP_LESSON_DETAIL_PREFIX = 'lesson:'

type LessonDetailItem = {
  id: string
  label: string
  href: string
}

type LessonDetailGroup = {
  id: string
  title: string
  labelVariant?: 'default' | 'symbol'
  items: LessonDetailItem[]
}

type LessonDetailConfig = {
  topicId: string
  title: string
  groups: LessonDetailGroup[]
}

const PHONETIC_SYMBOL_GROUPS: Array<{ id: string; title: string; symbols: string[] }> = [
  {
    id: 'vowel-lax',
    title: 'Vowel (Lax)',
    symbols: ['\u028c', '\u026a', '\u028a', '\u025b', '\u0259', '\u025a'],
  },
  {
    id: 'vowel-tense',
    title: 'Vowel (Tense)',
    symbols: ['\u0251', 'i', 'u', '\u00e6', '\u0254'],
  },
  {
    id: 'diphthong',
    title: 'Diphthong',
    symbols: ['a\u026a', 'e\u026a', '\u0254\u026a', '\u026a\u0259', 'e\u0259', '\u028a\u0259', 'o\u028a', 'a\u028a'],
  },
  {
    id: 'consonant-voiceless',
    title: 'Consonant (Voiceless)',
    symbols: ['p', 't', 'k', 'f', '\u03b8', 's', '\u0283', '\u02a7', 'h'],
  },
  {
    id: 'consonant-voiced',
    title: 'Consonant (Voiced)',
    symbols: ['b', 'd', 'g', 'v', '\u00f0', 'z', '\u0292', '\u02a4', 'l', 'm', 'n', '\u014b', 'r', 'w', 'y'],
  },
]

const buildPronunciationLessonDetailConfigs = (): Record<string, LessonDetailConfig> => {
  const phoneticSymbolsConfig: LessonDetailConfig = {
    topicId: 'phonetic-symbols',
    title: 'Phonetic Symbols',
    groups: PHONETIC_SYMBOL_GROUPS.map((group) => ({
      id: group.id,
      title: group.title,
      labelVariant: 'symbol',
      items: group.symbols.map((symbol) => ({
        id: `phoneticSymbols_${symbol}`,
        label: symbol,
        href: `/skill/pronunciation/phoneticSymbols/${encodeURIComponent(symbol)}`,
      })),
    })),
  }

  const finalSoundConfig: LessonDetailConfig = {
    topicId: 'final-sound',
    title: 'Final Sound',
    groups: [
      {
        id: 'final-sound',
        title: 'Final Sound',
        items: [
          { id: 'final-sound-s-es', label: 'S/ES', href: '/skill/pronunciation/final-sound-new/s/es' },
          { id: 'final-sound-d-ed', label: 'D/ED', href: '/skill/pronunciation/final-sound-new/d/ed' },
        ],
      },
    ],
  }

  const americanTConfig: LessonDetailConfig = {
    topicId: 'american-t',
    title: 'American /t/',
    groups: [
      {
        id: 'american-t-beginning',
        title: 'Beginning',
        items: [{ id: 'american-t-released-beginning', label: 'Released /t/', href: '/skill/pronunciation/american-t/beginning/clear-t' }],
      },
      {
        id: 'american-t-middle',
        title: 'Middle',
        items: [
          { id: 'american-t-flap', label: 'Flap T /\u027e/', href: '/skill/pronunciation/american-t/middle/flap' },
          { id: 'american-t-silent', label: 'Silent /t/', href: '/skill/pronunciation/american-t/middle/silent-t' },
          { id: 'american-t-glottal', label: 'Glottal Stop /\u0294/', href: '/skill/pronunciation/american-t/middle/glottal' },
        ],
      },
      {
        id: 'american-t-ending',
        title: 'Ending',
        items: [
          { id: 'american-t-released-ending', label: 'Released /t/ Ending', href: '/skill/pronunciation/american-t/ending/clear-t-ending' },
          { id: 'american-t-final-before-consonant', label: 'Final T Before Consonant', href: '/skill/pronunciation/american-t/ending/final-t' },
        ],
      },
    ],
  }

  return {
    [phoneticSymbolsConfig.topicId]: phoneticSymbolsConfig,
    [finalSoundConfig.topicId]: finalSoundConfig,
    [americanTConfig.topicId]: americanTConfig,
  }
}

const PRONUNCIATION_LESSON_DETAIL_CONFIGS = buildPronunciationLessonDetailConfigs()

const PronunciationRoadmapModal: React.FC<PronunciationRoadmapModalProps> = ({
  isOpen,
  onClose,
  zIndex = 200,
}) => {
  const { triggerHaptic } = useHaptic()
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

  const [lessonDetailPopup, setLessonDetailPopup] = useState<null | { config: LessonDetailConfig; activeGroupIndex: number }>(
    null,
  )

  const toLessonDetailKey = (itemId: string) => `${ROADMAP_LESSON_DETAIL_PREFIX}${itemId}`

  const getLessonDetailItemCount = (config: LessonDetailConfig) =>
    config.groups.reduce((total, group) => total + group.items.length, 0)

  const getLessonDetailKeysForTopic = (topicId: string, config?: LessonDetailConfig) => {
    const resolvedConfig = config ?? PRONUNCIATION_LESSON_DETAIL_CONFIGS[topicId]
    if (!resolvedConfig) return []
    return resolvedConfig.groups.flatMap((group) => group.items.map((item) => toLessonDetailKey(item.id)))
  }

  const syncTopicWithLessonDetails = (snapshot: Record<string, boolean>) => {
    let next: Record<string, boolean> | null = null

    const ensureNext = () => {
      if (!next) next = { ...snapshot }
      return next
    }

    Object.entries(PRONUNCIATION_LESSON_DETAIL_CONFIGS).forEach(([topicId, config]) => {
      const detailKeys = getLessonDetailKeysForTopic(topicId, config)
      if (detailKeys.length === 0) return

      const topicLegacyChecked = snapshot[topicId] === true
      if (topicLegacyChecked) {
        // Migration: legacy "topic checked" implies all lesson details are done.
        detailKeys.forEach((key) => {
          if (snapshot[key] !== true) {
            ensureNext()[key] = true
          }
        })
      }

      const source = next ?? snapshot
      const allDone = detailKeys.every((key) => source[key] === true)
      if (source[topicId] !== allDone) {
        ensureNext()[topicId] = allDone
      }
    })

    return next ?? snapshot
  }

  const syncedCheckedById = isOpen ? syncTopicWithLessonDetails(checkedById) : checkedById

  useEffect(() => {
    if (!isOpen) return
    localStorage.setItem(ROADMAP_CHECKLIST_KEY, JSON.stringify(syncedCheckedById))
  }, [syncedCheckedById, isOpen])

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

  const completedCount = useMemo(
    () => PRONUNCIATION_ROADMAP_CHECKLIST_ENABLED_IDS.filter((id) => syncedCheckedById[id]).length,
    [syncedCheckedById]
  )

  const totalDays = useMemo(() => PRONUNCIATION_ROADMAP_TOTAL_DAYS, [])

  const toggleChecked = (id: string) => {
    setCheckedById((prev) => {
      const synced = syncTopicWithLessonDetails(prev)
      return {
        ...synced,
        [id]: !synced[id],
      }
    })
  }

  const toggleTopicChecked = (topicId: string) => {
    const config = PRONUNCIATION_LESSON_DETAIL_CONFIGS[topicId]
    if (!config) {
      toggleChecked(topicId)
      return
    }

    const detailKeys = getLessonDetailKeysForTopic(topicId, config)
    setCheckedById((prev) => {
      const next = { ...prev }
      const allDone = detailKeys.length > 0 && detailKeys.every((key) => next[key] === true)
      const nextValue = !allDone
      detailKeys.forEach((key) => {
        next[key] = nextValue
      })
      next[topicId] = nextValue
      return next
    })
  }

  const toggleLessonDetailChecked = (topicId: string, detailItemId: string) => {
    const config = PRONUNCIATION_LESSON_DETAIL_CONFIGS[topicId]
    if (!config) return
    const detailKeys = getLessonDetailKeysForTopic(topicId, config)

    setCheckedById((prev) => {
      const next = { ...prev }

      // Migration safety: topic-level checked implies all details checked.
      if (next[topicId] === true) {
        detailKeys.forEach((key) => {
          next[key] = true
        })
      }

      const key = toLessonDetailKey(detailItemId)
      next[key] = !Boolean(next[key])

      const allDone = detailKeys.length > 0 && detailKeys.every((detailKey) => next[detailKey] === true)
      next[topicId] = allDone
      return next
    })
  }

  const openLessonDetailPopup = (topicId: string) => {
    const config = PRONUNCIATION_LESSON_DETAIL_CONFIGS[topicId]
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
        className="w-full max-w-[96vw] sm:max-w-5xl bg-black border border-purple-500/30 rounded-2xl p-4 sm:p-6 md:p-8 shadow-[0_0_30px_rgba(168,85,247,0.25)]"
        onClick={(e) => e.stopPropagation()}
      >
        {lessonDetailPopup ? (
          <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: zIndex + 10 }}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={closeLessonDetailPopup} />
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="lesson-detail-popup-title"
              className="relative w-full max-w-lg rounded-2xl border border-slate-700/60 bg-black/90 shadow-[0_30px_120px_rgba(0,0,0,0.55)] overflow-hidden"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3 p-4 border-b border-slate-700/50">
                <div className="min-w-0">
                  <div
                    id="lesson-detail-popup-title"
                    className="text-sm sm:text-base font-display font-bold text-white truncate"
                  >
                    {lessonDetailPopup.config.title}
                  </div>
                  <div className="text-[11px] sm:text-xs text-slate-400 font-mono">
                    Checklist lesson (lihat detail)
                  </div>
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
                    className="px-2 py-1 rounded-md border border-slate-700/60 bg-black/40 text-slate-200 hover:bg-slate-800/60 transition-colors text-xs"
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
                    className="px-2 py-1 rounded-md border border-slate-700/60 bg-black/40 text-slate-200 hover:bg-slate-800/60 transition-colors text-xs"
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
                          const checkboxId = `${lessonDetailPopup.config.topicId}-${item.id}`
                          const checked = Boolean(syncedCheckedById[toLessonDetailKey(item.id)])
                          const labelClassName =
                            (group.labelVariant === 'symbol'
                              ? 'text-base sm:text-lg font-mono'
                              : 'text-[11px] sm:text-xs font-semibold leading-tight') +
                            ' text-slate-200 underline underline-offset-2 decoration-slate-600/60 hover:text-cyan-200 hover:decoration-cyan-300/80 transition-colors text-center'
                          return (
                            <div key={item.id} className="flex items-center justify-center gap-3">
                              <input
                                id={checkboxId}
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleLessonDetailChecked(lessonDetailPopup.config.topicId, item.id)}
                                className="h-4 w-4 accent-cyan-400"
                              />
                              <Link
                                href={item.href}
                                onClick={() => {
                                  closeLessonDetailPopup()
                                  onClose()
                                }}
                                className={labelClassName}
                                title="Open page"
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
            data-tour="dashboard-roadmap-modal-close"
            aria-label="Close"
          >
            x
          </button>
        </div>

        <div className="overflow-x-auto geuwat-table-scroll border border-slate-700/60 rounded-xl">
          <table className="min-w-full geuwat-table-responsive text-xs sm:text-sm">
            <thead className="bg-black/70 text-slate-200">
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
                      <div className="flex items-center gap-2">
                        <label className="inline-flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(syncedCheckedById[item.id])}
                            onChange={() => toggleTopicChecked(item.id)}
                            className="h-4 w-4 accent-cyan-400"
                          />
                          <span className="text-slate-300">Sudah</span>
                        </label>
                        {PRONUNCIATION_LESSON_DETAIL_CONFIGS[item.id] ? (
                          <button
                            type="button"
                            onClick={() => openLessonDetailPopup(item.id)}
                            className="text-[11px] sm:text-xs text-slate-400 underline underline-offset-2 decoration-slate-600/60 hover:text-cyan-200 hover:decoration-cyan-300/80 transition-colors"
                          >
                            (lihat detail)
                          </button>
                        ) : null}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 rounded-lg border border-slate-700/60 bg-black/50 p-3 text-[11px] sm:text-xs text-slate-300 space-y-1">
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
            data-tour="dashboard-roadmap-modal-close"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default PronunciationRoadmapModal

