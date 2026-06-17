'use client'

import React, { useState, useEffect } from 'react'
import { Cpu, Lock, Star, Trophy, Crown, Edit3, X } from 'lucide-react'
import Image from 'next/image'
import { saveDashboardView } from '../../dashboardView'
import { useAuth } from '@/contexts/MemberAuthContext'

type AchievementCode = 'A' | 'LV' | 'TV' | 'D' | 'VlC' | 'VC' | 'S' | 'I' | 'FS' | 'AT' | 'LW' | 'C'

type AchievementItem = {
  code: AchievementCode
  label: string
  border: string
  glow: string
  core: string
  glowColor: string
}

type AchievementProgressMap = Record<AchievementCode, number>

const ACHIEVEMENT_ITEMS: AchievementItem[] = [
  { code: 'A', label: 'Alphabet', border: 'border-blue-500/40', glow: 'shadow-blue-500/40', core: 'from-blue-600 to-blue-400', glowColor: '59, 130, 246' },
  
  // === 5 VARIASI WARNA UNGU BERBEDA UNTUK VOWEL & CONSONANT ===
  { code: 'LV', label: 'Lax Vowel', border: 'border-violet-500/40', glow: 'shadow-violet-500/40', core: 'from-violet-600 to-violet-400', glowColor: '139, 92, 246' },
  { code: 'TV', label: 'Tense Vowel', border: 'border-fuchsia-500/40', glow: 'shadow-fuchsia-500/40', core: 'from-fuchsia-600 to-fuchsia-400', glowColor: '217, 70, 239' },
  { code: 'D', label: 'Diphthong', border: 'border-purple-500/40', glow: 'shadow-purple-500/40', core: 'from-purple-600 to-purple-400', glowColor: '168, 85, 247' },
  { code: 'VlC', label: 'Voiceless Consonant', border: 'border-purple-600/40', glow: 'shadow-purple-600/40', core: 'from-purple-700 to-purple-500', glowColor: '147, 51, 234' },
  { code: 'VC', label: 'Voiced Consonant', border: 'border-purple-800/40', glow: 'shadow-purple-800/40', core: 'from-purple-900 to-purple-700', glowColor: '107, 33, 168' },
  
  { code: 'S', label: 'Stressing', border: 'border-orange-500/40', glow: 'shadow-orange-500/40', core: 'from-orange-600 to-orange-400', glowColor: '249, 115, 22' },
  { code: 'I', label: 'Intonation', border: 'border-pink-500/40', glow: 'shadow-pink-500/40', core: 'from-pink-600 to-pink-400', glowColor: '236, 72, 153' },
  { code: 'FS', label: 'Final Sound', border: 'border-lime-400/40', glow: 'shadow-lime-400/40', core: 'from-lime-500 to-lime-400', glowColor: '163, 230, 53' },
  { code: 'AT', label: 'American T', border: 'border-[#0b4aa6]/40', glow: 'shadow-blue-500/40', core: 'from-[#0b4aa6] to-[#6fb7ff]', glowColor: '11, 74, 166' },
  { code: 'LW', label: 'Linking Word', border: 'border-cyan-500/40', glow: 'shadow-cyan-500/40', core: 'from-cyan-600 to-cyan-400', glowColor: '6, 182, 212' },
  { code: 'C', label: 'Contraction', border: 'border-cyan-400/40', glow: 'shadow-cyan-400/40', core: 'from-cyan-500 to-cyan-300', glowColor: '34, 211, 238' },
]

const UNLOCK_THRESHOLD = 80
const PRONUNCIATION_ROADMAP_CHECKLIST_KEY = 'dashboard-pronunciation-roadmap-checklist-v1'

const PHONETIC_SYMBOL_GROUPS = [
  {
    id: 'vowel-lax',
    symbols: ['\u028c', '\u026a', '\u028a', '\u025b', '\u0259', '\u025a'],
  },
  {
    id: 'vowel-tense',
    symbols: ['\u0251', 'i', 'u', '\u00e6', '\u0254'],
  },
  {
    id: 'diphthong',
    symbols: ['a\u026a', 'e\u026a', '\u0254\u026a', '\u026a\u0259', 'e\u0259', '\u028a\u0259', 'o\u028a', 'a\u028a'],
  },
  {
    id: 'consonant-voiceless',
    symbols: ['p', 't', 'k', 'f', '\u03b8', 's', '\u0283', '\u02a7', 'h'],
  },
  {
    id: 'consonant-voiced',
    symbols: ['b', 'd', 'g', 'v', '\u00f0', 'z', '\u0292', '\u02a4', 'l', 'm', 'n', '\u014b', 'r', 'w', 'y'],
  },
]

