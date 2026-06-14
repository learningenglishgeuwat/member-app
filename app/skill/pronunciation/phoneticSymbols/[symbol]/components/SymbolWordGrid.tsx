import React from 'react';
import { Play, Database, Copy } from 'lucide-react';
import type { WordExample } from '../../data/wordExamples/wordExamples';
import { symbolPositionMap } from '../../data/wordExamples/wordExamples';

interface SymbolWordGridProps {
  examples: WordExample[];
  symbolKey?: string;
  uiNote?: string | undefined;
  wordCardRefs: React.MutableRefObject<(HTMLButtonElement | null)[]>;
  activeWord: string | null;
  activeWordIndex: number | null;
  isPlayingAll: boolean;
  showIpa: boolean;
  showHighlight: boolean;
  isWordExamplesCopied: boolean;
  handleCopyWordExamples: () => void;
  toTourToken: (value: string) => string;
  renderWord: (word: string) => React.ReactNode;
  renderIpa: (ipa?: string, isBritishNoteOrAlternative?: boolean) => React.ReactNode;
  handlePlayWord: (word: string, index: number) => void;
  setActiveWord: React.Dispatch<React.SetStateAction<string | null>>;
  setActiveWordIndex: React.Dispatch<React.SetStateAction<number | null>>;
}

function normalizePosition(position?: WordExample['position']): 'B' | 'M' | 'E' | null {
  if (!position) return null;
  if (position === 'B' || position === 'M' || position === 'E') return position;
  if (position === 'beginning') return 'B';
  if (position === 'middle') return 'M';
  if (position === 'ending') return 'E';
  return null;
}

function getPositionBadge(
  letter: 'B' | 'M' | 'E'
): { letter: string; label: string; color: string } {
  const label = letter === 'B' ? 'Beginning' : letter === 'M' ? 'Middle' : 'Ending';
  const color =
    letter === 'B'
      ? 'bg-black text-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.25)] border border-emerald-400/20'
      : letter === 'M'
      ? 'bg-black text-amber-300 shadow-[0_0_18px_rgba(245,158,11,0.25)] border border-amber-300/20'
      : 'bg-black text-red-500 shadow-[0_0_18px_rgba(239,68,68,0.25)] border border-red-500/20';

  return { letter, label, color };
}

// Helper to get position for an index using metadata
function getPositionForIndex(
  index: number,
  symbolKey: string
): { letter: string; label: string; color: string } | null {
  // First check if symbol has explicit position metadata
  const ranges = symbolPositionMap[symbolKey];
  if (!ranges) return null;

  // Find which range this index falls into
  for (const range of ranges) {
    if (index >= range.start && index < range.end) {
      return getPositionBadge(range.position);
    }
  }

  return null;
}

