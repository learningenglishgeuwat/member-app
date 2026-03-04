'use client';

import Link from '../../components/HoverPrefetchLink';
import { useMemo, useState } from 'react';
import BackButton from '../components/BackButton';
import { assertVocabularyDatasetInDev } from './topic/data/quality';
import { VOCABULARY_TOPICS } from './topic/data/topics';
import { TOTAL_VOCABULARY_WORDS, getVocabularyWordsByTopic } from './topic/data/words';
import './topic/shared/vocabulary.css';

const TOPICS_PER_PAGE = 6;

const TOPIC_CHIP_LABEL_OVERRIDES: Record<string, string> = {
  number: 'Cardinal Number',
};

function buildTopicChipLabelMap() {
  const labelById = new Map<string, string>();
  const seenLabels = new Set<string>();

  for (const topic of VOCABULARY_TOPICS) {
    const baseLabel = TOPIC_CHIP_LABEL_OVERRIDES[topic.topicId] ?? topic.title;
    let finalLabel = baseLabel;
    let suffix = 2;

    while (seenLabels.has(finalLabel.toLowerCase())) {
      finalLabel = `${baseLabel} ${suffix}`;
      suffix += 1;
    }

    seenLabels.add(finalLabel.toLowerCase());
    labelById.set(topic.topicId, finalLabel);
  }

  return labelById;
}

if (process.env.NODE_ENV !== 'production') {
  assertVocabularyDatasetInDev();
}

export default function VocabularyPage() {
  const topicChipLabelMap = buildTopicChipLabelMap();
  const [searchInput, setSearchInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const searchQuery = searchInput.trim();
  const normalizedSearchQuery = searchQuery.toLowerCase();
  const filteredTopics = useMemo(
    () =>
      normalizedSearchQuery
        ? VOCABULARY_TOPICS.filter((topic) => {
            const topicChip = topicChipLabelMap.get(topic.topicId) ?? topic.title;
            const haystack = `${topicChip} ${topic.title} ${topic.subtitle} ${topic.description} ${topic.topicId}`.toLowerCase();
            return haystack.includes(normalizedSearchQuery);
          })
        : VOCABULARY_TOPICS,
    [normalizedSearchQuery, topicChipLabelMap],
  );

  const totalTopicPages = Math.max(1, Math.ceil(filteredTopics.length / TOPICS_PER_PAGE));
  const effectivePage = Math.min(totalTopicPages, Math.max(1, currentPage));
  const startIndex = (effectivePage - 1) * TOPICS_PER_PAGE;
  const pagedTopics = filteredTopics.slice(startIndex, startIndex + TOPICS_PER_PAGE);

  return (
    <main className="vocab-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill" />
      </div>

      <div className="vocab-shell">
        <header className="vocab-header">
          <h1 className="vocab-title">Vocabulary Topics</h1>
          <p className="vocab-subtitle">
            Pilih topik dulu, lalu masuk ke daftar kata dan contoh kalimat.
            Fokus awal: topik dasar untuk latihan speaking harian.
          </p>
          <div className="vocab-kpis">
            <p className="vocab-kpi">
              Total topics: <strong>{VOCABULARY_TOPICS.length}</strong>
            </p>
            <p className="vocab-kpi">
              Di halaman ini: <strong>{pagedTopics.length}</strong>
            </p>
            <p className="vocab-kpi">
              Total words: <strong>{TOTAL_VOCABULARY_WORDS}</strong>
            </p>
          </div>
        </header>

        <section className="vocab-tools" aria-label="Topic vocabulary search" data-tour="vocab-search">
          <label className="vocab-search-wrap">
            <span>Search topic</span>
            <input
              type="text"
              value={searchInput}
              onChange={(event) => {
                setSearchInput(event.target.value);
                setCurrentPage(1);
              }}
              className="vocab-search-input"
              placeholder="Cari topic, subtitle, atau deskripsi..."
            />
          </label>
          {searchInput ? (
            <div className="vocab-actions">
              <button
                type="button"
                className="vocab-action-btn"
                onClick={() => {
                  setSearchInput('');
                  setCurrentPage(1);
                }}
              >
                Reset
              </button>
            </div>
          ) : null}
        </section>

        <p className="vocab-visible-note">
          Showing <strong>{pagedTopics.length}</strong> of <strong>{filteredTopics.length}</strong> topics.
        </p>

        {filteredTopics.length === 0 ? (
          <div className="vocab-empty">
            Tidak ada topic yang cocok dengan kata kunci <strong>{searchQuery}</strong>.
          </div>
        ) : (
          <section className="vocab-topic-grid" aria-label="Vocabulary topic list" data-tour="vocab-topic-grid">
            {pagedTopics.map((topic) => {
              const wordCount = getVocabularyWordsByTopic(topic.topicId).length;
              const topicChip = topicChipLabelMap.get(topic.topicId) ?? topic.title;

              return (
                <article
                  key={topic.topicId}
                  className="vocab-topic-card"
                >
                  <div className="vocab-topic-head">
                    <h2 className="vocab-topic-title">
                      <span className="vocab-topic-chip vocab-topic-chip--title">{topicChip}</span>
                    </h2>
                    <p className="vocab-topic-subtitle">{topic.subtitle}</p>
                  </div>

                  <p className="vocab-topic-description">{topic.description}</p>

                  <div className="vocab-topic-footer">
                    <span className="vocab-topic-meta">{wordCount} kata</span>
                    <Link
                      href={`/skill/vocabulary/topic/pages/${topic.topicId}`}
                      className="vocab-topic-link"
                      prefetchOnHover={false}
                    >
                      Lihat Detail
                    </Link>
                  </div>
                </article>
              );
            })}
          </section>
        )}

        <nav className="vocab-pagination" aria-label="Vocabulary topic pagination" data-tour="vocab-pagination">
          <button
            type="button"
            className="vocab-action-btn vocab-topic-page-link"
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={effectivePage <= 1}
          >
            Previous
          </button>

          <span className="vocab-pagination-status">
            Page {effectivePage} of {totalTopicPages}
          </span>

          <button
            type="button"
            className="vocab-action-btn vocab-topic-page-link"
            onClick={() => setCurrentPage((prev) => Math.min(totalTopicPages, prev + 1))}
            disabled={effectivePage >= totalTopicPages}
          >
            Next
          </button>
        </nav>
      </div>
    </main>
  );
}
