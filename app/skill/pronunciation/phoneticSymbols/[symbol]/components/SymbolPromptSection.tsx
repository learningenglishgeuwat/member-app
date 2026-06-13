import React from 'react';
import { HelpCircle, ChevronDown, Copy } from 'lucide-react';

interface SymbolPromptSectionProps {
  accentEvaluationPrompt: string;
  isPromptOpen: boolean;
  setIsPromptOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleCopyPrompt: () => void;
  isPromptCopied: boolean;
}

export const SymbolPromptSection: React.FC<SymbolPromptSectionProps> = ({
  accentEvaluationPrompt,
  isPromptOpen,
  setIsPromptOpen,
  handleCopyPrompt,
  isPromptCopied,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-6">
      <div
        className="symbol-detail-collapsible-panel bg-black/85 border border-white/60 hover:border-purple-500 transition-colors rounded-lg overflow-hidden shadow-[0_0_24px_rgba(168,85,247,0.15)] hover:shadow-[0_0_24px_rgba(168,85,247,0.25)]"
        style={{ '--panel-glow-rgb': '168, 85, 247' } as React.CSSProperties}
      >
        <div className="bg-white/5 px-4 py-2 border-b border-white/40 hover:border-purple-500 transition-colors flex items-center justify-between gap-3 group">
          <div className="flex items-center gap-2">
            <HelpCircle className="text-white" size={16} />
            <span className="ml-2 font-display text-[10px] md:text-xs text-white tracking-wider">PROMPT</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPromptOpen((prev) => !prev)}
              data-tour="symbol-prompt-section-toggle"
              className="symbol-detail-chevron-toggle text-cyber-pink hover:bg-cyber-pink/20 transition-colors"
              aria-expanded={isPromptOpen}
              title={isPromptOpen ? 'Tutup Prompt' : 'Buka Prompt'}
            >
              <ChevronDown
                size={13}
                className={`symbol-detail-chevron-icon ${isPromptOpen ? 'is-open' : ''}`}
              />
            </button>
            <button
              type="button"
              onClick={handleCopyPrompt}
              data-tour="symbol-prompt-copy-button"
              className="inline-flex items-center gap-1.5 rounded border border-cyber-pink/40 bg-cyber-pink/10 px-2 py-1 text-[10px] md:text-xs font-mono text-cyber-pink hover:bg-cyber-pink/20 transition-colors"
              title="Salin prompt"
            >
              <Copy size={13} />
              <span>{isPromptCopied ? 'Tersalin' : 'Salin Prompt'}</span>
            </button>
          </div>
        </div>

        {isPromptOpen && (
          <div className="p-3 md:p-5">
            <p className="text-[11px] md:text-sm text-gray-200 leading-relaxed whitespace-pre-line">
              &quot;{accentEvaluationPrompt}&quot;
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
