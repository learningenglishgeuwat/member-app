'use client';

import React, { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';
import './styles/minimalPairs.css';
import BackButton from '../../../components/BackButton';
import Sidebar from '../../../components/skillSidebar/SkillSidebar';
import ButtonSavedProgress from '../../../components/buttonSavedProgress';
import { ControlCenter, PlayStopButton, IpaVisibilityToggle } from '@/app/components';
import { categoryLabelMap, minimalPairCategories } from './data/index';
import { allWordExamples } from '../data/wordExamples/wordExamples';
import { useMinimalPairs } from './hooks/useMinimalPairs';
import type { MinimalPairCategory, MinimalPairWord } from './types';
import { WORD_HIGHLIGHT_OVERRIDES } from '../data/wordHighlights';

const RecordingControlsButton = dynamic(() => import('../../../components/RecordingControlsButton'), {
  ssr: false,
});

const stripIpaSlashes = (ipa: string) => ipa.replace(/^\/|\/$/g, '');

const CANONICAL_IPA_ALIASES: Record<string, string> = {
  'ɪə': 'ɪr',
  'ʊə': 'ʊr',
  'eə': 'ɛr',
};

const canonicalizeIpa = (symbol: string) => {
  if (!symbol) return symbol;
  const cleaned = symbol.replace(/\s+/g, '').replace(/^\/|\/$/g, '');
  return CANONICAL_IPA_ALIASES[cleaned] ?? cleaned;
};

const COMMON_SENTENCE_IPA: Record<string, string> = {
  a: 'ə',
  about: 'əˈbaʊt',
  again: 'əˈgɛn',
  all: 'ɔl',
  am: 'æm',
  an: 'ən',
  and: 'ænd',
  are: 'ɑr',
  around: 'əˈraʊnd',
  at: 'æt',
  by: 'baɪ',
  can: 'kæn',
  do: 'du',
  "don't": 'doʊnt',
  for: 'fɔr',
  from: 'frʌm',
  he: 'hi',
  her: 'hɚ',
  here: 'hɪr',
  his: 'hɪz',
  i: 'aɪ',
  in: 'ɪn',
  is: 'ɪz',
  it: 'ɪt',
  its: 'ɪts',
  me: 'mi',
  my: 'maɪ',
  near: 'nɪr',
  of: 'əv',
  on: 'ɑn',
  one: 'wʌn',
  outside: 'ˌaʊtˈsaɪd',
  please: 'pliz',
  say: 'seɪ',
  she: 'ʃi',
  that: 'ðæt',
  the: 'ðə',
  them: 'ðɛm',
  then: 'ðɛn',
  there: 'ðɛr',
  they: 'ðeɪ',
  this: 'ðɪs',
  to: 'tu',
  too: 'tu',
  two: 'tu',
  use: 'juz',
  very: 'ˈvɛri',
  was: 'wʌz',
  we: 'wi',
  will: 'wɪl',
  with: 'wɪð',
  you: 'ju',
  your: 'jʊr',
};

const BASE_WORD_IPA = Object.values(allWordExamples).reduce<Record<string, string>>((acc, examples) => {
  examples.forEach((example) => {
    acc[example.word.toLowerCase()] = stripIpaSlashes(example.ipa || '');
  });
  return acc;
}, { ...COMMON_SENTENCE_IPA });

const normalizeSentenceWord = (word: string) => word.toLowerCase().replace(/^["']|["']$/g, '');

const MinimalPairsPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isWordPairsOpen, setIsWordPairsOpen] = useState(true);
  const [isSentencePairsOpen, setIsSentencePairsOpen] = useState(true);
  const [isVideoTutorialOpen, setIsVideoTutorialOpen] = useState(true);
  const [showIpa, setShowIpa] = useState(true);
  const [showHighlight, setShowHighlight] = useState(true);
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

  const selectedPairSymbols = useMemo(() => {
    if (!selectedPair?.pairLabel) return { a: '', b: '' };
    const [left = '', right = ''] = selectedPair.pairLabel.split('↔');

    const normalizeSymbol = (value: string) =>
      value
        .replace(/\([^)]*\)/g, '')
        .trim()
        .replace(/^\/|\/$/g, '');

    return {
      a: normalizeSymbol(left),
      b: normalizeSymbol(right),
    };
  }, [selectedPair]);

  const selectedPairWordIpa = useMemo(() => {
    const entries: Record<string, string> = {};
    selectedPair?.words.forEach((word) => {
      if (word.ipaA) entries[normalizeSentenceWord(word.a)] = stripIpaSlashes(word.ipaA);
      if (word.ipaB) entries[normalizeSentenceWord(word.b)] = stripIpaSlashes(word.ipaB);
    });
    return entries;
  }, [selectedPair?.words]);

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

  const renderWord = (word: string, side: 'a' | 'b') => {
    if (!showHighlight) return word;

    const symbol = canonicalizeIpa(selectedPairSymbols[side]);
    const lowerWord = word.toLowerCase();
    const symbolOverrides = WORD_HIGHLIGHT_OVERRIDES[symbol];

    // Only highlight if word has an explicit override entry — no regex fallback
    const patterns = (symbolOverrides && symbolOverrides[lowerWord])
      ? symbolOverrides[lowerWord]
      : [];

    if (patterns.length === 0) return word;

    const sortedPatterns = [...patterns].sort((a, b) => b.length - a.length);
    const escapedPatterns = sortedPatterns.map(p => p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/_/g, '.'));
    const regex = new RegExp(`(${escapedPatterns.join('|')})`, 'ig');

    const parts = word.split(regex);
    return (
      <>
        {parts.map((part, index) => {
          if (index % 2 === 1) {
            return (
              <span key={index} className="minimal-letter-highlight">
                {part}
              </span>
            );
          }
          return <React.Fragment key={index}>{part}</React.Fragment>;
        })}
      </>
    );
  };

  const renderIpa = (ipa: string, side: 'a' | 'b') => {
    const symbol = canonicalizeIpa(selectedPairSymbols[side]);
    if (!showHighlight || !symbol) return ipa;

    const escapedSymbol = symbol.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${escapedSymbol})`, 'g');

    if (regex.test(ipa)) {
      const parts = ipa.split(regex);
      return (
        <>
          {parts.map((part, index) => {
            if (index % 2 === 1) {
              return (
                <span key={index} className="minimal-letter-highlight">
                  {part}
                </span>
              );
            }
            return <React.Fragment key={index}>{part}</React.Fragment>;
          })}
        </>
      );
    }

    return ipa;
  };

  const sentenceToIpa = (sentence: string) => {
    const words = sentence.match(/[A-Za-z]+(?:'[A-Za-z]+)?/g) ?? [];
    return words
      .map((word) => {
        const normalizedWord = normalizeSentenceWord(word);
        return selectedPairWordIpa[normalizedWord] ?? BASE_WORD_IPA[normalizedWord] ?? normalizedWord;
      })
      .join(' ');
  };

  const renderSentenceWithHighlight = (sentence: string, side: 'a' | 'b', targetWord?: string) => {
    if (!showHighlight || !targetWord) return sentence;
    const start = findWholeWordStart(sentence, targetWord);
    if (start === -1) return sentence;
    const end = start + targetWord.length;
    return (
      <>
        {sentence.slice(0, start)}
        {renderWord(sentence.slice(start, end), side)}
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
            {selectedPair.id === 'diphthong-ɚ-r' && (
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
                          <strong>{renderWord(item.a, 'a')}</strong>
                          <span>{showIpa ? (item.ipaA ? <>/{renderIpa(item.ipaA, 'a')}/</> : '-') : ''}</span>
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
                            item.ttsLangB ?? (selectedPair.id === 'diphthong-ɚ-r' ? 'id-ID' : 'en-US'),
                          )
                        }
                      >
                        <div className="minimal-word-content">
                          <strong>{renderWord(item.b, 'b')}</strong>
                          <span>{showIpa ? (item.ipaB ? <>/{renderIpa(item.ipaB, 'b')}/</> : '-') : ''}</span>
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
                  {selectedPair.sentences.map((item, index) => {
                    const matchedA = findMatchedWordItemInSentence(item.a, 'a', selectedPair.words);
                    const matchedB = findMatchedWordItemInSentence(item.b, 'b', selectedPair.words);
                    const sentenceIpaA = item.ipaA ?? sentenceToIpa(item.a);
                    const sentenceIpaB = item.ipaB ?? sentenceToIpa(item.b);

                    return (
                      <div className="minimal-row minimal-sentence-row minimal-compare-row" key={`${item.a}-${item.b}-${index}`}>
                        <button
                          ref={(el) => registerSpeechElement(`sentence-${index}-a`, el)}
                          className={`minimal-example-button ${activeSpeechKey === `sentence-${index}-a` ? 'active' : ''}`}
                          type="button"
                          onClick={() => {
                            speakText(item.a, `sentence-${index}-a`, matchedA?.ttsLangA ?? 'en-US');
                          }}
                        >
                          <span className="minimal-sentence-content">
                            <span className="minimal-sentence-text">
                              {renderSentenceWithHighlight(item.a, 'a', findTargetWordInSentence(item.a, 'a', selectedPair.words))}
                            </span>
                            {showIpa && sentenceIpaA ? (
                              <span className="minimal-sentence-ipa" data-ipa>
                                /{renderIpa(sentenceIpaA, 'a')}/
                              </span>
                            ) : null}
                          </span>
                        </button>

                        <div className="minimal-vs-cell">VS</div>

                        <button
                          ref={(el) => registerSpeechElement(`sentence-${index}-b`, el)}
                          className={`minimal-example-button ${activeSpeechKey === `sentence-${index}-b` ? 'active' : ''}`}
                          type="button"
                          onClick={() => {
                            speakText(
                              item.b,
                              `sentence-${index}-b`,
                              matchedB?.ttsLangB ?? (selectedPair.id === 'diphthong-ɚ-r' ? 'id-ID' : 'en-US'),
                            );
                          }}
                        >
                          <span className="minimal-sentence-content">
                            <span className="minimal-sentence-text">
                              {renderSentenceWithHighlight(item.b, 'b', findTargetWordInSentence(item.b, 'b', selectedPair.words))}
                            </span>
                            {showIpa && sentenceIpaB ? (
                              <span className="minimal-sentence-ipa" data-ipa>
                                /{renderIpa(sentenceIpaB, 'b')}/
                              </span>
                            ) : null}
                          </span>
                        </button>
                      </div>
                    );
                  })}
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

      <ControlCenter
        topControls={
          <div className="flex flex-col gap-3">
            <IpaVisibilityToggle
              checked={showIpa}
              onChange={setShowIpa}
              className="w-full flex justify-between text-[10px] sm:text-xs"
            />
            <IpaVisibilityToggle
              checked={showHighlight}
              onChange={setShowHighlight}
              label="Highlight Letters"
              className="w-full flex justify-between text-[10px] sm:text-xs"
              activeClass="text-orange-200"
              activeTrackClass="bg-orange-400 shadow-[0_0_12px_rgba(251,146,60,0.62)]"
              activeDotClass="bg-orange-300 shadow-[0_0_6px_rgba(253,186,116,0.95)]"
            />
          </div>
        }
        bottomControls={
          <div>
            <div className="flex flex-col gap-2">
              <PlayStopButton
                isActive={isPlayingWords}
                label="WORDS"
                onClick={handlePlayAllWords}
                disabled={isCategoryLoading}
                size="sm"
              />
              <PlayStopButton
                isActive={isPlayingSentences}
                label="SENTENCES"
                onClick={handlePlayAllSentences}
                disabled={isCategoryLoading}
                size="sm"
              />
            </div>
          </div>
        }
      />

      <RecordingControlsButton downloadFileName={`minimal-pairs-${selectedPairId || 'practice'}-GEUWAT-recording.mp3`} />
    </div>
  );
};

export default MinimalPairsPage;