export const SymbolWordGrid: React.FC<SymbolWordGridProps> = ({
  examples,
  symbolKey,
  uiNote,
  wordCardRefs,
  activeWord,
  activeWordIndex,
  isPlayingAll,
  showIpa,
  showHighlight,
  isWordExamplesCopied,
  handleCopyWordExamples,
  toTourToken,
  renderWord,
  renderIpa,
  handlePlayWord,
  setActiveWord,
  setActiveWordIndex,
}) => {
  function getPositionFromExample(
    position?: WordExample['position']
  ): { letter: string; label: string; color: string } | null {
    const normalized = normalizePosition(position);
    return normalized ? getPositionBadge(normalized) : null;
  }

  return (
    <>
      <div className="w-full scroll-mt-24 mt-12 md:mt-14">
        <div data-no-audio className="word-examples-section w-full max-w-6xl mx-auto p-2 md:p-4 z-10 relative">
        <div className="word-examples-header flex items-center justify-between mb-3 md:mb-5 border-b border-purple-500/30 pb-2">
          <div className="flex items-center gap-2">
            <Database className="text-purple-400" size={16} />
            <h3 className="text-xs md:text-lg font-display font-bold text-purple-400 tracking-widest uppercase">
              <button
                type="button"
                onClick={handleCopyWordExamples}
                data-tour="symbol-word-examples-copy"
                className="inline-flex items-center gap-2 hover:text-purple-300 transition-colors"
                title="Salin semua Word Examples (tanpa IPA)"
              >
                <span>Word_Examples</span>
                <Copy size={14} className="opacity-70" />
                <span className="font-mono text-[10px] md:text-xs normal-case tracking-normal opacity-70">
                  {isWordExamplesCopied ? 'Tersalin' : 'Salin'}
                </span>
              </button>
            </h3>
          </div>
          <button
            onClick={() => {
              const videoSection = document.querySelector('[data-video-section]');
              if (videoSection) {
                videoSection.scrollIntoView({
                  behavior: 'smooth',
                  block: 'center',
                });
              }
            }}
            data-tour="symbol-go-to-video"
            className="px-2.5 py-1 bg-purple-900/10 border border-purple-500/30 rounded text-purple-400 font-mono text-[10px] hover:bg-purple-900/20 transition-colors flex items-center gap-1"
          >
            <Play size={12} />
            <span>Go to Video</span>
          </button>
        </div>

        <div className="word-grid w-full">
          {examples.map((example, index) => {
            const isActiveByIndex = activeWordIndex === index;
            const isActiveByWord = activeWordIndex === null && example.word === activeWord;
            const isActive = isActiveByIndex || isActiveByWord;

            const positionData =
              getPositionFromExample(example.position) ||
              (symbolKey ? getPositionForIndex(index, symbolKey) : null);

            return (
              <button
                data-no-audio
                key={index}
                ref={(el) => {
                  wordCardRefs.current[index] = el;
                }}
                onClick={() => handlePlayWord(example.word, index)}
                onMouseEnter={() => {
                  if (isPlayingAll) return;
                  setActiveWord(example.word);
                  setActiveWordIndex(index);
                }}
                onMouseLeave={() => {
                  if (isPlayingAll) return;
                  setActiveWord(null);
                  setActiveWordIndex(null);
                }}
                data-tour={`symbol-word-${toTourToken(example.word)}`}
                className={`word-card relative group p-3 md:p-4 rounded-lg border transition-all duration-300 overflow-hidden w-full ${
                  isActive
                    ? 'active is-speaking bg-purple-900/40 border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)] scale-105 z-10'
                    : 'bg-black/40 border-purple-500/30 hover:bg-purple-900/30 hover:border-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)] hover:scale-102'
                } backdrop-blur-sm`}
              >
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                  <div
                    className="w-full h-full"
                    style={{
                      backgroundImage: `
                        linear-gradient(rgba(168, 85, 247, 0.3) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(168, 85, 247, 0.3) 1px, transparent 1px)
                      `,
                      backgroundSize: '8px 8px',
                    }}
                  ></div>
                </div>

                <div className={`absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 transition-all duration-300 z-10 ${
                  isActive ? 'border-purple-400 opacity-100' : 'border-purple-400/50 opacity-0 group-hover:opacity-100'
                }`}></div>
                <div className={`absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 transition-all duration-300 z-10 ${
                  isActive ? 'border-purple-400 opacity-100' : 'border-purple-400/50 opacity-0 group-hover:opacity-100'
                }`}></div>
                <div className={`absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 transition-all duration-300 z-10 ${
                  isActive ? 'border-purple-400 opacity-100' : 'border-purple-400/50 opacity-0 group-hover:opacity-100'
                }`}></div>

                <div className="flex flex-col items-center justify-center h-full z-10 relative px-1">
                  <span className="word-text font-sans font-bold text-base md:text-lg tracking-wide text-white transition-colors truncate w-full text-center">
                    {renderWord(example.word)}
                  </span>
                  {showIpa && (
                    <span
                      className={`word-ipa text-cyan-300 text-[10px] md:text-xs font-ipa mt-0.5 md:mt-1 truncate w-full text-center opacity-100`}
                      data-ipa
                    >
                      {example.britishIpa ? (
                        <>
                          <span className="text-cyan-300">BrE {renderIpa(example.britishIpa, true)}</span>
                          {' '}&rarr;{' '}
                          <span className="text-cyan-300 font-bold">AmE {renderIpa(example.americanIpa || example.ipa, true)}</span>
                        </>
                      ) : (
                        <>[{renderIpa(example.americanIpa || example.ipa)}]</>
                      )}
                    </span>
                  )}
                </div>

                {/* Position chip (top-left) - only show if position exists */}
                {positionData && (
                  <div className="absolute top-2 left-2 z-20">
                    <div
                      className={`relative flex items-center justify-center rounded-full w-6 h-6 md:w-7 md:h-7 font-bold text-[11px] ${positionData.color}`}
                      title={positionData.label}
                      aria-hidden="true"
                    >
                      <span className="absolute top-1 left-1 w-1 h-1 rounded-full bg-white/90"></span>
                      <span className="absolute top-1 right-1 w-1 h-1 rounded-full bg-white/90"></span>
                      <span className="absolute bottom-1 left-1 w-1 h-1 rounded-full bg-white/90"></span>
                      <span className="absolute bottom-1 right-1 w-1 h-1 rounded-full bg-white/90"></span>
                      <span className="absolute inset-0 rounded-full border border-white/10"></span>
                      <span className="relative z-10">{positionData.letter}</span>
                    </div>
                  </div>
                )}

              </button>
            );
          })}
        </div>
        </div>
      </div>
      {uiNote && (
        <div className="w-full flex justify-center mt-6 px-2 md:px-4">
          <div className="max-w-3xl w-full mx-auto rounded-md bg-black/70 border border-white/10 p-2 text-[12px] text-purple-200 text-center">
            {uiNote}
          </div>
        </div>
      )}
    </>
  );
};
