'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import BackButton from '../../components/BackButton';
import GoalSelector from './GoalSelector';
import GoalSentenceTts from './GoalSentenceTts';
import DialogScriptTts from './DialogScriptTts';
import { parseDialogLine } from './dialog-tts-utils';
import { SPEAKING_GOALS } from '../data/goals';
import type { SpeakingGoalDetail } from '../data/detailTypes';
import { getSpeakingIpaByText } from '../data/ipa-map';
import {
  readSpeakingGoalCompletionMap,
  SPEAKING_PRACTICE_WITH_GEUWAT_PREFIX,
  writeSpeakingGoalCompletionMap,
} from '../data/progress';
import {
  readSpeakingShowTranslation,
  writeSpeakingShowTranslation,
} from '../data/translation-preference';
import {
  readSpeakingDetailOpenSection,
  writeSpeakingDetailOpenSection,
} from '../data/detail-section-preference';
import '../speaking.css';

type SpeakingGoalDetailPageProps = {
  goalId: string;
  detail: SpeakingGoalDetail;
};

const SECTION_IDS = [
  'goal-snapshot',
  'why-this-matters',
  'situation-breakdown',
  'key-sentences',
  'pronunciation-notes',
  'common-mistakes',
  'dialog',
  'practice-with-geuwat',
] as const;

const PRACTICE_WITH_GEUWAT_STEPS = [
  'Klik avatar GEUWAT di kanan atas.',
  'Di dropdown Mode, pilih Speaking Practice lalu klik tombol Switch.',
  'Pilih Phase, Goal, dan Scenario sesuai target latihan kamu.',
  'Klik Start. Saat Partner berbicara, dengarkan. Saat Your Turn, baca giliranmu sampai timer selesai.',
  'Gunakan Ulang Turn jika ingin mengulang giliran yang sama, atau Stop untuk menghentikan sesi.',
  'Klik tombol x pada overlay untuk menutup Speaking Practice dan kembali ke halaman ini.',
] as const;
function stopSpeechSynthesis() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
}

