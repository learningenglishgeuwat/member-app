'use client';

/**
 * BaseCard - Komponen card dasar dengan tech/cyberpunk theme
 * 
 * Digunakan sebagai base untuk semua card variants di aplikasi:
 * - TopicCard (pronunciation topic selection)
 * - LetterCard (alphabet letters)
 * - ContentCard (text content display)
 * - TwisterCard (tongue twister)
 * 
 * Features:
 * - Tech grid background
 * - Active/inactive states
 * - Hover effects
 * - Corner decorations
 * - Scanline animations
 * - Playing state animations
 */

import React, { ReactNode, forwardRef } from 'react';

export interface BaseCardProps {
  // Layout
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  
  // State
  isActive?: boolean;
  isDisabled?: boolean;
  isPlaying?: boolean;
  
  // Visual Features
  showDecorations?: boolean;
  showGrid?: boolean;
  showRing?: boolean;
  showScanline?: boolean;
  showGrayscale?: boolean;
  
  // Theme
  variant?: 'default' | 'minimal' | 'elevated';
  
  // Content
  children: ReactNode;
  
  // Accessibility
  'data-tour'?: string;
  'aria-label'?: string;
  role?: string;
}

export const BaseCard = forwardRef<HTMLDivElement, BaseCardProps>(({
  className = '',
  style,
  onClick,
  isActive = false,
  isDisabled = false,
  isPlaying = false,
  showDecorations = true,
  showGrid = true,
  showRing = false,
  showScanline = false,
  showGrayscale = false,
  variant = 'default',
  children,
  'data-tour': dataTour,
  'aria-label': ariaLabel,
  role = 'article',
}, ref) => {
  const handleClick = () => {
    if (isDisabled || !onClick) return;
    onClick();
  };

  const isInteractive = !!onClick && !isDisabled;

  return (
    <div
      ref={ref}
      onClick={handleClick}
      data-tour={dataTour}
      aria-label={ariaLabel}
      role={role}
      style={style}
      className={[
        // Base styles
        'base-card',
        'relative rounded-xl overflow-hidden',
        'border border-white/10',
        'transition-all duration-500',
        
        // State styles
        isDisabled && 'opacity-40 cursor-not-allowed',
        showGrayscale && 'grayscale',
        isInteractive && 'cursor-pointer',
        isActive && 'scale-105',
        
        // Variant styles
        variant === 'default' && 'bg-slate-800',
        variant === 'minimal' && 'bg-slate-900',
        variant === 'elevated' && 'shadow-2xl',
        
        // Hover (only if interactive and not disabled)
        isInteractive && !isDisabled && 'hover:opacity-80 hover:border-white/20',
        
        // Custom classes
        className,
      ].filter(Boolean).join(' ')}
    >
      {/* Active Ring */}
      {showRing && isActive && (
        <div 
          className="absolute -inset-4 rounded-xl opacity-50 blur-sm animate-pulse"
          style={{
            background: 'radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%)',
          }}
        />
      )}

      {/* Card Body */}
      <div className={[
        'relative w-full h-full',
        'transition-colors duration-500',
        isActive ? 'bg-black' : variant === 'minimal' ? 'bg-slate-900' : 'bg-slate-800',
      ].join(' ')}>
        
        {/* Tech Grid Pattern */}
        {showGrid && (
          <>
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90 z-10 pointer-events-none" />
            
            {/* Grid pattern */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div 
                className="w-full h-full"
                style={{
                  backgroundImage: `
                    linear-gradient(0deg, transparent 24%, rgba(147,51,234,.1) 25%, rgba(147,51,234,.1) 26%, transparent 27%, transparent 74%, rgba(147,51,234,.1) 75%, rgba(147,51,234,.1) 76%, rgba(147,51,234,.1) 77%, transparent),
                    linear-gradient(90deg, transparent 24%, rgba(147,51,234,.1) 25%, rgba(147,51,234,.1) 26%, transparent 27%, transparent 74%, rgba(147,51,234,.1) 75%, rgba(147,51,234,.1) 76%, rgba(147,51,234,.1) 77%, transparent)
                  `,
                  backgroundSize: '30px 30px',
                }}
              />
            </div>
          </>
        )}

        {/* Content */}
        <div className="relative z-20 w-full h-full">
          {children}
        </div>

        {/* Tech Decorations (Active state) */}
        {showDecorations && isActive && (
          <>
            {/* Corner dots */}
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full animate-pulse bg-purple-400/60 pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-1 h-1 bg-purple-400/40 pointer-events-none" />
            <div className="absolute top-2 left-2 w-1 h-1 bg-purple-400/40 pointer-events-none" />
            
            {/* Tech lines */}
            <div className="absolute top-1/2 right-1 w-px h-4 opacity-60 bg-purple-400 pointer-events-none" />
            <div className="absolute bottom-1/2 left-1 w-px h-4 opacity-60 bg-purple-400 pointer-events-none" />
            
            {/* Small tech dots */}
            <div className="absolute top-1/3 right-3 w-0.5 h-0.5 rounded-full bg-purple-400/50 pointer-events-none" />
            <div className="absolute bottom-1/3 left-3 w-0.5 h-0.5 rounded-full bg-purple-400/50 pointer-events-none" />
          </>
        )}

        {/* Inactive decorations */}
        {showDecorations && !isActive && !isDisabled && (
          <>
            <div className="absolute top-2 right-2 w-1 h-1 bg-gray-600 opacity-40 pointer-events-none" />
            <div className="absolute bottom-2 left-2 w-1 h-1 bg-gray-600 opacity-40 pointer-events-none" />
          </>
        )}

        {/* Scanline effect (Playing state) */}
        {showScanline && isPlaying && (
          <div 
            className="absolute inset-0 pointer-events-none animate-scan"
            style={{
              background: 'linear-gradient(to bottom, transparent 0%, rgba(6,182,212,0.1) 50%, transparent 100%)',
            }}
          />
        )}
      </div>
    </div>
  );
});

BaseCard.displayName = 'BaseCard';

export default BaseCard;
