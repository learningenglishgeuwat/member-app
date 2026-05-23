'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ReactNode } from 'react';
import BackButton from '../../../components/BackButton';
import { ControlCenter } from '@/app/components';
import { TONGUE_TWISTERS } from './data/tongueTwisters';
import { createUtterance, isSpeechSynthesisSupported, stopSpeech, waitForVoices } from '@/lib/tts/speech';
import { Highlight } from '../../reading-text/tongueTwister/components/Highlight';
import './tongue-twister.css';

export default function TongueTwisterPage() {
  const [selectedFocus, setSelectedFocus] = useState<string>('all');
  const [selectedId, setSelectedId] = useState<string>(TONGUE_TWISTERS[0].id);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [focusDropdownOpen, setFocusDropdownOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const focusDropdownRef = useRef<HTMLDivElement | null>(null);
  const speakSessionRef = useRef(0);
  const lockedPeterVoiceRef = useRef<SpeechSynthesisVoice | null>(null);

  const focusOptions = useMemo(() => {
    const unique = new Set<string>(TONGUE_TWISTERS.map((item) => item.focus).filter(Boolean));
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, []);

  const filteredTwisters = useMemo(() => {
    if (selectedFocus === 'all') return TONGUE_TWISTERS;
    return TONGUE_TWISTERS.filter((item) => item.focus === selectedFocus);
  }, [selectedFocus]);

  useEffect(() => {
    if (filteredTwisters.some((item) => item.id === selectedId)) return;
    const next = filteredTwisters[0]?.id ?? TONGUE_TWISTERS[0]?.id;
    if (next) {
      handleStopSpeak();
      setSelectedId(next);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredTwisters, selectedId]);

  const activeTwister = useMemo(
    () => filteredTwisters.find((item) => item.id === selectedId) ?? filteredTwisters[0] ?? TONGUE_TWISTERS[0],
    [filteredTwisters, selectedId],
  );

  const twisterLines = useMemo(
    () =>
      activeTwister.text
        .split(/(?<=[.!?])\s+/)
        .map((line) => line.trim())
        .filter(Boolean),
    [activeTwister.text],
  );
  const peterPiperText = useMemo(
    () => TONGUE_TWISTERS.find((item) => item.id === 'peter-piper')?.text ?? activeTwister.text,
    [activeTwister.text],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const outsideTwister = dropdownRef.current ? !dropdownRef.current.contains(target) : true;
      const outsideFocus = focusDropdownRef.current ? !focusDropdownRef.current.contains(target) : true;
      if (outsideTwister) {
        setDropdownOpen(false);
      }
      if (outsideFocus) {
        setFocusDropdownOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
        setFocusDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    void waitForVoices();
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      stopSpeech();
    };
  }, []);

  const handleSpeakTwister = useCallback(() => {
    if (!isSpeechSynthesisSupported()) return;
    speakSessionRef.current += 1;
    const sessionId = speakSessionRef.current;
    stopSpeech();
    setIsSpeaking(true);

    void (async () => {
      await waitForVoices();
      if (sessionId !== speakSessionRef.current) return;

      if (!lockedPeterVoiceRef.current) {
        const peterProbe = createUtterance(peterPiperText, {
          lang: 'en-US',
          rate: 0.82,
          pitch: 1,
          volume: 1,
          cancelBeforeSpeak: false,
        });
        if (peterProbe?.voice) {
          lockedPeterVoiceRef.current = peterProbe.voice;
        }
      }

      const utterance = createUtterance(activeTwister.text, {
        lang: 'en-US',
        rate: 0.82,
        pitch: 1,
        volume: 1,
        cancelBeforeSpeak: false,
      });
      if (!utterance) {
        if (sessionId === speakSessionRef.current) setIsSpeaking(false);
        return;
      }

      if (lockedPeterVoiceRef.current) {
        utterance.voice = lockedPeterVoiceRef.current;
        utterance.lang = lockedPeterVoiceRef.current.lang;
      }

      utterance.onstart = () => {
        if (sessionId !== speakSessionRef.current) return;
        setIsSpeaking(true);
      };
      utterance.onend = () => {
        if (sessionId !== speakSessionRef.current) return;
        setIsSpeaking(false);
      };
      utterance.onerror = () => {
        if (sessionId !== speakSessionRef.current) return;
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
    })();
  }, [activeTwister.text, peterPiperText]);

  const handleStopSpeak = useCallback(() => {
    speakSessionRef.current += 1;
    stopSpeech();
    setIsSpeaking(false);
  }, []);

  const handleSelectTwister = useCallback(
    (nextId: string) => {
      if (nextId !== selectedId) {
        handleStopSpeak();
        setSelectedId(nextId);
      }
      setDropdownOpen(false);
    },
    [handleStopSpeak, selectedId],
  );

  const handleSelectFocus = useCallback(
    (nextFocus: string) => {
      if (nextFocus !== selectedFocus) {
        handleStopSpeak();
        setSelectedFocus(nextFocus);
      }
      setFocusDropdownOpen(false);
    },
    [handleStopSpeak, selectedFocus],
  );

  // Extract IPA symbols from focus string for highlighting
  const focusIPASymbols = useMemo(() => {
    if (!activeTwister.focus) return [];
    const matches = activeTwister.focus.match(/\/[^\/]+\//g);
    return matches || [];
  }, [activeTwister.focus]);

  // Helper function to highlight IPA symbols
  const highlightIPA = useCallback((ipaLine: string): ReactNode => {
    if (focusIPASymbols.length === 0) {
      return ipaLine;
    }

    const ipaChars = focusIPASymbols.map(s => s.replace(/\//g, ''));
    const ipaRegex = new RegExp(`(${ipaChars.join('|')})`, 'g');

    const ipaParts: ReactNode[] = [];
    const ipaSegments = ipaLine.split(ipaRegex);

    ipaSegments.forEach((segment, i) => {
      if (!segment) return;

      const isMatch = ipaChars.some(char => segment === char);

      if (isMatch) {
        ipaParts.push(<Highlight key={`ipa-${i}`}>{segment}</Highlight>);
      } else {
        ipaParts.push(segment);
      }
    });

    return <>{ipaParts}</>;
  }, [focusIPASymbols]);

  return (
    <main className="tt-page">
      <div className="tt-back">
        <BackButton to="/skill/pronunciation/phoneticSymbols" />
      </div>

      <section className="tt-shell">
        <header className="tt-header">
          <h1 className="tt-title">TONGUE TWISTER</h1>
          <p className="tt-subtitle">Pilih salah satu latihan, lalu baca dengan jelas dan bertahap.</p>
          <p className="tt-explain">
            Tongue twister adalah rangkaian kalimat dengan bunyi yang mirip untuk melatih kejelasan artikulasi,
            kontrol lidah, dan konsistensi pelafalan.
          </p>
        </header>

        <label className="tt-label" htmlFor="tt-focus-select">
          Focus Sound
        </label>
        <div className="tt-dropdown" ref={focusDropdownRef}>
          <button
            id="tt-focus-select"
            type="button"
            className="tt-select"
            aria-haspopup="listbox"
            aria-expanded={focusDropdownOpen}
            onClick={() => {
              setFocusDropdownOpen((prev) => !prev);
              setDropdownOpen(false);
            }}
          >
            <span className="tt-select-text">
              {selectedFocus === 'all' ? 'All Focus Sounds' : selectedFocus}
            </span>
            <span className={`tt-caret ${focusDropdownOpen ? 'is-open' : ''}`} aria-hidden="true" />
          </button>

          {focusDropdownOpen ? (
            <ul className="tt-dropdown-list" role="listbox" aria-labelledby="tt-focus-select">
              <li role="option" aria-selected={selectedFocus === 'all'}>
                <button
                  type="button"
                  className={`tt-dropdown-item ${selectedFocus === 'all' ? 'is-active' : ''}`}
                  onClick={() => handleSelectFocus('all')}
                >
                  All Focus Sounds
                </button>
              </li>
              {focusOptions.map((focus) => (
                <li key={focus} role="option" aria-selected={focus === selectedFocus}>
                  <button
                    type="button"
                    className={`tt-dropdown-item ${focus === selectedFocus ? 'is-active' : ''}`}
                    onClick={() => handleSelectFocus(focus)}
                  >
                    {focus}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <label className="tt-label" htmlFor="tt-select">
          Pilih Tongue Twister
        </label>
        <div className="tt-dropdown" ref={dropdownRef}>
          <button
            id="tt-select"
            type="button"
            className="tt-select"
            aria-haspopup="listbox"
            aria-expanded={dropdownOpen}
            onClick={() => setDropdownOpen((prev) => !prev)}
          >
            <span className="tt-select-text">{activeTwister.label}</span>
            <span className={`tt-caret ${dropdownOpen ? 'is-open' : ''}`} aria-hidden="true" />
          </button>

          {dropdownOpen ? (
            <ul className="tt-dropdown-list" role="listbox" aria-labelledby="tt-select">
              {filteredTwisters.map((item) => (
                <li key={item.id} role="option" aria-selected={item.id === selectedId}>
                  <button
                    type="button"
                    className={`tt-dropdown-item ${item.id === selectedId ? 'is-active' : ''}`}
                    onClick={() => handleSelectTwister(item.id)}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <article className="tt-card">
          <h2 className="tt-card-title">{activeTwister.label}</h2>
          <div className="tt-meta">
            <span className="tt-pill">Level: {activeTwister.level}</span>
            <span className="tt-pill">Focus: {activeTwister.focus}</span>
          </div>
          
          <div className="tt-card-text">
            {twisterLines.map((line, index) => (
              <p key={`${activeTwister.id}-${index}`} className="tt-line">
                {line}
              </p>
            ))}
          </div>
          {activeTwister.ipaLines && activeTwister.ipaLines.length > 0 ? (
            <div className="tt-ipa-box">
              <p className="tt-ipa-label">IPA</p>
              <ul className="tt-ipa-list">
                {activeTwister.ipaLines.map((line, index) => (
                  <li
                    key={`${activeTwister.id}-ipa-${index}`}
                    className="tt-ipa-item font-ipa"
                    data-ipa
                  >
                    {highlightIPA(line)}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="tt-ipa-box">
              <p className="tt-ipa-label">IPA</p>
              <p className="tt-ipa-text font-ipa" data-ipa>
                IPA per kalimat belum tersedia untuk item ini.
              </p>
            </div>
          )}
        </article>

        <article className="tt-card">
          <h2 className="tt-card-title">Practice Steps</h2>
          <ul className="tt-list">
            <li>- Baca perlahan 3 kali.</li>
            <li>- Tingkatkan kecepatan, tetap jaga pelafalan jelas.</li>
            <li>- Rekam suara kamu lalu bandingkan.</li>
            <li>- Ulangi setiap hari selama 3-5 menit.</li>
          </ul>
        </article>

        <article className="tt-card">
          <h2 className="tt-card-title">Tips</h2>
          <ul className="tt-list">
            <li>- Jangan cepat dulu, utamakan akurasi bunyi.</li>
            <li>- Fokus di bunyi target sesuai label Focus.</li>
            <li>- Jika mulai salah, ulang dari awal kalimat.</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
