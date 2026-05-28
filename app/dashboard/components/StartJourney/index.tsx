'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { BarChart2, BookOpen, CalendarDays, Copy, ExternalLink, Loader, Play, Target, X, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useHaptic } from '@/lib/haptic/useHaptic'
import PronunciationRoadmapModal from '@/app/dashboard/components/TutorialContent/PronunciationRoadmapModal'
import { saveDashboardView } from '@/app/dashboard/dashboardView'

interface JourneyPlan {
  title: string
  motivation: string
  steps: string[]
}

const STORAGE_KEY = 'dashboard-mission-goal'
const DASHBOARD_VIEW_EVENT = 'geuwat:dashboard-view'
const DEPLOYED_APP_URL = 'https://learningenglishgeuwat-ten.vercel.app'
const DAY_OPTIONS = [
  { value: 1, label: 'Senin' },
  { value: 2, label: 'Selasa' },
  { value: 3, label: 'Rabu' },
  { value: 4, label: 'Kamis' },
  { value: 5, label: 'Jumat' },
  { value: 6, label: 'Sabtu' },
  { value: 0, label: 'Minggu' },
] as const

type PronunciationMeeting = {
  meeting: number
  title: string
  path: string
}

export const PRONUNCIATION_PHASE_TWO_MEETINGS: PronunciationMeeting[] = [
  { meeting: 1, title: 'Alphabet Symbols + Spelling Exercise', path: '/skill/pronunciation/alphabet' },
  { meeting: 2, title: '/i/ vs /\u026a/', path: '/skill/pronunciation/phoneticSymbols' },
  { meeting: 3, title: '/e/ vs /\u00e6/', path: '/skill/pronunciation/phoneticSymbols' },
  { meeting: 4, title: '/\u028c/ vs /\u0251/', path: '/skill/pronunciation/phoneticSymbols' },
  { meeting: 5, title: '/u/ vs /\u028a/', path: '/skill/pronunciation/phoneticSymbols' },
  { meeting: 6, title: '/\u0254/, /\u0259/, & /\u025a/', path: '/skill/pronunciation/phoneticSymbols' },
  { meeting: 7, title: 'Vowel Quiz', path: '/skill/pronunciation/phoneticSymbols' },
  { meeting: 8, title: '/a\u026a, e\u026a, \u0254\u026a/ vs /o\u028a, a\u028a/', path: '/skill/pronunciation/phoneticSymbols' },
  { meeting: 9, title: '/\u026ar/, /er/, & /\u028ar/', path: '/skill/pronunciation/phoneticSymbols' },
  { meeting: 10, title: 'Diphthong Quiz', path: '/skill/pronunciation/phoneticSymbols' },
  { meeting: 11, title: '/p, b/, /t, d/, /k, g/ (The Plosives)', path: '/skill/pronunciation/phoneticSymbols' },
  { meeting: 12, title: '/f, v/, /\u03b8, \u00f0/, /s, z/, /h/ (Fricatives 1)', path: '/skill/pronunciation/phoneticSymbols' },
  { meeting: 13, title: '/\u0283, \u0292/, /\u02a7, \u02a4/ & /m, n, \u014b/ (Deep Friction & Nasals)', path: '/skill/pronunciation/phoneticSymbols' },
  { meeting: 14, title: '/l, r/, /w, y/ (Glides & Liquids)', path: '/skill/pronunciation/phoneticSymbols' },
  { meeting: 15, title: 'Consonant Quiz', path: '/skill/pronunciation/phoneticSymbols' },
  { meeting: 16, title: 'Final Sound -s/-es (/s/, /z/, /\u026az/)', path: '/skill/pronunciation/final-sound-new/s/es' },
  { meeting: 17, title: 'Final sound -s/es quiz & reading text', path: '/skill/pronunciation/final-sound-new/s/es' },
  { meeting: 18, title: 'Final Sound -d/-ed (/t/, /d/, /\u026ad/)', path: '/skill/pronunciation/final-sound-new/d/ed' },
  { meeting: 19, title: 'Final sound -d/-ed quiz & reading text', path: '/skill/pronunciation/final-sound-new/d/ed' },
  { meeting: 20, title: 'American t : beginning & ending', path: '/skill/pronunciation/american-t' },
  { meeting: 21, title: 'American t : middle', path: '/skill/pronunciation/american-t' },
  { meeting: 22, title: 'American t: reading text', path: '/skill/pronunciation/american-t' },
  { meeting: 23, title: 'Linking Word: LIAISON, GEMINATION, INTRUSION', path: '/skill/pronunciation/linking-word' },
  { meeting: 24, title: 'Linking Word: ASSIMILATION', path: '/skill/pronunciation/linking-word' },
  { meeting: 25, title: 'Contraction: To Be dan Aux Verbs', path: '/skill/pronunciation/contraction' },
  { meeting: 26, title: 'Contraction: Negatif dan Informal', path: '/skill/pronunciation/contraction' },
]

