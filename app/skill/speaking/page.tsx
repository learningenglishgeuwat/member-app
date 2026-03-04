'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import BackButton from '../components/BackButton';
import { AUTHORED_SPEAKING_GOAL_IDS } from './data/details/authored-goals';
import { SPEAKING_GOALS, TOTAL_SPEAKING_GOALS } from './data/goals';
import { mapPhaseQueryToCefrPhase } from './data/migration';
import { SPEAKING_PHASES } from './data/phases';
import {
  readSpeakingGoalCompletionMap,
  SPEAKING_PRACTICE_WITH_GEUWAT_PREFIX,
} from './data/progress';
import {
  readSpeakingShowTranslation,
  writeSpeakingShowTranslation,
} from './data/translation-preference';
import { assertSpeakingDatasetInDev } from './data/quality';
import type {
  CefrSpeakingPhaseId,
  SpeakingDomain,
  SpeakingQuickFilter,
} from './data/types';
import './speaking.css';

const PAGE_SIZE = 6;

const QUICK_FILTERS: Array<{ id: SpeakingQuickFilter; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'daily', label: 'Daily' },
  { id: 'work', label: 'Work' },
  { id: 'public', label: 'Public' },
  { id: 'emergency', label: 'Emergency' },
  { id: 'legal', label: 'Legal' },
  { id: 'finance', label: 'Finance' },
];

const DOMAIN_LABELS: Record<SpeakingDomain, string> = {
  daily: 'Daily',
  work: 'Work',
  public: 'Public',
  emergency: 'Emergency',
  legal: 'Legal',
  finance: 'Finance',
};

if (process.env.NODE_ENV !== 'production') {
  assertSpeakingDatasetInDev();
}

