'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { Play, Pause, ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import './styles/minimalPairs.css';
import BackButton from '../../../components/BackButton';
import Sidebar from '../../../components/skillSidebar/SkillSidebar';
import ButtonSavedProgress from '../../../components/buttonSavedProgress';
import { categoryLabelMap, minimalPairCategories } from './data/index';
import { useMinimalPairs } from './hooks/useMinimalPairs';
import type { MinimalPairCategory, MinimalPairWord } from './types';

const RecordingControlsButton = dynamic(() => import('../../../components/RecordingControlsButton'), {
  ssr: false,
});

const MinimalPairsPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isWordPairsOpen, setIsWordPairsOpen] = useState(true);
  const [isSentencePairsOpen, setIsSentencePairsOpen] = useState(true);
  const [isVideoTutorialOpen, setIsVideoTutorialOpen] = useState(true);
  const router = useRouter();
  const {
    activeSpeechKey,
    handleCategoryChange,
    handlePairChange,
    handlePlayAllSentences,
    handlePlayAllWords,
    handleSaveProgress,
    handleUnsaveProgress,
    isCategoryLoading,
    isPlayingSentences,
    isPlayingWords,
    isProgressSaved,
    pairsInCategory,
    registerSpeechElement,
    selectedCategory,
    selectedPair,
    selectedPairId,
    speakText,
    stopPlayback,
  } = useMinimalPairs();

  const handleBack = () => {
    stopPlayback();
    router.push('/skill/pronunciation/phoneticSymbols');
  };

  const findWholeWordStart = (sentence: string, targetWord: string): number => {
    if (!sentence || !targetWord) return -1;
    const source = sentence.toLowerCase();
    const target = targetWord.toLowerCase();
    let cursor = 0;

    while (cursor < source.length) {
      const index = source.indexOf(target, cursor);
      if (index === -1) return -1;
      const before = index === 0 ? '' : sentence[index - 1];
      const after = index + target.length >= sentence.length ? '' : sentence[index + target.length];
      const validBefore = !before || !/[A-Za-z]/.test(before);
      const validAfter = !after || !/[A-Za-z]/.test(after);
      if (validBefore && validAfter) return index;
      cursor = index + 1;
    }

    return -1;
  };

  const renderSentenceWithHighlight = (sentence: string, targetWord?: string) => {
    if (!targetWord) return sentence;
    const start = findWholeWordStart(sentence, targetWord);
    if (start === -1) return sentence;
    const end = start + targetWord.length;
    return (
      <>
        {sentence.slice(0, start)}
        <span className="minimal-highlight-token">{sentence.slice(start, end)}</span>
        {sentence.slice(end)}
      </>
    );
  };

  const findTargetWordInSentence = (
    sentence: string,
    side: 'a' | 'b',
    words: Array<{ a: string; b: string }>,
  ): string | undefined => {
    const matched = words.find((wordItem) => {
      const candidate = side === 'a' ? wordItem.a : wordItem.b;
      return findWholeWordStart(sentence, candidate) !== -1;
    });
    return matched ? (side === 'a' ? matched.a : matched.b) : undefined;
  };

  const findMatchedWordItemInSentence = (
    sentence: string,
    side: 'a' | 'b',
    words: MinimalPairWord[],
  ): MinimalPairWord | undefined =>
    words.find((wordItem) => {
      const candidate = side === 'a' ? wordItem.a : wordItem.b;
      return findWholeWordStart(sentence, candidate) !== -1;
    });

  return (
    <div className="pronunciation-layout minimal-pairs-container">
      <div className="minimal-grid-background" />
      <div className="minimal-glow-overlay" />

      <div className="fixed top-4 left-4 z-40">
        <BackButton onClick={handleBack} />
      </div>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        theme="cyber"
        showMenuButton={true}
        onMenuButtonClick={() => setSidebarOpen(true)}
      />

      <main className="minimal-pairs-main scrollbar-hide">
        <header className="minimal-header">
          <h1 className="minimal-title">COMMON MISTAKES</h1>
          <p className="minimal-subtitle">Kesalahan umum yang orang Indonesia lakukan dalam pronunciation</p>
        </header>

        <section className="minimal-controls">
          <label className="minimal-control">
            <span>Category</span>
            <select
              id="minimal-pairs-category"
              name="minimalPairsCategory"
              value={selectedCategory}
              onChange={(event) => handleCategoryChange(event.target.value as MinimalPairCategory)}
            >
              {minimalPairCategories.map((category) => (
                <option key={category} value={category}>
                  {categoryLabelMap[category]}
                </option>
              ))}
            </select>
          </label>

          <label className="minimal-control">
            <span>Pair</span>
            <select
              id="minimal-pairs-pair"
              name="minimalPairsPair"
              value={selectedPairId}
              onChange={(event) => handlePairChange(event.target.value)}
              disabled={isCategoryLoading}
            >
              {pairsInCategory.map((pair) => (
                <option key={pair.id} value={pair.id}>
                  {pair.pairLabel}
                </option>
              ))}
            </select>
          </label>

          <div className="minimal-actions">
            <button className="minimal-action-button" onClick={handlePlayAllWords} type="button" disabled={isCategoryLoading}>
              {isPlayingWords ? <Pause size={14} /> : <Play size={14} />}
              <span>{isPlayingWords ? 'Stop Words' : 'Play Words'}</span>
            </button>
            <button className="minimal-action-button" onClick={handlePlayAllSentences} type="button" disabled={isCategoryLoading}>
              {isPlayingSentences ? <Pause size={14} /> : <Play size={14} />}
              <span>{isPlayingSentences ? 'Stop Sentences' : 'Play Sentences'}</span>
            </button>
          </div>
        </section>

        {isCategoryLoading && (
          <section className="minimal-card">
            <div className="minimal-skeleton-block" />
            <div className="minimal-skeleton-grid">
              {Array.from({ length: 4 }).map((_, index) => (
                <div className="minimal-skeleton-row" key={`skeleton-${index}`} />
              ))}
            </div>
          </section>
        )}

        {!isCategoryLoading && selectedPair && (
          <>
            {selectedPair.id === 'diphthong-er-r' && (
              <section className="minimal-card">
                <p>
                  Pair ini pakai dua voice: sisi A memakai English (`en-US`), sisi B memakai Indonesian (`id-ID`) untuk latihan
                  trill r.
                </p>
              </section>
            )}
            <section className="minimal-pair-info">
              <div>
                <h2>{selectedPair.pairLabel}</h2>
                {selectedPair.notes && <p>{selectedPair.notes}</p>}
                {selectedPair.isTemplateContent && (
                  <p className="minimal-draft-note">Draft content detected. You can replace sample items in `minimalPairs/data.ts`.</p>
                )}
              </div>
              <ButtonSavedProgress
                isSaved={isProgressSaved}
                onSave={handleSaveProgress}
                onUnsave={handleUnsaveProgress}
                size="small"
                variant="primary"
                topicName={`Minimal Pair ${selectedPair.pairLabel}`}
              />
            </section>

            <section className="minimal-card">
              <div className="minimal-section-head">
                <h3>10 Word Pairs</h3>
                <button
                  type="button"
                  className="minimal-section-toggle"
                  onClick={() => setIsWordPairsOpen((prev) => !prev)}
                  aria-expanded={isWordPairsOpen}
                  title={isWordPairsOpen ? 'Tutup 10 Word Pairs' : 'Buka 10 Word Pairs'}
                >
                  <ChevronDown className={`minimal-section-chevron ${isWordPairsOpen ? 'is-open' : ''}`} size={14} />
                </button>
              </div>
              {isWordPairsOpen && (
                <div className="minimal-list minimal-list-two-col">
                  {selectedPair.words.map((item, index) => (
                    <div className="minimal-row minimal-word-row minimal-compare-row" key={`${item.a}-${item.b}-${index}`}>
                      <button
                        ref={(el) => registerSpeechElement(`word-${index}-a`, el)}
                        className={`minimal-example-button ${activeSpeechKey === `word-${index}-a` ? 'active' : ''}`}
                        type="button"
                        onClick={() => speakText(item.ttsA ?? item.a, `word-${index}-a`, item.ttsLangA ?? 'en-US')}
                      >
                        <div className="minimal-word-content">
                          <strong>{item.a}</strong>
                          <span>{item.ipaA ? `/${item.ipaA}/` : '-'}</span>
                        </div>
                      </button>

                      <div className="minimal-vs-cell">VS</div>

                      <button
                        ref={(el) => registerSpeechElement(`word-${index}-b`, el)}
                        className={`minimal-example-button ${activeSpeechKey === `word-${index}-b` ? 'active' : ''}`}
                        type="button"
                        onClick={() =>
                          speakText(
                            item.ttsB ?? item.b,
                            `word-${index}-b`,
                            item.ttsLangB ?? (selectedPair.id === 'diphthong-er-r' ? 'id-ID' : 'en-US'),
                          )
                        }
                      >
                        <div className="minimal-word-content">
                          <strong>{item.b}</strong>
                          <span>{item.ipaB ? `/${item.ipaB}/` : '-'}</span>
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="minimal-card">
              <div className="minimal-section-head">
                <h3>5 Sentence Pairs</h3>
                <button
                  type="button"
                  className="minimal-section-toggle"
                  onClick={() => setIsSentencePairsOpen((prev) => !prev)}
                  aria-expanded={isSentencePairsOpen}
                  title={isSentencePairsOpen ? 'Tutup 5 Sentence Pairs' : 'Buka 5 Sentence Pairs'}
                >
                  <ChevronDown className={`minimal-section-chevron ${isSentencePairsOpen ? 'is-open' : ''}`} size={14} />
                </button>
              </div>
              {isSentencePairsOpen && (
                <div className="minimal-list">
                  {selectedPair.sentences.map((item, index) => (
                    <div className="minimal-row minimal-sentence-row minimal-compare-row" key={`${item.a}-${item.b}-${index}`}>
                      <button
                        ref={(el) => registerSpeechElement(`sentence-${index}-a`, el)}
                        className={`minimal-example-button ${activeSpeechKey === `sentence-${index}-a` ? 'active' : ''}`}
                        type="button"
                        onClick={() => {
                          const matchedA = findMatchedWordItemInSentence(item.a, 'a', selectedPair.words);
                          speakText(item.a, `sentence-${index}-a`, matchedA?.ttsLangA ?? 'en-US');
                        }}
                      >
                        <p className="minimal-sentence-text">
                          {renderSentenceWithHighlight(item.a, findTargetWordInSentence(item.a, 'a', selectedPair.words))}
                        </p>
                      </button>

                      <div className="minimal-vs-cell">VS</div>

                      <button
                        ref={(el) => registerSpeechElement(`sentence-${index}-b`, el)}
                        className={`minimal-example-button ${activeSpeechKey === `sentence-${index}-b` ? 'active' : ''}`}
                        type="button"
                        onClick={() => {
                          const matchedB = findMatchedWordItemInSentence(item.b, 'b', selectedPair.words);
                          speakText(
                            item.b,
                            `sentence-${index}-b`,
                            matchedB?.ttsLangB ?? (selectedPair.id === 'diphthong-er-r' ? 'id-ID' : 'en-US'),
                          );
                        }}
                      >
                        <p className="minimal-sentence-text">
                          {renderSentenceWithHighlight(item.b, findTargetWordInSentence(item.b, 'b', selectedPair.words))}
                        </p>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="minimal-card">
              <div className="minimal-section-head">
                <h3>Video Tutorial</h3>
                <button
                  type="button"
                  className="minimal-section-toggle"
                  onClick={() => setIsVideoTutorialOpen((prev) => !prev)}
                  aria-expanded={isVideoTutorialOpen}
                  title={isVideoTutorialOpen ? 'Tutup Video Tutorial' : 'Buka Video Tutorial'}
                >
                  <ChevronDown className={`minimal-section-chevron ${isVideoTutorialOpen ? 'is-open' : ''}`} size={14} />
                </button>
              </div>
              {isVideoTutorialOpen && (
                <div className="minimal-video-locked">
                  <div>
                    <p className="minimal-video-caption">Video masih dikunci untuk saat ini.</p>
                  </div>
                  <span className="minimal-video-locked-pill">Locked</span>
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <RecordingControlsButton downloadFileName={`minimal-pairs-${selectedPairId || 'practice'}-GEUWAT-recording.wav`} />
    </div>
  );
};

export default MinimalPairsPage;
