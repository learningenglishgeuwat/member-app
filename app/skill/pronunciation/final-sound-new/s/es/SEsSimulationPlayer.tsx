'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { primeBestEnglishVoice, speakWithBestEnglishVoice } from '../../tts-utils';
import {
  MICRO_STEP_DURATION_MS,
  S_ES_APPLICATION_SCENES,
  TOTAL_STEPS_PER_SCENE,
} from './s-es-simulation-data';

type SEsSimulationPlayerProps = {
  variant: 'embedded' | 'fullscreen';
  autoStart?: boolean;
};

const LAST_STEP_INDEX = TOTAL_STEPS_PER_SCENE - 1;

function renderHighlightedSuffix(text: string, suffix: string, enabled: boolean) {
  if (!enabled || !suffix || !text.includes(suffix)) return text;

  const parts = text.split(suffix);
  const prefix = parts.shift() ?? '';
  const rest = parts.join(suffix);

  return (
    <>
      {prefix}
      <span className="s-es-process-highlight">{suffix}</span>
      {rest}
    </>
  );
}

function renderHighlightedTail(ipa: string, tail: string, enabled: boolean) {
  if (!enabled || !tail || !ipa.includes(tail)) return ipa;

  const parts = ipa.split(tail);
  const prefix = parts.shift() ?? '';
  const rest = parts.join(tail);

  return (
    <>
      {prefix}
      <span className="s-es-process-highlight">{tail}</span>
      {rest}
    </>
  );
}

