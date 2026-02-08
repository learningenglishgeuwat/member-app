'use client'

import React, { useState } from 'react'
import { Settings, Trophy, BarChart3, Compass, Volume2, Database, BookOpen, MessageCircle, CheckCircle, Lock } from 'lucide-react'
import SettingsGuideModal from './SettingsGuideModal'
import AchievementGuideModal from './AchievementGuideModal'
import ViewProgressGuideModal from './ViewProgressGuideModal'
import StartJourneyGuideModal from './StartJourneyGuideModal'

const TutorialContent: React.FC = () => {
  const [isSettingsGuideOpen, setIsSettingsGuideOpen] = useState(false)
  const [isAchievementGuideOpen, setIsAchievementGuideOpen] = useState(false)
  const [isViewProgressGuideOpen, setIsViewProgressGuideOpen] = useState(false)
  const [isStartJourneyGuideOpen, setIsStartJourneyGuideOpen] = useState(false)

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
      locked: true,
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
      locked: true,
      icon: Database
    },
    {
      id: 7,
      title: "Grammar Guide",
      description: "Konten grammar masih dikunci",
      duration: "20 min",
      difficulty: "Intermediate",
      type: "article",
      completed: false,
      locked: true,
      icon: BookOpen
    },
    {
      id: 8,
      title: "Speaking Guide",
      description: "Konten speaking masih dikunci",
      duration: "20 min",
      difficulty: "Intermediate",
      type: "interactive",
      completed: false,
      locked: true,
      icon: MessageCircle
    }
  ]

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "from-green-500 to-green-600"
      case "Intermediate": return "from-blue-500 to-blue-600"
      case "Advanced": return "from-red-500 to-red-600"
      default: return "from-gray-500 to-gray-600"
    }
  }

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
          return (
            <div
              key={tutorial.id}
              className={`
                relative border p-4 sm:p-5 md:p-6 rounded-xl backdrop-blur-sm transition-all duration-300
                ${tutorial.locked 
                  ? 'bg-slate-900/30 border-gray-800/50 opacity-60 cursor-not-allowed' 
                  : tutorial.completed
                    ? 'bg-teal-900/20 border-teal-500/30 hover:scale-105 cursor-pointer'
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
                    : tutorial.completed
                      ? 'bg-gradient-to-br from-teal-500 to-teal-600'
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
                    }
                  }}
                  className={`
                    w-full py-2 rounded-lg font-medium transition-all text-xs sm:text-sm
                    ${tutorial.locked
                      ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                      : tutorial.completed
                        ? 'bg-teal-500/20 border border-teal-500/30 text-teal-300 hover:bg-teal-500/30'
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

      {/* Learning Path */}
      <div className="bg-slate-900/50 border border-purple-500/20 p-4 sm:p-6 md:p-8 rounded-xl backdrop-blur-sm">
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-4 sm:mb-6 font-display">Recommended Learning Path</h3>
        <div className="space-y-3 sm:space-y-4">
          {[
            { step: 1, title: "Complete Getting Started", status: "locked" },
            { step: 2, title: "Master Pronunciation Basics", status: "locked" },
            { step: 3, title: "Build Vocabulary", status: "locked" },
            { step: 4, title: "Practice Conversations", status: "locked" },
            { step: 5, title: "Advanced Skills", status: "locked" }
          ].map((item) => (
            <div
              key={item.step}
              className={`flex items-center gap-4 p-4 rounded-lg border ${
                item.status === 'locked'
                  ? 'bg-slate-900/40 border-slate-700/40 opacity-70'
                  : item.status === 'current'
                    ? 'bg-purple-900/30 border-purple-500/30'
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
                <span className="text-[11px] sm:text-xs text-purple-400 bg-purple-500/20 px-2 py-1 rounded-full">Current</span>
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
