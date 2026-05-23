'use client'

import React, { useRef, useEffect } from 'react';
import { useHaptic } from '@/lib/haptic/useHaptic';
import { IpaText } from '@/app/components/IpaText';

interface LetterCardProps {
  letter: string;
  ipa: string;
  isPlaying: boolean;
  onPlay: () => void;
  showIpa?: boolean;
}

export const LetterCard: React.FC<LetterCardProps> = ({ 
  letter, 
  ipa,
  isPlaying, 
  onPlay,
  showIpa = true
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const { triggerHaptic } = useHaptic();

  const handleClick = () => {
    console.log('LetterCard clicked, triggering haptic');
    triggerHaptic('tap');
    onPlay();
  };

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
    <div 
      ref={cardRef}
      onClick={handleClick}
      data-tour={`alphabet-letter-${letter.toLowerCase()}`}
      className={`alphabet-letter-card ${isPlaying ? 'playing' : ''}`}
    >
      {/* Background Grid */}
      <div className="bg-grid"></div>
      
      {/* Tech Decorative Corners */}
      <div className="tech-corner-tl"></div>
      <div className="tech-corner-br"></div>

      <div className="alphabet-letter">
        {letter}
      </div>

      {showIpa && (
        <IpaText as="div" className="alphabet-ipa" aria-label={ipa}>
          <span className="opacity-50 mr-1">[</span>
          {ipa}
          <span className="opacity-50 ml-1">]</span>
        </IpaText>
      )}
      
      {/* Scanline effect when playing */}
      {isPlaying && (
        <div className="scanline-effect"></div>
      )}
    </div>
  );
};