export default function SpeakingRoadmapPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [activeFilter, setActiveFilter] = useState<SpeakingQuickFilter>('all');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showIdTranslation, setShowIdTranslation] = useState<boolean>(true);
  const [completionMap, setCompletionMap] = useState<Record<string, boolean>>({});
  const restoreUiStateTimerRef = useRef<number | null>(null);
  const hasRestoredUiStateRef = useRef(false);

  const authoredGoalSet = useMemo(
    () => new Set<string>([...AUTHORED_SPEAKING_GOAL_IDS]),
    [],
  );

  const activePhaseId = useMemo<CefrSpeakingPhaseId>(() => {
    const fromPhaseQuery = mapPhaseQueryToCefrPhase(searchParams.get('phase'));
    if (fromPhaseQuery) return fromPhaseQuery;

    return SPEAKING_PHASES[0].id as CefrSpeakingPhaseId;
  }, [searchParams]);

  const activePhase = useMemo(
    () => SPEAKING_PHASES.find((phase) => phase.id === activePhaseId) ?? SPEAKING_PHASES[0],
    [activePhaseId],
  );

  const phaseGoals = useMemo(
    () => SPEAKING_GOALS.filter((goal) => goal.phaseId === activePhaseId),
    [activePhaseId],
  );

  const filteredGoals = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    return phaseGoals.filter((goal) => {
      const domainMatch = activeFilter === 'all' || goal.domain === activeFilter;
      if (!domainMatch) {
        return false;
      }

      if (!normalized) {
        return true;
      }

      const haystack = [goal.goal, goal.situation, ...goal.keySentences]
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalized);
    });
  }, [activeFilter, phaseGoals, search]);

  const totalPages = Math.max(1, Math.ceil(filteredGoals.length / PAGE_SIZE));
  const safeCurrentPage = Math.min(currentPage, totalPages);

  const visibleGoals = useMemo(() => {
    const start = (safeCurrentPage - 1) * PAGE_SIZE;
    return filteredGoals.slice(start, start + PAGE_SIZE);
  }, [filteredGoals, safeCurrentPage]);

  useEffect(() => {
    if (hasRestoredUiStateRef.current) return;
    hasRestoredUiStateRef.current = true;

    const nextShowTranslation = readSpeakingShowTranslation();
    const nextCompletionMap = readSpeakingGoalCompletionMap();

    restoreUiStateTimerRef.current = window.setTimeout(() => {
      setShowIdTranslation(nextShowTranslation);
      setCompletionMap(nextCompletionMap);
      restoreUiStateTimerRef.current = null;
    }, 0);

    return () => {
      if (restoreUiStateTimerRef.current) {
        window.clearTimeout(restoreUiStateTimerRef.current);
        restoreUiStateTimerRef.current = null;
      }
    };
  }, []);

  return (
    <main className="spk-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill" />
      </div>

      <div className="spk-shell">
        <header className="spk-header">
          <h1 className="spk-title">Speaking</h1>
          <p className="spk-subtitle">
            Latihan speaking praktis untuk penutur Indonesia: respons cepat,
            kebutuhan harian, dan transaksi sederhana yang dipakai dalam percakapan nyata.
          </p>
          <div className="spk-kpis">
            <p className="spk-kpi">
              Total goals: <strong>{TOTAL_SPEAKING_GOALS}</strong>
            </p>
            <p className="spk-kpi">
              Total phases: <strong>{SPEAKING_PHASES.length}</strong>
            </p>
            <p className="spk-kpi">
              Active phase goals: <strong>{phaseGoals.length}</strong>
            </p>
            <p className="spk-kpi">
              Authored detail: <strong>{AUTHORED_SPEAKING_GOAL_IDS.length}</strong>
            </p>
          </div>
        </header>

        <section className="spk-layout">
          <aside className="spk-phase-panel" aria-label="Phase Navigator" data-tour="speaking-phase-panel">
            <h2 className="spk-panel-title">Learning Phases</h2>
            <div className="spk-phase-list">
              {SPEAKING_PHASES.map((phase) => (
                <button
                  key={phase.id}
                  type="button"
                  className={`spk-phase-btn ${phase.id === activePhaseId ? 'is-active' : ''}`}
                  onClick={() => {
                    const nextParams = new URLSearchParams(searchParams.toString());
                    nextParams.set('phase', phase.id);
                    router.push(`${pathname}?${nextParams.toString()}`);
                    setCurrentPage(1);
                  }}
                >
                  <span className="spk-phase-btn-title">{phase.title}</span>
                  <span className="spk-phase-btn-meta">
                    {phase.goalCount} goals | {phase.levelBand}
                  </span>
                </button>
              ))}
            </div>
          </aside>

          <section className="spk-content">
            <div className="spk-phase-head">
              <h2 className="spk-phase-title">{activePhase.title}</h2>
              <p className="spk-phase-subtitle">{activePhase.subtitle}</p>
              <p className="spk-phase-target">{activePhase.targetOutput}</p>
              <div className="spk-phase-link-row">
                <button
                  type="button"
                  className="spk-phase-link-btn"
                  onClick={() => router.push('/skill/vocabulary')}
                >
                  Open Vocabulary Topics
                </button>
              </div>
            </div>

            <div className="spk-tools">
              <div
                className="spk-filter-row"
                role="tablist"
                aria-label="Domain Filter"
                data-tour="speaking-filter-row"
              >
                {QUICK_FILTERS.map((filter) => (
                  <button
                    key={filter.id}
                    type="button"
                    className={`spk-filter-chip ${activeFilter === filter.id ? 'is-active' : ''}`}
                    onClick={() => {
                      setActiveFilter(filter.id);
                      setCurrentPage(1);
                    }}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              <label className="spk-translation-toggle">
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

              <label className="spk-search-wrap">
                <span className="spk-search-label">Search in active phase</span>
                <input
                  type="text"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setCurrentPage(1);
                  }}
                  className="spk-search-input"
                  placeholder="Cari goal, situasi, atau kalimat kunci..."
                />
              </label>
            </div>

            <p className="spk-visible-note">
              Showing <strong>{visibleGoals.length}</strong> of{' '}
              <strong>{filteredGoals.length}</strong> filtered goals in this
              phase.
            </p>

            {visibleGoals.length === 0 ? (
              <div className="spk-empty">
                Tidak ada goal yang cocok untuk filter dan kata kunci saat ini.
              </div>
            ) : (
              <div className="spk-grid" data-tour="speaking-goal-grid">
                {visibleGoals.map((goal) => (
                  (() => {
                    const isLearningCompleted = Boolean(completionMap[goal.id]);
                    const isPracticeCompleted = Boolean(
                      completionMap[`${SPEAKING_PRACTICE_WITH_GEUWAT_PREFIX}${goal.id}`],
                    );
                    const isCompleted = isLearningCompleted && isPracticeCompleted;

                    return (
                      <article
                        key={goal.id}
                        className={`spk-card ${
                          authoredGoalSet.has(goal.id) ? 'is-authored' : 'is-coming-soon'
                        }`}
                        onClick={() => {
                          if (!authoredGoalSet.has(goal.id)) return;
                          router.push(`/skill/speaking/cefr-a1/${goal.id}`);
                        }}
                        onKeyDown={(event) => {
                          if (!authoredGoalSet.has(goal.id)) return;
                          if (event.key !== 'Enter' && event.key !== ' ') return;
                          event.preventDefault();
                          router.push(`/skill/speaking/cefr-a1/${goal.id}`);
                        }}
                        role={authoredGoalSet.has(goal.id) ? 'button' : undefined}
                        tabIndex={authoredGoalSet.has(goal.id) ? 0 : undefined}
                        aria-disabled={!authoredGoalSet.has(goal.id)}
                      >
                        <div className="spk-card-top">
                          <span className="spk-order">
                            #{String(goal.goalOrder).padStart(2, '0')}
                          </span>
                          <span className="spk-tag spk-tag-domain">
                            {DOMAIN_LABELS[goal.domain]}
                          </span>
                          <span className="spk-tag">{goal.levelBand}</span>
                          <span
                            className={`spk-tag spk-priority spk-priority-${goal.survivalPriority}`}
                          >
                            {goal.survivalPriority}
                          </span>
                          {!authoredGoalSet.has(goal.id) ? (
                            <span className="spk-tag spk-tag-soon">Coming Soon</span>
                          ) : null}
                          {isCompleted ? (
                            <span className="spk-tag spk-tag-done">Completed</span>
                          ) : null}
                        </div>

                        <h3 className="spk-card-goal">{goal.goal}</h3>

                        <div className="spk-card-block">
                          <p className="spk-card-label">Situasi</p>
                          <p className="spk-card-text">{goal.situation}</p>
                        </div>

                        <div className="spk-card-block">
                          <p className="spk-card-label">Kalimat Kunci (English)</p>
                          <ul className="spk-card-list">
                            {goal.keySentences.map((sentence, index) => (
                              <li key={`${goal.id}-key-sentence-${index}`}>
                                <span>{sentence}</span>
                                {showIdTranslation && goal.keySentencesId?.[index] ? (
                                  <span className="spk-translation-text">
                                    {goal.keySentencesId[index]}
                                  </span>
                                ) : null}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {authoredGoalSet.has(goal.id) ? (
                          <div className="spk-card-footer">
                            <span className="spk-open-detail">Open Detail</span>
                            <label
                              className="spk-card-complete-toggle"
                              onClick={(event) => event.stopPropagation()}
                            >
                              <input
                                type="checkbox"
                                checked={isCompleted}
                                disabled
                                readOnly
                              />
                              <span>Completed</span>
                            </label>
                          </div>
                        ) : (
                          <div className="spk-card-footer">
                            <span className="spk-card-disabled-note">
                              Detail page batch ini belum tersedia.
                            </span>
                          </div>
                        )}
                      </article>
                    );
                  })()
                ))}
              </div>
            )}

            <div className="spk-pagination">
              <button
                type="button"
                className="spk-page-btn"
                onClick={() =>
                  setCurrentPage((page) => Math.max(1, Math.min(totalPages, page) - 1))
                }
                disabled={safeCurrentPage <= 1}
              >
                Prev
              </button>
              <span className="spk-page-label">
                Page {safeCurrentPage} / {totalPages}
              </span>
              <button
                type="button"
                className="spk-page-btn"
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, Math.min(totalPages, page) + 1))
                }
                disabled={safeCurrentPage >= totalPages}
              >
                Next
              </button>
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
