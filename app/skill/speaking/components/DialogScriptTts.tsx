'use client';

import { Play } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  createDialogUtterance,
  isSpeechSynthesisSupported,
  parseDialogLine,
  stopSpeechSynthesisPlayback,
} from './dialog-tts-utils';

type DialogScriptTtsProps = {
  lines: string[];
  translations?: string[];
  showTranslations?: boolean;
  ipaLines?: string[];
  showIpa?: boolean;
};

type PlayMode = 'single' | 'scenario';

const SCENARIO_LINE_GAP_MS = 500;

export default function DialogScriptTts({
  lines,
  translations,
  showTranslations = false,
  ipaLines,
  showIpa = false,
}: DialogScriptTtsProps) {
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const [isPlayingScenario, setIsPlayingScenario] = useState(false);

  const playTokenRef = useRef(0);
  const timeoutRef = useRef<number | null>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);

  const canSpeak = useMemo(() => isSpeechSynthesisSupported(), []);

  const parsedLines = useMemo(() => lines.map(parseDialogLine), [lines]);
  const speakableLines = useMemo(() => parsedLines.map((line) => line.content), [parsedLines]);
  const isAnySpeaking = speakingIndex !== null || isPlayingScenario;

  const clearScenarioTimeout = () => {
    if (typeof window === 'undefined') return;
    if (timeoutRef.current === null) return;
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  };

  const stopAll = () => {
    playTokenRef.current += 1;
    clearScenarioTimeout();
    stopSpeechSynthesisPlayback();
    setSpeakingIndex(null);
    setIsPlayingScenario(false);
  };

  const playAt = (index: number, mode: PlayMode, token: number) => {
    if (!isSpeechSynthesisSupported()) return;

    const line = speakableLines[index];
    if (!line) {
      setSpeakingIndex(null);
      if (mode === 'single') {
        setIsPlayingScenario(false);
      }
      return;
    }

    const utterance = createDialogUtterance(line, parsedLines[index]?.speaker ?? 'unknown');
    utterance.onstart = () => {
      if (playTokenRef.current !== token) return;
      setSpeakingIndex(index);
      setIsPlayingScenario(mode === 'scenario');
    };

    utterance.onend = () => {
      if (playTokenRef.current !== token) return;

      if (mode === 'scenario') {
        let nextIndex = index + 1;
        while (nextIndex < speakableLines.length && !speakableLines[nextIndex]) {
          nextIndex += 1;
        }

        if (nextIndex >= speakableLines.length) {
          setSpeakingIndex(null);
          setIsPlayingScenario(false);
          return;
        }

        clearScenarioTimeout();
        timeoutRef.current = window.setTimeout(() => {
          if (playTokenRef.current !== token) return;
          playAt(nextIndex, mode, token);
        }, SCENARIO_LINE_GAP_MS);
        return;
      }

      setSpeakingIndex(null);
      setIsPlayingScenario(false);
    };

    utterance.onerror = () => {
      if (playTokenRef.current !== token) return;
      setSpeakingIndex(null);
      setIsPlayingScenario(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const playScenario = () => {
    if (!canSpeak || typeof window === 'undefined') return;
    const firstIndex = speakableLines.findIndex((line) => Boolean(line));
    if (firstIndex < 0) return;

    const token = playTokenRef.current + 1;
    playTokenRef.current = token;
    clearScenarioTimeout();
    stopSpeechSynthesisPlayback();
    playAt(firstIndex, 'scenario', token);
  };

  const playSingle = (index: number) => {
    if (!canSpeak || typeof window === 'undefined') return;
    if (!speakableLines[index]) return;

    const token = playTokenRef.current + 1;
    playTokenRef.current = token;
    clearScenarioTimeout();
    stopSpeechSynthesisPlayback();
    playAt(index, 'single', token);
  };

  useEffect(() => {
    return () => {
      playTokenRef.current += 1;
      clearScenarioTimeout();
      stopSpeechSynthesisPlayback();
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

  return (
    <div className="spk-dialog-tts-wrap">
      {canSpeak ? (
        <div className="spk-dialog-tts-head spk-dialog-tts-head--right">
          <span className="spk-turn-practice-status">Turn {Math.max(1, (speakingIndex ?? 0) + 1)}/{Math.max(1, parsedLines.length)}</span>
          <button
            type="button"
            className="spk-detail-tts-btn"
            onClick={isAnySpeaking ? stopAll : playScenario}
            aria-label={isAnySpeaking ? 'Stop dialog speech' : 'Play all dialog lines'}
            title={isAnySpeaking ? 'Stop' : 'Play all'}
          >
            {isAnySpeaking ? 'Stop' : 'Play All'}
          </button>
        </div>
      ) : (
        <p className="spk-detail-tts-note">TTS tidak tersedia di browser ini.</p>
      )}

      <ul className="spk-dialog-tts-list">
        {parsedLines.length > 0 ? (
          parsedLines.map((line, index) => (
            <li
              key={`${line.raw}-${index}`}
              ref={(element) => {
                itemRefs.current[index] = element;
              }}
              className={`spk-dialog-tts-item spk-dialog-tts-item--${line.speaker} ${
                speakingIndex === index ? 'is-speaking' : ''
              }`}
            >
              <span className="spk-dialog-tts-text">
                {line.label ? <strong className="spk-dialog-tts-speaker">{line.label}:</strong> : null}
                <span className="spk-dialog-tts-line-wrap">
                  <span className="spk-dialog-tts-line">{line.content || line.raw.trim()}</span>
                  {showIpa && ipaLines?.[index] ? (
                    <span className="spk-ipa-text spk-dialog-ipa-text">{ipaLines[index]}</span>
                  ) : null}
                  {showTranslations && translations?.[index] ? (
                    <span className="spk-translation-text spk-dialog-translation-text">
                      {translations[index]}
                    </span>
                  ) : null}
                </span>
              </span>
              {canSpeak && line.content ? (
                <button
                  type="button"
                  className="spk-detail-sentence-play spk-tts-chip"
                  onClick={() => playSingle(index)}
                  aria-label={`Play dialog line ${index + 1}`}
                  title={`Play turn ${index + 1}`}
                >
                  <Play size={13} aria-hidden="true" />
                </button>
              ) : null}
            </li>
          ))
        ) : (
          <li className="spk-dialog-tts-item spk-dialog-tts-item--unknown">
            <span className="spk-dialog-tts-line">Dialog belum tersedia.</span>
          </li>
        )}
      </ul>
    </div>
  );
}
