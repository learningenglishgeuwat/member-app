'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/MemberAuthContext'
import { 
  Trophy, 
  BarChart2, 
  Settings, 
  LogOut, 
  Lock,
  CheckCircle,
  HelpCircle,
  Bell,
  Star,
  Crown,
  Compass
} from 'lucide-react'

type AvatarTier = 'Awalan' | 'Rookie' | 'Pro' | 'Legend' | 'Boss'

const UNLOCK_THRESHOLD = 80

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

const toPercent = (value: unknown): number => {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 0
  return Math.min(100, Math.max(0, Math.round(value)))
}

const getPhoneticSymbolProgressKey = (symbol: string) =>
  `phoneticSymbols_${{ 'ɪə': 'ɪr', 'iə': 'ɪr', 'eə': 'ɛr', er: 'ɛr', 'ʊə': 'ʊr' }[symbol] ?? symbol}`

const getPhoneticSymbolProgress = (topicProgress: Record<string, number>, symbol: string) =>
  toPercent(topicProgress[getPhoneticSymbolProgressKey(symbol)] ?? topicProgress[`phoneticSymbols_${symbol}`] ?? 0)


const getPhoneticCategoryAverage = (topicProgress: Record<string, number>, groupIds: string[]) => {
  const progressValues = PHONETIC_SYMBOL_GROUPS.filter((group) => groupIds.includes(group.id))
    .flatMap((group) => group.symbols)
    .map((symbol) => getPhoneticSymbolProgress(topicProgress, symbol))

  return progressValues.length
    ? Math.round(progressValues.reduce((sum, value) => sum + value, 0) / progressValues.length)
    : 0
}

const tierRank: Record<AvatarTier, number> = {
  Awalan: 0,
  Rookie: 1,
  Pro: 2,
  Legend: 3,
  Boss: 4,
}

const getHigherTier = (userTier: AvatarTier | undefined, computedTier: AvatarTier) => {
  if (!userTier) return computedTier
  return tierRank[computedTier] > tierRank[userTier] ? computedTier : userTier
}

