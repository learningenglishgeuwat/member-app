'use client';

/**
 * TwisterCard - Tongue twister display card
 * 
 * Refactored to use ContentCard (which uses BaseCard)
 * 
 * Usage:
 * import { TwisterCard } from '@/app/components/cards';
 * 
 * <TwisterCard
 *   line={twisterLine}
 *   isActive={activeId === line.id}
 *   isPlaying={playingId === line.id}
 *   onPlay={() => play(line.id)}
 *   showIpa={showIpaState}
 * />
 */

import React, { ReactNode } from 'react';
import { ContentCard } from './ContentCard';

export interface TwisterLine {
  id: number;
  text: ReactNode;
  ipa: ReactNode;
  rawText: string;
}

export interface TwisterCardProps {
  line: TwisterLine;
  isActive: boolean;
  isPlaying: boolean;
  onPlay: () => void;
  showIpa: boolean;
  className?: string;
}

export const TwisterCard: React.FC<TwisterCardProps> = ({ 
  line, 
  isActive, 
  isPlaying, 
  onPlay, 
  showIpa,
  className = '',
}) => {
  return (
    <ContentCard
      isActive={isActive}
      isPlaying={isPlaying}
      onPlay={onPlay}
      showPlayButton={true}
      showBorderAccent={true}
      data-tour={`twister-line-${line.id}`}
      className={[
        'tt-card',
        isActive && 'is-active',
        className,
      ].filter(Boolean).join(' ')}
    >
      {/* Content Section */}
      <div className="flex-1 flex flex-col gap-2">
        {/* Main Text */}
        <div className="tt-card-text text-white/95 text-sm sm:text-base leading-relaxed">
          {line.text}
        </div>

        {/* IPA Text */}
        {showIpa && (
          <div className="tt-card-ipa text-cyan-400/80 text-xs sm:text-sm font-mono">
            {line.ipa}
          </div>
        )}
      </div>
    </ContentCard>
  );
};

export default TwisterCard;
