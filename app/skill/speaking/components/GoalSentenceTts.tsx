'use client';

import { useEffect, useRef, useState } from 'react';

type GoalSentenceTtsProps = {
  sentences: string[];
  translations?: string[];
  showTranslations?: boolean;
  ipaLines?: string[];
  showIpa?: boolean;
};

type PlayMode = 'single' | 'all';

const SPELLING_PATTERN = /\b([A-Za-z](?:\s*-\s*[A-Za-z]){1,})\b/g;

function getPreferredEnglishVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  return (
    voices.find((voice) => voice.name === 'Google US English') ||
    voices.find((voice) => voice.lang === 'en-US' && voice.name.includes('Google')) ||
    voices.find((voice) => voice.lang === 'en-US' && voice.name.includes('Samantha')) ||
    voices.find((voice) => voice.lang === 'en-US' && voice.name.includes('Zira')) ||
    voices.find((voice) => voice.lang === 'en-US') ||
    voices.find((voice) => voice.lang.toLowerCase().startsWith('en')) ||
    null
  );
}

function normalizeSpellingForTts(text: string): string {
  return text.replace(SPELLING_PATTERN, (match) => {
    const letters = match
      .split('-')
      .map((part) => part.trim())
      .filter(Boolean);
    if (letters.length < 2) return match;
    return letters.join(', ');
  });
}

function createUtterance(text: string) {
  const utterance = new SpeechSynthesisUtterance(normalizeSpellingForTts(text));
  utterance.lang = 'en-US';
  utterance.rate = 0.86;
  utterance.pitch = 1;
  utterance.volume = 1;

  const voice = getPreferredEnglishVoice();
  if (voice) {
    utterance.voice = voice;
    utterance.lang = voice.lang;
  }

  return utterance;
}

export default function GoalSentenceTts({
  sentences,
  translations,
  showTranslations = false,
  ipaLines,
  showIpa = false,
}: GoalSentenceTtsProps) {
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const [canSpeak, setCanSpeak] = useState(false);
  const playTokenRef = useRef(0);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const supportCheckTimerRef = useRef<number | null>(null);
  const isSpeaking = speakingIndex !== null;

  function stopAll() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    playTokenRef.current += 1;
    window.speechSynthesis.cancel();
    setSpeakingIndex(null);
  }

  function playAt(index: number, mode: PlayMode, token: number) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const synth = window.speechSynthesis;
    const sentence = sentences[index];
    if (!sentence) return;

    const utterance = createUtterance(sentence);
    utterance.onstart = () => {
      if (playTokenRef.current !== token) return;
      setSpeakingIndex(index);
    };
    utterance.onend = () => {
      if (playTokenRef.current !== token) return;
      if (mode === 'all' && index < sentences.length - 1) {
        playAt(index + 1, mode, token);
        return;
      }
      setSpeakingIndex(null);
    };
    utterance.onerror = () => {
      if (playTokenRef.current !== token) return;
      setSpeakingIndex(null);
    };

    synth.speak(utterance);
  }

  function playSingle(index: number) {
    if (!canSpeak || typeof window === 'undefined') return;
    const token = playTokenRef.current + 1;
    playTokenRef.current = token;
    window.speechSynthesis.cancel();
    playAt(index, 'single', token);
  }

  function playAll() {
    if (!canSpeak || typeof window === 'undefined') return;
    const token = playTokenRef.current + 1;
    playTokenRef.current = token;
    window.speechSynthesis.cancel();
    playAt(0, 'all', token);
  }

  useEffect(() => {
    if (typeof window === 'undefined') return;

    supportCheckTimerRef.current = window.setTimeout(() => {
      setCanSpeak('speechSynthesis' in window);
      supportCheckTimerRef.current = null;
    }, 0);

    return () => {
      if (supportCheckTimerRef.current) {
        window.clearTimeout(supportCheckTimerRef.current);
        supportCheckTimerRef.current = null;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (speakingIndex === null) return;
    const target = itemRefs.current[speakingIndex];
    if (!target) return;

    const rafId = window.requestAnimationFrame(() => {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    });

    return () => window.cancelAnimationFrame(rafId);
  }, [speakingIndex]);

  if (!canSpeak) {
    return <p className="spk-detail-tts-note">TTS tidak tersedia di browser ini.</p>;
  }

  return (
    <div className="spk-detail-tts-wrap">
      <div className="spk-detail-tts-head spk-detail-tts-head--right">
        <button
          type="button"
          className="spk-detail-tts-btn"
          onClick={isSpeaking ? stopAll : playAll}
          aria-label={isSpeaking ? 'Stop key sentences' : 'Play all key sentences'}
          title={isSpeaking ? 'Stop' : 'Play all'}
        >
          {isSpeaking ? 'Stop' : 'Play All'}
        </button>
      </div>
      <ul className="spk-detail-sentence-list">
        {sentences.map((sentence, index) => (
          <li
            key={`${sentence}-${index}`}
            ref={(element) => {
              itemRefs.current[index] = element;
            }}
            className={`spk-detail-sentence-item ${speakingIndex === index ? 'is-speaking' : ''}`}
          >
            <span className="spk-detail-sentence-text">
              <span>{sentence}</span>
              {showIpa && ipaLines?.[index] ? (
                <span className="spk-ipa-text spk-ipa-text-detail">{ipaLines[index]}</span>
              ) : null}
              {showTranslations && translations?.[index] ? (
                <span className="spk-translation-text spk-translation-text-detail">
                  {translations[index]}
                </span>
              ) : null}
            </span>
            <button
              type="button"
              className="spk-detail-sentence-play spk-tts-chip"
              onClick={() => playSingle(index)}
              aria-label={`Play sentence ${index + 1}`}
              title="Play"
            >
              {'\u25B6'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

