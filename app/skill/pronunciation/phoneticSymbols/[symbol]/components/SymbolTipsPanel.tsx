import React from 'react';
import { Lightbulb, ChevronDown, Copy } from 'lucide-react';

interface SymbolTipsPanelProps {
  isTipsOpen: boolean;
  setIsTipsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  tips: string[];
  isMissionCopied: boolean;
  handleCopyMission: () => void;
}

export const SymbolTipsPanel: React.FC<SymbolTipsPanelProps> = ({
  isTipsOpen,
  setIsTipsOpen,
  tips,
  isMissionCopied,
  handleCopyMission,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-6">
      <div
        className="symbol-detail-collapsible-panel bg-black/85 border border-cyber-cyan/40 rounded-lg overflow-hidden shadow-[0_0_24px_rgba(6,182,212,0.15)]"
        style={{ '--panel-glow-rgb': '6, 182, 212' } as React.CSSProperties}
      >
        <button
          type="button"
          onClick={() => setIsTipsOpen((prev) => !prev)}
          data-tour="symbol-practice-section-toggle"
          className="w-full bg-cyber-cyan/10 px-4 py-2 border-b border-cyber-cyan/30 flex items-center justify-between gap-2 text-left hover:bg-cyber-cyan/15 transition-colors"
          aria-expanded={isTipsOpen}
        >
          <div className="flex items-center gap-2">
            <Lightbulb className="text-cyber-cyan" size={16} />
            <span className="ml-2 font-display text-[10px] md:text-xs text-cyber-cyan tracking-wider">PRACTICE</span>
          </div>
          <span className="symbol-detail-chevron-toggle text-cyber-cyan">
            <ChevronDown
              size={14}
              className={`symbol-detail-chevron-icon ${isTipsOpen ? 'is-open' : ''}`}
            />
          </span>
        </button>
        {isTipsOpen && (
          <div className="p-3 md:p-5 text-[11px] md:text-sm text-gray-200 leading-relaxed">
            <p>
              <strong>Mission:</strong>
              <br />
              Buka AI assistant seperti{' '}
              <a
                href="https://gemini.google.com/app"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyber-cyan hover:text-white underline decoration-cyber-cyan/50 underline-offset-2 transition-colors"
              >
                Gemini
              </a>
              , rekam ucapan untuk semua kata di Word_Examples, dan berikan prompt di bawah untuk dinilai.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleCopyMission}
                className="inline-flex items-center gap-1.5 rounded border border-cyber-cyan/40 bg-cyber-cyan/10 px-3 py-1.5 text-[11px] md:text-sm font-mono text-cyber-cyan hover:bg-cyber-cyan/20 transition-colors"
                title="Salin Words dan Prompt"
              >
                <Copy size={14} />
                <span>{isMissionCopied ? 'Tersalin!' : 'Salin Words & Prompt'}</span>
              </button>
            </div>
            {tips.length > 0 && (
              <div className="mt-4 space-y-2">
                {tips.map((tip, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <span className="text-green-400 block">{index + 1}.</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