const computeTierFromProgress = (topicProgress: Record<string, number>, lessonChecklist: Record<string, boolean>): AvatarTier => {
  // Compute achievement progress (same as AchievementsContent)
  const alphabetPractice = topicProgress['alphabet'] || 0
  const alphabetLesson = lessonChecklist['alphabet'] ? 100 : 0
  const alphabetProgress = Math.round((alphabetPractice + alphabetLesson) / 2)

  const stressingWordProgress = toPercent(topicProgress['stressingWord']) || 0
  const stressingSentenceProgress = toPercent(topicProgress['stressingSentence']) || 0
  const stressingProgress = Math.round((stressingWordProgress + stressingSentenceProgress) / 2)

  const intonationProgress = topicProgress['intonation'] || 0

  const finalSoundSEsProgress = toPercent(topicProgress['finalSoundSEs']) || 0
  const finalSoundDEdProgress = toPercent(topicProgress['finalSoundDEd']) || 0
  const finalSoundProgress = Math.round((finalSoundSEsProgress + finalSoundDEdProgress) / 2)

  const americanTKeys = [
    'americanTReleasedBeginning',
    'americanTFlap',
    'americanTGlottalStop',
    'americanTSilent',
    'americanTReleasedEnding',
    'americanTFinalTBeforeConsonant',
  ]
  const americanTValues = americanTKeys.map((k) => toPercent(topicProgress[k] as unknown))
  const americanTProgress = americanTValues.length ? Math.round(americanTValues.reduce((s, v) => s + v, 0) / americanTValues.length) : 0

  const linkingWordProgress = topicProgress['linkingWord'] || 0
  const contractionProgress = topicProgress['contraction'] || 0

  // Create achievementProgress map (same structure as AchievementsContent)
  const achievementProgress: Record<string, number> = {
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

  // Check if all CPUs unlocked (same as AchievementsContent)
  const allCpusUnlocked = Object.values(achievementProgress).every((progress) => progress >= UNLOCK_THRESHOLD)
  const phoneticCoreUnlocked = [achievementProgress.LV, achievementProgress.TV, achievementProgress.D, achievementProgress.VlC, achievementProgress.VC]
    .every((progress) => progress >= UNLOCK_THRESHOLD)
  const alphabetUnlocked = alphabetProgress >= UNLOCK_THRESHOLD

  // Calculate overall pronunciation average
  const textPractice = lessonChecklist['text-practice'] ? 100 : 0
  const readingText = lessonChecklist['reading-text'] ? 100 : 0
  const tongueTwister = lessonChecklist['tongue-twister'] ? 100 : 0

  const phonetic = getPhoneticCategoryAverage(topicProgress, ['vowel-lax', 'vowel-tense', 'diphthong', 'consonant-voiceless', 'consonant-voiced'])
  const roadmap = [alphabetPractice, phonetic, stressingProgress, intonationProgress, finalSoundProgress, americanTProgress, linkingWordProgress, contractionProgress, textPractice, readingText, tongueTwister]
  const progressPronunciationAverage = roadmap.length ? Math.round(roadmap.reduce((s, v) => s + v, 0) / roadmap.length) : 0

  // Determine tier using same logic as AchievementsContent
  if (progressPronunciationAverage >= 100) return 'Boss'
  if (allCpusUnlocked) return 'Legend'
  if (phoneticCoreUnlocked) return 'Pro'
  if (alphabetUnlocked) return 'Rookie'
  return 'Awalan'
}

interface DashboardSidebarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  currentView: string
  setCurrentView: (view: string) => void
  canAccessStartJourney: boolean
  onStartJourneyBlocked: () => void
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  isOpen,
  setIsOpen,
  currentView,
  setCurrentView,
  canAccessStartJourney,
  onStartJourneyBlocked,
}) => {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null)
  const [computedTier, setComputedTier] = useState<AvatarTier>('Rookie')

  useEffect(() => {
    const loadSelectedAvatar = () => {
      try {
        const stored = window.localStorage.getItem('dashboard-avatar-selected')
        setSelectedAvatar(stored || null)
      } catch {
        setSelectedAvatar(null)
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

    const updateComputedTier = () => {
      const topicProgress = readLocalStorageObject<Record<string, number>>('pronunciationProgress', {})
      const lessonChecklist = readLocalStorageObject<Record<string, boolean>>('dashboard-pronunciation-roadmap-checklist-v1', {})
      setComputedTier(computeTierFromProgress(topicProgress, lessonChecklist))
    }

    const onPronunciationTier = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail as AvatarTier
      if (detail) setComputedTier(detail)
    }

    const handleSelectedAvatar = (event: Event) => {
      const detail = (event as CustomEvent<string>).detail
      setSelectedAvatar(detail || null)
    }

    loadSelectedAvatar()
    updateComputedTier()
    window.addEventListener('geuwat:dashboard-avatar-selected', handleSelectedAvatar)
    window.addEventListener('storage', updateComputedTier)
    window.addEventListener('focus', updateComputedTier)
    window.addEventListener('geuwat:pronunciation-tier', onPronunciationTier)
    // Ask AchievementsContent to respond with current tier (handles mount-order)
    try {
      window.dispatchEvent(new CustomEvent('geuwat:request-pronunciation-tier'))
    } catch {
      // ignore
    }

    return () => {
      window.removeEventListener('geuwat:dashboard-avatar-selected', handleSelectedAvatar)
      window.removeEventListener('storage', updateComputedTier)
      window.removeEventListener('focus', updateComputedTier)
      window.removeEventListener('geuwat:pronunciation-tier', onPronunciationTier)
    }
  }, [])

  // Get tier colors, icon, and avatar image
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

  const displayTier = getHigherTier(user?.tier as AvatarTier | undefined, computedTier)
  const currentTierInfo = getTierInfo(displayTier)
  const TierIcon = currentTierInfo.icon
  const defaultAvatarImage = currentTierInfo.avatarImage

  const getAvatarPositionStyle = (url: string | null) => {
    if (!url) return undefined
    if (url.includes('boss')) return { objectPosition: 'center 18%' }
    if (url.includes('pro')) return { objectPosition: 'center top' }
    return { objectPosition: 'center' }
  }
  
  const menuItems = [
    { id: 'dashboard', label: 'Start Journey', icon: Compass, locked: false },
    { id: 'notifications', label: 'Notifications', icon: Bell, locked: false },
    { id: 'progress', label: 'Progress', icon: BarChart2, locked: false },
    { id: 'achievements', label: 'Achievements', icon: Trophy, locked: false },
    { id: 'settings', label: 'Settings', icon: Settings, locked: false },
    { id: 'device-approve', label: 'Approve Device', icon: CheckCircle, locked: false },
    { id: 'help-support', label: 'Help & Support', icon: HelpCircle, locked: false },
  ]

  const handleLogout = async () => {
    if (isLoggingOut) return
    setIsLoggingOut(true)
    setIsOpen(false)
    router.replace('/login')

    try {
      await signOut()
    } catch (error) {
      console.error('Logout error:', error);
      // Fallback: tetap di halaman login walau signOut network gagal.
    } finally {
      setIsLoggingOut(false)
    }
  }

  const isActive = (path: string) => currentView === path

  return (
    <>
      {/* Overlay - covers entire screen including navbar area */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-md z-[1350] pointer-events-auto"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`
          fixed top-0 left-0 z-[1360] min-h-screen h-[100dvh] w-60 sm:w-64 bg-black/90 border-r border-purple-900/30 backdrop-blur-xl 
          transform transition-transform duration-300 ease-in-out flex flex-col overflow-hidden pb-[calc(env(safe-area-inset-bottom)+16px)]
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo/Header */}
        <div className="p-4 sm:p-6 border-b border-purple-900/30">
          <div className="flex flex-col items-center gap-2">
            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr ${currentTierInfo.avatarGradient} p-[2px]`}>
              <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden relative">
                {(selectedAvatar || defaultAvatarImage) ? (
                  <Image
                    src={selectedAvatar || defaultAvatarImage!}
                    alt={user?.tier || 'avatar'}
                    fill
                    unoptimized
                    className="rounded-full object-cover"
                    style={getAvatarPositionStyle(selectedAvatar || defaultAvatarImage)}
                  />
                ) : (
                  <TierIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                )}
              </div>
            </div>
            <div className="text-center">
              <h1 className="font-display font-bold text-xs sm:text-sm text-white truncate max-w-[180px]">
                {user?.fullname || user?.email?.split('@')[0] || 'Guest User'}
              </h1>
              <p className="text-[9px] sm:text-[10px] text-slate-400 truncate max-w-[180px] font-mono">
                {user?.email || 'guest@example.com'}
              </p>
            </div>
            <div className="mt-2 flex flex-col items-center gap-1">
              <span className={`px-2 py-0.5 rounded-full ${currentTierInfo.badgeBg} border ${currentTierInfo.badgeBorder} text-[9px] sm:text-[10px] ${currentTierInfo.badgeText} font-bold uppercase tracking-wider font-display flex items-center gap-1`}>
                <TierIcon className="w-3 h-3" />
                {displayTier}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-3 sm:p-4 overflow-y-auto pb-6">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isLocked = item.locked;
              return (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      if (isLocked) return;
                      if (item.id === 'dashboard' && !canAccessStartJourney) {
                        onStartJourneyBlocked();
                        setIsOpen(false);
                        return;
                      }
                      setCurrentView(item.id);
                      setIsOpen(false);
                    }}
                    disabled={isLocked}
                    className={`
                      w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-colors duration-200 font-display text-[10px] sm:text-xs
                      focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/60 focus-visible:ring-offset-0
                      ${isLocked
                        ? 'text-slate-500 bg-black/40 border border-slate-800/60 cursor-not-allowed'
                        : isActive(item.id)
                        ? 'bg-cyan-500/25 text-cyan-200 border border-cyan-500/40'
                        : 'text-slate-400 hover:text-white hover:bg-white/10'
                      }
                    `}
                    data-tour={`dashboard-sidebar-item-${item.id}`}
                    aria-disabled={isLocked}
                    aria-current={isActive(item.id) ? 'page' : undefined}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="font-medium">{item.label}</span>
                    {isLocked ? (
                      <span className="ml-auto inline-flex items-center gap-1 rounded-full border border-slate-700/70 bg-slate-800/70 px-2 py-0.5 text-[10px] uppercase tracking-wide text-slate-300">
                        <Lock className="h-3 w-3" />
                        Locked
                      </span>
                    ) : isActive(item.id) && (
                      <div className="w-2 h-2 bg-cyan-400 rounded-full ml-auto"></div>
                    )}
                  </button>
                </li>
              );
            })}

            {/* Logout (placed under Settings) */}
            <li>
              <button
                onClick={handleLogout}
                type="button"
                disabled={isLoggingOut}
                data-tour="dashboard-sidebar-item-logout"
                className={`w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-colors duration-200 font-display text-[10px] sm:text-xs border ${
                  isLoggingOut
                    ? 'text-slate-500 cursor-not-allowed bg-black/40 border-slate-800/60'
                    : 'text-red-300 hover:text-red-200 bg-red-500/10 hover:bg-red-500/20 border-red-500/30'
                }`}
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </li>
          </ul>
        </nav>

        {/* Logout moved into menu list */}
      </aside>
    </>
  );
};

export default DashboardSidebar;
