'use client'

import React, { CSSProperties, useCallback, useEffect, useRef, useState } from 'react';
// import { useRouter } from 'next/navigation';
import { Volume2 } from 'lucide-react';
import BackButton from '../../../components/BackButton';
import Sidebar from '../../../components/skillSidebar/SkillSidebar';
import { AME_VS_BRE_BRITISH_NOTES } from './data/ameVsBreData';
import { ControlCenter, IpaVisibilityToggle, PlayStopButton } from '@/app/components';
import { isSpeechSynthesisSupported, speakTextWithPause, stopSpeech, waitForVoices } from '@/lib/tts/speech';
import { renderIpa, renderWord } from '../[symbol]/helpers/highlightHelpers';
import './styles/ameVsBre.css';

const highlightLetterStyle: CSSProperties = {
  color: '#fb923c',
  fontWeight: 900,
  textShadow: '0 0 8px rgba(251,146,60,0.95), 0 0 16px rgba(251,146,60,0.6)',
};

const AMeVsBrEPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showIpa, setShowIpa] = useState(true);
  const [showHighlight, setShowHighlight] = useState(true);
  const [isPlayingExamples, setIsPlayingExamples] = useState(false);
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [activeNoteId, setActiveNoteId] = useState<string>(AME_VS_BRE_BRITISH_NOTES[0]?.id ?? '');
  const availableNotes = AME_VS_BRE_BRITISH_NOTES;
  const activeNote = availableNotes.find((note) => note.id === activeNoteId) ?? availableNotes[0] ?? null;
  const pageSymbolForHighlight = activeNote?.id === 'j' ? 'u' : activeNote?.id ?? '';
  const playSessionRef = useRef(0);
  const playNextTimeoutRef = useRef<number | null>(null);
  const playNextResolveRef = useRef<(() => void) | null>(null);
  const wordCardRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    void waitForVoices();
    return () => {
      playSessionRef.current += 1;
      if (playNextTimeoutRef.current) {
        window.clearTimeout(playNextTimeoutRef.current);
        playNextTimeoutRef.current = null;
      }
      if (playNextResolveRef.current) {
        playNextResolveRef.current();
        playNextResolveRef.current = null;
      }
      stopSpeech();
    };
  }, []);

  const stopExamplePlayback = useCallback(() => {
    playSessionRef.current += 1;
    if (playNextTimeoutRef.current) {
      window.clearTimeout(playNextTimeoutRef.current);
      playNextTimeoutRef.current = null;
    }
    if (playNextResolveRef.current) {
      playNextResolveRef.current();
      playNextResolveRef.current = null;
    }
    stopSpeech();
    setIsPlayingExamples(false);
    setActiveWord(null);
  }, []);

  const playExampleWords = useCallback(async () => {
    if (!isSpeechSynthesisSupported() || !activeNote || activeNote.items.length === 0) return;

    if (isPlayingExamples) {
      stopExamplePlayback();
      return;
    }

    stopExamplePlayback();
    const currentSession = ++playSessionRef.current;
    setIsPlayingExamples(true);

    for (let index = 0; index < activeNote.items.length; index += 1) {
      if (currentSession !== playSessionRef.current) break;
      const item = activeNote.items[index];

      setActiveWord(item.word);
      if (wordCardRefs.current[index]) {
        wordCardRefs.current[index]?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center',
        });
      }

      await speakTextWithPause(item.word, {
        preferredEnglish: 'en-US',
        rate: 0.88,
        pitch: 1,
        volume: 1,
      });

      if (currentSession !== playSessionRef.current) break;

      await new Promise<void>((resolve) => {
        playNextResolveRef.current = resolve;
        playNextTimeoutRef.current = window.setTimeout(() => {
          playNextTimeoutRef.current = null;
          playNextResolveRef.current = null;
          resolve();
        }, 240);
      });

      if (currentSession !== playSessionRef.current) break;

      await speakTextWithPause(item.word, {
        preferredEnglish: 'en-GB',
        rate: 0.88,
        pitch: 1,
        volume: 1,
      });

      if (currentSession !== playSessionRef.current) break;

      await new Promise<void>((resolve) => {
        playNextResolveRef.current = resolve;
        playNextTimeoutRef.current = window.setTimeout(() => {
          playNextTimeoutRef.current = null;
          playNextResolveRef.current = null;
          resolve();
        }, 400);
      });
    }

    if (currentSession === playSessionRef.current) {
      setIsPlayingExamples(false);
      setActiveWord(null);
    }
  }, [activeNote, isPlayingExamples, stopExamplePlayback]);

  const playSinglePronunciation = useCallback(async (word: string, locale: 'en-US' | 'en-GB') => {
    if (!isSpeechSynthesisSupported()) return;
    stopExamplePlayback();
    setActiveWord(word);

    await speakTextWithPause(word, {
      preferredEnglish: locale,
      rate: 0.88,
      pitch: 1,
      volume: 1,
    });

    setActiveWord(null);
  }, [stopExamplePlayback]);

  return (
    <div className="pronunciation-layout ame-vs-bre-page">
      <div className="ame-vs-bre-grid-background" />
      <div className="ame-vs-bre-particles" />
      <div className="ame-vs-bre-glow-overlay" />

      <div className="fixed top-6 left-6 z-[100]">
        <BackButton to="/skill/pronunciation/phoneticSymbols" />
      </div>

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        showMenuButton={true}
        onMenuButtonClick={() => setSidebarOpen(true)}
      />

      <main className="ame-vs-bre-main scrollbar-hide">
        <div className="ame-vs-bre-inner">
          <div className="ame-vs-bre-title">
            <h1 className="ame-vs-bre-title-text">AmE VS BrE</h1>
            <div className="ame-vs-bre-title-underline" />
          </div>

          <div className="rounded-3xl border border-white/10 bg-black/60 p-6 shadow-[0_25px_80px_rgba(37,99,235,0.16)] backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-white mb-3">Catatan UK untuk phonetic portal</h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Halaman ini mengumpulkan catatan per simbol fonetik yang membandingkan pelafalan British (BrE) dan American (AmE). Gunakan sebagai referensi ketika kamu ingin mengetahui perbedaan uk vs us untuk pola bunyi tertentu.
            </p>
          </div>

          <div className="mt-6 ame-vs-bre-tabbar">
            {availableNotes.map((note) => (
              <button
                key={note.id}
                type="button"
                onClick={() => setActiveNoteId(note.id)}
                className={`ame-vs-bre-tabbutton ${activeNote?.id === note.id ? 'active' : ''}`}
              >
                {note.title}
              </button>
            ))}
          </div>

          <div className="ame-vs-bre-note-panel">
            <div className="mb-4">
              <div className="ame-vs-bre-badge">
                {activeNote?.id || 'note'}
              </div>
            </div>
            {activeNote ? (
              <>
                <h3 className="text-2xl font-semibold text-white mb-2">{activeNote.title}</h3>
                <div className="mb-6 text-slate-300 text-sm leading-relaxed">{activeNote.description}</div>
                <div className="ame-vs-bre-card-grid">
                            {activeNote.items.map((item, index) => {
                    const isActiveCard = activeWord === item.word;
                    return (
                      <article
                        key={`${activeNote.id}-${item.word}`}
                        ref={(element) => { wordCardRefs.current[index] = element; }}
                        className={`ame-vs-bre-word-card ${isActiveCard ? 'active-card' : ''}`}
                      >
                        <div className="ame-vs-bre-word-card-top">
                                    <h4 className="ame-vs-bre-word-title">
                                      {renderWord(item.word, showHighlight, pageSymbolForHighlight, highlightLetterStyle)}
                          </h4>
                        </div>
                        <div className="ame-vs-bre-word-divider" />
                        <div className="ame-vs-bre-pronunciation-group">
                          <div className="ame-vs-bre-ipa-block">
                            <div className="ame-vs-bre-ipa-box-flex">
                              <div className="ame-vs-bre-ipa-text-wrapper">
                                <p className="ame-vs-bre-ipa-label">AmE</p>
                                <p className="ame-vs-bre-ipa-value">
                                  {showIpa
                                    ? renderIpa(item.americanIpa, showHighlight, [pageSymbolForHighlight], pageSymbolForHighlight, highlightLetterStyle)
                                    : '•••'}
                                </p>
                              </div>
                              <button
                                type="button"
                                className="ame-vs-bre-ipa-play-button"
                                onClick={() => playSinglePronunciation(item.word, 'en-US')}
                                aria-label={`Play American pronunciation for ${item.word}`}
                              >
                                <Volume2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div className="ame-vs-bre-ipa-block">
                            <div className="ame-vs-bre-ipa-box-flex">
                              <div className="ame-vs-bre-ipa-text-wrapper">
                                <p className="ame-vs-bre-ipa-label">BrE</p>
                                <p className="ame-vs-bre-ipa-value">
                                  {showIpa
                                    ? renderIpa(item.britishIpa, showHighlight, [pageSymbolForHighlight], pageSymbolForHighlight, highlightLetterStyle)
                                    : '•••'}
                                </p>
                              </div>
                              <button
                                type="button"
                                className="ame-vs-bre-ipa-play-button"
                                onClick={() => playSinglePronunciation(item.word, 'en-GB')}
                                aria-label={`Play British pronunciation for ${item.word}`}
                              >
                                <Volume2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </>
            ) : (
              <p className="text-sm text-slate-400">Catatan UK belum tersedia untuk simbol ini.</p>
            )}
          </div>
        </div>
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
              label="Common Letters"
              className="w-full flex justify-between text-[10px] sm:text-xs"
              activeClass="text-orange-200"
              activeTrackClass="bg-orange-400 shadow-[0_0_12px_rgba(251,146,60,0.62)]"
              activeDotClass="bg-orange-300 shadow-[0_0_6px_rgba(253,186,116,0.95)]"
            />
          </div>
        }
        bottomControls={
          <div className="flex flex-col gap-3">
            <div>
              <PlayStopButton
                isActive={isPlayingExamples}
                label="WORD EXAMPLES"
                onClick={playExampleWords}
                disabled={!activeNote || activeNote.items.length === 0}
                size="sm"
              />
            </div>
          </div>
        }
      />
    </div>
  );
};

export default AMeVsBrEPage;
