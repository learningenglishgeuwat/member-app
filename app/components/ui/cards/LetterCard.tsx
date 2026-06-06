'use client';

/**
 * LetterCard - Alphabet letter display card
 * 
 * Refactored to use BaseCard component
 * 
 * Features:
 * - Playing state animation
 * - IPA display toggle
 * - Haptic feedback
 * - Auto-scroll on play
 * 
 * Usage:
 * import { LetterCard } from '@/app/components/cards';
 * 
 * <LetterCard
 *   letter="A"
 *   ipa="eɪ"
 *   isPlaying={playingLetter === 'A'}
 *   onPlay={() => playLetter('A')}
 *   showIpa={showIpaState}
 * />
 */

import React, { useRef, useEffect } from 'react';
import { BaseCard } from './BaseCard';
import { useHaptic } from '@/lib/haptic/useHaptic';
import { IpaText } from '@/app/components/features/pronunciation/IpaText/IpaText';

export interface LetterCardProps {
  letter: string;
  ipa: string;
  isPlaying: boolean;
  onPlay: () => void;
  showIpa?: boolean;
  className?: string;
}

export const LetterCard: React.FC<LetterCardProps> = ({ 
  letter, 
  ipa,
  isPlaying, 
  onPlay,
  showIpa = true,
  className = '',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { triggerHaptic } = useHaptic();

  const handleClick = () => {
    console.log('LetterCard clicked, triggering haptic');
    triggerHaptic('tap');
    onPlay();
  };

  // Auto-scroll to playing card
  useEffect(() => {
    if (isPlaying && cardRef.current) {
      cardRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
    }
  }, [isPlaying]);

  return (
    <BaseCard
      ref={cardRef}
      onClick={handleClick}
      isPlaying={isPlaying}
      showScanline={isPlaying}
      showGrid={true}
      showDecorations={isPlaying}
      variant="default"
      data-tour={`alphabet-letter-${letter.toLowerCase()}`}
      className={[
        'alphabet-letter-card',
        'w-24 h-32 sm:w-32 sm:h-40',
        isPlaying && 'playing ring-2 ring-cyan-500/50',
        className,
      ].filter(Boolean).join(' ')}
    >
      <div className="flex flex-col items-center justify-center h-full gap-2 p-4">
        {/* Letter */}
        <div className={[
          'alphabet-letter',
          'text-4xl sm:text-5xl md:text-6xl',
          'font-display font-bold',
          'transition-all duration-300',
          isPlaying ? 'text-cyan-400 scale-110' : 'text-white',
        ].join(' ')}>
          {letter}
        </div>

        {/* IPA Text */}
        {showIpa && (
          <IpaText 
            as="div" 
            className={[
              'alphabet-ipa',
              'text-sm sm:text-base',
              'transition-colors duration-300',
              isPlaying ? 'text-cyan-400' : 'text-cyan-400/70',
            ].join(' ')} 
            aria-label={ipa}
          >
            <span className="opacity-50 mr-1">[</span>
            {ipa}
            <span className="opacity-50 ml-1">]</span>
          </IpaText>
        )}
      </div>
    </BaseCard>
  );
};

export default LetterCard;
