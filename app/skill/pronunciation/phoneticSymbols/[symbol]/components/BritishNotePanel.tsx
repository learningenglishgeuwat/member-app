import React from 'react';
import { Play } from 'lucide-react';

export type BritishWordNote = {
  word: string;
  britishIpa: string;
  americanIpa: string;
};

export type BritishSymbolNote = {
  description: string;
  items: BritishWordNote[];
};

interface BritishNotePanelProps {
  britishNote: BritishSymbolNote;
  activeWord: string | null;
  britishNoteItemRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  showIpa: boolean;
  showHighlight: boolean;
  renderBritishNoteWord: (word: string) => React.ReactNode;
  renderIpa: (ipa?: string, isBritishNoteOrAlternative?: boolean) => React.ReactNode;
  handlePlayBritishNoteWord: (word: string, index: number) => void;
  handlePlayAmericanNoteWord: (word: string, index: number) => void;
}

export const BritishNotePanel: React.FC<BritishNotePanelProps> = ({
  britishNote,
  activeWord,
  britishNoteItemRefs,
  showIpa,
  showHighlight,
  renderBritishNoteWord,
  renderIpa,
  handlePlayBritishNoteWord,
  handlePlayAmericanNoteWord,
}) => {
  return (
    <div id="britishNote" className="w-full max-w-4xl mx-auto mt-2 mb-2">
      <div
        className="symbol-detail-collapsible-panel bg-black/80 border border-amber-400/40 rounded-lg overflow-hidden shadow-[0_0_24px_rgba(251,191,36,0.18)]"
        style={{ '--panel-glow-rgb': '251, 191, 36' } as React.CSSProperties}
      >
        <div className="bg-amber-400/10 px-4 py-2 border-b border-amber-400/30 flex justify-between items-center">
          <span className="font-display text-[10px] md:text-xs text-amber-300 tracking-wider">CATATAN (UK vs US)</span>
        </div>
        <div className="p-3 md:p-4 text-xs md:text-sm text-gray-200">
          <p className="mb-3">{britishNote.description}</p>
          <div className="space-y-2">
            {britishNote.items.map((item, itemIndex) => {
              const isItemActive = activeWord === item.word;
              return (
                <div
                  key={item.word}
                  ref={(el) => {
                    britishNoteItemRefs.current[itemIndex] = el;
                  }}
                  className={`rounded-md border ${
                    isItemActive ? 'border-amber-400 bg-amber-400/20' : 'border-amber-300/20 bg-amber-400/5'
                  } px-3 py-2 transition-colors`}
                >
                  <div className="font-semibold text-white">{renderBritishNoteWord(item.word)}</div>
                  {showIpa && (
                    <div className="text-cyan-300/60 font-mono text-xs">
                      BrE <span className="text-cyan-300/80 font-medium">{renderIpa(item.britishIpa, true)}</span>
                      {' '}&rarr; AmE <span className="text-cyan-300 font-bold">{renderIpa(item.americanIpa, true)}</span>
                    </div>
                  )}
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      onClick={() => handlePlayBritishNoteWord(item.word, itemIndex)}
                      className="inline-flex items-center gap-1 rounded-md border border-amber-300/40 bg-amber-400/10 px-2 py-1 text-[11px] text-amber-200 hover:bg-amber-400/20 transition-colors"
                      title={`Play BrE: ${item.word}`}
                    >
                      <Play size={12} />
                      <span>BrE</span>
                    </button>
                    <button
                      onClick={() => handlePlayAmericanNoteWord(item.word, itemIndex)}
                      className="inline-flex items-center gap-1 rounded-md border border-cyan-300/40 bg-cyan-400/10 px-2 py-1 text-[11px] text-cyan-200 hover:bg-cyan-400/20 transition-colors"
                      title={`Play AmE: ${item.word}`}
                    >
                      <Play size={12} />
                      <span>AmE</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
