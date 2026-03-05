'use client'

import React, { useState } from 'react';
import { BookOpen, Mic, Volume2, MessageCircle, BarChart3, Lock } from 'lucide-react';
import { VOCABULARY_TOPICS } from '../../../skill/vocabulary/topic/data/topics';
import { SPEAKING_GOALS } from '../../../skill/speaking/data/goals';
import { SPEAKING_PHASES } from '../../../skill/speaking/data/phases';
import {
  SPEAKING_GOAL_COMPLETION_KEY,
  SPEAKING_PRACTICE_WITH_GEUWAT_PREFIX,
} from '../../../skill/speaking/data/progress';

interface SkillData {
  id: string;
  name: string;
  progress: number;
  icon: React.ElementType;
  description: string;
}

type DashboardTopicProgress = {
  id?: string;
  name: string;
  percentage: number;
  practicePercentage?: number;
  lessonPercentage?: number;
  locked?: boolean;
};

const PRONUNCIATION_ROADMAP_CHECKLIST_KEY = 'dashboard-pronunciation-roadmap-checklist-v1';
const VOCABULARY_PROGRESS_KEY = 'vocabularyProgress';
const VOCABULARY_ROADMAP_CHECKLIST_KEY = 'dashboard-vocabulary-roadmap-checklist-v1';

const initialSkills: SkillData[] = [
  { id: 'pronunciation', name: 'Pronunciation', progress: 75, icon: Volume2, description: 'Speaking clarity and accent' },
  { id: 'vocabulary', name: 'Vocabulary', progress: 60, icon: BookOpen, description: 'Word knowledge and usage' },
  { id: 'grammar', name: 'Grammar', progress: 85, icon: MessageCircle, description: 'Sentence structure and rules' },
  { id: 'speaking', name: 'Speaking', progress: 45, icon: Mic, description: 'Conversation skills' },
];

