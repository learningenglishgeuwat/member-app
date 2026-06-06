'use client';

/**
 * ContentCard - Generic content card for text display
 * 
 * Flexible card for displaying text content with optional:
 * - IPA text
 * - Play/pause button
 * - Active border accent
 * - Custom actions
 * 
 * Usage:
 * import { ContentCard } from '@/app/components/cards';
 * 
 * <ContentCard
 *   isActive={activeId === item.id}
 *   isPlaying={playingId === item.id}
 *   onPlay={() => play(item.id)}
 *   showIpa={showIpaState}
 * >
 *   <h3>Content Title</h3>
 *   <p>Content body...</p>
 * </ContentCard>
 */

import React, { ReactNode } from 'react';
import { BaseCard } from './BaseCard';
import { Play, Pause } from 'lucide-react';

export interface ContentCardProps {
  // State
  isActive?: boolean;
  isPlaying?: boolean;
  
  // Actions
  onPlay?: () => void;
  onClick?: () => void;
  
  // Content
  children: ReactNode;
  
  // Visual Options
  showPlayButton?: boolean;
  showBorderAccent?: boolean;
  showIpa?: boolean;
  
  // Layout
  className?: string;
  
  // Accessibility
  'data-tour'?: string;
  'aria-label'?: string;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  isActive = false,
  isPlaying = false,
  onPlay,
  onClick,
  children,
  showPlayButton = true,
  showBorderAccent = true,
  showIpa = true,
  className = '',
  'data-tour': dataTour,
  'aria-label': ariaLabel,
}) => {
  const handleCardClick = () => {
    if (onClick) {
      onClick();
    } else if (onPlay) {
      onPlay();
    }
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onPlay) {
      onPlay();
    }
  };

  return (
    <BaseCard
      onClick={handleCardClick}
      isActive={isActive}
      isPlaying={isPlaying}
      showScanline={isPlaying}
      showGrid={false}
      showDecorations={false}
      variant="minimal"
      data-tour={dataTour}
      aria-label={ariaLabel}
      className={[
        'content-card',
        'relative',
        'transition-all duration-300',
        isActive && 'border-cyan-500/50',
        className,
      ].filter(Boolean).join(' ')}
    >
      {/* Active Left Border Accent */}
      {showBorderAccent && isActive && (
        <div 
          className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 via-cyan-400 to-cyan-600"
          aria-hidden="true"
        />
      )}

      {/* Content Container */}
      <div className={[
        'content-card-body',
        'relative flex items-center gap-3 sm:gap-4',
        'p-3 sm:p-4 md:p-5',
        showPlayButton ? 'pr-12 sm:pr-14' : '',
      ].filter(Boolean).join(' ')}>
        {children}
      </div>

      {/* Play/Pause Button */}
      {showPlayButton && onPlay && (
        <button 
          onClick={handlePlayClick}
          className={[
            'absolute right-3 sm:right-4',
            'top-1/2 -translate-y-1/2',
            'flex items-center justify-center',
            'w-10 h-10 sm:w-12 sm:h-12',
            'rounded-full',
            'transition-all duration-300',
            'hover:scale-110',
            isPlaying 
              ? 'bg-cyan-500/20 text-cyan-400' 
              : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white',
          ].filter(Boolean).join(' ')}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <Pause size={24} className="fill-current" />
          ) : (
            <Play size={24} className="translate-x-0.5" />
          )}
        </button>
      )}
    </BaseCard>
  );
};

export default ContentCard;