export default function SEsSimulationPlayer({
  variant,
  autoStart = true,
}: SEsSimulationPlayerProps) {
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [processStepIndex, setProcessStepIndex] = useState<0 | 1 | 2 | 3>(0);
  const [isPlayingProcess, setIsPlayingProcess] = useState(autoStart);
  const autoBeforeTtsSceneRef = useRef('');
  const autoAfterTtsSceneRef = useRef('');

  const activeScene = S_ES_APPLICATION_SCENES[activeSceneIndex];
  const isAfterStep = processStepIndex === LAST_STEP_INDEX;
  const showIpaCard = processStepIndex >= 1;
  const showHighlight = processStepIndex >= 2;

  const displayedWord = isAfterStep ? activeScene.afterWord : activeScene.beforeWord;
  const displayedIpa = isAfterStep ? activeScene.afterIpa : activeScene.beforeIpa;
  const displayedWordTail = isAfterStep ? activeScene.highlightWordSuffix : activeScene.beforeWordTail;
  const displayedIpaTail = isAfterStep ? activeScene.highlightIpaTail : activeScene.beforeIpaTail;

  const wordCardStateClass =
    processStepIndex === 0 ? 'is-enter' : isAfterStep ? 'is-swap' : 'is-visible';
  const ipaCardStateClass =
    processStepIndex === 1 ? 'is-enter' : isAfterStep ? 'is-swap' : 'is-visible';

  const processProgress = useMemo(
    () =>
      ((activeSceneIndex * TOTAL_STEPS_PER_SCENE + (processStepIndex + 1)) /
        (S_ES_APPLICATION_SCENES.length * TOTAL_STEPS_PER_SCENE)) *
      100,
    [activeSceneIndex, processStepIndex],
  );

  const handleProcessPlayPause = () => {
    if (isPlayingProcess) {
      setIsPlayingProcess(false);
      return;
    }

    if (
      activeSceneIndex >= S_ES_APPLICATION_SCENES.length - 1 &&
      processStepIndex >= TOTAL_STEPS_PER_SCENE - 1
    ) {
      setActiveSceneIndex(0);
      setProcessStepIndex(0);
    }

    setIsPlayingProcess(true);
  };

  const handleProcessPrev = () => {
    setIsPlayingProcess(false);
    setActiveSceneIndex((prev) => Math.max(0, prev - 1));
    setProcessStepIndex(0);
  };

  const handleProcessNext = () => {
    setIsPlayingProcess(false);
    setActiveSceneIndex((prev) => Math.min(S_ES_APPLICATION_SCENES.length - 1, prev + 1));
    setProcessStepIndex(0);
  };

  const handleProcessReplay = () => {
    autoBeforeTtsSceneRef.current = '';
    autoAfterTtsSceneRef.current = '';
    setActiveSceneIndex(0);
    setProcessStepIndex(0);
    setIsPlayingProcess(true);
  };

  const handleSelectScene = (sceneIndex: number) => {
    setActiveSceneIndex(sceneIndex);
    setProcessStepIndex(0);
    setIsPlayingProcess(false);
  };

  useEffect(() => {
    void primeBestEnglishVoice();
  }, []);

  useEffect(() => {
    if (!isPlayingProcess) {
      autoBeforeTtsSceneRef.current = '';
      autoAfterTtsSceneRef.current = '';
      return;
    }

    if (processStepIndex !== 0) {
      return;
    }

    const sceneKey = `${activeSceneIndex}-${activeScene.beforeWord}`;
    if (autoBeforeTtsSceneRef.current === sceneKey) {
      return;
    }

    autoBeforeTtsSceneRef.current = sceneKey;
    void speakWithBestEnglishVoice(activeScene.beforeWord);
  }, [activeSceneIndex, activeScene.beforeWord, isPlayingProcess, processStepIndex]);

  useEffect(() => {
    if (!isPlayingProcess) {
      return;
    }

    if (processStepIndex !== LAST_STEP_INDEX) {
      return;
    }

    const sceneKey = `${activeSceneIndex}-${activeScene.afterWord}`;
    if (autoAfterTtsSceneRef.current === sceneKey) {
      return;
    }

    autoAfterTtsSceneRef.current = sceneKey;
    void speakWithBestEnglishVoice(activeScene.afterWord);
  }, [activeScene.afterWord, activeSceneIndex, isPlayingProcess, processStepIndex]);

  useEffect(() => {
    if (!isPlayingProcess) {
      return;
    }

    const lastScene = S_ES_APPLICATION_SCENES.length - 1;
    const timerId = window.setTimeout(() => {
      setProcessStepIndex((prevStep) => {
        if (prevStep < LAST_STEP_INDEX) {
          return (prevStep + 1) as 0 | 1 | 2 | 3;
        }

        if (activeSceneIndex >= lastScene) {
          setIsPlayingProcess(false);
          return prevStep;
        }

        setActiveSceneIndex((prevScene) => Math.min(prevScene + 1, lastScene));
        return 0;
      });
    }, MICRO_STEP_DURATION_MS);

    return () => window.clearTimeout(timerId);
  }, [isPlayingProcess, activeSceneIndex, processStepIndex]);

  return (
    <div className={`s-es-process-player s-es-process-player--${variant}`}>
      <div className="s-es-process-header">
        <h3>{activeScene.title}</h3>
        <span>
          Scene {activeSceneIndex + 1} / {S_ES_APPLICATION_SCENES.length}
        </span>
      </div>

      <div className="s-es-process-screen">
        <div className="s-es-process-preview-stack">
          <article className="s-es-process-focus-card">
            <p className="s-es-process-card-label">Current Output Sound</p>
            <strong>{activeScene.resultSound}</strong>
          </article>

          <article className={`s-es-process-word-card ${wordCardStateClass}`}>
            <div className="s-es-process-card-head">
              <p className="s-es-process-card-label">Word Card</p>
              <button
                type="button"
                className="fs-topic-mini-btn"
                aria-label={`Putar word ${displayedWord}`}
                onClick={() => void speakWithBestEnglishVoice(displayedWord)}
              >
                Putar
              </button>
            </div>
            <p className="s-es-process-card-value">
              {renderHighlightedSuffix(displayedWord, displayedWordTail, showHighlight)}
            </p>
          </article>

          {showIpaCard ? (
            <article className={`s-es-process-ipa-card ${ipaCardStateClass}`}>
              <p className="s-es-process-card-label">IPA Card</p>
              <p className="s-es-process-card-value">
                {renderHighlightedTail(displayedIpa, displayedIpaTail, showHighlight)}
              </p>
            </article>
          ) : null}

          <article className="s-es-process-rule-card">
            <p className="s-es-process-description">{activeScene.description}</p>
            <p className="s-es-process-code-line is-active">{activeScene.codeLine}</p>
            <p className="s-es-process-rule-note">{activeScene.ruleHint}</p>
          </article>
        </div>
      </div>

      <div
        className="s-es-process-progress"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(processProgress)}
      >
        <div className="s-es-process-progress-fill" style={{ width: `${processProgress}%` }} />
      </div>

      <div className="s-es-process-controls">
        <button
          type="button"
          className="s-es-process-btn"
          onClick={handleProcessPrev}
          disabled={activeSceneIndex === 0}
          aria-label="Previous scene"
        >
          Prev
        </button>

        <button
          type="button"
          className="s-es-process-btn s-es-process-btn-primary"
          onClick={handleProcessPlayPause}
          aria-label={isPlayingProcess ? 'Pause scene playback' : 'Play scene playback'}
        >
          {isPlayingProcess ? 'Pause' : 'Play'}
        </button>

        <button
          type="button"
          className="s-es-process-btn"
          onClick={handleProcessNext}
          disabled={activeSceneIndex === S_ES_APPLICATION_SCENES.length - 1}
          aria-label="Next scene"
        >
          Next
        </button>

        <button
          type="button"
          className="s-es-process-btn"
          onClick={handleProcessReplay}
          aria-label="Replay from first scene"
        >
          Replay
        </button>
      </div>

      <div className="s-es-process-scene-cards">
        {S_ES_APPLICATION_SCENES.map((scene, index) => (
          <button
            key={scene.id}
            type="button"
            className={`s-es-process-scene-card ${index === activeSceneIndex ? 'is-active' : ''}`}
            onClick={() => handleSelectScene(index)}
            aria-label={`Go to scene ${index + 1}: ${scene.title}`}
          >
            <span className="s-es-process-scene-index">Scene {index + 1}</span>
            <strong className="s-es-process-scene-title">{scene.title}</strong>
            <span className="s-es-process-scene-sound">{scene.resultSound}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
