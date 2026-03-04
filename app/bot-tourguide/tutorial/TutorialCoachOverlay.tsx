'use client';

import Image from 'next/image';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  GuideModeResult,
  TutorialAdvanceMode,
  TutorialCoachFallbackPlacement,
  TutorialCoachPlacement,
} from '../types';
import { useTutorialTargetRect } from './useTutorialTargetRect';
import { useTutorialTargetClick } from './useTutorialTargetClick';
import './tutorial-overlay.css';

type TutorialCoachOverlayProps = {
  activeResult: GuideModeResult;
  onRunCommand: (command: string) => void;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

type CoachPosition = {
  top: number;
  left: number;
};

const fallbackAnchor = (
  fallback: TutorialCoachFallbackPlacement,
  viewportWidth: number,
  viewportHeight: number,
  bubbleWidth: number,
  bubbleHeight: number,
): CoachPosition => {
  const edge = 16;
  if (fallback === 'top-left') {
    return { top: edge, left: edge };
  }
  if (fallback === 'top-right') {
    return { top: edge, left: Math.max(edge, viewportWidth - bubbleWidth - edge) };
  }
  if (fallback === 'bottom-left') {
    return { top: Math.max(edge, viewportHeight - bubbleHeight - edge), left: edge };
  }
  if (fallback === 'bottom-right') {
    return {
      top: Math.max(edge, viewportHeight - bubbleHeight - edge),
      left: Math.max(edge, viewportWidth - bubbleWidth - edge),
    };
  }

  return {
    top: Math.max(edge, (viewportHeight - bubbleHeight) / 2),
    left: Math.max(edge, (viewportWidth - bubbleWidth) / 2),
  };
};

const resolvePlacement = (
  preferred: TutorialCoachPlacement,
  hasTarget: boolean,
  targetRectTop: number,
  targetRectLeft: number,
  targetRectWidth: number,
  targetRectHeight: number,
  viewportWidth: number,
  viewportHeight: number,
): TutorialCoachPlacement => {
  if (preferred !== 'auto') return preferred;
  if (!hasTarget) return 'center';

  const spaceTop = targetRectTop;
  const spaceBottom = viewportHeight - (targetRectTop + targetRectHeight);
  const spaceRight = viewportWidth - (targetRectLeft + targetRectWidth);
  const spaceLeft = targetRectLeft;

  if (spaceBottom >= 240) return 'bottom';
  if (spaceTop >= 240) return 'top';
  if (spaceRight >= 320) return 'right';
  if (spaceLeft >= 320) return 'left';
  return 'center';
};

const computeCoachPosition = (options: {
  placement: TutorialCoachPlacement;
  fallbackPlacement: TutorialCoachFallbackPlacement;
  hasTarget: boolean;
  targetRectTop: number;
  targetRectLeft: number;
  targetRectWidth: number;
  targetRectHeight: number;
  viewportWidth: number;
  viewportHeight: number;
  bubbleWidth: number;
  bubbleHeight: number;
}): CoachPosition => {
  const {
    placement,
    fallbackPlacement,
    hasTarget,
    targetRectTop,
    targetRectLeft,
    targetRectWidth,
    targetRectHeight,
    viewportWidth,
    viewportHeight,
    bubbleWidth,
    bubbleHeight,
  } = options;

  const edge = 12;
  if (!hasTarget) {
    return fallbackAnchor(fallbackPlacement, viewportWidth, viewportHeight, bubbleWidth, bubbleHeight);
  }

  const anchorX = targetRectLeft + targetRectWidth / 2;
  const anchorY = targetRectTop + targetRectHeight / 2;

  let top = 0;
  let left = 0;

  switch (placement) {
    case 'top':
      top = targetRectTop - bubbleHeight - 12;
      left = anchorX - bubbleWidth / 2;
      break;
    case 'bottom':
      top = targetRectTop + targetRectHeight + 12;
      left = anchorX - bubbleWidth / 2;
      break;
    case 'left':
      top = anchorY - bubbleHeight / 2;
      left = targetRectLeft - bubbleWidth - 12;
      break;
    case 'right':
      top = anchorY - bubbleHeight / 2;
      left = targetRectLeft + targetRectWidth + 12;
      break;
    case 'center':
    default:
      top = (viewportHeight - bubbleHeight) / 2;
      left = (viewportWidth - bubbleWidth) / 2;
      break;
  }

  return {
    top: clamp(top, edge, Math.max(edge, viewportHeight - bubbleHeight - edge)),
    left: clamp(left, edge, Math.max(edge, viewportWidth - bubbleWidth - edge)),
  };
};

export default function TutorialCoachOverlay({
  activeResult,
  onRunCommand,
}: TutorialCoachOverlayProps) {
  const tutorialMeta = activeResult.meta?.tutorial;
  const hasStep =
    typeof tutorialMeta?.stepIndex === 'number' && typeof tutorialMeta?.stepCount === 'number';
  const isCompleted = Boolean(tutorialMeta?.isCompleted);

  const [viewport, setViewport] = useState({ width: 1280, height: 720 });
  const autoAdvancedReadyStepRef = useRef('');

  useEffect(() => {
    const update = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const highlightPadding = tutorialMeta?.highlightPadding ?? 10;
  const assistKey = `${tutorialMeta?.featureId ?? 'feature'}:${tutorialMeta?.stepIndex ?? -1}:${
    tutorialMeta?.targetSelector ?? 'none'
  }:${tutorialMeta?.autoNavigatePath ?? 'no-route'}`;
  const { rect } = useTutorialTargetRect(
    tutorialMeta?.targetSelector,
    highlightPadding,
    Boolean(hasStep && tutorialMeta?.targetSelector && !isCompleted),
    assistKey,
  );

  const advanceMode: TutorialAdvanceMode =
    tutorialMeta?.advanceMode ?? (tutorialMeta?.targetSelector ? 'on_target_click' : 'manual');
  const isClickToAdvanceMode = hasStep && !isCompleted && advanceMode === 'on_target_click';

  const handleTargetClicked = useCallback(() => {
    onRunCommand('tutorial:target-clicked');
  }, [onRunCommand]);

  const handleTargetMissed = useCallback(() => {
    onRunCommand('tutorial:target-missed');
  }, [onRunCommand]);

  const ignoredClickSelectors = useMemo(
    () => ['.tg-tutorial-coach', '.tg-avatar-button', '.tg-panel', '.tg-sim-shell'],
    [],
  );

  useTutorialTargetClick({
    enabled: Boolean(isClickToAdvanceMode && tutorialMeta?.targetSelector),
    targetSelector: tutorialMeta?.targetSelector,
    targetPadding: highlightPadding,
    ignoreSelectors: ignoredClickSelectors,
    onTargetClicked: handleTargetClicked,
    onTargetMissed: handleTargetMissed,
  });

  useEffect(() => {
    if (!isClickToAdvanceMode || !tutorialMeta?.targetSelector) return;
    if (!tutorialMeta.targetSelector.includes('dashboard-ready-phase-')) return;

    const stepKey = `${tutorialMeta.featureId ?? 'feature'}:${tutorialMeta.stepIndex ?? -1}`;
    if (autoAdvancedReadyStepRef.current === stepKey) return;

    const target = document.querySelector<HTMLElement>(tutorialMeta.targetSelector);
    if (!target) return;
    if (target.dataset.readyActive !== 'true') return;

    autoAdvancedReadyStepRef.current = stepKey;
    const timeoutId = window.setTimeout(() => {
      onRunCommand('tutorial:target-clicked');
    }, 140);

    return () => window.clearTimeout(timeoutId);
  }, [
    isClickToAdvanceMode,
    onRunCommand,
    tutorialMeta?.featureId,
    tutorialMeta?.stepIndex,
    tutorialMeta?.targetSelector,
  ]);

  const bubbleWidth = Math.min(360, Math.max(290, viewport.width - 28));
  const bubbleHeight = viewport.width <= 640 ? 236 : 260;

  const resolvedPlacement = resolvePlacement(
    tutorialMeta?.placement ?? 'auto',
    Boolean(rect),
    rect?.top ?? 0,
    rect?.left ?? 0,
    rect?.width ?? 0,
    rect?.height ?? 0,
    viewport.width,
    viewport.height,
  );

  const coachPosition = computeCoachPosition({
    placement: resolvedPlacement,
    fallbackPlacement: tutorialMeta?.fallbackPlacement ?? 'top-right',
    hasTarget: Boolean(rect),
    targetRectTop: rect?.top ?? 0,
    targetRectLeft: rect?.left ?? 0,
    targetRectWidth: rect?.width ?? 0,
    targetRectHeight: rect?.height ?? 0,
    viewportWidth: viewport.width,
    viewportHeight: viewport.height,
    bubbleWidth,
    bubbleHeight,
  });

  return (
    <div className="tg-tutorial-layer" role="dialog" aria-label="Tutorial Coach Overlay">
      <div className="tg-tutorial-dim" />

      {rect ? (
        <div
          className={`tg-tutorial-highlight ${isClickToAdvanceMode ? 'is-clickable' : ''}`}
          style={{
            top: `${rect.top}px`,
            left: `${rect.left}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
          }}
          aria-hidden="true"
        />
      ) : null}

      <section
        className="tg-tutorial-coach"
        style={{
          width: `${bubbleWidth}px`,
          top: `${coachPosition.top}px`,
          left: `${coachPosition.left}px`,
        }}
      >
        <div className="tg-tutorial-coach-shell">
          <div className="tg-tutorial-coach-avatar-orb">
            <Image
              src="/Kepala1.png"
              alt="Geuwat Coach"
              width={48}
              height={48}
              className="tg-tutorial-coach-avatar"
            />
          </div>
          <div className="tg-tutorial-oval">
            <div className="tg-tutorial-chip-list">
              <div className="tg-tutorial-chip-row">
                <p className="tg-tutorial-chip tg-tutorial-chip--body">
                  {hasStep
                    ? isCompleted
                      ? tutorialMeta?.completionBody ?? activeResult.reply
                      : tutorialMeta?.stepBody ?? activeResult.reply
                    : activeResult.reply}
                </p>
                <button
                  type="button"
                  className="tg-tutorial-close-button"
                  onClick={() => onRunCommand('exit tutorial')}
                  aria-label="Akhiri tutorial"
                >
                  x
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
