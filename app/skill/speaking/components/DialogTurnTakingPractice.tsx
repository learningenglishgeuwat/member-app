'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  createDialogUtterance,
  isSpeechSynthesisSupported,
  parseDialogLine,
  stopSpeechSynthesisPlayback,
  type DialogSpeaker,
} from './dialog-tts-utils';

type DialogTurnTakingPracticeProps = {
  title: string;
  mission: string;
  lines: string[];
  translations?: string[];
  showTranslations?: boolean;
  ipaLines?: string[];
  showIpa?: boolean;
};

type PracticeStatus =
  | 'idle'
  | 'partner-speaking'
  | 'your-turn'
  | 'completed'
  | 'tts-unavailable';

const YOU_TURN_DURATION_MS = 4000;
const PARTNER_FALLBACK_DELAY_MS = 450;

function getYouTurnDurationMs(): number {
  return YOU_TURN_DURATION_MS;
}

function normalizeSpeakerForPlayback(speaker: DialogSpeaker): DialogSpeaker {
  if (speaker === 'you') return 'you';
  return 'partner';
}

export default function DialogTurnTakingPractice({
  title,
  mission,
  lines,
  translations,
  showTranslations = false,
  ipaLines,
  showIpa = false,
}: DialogTurnTakingPracticeProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [turnIndex, setTurnIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [countdownMs, setCountdownMs] = useState(0);
  const [status, setStatus] = useState<PracticeStatus>('idle');

  const runTokenRef = useRef(0);
  const timeoutRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const countdownEndAtRef = useRef<number | null>(null);
  const canSpeak = useMemo(() => isSpeechSynthesisSupported(), []);

  const parsedLines = useMemo(() => lines.map(parseDialogLine), [lines]);
  const maxTurnIndex = parsedLines.length > 0 ? parsedLines.length - 1 : 0;
  const displayIndex = activeIndex ?? Math.min(turnIndex, maxTurnIndex);
  const displayLine = parsedLines[displayIndex] ?? null;

  const clearTimers = useCallback(() => {
    if (typeof window === 'undefined') return;

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    countdownEndAtRef.current = null;
  }, []);

  const stopRuntime = useCallback(() => {
    runTokenRef.current += 1;
    clearTimers();
    stopSpeechSynthesisPlayback();
  }, [clearTimers]);

  const stopPractice = () => {
    stopRuntime();
    setIsRunning(false);
    setStatus('idle');
    setCountdownMs(0);
    setActiveIndex(null);
  };

  const startPractice = () => {
    if (!parsedLines.length || typeof window === 'undefined') return;

    stopRuntime();

    const token = runTokenRef.current + 1;
    runTokenRef.current = token;

    setIsRunning(true);
    setStatus('idle');
    setCountdownMs(0);

    const runTurn = (index: number) => {
      if (runTokenRef.current !== token) return;

      if (index >= parsedLines.length) {
        clearTimers();
        setIsRunning(false);
        setStatus('completed');
        setCountdownMs(0);
        setActiveIndex(null);
        setTurnIndex(Math.max(0, parsedLines.length - 1));
        return;
      }

      const line = parsedLines[index];
      const content = line.content || line.raw.trim();

      if (!content) {
        runTurn(index + 1);
        return;
      }

      setActiveIndex(index);
      setTurnIndex(index);

      if (line.speaker === 'you') {
        const durationMs = getYouTurnDurationMs();
        const countdownEndAt = Date.now() + durationMs;

        clearTimers();
        setStatus('your-turn');
        setCountdownMs(durationMs);
        countdownEndAtRef.current = countdownEndAt;

        intervalRef.current = window.setInterval(() => {
          if (runTokenRef.current !== token) return;
          const remainingMs = Math.max(0, countdownEndAt - Date.now());
          setCountdownMs(remainingMs);
          if (remainingMs <= 0) {
            if (intervalRef.current !== null) {
              window.clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
          }
        }, 200);

        timeoutRef.current = window.setTimeout(() => {
          if (runTokenRef.current !== token) return;
          clearTimers();
          runTurn(index + 1);
        }, durationMs);
        return;
      }

      if (!canSpeak) {
        clearTimers();
        setStatus('tts-unavailable');
        timeoutRef.current = window.setTimeout(() => {
          if (runTokenRef.current !== token) return;
          runTurn(index + 1);
        }, PARTNER_FALLBACK_DELAY_MS);
        return;
      }

      clearTimers();
      setStatus('partner-speaking');
      const utterance = createDialogUtterance(content, normalizeSpeakerForPlayback(line.speaker));

      utterance.onend = () => {
        if (runTokenRef.current !== token) return;
        runTurn(index + 1);
      };

      utterance.onerror = () => {
        if (runTokenRef.current !== token) return;
        runTurn(index + 1);
      };

      window.speechSynthesis.speak(utterance);
    };

    runTurn(Math.min(turnIndex, maxTurnIndex));
  };

  useEffect(() => {
    return () => {
      stopRuntime();
    };
  }, [stopRuntime]);

  const statusLabel =
    status === 'partner-speaking'
      ? 'Partner Speaking...'
      : status === 'your-turn'
        ? `Your Turn (auto lanjut ${Math.max(1, Math.ceil(countdownMs / 1000))} dtk)`
        : status === 'completed'
          ? 'Completed'
          : status === 'tts-unavailable'
            ? 'Partner TTS tidak tersedia, lanjut otomatis.'
            : 'Siap latihan';

  return (
    <div className="spk-turn-practice-wrap">
      <div className="spk-turn-practice-head">
        <h4>{title}</h4>
        <p>{mission}</p>
      </div>

      <div className="spk-turn-practice-controls">
        <button
          type="button"
          className="spk-detail-tts-btn"
          onClick={() => setTurnIndex((prev) => Math.max(0, prev - 1))}
          disabled={isRunning || displayIndex <= 0}
        >
          Prev Turn
        </button>
        <span className="spk-turn-practice-status">
          Turn {displayIndex + 1}/{Math.max(1, parsedLines.length)}
        </span>
        <button
          type="button"
          className="spk-detail-tts-btn"
          onClick={() => setTurnIndex((prev) => Math.min(maxTurnIndex, prev + 1))}
          disabled={isRunning || displayIndex >= maxTurnIndex}
        >
          Next Turn
        </button>
        <button
          type="button"
          className="spk-detail-tts-btn"
          onClick={startPractice}
          disabled={isRunning || parsedLines.length === 0}
        >
          Start Practice
        </button>
        <button
          type="button"
          className="spk-detail-tts-btn spk-detail-tts-stop"
          onClick={stopPractice}
          disabled={!isRunning}
        >
          Stop
        </button>
        <span className="spk-turn-practice-status" aria-live="polite">
          {statusLabel}
        </span>
      </div>

      <ul className="spk-turn-practice-list">
        {displayLine ? (
          <li
            className={`spk-turn-practice-item spk-turn-practice-item--${
              displayLine.speaker === 'you' ? 'you' : 'partner'
            } ${activeIndex === displayIndex ? 'is-active' : ''}`}
          >
            <span className="spk-dialog-tts-text">
              <strong className="spk-dialog-tts-speaker">
                {displayLine.label || 'Partner'}:
              </strong>
              <span className="spk-dialog-tts-line-wrap">
                <span className="spk-dialog-tts-line">
                  {displayLine.content || displayLine.raw.trim()}
                </span>
                {showIpa && ipaLines?.[displayIndex] ? (
                  <span className="spk-ipa-text spk-dialog-ipa-text">{ipaLines[displayIndex]}</span>
                ) : null}
                {showTranslations && translations?.[displayIndex] ? (
                  <span className="spk-translation-text spk-dialog-translation-text">
                    {translations[displayIndex]}
                  </span>
                ) : null}
              </span>
            </span>
            {activeIndex === displayIndex && displayLine.speaker === 'you' && isRunning ? (
              <span className="spk-turn-practice-countdown" aria-live="polite">
                {Math.max(1, Math.ceil(countdownMs / 1000))} dtk
              </span>
            ) : null}
          </li>
        ) : (
          <li className="spk-turn-practice-item spk-turn-practice-item--partner">
            <span className="spk-dialog-tts-line">Practice belum tersedia.</span>
          </li>
        )}
      </ul>
    </div>
  );
}
