'use client'

import React, { useState, useEffect } from 'react';
import { Cpu, Loader2, Lock, CheckCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import './styles/neon.css';
import BackButton from './components/BackButton';
import Sidebar from './components/skillSidebar/SkillSidebar';

const SkillType = {
  PRONUNCIATION: 'P',
  VOCABULARY: 'V',
  GRAMMAR: 'G',
  SPEAKING: 'S',
} as const;

type SkillType = typeof SkillType[keyof typeof SkillType];

interface SkillConfig {
  type: SkillType;
  label: string;
  color: 'cyan' | 'pink' | 'purple' | 'green' | 'teal';
  description: string;
  available: boolean;
}

const SKILLS: SkillConfig[] = [
  { type: SkillType.PRONUNCIATION, label: 'PRONUNCIATION', color: 'purple', description: 'Master your accent', available: true },
  { type: SkillType.VOCABULARY, label: 'VOCABULARY', color: 'green', description: 'Expand your word bank', available: false },
  { type: SkillType.GRAMMAR, label: 'GRAMMAR', color: 'teal', description: 'Perfect your structure', available: false },
  { type: SkillType.SPEAKING, label: 'SPEAKING', color: 'pink', description: 'Converse with confidence', available: false },
];

// Color configuration function - defined once
const getColorConfig = (color: 'cyan' | 'pink' | 'purple' | 'green' | 'teal') => {
  switch(color) {
    case 'cyan': return { 
      text: 'text-neon-cyan', 
      border: 'border-neon-cyan', 
      glow: 'shadow-neon-cyan', 
      bg: 'bg-neon-cyan',
      softBg: 'bg-cyan-900/20',
      hex: '#00f3ff'
    };
    case 'pink': return { 
      text: 'text-neon-pink', 
      border: 'border-neon-pink', 
      glow: 'shadow-neon-pink', 
      bg: 'bg-neon-pink',
      softBg: 'bg-pink-900/20',
      hex: '#ff00ff'
    };
    case 'purple': return { 
      text: 'text-neon-purple', 
      border: 'border-neon-purple', 
      glow: 'shadow-neon-purple', 
      bg: 'bg-neon-purple',
      softBg: 'bg-purple-900/20',
      hex: '#bc13fe'
    };
    case 'green': return { 
      text: 'text-neon-green', 
      border: 'border-neon-green', 
      glow: 'shadow-neon-green', 
      bg: 'bg-neon-green',
      softBg: 'bg-green-900/20',
      hex: '#39ff14'
    };
    case 'teal': return { 
      text: 'text-neon-teal', 
      border: 'border-neon-teal', 
      glow: 'shadow-neon-teal', 
      bg: 'bg-neon-teal',
      softBg: 'bg-teal-900/20',
      hex: '#14b8a6'
    };
  }
};

function SkillMenuContent() {
  const router = useRouter();
  const [activeSkill, setActiveSkill] = useState<SkillType>(SkillType.VOCABULARY);
  const [loading, setLoading] = useState(false);
  const [accessDenied, setAccessDenied] = useState(false);
  const [accessGranted, setAccessGranted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const activeConfig = SKILLS.find(s => s.type === activeSkill)!;

  const handleSkillClick = (skill: SkillConfig) => {
    setActiveSkill(skill.type);
    setAccessDenied(false);
    setAccessGranted(false);
  };

  const handleStartLearning = async () => {
    if (!activeConfig.available) {
      setAccessDenied(true);
      return;
    }
    
    setLoading(true);
    setAccessGranted(false);
    try {
      if (activeSkill === SkillType.VOCABULARY) {
        // Simulate vocabulary data fetching
        await new Promise(resolve => setTimeout(resolve, 1500));
        setAccessGranted(true);
      } else if (activeSkill === SkillType.GRAMMAR) {
        // Simulate grammar data fetching
        await new Promise(resolve => setTimeout(resolve, 1500));
        setAccessGranted(true);
      } else if (activeSkill === SkillType.PRONUNCIATION) {
        // Show access granted first, then navigate
        await new Promise(resolve => setTimeout(resolve, 1500));
        setAccessGranted(true);
        // Wait a bit more to show the granted state, then navigate
        await new Promise(resolve => setTimeout(resolve, 1000));
        router.push('/skill/pronunciation');
        return;
      } else {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setAccessGranted(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Reset states when skill changes
  useEffect(() => {
    setAccessDenied(false);
    setAccessGranted(false);
    setLoading(false);
  }, [activeSkill]);

  return (
    <div className="skill-layout overflow-x-hidden flex flex-col relative font-tech">
      
      {/* --- BACKGROUND LAYERS --- */}
      {/* Base Grid */}
      <div className="fixed inset-0 bg-tech-grid opacity-20 pointer-events-none z-0"></div>
      
      {/* Scanline Effect */}
      <div className="fixed inset-0 tech-scanline opacity-10 pointer-events-none z-0"></div>
      
      {/* Vignette */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#000000_100%)] opacity-80 pointer-events-none z-0"></div>

      {/* --- HUD OVERLAY --- */}
      <div className="fixed inset-0 pointer-events-none z-50 p-4 hidden md:block">
          {/* Top Left Bracket */}
          <div className="absolute top-8 left-8 w-16 h-16 border-t-2 border-l-2 border-gray-700 opacity-50 rounded-tl-lg"></div>
          {/* Top Right Bracket */}
          <div className="absolute top-8 right-8 w-16 h-16 border-t-2 border-r-2 border-gray-700 opacity-50 rounded-tr-lg"></div>
          {/* Bottom Left Bracket */}
          <div className="absolute bottom-8 left-8 w-16 h-16 border-b-2 border-l-2 border-gray-700 opacity-50 rounded-bl-lg"></div>
          {/* Bottom Right Bracket */}
          <div className="absolute bottom-8 right-8 w-16 h-16 border-b-2 border-r-2 border-gray-700 opacity-50 rounded-br-lg"></div>
          
          {/* Random Tech Decals removed */}
      </div>

      {/* --- HEADER --- */}
      <header className="relative z-10 w-full p-4 md:p-6 flex justify-between items-center border-b border-gray-800/50 bg-black/20 backdrop-blur-sm">
        <BackButton to="/dashboard" />
        <div className="flex-1"></div>
      </header>

      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        showMenuButton={true}
        onMenuButtonClick={() => setSidebarOpen(true)}
      />

      {/* --- MAIN CONTENT --- */}
      <main className="relative z-10 flex-1 flex flex-col items-center pt-8 md:pt-12 px-4 pb-8">
        
        {/* Main Title Area */}
        <div className="text-center mb-10 md:mb-16 relative">
          <div className="inline-block border-b border-gray-800 pb-2 mb-2">
            <span className="text-xs font-mono text-gray-500 tracking-[0.5em] uppercase">Skill Selection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-white font-display tracking-tight uppercase">
            English<span className={`text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500`}>_Core</span>
          </h1>
          {/* Decorative lines under title */}
          <div className="w-24 h-1 bg-gray-800 mx-auto mt-4 relative overflow-hidden">
             <div className={`absolute top-0 left-0 w-full h-full ${activeConfig.color === 'cyan' ? 'bg-neon-cyan' : activeConfig.color === 'pink' ? 'bg-neon-pink' : activeConfig.color === 'green' ? 'bg-neon-green' : activeConfig.color === 'teal' ? 'bg-neon-teal' : 'bg-neon-purple'} animate-scan`}></div>
          </div>
        </div>

        {/* Skill Selection Nodes */}
        <div className="flex justify-center gap-4 sm:gap-8 md:gap-12 mb-12 w-full max-w-4xl perspective-1000">
          {SKILLS.map((skill) => {
            const c = getColorConfig(skill.color);
            const isActive = activeSkill === skill.type;
            
            return (
              <div key={skill.type} className="relative flex flex-col items-center justify-center group z-20">
                
                {/* Mechanical Connection Line */}
                <div className={`absolute -top-8 w-px h-8 bg-gradient-to-b from-transparent to-gray-700 transition-all duration-300 ${isActive ? 'bg-gradient-to-b ' + c.text : ''}`}></div>

                <button
                  onClick={() => handleSkillClick(skill)}
                  className={`
                    relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24
                    flex items-center justify-center
                    transition-all duration-300
                    group cursor-pointer
                  `}
                >
                  {/* Rotating Outer Ring (Dashed) */}
                  <div 
                      className={`absolute inset-0 rounded-full border border-dashed border-gray-700 opacity-60 transition-all duration-500
                      ${isActive ? 'animate-spin-slow opacity-100 ' + c.border : 'group-hover:border-gray-500'}`}
                  ></div>

                  {/* Counter Rotating Inner Ring */}
                  <div 
                      className={`absolute inset-1 rounded-full border border-dotted border-gray-800 opacity-40 transition-all duration-500
                      ${isActive ? 'animate-spin-reverse opacity-80 ' + c.border : ''}`}
                  ></div>

                  {/* Core Button */}
                  <div className={`
                      relative z-10 w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20
                      rounded-full bg-tech-panel border-2
                      flex items-center justify-center
                      transition-all duration-300
                      ${isActive ? `scale-105 ${c.border} ${c.glow} ${c.text}` : 'border-gray-700 text-gray-600 hover:text-gray-300 hover:border-gray-500'}
                  `}>
                       {/* Core Glow */}
                       <div className={`absolute inset-0 rounded-full opacity-20 ${isActive ? c.bg : ''}`}></div>
                       
                       {/* Text */}
                       <span className="relative z-20 font-neon font-bold text-xl sm:text-3xl md:text-4xl drop-shadow-md">
                         {skill.type}
                       </span>
                  </div>
                  
                  {/* Active Indicators (Tiny Squares) */}
                  {isActive && (
                     <>
                       <div className={`absolute -right-1 top-1/2 w-1 h-1 ${c.bg} shadow-[0_0_5px_${c.hex}]`}></div>
                       <div className={`absolute -left-1 top-1/2 w-1 h-1 ${c.bg} shadow-[0_0_5px_${c.hex}]`}></div>
                       <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-1 h-4 bg-gradient-to-b from-transparent to-${c.bg}`}></div>
                     </>
                  )}
                </button>

                {/* Label under button */}
                <div className={`mt-2 text-[10px] tracking-[0.2em] font-mono uppercase transition-colors duration-300 ${isActive ? c.text : 'text-gray-700'}`}>
                    Sys.{skill.type}
                </div>

              </div>
            );
          })}
        </div>

        {/* Dynamic Content Feed */}
        <div className="flex-1 w-full flex flex-col items-center relative">
             
             {/* Connection Line from buttons to content */}
             <div className="absolute top-[-2rem] left-1/2 -translate-x-1/2 w-px h-8 bg-gray-800"></div>
             
             {/* Content Area - Empty State */}
             <div 
               className="mt-8 md:mt-16 relative group cursor-pointer" 
               onClick={handleStartLearning}
             >
               <div className={`
                 relative overflow-hidden
                 clip-tech-panel
                 bg-tech-panel border border-gray-800
                 px-10 py-6
                 transition-all duration-300
                 ${!accessDenied ? `hover:border-opacity-50 ${getColorConfig(activeConfig.color).border}` : 'border-red-900/50'}
                 flex items-center gap-4
               `}>
                   {/* Scanline Overlay */}
                   <div className="absolute inset-0 bg-transparent opacity-10 pointer-events-none group-hover:opacity-20 bg-[linear-gradient(0deg,transparent_24%,rgba(255,255,255,.1)_25%,rgba(255,255,255,.1)_26%,transparent_27%,transparent_74%,rgba(255,255,255,.1)_75%,rgba(255,255,255,.1)_76%,rgba(255,255,255,.1)_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(255,255,255,.1)_25%,rgba(255,255,255,.1)_26%,transparent_27%,transparent_74%,rgba(255,255,255,.1)_75%,rgba(255,255,255,.1)_76%,rgba(255,255,255,.1)_77%,transparent)] bg-[length:30px_30px]"></div>

                   <div className={`p-3 rounded bg-black/50 border border-gray-700 ${!accessDenied && activeConfig.available ? `group-hover:${getColorConfig(activeConfig.color).border}` : ''} transition-colors`}>
                      {loading ? (
                        <Loader2 className={`animate-spin w-6 h-6 ${getColorConfig(activeConfig.color).text}`} />
                      ) : accessDenied ? (
                        <Lock className="w-6 h-6 text-red-500 animate-pulse" />
                      ) : accessGranted ? (
                        <CheckCircle className={`w-6 h-6 text-green-400 animate-pulse`} />
                      ) : !activeConfig.available ? (
                        <Lock className="w-6 h-6 text-gray-500" />
                      ) : (
                        <Cpu className={`w-6 h-6 ${getColorConfig(activeConfig.color).text}`} />
                      )}
                   </div>
                   
                   <div className="flex flex-col">
                       <span className="text-[10px] text-gray-500 font-mono tracking-[0.2em] uppercase">
                           Status: {!activeConfig.available ? 'LOCKED' : accessGranted ? 'ACCESS GRANTED' : 'ACTIVE'}
                       </span>
                       <span className={`text-xl font-display tracking-wide transition-colors duration-300 ${accessDenied ? 'text-red-500' : accessGranted ? 'text-green-400' : activeConfig.available ? getColorConfig(activeConfig.color).text : 'text-gray-500'}`}>
                           {loading ? "INITIALIZING..." : (accessDenied ? "ACCESS DENIED" : accessGranted ? "ACCESS GRANTED" : activeConfig.available ? "EXECUTE" : "UNAVAILABLE")}
                       </span>
                   </div>

                   {/* Corner Decorations */}
                   <div className={`absolute top-0 right-0 w-3 h-3 border-t border-r ${accessDenied ? 'border-red-500' : accessGranted ? 'border-green-400' : activeConfig.available ? getColorConfig(activeConfig.color).border : 'border-gray-600'} opacity-50`}></div>
                   <div className={`absolute bottom-0 left-0 w-3 h-3 border-b border-l ${accessDenied ? 'border-red-500' : accessGranted ? 'border-green-400' : activeConfig.available ? getColorConfig(activeConfig.color).border : 'border-gray-600'} opacity-50`}></div>
               </div>
             </div>

             {/* Footer Status */}
             <div className="mt-12 flex items-center gap-3 opacity-60">
                 <div className={`w-4 h-4 ${activeConfig.color === 'cyan' ? 'bg-neon-cyan' : activeConfig.color === 'pink' ? 'bg-neon-pink' : activeConfig.color === 'green' ? 'bg-neon-green' : activeConfig.color === 'teal' ? 'bg-neon-teal' : 'bg-neon-purple'} rounded-full animate-pulse`}></div>
                 <span className="font-mono text-xs tracking-widest uppercase">
                    System Processing: {activeConfig.label}
                 </span>
             </div>
        </div>
      </main>
    </div>
  );
};

export default function SkillMenu() {
  return <SkillMenuContent />;
}
