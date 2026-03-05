'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  createDialogUtterance,
  isSpeechSynthesisSupported,
  prepareDialogVoices,
  stopSpeechSynthesisPlayback,
} from '../../skill/speaking/components/dialog-tts-utils';
import type { GuideModeResult } from '../types';
import './speaking-practice-overlay.css';

type SpeakingPracticeOverlayProps = {
  activeResult: GuideModeResult;
  onRunCommand: (command: string) => void;
  onClose: () => void;
};

const YOU_TURN_DURATION_MS = 4000;
const PARTNER_FALLBACK_DELAY_MS = 450;

export default function SpeakingPracticeOverlay({
  activeResult,
  onRunCommand,
  onClose,
}: SpeakingPracticeOverlayProps) {
  const meta = activeResult.meta?.speakingPractice;
  const [countdownMs, setCountdownMs] = useState(0);
  const [countdownTotalMs, setCountdownTotalMs] = useState(0);
  const timerRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const speechTokenRef = useRef(0);
  const commandRef = useRef(onRunCommand);

  useEffect(() => {
    commandRef.current = onRunCommand;
  }, [onRunCommand]);

  const sendCommand = useCallback((command: string) => {
    commandRef.current(command);
  }, []);

  const clearRuntime = useCallback(() => {
    if (typeof window === 'undefined') return;

    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    stopSpeechSynthesisPlayback();
  }, []);

  const getYouTurnDurationMs = (): number => {
    return YOU_TURN_DURATION_MS;
  };

  const canSpeak = useMemo(() => isSpeechSynthesisSupported(), []);

  useEffect(() => {
    return () => {
      clearRuntime();
    };
  }, [clearRuntime]);

  useEffect(() => {
    void prepareDialogVoices();
  }, []);

  useEffect(() => {
    clearRuntime();

    if (!meta) return;
    if (meta.state !== 'running' || meta.isCompleted) return;

    if (meta.speaker === 'Partner') {
      if (!canSpeak) {
        timerRef.current = window.setTimeout(() => {
          sendCommand('next');
        }, PARTNER_FALLBACK_DELAY_MS);
        return;
      }

      const token = speechTokenRef.current + 1;
      speechTokenRef.current = token;

      void (async () => {
        await prepareDialogVoices();
        if (speechTokenRef.current !== token) return;

        const utterance = createDialogUtterance(meta.line, 'partner');
        utterance.onend = () => {
          if (speechTokenRef.current !== token) return;
          sendCommand('next');
        };
        utterance.onerror = () => {
          if (speechTokenRef.current !== token) return;
          sendCommand('next');
        };

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      })();
      return;
    }

    const durationMs = getYouTurnDurationMs();
    const endAt = Date.now() + durationMs;

    window.setTimeout(() => {
      setCountdownTotalMs(durationMs);
      setCountdownMs(durationMs);
    }, 0);

    intervalRef.current = window.setInterval(() => {
      const remain = Math.max(0, endAt - Date.now());
      setCountdownMs(remain);
    }, 200);

    timerRef.current = window.setTimeout(() => {
      sendCommand('next');
    }, durationMs);
  }, [meta, canSpeak, clearRuntime, sendCommand]);

  const isYouTurnActive = Boolean(
    meta?.state === 'running' && !meta?.isCompleted && meta?.speaker === 'You',
  );
  const timerProgress =
    !isYouTurnActive
      ? 0
      : countdownTotalMs > 0
      ? Math.max(0, Math.min(1, countdownMs / countdownTotalMs))
      : 1;
  const timerAngle = Math.max(0, Math.min(360, timerProgress * 360));

  const runtimeStatus = !meta
    ? 'Siap latihan'
    : meta.state === 'completed'
      ? 'Completed'
      : meta.state !== 'running'
        ? 'Siap latihan'
        : meta.speaker === 'Partner'
          ? canSpeak
            ? 'Partner Speaking...'
            : 'Partner TTS tidak tersedia, lanjut otomatis.'
          : 'Your Turn';

  const isRunning = Boolean(meta?.state === 'running' && !meta?.isCompleted);

  const phases = meta?.availablePhases ?? [];
  const goals = meta?.availableGoals ?? [];
  const scenarios = meta?.availableScenarios ?? [];
  const selectedPhaseId = meta?.selectedPhaseId ?? phases[0]?.id ?? '';
  const selectedGoalId = meta?.selectedGoalId ?? goals[0]?.id ?? '';
  const selectedScenario = (meta?.selectedScenarioIndex ?? 0) + 1;

  return (
    <div className="tg-spk-layer" role="dialog" aria-label="Speaking Practice Overlay">
      <div className="tg-spk-dim" />

      <section className="tg-spk-coach">
        <div className="tg-spk-shell">
          <div className="tg-spk-avatar-orb">
            <Image
              src="/Kepala1.png"
              alt="GEUWAT Coach"
              width={58}
              height={58}
              className="tg-spk-avatar"
            />
          </div>

          <div className="tg-spk-card">
            <div className="tg-spk-card-head">
              <p className="tg-spk-title">Speaking Practice</p>
              <button
                type="button"
                className="tg-spk-close"
                onClick={onClose}
                aria-label="Tutup speaking practice"
              >
                x
              </button>
            </div>

            {meta ? (
              <>
                <div className={`tg-spk-turn ${meta.speaker === 'Partner' ? 'is-partner' : 'is-you'}`}>
                  <p className="tg-spk-speaker">{meta.speaker}</p>
                  <p className="tg-spk-line">
                    <span className="tg-spk-line-chip">{meta.line}</span>
                  </p>
                  {meta.lineIpa ? <p className="tg-spk-line-ipa">{meta.lineIpa}</p> : null}
                  {meta.lineTranslation ? (
                    <p className="tg-spk-line-translation">{meta.lineTranslation}</p>
                  ) : null}
                </div>
                <p className="tg-spk-status">
                  <span className="tg-spk-status-text">{runtimeStatus}</span>
                  {isYouTurnActive ? (
                    <span
                      className="tg-spk-timer-ring"
                      role="progressbar"
                      aria-label="Auto lanjut berjalan"
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={Math.round(timerProgress * 100)}
                      style={{
                        background: `conic-gradient(rgba(194, 137, 255, 0.95) 0deg ${timerAngle}deg, rgba(194, 137, 255, 0.2) ${timerAngle}deg 360deg)`,
                      }}
                    >
                      <span className="tg-spk-timer-ring-core" />
                    </span>
                  ) : null}
                </p>
              </>
            ) : null}

            <p className="tg-spk-chip">{activeResult.reply}</p>

            <div className="tg-spk-picker-grid">
              <label className="tg-spk-picker-field is-phase">
                <span>Phase</span>
                <select
                  id="tg-spk-phase-select"
                  name="tgSpkPhase"
                  value={selectedPhaseId}
                  onChange={(event) => sendCommand(`set phase ${event.target.value}`)}
                  disabled={isRunning}
                >
                  {phases.map((phase) => (
                    <option key={phase.id} value={phase.id}>
                      {phase.title}
                    </option>
                  ))}
                </select>
              </label>

              <label className="tg-spk-picker-field">
                <span>Goal</span>
                <select
                  id="tg-spk-goal-select"
                  name="tgSpkGoal"
                  value={selectedGoalId}
                  onChange={(event) => sendCommand(`set goal ${event.target.value}`)}
                  disabled={isRunning}
                >
                  {goals.map((goal) => (
                    <option key={goal.id} value={goal.id}>
                      {goal.title}
                    </option>
                  ))}
                </select>
              </label>

              <label className="tg-spk-picker-field">
                <span>Scenario</span>
                <select
                  id="tg-spk-scenario-select"
                  name="tgSpkScenario"
                  value={selectedScenario}
                  onChange={(event) => sendCommand(`set scenario ${event.target.value}`)}
                  disabled={isRunning}
                >
                  {scenarios.map((scenario) => (
                    <option key={`${scenario.index}-${scenario.title}`} value={scenario.index + 1}>
                      {scenario.title}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {meta ? (
              <>
                <div className="tg-spk-actions">
                  <button
                    type="button"
                    className="tg-spk-action-btn"
                    onClick={() => sendCommand('start')}
                    disabled={isRunning}
                  >
                    Start
                  </button>
                  <button
                    type="button"
                    className="tg-spk-action-btn tg-spk-action-btn--stop"
                    onClick={() => sendCommand('stop')}
                    disabled={!isRunning}
                  >
                    Stop
                  </button>
                  <button
                    type="button"
                    className="tg-spk-action-btn"
                    onClick={() => sendCommand('ulang')}
                    disabled={!meta}
                  >
                    Ulang Turn
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  );
}
