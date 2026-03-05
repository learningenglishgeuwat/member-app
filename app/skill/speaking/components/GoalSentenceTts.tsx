'use client';

import { useEffect, useRef, useState } from 'react';
import {
  createUtterance,
  isSpeechSynthesisSupported,
  stopSpeech,
} from '@/lib/tts/speech';

type GoalSentenceTtsProps = {
  sentences: string[];
  translations?: string[];
  showTranslations?: boolean;
  ipaLines?: string[];
  showIpa?: boolean;
};

type PlayMode = 'single' | 'all';

const SPELLING_PATTERN = /\b([A-Za-z](?:\s*-\s*[A-Za-z]){1,})\b/g;

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

function createSentenceUtterance(text: string) {
  return createUtterance(normalizeSpellingForTts(text), {
    preferredEnglish: 'en-US',
    rate: 0.86,
    pitch: 1,
    volume: 1,
    cancelBeforeSpeak: false,
  });
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
    if (!isSpeechSynthesisSupported()) return;
    playTokenRef.current += 1;
    stopSpeech();
    setSpeakingIndex(null);
  }

  function playAt(index: number, mode: PlayMode, token: number) {
    if (!isSpeechSynthesisSupported()) return;
    const synth = window.speechSynthesis;
    const sentence = sentences[index];
    if (!sentence) return;

    const utterance = createSentenceUtterance(sentence);
    if (!utterance) return;
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
    if (!canSpeak) return;
    const token = playTokenRef.current + 1;
    playTokenRef.current = token;
    stopSpeech();
    playAt(index, 'single', token);
  }

  function playAll() {
    if (!canSpeak) return;
    const token = playTokenRef.current + 1;
    playTokenRef.current = token;
    stopSpeech();
    playAt(0, 'all', token);
  }

  useEffect(() => {
    if (typeof window === 'undefined') return;
    supportCheckTimerRef.current = window.setTimeout(() => {
      setCanSpeak(isSpeechSynthesisSupported());
      supportCheckTimerRef.current = null;
    }, 0);

    return () => {
      if (supportCheckTimerRef.current) {
        window.clearTimeout(supportCheckTimerRef.current);
        supportCheckTimerRef.current = null;
      }
      stopSpeech();
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

