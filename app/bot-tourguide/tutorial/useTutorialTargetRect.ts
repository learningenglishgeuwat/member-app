'use client';

import { useEffect, useRef, useState } from 'react';

export type TutorialTargetRect = {
  top: number;
  left: number;
  width: number;
  height: number;
  right: number;
  bottom: number;
};

const rectEquals = (a: TutorialTargetRect | null, b: TutorialTargetRect | null): boolean => {
  if (!a && !b) return true;
  if (!a || !b) return false;
  return (
    Math.abs(a.top - b.top) < 0.5 &&
    Math.abs(a.left - b.left) < 0.5 &&
    Math.abs(a.width - b.width) < 0.5 &&
    Math.abs(a.height - b.height) < 0.5
  );
};

const measureTargetRect = (
  selector: string,
  padding: number,
): { rect: TutorialTargetRect | null; found: boolean; target: HTMLElement | null } => {
  const target = document.querySelector<HTMLElement>(selector);
  if (!target) {
    return { rect: null, found: false, target: null };
  }

  const raw = target.getBoundingClientRect();
  const computed = window.getComputedStyle(target);
  const isDisabled = target.matches(':disabled');
  const isVisible =
    computed.display !== 'none' &&
    computed.visibility !== 'hidden' &&
    Number.parseFloat(computed.opacity || '1') > 0.02;
  const isInteractive = computed.pointerEvents !== 'none' && !isDisabled;

  if (!isVisible || !isInteractive) {
    return { rect: null, found: true, target };
  }

  if (raw.width <= 0 || raw.height <= 0) {
    return { rect: null, found: true, target };
  }

  const top = Math.max(0, raw.top - padding);
  const left = Math.max(0, raw.left - padding);
  const right = Math.min(window.innerWidth, raw.right + padding);
  const bottom = Math.min(window.innerHeight, raw.bottom + padding);
  const width = Math.max(0, right - left);
  const height = Math.max(0, bottom - top);

  if (width <= 0 || height <= 0) {
    return { rect: null, found: true, target };
  }

  return {
    found: true,
    target,
    rect: {
      top,
      left,
      right,
      bottom,
      width,
      height,
    },
  };
};

export const useTutorialTargetRect = (
  selector: string | undefined,
  padding: number,
  enabled: boolean,
  assistKey?: string,
) => {
  const [rect, setRect] = useState<TutorialTargetRect | null>(null);
  const [isTargetFound, setIsTargetFound] = useState(false);
  const hasAutoScrolledRef = useRef(false);
  const assistKeyRef = useRef<string | undefined>(undefined);
  const holdUntilRef = useRef(0);
  const stepStartedAtRef = useRef(0);

  useEffect(() => {
    if (assistKeyRef.current !== assistKey) {
      assistKeyRef.current = assistKey;
      hasAutoScrolledRef.current = false;
      holdUntilRef.current = Date.now() + 220;
      stepStartedAtRef.current = Date.now();
    }
  }, [assistKey]);

  useEffect(() => {
    if (!enabled || !selector) {
      return;
    }

    if (stepStartedAtRef.current <= 0) {
      stepStartedAtRef.current = Date.now();
    }

    let rafId = 0;
    let retryTimeoutId = 0;
    let targetResizeObserver: ResizeObserver | null = null;
    const rootResizeObserver =
      'ResizeObserver' in window
        ? new ResizeObserver(() => {
            schedule();
          })
        : null;
    const mutationObserver =
      'MutationObserver' in window
        ? new MutationObserver(() => {
            schedule();
          })
        : null;

    const update = () => {
      if (Date.now() < holdUntilRef.current) {
        return;
      }

      const measured = measureTargetRect(selector, padding);
      setIsTargetFound(measured.found);
      setRect((prev) => (rectEquals(prev, measured.rect) ? prev : measured.rect));

      if (targetResizeObserver) {
        targetResizeObserver.disconnect();
      }
      if ('ResizeObserver' in window && measured.target) {
        targetResizeObserver = new ResizeObserver(() => {
          schedule();
        });
        targetResizeObserver.observe(measured.target);
      }

      if (
        !measured.found ||
        measured.rect ||
        !measured.target ||
        hasAutoScrolledRef.current
      ) {
        return;
      }

      hasAutoScrolledRef.current = true;
      measured.target.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'smooth' });
      retryTimeoutId = window.setTimeout(schedule, 210);
    };

    const schedule = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    };

    schedule();
    const intervalId = window.setInterval(() => {
      const stepAge = Date.now() - stepStartedAtRef.current;
      if (stepAge <= 2500) {
        schedule();
        return;
      }
      if (stepAge % 480 < 220) {
        schedule();
      }
    }, 220);

    window.addEventListener('resize', schedule);
    window.addEventListener('scroll', schedule, true);
    window.addEventListener('popstate', schedule);

    rootResizeObserver?.observe(document.documentElement);
    mutationObserver?.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      if (retryTimeoutId) window.clearTimeout(retryTimeoutId);
      window.clearInterval(intervalId);
      targetResizeObserver?.disconnect();
      rootResizeObserver?.disconnect();
      mutationObserver?.disconnect();
      window.removeEventListener('resize', schedule);
      window.removeEventListener('scroll', schedule, true);
      window.removeEventListener('popstate', schedule);
    };
  }, [enabled, padding, selector]);

  const effectiveEnabled = Boolean(enabled && selector);

  return {
    rect: effectiveEnabled ? rect : null,
    isTargetFound: effectiveEnabled ? isTargetFound : false,
    isTargetVisible: effectiveEnabled ? Boolean(rect) : false,
  };
};
