import React from 'react';
import type { Topic } from '../types';

interface TopicCardProps {
  topic: Topic;
  isActive: boolean;
  onClick: () => void;
}

const TopicCard: React.FC<TopicCardProps> = ({ topic, isActive, onClick }) => {
  const isDisabled = topic.id === 'stressing' || topic.id === 'final-sound' || topic.id === 'american-t' || topic.id === 'connected'; // Lock stressing, final sound, american t, and connected speech topics
  
  return (
    <div 
      onClick={isDisabled ? undefined : onClick}
      className={`
        relative flex-shrink-0 transition-all duration-500 ease-out snap-center
        ${isDisabled 
          ? 'w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 opacity-40 cursor-not-allowed grayscale mt-6 sm:mt-12 md:mt-16 lg:mt-20' 
          : isActive 
            ? 'w-40 h-56 sm:w-52 sm:h-72 md:w-56 md:h-72 lg:w-64 lg:h-80 cursor-pointer' 
            : 'w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 opacity-60 hover:opacity-80 cursor-pointer mt-6 sm:mt-12 md:mt-16 lg:mt-20'
        }
      `}
    >
      {/* Active Indicator Ring */}
      {isActive && (
        <div className="absolute -inset-4 border-2 border-purple-400 rounded-xl opacity-50 blur-sm animate-pulse"></div>
      )}
      
      {/* Card Body */}
      <div className={`
        w-full h-full rounded-xl overflow-hidden relative border border-white/10
        transition-all duration-500
        ${isActive ? 'bg-slate-900 shadow-2xl shadow-purple-900/50 scale-105' : 'bg-slate-800 grayscale'}
      `}>
        {/* Tech Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90 z-10"></div>
        <div className="absolute inset-0 opacity-20">
          <div className={`w-full h-full bg-[linear-gradient(0deg,transparent_24%,rgba(147,51,234,.1)_25%,rgba(147,51,234,.1)_26%,transparent_27%,transparent_74%,rgba(147,51,234,.1)_75%,rgba(147,51,234,.1)_76%,rgba(147,51,234,.1)_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(147,51,234,.1)_25%,rgba(147,51,234,.1)_26%,transparent_27%,transparent_74%,rgba(147,51,234,.1)_75%,rgba(147,51,234,.1)_76%,rgba(147,51,234,.1)_77%,transparent)] bg-[length:30px_30px]`}></div>
        </div>

        <div className={`absolute inset-0 z-20 flex flex-col justify-end p-2 sm:p-3 md:p-4`}>
          <div 
            className={`flex items-center justify-center font-display font-bold text-white shadow-lg mb-2
              bg-gradient-to-br ${topic.color}
              ${isActive ? 'w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 text-sm sm:text-base md:text-lg lg:text-xl' : 'w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-xs'}
              ${topic.cssClass || ''}
              ${isDisabled ? 'opacity-50' : ''}
            `}
            style={{ clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' }}
          >
            {topic.icon}
          </div>
          <h3 className={`
            font-display font-bold uppercase tracking-wider
            ${isActive ? 'text-xs sm:text-base md:text-lg lg:text-xl text-white' : 'text-[10px] text-gray-400'}
            ${isDisabled ? 'text-gray-500' : ''}
          `}>
            {topic.title}
            {isDisabled && (
              <span className="block text-[8px] text-red-400 mt-1">(Locked)</span>
            )}
          </h3>
          {isActive && (
            <p className="text-[7px] sm:text-[9px] md:text-[10px] lg:text-xs text-purple-300 mt-1 font-light tracking-wide animate-fade-in-up line-clamp-2 md:line-clamp-none">
              {topic.shortDesc}
            </p>
          )}
        </div>

        {/* Corner Tech Elements */}
        {isActive && (
          <>
            <div className="absolute top-2 right-2 w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <div className="absolute bottom-2 left-2 w-1 h-1 bg-purple-400"></div>
            <div className="absolute top-2 left-2 w-1 h-1 bg-purple-400"></div>
            {/* Additional Tech Lines */}
            <div className="absolute top-1/2 right-1 w-px h-4 bg-gradient-to-b from-purple-400 to-transparent opacity-60"></div>
            <div className="absolute bottom-1/2 left-1 w-px h-4 bg-gradient-to-t from-purple-400 to-transparent opacity-60"></div>
            {/* Tech Dots */}
            <div className="absolute top-1/3 right-3 w-0.5 h-0.5 bg-purple-300 rounded-full"></div>
            <div className="absolute bottom-1/3 left-3 w-0.5 h-0.5 bg-purple-300 rounded-full"></div>
          </>
        )}

        {/* Inactive Tech Elements */}
        {!isActive && (
          <>
            <div className="absolute top-2 right-2 w-1 h-1 bg-gray-600 opacity-40"></div>
            <div className="absolute bottom-2 left-2 w-1 h-1 bg-gray-600 opacity-40"></div>
          </>
        )}
      </div>
    </div>
  );
};

export default TopicCard;
