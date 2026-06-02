import { ReactNode } from 'react';
import { Play, Pause } from 'lucide-react';

export interface TwisterLine {
  id: number;
  text: ReactNode;
  ipa: ReactNode;
  rawText: string;
}

interface TwisterCardProps {
  line: TwisterLine;
  isActive: boolean;
  isPlaying: boolean;
  onPlay: () => void;
  showIpa: boolean;
}

export function TwisterCard({ line, isActive, isPlaying, onPlay, showIpa }: TwisterCardProps) {
  return (
    <article 
      onClick={onPlay}
      className={`tt-card ${isActive ? 'is-active' : ''}`}
    >
      {/* Active Left Border Accent */}
      {isActive && (
        <div className="tt-card-border-accent" />
      )}

      <div className="tt-card-content">
        {/* Main Text */}
        <div className="tt-card-text">
          {line.text}
        </div>

        {/* IPA Text */}
        {showIpa && (
          <div className="tt-card-ipa">
            {line.ipa}
          </div>
        )}
      </div>

      {/* Play/Pause Button */}
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onPlay();
        }}
        className="tt-card-play-btn"
      >
        {isPlaying ? (
          <Pause size={24} className="fill-current" />
        ) : (
          <Play size={24} className="tt-card-play-icon" />
        )}
      </button>
    </article>
  );
}
