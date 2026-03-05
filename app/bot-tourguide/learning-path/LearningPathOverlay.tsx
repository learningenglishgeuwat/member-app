'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import PronunciationRoadmapModal from '../../dashboard/components/TutorialContent/PronunciationRoadmapModal';
import SpeakingRoadmapModal from '../../dashboard/components/TutorialContent/SpeakingRoadmapModal';
import VocabularyRoadmapModal from '../../dashboard/components/TutorialContent/VocabularyRoadmapModal';
import type { GuideModeResult } from '../types';
import './learning-path-overlay.css';

type LearningPathOverlayProps = {
  activeResult: GuideModeResult;
  onClose: () => void;
};

export default function LearningPathOverlay({ activeResult, onClose }: LearningPathOverlayProps) {
  const [isPronunciationRoadmapOpen, setIsPronunciationRoadmapOpen] = useState(false);
  const [isSpeakingRoadmapOpen, setIsSpeakingRoadmapOpen] = useState(false);
  const [isVocabularyRoadmapOpen, setIsVocabularyRoadmapOpen] = useState(false);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  return (
    <div className="tg-lp-layer" role="dialog" aria-modal="true" aria-label="Learning Path Overlay">
      <div className="tg-lp-dim" />

      <section className="tg-lp-coach">
        <div className="tg-lp-shell">
          <div className="tg-lp-avatar-orb">
            <Image
              src="/Kepala1.png"
              alt="GEUWAT Coach"
              width={58}
              height={58}
              className="tg-lp-avatar"
            />
          </div>

          <div className="tg-lp-card">
            <div className="tg-lp-card-head">
              <p className="tg-lp-title">Learning Path</p>
              <button
                type="button"
                className="tg-lp-close"
                onClick={onClose}
                aria-label="Tutup learning path"
              >
                x
              </button>
            </div>

            <p className="tg-lp-chip">{activeResult.reply}</p>

            <div className="tg-lp-actions">
              <button
                type="button"
                className="tg-lp-action-btn tg-lp-action-btn--pronunciation"
                onClick={() => setIsPronunciationRoadmapOpen(true)}
              >
                Open Pronunciation Roadmap
              </button>
              <button
                type="button"
                className="tg-lp-action-btn tg-lp-action-btn--speaking"
                onClick={() => setIsSpeakingRoadmapOpen(true)}
              >
                Open Speaking Roadmap
              </button>
              <button
                type="button"
                className="tg-lp-action-btn tg-lp-action-btn--vocabulary"
                onClick={() => setIsVocabularyRoadmapOpen(true)}
              >
                Open Vocabulary Roadmap
              </button>
            </div>
          </div>
        </div>
      </section>

      <PronunciationRoadmapModal
        isOpen={isPronunciationRoadmapOpen}
        onClose={() => setIsPronunciationRoadmapOpen(false)}
        zIndex={1600}
      />
      <SpeakingRoadmapModal
        isOpen={isSpeakingRoadmapOpen}
        onClose={() => setIsSpeakingRoadmapOpen(false)}
        zIndex={1600}
      />
      <VocabularyRoadmapModal
        isOpen={isVocabularyRoadmapOpen}
        onClose={() => setIsVocabularyRoadmapOpen(false)}
        zIndex={1600}
      />
    </div>
  );
}
