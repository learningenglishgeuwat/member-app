'use client'

import React, { useRef, useEffect } from 'react';

interface LetterCardProps {
  letter: string;
  ipa: string;
  isPlaying: boolean;
  onPlay: () => void;
}

export const LetterCard: React.FC<LetterCardProps> = ({ 
  letter, 
  ipa,
  isPlaying, 
  onPlay 
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

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
      onClick={onPlay}
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

      <div className="alphabet-ipa">
        <span className="opacity-50 mr-1">[</span>
        {ipa}
        <span className="opacity-50 ml-1">]</span>
      </div>
      
      {/* Scanline effect when playing */}
      {isPlaying && (
        <div className="scanline-effect"></div>
      )}
    </div>
  );
};
