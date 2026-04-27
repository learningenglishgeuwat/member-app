'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import BackButton from '../../components/BackButton';
import Sidebar from '../../components/skillSidebar/SkillSidebar';
import ButtonSavedProgress from '../../components/buttonSavedProgress';
import { primeBestEnglishVoice } from '../final-sound-new/tts-utils';
import { createUtterance, stopSpeech } from '@/lib/tts/speech';
import { READING_TEXT_MATERIALS, type ReadingTextMaterial } from './data/readingTexts';
import './reading-text.css';

const RecordingControlsButton = dynamic(() => import('../../components/RecordingControlsButton'), {
  ssr: false,
});

const PRONUNCIATION_PROGRESS_KEY = 'pronunciationProgress';
const DASHBOARD_PROGRESS_KEY = 'dashboardProgress';
const READING_TEXT_PROGRESS_ID = 'readingTextPractice';

type TabKey = 'origin' | 'phonetic';

const calcPronunciationAverage = (progress: Record<string, number>): number => {
  const values = Object.values(progress).filter(
    (value): value is number => typeof value === 'number' && Number.isFinite(value) && value > 0,
  );
  if (values.length === 0) return 0;
  return Math.round(values.reduce((sum, value) => sum + value, 0) / values.length);
};

const renderInlineCode = (text: string) => {
  const parts = text.split(/(\$[^$]+\$)/g);
  return parts.map((part, index) => {
    if (!part) return null;
    const match = part.match(/^\$([^$]+)\$$/);
    if (match) {
      return (
        <code key={`rt-code-${index}`} className="rt-inline-code">
          {match[1]}
        </code>
      );
    }
    return <span key={`rt-text-${index}`}>{part}</span>;
  });
};

const normalizeParagraph = (raw: string) => raw.replace(/\s+/g, ' ').trim();

const stripInlineCodeMarkers = (text: string) => text.replace(/\$([^$]+)\$/g, '$1');