const ProgressContent: React.FC = () => {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [selectedTopics, setSelectedTopics] = useState<{[key: string]: string[]}>({});
  const [expandedTopics, setExpandedTopics] = useState<{[key: string]: string[]}>({});

  const readLocalStorageObject = <T,>(key: string, fallback: T): T => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      return JSON.parse(raw) as T;
    } catch {
      return fallback;
    }
  };
  
  // Helper function to calculate phonetic symbols average
  const calculatePhoneticAverage = (topicProgress: Record<string, number>) => {
    const phoneticSymbolKeys = Object.keys(topicProgress).filter(key => key.startsWith('phoneticSymbols_'));
    const phoneticSymbolProgress = phoneticSymbolKeys.map(key => topicProgress[key]);
    return phoneticSymbolProgress.length > 0 
      ? Math.round(phoneticSymbolProgress.reduce((acc, curr) => acc + curr, 0) / phoneticSymbolProgress.length)
      : 0;
  };
  
  // Load pronunciation topic progress from localStorage
  const getPronunciationTopicProgress = (): DashboardTopicProgress[] => {
    const topicProgress = readLocalStorageObject<Record<string, number>>('pronunciationProgress', {});
    const lessonChecklist = readLocalStorageObject<Record<string, boolean>>(
      PRONUNCIATION_ROADMAP_CHECKLIST_KEY,
      {}
    );
    const averagePhoneticProgress = calculatePhoneticAverage(topicProgress);
    const practiceByRoadmapId: Record<string, number> = {
      alphabet: topicProgress['alphabet'] || 0,
      'phonetic-symbols': averagePhoneticProgress,
      stressing: topicProgress['stressing'] || 0,
      intonation: topicProgress['intonation'] || 0,
      'final-sound': topicProgress['finalSound'] || 0,
      'american-t': topicProgress['americanT'] || 0,
      'text-practice': topicProgress['textPractice'] || 0,
    };

    const roadmapTopics: Array<{ id: string; name: string }> = [
      { id: 'alphabet', name: 'Alphabet' },
      { id: 'phonetic-symbols', name: 'Phonetic Symbols' },
      { id: 'stressing', name: 'Stressing' },
      { id: 'intonation', name: 'Intonation' },
      { id: 'final-sound', name: 'Final Sound' },
      { id: 'american-t', name: 'American /t/' },
      { id: 'text-practice', name: 'Text Practice' },
    ];

    return roadmapTopics.map((topic) => {
      const practicePercentage = practiceByRoadmapId[topic.id] ?? 0;
      const lessonPercentage = lessonChecklist[topic.id] ? 100 : 0;
      return {
        id: topic.id,
        name: topic.name,
        percentage: practicePercentage,
        practicePercentage,
        lessonPercentage,
      };
    });
  };

  const getVocabularyTopicProgress = (): DashboardTopicProgress[] => {
    const vocabularyProgress = readLocalStorageObject<Record<string, number>>(VOCABULARY_PROGRESS_KEY, {});
    const vocabularyRoadmapChecklist = readLocalStorageObject<Record<string, boolean>>(
      VOCABULARY_ROADMAP_CHECKLIST_KEY,
      {}
    );

    return VOCABULARY_TOPICS.map((topic) => {
      const practicePercentage = vocabularyProgress[topic.topicId];
      const learningPercentage = vocabularyRoadmapChecklist[topic.topicId] ? 100 : 0;
      const safePracticePercentage =
        typeof practicePercentage === 'number' && Number.isFinite(practicePercentage)
          ? practicePercentage
          : 0;

      return {
        id: topic.topicId,
        name: topic.title,
        percentage: safePracticePercentage,
        practicePercentage: safePracticePercentage,
        lessonPercentage: learningPercentage,
      };
    });
  };

  const getSpeakingTopicProgress = (): DashboardTopicProgress[] => {
    const speakingCompletionMap = readLocalStorageObject<Record<string, boolean>>(
      SPEAKING_GOAL_COMPLETION_KEY,
      {},
    );

    return SPEAKING_PHASES.map((phase) => {
      const phaseGoals = SPEAKING_GOALS.filter((goal) => goal.phaseId === phase.id);
      const totalGoals = phaseGoals.length;

      const learningDone = phaseGoals.filter((goal) => speakingCompletionMap[goal.id] === true).length;
      const practiceDone = phaseGoals.filter(
        (goal) =>
          speakingCompletionMap[`${SPEAKING_PRACTICE_WITH_GEUWAT_PREFIX}${goal.id}`] === true,
      ).length;

      const lessonPercentage =
        totalGoals > 0 ? Math.round((learningDone / totalGoals) * 100) : 0;
      const practicePercentage =
        totalGoals > 0 ? Math.round((practiceDone / totalGoals) * 100) : 0;

      return {
        id: phase.id,
        name: phase.title,
        percentage: Math.round((lessonPercentage + practicePercentage) / 2),
        lessonPercentage,
        practicePercentage,
      };
    });
  };

  // Update initial skills with loaded progress and recalculate averages
  const [skills] = useState(() => {
    const topicProgress = readLocalStorageObject<Record<string, number>>('pronunciationProgress', {});
    const grammarProgress = readLocalStorageObject<Record<string, number>>('grammarSpeakingProgress', {});
    const vocabularyProgress = readLocalStorageObject<Record<string, number>>(VOCABULARY_PROGRESS_KEY, {});
    const speakingCompletionMap = readLocalStorageObject<Record<string, boolean>>(
      SPEAKING_GOAL_COMPLETION_KEY,
      {},
    );
    
    // Get progress from each individual topic
    const alphabetProgress = topicProgress['alphabet'] || 0;
    const stressingProgress = topicProgress['stressing'] || 0;
    const intonationProgress = topicProgress['intonation'] || 0;
    const finalSoundProgress = topicProgress['finalSound'] || 0;
    const americanTProgress = topicProgress['americanT'] || 0;
    const textPracticeProgress = topicProgress['textPractice'] || 0;
    
    // Calculate phonetic symbols average using helper function
    const averagePhoneticProgress = calculatePhoneticAverage(topicProgress);
    
    // Calculate pronunciation average from all available topics
    const allTopicProgress = [
      alphabetProgress,
      stressingProgress, 
      intonationProgress,
      finalSoundProgress,
      americanTProgress,
      textPracticeProgress,
      averagePhoneticProgress
    ].filter(val => val > 0);
    
    const pronunciationAverage = allTopicProgress.length > 0 
      ? Math.round(allTopicProgress.reduce((acc, curr) => acc + curr, 0) / allTopicProgress.length)
      : 0;
    const grammarValues = Object.values(grammarProgress);
    const grammarAverage = grammarValues.length > 0
      ? Math.round(grammarValues.reduce((acc, curr) => acc + curr, 0) / grammarValues.length)
      : 0;
    const vocabularyValues = Object.values(vocabularyProgress).filter(
      (value): value is number => typeof value === 'number' && Number.isFinite(value) && value > 0,
    );
    const vocabularyAverage = vocabularyValues.length > 0
      ? Math.round(vocabularyValues.reduce((acc, curr) => acc + curr, 0) / vocabularyValues.length)
      : 0;
    const totalSpeakingGoals = SPEAKING_GOALS.length;
    const learningDoneGlobal = SPEAKING_GOALS.filter(
      (goal) => speakingCompletionMap[goal.id] === true,
    ).length;
    const practiceDoneGlobal = SPEAKING_GOALS.filter(
      (goal) =>
        speakingCompletionMap[`${SPEAKING_PRACTICE_WITH_GEUWAT_PREFIX}${goal.id}`] === true,
    ).length;
    const speakingLearningAverage = totalSpeakingGoals > 0
      ? Math.round((learningDoneGlobal / totalSpeakingGoals) * 100)
      : 0;
    const speakingPracticeAverage = totalSpeakingGoals > 0
      ? Math.round((practiceDoneGlobal / totalSpeakingGoals) * 100)
      : 0;
    const speakingAverage = Math.round((speakingLearningAverage + speakingPracticeAverage) / 2);
    
    return initialSkills.map(skill => {
      if (skill.id === 'pronunciation') {
        return { ...skill, progress: pronunciationAverage };
      }
      if (skill.id === 'grammar') {
        return { ...skill, progress: grammarAverage };
      }
      if (skill.id === 'vocabulary') {
        return { ...skill, progress: vocabularyAverage };
      }
      if (skill.id === 'speaking') {
        return { ...skill, progress: speakingAverage };
      }
      return skill;
    });
  });

  // All skills are displayed
  const displayedSkills = skills;
  const lockedSkillIds = new Set<string>([]);
  const unlockedSkills = displayedSkills.filter(skill => !lockedSkillIds.has(skill.id));
  const fallbackSkill: SkillData = {
    id: 'none',
    name: '-',
    progress: 0,
    icon: BarChart3,
    description: ''
  };

  const getGrammarTrackProgress = (): DashboardTopicProgress[] => {
    const grammarProgress = JSON.parse(localStorage.getItem('grammarSpeakingProgress') || '{}') as Record<string, number>;
    const values = Object.values(grammarProgress);
    const speakingAverage =
      values.length > 0 ? Math.round(values.reduce((acc, curr) => acc + curr, 0) / values.length) : 0;

    return [
      { name: 'Grammar for Speaking', percentage: speakingAverage },
      { name: 'Grammar for Writing', percentage: 0, locked: true },
    ];
  };

  const totalProgress = unlockedSkills.reduce((acc, curr) => acc + curr.progress, 0);
  const avgProgress = unlockedSkills.length > 0 ? totalProgress / unlockedSkills.length : 0;

  // Calculate strongest and weakest skills from unlocked skills only
  const strongestSkill = unlockedSkills.length > 0
    ? unlockedSkills.reduce((prev, curr) => (curr.progress > prev.progress ? curr : prev))
    : fallbackSkill;
  const weakestSkill = unlockedSkills.length > 0
    ? unlockedSkills.reduce((prev, curr) => (curr.progress < prev.progress ? curr : prev))
    : fallbackSkill;

  const handleTopicClick = (skillId: string, topicName: string) => {
    setSelectedTopics(prev => {
      const currentTopics = prev[skillId] || [];
      const isCurrentlySelected = currentTopics.includes(topicName);
      
      if (isCurrentlySelected) {
        // Deselect this topic
        return { ...prev, [skillId]: [] };
      } else {
        // Select only this topic, deselect others
        return { ...prev, [skillId]: [topicName] };
      }
    });
  };

  const toggleTopicExpansion = (skillId: string, topicName: string) => {
    setExpandedTopics(prev => {
      const currentExpanded = prev[skillId] || [];
      const isCurrentlyExpanded = currentExpanded.includes(topicName);
      
      if (isCurrentlyExpanded) {
        // Collapse this topic
        return { ...prev, [skillId]: currentExpanded.filter(t => t !== topicName) };
      } else {
        // Expand only this topic, collapse others
        return { ...prev, [skillId]: [topicName] };
      }
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-wider">
            VIEW <span className="text-purple-500">PROGRESS</span>
          </h2>
          <p className="text-slate-400 mt-1 font-mono text-xs sm:text-sm">
            Track your English language skills and set your proficiency levels.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-1 gap-4 sm:gap-6">
        
        {/* Skills Overview */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-3 sm:p-4 md:p-5 backdrop-blur-sm flex flex-col items-center justify-center min-h-[240px] sm:min-h-[260px] md:min-h-[340px] relative overflow-hidden">
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
          
          <h3 className="text-sm sm:text-base md:text-lg font-bold text-slate-200 mb-2 md:mb-3 w-full text-left flex items-center gap-2 z-10 font-display">
            <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-cyan-400" /> 
            <span className="text-xs sm:text-sm md:text-base">Skills Overview</span>
          </h3>
          
          <div className="w-full h-[200px] sm:h-[220px] md:h-[300px] relative z-10 flex items-start justify-center overflow-y-auto">
            {/* Skills Overview - Clickable Subjects */}
            <div className="w-full space-y-2 md:space-y-3 px-1">
              {displayedSkills.map((skill) => {
                const percentage = skill.progress;
                const isSelected = selectedSkill === skill.id;
                const isDisabled = lockedSkillIds.has(skill.id); // Lock selected skills only.
                const displayPercentage = isDisabled ? null : percentage;
                
                return (
                  <div key={skill.id} className="space-y-2">
                    <div 
                      className={`flex items-center gap-2 md:gap-3 p-2 sm:p-2.5 md:p-3 rounded-lg transition-all duration-200 ${
                        isDisabled
                          ? 'bg-slate-900/50 border border-slate-700/30 cursor-not-allowed opacity-60'
                          : isSelected 
                            ? 'bg-purple-600/20 border border-purple-500/50 cursor-pointer' 
                            : 'bg-slate-800/30 border border-slate-700/50 hover:bg-slate-800/50 hover:border-slate-600/50 cursor-pointer'
                      }`}
                      onClick={() => !isDisabled && setSelectedSkill(isSelected ? null : skill.id)}
                    >
                      {(() => {
                        const Icon = isDisabled ? Lock : skill.icon;
                        return <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 ${isDisabled ? 'text-slate-500' : 'text-purple-400'}`} />;
                      })()}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 md:gap-2">
                          <div className="text-xs sm:text-sm md:text-base font-semibold text-white truncate font-display">{skill.name}</div>
                        {isDisabled && (
                          <span className="text-[11px] sm:text-xs text-slate-400 ml-0 sm:ml-2">(Locked)</span>
                        )}
                        </div>
                        <div className="flex-1 bg-slate-800/50 rounded-full h-1.5 md:h-2 relative overflow-hidden mt-1">
                          <div 
                            className="h-full bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full transition-all duration-500"
                            style={{ width: `${displayPercentage ?? 0}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-[10px] sm:text-xs md:text-sm text-cyan-400 font-semibold hidden sm:block">
                        {displayPercentage === null ? '' : `${displayPercentage.toFixed(0)}%`}
                      </div>
                    </div>
                    
                    {/* Show topics when selected */}
                    {isSelected && (
                      <div className="pl-3 sm:pl-4 md:pl-6 pr-1 sm:pr-2 md:pr-3 space-y-1 md:space-y-2 animate-fade-in">
                        {(() => {
                          switch(skill.id) {
                            case 'pronunciation':
                              return getPronunciationTopicProgress();
                            case 'vocabulary':
                              return getVocabularyTopicProgress();
                            case 'grammar':
                              return getGrammarTrackProgress();
                            case 'speaking':
                              return getSpeakingTopicProgress();
                            default:
                              return [];
                          }
                        })().map((topic, index) => {
                          const isTopicLocked = topic.locked === true;
                          const isSelected = !isTopicLocked && selectedTopics[skill.id]?.includes(topic.name);
                          const isExpanded = expandedTopics[skill.id]?.includes(topic.name);
                          return (
                            <div key={index} className="space-y-1 md:space-y-2">
                              <button
                                onClick={() => {
                                  if (isTopicLocked) return;
                                  handleTopicClick(skill.id, topic.name);
                                  toggleTopicExpansion(skill.id, topic.name);
                                }}
                                disabled={isTopicLocked}
                                className={`
                                  relative py-1.5 md:py-2 px-2 md:px-3 rounded-lg font-display font-semibold text-[11px] sm:text-xs md:text-sm transition-all duration-200 border w-full
                                  ${isTopicLocked
                                    ? 'bg-slate-900/50 border-slate-700/40 text-slate-500 cursor-not-allowed opacity-70'
                                    : isSelected 
                                    ? 'bg-cyan-600 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-105 z-10' 
                                    : 'bg-slate-800/50 border-slate-600/50 text-slate-300 hover:border-cyan-500/50 hover:bg-slate-700/50 hover:text-cyan-200'
                                  }
                                `}
                              >
                                <div className="flex items-center justify-between w-full">
                                  <span className="text-[10px] sm:text-xs md:text-sm">{topic.name}</span>
                                  {isTopicLocked && <span className="text-[10px] sm:text-xs text-slate-500">(Locked)</span>}
                                </div>
                                {isSelected && (
                                  <div className="absolute -top-1 -right-1 w-2 h-2 md:w-2.5 md:h-2.5 bg-cyan-400 rounded-full border-2 border-slate-900 shadow-[0_0_8px_#22d3ee]">
                                  </div>
                                )}
                              </button>
                              
                              {/* Progress bar chart below button when expanded */}
                              {isExpanded && !isTopicLocked && (
                                <div className="pl-2 md:pl-4 pr-1 md:pr-2 animate-fade-in">
                                  <div className="bg-slate-800/30 rounded-lg p-2 md:p-3">
                                    {skill.id === 'pronunciation' ? (
                                      <div className="space-y-2">
                                        <div className="flex items-center gap-2 md:gap-3">
                                          <div className="text-[10px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider min-w-[92px]">
                                            Practice Progress
                                          </div>
                                          <div className="flex-1 bg-slate-700/50 rounded-full h-2 md:h-3 relative overflow-hidden">
                                            <div
                                              className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full transition-all duration-700"
                                              style={{ width: `${topic.practicePercentage ?? topic.percentage}%` }}
                                            />
                                          </div>
                                          <div className="text-[10px] sm:text-xs text-cyan-300 font-bold">
                                            {topic.practicePercentage ?? topic.percentage}%
                                          </div>
                                        </div>
                                        {topic.id !== 'text-practice' && (
                                          <div className="flex items-center gap-2 md:gap-3">
                                            <div className="text-[10px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider min-w-[92px]">
                                              Lesson Progress
                                            </div>
                                            <div className="flex-1 bg-slate-700/50 rounded-full h-2 md:h-3 relative overflow-hidden">
                                              <div
                                                className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-700"
                                                style={{ width: `${topic.lessonPercentage ?? 0}%` }}
                                              />
                                            </div>
                                            <div className="text-[10px] sm:text-xs text-emerald-300 font-bold">
                                              {topic.lessonPercentage ?? 0}%
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    ) : skill.id === 'vocabulary' ? (
                                      <div className="space-y-2">
                                        <div className="flex items-center gap-2 md:gap-3">
                                          <div className="text-[10px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider min-w-[92px]">
                                            Practice Progress
                                          </div>
                                          <div className="flex-1 bg-slate-700/50 rounded-full h-2 md:h-3 relative overflow-hidden">
                                            <div
                                              className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full transition-all duration-700"
                                              style={{ width: `${topic.practicePercentage ?? topic.percentage}%` }}
                                            />
                                          </div>
                                          <div className="text-[10px] sm:text-xs text-cyan-300 font-bold">
                                            {topic.practicePercentage ?? topic.percentage}%
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2 md:gap-3">
                                          <div className="text-[10px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider min-w-[92px]">
                                            Learning Progress
                                          </div>
                                          <div className="flex-1 bg-slate-700/50 rounded-full h-2 md:h-3 relative overflow-hidden">
                                            <div
                                              className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-700"
                                              style={{ width: `${topic.lessonPercentage ?? 0}%` }}
                                            />
                                          </div>
                                          <div className="text-[10px] sm:text-xs text-emerald-300 font-bold">
                                            {topic.lessonPercentage ?? 0}%
                                          </div>
                                        </div>
                                      </div>
                                    ) : skill.id === 'speaking' ? (
                                      <div className="space-y-2">
                                        <div className="flex items-center gap-2 md:gap-3">
                                          <div className="text-[10px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider min-w-[92px]">
                                            Learning Progress
                                          </div>
                                          <div className="flex-1 bg-slate-700/50 rounded-full h-2 md:h-3 relative overflow-hidden">
                                            <div
                                              className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-700"
                                              style={{ width: `${topic.lessonPercentage ?? 0}%` }}
                                            />
                                          </div>
                                          <div className="text-[10px] sm:text-xs text-emerald-300 font-bold">
                                            {topic.lessonPercentage ?? 0}%
                                          </div>
                                        </div>
                                        <div className="flex items-center gap-2 md:gap-3">
                                          <div className="text-[10px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider min-w-[92px]">
                                            Practice Progress
                                          </div>
                                          <div className="flex-1 bg-slate-700/50 rounded-full h-2 md:h-3 relative overflow-hidden">
                                            <div
                                              className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full transition-all duration-700"
                                              style={{ width: `${topic.practicePercentage ?? 0}%` }}
                                            />
                                          </div>
                                          <div className="text-[10px] sm:text-xs text-cyan-300 font-bold">
                                            {topic.practicePercentage ?? 0}%
                                          </div>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-2 md:gap-3">
                                        <div className="text-[10px] sm:text-xs text-slate-400 font-semibold uppercase tracking-wider">Progress</div>
                                        <div className="flex-1 bg-slate-700/50 rounded-full h-2 md:h-3 relative overflow-hidden">
                                          <div
                                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full transition-all duration-700"
                                            style={{ width: `${topic.percentage}%` }}
                                          />
                                        </div>
                                        <div className="text-[10px] sm:text-xs text-cyan-300 font-bold">{topic.percentage}%</div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Background Grid Decoration */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(139,92,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(139,92,246,0.03)_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)] pointer-events-none" />
        </div>
      </div>

      {/* Skill Progress Summary */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        <div className="bg-slate-900/50 border border-cyan-500/20 p-3 sm:p-4 rounded-xl backdrop-blur-sm text-center max-w-xs sm:max-w-sm mx-auto">
          <div className="text-[11px] sm:text-xs text-slate-400 font-mono">Average Score</div>
          <div className="text-lg sm:text-xl font-mono text-cyan-400">{avgProgress.toFixed(1)}%</div>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-slate-900/50 border border-green-500/20 p-3 sm:p-4 rounded-xl backdrop-blur-sm text-center">
            <div className="flex flex-col gap-1 items-center">
              <span className="text-green-400 text-xs sm:text-sm">Strongest Skill</span>
              <div className="text-base sm:text-lg font-bold text-white">{strongestSkill.name}</div>
              <div className="text-[11px] sm:text-xs text-slate-400">{strongestSkill.progress}% Complete</div>
            </div>
          </div>
          
          <div className="bg-slate-900/50 border border-purple-500/20 p-3 sm:p-4 rounded-xl backdrop-blur-sm text-center">
            <div className="flex flex-col gap-1 items-center">
              <span className="text-purple-400 text-xs sm:text-sm">Needs Focus</span>
              <div className="text-base sm:text-lg font-bold text-white">{weakestSkill.name}</div>
              <div className="text-[11px] sm:text-xs text-slate-400">{weakestSkill.progress}% Complete</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressContent;