const PHONETIC_SYMBOL_CANONICAL_LABELS: Record<string, string> = {
  'ɪə': 'ɪr',
  'iə': 'ɪr',
  'eə': 'ɛr',
  'er': 'ɛr',
  'ʊə': 'ʊr',
}

const toPercent = (value: unknown): number => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 0
  return Math.min(100, Math.max(0, Math.round(value)))
}

const getPhoneticSymbolProgressKey = (symbol: string) =>
  `phoneticSymbols_${PHONETIC_SYMBOL_CANONICAL_LABELS[symbol] ?? symbol}`

const getPhoneticSymbolProgress = (topicProgress: Record<string, number>, symbol: string) =>
  toPercent(topicProgress[getPhoneticSymbolProgressKey(symbol)] ?? topicProgress[`phoneticSymbols_${symbol}`] ?? 0)

const AchievementsContent = () => {
  const { user } = useAuth()
  const cpuPins = Array.from({ length: 6 });

  const getAvatarPositionStyle = (url: string) => {
    if (url.includes('boss')) return { objectPosition: 'center 18%' }
    if (url.includes('pro')) return { objectPosition: 'center top' }
    return { objectPosition: 'center' }
  }

  const getTierInfo = (tier: string) => {
    switch (tier) {
      case 'Awalan':
        return {
          icon: Star,
          avatarImage: '/photProfile/starter.webp',
          avatarGradient: 'from-slate-700 to-slate-800',
          badgeBg: 'bg-slate-700/20',
          badgeBorder: 'border-slate-700/30',
          badgeText: 'text-slate-300'
        }
      case 'Rookie':
        return {
          icon: Star,
          avatarImage: '/photProfile/rookie.webp',
          avatarGradient: 'from-green-600 to-emerald-500',
          badgeBg: 'bg-green-500/20',
          badgeBorder: 'border-green-500/30',
          badgeText: 'text-green-300'
        }
      case 'Pro':
        return {
          icon: Trophy,
          avatarImage: '/photProfile/pro.webp',
          avatarGradient: 'from-purple-600 to-pink-500',
          badgeBg: 'bg-purple-500/20',
          badgeBorder: 'border-purple-500/30',
          badgeText: 'text-purple-300'
        }
      case 'Legend':
        return {
          icon: Crown,
          avatarImage: '/photProfile/legend.webp',
          avatarGradient: 'from-amber-600 to-orange-500',
          badgeBg: 'bg-amber-500/20',
          badgeBorder: 'border-amber-500/30',
          badgeText: 'text-amber-300'
        }
      case 'Boss':
        return {
          icon: Crown,
          avatarImage: '/photProfile/boss.webp',
          avatarGradient: 'from-rose-500 to-fuchsia-500',
          badgeBg: 'bg-rose-500/20',
          badgeBorder: 'border-rose-500/30',
          badgeText: 'text-rose-300'
        }
      default:
        return {
          icon: Star,
          avatarImage: '/photProfile/starter.webp',
          avatarGradient: 'from-slate-700 to-slate-800',
          badgeBg: 'bg-slate-700/20',
          badgeBorder: 'border-slate-700/30',
          badgeText: 'text-slate-300'
        }
    }
  }

  const readLocalStorageObject = <T,>(key: string, fallback: T): T => {
    try {
      const raw = window.localStorage.getItem(key)
      if (!raw) return fallback
      return JSON.parse(raw) as T
    } catch {
      return fallback
    }
  }

  type AvatarTier = 'Awalan' | 'Rookie' | 'Pro' | 'Legend' | 'Boss'

  const AVATAR_OPTIONS: { tier: AvatarTier; label: string; image: string }[] = [
    { tier: 'Awalan', label: 'Awalan', image: '/photProfile/starter.webp' },
    { tier: 'Rookie', label: 'Rookie', image: '/photProfile/rookie.webp' },
    { tier: 'Pro', label: 'Pro', image: '/photProfile/pro.webp' },
    { tier: 'Legend', label: 'Legend', image: '/photProfile/legend.webp' },
    { tier: 'Boss', label: 'Boss', image: '/photProfile/boss.webp' },
  ]

  const tierRank: Record<AvatarTier, number> = {
    Awalan: 0,
    Rookie: 1,
    Pro: 2,
    Legend: 3,
    Boss: 4,
  }

  const readSavedAssessmentPercent = (
    savedAssessments: Record<string, { percentage?: unknown }>,
    topicName: string,
  ): number => toPercent(savedAssessments[topicName]?.percentage)

  const getPhoneticCategoryAverage = (
    topicProgress: Record<string, number>,
    groupIds: string[],
  ) => {
    const progressValues = PHONETIC_SYMBOL_GROUPS.filter((group) => groupIds.includes(group.id))
      .flatMap((group) => group.symbols)
      .map((symbol) => getPhoneticSymbolProgress(topicProgress, symbol))

    return progressValues.length
      ? Math.round(progressValues.reduce((sum, value) => sum + value, 0) / progressValues.length)
      : 0
  }

  const achievementProgress: AchievementProgressMap = (() => {
    const topicProgress = readLocalStorageObject<Record<string, number>>('pronunciationProgress', {})
    const savedAssessments = readLocalStorageObject<Record<string, { percentage?: unknown }>>(
      'savedAssessments',
      {},
    )
    const lessonChecklist = readLocalStorageObject<Record<string, boolean>>(
      PRONUNCIATION_ROADMAP_CHECKLIST_KEY,
      {},
    )

    const isLessonTopicDone = (topicId: string) => lessonChecklist[topicId] === true

    const alphabetPractice = topicProgress['alphabet'] || 0
    const alphabetLesson = isLessonTopicDone('alphabet') ? 100 : 0
    const alphabetProgress = Math.round((alphabetPractice + alphabetLesson) / 2)

    const stressingWordProgress =
      toPercent(topicProgress['stressingWord']) || readSavedAssessmentPercent(savedAssessments, 'Word Stress')
    const stressingSentenceProgress =
      toPercent(topicProgress['stressingSentence']) || readSavedAssessmentPercent(savedAssessments, 'Sentence Stress')
    const stressingProgress = Math.round((stressingWordProgress + stressingSentenceProgress) / 2)

    const intonationProgress = topicProgress['intonation'] || 0

    const finalSoundSEsProgress =
      toPercent(topicProgress['finalSoundSEs']) ||
      readSavedAssessmentPercent(savedAssessments, 'Final Sound S/ES')
    const finalSoundDEdProgress =
      toPercent(topicProgress['finalSoundDEd']) ||
      readSavedAssessmentPercent(savedAssessments, 'Final Sound D/ED')
    const finalSoundProgress = Math.round((finalSoundSEsProgress + finalSoundDEdProgress) / 2)

    const AMERICAN_T_PROGRESS_KEYS = [
      { key: 'americanTReleasedBeginning', assessment: 'Released /t/ Beginning' },
      { key: 'americanTFlap', assessment: 'Flap T' },
      { key: 'americanTGlottalStop', assessment: 'Glottal Stop' },
      { key: 'americanTSilent', assessment: 'Silent /t/' },
      { key: 'americanTReleasedEnding', assessment: 'Released /t/ Ending' },
      { key: 'americanTFinalTBeforeConsonant', assessment: 'Final T Before Consonant' },
    ]

    const americanTValues = AMERICAN_T_PROGRESS_KEYS.map(({ key, assessment }) =>
      toPercent(topicProgress[key]) || readSavedAssessmentPercent(savedAssessments, assessment),
    )
    const americanTProgress = americanTValues.length
      ? Math.round(americanTValues.reduce((sum, value) => sum + value, 0) / americanTValues.length)
      : 0

    const linkingWordProgress = topicProgress['linkingWord'] || 0
    const contractionProgress = topicProgress['contraction'] || 0

    return {
      A: alphabetProgress,
      LV: getPhoneticCategoryAverage(topicProgress, ['vowel-lax']),
      TV: getPhoneticCategoryAverage(topicProgress, ['vowel-tense']),
      D: getPhoneticCategoryAverage(topicProgress, ['diphthong']),
      VlC: getPhoneticCategoryAverage(topicProgress, ['consonant-voiceless']),
      VC: getPhoneticCategoryAverage(topicProgress, ['consonant-voiced']),
      S: stressingProgress,
      I: intonationProgress,
      FS: finalSoundProgress,
      AT: americanTProgress,
      LW: linkingWordProgress,
      C: contractionProgress,
    }
  })()

  const openProgressView = () => {
    saveDashboardView('progress')
    window.dispatchEvent(
      new CustomEvent('geuwat:dashboard-view', {
        detail: { viewId: 'progress' },
      }),
    )
  }

  const allCpusUnlocked = Object.values(achievementProgress).every((progress) => progress >= UNLOCK_THRESHOLD)

  const PHONETIC_CORE_CODES: AchievementCode[] = ['LV', 'TV', 'D', 'VlC', 'VC']

  const getOverallPronunciationProgress = () => {
    const topicProgress = readLocalStorageObject<Record<string, number>>('pronunciationProgress', {})
    const lessonChecklist = readLocalStorageObject<Record<string, boolean>>(
      PRONUNCIATION_ROADMAP_CHECKLIST_KEY,
      {},
    )
    const alphabet = topicProgress['alphabet'] || 0
    const phonetic = getPhoneticCategoryAverage(topicProgress, ['vowel-lax', 'vowel-tense', 'diphthong', 'consonant-voiceless', 'consonant-voiced'])
    const stressing = Math.round(((toPercent(topicProgress['stressingWord']) || 0) + (toPercent(topicProgress['stressingSentence']) || 0)) / 2)
    const intonation = topicProgress['intonation'] || 0
    const finalSound = Math.round(((toPercent(topicProgress['finalSoundSEs']) || 0) + (toPercent(topicProgress['finalSoundDEd']) || 0)) / 2)
    const americanT = (() => {
      const AMERICAN_T_PROGRESS_KEYS = [
        'americanTReleasedBeginning',
        'americanTFlap',
        'americanTGlottalStop',
        'americanTSilent',
        'americanTReleasedEnding',
        'americanTFinalTBeforeConsonant',
      ]
      const vals = AMERICAN_T_PROGRESS_KEYS.map((k) => toPercent(topicProgress[k] as unknown))
      return vals.length ? Math.round(vals.reduce((s, v) => s + v, 0) / vals.length) : 0
    })()
    const linking = topicProgress['linkingWord'] || 0
    const contraction = topicProgress['contraction'] || 0
    // Text Practice, Reading Text, Tongue Twister come from lesson checkbox only
    const textPractice = lessonChecklist['text-practice'] ? 100 : 0
    const readingText = lessonChecklist['reading-text'] ? 100 : 0
    const tongue = lessonChecklist['tongue-twister'] ? 100 : 0

    const roadmap = [alphabet, phonetic, stressing, intonation, finalSound, americanT, linking, contraction, textPractice, readingText, tongue]
    return roadmap.length ? Math.round(roadmap.reduce((s, v) => s + v, 0) / roadmap.length) : 0
  }

  const progressPronunciationAverage = getOverallPronunciationProgress()
  const alphabetUnlocked = achievementProgress.A >= UNLOCK_THRESHOLD
  const phoneticCoreUnlocked = PHONETIC_CORE_CODES.every(
    (code) => achievementProgress[code] >= UNLOCK_THRESHOLD,
  )
  const currentTierName = progressPronunciationAverage >= 100
    ? 'Boss'
    : allCpusUnlocked
    ? 'Legend'
    : phoneticCoreUnlocked
    ? 'Pro'
    : alphabetUnlocked
    ? 'Rookie'
    : 'Awalan'

  const currentTierInfo = getTierInfo(currentTierName)
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(() => {
    try {
      return window.localStorage.getItem('dashboard-avatar-selected') || null
    } catch {
      return null
    }
  })
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)

  const currentAvatarImage = selectedAvatar || currentTierInfo.avatarImage

  const isAvatarUnlocked = (tier: AvatarTier) => tierRank[tier] <= tierRank[currentTierName as AvatarTier]

  const setAvatarSelection = (image: string) => {
    try {
      window.localStorage.setItem('dashboard-avatar-selected', image)
    } catch {
      // ignore storage failures
    }

    window.dispatchEvent(
      new CustomEvent('geuwat:dashboard-avatar-selected', {
        detail: image,
      }),
    )
    setSelectedAvatar(image)
    setIsAvatarModalOpen(false)
  }

  const TierIcon = currentTierInfo.icon

  useEffect(() => {
    try {
      window.dispatchEvent(
        new CustomEvent('geuwat:pronunciation-tier', {
          detail: currentTierName,
        }),
      )
    } catch {
      // ignore
    }
  }, [currentTierName])

  useEffect(() => {
    const onRequest = () => {
      try {
        window.dispatchEvent(
          new CustomEvent('geuwat:pronunciation-tier', {
            detail: currentTierName,
          }),
        )
      } catch {
        // ignore
      }
    }

    window.addEventListener('geuwat:request-pronunciation-tier', onRequest)
    return () => window.removeEventListener('geuwat:request-pronunciation-tier', onRequest)
  }, [currentTierName])

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto py-8 px-4 sm:px-6 animate-fade-in">
      {/* Left Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-slate-950/75 border border-white/10 rounded-[2rem] p-6 shadow-[0_0_50px_rgba(124,58,237,0.18)] backdrop-blur-2xl sticky top-8">
          {/* User Profile Section */}
          <div className="flex flex-col items-center text-center gap-4 border-b border-purple-900/30 pb-6">
            <div className={`relative w-16 h-16 rounded-full bg-gradient-to-tr ${currentTierInfo.avatarGradient} p-[2px]`}>
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden relative">
                {currentAvatarImage ? (
                  <Image 
                    src={currentAvatarImage} 
                    alt={currentTierName || 'avatar'} 
                    fill
                    unoptimized // <-- Menjaga warna & cahaya asli file mentahan
                    className="rounded-full object-cover" 
                    style={getAvatarPositionStyle(currentAvatarImage)}
                  />
                ) : (
                  <TierIcon className="w-8 h-8 text-white" />
                )}
              </div>
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(true)}
                className="absolute -bottom-1 -right-1 bg-cyan-600/90 hover:bg-cyan-500 text-white w-7 h-7 rounded-full flex items-center justify-center border border-white/10 shadow-md z-10"
                aria-label="Open avatar selection"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            </div>
            <div>
              <h2 className="font-display font-bold text-sm text-white truncate max-w-[180px]">
                {user?.fullname || user?.email?.split('@')[0] || 'Guest User'}
              </h2>
              <p className="text-[10px] text-slate-400 truncate max-w-[180px] font-mono mt-1">
                {user?.email || 'guest@example.com'}
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full ${currentTierInfo.badgeBg} border ${currentTierInfo.badgeBorder} text-[10px] ${currentTierInfo.badgeText} font-bold uppercase tracking-wider font-display flex items-center gap-1.5`}>
              <TierIcon className="w-3.5 h-3.5" />
              {currentTierName}
            </span>
          </div>

          {/* Achievement Info Section */}
          <div className="mt-6 space-y-6">
            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-[0.2em] text-cyan-200 font-semibold">Pronunciation</h3>
              <h2 className="text-lg font-display font-bold text-white">CPU Achievement</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Selesaikan misi untuk mengaktifkan
              </p>
            </div>

            <div className="bg-gradient-to-br from-cyan-600/20 to-purple-600/20 border border-cyan-500/30 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Completed</span>
                <span className="text-lg font-bold text-cyan-300">
                  {Object.values(achievementProgress).filter(p => p >= UNLOCK_THRESHOLD).length}/12
                </span>
              </div>
              <div className="w-full bg-slate-800/50 rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-500"
                  style={{ 
                    width: `${(Object.values(achievementProgress).filter(p => p >= UNLOCK_THRESHOLD).length / 12) * 100}%`
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {isAvatarModalOpen && (
        <div className="fixed inset-0 z-[1500] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-3xl rounded-[2rem] bg-slate-950/95 border border-white/10 p-6 shadow-[0_0_50px_rgba(0,0,0,0.65)]">
            <button
              type="button"
              onClick={() => setIsAvatarModalOpen(false)}
              className="absolute top-4 right-4 text-slate-300 hover:text-white"
              aria-label="Close avatar selection"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mb-4 text-center">
              <h2 className="text-xl font-display font-bold text-white">Pilih Avatar</h2>
              <p className="text-sm text-slate-400 mt-1">
                Pilih avatar yang sudah kamu unlock sesuai tier. Avatar yang belum memenuhi syarat akan terkunci.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {AVATAR_OPTIONS.map((option) => {
                const unlocked = isAvatarUnlocked(option.tier)
                const isSelected = currentAvatarImage === option.image
                return (
                  <button
                    key={option.tier}
                    type="button"
                    disabled={!unlocked}
                    onClick={() => unlocked && setAvatarSelection(option.image)}
                    className={`relative rounded-3xl border p-3 transition-all duration-200 text-left ${unlocked ? 'border-cyan-500/30 bg-slate-900/90 hover:border-cyan-400/50 hover:bg-slate-800' : 'border-slate-700/60 bg-slate-950/80 cursor-not-allowed'}`}
                  >
                    <div className={`relative h-24 rounded-2xl overflow-hidden bg-slate-900 ${!unlocked ? 'brightness-0' : ''}`}>
                      <Image
                        src={option.image}
                        alt={option.label}
                        fill
                        unoptimized
                        className="object-cover"
                        style={getAvatarPositionStyle(option.image)}
                      />
                    </div>
                            <div className="mt-3 flex items-center justify-between gap-2">
                        <div>
                          <p className={`text-sm font-semibold ${unlocked ? 'text-white' : 'text-slate-500'}`}>{option.label}</p>
                        </div>
                        {isSelected && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/20 px-2 py-1 text-[10px] text-cyan-300">
                          Selected
                        </span>
                      )}
                    </div>
                    {!unlocked && (
                      <div className="absolute inset-0 rounded-3xl bg-black/40 flex items-center justify-center text-slate-400">
                        <Lock className="w-5 h-5" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Right Content Area */}
      <div className="lg:col-span-3">
        <div className="bg-slate-950/75 border border-white/10 rounded-[2rem] p-6 sm:p-10 shadow-[0_0_50px_rgba(124,58,237,0.18)] backdrop-blur-2xl">
          
          {/* Header Area */}
          <div className="flex flex-col items-center text-center gap-6 mb-12">
            <div className={`flex items-center justify-center w-28 h-28 sm:w-32 sm:h-32 rounded-[2rem] transition-all duration-500 ${allCpusUnlocked ? 'bg-gradient-to-br from-purple-600 via-fuchsia-600 to-cyan-500 shadow-[0_0_30px_rgba(124,58,237,0.35)]' : 'bg-slate-800 shadow-[0_0_20px_rgba(30,41,59,0.4)]'}`}>
              <Cpu className={`w-16 h-16 ${allCpusUnlocked ? 'text-white' : 'text-slate-600'}`} />
            </div>

            <div className="space-y-3">
              <p className="text-xs sm:text-sm uppercase tracking-[0.35em] text-cyan-200 font-semibold">CPU Pronunciation</p>
              <h1 className="text-2xl sm:text-3xl font-display font-bold text-white">Achievement Board</h1>
              <p className="max-w-2xl mx-auto text-sm text-slate-400">
                Unlock all CPUs to master pronunciation
              </p>
            </div>
          </div>

          {/* Grid Container Utama */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-8 justify-items-center">
            {ACHIEVEMENT_ITEMS.map((item) => {
              const progressValue = achievementProgress[item.code] ?? 0
              const isUnlocked = progressValue >= UNLOCK_THRESHOLD
              const displayLabel = isUnlocked ? '' : `Unlock at ${UNLOCK_THRESHOLD}% progress`
              const chipStyle = isUnlocked
                ? ({ '--rgb-neon': item.glowColor } as React.CSSProperties)
                : ({ '--rgb-neon': '148, 163, 184' } as React.CSSProperties)
              const chipBorderClass = isUnlocked ? item.border : 'border-slate-700/60'
              const chipInnerClass = isUnlocked
                ? `w-11 h-11 rounded-lg bg-gradient-to-br ${item.core} ${item.glow} shadow-[0_0_15px_var(--tw-shadow-color)] animate-pulse flex items-center justify-center text-white text-base font-mono font-black tracking-tighter`
                : 'w-11 h-11 rounded-lg bg-slate-700 shadow-none flex items-center justify-center text-slate-300 text-base font-mono font-black tracking-tighter'

              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={openProgressView}
                  className={`relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center group transition-all duration-300 hover:scale-105 focus:outline-none ${isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'} `}
                  style={chipStyle}
                >
                  {!isUnlocked && (
                    <div className="absolute inset-0 rounded-3xl bg-slate-950/80 z-20 flex items-center justify-center pointer-events-none">
                      <Lock className="w-6 h-6 text-slate-200" />
                    </div>
                  )}

                  {/* === KAKI-KAKI PIN PROSESOR === */}
                  <div className="absolute -top-3 left-6 right-6 flex justify-between px-1 h-3 w-[calc(100%-48px)]">
                    {cpuPins.map((_, i) => (
                      <div key={`top-${i}`} className="w-1.5 h-full bg-gradient-to-t from-slate-600 to-[rgba(var(--rgb-neon),0.25)] rounded-t-sm border-x border-t border-white/5 transition-all duration-300 group-hover:to-[rgba(var(--rgb-neon),0.9)]" />
                    ))}
                  </div>

                  <div className="absolute -bottom-3 left-6 right-6 flex justify-between px-1 h-3 w-[calc(100%-48px)]">
                    {cpuPins.map((_, i) => (
                      <div key={`bottom-${i}`} className="w-1.5 h-full bg-gradient-to-b from-slate-600 to-[rgba(var(--rgb-neon),0.25)] rounded-b-sm border-x border-b border-white/5 transition-all duration-300 group-hover:to-[rgba(var(--rgb-neon),0.9)]" />
                    ))}
                  </div>

                  <div className="absolute -left-3 top-6 bottom-6 flex flex-col justify-between py-1 w-3 h-[calc(100%-48px)]">
                    {cpuPins.map((_, i) => (
                      <div key={`left-${i}`} className="h-1.5 w-full bg-gradient-to-l from-slate-600 to-[rgba(var(--rgb-neon),0.25)] rounded-l-sm border-y border-l border-white/5 transition-all duration-300 group-hover:to-[rgba(var(--rgb-neon),0.9)]" />
                    ))}
                  </div>

                  <div className="absolute -right-3 top-6 bottom-6 flex flex-col justify-between py-1 w-3 h-[calc(100%-48px)]">
                    {cpuPins.map((_, i) => (
                      <div key={`right-${i}`} className="h-1.5 w-full bg-gradient-to-r from-slate-600 to-[rgba(var(--rgb-neon),0.25)] rounded-r-sm border-y border-r border-white/5 transition-all duration-300 group-hover:to-[rgba(var(--rgb-neon),0.9)]" />
                    ))}
                  </div>

                  {/* === KOTAK BODI UTAMA CPU === */}
                  <div 
                    className="absolute inset-0 bg-gradient-to-br from-slate-900 to-neutral-950 rounded-2xl flex flex-col items-center justify-between p-3.5 z-10 overflow-hidden transition-all duration-300"
                    style={{
                      border: '1px solid rgba(var(--rgb-neon), 0.25)',
                      boxShadow: '0 0 15px rgba(var(--rgb-neon), 0.15), inset 0 0 10px rgba(var(--rgb-neon), 0.05)',
                    }}
                    onMouseEnter={(e) => {
                      if (!isUnlocked) return
                      e.currentTarget.style.border = '1px solid rgba(var(--rgb-neon), 0.6)';
                      e.currentTarget.style.boxShadow = '0 0 30px rgba(var(--rgb-neon), 0.55), inset 0 0 15px rgba(var(--rgb-neon), 0.2)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isUnlocked) return
                      e.currentTarget.style.border = '1px solid rgba(var(--rgb-neon), 0.25)';
                      e.currentTarget.style.boxShadow = '0 0 15px rgba(var(--rgb-neon), 0.15), inset 0 0 10px rgba(var(--rgb-neon), 0.05)';
                    }}
                  >
                    <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-slate-700/50 rounded-tl-xl pointer-events-none" />
                    <div className="absolute top-0 right-0 w-3 h-3 border-r border-t border-slate-700/50 rounded-tr-xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-slate-700/50 rounded-bl-xl pointer-events-none" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-slate-700/50 rounded-br-xl pointer-events-none" />

                    <div className={`relative w-[85%] h-[60%] rounded-xl bg-gradient-to-br from-slate-800 via-slate-850 to-slate-900 border-2 ${chipBorderClass} flex items-center justify-center p-1 transition-all duration-300 ${isUnlocked ? 'group-hover:border-opacity-100' : ''}`}>
                      <div className={chipInnerClass}>
                        {item.code}
                      </div>
                    </div>

                    <div className="w-full text-center z-20 pb-0.5">
                      <span 
                        className="block text-[11px] font-bold truncate px-1 max-w-full leading-tight transition-colors duration-300 group-hover:text-white"
                        style={{ color: isUnlocked ? 'rgba(var(--rgb-neon), 0.85)' : 'rgba(148, 163, 184, 0.7)' }}
                      >
                        {item.label}
                      </span>
                      <span className="block text-[10px] text-slate-400 mt-1" aria-hidden="true">
                        {displayLabel}
                      </span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AchievementsContent