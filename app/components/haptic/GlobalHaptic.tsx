'use client';

import React, { useEffect } from 'react';
import { useHaptic } from '@/lib/haptic/useHaptic';

export function GlobalHaptic({ children }: { children: React.ReactNode }) {
  const { triggerHaptic } = useHaptic();

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Detect if user is clicking a button, link, or custom clickable element
      const isClickable = target.closest('button, a, [role="button"], input[type="submit"], input[type="checkbox"], input[type="radio"], select, .cursor-pointer');
      
      // Prevent double vibration if the element already uses HapticButton manually
      // We can check if it has a custom data attribute, but for now we just vibrate.
      if (isClickable) {
        triggerHaptic('tap');
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Trigger haptic on text inputs
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        const type = (target as HTMLInputElement).type;
        // Don't trigger 'input' haptic for checkboxes/radios on spacebar, they get click
        if (type === 'checkbox' || type === 'radio') return;

        const ignoredKeys = ['Tab', 'Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Escape'];
        if (!ignoredKeys.includes(e.key)) {
          triggerHaptic('input');
        }
      }
    };

    // Use capture phase to ensure we catch it early
    document.addEventListener('click', handleClick, { capture: true, passive: true });
    document.addEventListener('keydown', handleKeyDown, { capture: true, passive: true });

    return () => {
      document.removeEventListener('click', handleClick, { capture: true });
      document.removeEventListener('keydown', handleKeyDown, { capture: true });
    };
  }, [triggerHaptic]);

  return <>{children}</>;
}
