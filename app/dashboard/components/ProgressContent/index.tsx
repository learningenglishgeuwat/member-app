'use client'

import React, { useState } from 'react';
import { BookOpen, Mic, Volume2, MessageCircle, BarChart3, Lock } from 'lucide-react';

interface SkillData {
  id: string;
  name: string;
  progress: number;
  icon: React.ElementType;
  description: string;
}

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
  
  // Helper function to calculate phonetic symbols average
  const calculatePhoneticAverage = (topicProgress: Record<string, number>) => {
    const phoneticSymbolKeys = Object.keys(topicProgress).filter(key => key.startsWith('phoneticSymbols_'));
    const phoneticSymbolProgress = phoneticSymbolKeys.map(key => topicProgress[key]);
    return phoneticSymbolProgress.length > 0 
      ? Math.round(phoneticSymbolProgress.reduce((acc, curr) => acc + curr, 0) / phoneticSymbolProgress.length)
      : 0;
  };
  
  // Load pronunciation topic progress from localStorage
  const getPronunciationTopicProgress = () => {
    const topicProgress = JSON.parse(localStorage.getItem('pronunciationProgress') || '{}') as Record<string, number>;
    const averagePhoneticProgress = calculatePhoneticAverage(topicProgress);
    
    return [
      { name: 'Alphabet', percentage: topicProgress['alphabet'] || 0 },
      { name: 'Phonetic Symbols', percentage: averagePhoneticProgress },
      { name: 'Stressing', percentage: topicProgress['stressing'] || 0 },
      { name: 'Final sound', percentage: topicProgress['finalSound'] || 0 },
      { name: 'American /t/', percentage: topicProgress['americanT'] || 0 },
      { name: 'Connected Speech', percentage: topicProgress['connectedSpeech'] || 0 }
    ];
  };

  // Update initial skills with loaded progress and recalculate pronunciation average
  const [skills] = useState(() => {
    const topicProgress = JSON.parse(localStorage.getItem('pronunciationProgress') || '{}') as Record<string, number>;
    
    // Get progress from each individual topic
    const alphabetProgress = topicProgress['alphabet'] || 0;
    const stressingProgress = topicProgress['stressing'] || 0;
    const finalSoundProgress = topicProgress['finalSound'] || 0;
    const americanTProgress = topicProgress['americanT'] || 0;
    const connectedSpeechProgress = topicProgress['connectedSpeech'] || 0;
    
    // Calculate phonetic symbols average using helper function
    const averagePhoneticProgress = calculatePhoneticAverage(topicProgress);
    
    // Calculate pronunciation average from all available topics
    const allTopicProgress = [
      alphabetProgress,
      stressingProgress, 
      finalSoundProgress,
      americanTProgress,
      connectedSpeechProgress,
      averagePhoneticProgress
    ].filter(val => val > 0);
    
    const pronunciationAverage = allTopicProgress.length > 0 
      ? Math.round(allTopicProgress.reduce((acc, curr) => acc + curr, 0) / allTopicProgress.length)
      : 0;
    
    return initialSkills.map(skill => 
      skill.id === 'pronunciation' 
        ? { ...skill, progress: pronunciationAverage }
        : skill
    );
  });

  // All skills are displayed
  const displayedSkills = skills;
  const lockedSkillIds = new Set(['vocabulary', 'grammar', 'speaking']);
  const unlockedSkills = displayedSkills.filter(skill => !lockedSkillIds.has(skill.id));
  const fallbackSkill: SkillData = {
    id: 'none',
    name: '-',
    progress: 0,
    icon: BarChart3,
    description: ''
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
                const isDisabled = lockedSkillIds.has(skill.id); // Lock vocabulary, grammar, and speaking
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
                              return [
                                { name: 'Common Words', percentage: 35 },
                                { name: 'Academic', percentage: 30 },
                                { name: 'Business', percentage: 20 },
                                { name: 'Idioms', percentage: 15 }
                              ];
                            case 'grammar':
                              return [
                                { name: 'Tenses', percentage: 40 },
                                { name: 'Sentence Structure', percentage: 30 },
                                { name: 'Prepositions', percentage: 20 },
                                { name: 'Articles', percentage: 10 }
                              ];
                            case 'speaking':
                              return [
                                { name: 'Fluency', percentage: 35 },
                                { name: 'Pronunciation', percentage: 30 },
                                { name: 'Conversation', percentage: 25 },
                                { name: 'Presentation', percentage: 10 }
                              ];
                            default:
                              return [];
                          }
                        })().map((topic, index) => {
                          const isSelected = selectedTopics[skill.id]?.includes(topic.name);
                          const isExpanded = expandedTopics[skill.id]?.includes(topic.name);
                          return (
                            <div key={index} className="space-y-1 md:space-y-2">
                              <button
                                onClick={() => {
                                  handleTopicClick(skill.id, topic.name);
                                  toggleTopicExpansion(skill.id, topic.name);
                                }}
                                className={`
                                  relative py-1.5 md:py-2 px-2 md:px-3 rounded-lg font-display font-semibold text-[11px] sm:text-xs md:text-sm transition-all duration-200 border w-full
                                  ${isSelected 
                                    ? 'bg-cyan-600 border-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)] scale-105 z-10' 
                                    : 'bg-slate-800/50 border-slate-600/50 text-slate-300 hover:border-cyan-500/50 hover:bg-slate-700/50 hover:text-cyan-200'
                                  }
                                `}
                              >
                                <div className="flex items-center justify-between w-full">
                                  <span className="text-[10px] sm:text-xs md:text-sm">{topic.name}</span>
                                </div>
                                {isSelected && (
                                  <div className="absolute -top-1 -right-1 w-2 h-2 md:w-2.5 md:h-2.5 bg-cyan-400 rounded-full border-2 border-slate-900 shadow-[0_0_8px_#22d3ee]">
                                  </div>
                                )}
                              </button>
                              
                              {/* Progress bar chart below button when expanded */}
                              {isExpanded && (
                                <div className="pl-2 md:pl-4 pr-1 md:pr-2 animate-fade-in">
                                  <div className="bg-slate-800/30 rounded-lg p-2 md:p-3">
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
