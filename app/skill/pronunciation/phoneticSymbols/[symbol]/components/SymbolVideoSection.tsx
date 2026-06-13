import React from 'react';
import { Play, Database, ChevronDown } from 'lucide-react';

interface SymbolVideoSectionProps {
  decodedSymbol: string;
  videoEmbedSrc: string;
  videoId?: string | null;
  isVideoOpen: boolean;
  shouldAutoplayVideo: boolean;
  setIsVideoOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setShouldAutoplayVideo: React.Dispatch<React.SetStateAction<boolean>>;
  scrollToWordExamples: () => void;
}

export const SymbolVideoSection: React.FC<SymbolVideoSectionProps> = ({
  decodedSymbol,
  videoEmbedSrc,
  videoId,
  isVideoOpen,
  shouldAutoplayVideo,
  setIsVideoOpen,
  setShouldAutoplayVideo,
  scrollToWordExamples,
}) => {
  if (!videoId) return null;

  return (
    <div data-video-section className="w-full max-w-4xl mx-auto mt-6">
      <div
        className="symbol-detail-collapsible-panel bg-black/90 border border-white/60 hover:border-purple-500 transition-colors rounded-lg overflow-hidden shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:shadow-[0_0_30px_rgba(168,85,247,0.35)]"
        style={{ '--panel-glow-rgb': '168, 85, 247' } as React.CSSProperties}
      >
        <div className="bg-white/5 px-4 py-2 flex justify-between items-center border-b border-white/40 hover:border-purple-500 transition-colors">
          <div className="flex items-center gap-2">
            <Play className="text-white" size={16} />
            <span className="ml-2 font-display text-[10px] md:text-xs text-white tracking-wider">VIDEO_TUTORIAL</span>
            <span className="text-xs font-display text-white/60">Symbol:{' '}<span className="font-ipa" data-ipa>/{decodedSymbol}/</span></span>
          </div>
          <button
            type="button"
            onClick={() =>
              setIsVideoOpen((prev) => {
                const next = !prev;
                setShouldAutoplayVideo(next);
                return next;
              })
            }
            data-tour="symbol-video-section-toggle"
            className="symbol-detail-chevron-toggle text-white hover:text-purple-300 transition-colors"
            aria-expanded={isVideoOpen}
            title={isVideoOpen ? 'Tutup Video Tutorial' : 'Buka Video Tutorial'}
          >
            <ChevronDown
              size={14}
              className={`symbol-detail-chevron-icon ${isVideoOpen ? 'is-open' : ''}`}
            />
          </button>
        </div>

        {isVideoOpen && (
          <div className="p-3 md:p-5">
            <div data-tour="symbol-video-embed" className="relative w-full" style={{ paddingBottom: '35%' }}>
              <iframe
                key={`${videoId || 'no-video'}-${isVideoOpen ? 'open' : 'closed'}-${shouldAutoplayVideo ? 'autoplay' : 'manual'}`}
                data-tour="symbol-video-embed-frame"
                className="absolute top-0 left-0 w-full h-full rounded-lg border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.2)]"
                src={videoEmbedSrc}
                title={`Pronunciation tutorial for /${decodedSymbol}/`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            <div className="flex justify-center mt-3">
              <button
                onClick={scrollToWordExamples}
                data-tour="symbol-go-to-word-examples"
                className="px-3 py-2 bg-purple-900/10 border border-purple-500/30 rounded text-purple-400 font-mono text-[11px] hover:bg-purple-900/20 transition-colors flex items-center gap-2"
              >
                <Database size={14} />
                <span>Go to Word Examples</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
