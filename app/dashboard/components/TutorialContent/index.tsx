'use client'

import React, { useState } from 'react'
import { Settings, Trophy, BarChart3, Compass, Volume2, Database, BookOpen, MessageCircle, CheckCircle, Lock } from 'lucide-react'
import SettingsGuideModal from './SettingsGuideModal'
import AchievementGuideModal from './AchievementGuideModal'
import ViewProgressGuideModal from './ViewProgressGuideModal'
import StartJourneyGuideModal from './StartJourneyGuideModal'
import PronunciationGuideModal from './PronunciationGuideModal'
import VocabularyGuideModal from './VocabularyGuideModal'
import GrammarGuideModal from './GrammarGuideModal'
import SpeakingGuideModal from './SpeakingGuideModal'
import PronunciationRoadmapModal from './PronunciationRoadmapModal'
import SpeakingRoadmapModal from './SpeakingRoadmapModal'
import VocabularyRoadmapModal from './VocabularyRoadmapModal'

type LearningPathItem = {
  step: number
  title: string
  status: 'completed' | 'current' | 'locked'
  opensPronunciationRoadmap?: boolean
  opensSpeakingRoadmap?: boolean
  opensVocabularyRoadmap?: boolean
}

const TutorialContent: React.FC = () => {
  const [isSettingsGuideOpen, setIsSettingsGuideOpen] = useState(false)
  const [isAchievementGuideOpen, setIsAchievementGuideOpen] = useState(false)
  const [isViewProgressGuideOpen, setIsViewProgressGuideOpen] = useState(false)
  const [isStartJourneyGuideOpen, setIsStartJourneyGuideOpen] = useState(false)
  const [isPronunciationGuideOpen, setIsPronunciationGuideOpen] = useState(false)
  const [isVocabularyGuideOpen, setIsVocabularyGuideOpen] = useState(false)
  const [isGrammarGuideOpen, setIsGrammarGuideOpen] = useState(false)
  const [isSpeakingGuideOpen, setIsSpeakingGuideOpen] = useState(false)
  const [isPronunciationRoadmapOpen, setIsPronunciationRoadmapOpen] = useState(false)
  const [isSpeakingRoadmapOpen, setIsSpeakingRoadmapOpen] = useState(false)
  const [isVocabularyRoadmapOpen, setIsVocabularyRoadmapOpen] = useState(false)

  const tutorials = [
    {
      id: 1,
      title: "Using Dashboard Settings",
      description: "Pelajari cara menggunakan halaman Settings di dashboard untuk mengelola akun",
      duration: "5 min",
      difficulty: "Beginner",
      type: "video",
      completed: true,
      icon: Settings
    },
    {
      id: 2,
      title: "Achievement Content Overview",
      description: "Pahami halaman Achievements dan bagaimana tier serta referral bekerja",
      duration: "15 min",
      difficulty: "Beginner",
      type: "interactive",
      completed: true,
      icon: Trophy
    },
    {
      id: 3,
      title: "View Progress Overview",
      description: "Pelajari cara membaca dan memahami halaman View Progress",
      duration: "12 min",
      difficulty: "Intermediate",
      type: "article",
      completed: false,
      icon: BarChart3
    },
    {
      id: 4,
      title: "Start Journey Guide",
      description: "Panduan menggunakan halaman Start Journey untuk memulai tujuan belajar",
      duration: "20 min",
      difficulty: "Intermediate",
      type: "interactive",
      completed: false,
      icon: Compass
    },
    {
      id: 5,
      title: "Pronunciation Guide",
      description: "Panduan singkat latihan pronunciation di menu skill",
      duration: "18 min",
      difficulty: "Intermediate",
      type: "audio",
      completed: false,
      locked: false,
      icon: Volume2
    },
    {
      id: 6,
      title: "Vocabulary Guide",
      description: "Panduan singkat latihan vocabulary di menu skill",
      duration: "25 min",
      difficulty: "Advanced",
      type: "article",
      completed: false,
      locked: false,
      icon: Database
    },
    {
      id: 7,
      title: "Grammar Guide",
      description: "Panduan singkat latihan grammar di menu skill",
      duration: "20 min",
      difficulty: "Intermediate",
      type: "article",
      completed: false,
      locked: false,
      icon: BookOpen
    },
    {
      id: 8,
      title: "Speaking Guide",
      description: "Panduan singkat latihan speaking di menu skill",
      duration: "20 min",
      difficulty: "Intermediate",
      type: "interactive",
      completed: false,
      locked: false,
      icon: MessageCircle
    }
  ]

  const learningPath: LearningPathItem[] = [
    { step: 1, title: 'Pronunciation Roadmap', status: 'current', opensPronunciationRoadmap: true },
    { step: 2, title: 'Speaking Roadmap', status: 'current', opensSpeakingRoadmap: true },
    { step: 3, title: 'Vocabulary Roadmap', status: 'current', opensVocabularyRoadmap: true },
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
      <header className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-wider">
          TUTORIAL <span className="text-teal-400">LIBRARY</span>
        </h2>
        <p className="text-slate-400 font-mono text-xs sm:text-sm">Learn English with our comprehensive tutorial collection.</p>
      </header>

      {/* Tutorial Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {tutorials.map((tutorial) => {
          const Icon = tutorial.icon
          const isPronunciationGuide = tutorial.id === 5
          const isVocabularyGuide = tutorial.id === 6
          const isGrammarGuide = tutorial.id === 7
          const isSpeakingGuide = tutorial.id === 8
          return (
            <div
              key={tutorial.id}
              className={`
                relative border p-4 sm:p-5 md:p-6 rounded-xl backdrop-blur-sm transition-all duration-300
                ${tutorial.locked 
                  ? 'bg-slate-900/30 border-gray-800/50 opacity-60 cursor-not-allowed' 
                  : isPronunciationGuide
                    ? 'bg-purple-900/20 border-purple-500/40 hover:scale-105 cursor-pointer shadow-[0_0_22px_rgba(188,19,254,0.22)] hover:shadow-[0_0_34px_rgba(188,19,254,0.35)]'
                    : isVocabularyGuide
                      ? 'bg-green-900/20 border-green-500/40 hover:scale-105 cursor-pointer shadow-[0_0_22px_rgba(57,255,20,0.22)] hover:shadow-[0_0_34px_rgba(57,255,20,0.35)]'
                      : isGrammarGuide
                        ? 'bg-teal-900/20 border-teal-500/40 hover:scale-105 cursor-pointer shadow-[0_0_22px_rgba(20,184,166,0.22)] hover:shadow-[0_0_34px_rgba(20,184,166,0.35)]'
                        : isSpeakingGuide
                          ? 'bg-pink-900/20 border-pink-500/40 hover:scale-105 cursor-pointer shadow-[0_0_22px_rgba(255,0,255,0.22)] hover:shadow-[0_0_34px_rgba(255,0,255,0.35)]'
                          : 'bg-teal-900/20 border-teal-500/30 hover:scale-105 cursor-pointer'
                }
              `}
            >
              {/* Completion Badge */}
              {tutorial.completed && tutorial.id !== 1 && tutorial.id !== 2 && (
                <div className="absolute top-4 right-4">
                  <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
                </div>
              )}

              {/* Lock Icon */}
              {tutorial.locked && (
                <div className="absolute top-4 right-4">
                  <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
                </div>
              )}

              {/* Type Icon */}
              <div className="flex justify-center mb-3 sm:mb-4">
                <div className={`
                  w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center
                  ${tutorial.locked 
                    ? 'bg-gray-800' 
                    : isPronunciationGuide
                      ? 'bg-gradient-to-br from-purple-500 to-fuchsia-600'
                      : isVocabularyGuide
                        ? 'bg-gradient-to-br from-green-500 to-emerald-600'
                        : isGrammarGuide
                          ? 'bg-gradient-to-br from-teal-500 to-cyan-600'
                          : isSpeakingGuide
                            ? 'bg-gradient-to-br from-pink-500 to-fuchsia-600'
                            : 'bg-gradient-to-br from-teal-500 to-teal-600'
                  }
                `}>
                  <Icon className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 ${tutorial.locked ? 'text-gray-500' : 'text-white'}`} />
                </div>
              </div>

              {/* Content */}
              <div className="text-center">
                <h3 className={`font-bold mb-2 font-display text-sm sm:text-base ${tutorial.locked ? 'text-gray-500' : 'text-white'}`}>
                  {tutorial.title}
                </h3>
                <p className={`text-xs sm:text-sm mb-3 sm:mb-4 ${tutorial.locked ? 'text-gray-600' : 'text-slate-400'}`}>
                  {tutorial.description}
                </p>

                {/* Metadata */}
                {/* Action Button */}
                <button
                  disabled={tutorial.locked}
                  onClick={() => {
                    if (tutorial.locked) return
                    if (tutorial.id === 1) {
                      setIsSettingsGuideOpen(true)
                    } else if (tutorial.id === 2) {
                      setIsAchievementGuideOpen(true)
                    } else if (tutorial.id === 3) {
                      setIsViewProgressGuideOpen(true)
                    } else if (tutorial.id === 4) {
                      setIsStartJourneyGuideOpen(true)
                    } else if (tutorial.id === 5) {
                      setIsPronunciationGuideOpen(true)
                    } else if (tutorial.id === 6) {
                      setIsVocabularyGuideOpen(true)
                    } else if (tutorial.id === 7) {
                      setIsGrammarGuideOpen(true)
                    } else if (tutorial.id === 8) {
                      setIsSpeakingGuideOpen(true)
                    }
                  }}
                  className={`
                    w-full py-2 rounded-lg font-medium transition-all text-xs sm:text-sm
                    ${tutorial.locked
                      ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                      : isPronunciationGuide
                        ? 'bg-purple-500/20 border border-purple-500/40 text-purple-200 hover:bg-purple-500/30'
                        : isVocabularyGuide
                          ? 'bg-green-500/20 border border-green-500/40 text-green-200 hover:bg-green-500/30'
                          : isGrammarGuide
                            ? 'bg-teal-500/20 border border-teal-500/40 text-teal-200 hover:bg-teal-500/30'
                            : isSpeakingGuide
                              ? 'bg-pink-500/20 border border-pink-500/40 text-pink-200 hover:bg-pink-500/30'
                              : 'bg-teal-500/20 border border-teal-500/30 text-teal-300 hover:bg-teal-500/30'
                    }
                  `}
                >
                  {tutorial.locked
                    ? 'Locked'
                    : tutorial.id === 1
                      ? 'Open Settings Guide'
                      : tutorial.id === 2
                        ? 'Open Achievements Guide'
                        : tutorial.id === 3
                          ? 'Open View Progress Guide'
                          : tutorial.id === 4
                            ? 'Open Start Journey Guide'
                            : tutorial.id === 5
                              ? 'Open Pronunciation Guide'
                            : tutorial.id === 6
                              ? 'Open Vocabulary Guide'
                            : tutorial.id === 7
                              ? 'Open Grammar Guide'
                            : tutorial.id === 8
                              ? 'Open Speaking Guide'
                          : tutorial.completed
                            ? 'Review'
                            : 'Start'}
                </button>
              </div>
            </div>
          )
        })}
      </div>

      <SettingsGuideModal
        isOpen={isSettingsGuideOpen}
        onClose={() => setIsSettingsGuideOpen(false)}
      />
      <AchievementGuideModal
        isOpen={isAchievementGuideOpen}
        onClose={() => setIsAchievementGuideOpen(false)}
      />
      <ViewProgressGuideModal
        isOpen={isViewProgressGuideOpen}
        onClose={() => setIsViewProgressGuideOpen(false)}
      />
      <StartJourneyGuideModal
        isOpen={isStartJourneyGuideOpen}
        onClose={() => setIsStartJourneyGuideOpen(false)}
      />
      <PronunciationGuideModal
        isOpen={isPronunciationGuideOpen}
        onClose={() => setIsPronunciationGuideOpen(false)}
      />
      <VocabularyGuideModal
        isOpen={isVocabularyGuideOpen}
        onClose={() => setIsVocabularyGuideOpen(false)}
      />
      <GrammarGuideModal
        isOpen={isGrammarGuideOpen}
        onClose={() => setIsGrammarGuideOpen(false)}
      />
      <SpeakingGuideModal
        isOpen={isSpeakingGuideOpen}
        onClose={() => setIsSpeakingGuideOpen(false)}
      />
      <PronunciationRoadmapModal
        isOpen={isPronunciationRoadmapOpen}
        onClose={() => setIsPronunciationRoadmapOpen(false)}
      />
      <SpeakingRoadmapModal
        isOpen={isSpeakingRoadmapOpen}
        onClose={() => setIsSpeakingRoadmapOpen(false)}
      />
      <VocabularyRoadmapModal
        isOpen={isVocabularyRoadmapOpen}
        onClose={() => setIsVocabularyRoadmapOpen(false)}
      />

      {/* Learning Path */}
      <div className="bg-slate-900/50 border border-purple-500/20 p-4 sm:p-6 md:p-8 rounded-xl backdrop-blur-sm">
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-4 sm:mb-6 font-display">Recommended Learning Path</h3>
        <div className="space-y-3 sm:space-y-4">
          {learningPath.map((item) => (
            <div
              key={item.step}
              role={item.opensPronunciationRoadmap || item.opensSpeakingRoadmap || item.opensVocabularyRoadmap ? 'button' : undefined}
              tabIndex={item.opensPronunciationRoadmap || item.opensSpeakingRoadmap || item.opensVocabularyRoadmap ? 0 : undefined}
              onClick={() => {
                if (item.opensPronunciationRoadmap) {
                  setIsPronunciationRoadmapOpen(true)
                }
                if (item.opensSpeakingRoadmap) {
                  setIsSpeakingRoadmapOpen(true)
                }
                if (item.opensVocabularyRoadmap) {
                  setIsVocabularyRoadmapOpen(true)
                }
              }}
              onKeyDown={(event) => {
                if (!item.opensPronunciationRoadmap && !item.opensSpeakingRoadmap && !item.opensVocabularyRoadmap) return
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  if (item.opensPronunciationRoadmap) {
                    setIsPronunciationRoadmapOpen(true)
                  }
                  if (item.opensSpeakingRoadmap) {
                    setIsSpeakingRoadmapOpen(true)
                  }
                  if (item.opensVocabularyRoadmap) {
                    setIsVocabularyRoadmapOpen(true)
                  }
                }
              }}
              className={`flex items-center gap-4 p-4 rounded-lg border ${
                item.status === 'locked'
                  ? 'bg-slate-900/40 border-slate-700/40 opacity-70'
                  : item.status === 'current'
                    ? `bg-purple-900/30 border-purple-500/30 ${item.opensPronunciationRoadmap || item.opensSpeakingRoadmap || item.opensVocabularyRoadmap ? 'cursor-pointer hover:bg-purple-900/40 transition-colors' : ''}`
                    : 'bg-slate-800/50 border-slate-700/30'
              }`}
            >
              <div className={`
                w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold
                ${item.status === 'completed' 
                  ? 'bg-green-500 text-white' 
                  : item.status === 'current'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-700 text-gray-400'
                }
              `}>
                {item.status === 'completed' ? '✓' : item.status === 'locked' ? <Lock className="w-4 h-4" /> : item.step}
              </div>
              <span className={`flex-1 text-sm sm:text-base ${item.status === 'locked' ? 'text-gray-500' : 'text-white'}`}>
                {item.title}
              </span>
              {item.status === 'current' && (
                <span className="text-[11px] sm:text-xs text-purple-200 bg-purple-500/30 px-2 py-1 rounded-full">
                  {item.opensPronunciationRoadmap || item.opensSpeakingRoadmap || item.opensVocabularyRoadmap ? 'Open' : 'Current'}
                </span>
              )}
              {item.status === 'locked' && (
                <span className="text-[11px] sm:text-xs text-slate-400 bg-slate-700/40 px-2 py-1 rounded-full">Locked</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default TutorialContent
