'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Highlighter, Play } from 'lucide-react';
import BackButton from '../../components/BackButton';
import Sidebar from '../../components/skillSidebar/SkillSidebar';
import ButtonSavedProgress from '../../components/buttonSavedProgress';
import { ControlCenter } from '@/app/components';
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
type HighlightMapKey = 'ipa' | 'examples';
type HighlightLegendItem = {
  key: HighlightMapKey;
  color: string;
  label: string;
  description: string;
};

const getHighlightLegendItems = (activeTab: TabKey): HighlightLegendItem[] => [
  {
    key: 'ipa',
    color: '#00E5FF',
    label: 'Cyan',
    description:
      activeTab === 'phonetic'
        ? 'Transkripsi fonetik yang sedang dibaca'
        : 'Dipakai di tab Phonetic Transcription',
  },
  {
    key: 'examples',
    color: '#a5b4fc',
    label: 'Example',
    description: 'Contoh bunyi atau kata yang ditandai di Origin Text',
  },
];

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
  const [isHighlightEnabled, setIsHighlightEnabled] = useState(true);
  const [highlightMapEnabled, setHighlightMapEnabled] = useState<Record<HighlightMapKey, boolean>>({
    ipa: true,
    examples: true,
  });
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
  const highlightLegendItems = useMemo(() => getHighlightLegendItems(activeTab), [activeTab]);

  const toggleHighlightMapItem = useCallback((key: HighlightMapKey) => {
    setHighlightMapEnabled((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

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
    <div
      className={`pronunciation-layout pronunciation-theme pronunciation-theme--reading-text rt-page ${
        isHighlightEnabled ? '' : 'rt-highlight-off'
      } ${highlightMapEnabled.ipa ? '' : 'rt-ipa-highlight-off'} ${
        highlightMapEnabled.examples ? '' : 'rt-example-highlight-off'
      }`}
    >
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

      <ControlCenter>
        <button
          type="button"
          onClick={() => setIsHighlightEnabled((prev) => !prev)}
          className={`w-full border px-2 py-1.5 sm:px-4 sm:py-3 font-mono text-[8px] sm:text-xs uppercase rounded-lg sm:rounded-xl flex items-center justify-between transition-all ${
            isHighlightEnabled
              ? 'bg-amber-500/15 border-amber-400/50 text-amber-100'
              : 'bg-[#1a1f24] border-white/10 text-white/60 hover:bg-amber-900/20 hover:border-amber-500/30'
          }`}
          aria-pressed={isHighlightEnabled}
        >
          <span className="tracking-widest font-bold">HIGHLIGHT</span>
          <Highlighter className={`w-3 h-3 sm:w-4 sm:h-4 ${isHighlightEnabled ? 'text-amber-300' : 'text-white/45'}`} />
        </button>

        {isHighlightEnabled ? (
          <div className="rounded-lg sm:rounded-xl border border-white/10 bg-[#1a1f24]/80 px-2 py-2 sm:px-4 sm:py-3">
            <p className="mb-2 font-mono text-[8px] sm:text-[10px] uppercase tracking-widest text-white/45">
              Highlight Map
            </p>
            <div className="flex flex-col gap-2">
              {highlightLegendItems.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  className={`flex w-full items-start gap-2 rounded-lg border px-2 py-2 text-left transition-all ${
                    highlightMapEnabled[item.key]
                      ? 'border-white/10 bg-white/[0.03] text-white/80'
                      : 'border-white/5 bg-transparent text-white/35'
                  }`}
                  onClick={() => toggleHighlightMapItem(item.key)}
                  aria-pressed={highlightMapEnabled[item.key]}
                >
                  <span
                    aria-hidden="true"
                    className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full shadow-[0_0_10px_currentColor] sm:h-3 sm:w-3 ${
                      highlightMapEnabled[item.key] ? '' : 'opacity-30 grayscale'
                    }`}
                    style={{ backgroundColor: item.color, color: item.color }}
                  />
                  <span className="min-w-0">
                    <span className="block font-mono text-[8px] font-bold uppercase tracking-wider sm:text-[10px]">
                      {item.label}
                    </span>
                    <span className="block text-[9px] leading-snug text-white/50 sm:text-xs">
                      {item.description}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <hr className="border-white/10" />

        <button
          type="button"
          className={`w-full bg-[#1a1f24] border border-white/10 text-white/80 px-2 py-1.5 sm:px-4 sm:py-3 font-mono text-[8px] sm:text-xs uppercase rounded-lg sm:rounded-xl flex items-center justify-between hover:bg-cyan-900/20 hover:border-cyan-500/30 transition-all group ${
            activeSpeechMode === 'all' ? 'is-active' : ''
          }`}
          onClick={togglePlayAll}
        >
          <span className="tracking-widest font-bold">
            {activeSpeechMode === 'all' ? 'STOP TEXT' : 'PLAY TEXT'}
          </span>
          <Play className={`w-3 h-3 sm:w-4 sm:h-4 transition-colors ${activeSpeechMode === 'all' ? 'fill-cyan-400 stroke-cyan-400 text-cyan-400' : 'fill-transparent stroke-current group-hover:fill-cyan-400 group-hover:stroke-cyan-400 group-hover:text-cyan-400'}`} />
        </button>
      </ControlCenter>

      <RecordingControlsButton
        className="rt-recording-anchor"
        downloadFileName="reading-text-GEUWAT-recording.wav"
      />
    </div>
  );
}
