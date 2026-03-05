'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import BackButton from '../../../components/BackButton';
import { TONGUE_TWISTERS } from './data/tongueTwisters';
import { createUtterance, isSpeechSynthesisSupported, stopSpeech, waitForVoices } from '@/lib/tts/speech';
import './tongue-twister.css';

export default function TongueTwisterPage() {
  const [selectedId, setSelectedId] = useState<string>(TONGUE_TWISTERS[0].id);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const activeTwister = useMemo(
    () => TONGUE_TWISTERS.find((item) => item.id === selectedId) ?? TONGUE_TWISTERS[0],
    [selectedId],
  );

  const twisterLines = useMemo(
    () =>
      activeTwister.text
        .split(/(?<=[.!?])\s+/)
        .map((line) => line.trim())
        .filter(Boolean),
    [activeTwister.text],
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setDropdownOpen(false);
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

  const handleSpeakTwister = () => {
    if (!isSpeechSynthesisSupported()) return;
    stopSpeech();

    const utterance = createUtterance(activeTwister.text, {
      lang: 'en-US',
      rate: 0.82,
      pitch: 1,
      volume: 1,
      cancelBeforeSpeak: false,
    });
    if (!utterance) return;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const handleStopSpeak = useCallback(() => {
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
              {TONGUE_TWISTERS.map((item) => (
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
          <div className="tt-tts-actions">
            <button
              type="button"
              className="tt-tts-toggle"
              onClick={isSpeaking ? handleStopSpeak : handleSpeakTwister}
              aria-label={isSpeaking ? 'Stop TTS' : 'Play TTS'}
              title={isSpeaking ? 'Stop TTS' : 'Play TTS'}
            >
              <span className="tt-tts-icon" aria-hidden="true">
                {isSpeaking ? '■' : '▶'}
              </span>
            </button>
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
                  <li key={`${activeTwister.id}-ipa-${index}`} className="tt-ipa-item">
                    {line}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="tt-ipa-box">
              <p className="tt-ipa-label">IPA</p>
              <p className="tt-ipa-text">IPA per kalimat belum tersedia untuk item ini.</p>
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
