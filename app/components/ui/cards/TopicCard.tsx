'use client';

/**
 * TopicCard - Pronunciation topic selection card
 * 
 * Refactored to use BaseCard component
 * 
 * Usage:
 * import { TopicCard } from '@/app/components/cards';
 * 
 * <TopicCard
 *   topic={topic}
 *   isActive={activeTopicId === topic.id}
 *   onClick={() => setActiveTopic(topic.id)}
 *   style={{ transform: `translateX(${offset}px)` }}
 * />
 */

import React from 'react';
import { BaseCard } from './BaseCard';
import type { Topic } from '@/app/skill/pronunciation/types';
import { LOCKED_TOPIC_IDS } from '@/app/skill/pronunciation/constants';

export interface TopicCardProps {
  topic: Topic;
  isActive: boolean;
  onClick: () => void;
  style?: React.CSSProperties;
}

export const TopicCard: React.FC<TopicCardProps> = ({ 
  topic, 
  isActive, 
  onClick, 
  style 
}) => {
  const isDisabled = LOCKED_TOPIC_IDS.includes(topic.id);
  
  return (
    <BaseCard
      onClick={onClick}
      isActive={isActive}
      isDisabled={isDisabled}
      showRing={isActive}
      showGrid={true}
      showDecorations={true}
      showGrayscale={isDisabled}
      variant="default"
      data-tour={`pronunciation-topic-${topic.id}`}
      style={style}
      className={[
        // Positioning
        'absolute left-1/2 bottom-0 flex-shrink-0',
        
        // Size variants based on state
        isDisabled 
          ? 'w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 mt-6 sm:mt-12 md:mt-16 lg:mt-20' 
          : isActive 
            ? 'w-32 h-44 sm:w-40 sm:h-52 md:w-44 md:h-60 lg:w-48 lg:h-64' 
            : 'w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 mt-6 sm:mt-12 md:mt-16 lg:mt-20',
        
        // Special shadow for active
        isActive && 'shadow-purple-900/50',
      ].filter(Boolean).join(' ')}
    >
      <div className="flex flex-col justify-end p-2 sm:p-3 md:p-4 h-full">
        {/* Icon Container */}
        <div 
          className={[
            'flex items-center justify-center',
            'font-display font-bold text-white shadow-lg mb-2',
            `bg-gradient-to-br ${topic.color}`,
            topic.cssClass || '',
            isActive 
              ? 'w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 lg:w-12 lg:h-12 text-sm sm:text-base md:text-lg lg:text-xl' 
              : 'w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-xs',
            isDisabled && 'opacity-50',
          ].filter(Boolean).join(' ')}
          style={{ 
            clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)' 
          }}
        >
          {topic.icon}
        </div>

        {/* Title */}
        <h3 className={[
          'orbitron-card-title',
          'font-display font-bold uppercase tracking-wider',
          isActive 
            ? 'text-[10px] sm:text-sm md:text-base lg:text-lg text-white' 
            : 'text-[10px] text-gray-400',
          isDisabled && 'text-gray-500',
        ].filter(Boolean).join(' ')}>
          {topic.title}
          {isDisabled && (
            <span className="block text-[8px] text-red-400 mt-1">(Locked)</span>
          )}
        </h3>

        {/* Description (only when active) */}
        {isActive && (
          <p className="pronunciation-topic-card-desc text-[0.75rem] sm:text-[9px] md:text-[10px] lg:text-xs mt-1 font-light tracking-wide animate-fade-in-up line-clamp-2 md:line-clamp-none text-gray-300">
            {topic.shortDesc}
          </p>
        )}
      </div>
    </BaseCard>
  );
};

export default TopicCard;
