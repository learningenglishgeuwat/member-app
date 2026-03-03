'use client';

import { useEffect } from 'react';

type VocabularyPracticeMissionModalProps = {
  open: boolean;
  onClose: () => void;
  missionText: string;
  exampleWord: string;
  exampleSentence: string;
  exampleMeaning: string;
};

export default function VocabularyPracticeMissionModal({
  open,
  onClose,
  missionText,
  exampleWord,
  exampleSentence,
  exampleMeaning,
}: VocabularyPracticeMissionModalProps) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, open]);

  if (!open) return null;

  return (
    <div
      className="vocab-practice-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Practice mission"
      onClick={onClose}
    >
      <section className="vocab-practice-modal" onClick={(event) => event.stopPropagation()}>
        <header className="vocab-practice-modal-header">
          <h2 className="vocab-practice-modal-title">Practice</h2>
          <button
            type="button"
            className="vocab-practice-modal-close"
            onClick={onClose}
            aria-label="Close practice modal"
          >
            x
          </button>
        </header>

        <div className="vocab-practice-modal-body">
          <span className="vocab-practice-chip">Mission:</span>
          <p className="vocab-practice-mission-text">{missionText}</p>

          <span className="vocab-practice-chip">Contoh dari topic ini:</span>

          <div className="vocab-practice-example-row">
            <span className="vocab-practice-example-label">Word:</span>
            <span className="vocab-practice-example-value">{exampleWord}</span>
          </div>
          <div className="vocab-practice-example-row">
            <span className="vocab-practice-example-label">Meaning:</span>
            <span className="vocab-practice-example-value">{exampleMeaning}</span>
          </div>
          <div className="vocab-practice-example-row">
            <span className="vocab-practice-example-label">Sentence:</span>
            <span className="vocab-practice-example-value">{exampleSentence}</span>
          </div>
        </div>
      </section>
    </div>
  );
}

