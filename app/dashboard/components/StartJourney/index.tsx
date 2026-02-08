'use client'

import React, { useState } from 'react'
import { Loader, Zap, CheckCircle2, Play } from 'lucide-react'

interface JourneyPlan {
  title: string
  motivation: string
  steps: string[]
}

const StartJourney: React.FC = () => {
  const [goal, setGoal] = useState('')
  const [loading, setLoading] = useState(false)
  const [plan, setPlan] = useState<JourneyPlan | null>(null)
  const [initiating, setInitiating] = useState(false)
  const [activePhases, setActivePhases] = useState<Set<number>>(new Set())

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!goal.trim()) return

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

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    setPlan(selectedPlan)
    setLoading(false)
  }

  const handleInitiate = async () => {
    setInitiating(true)
    // Simulate loading delay for UX
    await new Promise(resolve => setTimeout(resolve, 1000))
    // Navigate to skills page
    localStorage.removeItem('lastSkillPath')
    window.location.href = '/skill'
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

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
      <header className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-wider">
          INITIATE <span className="text-purple-500">PROTOCOL</span>
        </h2>
        <p className="text-slate-400 font-mono text-xs sm:text-sm">Define your objective. GEUWAT will construct your path.</p>
      </header>

      <form onSubmit={handleGenerate} className="bg-slate-900/50 border border-purple-500/20 p-4 sm:p-6 md:p-8 rounded-2xl backdrop-blur-sm relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
        
        <div className="space-y-4">
          <label className="block text-[11px] sm:text-sm font-medium text-purple-300 uppercase tracking-widest font-display">
            Mission Objective
          </label>
          <div className="flex gap-4 flex-col sm:flex-row">
            <input
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="e.g., I want to speak English fluently, Master business English, Prepare for IELTS exam..."
              className="flex-1 bg-black/40 border border-purple-900/50 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:shadow-[0_0_15px_rgba(168,85,247,0.2)] transition-all text-sm sm:text-base"
            />
            <button
              type="button"
              onClick={handleGenerate}
              disabled={loading || !goal.trim()}
              className="bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:cursor-not-allowed text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-display font-bold flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] text-sm sm:text-base"
            >
              {loading ? <Loader className="animate-spin w-4 h-4 sm:w-5 sm:h-5" /> : <span>ENTER</span>}
            </button>
          </div>
        </div>
      </form>

      {plan && (
        <div className="animate-fade-in space-y-6">
          <div className="p-4 sm:p-5 md:p-6 rounded-xl border border-purple-500/30 bg-purple-950/20 backdrop-blur-md">
            <div className="mb-2">
              <div className="text-[11px] sm:text-xs font-mono text-slate-400 uppercase tracking-widest">Mission:</div>
              <h3 className="text-xl sm:text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                {plan.title.replace(/^Mission:\s*/i, '')}
              </h3>
            </div>
            <p className="text-slate-300 italic border-l-2 border-purple-500 pl-3 sm:pl-4 py-1 font-mono text-xs sm:text-sm">
              &ldquo;{plan.motivation}&rdquo;
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {plan.steps.map((_: string, index: number) => (
              <div 
                key={index} 
                className="bg-slate-900/80 border border-slate-800 p-4 sm:p-5 md:p-6 rounded-xl relative overflow-hidden hover:border-purple-500/50 transition-colors text-center"
              >
                <div className={`flex justify-center mb-2 sm:mb-3 transition-opacity duration-300 ${
                  activePhases.has(index) ? 'opacity-100' : 'opacity-20'
                }`}>
                  <Zap 
                    className={`w-10 h-10 sm:w-12 sm:h-12 transition-all duration-300 ${
                      activePhases.has(index) 
                        ? 'text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.8)]' 
                        : 'text-purple-500'
                    }`} 
                  />
                </div>
                <div className="flex items-center justify-center gap-3 mb-3 sm:mb-4">
                  <h4 className="font-semibold text-purple-200 font-display text-sm sm:text-base">Phase {index + 1}</h4>
                </div>
                <p className="text-slate-400 leading-relaxed text-xs sm:text-sm">
                  {index === 0 ? "Build Foundation" :
                   index === 1 ? "Deliberate Practice" :
                   index === 2 ? "Leverage" :
                   "Achieve fluency in English"}
                </p>
                <button 
                  className={`mt-4 w-full text-[11px] sm:text-xs flex items-center justify-center gap-1 font-display ${
                    activePhases.has(index) ? 'text-slate-400' : 'text-purple-400 hover:text-purple-300'
                  }`}
                  onClick={() => handlePhaseClick(index)}
                >
                  <span>Ready?</span>
                </button>
              </div>
            ))}
          </div>

          {/* Initiate Button */}
          <div className="flex justify-center">
            <button
              onClick={handleInitiate}
              disabled={initiating || activePhases.size < 3}
              className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 disabled:from-slate-700 disabled:to-slate-600 disabled:cursor-not-allowed text-white px-8 sm:px-10 md:px-12 py-3 sm:py-3.5 md:py-4 rounded-xl font-display font-bold flex items-center justify-center gap-3 transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transform hover:scale-105 disabled:scale-100 disabled:shadow-none text-sm sm:text-base"
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