export default function ReadingTextForPracticePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string>(READING_TEXT_MATERIALS[0]?.id ?? '');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isProgressSaved, setIsProgressSaved] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      const current = JSON.parse(
        window.localStorage.getItem(PRONUNCIATION_PROGRESS_KEY) || '{}',
      ) as Record<string, number>;
      const value = current[READING_TEXT_PROGRESS_ID];
      return typeof value === 'number' && Number.isFinite(value) && value > 0;
    } catch {
      return false;
    }
  });
  const [activeTab, setActiveTab] = useState<TabKey>('origin');
  const [activeSpeechMode, setActiveSpeechMode] = useState<'all' | 'single' | null>(null);
  const [activeParagraphKey, setActiveParagraphKey] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const speechTokenRef = useRef(0);

  const selectedMaterial = useMemo<ReadingTextMaterial>(() => {
    return (
      READING_TEXT_MATERIALS.find((item) => item.id === selectedId) ?? READING_TEXT_MATERIALS[0]
    );
  }, [selectedId]);

  const paragraphs = useMemo(() => {
    const blocks = (selectedMaterial?.text ?? '').split(/\n\s*\n/g).map((block) => normalizeParagraph(block));
    return blocks.filter(Boolean);
  }, [selectedMaterial?.text]);

  const phoneticParagraphs = useMemo(() => {
    const blocks = (selectedMaterial?.phoneticText ?? '').split(/\n\s*\n/g).map((block) => normalizeParagraph(block));
    return blocks.filter(Boolean);
  }, [selectedMaterial?.phoneticText]);

  const stopAllSpeech = useCallback(() => {
    speechTokenRef.current += 1;
    stopSpeech();
    setActiveSpeechMode(null);
    setActiveParagraphKey(null);
  }, []);

  const speakQueueItem = useCallback((text: string, token: number): Promise<void> => {
    if (!text || typeof window === 'undefined' || !('speechSynthesis' in window)) {
      return Promise.resolve();
    }

    if (speechTokenRef.current !== token) {
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const synth = window.speechSynthesis;
      const utterance = createUtterance(text, {
        preferredEnglish: 'en-US',
        rate: 0.84,
        pitch: 1,
        volume: 1,
        cancelBeforeSpeak: false,
      });
      if (!utterance) {
        resolve();
        return;
      }

      const finish = () => resolve();
      utterance.onend = finish;
      utterance.onerror = finish;

      if (speechTokenRef.current !== token) {
        resolve();
        return;
      }

      synth.speak(utterance);
    });
  }, []);

  const playAllParagraphs = useCallback(async () => {
    const validParagraphs = paragraphs.map(stripInlineCodeMarkers).filter(Boolean);
    if (!validParagraphs.length) return;

    stopAllSpeech();
    const token = speechTokenRef.current;
    setActiveSpeechMode('all');
    setActiveParagraphKey(null);

    await primeBestEnglishVoice();
    if (speechTokenRef.current !== token) return;

    for (let index = 0; index < validParagraphs.length; index += 1) {
      if (speechTokenRef.current !== token) return;

      await speakQueueItem(validParagraphs[index], token);
      if (speechTokenRef.current !== token) return;

      if (index < validParagraphs.length - 1) {
        await new Promise<void>((resolve) => {
          window.setTimeout(resolve, 240);
        });
      }
    }

    if (speechTokenRef.current === token) {
      setActiveSpeechMode(null);
    }
  }, [paragraphs, speakQueueItem, stopAllSpeech]);

  const playSingleParagraph = useCallback(
    async (text: string, key: string) => {
      if (!text) return;

      stopAllSpeech();
      const token = speechTokenRef.current;
      setActiveSpeechMode('single');
      setActiveParagraphKey(key);

      await primeBestEnglishVoice();
      if (speechTokenRef.current !== token) return;

      await speakQueueItem(text, token);
      if (speechTokenRef.current !== token) return;

      setActiveSpeechMode(null);
      setActiveParagraphKey(null);
    },
    [speakQueueItem, stopAllSpeech],
  );

  const togglePlayAll = useCallback(() => {
    if (activeSpeechMode === 'all') {
      stopAllSpeech();
      return;
    }
    void playAllParagraphs();
  }, [activeSpeechMode, playAllParagraphs, stopAllSpeech]);

  const toggleSinglePlay = useCallback(
    (text: string, key: string) => {
      if (activeSpeechMode === 'single' && activeParagraphKey === key) {
        stopAllSpeech();
        return;
      }
      void playSingleParagraph(text, key);
    },
    [activeParagraphKey, activeSpeechMode, playSingleParagraph, stopAllSpeech],
  );

  const handleSelect = useCallback((nextId: string) => {
    stopAllSpeech();
    setSelectedId(nextId);
    setDropdownOpen(false);
  }, [stopAllSpeech]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const outside = dropdownRef.current ? !dropdownRef.current.contains(target) : true;
      if (outside) setDropdownOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setDropdownOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  useEffect(() => {
    return () => {
      stopAllSpeech();
    };
  }, [stopAllSpeech]);

  const handleSaveProgress = useCallback(async (percentage: number) => {
    if (typeof window === 'undefined') return;
    setIsProgressSaved(true);

    const pronunciationProgress = JSON.parse(
      window.localStorage.getItem(PRONUNCIATION_PROGRESS_KEY) || '{}',
    ) as Record<string, number>;
    pronunciationProgress[READING_TEXT_PROGRESS_ID] = percentage;
    window.localStorage.setItem(PRONUNCIATION_PROGRESS_KEY, JSON.stringify(pronunciationProgress));

    const dashboardProgress = JSON.parse(
      window.localStorage.getItem(DASHBOARD_PROGRESS_KEY) || '{}',
    ) as Record<string, number>;
    dashboardProgress.pronunciation = calcPronunciationAverage(pronunciationProgress);
    window.localStorage.setItem(DASHBOARD_PROGRESS_KEY, JSON.stringify(dashboardProgress));
  }, []);

  const handleUnsaveProgress = useCallback(async () => {
    if (typeof window === 'undefined') return;
    setIsProgressSaved(false);

    const pronunciationProgress = JSON.parse(
      window.localStorage.getItem(PRONUNCIATION_PROGRESS_KEY) || '{}',
    ) as Record<string, number>;
    delete pronunciationProgress[READING_TEXT_PROGRESS_ID];
    window.localStorage.setItem(PRONUNCIATION_PROGRESS_KEY, JSON.stringify(pronunciationProgress));

    const dashboardProgress = JSON.parse(
      window.localStorage.getItem(DASHBOARD_PROGRESS_KEY) || '{}',
    ) as Record<string, number>;
    dashboardProgress.pronunciation = calcPronunciationAverage(pronunciationProgress);
    window.localStorage.setItem(DASHBOARD_PROGRESS_KEY, JSON.stringify(dashboardProgress));
  }, []);

  return (
    <div className="pronunciation-layout pronunciation-theme pronunciation-theme--reading-text rt-page">
      <div className="fixed top-6 left-6 z-[100]">
        <BackButton to="/skill/pronunciation" />
      </div>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        showMenuButton={true}
        onMenuButtonClick={() => setSidebarOpen(true)}
      />

      <main className="rt-shell">
        <header className="rt-header">
          <h1 className="rt-title">Reading Text for Practice</h1>
          <p className="rt-subtitle">
            Pilih teks, lalu baca perlahan dengan fokus pada clarity, rhythm, dan konsistensi bunyi.
          </p>
          <div className="rt-progress-actions">
            <ButtonSavedProgress
              isSaved={isProgressSaved}
              onSave={handleSaveProgress}
              onUnsave={handleUnsaveProgress}
              size="small"
              variant="primary"
              topicName="Reading Text for Practice"
            />
          </div>
        </header>

        <label className="rt-label" htmlFor="rt-select">
          Pilih Text
        </label>
        <div className="rt-dropdown" ref={dropdownRef}>
          <button
            id="rt-select"
            type="button"
            className="rt-select"
            aria-haspopup="listbox"
            aria-expanded={dropdownOpen}
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            <span className="rt-select-text">{selectedMaterial?.title ?? 'Select'}</span>
            <span className={`rt-caret ${dropdownOpen ? 'is-open' : ''}`} aria-hidden="true" />
          </button>

          {dropdownOpen ? (
            <ul className="rt-dropdown-list" role="listbox" aria-labelledby="rt-select">
              {READING_TEXT_MATERIALS.map((item) => (
                <li key={item.id} role="option" aria-selected={item.id === selectedId}>
                  <button
                    type="button"
                    className={`rt-dropdown-item ${item.id === selectedId ? 'is-active' : ''}`}
                    onClick={() => handleSelect(item.id)}
                  >
                    {item.title}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <article className="rt-card" aria-label="Reading text">
          <header className="rt-card-head">
            <div className="rt-card-head-top">
              <h2 className="rt-card-title">{selectedMaterial?.title}</h2>
              <div className="rt-card-actions">
                <button
                  type="button"
                  className={`rt-tts-btn ${activeSpeechMode === 'all' ? 'is-speaking' : ''}`}
                  onClick={togglePlayAll}
                  aria-pressed={activeSpeechMode === 'all'}
                >
                  {activeSpeechMode === 'all' ? 'Stop' : 'Play All'}
                </button>
              </div>
            </div>

            <div className="rt-tabs" role="tablist" aria-label="Reading text mode">
              <button
                type="button"
                className={`rt-tab ${activeTab === 'origin' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('origin')}
                role="tab"
                aria-selected={activeTab === 'origin'}
              >
                Origin Text
              </button>
              <button
                type="button"
                className={`rt-tab ${activeTab === 'phonetic' ? 'is-active' : ''}`}
                onClick={() => setActiveTab('phonetic')}
                role="tab"
                aria-selected={activeTab === 'phonetic'}
              >
                Phonetic Transcription
              </button>
            </div>
          </header>

          <div className="rt-card-body">
            {activeTab === 'origin' ? (
              <div className="rt-reading-group">
                {paragraphs.map((paragraph, index) => {
                  const speechText = stripInlineCodeMarkers(paragraph);
                  const key = `${selectedMaterial?.id}-p-${index}`;
                  const isActive = activeSpeechMode === 'single' && activeParagraphKey === key;

                  return (
                    <div key={key} className="rt-paragraph-row">
                      <button
                        type="button"
                        className={`rt-paragraph-play ${isActive ? 'is-active' : ''}`}
                        onClick={() => toggleSinglePlay(speechText, key)}
                        aria-pressed={isActive}
                      >
                        {isActive ? 'Stop' : 'Play'}
                      </button>
                      <p className="rt-paragraph">{renderInlineCode(paragraph)}</p>
                    </div>
                  );
                })}
              </div>
            ) : phoneticParagraphs.length ? (
              <div className="rt-reading-group">
                {phoneticParagraphs.map((paragraph, index) => {
                  const originText = paragraphs[index] ? stripInlineCodeMarkers(paragraphs[index]) : '';
                  const key = `${selectedMaterial?.id}-ph-${index}`;
                  const isActive = activeSpeechMode === 'single' && activeParagraphKey === key;
                  const disabled = !originText;

                  return (
                    <div key={key} className="rt-paragraph-row">
                      <button
                        type="button"
                        className={`rt-paragraph-play ${isActive ? 'is-active' : ''}`}
                        onClick={() => toggleSinglePlay(originText, key)}
                        aria-pressed={isActive}
                        disabled={disabled}
                        title={disabled ? 'Origin text not found for this paragraph.' : 'Play origin text'}
                      >
                        {isActive ? 'Stop' : 'Play'}
                      </button>
                      <p className="rt-paragraph rt-phonetic">{paragraph}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="rt-paragraph rt-empty">Phonetic transcription belum tersedia untuk teks ini.</p>
            )}
          </div>
        </article>
      </main>

      <RecordingControlsButton
        className="rt-recording-anchor"
        downloadFileName="reading-text-GEUWAT-recording.wav"
      />
    </div>
  );
}
