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
      className={`
        relative overflow-hidden cursor-pointer
        bg-[#1a1b22] border rounded-lg p-6 
        flex items-center justify-between group transition-all duration-300
        ${isActive 
          ? 'border-[#00f3ff] shadow-[0_0_20px_rgba(0,243,255,0.4)]' 
          : 'border-[rgba(0,243,255,0.3)] hover:border-[#00f3ff] hover:shadow-[0_0_15px_rgba(0,243,255,0.3)]'}
      `}
    >
      {/* Active Left Border Accent */}
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#00f3ff]" style={{ boxShadow: '0 0 10px #00f3ff' }} />
      )}

      <div className="flex flex-col gap-2 z-10 w-full pr-4">
        {/* Main Text */}
        <div className={`font-display text-2xl font-bold leading-snug tracking-tight transition-opacity ${isActive ? 'text-[#e3e2e8] opacity-100' : 'text-gray-300 opacity-80 group-hover:opacity-100'}`}>
          {line.text}
        </div>

        {/* IPA Text */}
        {showIpa && (
          <div className={`font-mono text-lg leading-relaxed pt-2 mt-1 border-t border-[rgba(52,52,57,0.5)] transition-opacity text-[#00f3ff] ${isActive ? 'opacity-90' : 'opacity-70 group-hover:opacity-100'}`}>
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
        className={`
          flex-shrink-0 ml-4 w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
          ${isActive 
            ? 'bg-[rgba(0,243,255,0.1)] border border-[#00f3ff] text-[#00f3ff] hover:bg-[#00f3ff] hover:text-[#0b0c10]' 
            : 'bg-transparent border border-[#343439] text-gray-400 group-hover:border-[#00f3ff] group-hover:text-[#00f3ff]'}
        `}
        style={isActive ? { boxShadow: '0 0 10px rgba(0, 243, 255, 0.2)' } : {}}
      >
        {isPlaying ? (
          <Pause size={24} className="fill-current" />
        ) : (
          <Play size={24} className="ml-1" />
        )}
      </button>
    </article>
  );
}