const DICTIONARY_LINKS = [
  { name: 'LONGMAN', href: 'https://www.ldoceonline.com/dictionary/' },
  { name: 'CAMBRIDGE', href: 'https://dictionary.cambridge.org/' },
  { name: 'OXFORD', href: 'https://www.oxfordlearnersdictionaries.com/' },
]

const formatDateInput = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatIndonesianDate = (date: Date) =>
  new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)

const resolveBaseUrl = () => {
  return DEPLOYED_APP_URL
}

const addDays = (date: Date, days: number) => {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

export function buildPronunciationCalendarPrompt(options: {
  startDate: string
  selectedDays: number[]
  startTime: string
  endTime: string
  notificationMinutes: string
  baseUrl?: string
}) {
  const {
    startDate,
    selectedDays,
    startTime,
    endTime,
    notificationMinutes,
    baseUrl = resolveBaseUrl(),
  } = options
  const start = new Date(`${startDate}T00:00:00`)
  const activeDays = selectedDays.length > 0 ? selectedDays : [start.getDay()]
  let cursor = new Date(start)

  const events = PRONUNCIATION_PHASE_TWO_MEETINGS.map((item) => {
    while (!activeDays.includes(cursor.getDay())) {
      cursor = addDays(cursor, 1)
    }

    const eventDate = new Date(cursor)
    cursor = addDays(cursor, 1)
    const link = `${baseUrl}${item.path}`

    return [
      `Meeting ${item.meeting}: ${item.title}`,
      `Judul: GEUWAT PRONUNCIATION`,
      `Waktu: ${formatIndonesianDate(eventDate)} jam ${startTime} - ${endTime}`,
      `Deskripsi: ${item.title} GEUWAT. Buka link ini untuk belajar: ${link}`,
      `Notifikasi: ${notificationMinutes} menit sebelum acara`,
    ].join('\n')
  })

  return `Tolong buatkan event Google Calendar berikut:\n\n${events.join('\n\n')}`
}

const StartJourney: React.FC = () => {
  const router = useRouter()
  const [goal, setGoal] = useState('')
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState<JourneyPlan | null>(null)
  const [initiating, setInitiating] = useState(false)
  const [activePhases, setActivePhases] = useState<Set<number>>(new Set())
  const [showEmptyWarning, setShowEmptyWarning] = useState(false)
  const [isPronunciationRoadmapOpen, setIsPronunciationRoadmapOpen] = useState(false)
  const [isPhaseTwoPopupOpen, setIsPhaseTwoPopupOpen] = useState(false)
  const [isReferencePopupOpen, setIsReferencePopupOpen] = useState(false)
  const [isCalendarPromptOpen, setIsCalendarPromptOpen] = useState(false)
  const [calendarStartDate, setCalendarStartDate] = useState(() => formatDateInput(new Date()))
  const [selectedCalendarDays, setSelectedCalendarDays] = useState<number[]>(() => [new Date().getDay()])
  const [calendarStartTime, setCalendarStartTime] = useState('18:52')
  const [calendarEndTime, setCalendarEndTime] = useState('19:30')
  const [calendarNotificationMinutes, setCalendarNotificationMinutes] = useState('5')
  const [hasCopiedCalendarPrompt, setHasCopiedCalendarPrompt] = useState(false)
  const { triggerHaptic } = useHaptic()

  const calendarPrompt = useMemo(
    () =>
      buildPronunciationCalendarPrompt({
        startDate: calendarStartDate,
        selectedDays: selectedCalendarDays,
        startTime: calendarStartTime,
        endTime: calendarEndTime,
        notificationMinutes: calendarNotificationMinutes,
      }),
    [
      calendarEndTime,
      calendarNotificationMinutes,
      calendarStartDate,
      calendarStartTime,
      selectedCalendarDays,
    ],
  )

  useEffect(() => {
    const savedGoal = localStorage.getItem(STORAGE_KEY)
    if (savedGoal) {
      setGoal(savedGoal)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, goal)
  }, [goal])

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!goal.trim()) {
      triggerHaptic('error')
      setShowEmptyWarning(true)
      return
    }

    setShowEmptyWarning(false)
    setLoading(true)
    setPlan(null)
    
    // Mock data for different goals
    const mockPlans: Record<string, JourneyPlan> = {
      'english': {
        title: "Mission: English Mastery Protocol",
        motivation: "Every word learned is a step toward global connection.",
        steps: [
          "Master 100 essential vocabulary words with daily practice",
          "Complete 20 grammar lessons focusing on sentence structure",
          "Practice speaking with 30 conversation exercises"
        ]
      },
      'react': {
        title: "Mission: React Dominance Initiative",
        motivation: "Code is the language of the future - speak it fluently.",
        steps: [
          "Build 5 interactive components from scratch",
          "Master state management with hooks and context",
          "Create a full-stack application with deployment"
        ]
      },
      'default': {
        title: "Mission: Personal Growth Protocol",
        motivation: "Excellence is not a destination, but a continuous journey.",
        steps: [
          "Define clear, measurable objectives for success",
          "Create a structured daily action plan",
          "Track progress and adjust strategy weekly"
        ]
      }
    }

    // Simple keyword matching to determine the best mock plan
    const lowerGoal = goal.toLowerCase()
    let selectedPlan = mockPlans.default

    if (lowerGoal.includes('english') || lowerGoal.includes('language') || lowerGoal.includes('speaking')) {
      selectedPlan = mockPlans.english
    } else if (lowerGoal.includes('react') || lowerGoal.includes('code') || lowerGoal.includes('programming')) {
      selectedPlan = mockPlans.react
    }

    selectedPlan = {
      ...selectedPlan,
      title: goal.trim(),
      motivation: 'Klik READY pada setiap phase untuk mengunci misi dan memulai perjalananmu.',
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    setPlan(selectedPlan)
    setLoading(false)
    triggerHaptic('success')
  }

  const handleInitiate = async () => {
    setInitiating(true)
    triggerHaptic('success')
    // Simulate loading delay for UX
    await new Promise(resolve => setTimeout(resolve, 1000))
    // Navigate to skills page
    localStorage.removeItem('lastSkillPath')
    router.push('/skill')
  }

  const handlePhaseClick = (phaseIndex: number) => {
    setActivePhases(prev => {
      const newSet = new Set(prev)
      if (newSet.has(phaseIndex)) {
        newSet.delete(phaseIndex)
      } else {
        newSet.add(phaseIndex)
      }
      return newSet
    })
  }

  const closePhaseTwoPopups = () => {
    setIsPhaseTwoPopupOpen(false)
    setIsReferencePopupOpen(false)
    setIsCalendarPromptOpen(false)
  }

  const handleOpenFoundationRoadmap = () => {
    closePhaseTwoPopups()
    setIsPronunciationRoadmapOpen(true)
  }

  const handleOpenViewProgress = () => {
    saveDashboardView('progress')
    closePhaseTwoPopups()
    window.dispatchEvent(
      new CustomEvent(DASHBOARD_VIEW_EVENT, {
        detail: { viewId: 'progress' },
      }),
    )
  }

  const toggleCalendarDay = (day: number) => {
    setSelectedCalendarDays((prev) => {
      if (prev.includes(day)) return prev.filter((item) => item !== day)
      return [...prev, day].sort((a, b) => a - b)
    })
  }

  const handleCopyCalendarPrompt = async () => {
    try {
      await navigator.clipboard.writeText(calendarPrompt)
      setHasCopiedCalendarPrompt(true)
      triggerHaptic('success')
      window.setTimeout(() => setHasCopiedCalendarPrompt(false), 1400)
    } catch {
      triggerHaptic('error')
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
      <header className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-wider">
          INITIATE <span className="text-cyan-300">PROTOCOL</span>
        </h2>
        <p className="text-slate-400 font-mono text-xs sm:text-sm">Jangan biarkan bahasa membatasi langkahmu. Tuliskan mimpi besar yang sedang kamu perjuangkan di sini.</p>
      </header>

      <form
        onSubmit={handleGenerate}
        className="dashboard-widget-card p-4 sm:p-6 md:p-8 relative overflow-hidden group"
        data-tour="dashboard-mission-form"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
        
        <div className="space-y-4">
          <label
            htmlFor="mission-objective"
            className="block text-[11px] sm:text-sm font-medium text-cyan-200 uppercase tracking-widest font-display"
          >
            Mission Objective
          </label>
          <div className={`flex gap-4 flex-col sm:flex-row relative ${showEmptyWarning ? 'animate-shake' : ''}`}>
            <input
              id="mission-objective"
              name="missionObjective"
              type="text"
              value={goal}
              onChange={(e) => {
                setGoal(e.target.value)
                if (showEmptyWarning && e.target.value.trim()) {
                  setShowEmptyWarning(false)
                }
              }}
              placeholder="Aku ingin lolos beasiswa luar negeri, Bekerja di perusahaan global..."
              data-tour="dashboard-mission-input"
              className="flex-1 bg-black/40 border border-cyan-500/30 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-300 focus:shadow-[0_0_15px_rgba(34,211,238,0.22)] transition-all text-sm sm:text-base"
            />
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading}
              data-tour="dashboard-mission-enter"
              className="bg-cyan-500/90 hover:bg-cyan-400 disabled:bg-slate-800 disabled:cursor-not-allowed text-slate-950 disabled:text-slate-400 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-display font-bold flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(34,211,238,0.38)] text-sm sm:text-base"
            >
              {loading ? <Loader className="animate-spin w-4 h-4 sm:w-5 sm:h-5" /> : <span>ENTER</span>}
            </button>
            {showEmptyWarning && (
              <div className="absolute right-0 top-full mt-2 max-w-[160px] rounded-md border border-[#7b1f29] bg-[#4a0e17] px-1.5 py-1 text-[9px] text-white font-mono shadow-[0_0_10px_rgba(74,14,23,0.35)] animate-fade-in" aria-live="assertive">
                <span className="block animate-pulse tracking-wide">Tuliskan dulu mimpimu!</span>
              </div>
            )}
          </div>
        </div>
      </form>

      <PronunciationRoadmapModal
        isOpen={isPronunciationRoadmapOpen}
        onClose={() => setIsPronunciationRoadmapOpen(false)}
      />

      {isPhaseTwoPopupOpen && (
        <div
          className="fixed inset-0 z-[190] flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm"
          onClick={closePhaseTwoPopups}
          role="dialog"
          aria-modal="true"
          aria-label="Latihan Terarah"
        >
          <div
            className="w-full max-w-3xl rounded-2xl border border-cyan-400/30 bg-black p-4 shadow-[0_0_34px_rgba(34,211,238,0.24)] sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">
                  Phase 2
                </p>
                <h3 className="mt-1 text-xl font-display font-bold text-white sm:text-2xl">
                  Latihan Terarah
                </h3>
                <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                  Pilih alat bantu untuk menyusun sesi pronunciation berikutnya.
                </p>
              </div>
              <button
                type="button"
                onClick={closePhaseTwoPopups}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white"
                aria-label="Close Latihan Terarah"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={handleOpenFoundationRoadmap}
                className="rounded-xl border border-cyan-500/25 bg-cyan-500/10 p-4 text-left transition hover:border-cyan-300/60 hover:bg-cyan-500/15"
              >
                <Target className="mb-3 h-5 w-5 text-cyan-200" />
                <div className="font-display text-sm font-bold text-white">Roadmap Strategis</div>
                <div className="mt-1 text-xs text-slate-300">Pahami Fondasi yang perlu dipelajari</div>
              </button>

              <button
                type="button"
                onClick={handleOpenViewProgress}
                className="rounded-xl border border-purple-500/25 bg-purple-500/10 p-4 text-left transition hover:border-purple-300/60 hover:bg-purple-500/15"
              >
                <BarChart2 className="mb-3 h-5 w-5 text-purple-200" />
                <div className="font-display text-sm font-bold text-white">Status &amp; Pencapaian</div>
                <div className="mt-1 text-xs text-slate-300">Pahami View Progress</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsReferencePopupOpen(true)
                  setIsCalendarPromptOpen(false)
                }}
                className="rounded-xl border border-emerald-500/25 bg-emerald-500/10 p-4 text-left transition hover:border-emerald-300/60 hover:bg-emerald-500/15"
              >
                <BookOpen className="mb-3 h-5 w-5 text-emerald-200" />
                <div className="font-display text-sm font-bold text-white">Referensi</div>
                <div className="mt-1 text-xs text-slate-300">Pahami Alat Tempur</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsCalendarPromptOpen(true)
                  setIsReferencePopupOpen(false)
                }}
                className="rounded-xl border border-amber-500/25 bg-amber-500/10 p-4 text-left transition hover:border-amber-300/60 hover:bg-amber-500/15"
              >
                <CalendarDays className="mb-3 h-5 w-5 text-amber-200" />
                <div className="font-display text-sm font-bold text-white">Sinkronisasi Jadwal</div>
                <div className="mt-1 text-xs text-slate-300">Atur pengingat ke Gemini pada Google Calendar</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {isReferencePopupOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-3 backdrop-blur-sm"
          onClick={() => setIsReferencePopupOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Referensi Kamus"
        >
          <div
            className="w-full max-w-md rounded-2xl border border-emerald-400/30 bg-black p-5 shadow-[0_0_34px_rgba(16,185,129,0.22)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-xl font-bold text-white">Alat Tempur</h3>
                <p className="mt-1 text-xs text-slate-400">Kamus rujukan untuk cek bunyi, arti, dan contoh kalimat.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsReferencePopupOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white"
                aria-label="Close Referensi"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              {DICTIONARY_LINKS.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-xl border border-slate-700/70 bg-slate-900/70 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-emerald-300/60 hover:bg-emerald-500/10"
                >
                  {item.name}
                  <ExternalLink className="h-4 w-4 text-emerald-200" />
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {isCalendarPromptOpen && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 p-3 backdrop-blur-sm"
          onClick={() => setIsCalendarPromptOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Prompt Gemini Google Calendar"
        >
          <div
            className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-amber-400/30 bg-black p-4 shadow-[0_0_34px_rgba(245,158,11,0.22)] sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-xl font-bold text-white sm:text-2xl">
                  Prompt Gemini untuk Google Calendar
                </h3>
                <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                  Atur jadwal pronunciation, lalu salin prompt ke Gemini.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCalendarPromptOpen(false)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-white/10 hover:text-white"
                aria-label="Close Prompt Calendar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
              <div className="space-y-4 rounded-xl border border-slate-700/70 bg-slate-950/70 p-4">
                <label className="block text-xs font-semibold uppercase tracking-widest text-amber-200">
                  Tanggal mulai
                  <input
                    type="date"
                    value={calendarStartDate}
                    onChange={(event) => setCalendarStartDate(event.target.value)}
                    className="mt-2 w-full rounded-lg border border-slate-700 bg-black px-3 py-2 text-sm text-white outline-none focus:border-amber-300"
                  />
                </label>

                <div>
                  <div className="mb-2 text-xs font-semibold uppercase tracking-widest text-amber-200">
                    Pilih hari
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {DAY_OPTIONS.map((day) => (
                      <label
                        key={day.value}
                        className="flex items-center gap-2 rounded-lg border border-slate-700 bg-black/60 px-3 py-2 text-xs text-slate-200"
                      >
                        <input
                          type="checkbox"
                          checked={selectedCalendarDays.includes(day.value)}
                          onChange={() => toggleCalendarDay(day.value)}
                          className="h-4 w-4 accent-amber-300"
                        />
                        {day.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <label className="block text-xs font-semibold uppercase tracking-widest text-amber-200">
                    Mulai
                    <input
                      type="time"
                      value={calendarStartTime}
                      onChange={(event) => setCalendarStartTime(event.target.value)}
                      className="mt-2 w-full rounded-lg border border-slate-700 bg-black px-3 py-2 text-sm text-white outline-none focus:border-amber-300"
                    />
                  </label>
                  <label className="block text-xs font-semibold uppercase tracking-widest text-amber-200">
                    Selesai
                    <input
                      type="time"
                      value={calendarEndTime}
                      onChange={(event) => setCalendarEndTime(event.target.value)}
                      className="mt-2 w-full rounded-lg border border-slate-700 bg-black px-3 py-2 text-sm text-white outline-none focus:border-amber-300"
                    />
                  </label>
                </div>

                <label className="block text-xs font-semibold uppercase tracking-widest text-amber-200">
                  Notif sebelum waktu
                  <input
                    type="number"
                    min="0"
                    value={calendarNotificationMinutes}
                    onChange={(event) => setCalendarNotificationMinutes(event.target.value)}
                    className="mt-2 w-full rounded-lg border border-slate-700 bg-black px-3 py-2 text-sm text-white outline-none focus:border-amber-300"
                  />
                </label>
              </div>

              <div className="space-y-3">
                <textarea
                  readOnly
                  value={calendarPrompt}
                  className="min-h-[420px] w-full resize-y rounded-xl border border-slate-700 bg-slate-950 p-4 font-mono text-xs leading-relaxed text-slate-100 outline-none"
                  aria-label="Prompt Google Calendar"
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleCopyCalendarPrompt}
                    className="inline-flex items-center gap-2 rounded-lg bg-amber-300 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-200"
                  >
                    <Copy className="h-4 w-4" />
                    {hasCopiedCalendarPrompt ? 'Tersalin' : 'Salin Prompt'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {plan && (
        <div className="animate-fade-in space-y-6">
          <div className="dashboard-widget-card p-4 sm:p-5 md:p-6">
            <div className="mb-2">
              <div className="text-[11px] sm:text-xs font-mono text-slate-400 uppercase tracking-widest">Mission:</div>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 to-sky-400">
                {plan.title.replace(/^Mission:\s*/i, '')}
              </h3>
            </div>
            <p className="text-slate-300 italic border-l-2 border-cyan-300/80 pl-3 sm:pl-4 py-1 font-mono text-xs sm:text-sm">
              &ldquo;{plan.motivation}&rdquo;
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {plan.steps.map((_: string, index: number) => (
              <div 
                key={index} 
                className="dashboard-widget-card dashboard-widget-card--interactive p-4 sm:p-5 md:p-6 relative overflow-hidden text-center"
              >
                <div className={`flex justify-center mb-2 sm:mb-3 transition-opacity duration-300 ${
                  activePhases.has(index) ? 'opacity-100' : 'opacity-20'
                }`}>
                  <Zap 
                    className={`w-10 h-10 sm:w-12 sm:h-12 transition-all duration-300 ${
                      activePhases.has(index) 
                        ? 'text-cyan-200 drop-shadow-[0_0_16px_rgba(34,211,238,0.82)]' 
                        : 'text-cyan-500'
                    }`} 
                  />
                </div>
                <div className="flex items-center justify-center gap-3 mb-3 sm:mb-4">
                  <h4 className="font-semibold text-cyan-100 font-display text-sm sm:text-base">Phase {index + 1}</h4>
                </div>
                <p className="text-slate-400 leading-relaxed text-xs sm:text-sm">
                  {index === 0 ? (
                    <button
                      type="button"
                      onClick={() => setIsPronunciationRoadmapOpen(true)}
                      className="font-semibold text-cyan-200 underline underline-offset-4 decoration-cyan-400/80 hover:text-cyan-100 transition-colors"
                    >
                      Bangun Fondasi
                    </button>
                  ) : index === 1 ? (
                    <button
                      type="button"
                      onClick={() => setIsPhaseTwoPopupOpen(true)}
                      data-tour="dashboard-phase-2-focused-practice"
                      className="font-semibold text-cyan-200 underline underline-offset-4 decoration-cyan-400/80 hover:text-cyan-100 transition-colors"
                    >
                      Latihan Terarah
                    </button>
                  ) : index === 2 ? "Optimalkan Hasil" : "Capai kefasihan bahasa Inggris"}
                </p>
                <button
                  type="button"
                  className={`mt-4 inline-flex w-full items-center justify-center rounded-full border px-3 py-1.5 text-[11px] sm:text-xs font-display transition-all ${
                    activePhases.has(index)
                      ? 'border-cyan-400/50 bg-cyan-500/10 text-cyan-200 shadow-[0_0_16px_rgba(34,211,238,0.28)]'
                      : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:border-cyan-300/60 hover:bg-cyan-500/20 hover:text-cyan-100'
                  }`}
                  onClick={() => handlePhaseClick(index)}
                  data-tour={`dashboard-ready-phase-${index + 1}`}
                  data-ready-active={activePhases.has(index) ? 'true' : 'false'}
                  aria-pressed={activePhases.has(index)}
                >
                  <span className="uppercase tracking-wide">Ready?</span>
                </button>
              </div>
            ))}
          </div>

          {/* Initiate Button */}
          <div className="flex justify-center">
            <button
              onClick={handleInitiate}
              disabled={initiating || activePhases.size < 3}
              data-tour="dashboard-initiate-training"
              className="bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 disabled:from-slate-700 disabled:to-slate-600 disabled:cursor-not-allowed text-slate-950 disabled:text-slate-400 px-8 sm:px-10 md:px-12 py-3 sm:py-3.5 md:py-4 rounded-xl font-display font-bold flex items-center justify-center gap-3 transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transform hover:scale-105 disabled:scale-100 disabled:shadow-none text-sm sm:text-base"
            >
              {initiating ? <Loader className="animate-spin w-5 h-5 sm:w-6 sm:h-6" /> : <Play className="w-5 h-5 sm:w-6 sm:h-6" />}
              <span>{initiating ? 'INITIATING...' : 'INITIATE TRAINING'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default StartJourney
