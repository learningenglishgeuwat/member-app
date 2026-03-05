'use client';

import { useMemo, useState } from 'react';
import BackButton from '../../components/BackButton';
import './grammar-for-speaking.css';
import { SPEAKING_GOALS, TOTAL_SPEAKING_GOALS } from './data/goals';
import { SPEAKING_PHASES } from './data/phases';
import type { SpeakingDomain, SpeakingQuickFilter } from './data/types';

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

export default function GrammarForSpeakingPage() {
  const [activePhaseId, setActivePhaseId] = useState(SPEAKING_PHASES[0].id);
  const [activeFilter, setActiveFilter] = useState<SpeakingQuickFilter>('all');
  const [search, setSearch] = useState('');

  const activePhase = useMemo(
    () => SPEAKING_PHASES.find((phase) => phase.id === activePhaseId) ?? SPEAKING_PHASES[0],
    [activePhaseId],
  );

  const phaseGoals = useMemo(
    () => SPEAKING_GOALS.filter((goal) => goal.phaseId === activePhaseId),
    [activePhaseId],
  );

  const visibleGoals = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    return phaseGoals.filter((goal) => {
      const domainMatch = activeFilter === 'all' || goal.domain === activeFilter;
      if (!domainMatch) {
        return false;
      }

      if (!normalized) {
        return true;
      }

      const haystack = [
        goal.goal,
        goal.situation,
        goal.drill,
        ...goal.keySentences,
      ]
        .join(' ')
        .toLowerCase();

      return haystack.includes(normalized);
    });
  }, [activeFilter, phaseGoals, search]);

  return (
    <main className="gfs-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar" />
      </div>

      <div className="gfs-shell">
        <header className="gfs-header">
          <h1 className="gfs-title">Grammar for Speaking</h1>
          <p className="gfs-subtitle">
            Roadmap speaking dari nol sampai profesional. Materi fokus ke praktik
            lisan dunia nyata: daily, work, public service, emergency, legal, dan
            finance.
          </p>
          <div className="gfs-kpi-wrap">
            <p className="gfs-summary">
              Total goals: <strong>{TOTAL_SPEAKING_GOALS}</strong>
            </p>
            <p className="gfs-summary">
              Total phases: <strong>{SPEAKING_PHASES.length}</strong>
            </p>
            <p className="gfs-summary">
              Active phase goals: <strong>{phaseGoals.length}</strong>
            </p>
          </div>
        </header>

        <section className="gfs-layout">
          <aside className="gfs-phase-panel" aria-label="Phase Navigator">
            <h2 className="gfs-panel-title">Learning Phases</h2>
            <div className="gfs-phase-list">
              {SPEAKING_PHASES.map((phase) => (
                <button
                  key={phase.id}
                  type="button"
                  className={`gfs-phase-btn ${phase.id === activePhaseId ? 'is-active' : ''}`}
                  onClick={() => setActivePhaseId(phase.id)}
                >
                  <span className="gfs-phase-btn-title">{phase.title}</span>
                  <span className="gfs-phase-btn-meta">
                    {phase.goalCount} goals • {phase.levelBand}
                  </span>
                </button>
              ))}
            </div>
          </aside>

          <div className="gfs-content">
            <div className="gfs-phase-head">
              <h2 className="gfs-phase-title">{activePhase.title}</h2>
              <p className="gfs-phase-subtitle">{activePhase.subtitle}</p>
              <p className="gfs-phase-target">{activePhase.targetOutput}</p>
            </div>

            <div className="gfs-tools">
              <div className="gfs-filter-row" role="tablist" aria-label="Domain Filter">
                {QUICK_FILTERS.map((filter) => (
                  <button
                    key={filter.id}
                    type="button"
                    className={`gfs-filter-chip ${activeFilter === filter.id ? 'is-active' : ''}`}
                    onClick={() => setActiveFilter(filter.id)}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
              <label className="gfs-search-wrap">
                <span className="gfs-search-label">Search in active phase</span>
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="gfs-search-input"
                  placeholder="Cari goal, situasi, kalimat, atau drill..."
                />
              </label>
            </div>

            <p className="gfs-visible-note">
              Showing <strong>{visibleGoals.length}</strong> of <strong>{phaseGoals.length}</strong> goals in this
              phase.
            </p>

            {visibleGoals.length === 0 ? (
              <div className="gfs-empty">
                Tidak ada goal yang cocok dengan filter atau kata kunci saat ini.
              </div>
            ) : (
              <div className="gfs-grid">
                {visibleGoals.map((item) => (
                  <article key={item.id} className="gfs-card">
                    <div className="gfs-card-top">
                      <span className="gfs-order">#{String(item.goalOrder).padStart(2, '0')}</span>
                      <span className="gfs-tag gfs-tag-domain">{DOMAIN_LABELS[item.domain]}</span>
                      <span className="gfs-tag">{item.levelBand}</span>
                      <span className={`gfs-tag gfs-priority gfs-priority-${item.survivalPriority}`}>
                        {item.survivalPriority}
                      </span>
                    </div>

                    <h3 className="gfs-card-goal">{item.goal}</h3>

                    <div className="gfs-card-block">
                      <p className="gfs-card-label">Situasi</p>
                      <p className="gfs-card-text">{item.situation}</p>
                    </div>

                    <div className="gfs-card-block">
                      <p className="gfs-card-label">Kalimat Kunci (English)</p>
                      <ul className="gfs-card-list">
                        {item.keySentences.map((sentence) => (
                          <li key={`${item.id}-${sentence}`}>{sentence}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="gfs-card-block">
                      <p className="gfs-card-label">Drill</p>
                      <p className="gfs-card-text">{item.drill}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
