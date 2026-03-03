'use client';

import { useEffect, useMemo, useRef } from 'react';

type UseTutorialTargetClickOptions = {
  enabled: boolean;
  targetSelector?: string;
  targetPadding?: number;
  ignoreSelectors?: string[];
  onTargetClicked: () => void;
  onTargetMissed: () => void;
};

const isElementWithinSelectors = (element: Element, selectors: string[]): boolean => {
  for (const selector of selectors) {
    if (!selector) continue;
    if (element.closest(selector)) return true;
  }
  return false;
};

const isPointInsideExpandedTarget = (
  event: PointerEvent,
  target: HTMLElement,
  padding: number,
): boolean => {
  const rect = target.getBoundingClientRect();
  const top = rect.top - padding;
  const left = rect.left - padding;
  const right = rect.right + padding;
  const bottom = rect.bottom + padding;

  return (
    event.clientX >= left &&
    event.clientX <= right &&
    event.clientY >= top &&
    event.clientY <= bottom
  );
};

export const useTutorialTargetClick = ({
  enabled,
  targetSelector,
  targetPadding = 0,
  ignoreSelectors = [],
  onTargetClicked,
  onTargetMissed,
}: UseTutorialTargetClickOptions): void => {
  const cooldownRef = useRef<number | null>(null);
  const lastScrollOrMoveAtRef = useRef(0);
  const ignoreKey = useMemo(() => ignoreSelectors.join('|'), [ignoreSelectors]);

  useEffect(() => {
    if (!enabled || !targetSelector) return;

    const clearCooldown = () => {
      if (cooldownRef.current !== null) {
        window.clearTimeout(cooldownRef.current);
        cooldownRef.current = null;
      }
    };

    const setCooldown = () => {
      clearCooldown();
      cooldownRef.current = window.setTimeout(() => {
        cooldownRef.current = null;
      }, 140);
    };

    const handlePointerDown = (event: PointerEvent) => {
      const rawTarget = event.target;
      if (!(rawTarget instanceof Element)) return;
      if (event.pointerType === 'mouse' && event.button !== 0) return;

      if (isElementWithinSelectors(rawTarget, ignoreSelectors)) {
        return;
      }

      const targetElement = document.querySelector<HTMLElement>(targetSelector);
      if (!targetElement) {
        return;
      }

      const isTargetBySelector =
        rawTarget === targetElement || Boolean(rawTarget.closest(targetSelector));
      const isTargetByHitbox =
        !isTargetBySelector && isPointInsideExpandedTarget(event, targetElement, targetPadding);
      const isTargetClick = isTargetBySelector || isTargetByHitbox;

      // Always prioritize valid target clicks so tutorial feels responsive.
      if (isTargetClick) {
        if (cooldownRef.current !== null) return;
        setCooldown();
        onTargetClicked();
        return;
      }

      if (cooldownRef.current !== null) return;
      if (event.pointerType !== 'mouse' && Date.now() - lastScrollOrMoveAtRef.current < 140) {
        return;
      }

      setCooldown();
      onTargetMissed();
    };

    const tryAdvanceFromIframeFocus = () => {
      const targetElement = document.querySelector<HTMLElement>(targetSelector);
      if (!targetElement) return;

      const activeElement = document.activeElement;
      if (!(activeElement instanceof HTMLIFrameElement)) return;

      const isIframeTargetMatch =
        activeElement === targetElement ||
        Boolean(activeElement.closest(targetSelector)) ||
        targetElement.contains(activeElement);

      if (!isIframeTargetMatch) return;
      if (cooldownRef.current !== null) return;
      setCooldown();
      onTargetClicked();
    };

    const handleWindowBlur = () => {
      // Clicking inside cross-origin iframe (e.g., YouTube) won't always fire pointer events on parent.
      // Defer one tick and detect focused iframe as a valid target click.
      window.setTimeout(tryAdvanceFromIframeFocus, 0);
    };

    const handleFocusIn = (event: FocusEvent) => {
      const rawTarget = event.target;
      if (!(rawTarget instanceof HTMLIFrameElement)) return;

      const targetElement = document.querySelector<HTMLElement>(targetSelector);
      if (!targetElement) return;

      const isIframeTargetMatch =
        rawTarget === targetElement ||
        Boolean(rawTarget.closest(targetSelector)) ||
        targetElement.contains(rawTarget);

      if (!isIframeTargetMatch) return;
      if (cooldownRef.current !== null) return;
      setCooldown();
      onTargetClicked();
    };

    const markInteraction = () => {
      lastScrollOrMoveAtRef.current = Date.now();
    };

    window.addEventListener('pointerdown', handlePointerDown, true);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('focusin', handleFocusIn, true);
    window.addEventListener('pointermove', markInteraction, { passive: true });
    window.addEventListener('scroll', markInteraction, true);
    window.addEventListener('wheel', markInteraction, { passive: true });
    window.addEventListener('touchmove', markInteraction, { passive: true });

    return () => {
      clearCooldown();
      window.removeEventListener('pointerdown', handlePointerDown, true);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('focusin', handleFocusIn, true);
      window.removeEventListener('pointermove', markInteraction);
      window.removeEventListener('scroll', markInteraction, true);
      window.removeEventListener('wheel', markInteraction);
      window.removeEventListener('touchmove', markInteraction);
    };
  }, [
    enabled,
    ignoreKey,
    ignoreSelectors,
    onTargetClicked,
    onTargetMissed,
    targetPadding,
    targetSelector,
  ]);
};
