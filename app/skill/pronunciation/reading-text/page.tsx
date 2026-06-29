'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { Play, Square } from 'lucide-react';
import BackButton from '../../components/BackButton';
import Sidebar from '../../components/skillSidebar/SkillSidebar';
import { ControlCenter, PlayStopButton } from '@/app/components';
import { primeBestEnglishVoice } from '../final-sound-new/tts-utils';
import { createUtterance, stopSpeech } from '@/lib/tts/speech';
import { READING_TEXT_MATERIALS, type ReadingTextMaterial } from './data/readingTexts';
import CustomSelect from '@/app/components/CustomSelect/CustomSelect';
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
  const [activeTab, setActiveTab] = useState<TabKey>('origin');
  const [activeSpeechMode, setActiveSpeechMode] = useState<'all' | 'single' | null>(null);
  const [activeParagraphKey, setActiveParagraphKey] = useState<string | null>(null);
  
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

  const speakQueueItem = useCallback((text: string, key: string, token: number): Promise<void> => {
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

      const finish = () => {
        if (speechTokenRef.current === token) {
          setActiveParagraphKey((current) => (current === key ? null : current));
        }
        resolve();
      };
      utterance.onend = finish;
      utterance.onerror = finish;

      if (speechTokenRef.current !== token) {
        resolve();
        return;
      }

      setActiveParagraphKey(key);
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

      const key = `${selectedMaterial?.id}-${activeTab === 'phonetic' ? 'ph' : 'p'}-${index}`;

      window.setTimeout(() => {
        const el = document.getElementById(key);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);

      await speakQueueItem(validParagraphs[index], key, token);
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
  }, [paragraphs, selectedMaterial?.id, activeTab, speakQueueItem, stopAllSpeech]);

  const playSingleParagraph = useCallback(
    async (text: string, key: string) => {
      if (!text) return;

      stopAllSpeech();
      const token = speechTokenRef.current;
      setActiveSpeechMode('single');
      setActiveParagraphKey(key);

      await primeBestEnglishVoice();
      if (speechTokenRef.current !== token) return;

      await speakQueueItem(text, key, token);
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
      if (activeParagraphKey === key) {
        stopAllSpeech();
        return;
      }
      void playSingleParagraph(text, key);
    },
    [activeParagraphKey, playSingleParagraph, stopAllSpeech],
  );

  const handleSelect = useCallback((nextId: string) => {
    stopAllSpeech();
    setSelectedId(nextId);
  }, [stopAllSpeech]);

  useEffect(() => {
    return () => {
      stopAllSpeech();
    };
  }, [stopAllSpeech]);

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

        </header>

        <div className="rt-select-wrap">
          <label className="rt-label">Pilih Text</label>
          <CustomSelect
            value={selectedId}
            onChange={handleSelect}
            options={READING_TEXT_MATERIALS.map((item) => ({ value: item.id, label: item.title }))}
            className="rt-custom-select"
          />
        </div>

        <article className="rt-card" aria-label="Reading text">
          <header className="rt-card-head">
            <div className="rt-card-head-top">
              <h2 className="rt-card-title">{selectedMaterial?.title}</h2>
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
                  const isActive = activeParagraphKey === key;

                  return (
                    <div key={key} id={key} className="rt-paragraph-row">
                      <button
                        type="button"
                        className={`rt-paragraph-play ${isActive ? 'is-active' : ''}`}
                        onClick={() => toggleSinglePlay(speechText, key)}
                        aria-pressed={isActive}
                        aria-label={isActive ? 'Stop reading' : 'Play reading'}
                        title={isActive ? 'Stop reading' : 'Play reading'}
                      >
                        {isActive ? (
                          <Square size={12} fill="currentColor" />
                        ) : (
                          <Play size={12} fill="currentColor" className="ml-0.5" />
                        )}
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
                  const isActive = activeParagraphKey === key;
                  const disabled = !originText;

                  return (
                    <div key={key} id={key} className="rt-paragraph-row">
                      <button
                        type="button"
                        className={`rt-paragraph-play ${isActive ? 'is-active' : ''}`}
                        onClick={() => toggleSinglePlay(originText, key)}
                        aria-pressed={isActive}
                        disabled={disabled}
                        aria-label={isActive ? 'Stop reading' : 'Play reading'}
                        title={disabled ? 'Origin text not found for this paragraph.' : (isActive ? 'Stop reading' : 'Play reading')}
                      >
                        {isActive ? (
                          <Square size={12} fill="currentColor" />
                        ) : (
                          <Play size={12} fill="currentColor" className="ml-0.5" />
                        )}
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

      <ControlCenter
        bottomControls={
          <PlayStopButton
            isActive={activeSpeechMode === 'all'}
            label="TEXT"
            onClick={togglePlayAll}
            size="md"
          />
        }
      />

      <RecordingControlsButton
        className="rt-recording-anchor"
        downloadFileName="reading-text-GEUWAT-recording.mp3"
      />
    </div>
  );
}
