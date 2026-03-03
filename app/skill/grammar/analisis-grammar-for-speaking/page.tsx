'use client';

import Link from '../../../components/HoverPrefetchLink';
import { useEffect, useMemo, useState } from 'react';
import BackButton from '../../components/BackButton';
import {
  GRAMMAR_RESOURCE_TOPIC_MAP,
  GRAMMAR_RESOURCE_TOPICS,
} from '../data/grammarResourceCatalog';
import type { TopicGapSeverity } from '../data/grammarTypes';
import { buildGapReport, computeGoalReadiness } from './data/logic';
import { TOPIC_RUBRIC_MAP } from './data/rubric';
import { SPEAKING_GOALS } from './data/speakingGoals';
import './grammar-for-speaking.css';

type TabKey = 'workflow' | 'audit';

const STORAGE_KEY = 'gfs_goal_progress_v1';

const formatSeverity = (severity: TopicGapSeverity): string => {
  switch (severity) {
    case 'good':
      return 'Good';
    case 'needs-improvement':
      return 'Needs Improvement';
    case 'critical-gap':
      return 'Critical Gap';
    case 'unassessed':
      return 'Unassessed';
    default:
      return severity;
  }
};

export default function GrammarSpeakingPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('workflow');
  const [completedGoals, setCompletedGoals] = useState<string[]>(() => {
    if (typeof window === 'undefined') {
      return [];
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) {
        return [];
      }
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed.filter(
        (goalId): goalId is string =>
          typeof goalId === 'string' && SPEAKING_GOALS.some((goal) => goal.goalId === goalId),
      );
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completedGoals));
  }, [completedGoals]);

  const completedSet = useMemo(() => new Set(completedGoals), [completedGoals]);

  const goalReadinessMap = useMemo(() => {
    return SPEAKING_GOALS.reduce<Record<string, ReturnType<typeof computeGoalReadiness>>>(
      (acc, goal) => {
        acc[goal.goalId] = computeGoalReadiness(goal, TOPIC_RUBRIC_MAP, GRAMMAR_RESOURCE_TOPIC_MAP);
        return acc;
      },
      {},
    );
  }, []);

  const gapReport = useMemo(
    () => buildGapReport(SPEAKING_GOALS, GRAMMAR_RESOURCE_TOPICS, TOPIC_RUBRIC_MAP),
    [],
  );

  const goalTitleById = useMemo(
    () =>
      SPEAKING_GOALS.reduce<Record<string, string>>((acc, goal) => {
        acc[goal.goalId] = goal.title;
        return acc;
      }, {}),
    [],
  );

  const completedCount = completedSet.size;
  const averageReadiness = Math.round(
    SPEAKING_GOALS.reduce((sum, goal) => sum + goalReadinessMap[goal.goalId].readinessPercent, 0) /
      SPEAKING_GOALS.length,
  );

  const toggleGoal = (goalId: string): void => {
    setCompletedGoals((prev) =>
      prev.includes(goalId) ? prev.filter((id) => id !== goalId) : [...prev, goalId],
    );
  };

  return (
    <main className="gfs-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar" />
      </div>

      <div className="gfs-shell">
        <h1 className="gfs-title">Grammar for Speaking</h1>
        <p className="gfs-subtitle">
          Workflow belajar ini menghubungkan target speaking dengan topik Grammar Resource, lalu
          mengecek kualitas cakupan materi lewat audit gap berbasis rubrik ketat.
        </p>

        <div className="gfs-tabs" role="tablist" aria-label="Grammar for Speaking tabs">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'workflow'}
            className={`gfs-tab-btn ${activeTab === 'workflow' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('workflow')}
          >
            Workflow Belajar
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'audit'}
            className={`gfs-tab-btn ${activeTab === 'audit' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('audit')}
          >
            Audit Gap
          </button>
        </div>

        {activeTab === 'workflow' ? (
          <section className="gfs-section">
            <div className="gfs-summary-grid">
              <article className="gfs-summary-card">
                <span className="gfs-summary-label">Total Speaking Goals</span>
                <span className="gfs-summary-value">{SPEAKING_GOALS.length}</span>
              </article>
              <article className="gfs-summary-card">
                <span className="gfs-summary-label">Goal Selesai</span>
                <span className="gfs-summary-value">
                  {completedCount}/{SPEAKING_GOALS.length}
                </span>
              </article>
              <article className="gfs-summary-card">
                <span className="gfs-summary-label">Rata-rata Kesiapan</span>
                <span className="gfs-summary-value">{averageReadiness}%</span>
              </article>
              <article className="gfs-summary-card">
                <span className="gfs-summary-label">Goal Data Gap</span>
                <span className="gfs-summary-value">{gapReport.goalsWithDataGap.length}</span>
              </article>
            </div>

            <div className="gfs-goal-list">
              {SPEAKING_GOALS.map((goal) => {
                const readiness = goalReadinessMap[goal.goalId];
                const isComplete = completedSet.has(goal.goalId);

                return (
                  <article
                    key={goal.goalId}
                    className={`gfs-goal-card ${isComplete ? 'is-complete' : ''}`}
                  >
                    <div className="gfs-goal-top">
                      <h2 className="gfs-goal-title">{goal.title}</h2>
                    </div>
                    <p className="gfs-goal-meta">{goal.communicativeFunction}</p>

                    <p className="gfs-goal-text">
                      <b>Kenapa penting:</b> {goal.whyThisMatters}
                    </p>
                    <p className="gfs-goal-text">
                      <b>Sample task:</b> {goal.sampleTask}
                    </p>

                    <div className="gfs-topic-links">
                      {goal.requiredTopicIds.map((topicId) => {
                        const topic = GRAMMAR_RESOURCE_TOPIC_MAP[topicId];
                        if (!topic) {
                          return (
                            <span key={topicId} className="gfs-topic-link is-gap">
                              Data gap: {topicId}
                            </span>
                          );
                        }

                        return (
                          <Link prefetch={false} key={topic.topicId} href={topic.href} className="gfs-topic-link">
                            {topic.topicLabel}
                          </Link>
                        );
                      })}
                    </div>

                    <div className="gfs-readiness">
                      <span>
                        Kesiapan goal: <strong>{readiness.readinessPercent}%</strong>
                      </span>
                      <span>Scored: {readiness.scoredTopics}</span>
                      <span>Unassessed: {readiness.unassessedTopics}</span>
                      {readiness.hasDataGap ? (
                        <span className="gfs-gap-note">
                          Data gap: {readiness.missingTopics.join(', ') || 'requiredTopicIds kosong'}
                        </span>
                      ) : null}
                    </div>

                    <div className="gfs-goal-footer">
                      <label className="gfs-checkbox">
                        <input
                          type="checkbox"
                          checked={isComplete}
                          onChange={() => toggleGoal(goal.goalId)}
                        />
                        <span>Sudah saya pelajari</span>
                      </label>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ) : (
          <section className="gfs-section">
            <div className="gfs-audit-grid">
              <article className="gfs-summary-card">
                <span className="gfs-summary-label">Topik Dipakai Workflow</span>
                <span className="gfs-summary-value">{gapReport.totalUsedTopics}</span>
              </article>
              <article className="gfs-summary-card">
                <span className="gfs-summary-label">Good</span>
                <span className="gfs-summary-value">{gapReport.severityDistribution.good}</span>
              </article>
              <article className="gfs-summary-card">
                <span className="gfs-summary-label">Needs Improvement</span>
                <span className="gfs-summary-value">
                  {gapReport.severityDistribution['needs-improvement']}
                </span>
              </article>
              <article className="gfs-summary-card">
                <span className="gfs-summary-label">Critical + Unassessed</span>
                <span className="gfs-summary-value">
                  {gapReport.severityDistribution['critical-gap'] + gapReport.severityDistribution.unassessed}
                </span>
              </article>
            </div>

            <div className="gfs-panel">
              <h2 className="gfs-panel-title">Skor Rubrik per Topik (Strict Rubric)</h2>
              <p className="gfs-panel-subtitle">
                Skor 0-12 dihitung dari 6 dimensi rubrik: concept clarity, speaking examples,
                interaction patterns, common mistakes, drills, dan real context usage.
              </p>
              <div className="gfs-table-wrap geuwat-table-scroll">
                <table className="gfs-table geuwat-table-responsive">
                  <thead>
                    <tr>
                      <th>Topik</th>
                      <th>Skor</th>
                      <th>Severity</th>
                      <th>Catatan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gapReport.auditedTopics.map((topic) => (
                      <tr key={topic.topicId}>
                        <td>
                          <Link prefetch={false} href={topic.href} className="gfs-topic-cell-link">
                            {topic.topicLabel}
                          </Link>
                        </td>
                        <td>{topic.scoreTotal === null ? '-' : topic.scoreTotal}</td>
                        <td>
                          <span className={`gfs-severity-badge gfs-severity-${topic.severity}`}>
                            {formatSeverity(topic.severity)}
                          </span>
                        </td>
                        <td>{topic.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="gfs-panel">
              <h2 className="gfs-panel-title">
                Prioritas Perbaikan Konten (Skor Terendah Lebih Dulu)
              </h2>
              {gapReport.priorityGaps.length === 0 ? (
                <p className="gfs-empty">Belum ada topik prioritas. Semua topik terpakai masuk kategori baik.</p>
              ) : (
                <div className="gfs-list">
                  {gapReport.priorityGaps.map((topic) => (
                    <div key={`priority-${topic.topicId}`} className="gfs-list-item">
                      <Link prefetch={false} href={topic.href} className="gfs-list-item-title">
                        {topic.topicLabel}
                      </Link>
                      <p className="gfs-list-item-note">
                        Skor: {topic.scoreTotal === null ? '-' : topic.scoreTotal} | Severity:{' '}
                        {formatSeverity(topic.severity)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="gfs-panel">
              <h2 className="gfs-panel-title">
                Goal dengan Data Gap ({gapReport.goalsWithDataGap.length})
              </h2>
              {gapReport.goalsWithDataGap.length === 0 ? (
                <p className="gfs-empty">
                  Semua goal sudah memiliki mapping topicId yang valid.
                </p>
              ) : (
                <div className="gfs-list">
                  {gapReport.goalsWithDataGap.map((goalId) => (
                    <div key={`goal-gap-${goalId}`} className="gfs-list-item">
                      <span className="gfs-list-item-title">{goalTitleById[goalId] ?? goalId}</span>
                      <p className="gfs-list-item-note">Goal ID: {goalId}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="gfs-panel">
              <h2 className="gfs-panel-title">
                Topik Critical Gap ({gapReport.criticalGaps.length})
              </h2>
              {gapReport.criticalGaps.length === 0 ? (
                <p className="gfs-empty">Belum ada topik pada level critical-gap.</p>
              ) : (
                <div className="gfs-list">
                  {gapReport.criticalGaps.map((topic) => (
                    <div key={`critical-${topic.topicId}`} className="gfs-list-item">
                      <Link prefetch={false} href={topic.href} className="gfs-list-item-title">
                        {topic.topicLabel}
                      </Link>
                      <p className="gfs-list-item-note">{topic.notes}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="gfs-panel">
              <h2 className="gfs-panel-title">
                Topik Resource Belum Dipakai Workflow ({gapReport.unusedResourceTopics.length})
              </h2>
              <p className="gfs-panel-subtitle">
                Daftar ini membantu melihat materi yang belum dimanfaatkan oleh speaking goals.
              </p>
              <div className="gfs-chip-list">
                {gapReport.unusedResourceTopics.map((topic) => (
                  <Link prefetch={false} key={`unused-${topic.topicId}`} href={topic.href} className="gfs-chip-link">
                    {topic.topicLabel}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}