export default function SpeakingGoalDetailPage({
  goalId,
  detail,
}: SpeakingGoalDetailPageProps) {
  const baseGoal = useMemo(
    () => SPEAKING_GOALS.find((goal) => goal.id === goalId) ?? null,
    [goalId],
  );

  const [completionMap, setCompletionMap] = useState<Record<string, boolean>>(
    {},
  );
  const [showIdTranslation, setShowIdTranslation] = useState<boolean>(true);
  const [showIpa, setShowIpa] = useState<boolean>(true);
  const [openSectionId, setOpenSectionId] = useState<string | null>(null);
  const [dialogScenarioIndex, setDialogScenarioIndex] = useState(0);
  const restoreUiStateTimerRef = useRef<number | null>(null);

  useEffect(() => {
    stopSpeechSynthesis();

    const nextCompletionMap = readSpeakingGoalCompletionMap();
    const nextShowTranslation = readSpeakingShowTranslation();
    const nextOpenSection = readSpeakingDetailOpenSection(goalId, SECTION_IDS);

    if (restoreUiStateTimerRef.current) {
      window.clearTimeout(restoreUiStateTimerRef.current);
      restoreUiStateTimerRef.current = null;
    }

    restoreUiStateTimerRef.current = window.setTimeout(() => {
      setCompletionMap(nextCompletionMap);
      setShowIdTranslation(nextShowTranslation);
      setOpenSectionId(nextOpenSection);
      setDialogScenarioIndex(0);
      restoreUiStateTimerRef.current = null;
    }, 0);

    return () => {
      if (restoreUiStateTimerRef.current) {
        window.clearTimeout(restoreUiStateTimerRef.current);
        restoreUiStateTimerRef.current = null;
      }
    };
  }, [goalId]);

  useEffect(() => {
    return () => {
      stopSpeechSynthesis();
    };
  }, []);

  if (!baseGoal) {
    return (
      <main className="spk-detail-page">
        <div className="fixed left-4 top-6 z-50">
          <BackButton to="/skill/speaking" />
        </div>
        <div className="spk-detail-shell">
          <div className="spk-detail-not-found">
            Goal tidak ditemukan. Kembali ke roadmap dan pilih goal yang tersedia.
          </div>
        </div>
      </main>
    );
  }

  const isCompleted = Boolean(completionMap[goalId]);
  const practiceWithGeuwatChecklistKey = `${SPEAKING_PRACTICE_WITH_GEUWAT_PREFIX}${goalId}`;
  const isPracticeWithGeuwatCompleted = Boolean(completionMap[practiceWithGeuwatChecklistKey]);
  const isDialogTtsEnabled = true;
  const keySentenceIpaLines = baseGoal.keySentences.map(
    (sentence) => getSpeakingIpaByText(sentence) ?? '',
  );

  const dialogScripts = detail.roleplayScenarios.map((scenario, index) => {
    const rawDialog = detail.roleplayExamples?.[index] ?? '';
    const parsedLines = rawDialog
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    const rawTranslation = detail.roleplayExamplesId?.[index] ?? '';
    const parsedTranslations = rawTranslation
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);
    const lines =
      parsedLines.length > 0
        ? parsedLines
        : [
            `${scenario.partnerRole}: (dialog belum tersedia)`,
            'You: (silakan isi dialog manual untuk goal ini)',
          ];
    const translations = parsedTranslations.length > 0 ? parsedTranslations : undefined;
    const ipaLines = lines.map((line) => getSpeakingIpaByText(parseDialogLine(line).content) ?? '');

    return {
      title: scenario.title,
      mission: scenario.mission,
      lines,
      translations,
      ipaLines,
    };
  });
  const clampedDialogScenarioIndex =
    dialogScripts.length > 0 ? Math.min(dialogScenarioIndex, dialogScripts.length - 1) : 0;
  const activeDialogScript =
    dialogScripts.length > 0 ? dialogScripts[clampedDialogScenarioIndex] : null;

  const handleCompletionToggle = (checked: boolean) => {
    setCompletionMap((prev) => {
      const next = { ...prev, [goalId]: checked };
      writeSpeakingGoalCompletionMap(next);
      return next;
    });
  };

  const handlePracticeWithGeuwatToggle = (checked: boolean) => {
    setCompletionMap((prev) => {
      const next = { ...prev, [practiceWithGeuwatChecklistKey]: checked };
      writeSpeakingGoalCompletionMap(next);
      return next;
    });
  };

  const toggleSection = (sectionId: (typeof SECTION_IDS)[number]) => {
    const isTtsSection = (value: string | null) =>
      value === 'key-sentences' || value === 'dialog';

    const next = openSectionId === sectionId ? null : sectionId;
    if (isTtsSection(openSectionId) && openSectionId !== next) {
      stopSpeechSynthesis();
    }
    setOpenSectionId(next);
    writeSpeakingDetailOpenSection(goalId, next);
  };

  return (
    <main className="spk-detail-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/speaking" />
      </div>

      <div className="spk-detail-shell">
        <header className="spk-detail-header">
          <p className="spk-detail-kicker">
            {baseGoal.phaseTitle} | Goal #{String(baseGoal.goalOrder).padStart(2, '0')}
          </p>
          <h1 className="spk-detail-title">{baseGoal.goal}</h1>
          <p className="spk-detail-subtitle">{detail.goalSnapshot}</p>
          <div className="spk-detail-chip-row">
            <span className="spk-detail-chip">{baseGoal.domain}</span>
            <span className="spk-detail-chip">{baseGoal.levelBand}</span>
            <span className={`spk-detail-chip spk-priority-${baseGoal.survivalPriority}`}>
              {baseGoal.survivalPriority}
            </span>
            <span className={`spk-detail-chip ${isCompleted ? 'is-done' : 'is-pending'}`}>
              {isCompleted ? 'Completed' : 'Not Completed'}
            </span>
          </div>
          <div className="spk-detail-header-controls">
            <div className="spk-detail-global-toggles">
              <label className="spk-translation-toggle spk-translation-toggle-detail">
                <input
                  type="checkbox"
                  checked={showIpa}
                  onChange={(event) => setShowIpa(event.target.checked)}
                />
                <span>Tampilkan IPA</span>
              </label>
              <label className="spk-translation-toggle spk-translation-toggle-detail">
                <input
                  type="checkbox"
                  checked={showIdTranslation}
                  onChange={(event) => {
                    const next = event.target.checked;
                    setShowIdTranslation(next);
                    writeSpeakingShowTranslation(next);
                  }}
                />
                <span>Tampilkan terjemahan Indonesia</span>
              </label>
            </div>
            <label className="spk-detail-complete-toggle">
              <input
                type="checkbox"
                checked={isCompleted}
                onChange={(event) => handleCompletionToggle(event.target.checked)}
              />
              <span>Sudah dipelajari</span>
            </label>
            <label className="spk-detail-complete-toggle">
              <input
                type="checkbox"
                checked={isPracticeWithGeuwatCompleted}
                onChange={(event) => handlePracticeWithGeuwatToggle(event.target.checked)}
              />
              <span>Practice with GEUWAT</span>
            </label>
          </div>
        </header>

        <GoalSelector activeGoalId={goalId} />

        <section className="spk-detail-section">
          <h2>
            <button
              type="button"
              className="spk-detail-section-toggle"
              aria-expanded={openSectionId === 'goal-snapshot'}
              aria-controls={`spk-section-body-${goalId}-goal-snapshot`}
              onClick={() => toggleSection('goal-snapshot')}
            >
              <span>Goal Snapshot</span>
              <span className="spk-detail-section-chevron-wrap" aria-hidden="true">
                <span className="spk-detail-section-chevron" />
              </span>
            </button>
          </h2>
          <div
            id={`spk-section-body-${goalId}-goal-snapshot`}
            className={`spk-detail-section-body ${openSectionId === 'goal-snapshot' ? 'is-open' : ''}`}
          >
            <p>{detail.goalSnapshot}</p>
          </div>
        </section>

        <section className="spk-detail-section">
          <h2>
            <button
              type="button"
              className="spk-detail-section-toggle"
              aria-expanded={openSectionId === 'why-this-matters'}
              aria-controls={`spk-section-body-${goalId}-why-this-matters`}
              onClick={() => toggleSection('why-this-matters')}
            >
              <span>Why This Matters</span>
              <span className="spk-detail-section-chevron-wrap" aria-hidden="true">
                <span className="spk-detail-section-chevron" />
              </span>
            </button>
          </h2>
          <div
            id={`spk-section-body-${goalId}-why-this-matters`}
            className={`spk-detail-section-body ${openSectionId === 'why-this-matters' ? 'is-open' : ''}`}
          >
            <p>{detail.whyThisMatters}</p>
          </div>
        </section>

        <section className="spk-detail-section">
          <h2>
            <button
              type="button"
              className="spk-detail-section-toggle"
              aria-expanded={openSectionId === 'situation-breakdown'}
              aria-controls={`spk-section-body-${goalId}-situation-breakdown`}
              onClick={() => toggleSection('situation-breakdown')}
            >
              <span>Situation Breakdown</span>
              <span className="spk-detail-section-chevron-wrap" aria-hidden="true">
                <span className="spk-detail-section-chevron" />
              </span>
            </button>
          </h2>
          <div
            id={`spk-section-body-${goalId}-situation-breakdown`}
            className={`spk-detail-section-body ${openSectionId === 'situation-breakdown' ? 'is-open' : ''}`}
          >
            <ul>
              {detail.situationBreakdown.map((item) => (
                <li key={`${goalId}-situation-${item}`}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="spk-detail-section">
          <h2>
            <button
              type="button"
              className="spk-detail-section-toggle"
              aria-expanded={openSectionId === 'key-sentences'}
              aria-controls={`spk-section-body-${goalId}-key-sentences`}
              onClick={() => toggleSection('key-sentences')}
            >
              <span>Key Sentences (English)</span>
              <span className="spk-detail-section-chevron-wrap" aria-hidden="true">
                <span className="spk-detail-section-chevron" />
              </span>
            </button>
          </h2>
          <div
            id={`spk-section-body-${goalId}-key-sentences`}
            className={`spk-detail-section-body ${openSectionId === 'key-sentences' ? 'is-open' : ''}`}
          >
            {openSectionId === 'key-sentences' ? (
              <GoalSentenceTts
                sentences={baseGoal.keySentences}
                translations={baseGoal.keySentencesId}
                showTranslations={showIdTranslation}
                ipaLines={keySentenceIpaLines}
                showIpa={showIpa}
              />
            ) : null}
          </div>
        </section>

        <section className="spk-detail-section">
          <h2>
            <button
              type="button"
              className="spk-detail-section-toggle"
              aria-expanded={openSectionId === 'pronunciation-notes'}
              aria-controls={`spk-section-body-${goalId}-pronunciation-notes`}
              onClick={() => toggleSection('pronunciation-notes')}
            >
              <span>Pronunciation Notes</span>
              <span className="spk-detail-section-chevron-wrap" aria-hidden="true">
                <span className="spk-detail-section-chevron" />
              </span>
            </button>
          </h2>
          <div
            id={`spk-section-body-${goalId}-pronunciation-notes`}
            className={`spk-detail-section-body ${openSectionId === 'pronunciation-notes' ? 'is-open' : ''}`}
          >
            <ul>
              {detail.pronunciationNotes.map((item) => (
                <li key={`${goalId}-pron-${item}`}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="spk-detail-section">
          <h2>
            <button
              type="button"
              className="spk-detail-section-toggle"
              aria-expanded={openSectionId === 'common-mistakes'}
              aria-controls={`spk-section-body-${goalId}-common-mistakes`}
              onClick={() => toggleSection('common-mistakes')}
            >
              <span>Common Mistakes</span>
              <span className="spk-detail-section-chevron-wrap" aria-hidden="true">
                <span className="spk-detail-section-chevron" />
              </span>
            </button>
          </h2>
          <div
            id={`spk-section-body-${goalId}-common-mistakes`}
            className={`spk-detail-section-body ${openSectionId === 'common-mistakes' ? 'is-open' : ''}`}
          >
            <div className="spk-detail-grid-2">
              {detail.commonMistakes.map((item, index) => (
                <article key={`${goalId}-mistake-${index}`} className="spk-detail-mini-card">
                  <p className="spk-detail-mini-label">Mistake</p>
                  <p>{item.mistake}</p>
                  <p className="spk-detail-mini-label">Correction</p>
                  <p>{item.correction}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="spk-detail-section">
          <h2>
            <button
              type="button"
              className="spk-detail-section-toggle"
              aria-expanded={openSectionId === 'dialog'}
              aria-controls={`spk-section-body-${goalId}-dialog`}
              onClick={() => toggleSection('dialog')}
            >
              <span>Dialog</span>
              <span className="spk-detail-section-chevron-wrap" aria-hidden="true">
                <span className="spk-detail-section-chevron" />
              </span>
            </button>
          </h2>
          <div
            id={`spk-section-body-${goalId}-dialog`}
            className={`spk-detail-section-body ${openSectionId === 'dialog' ? 'is-open' : ''}`}
          >
            {openSectionId === 'dialog' ? (
              activeDialogScript ? (
                <>
                  {dialogScripts.length > 1 ? (
                    <div className="spk-practice-scenario-nav">
                      <button
                        type="button"
                        className="spk-detail-tts-btn"
                        onClick={() => setDialogScenarioIndex((prev) => Math.max(0, prev - 1))}
                        disabled={clampedDialogScenarioIndex === 0}
                      >
                        Prev Scenario
                      </button>
                      <span className="spk-practice-scenario-label">
                        Scenario {clampedDialogScenarioIndex + 1}/{dialogScripts.length}
                      </span>
                      <button
                        type="button"
                        className="spk-detail-tts-btn"
                        onClick={() =>
                          setDialogScenarioIndex((prev) =>
                            Math.min(dialogScripts.length - 1, prev + 1),
                          )
                        }
                        disabled={clampedDialogScenarioIndex >= dialogScripts.length - 1}
                      >
                        Next Scenario
                      </button>
                    </div>
                  ) : null}
                  <article className="spk-detail-dialog-block">
                    <h3>{activeDialogScript.title}</h3>
                    <p>{activeDialogScript.mission}</p>
                    {isDialogTtsEnabled ? (
                      <DialogScriptTts
                        key={`${goalId}-${clampedDialogScenarioIndex}-dialog-tts`}
                        lines={activeDialogScript.lines}
                        translations={activeDialogScript.translations}
                        showTranslations={showIdTranslation}
                        ipaLines={activeDialogScript.ipaLines}
                        showIpa={showIpa}
                      />
                    ) : (
                      <div className="spk-detail-dialog-lines">
                        {activeDialogScript.lines.map((line, lineIndex) => (
                          <p
                            key={`${goalId}-${activeDialogScript.title}-${lineIndex}`}
                            className="spk-detail-dialog-line"
                          >
                            <span>{line}</span>
                            {showIpa && activeDialogScript.ipaLines?.[lineIndex] ? (
                              <span className="spk-ipa-text spk-dialog-ipa-text">
                                {activeDialogScript.ipaLines[lineIndex]}
                              </span>
                            ) : null}
                            {showIdTranslation && activeDialogScript.translations?.[lineIndex] ? (
                              <span className="spk-translation-text spk-dialog-translation-text">
                                {activeDialogScript.translations[lineIndex]}
                              </span>
                            ) : null}
                          </p>
                        ))}
                      </div>
                    )}
                  </article>
                </>
              ) : (
                <p>Tidak ada data dialog untuk goal ini.</p>
              )
            ) : null}
          </div>
        </section>

        <section className="spk-detail-section">
          <h2>
            <button
              type="button"
              className="spk-detail-section-toggle"
              aria-expanded={openSectionId === 'practice-with-geuwat'}
              aria-controls={`spk-section-body-${goalId}-practice-with-geuwat`}
              onClick={() => toggleSection('practice-with-geuwat')}
            >
              <span>Practice with GEUWAT</span>
              <span className="spk-detail-section-chevron-wrap" aria-hidden="true">
                <span className="spk-detail-section-chevron" />
              </span>
            </button>
          </h2>
          <div
            id={`spk-section-body-${goalId}-practice-with-geuwat`}
            className={`spk-detail-section-body ${openSectionId === 'practice-with-geuwat' ? 'is-open' : ''}`}
          >
            <article className="spk-detail-mini-card">
              <ol>
                {PRACTICE_WITH_GEUWAT_STEPS.map((step) => (
                  <li key={`${goalId}-practice-step-${step}`}>{step}</li>
                ))}
              </ol>
            </article>
          </div>
        </section>

      </div>
    </main>
  );
}
