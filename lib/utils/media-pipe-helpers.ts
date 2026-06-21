import type { NormalizedLandmark } from '@mediapipe/tasks-vision';
import type { HandGestureEvent, HandGestureName } from '@/lib/hooks/useHandGestureTracking';

const PUBLIC_PATHS = new Set(['/login', '/device-pairing', '/forgot-password', '/reset-password']);

// Constants
export const HAND_CONNECTIONS: Array<[number, number]> = [
  [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8],
  [5, 9], [9, 10], [10, 11], [11, 12], [9, 13], [13, 14], [14, 15],
  [15, 16], [13, 17], [17, 18], [18, 19], [19, 20], [0, 17],
];

export const CLICKABLE_SELECTOR = [
  'button', 'a', 'input', 'select', 'textarea', '[role="button"]',
  '[tabindex]', '.cursor-pointer', '.alphabet-letter-card', '[data-gesture-clickable]',
].join(', ');

export function normalizePathname(pathname: string | null) {
  if (!pathname) return '';
  return pathname.replace(/\/$/, '') || '/';
}

export function isPublicPath(pathname: string) {
  return PUBLIC_PATHS.has(pathname);
}

export function dispatchGestureEvent(name: string, detail: HandGestureEvent) {
  const event = new CustomEvent(name, { detail });
  window.dispatchEvent(event);
  document.dispatchEvent(event);
}

export function triggerAudioCue(name: 'laser' | 'success') {
  document.dispatchEvent(new CustomEvent(`app:audio:${name}`));
}

export function getClickableElementAtPoint(x: number, y: number) {
  const element = document.elementFromPoint(x, y) as HTMLElement | null;
  const target = element?.closest(CLICKABLE_SELECTOR) as HTMLElement | null;

  if (!target) return null;
  if (target.hasAttribute('disabled') || target.getAttribute('aria-disabled') === 'true') return null;

  return target;
}

export function clickTargetElement(target: HTMLElement) {
  target.focus?.({ preventScroll: true });
  if (target instanceof HTMLSelectElement && 'showPicker' in target) {
    try {
      target.showPicker();
    } catch (e) {
      target.click();
    }
  } else {
    target.click();
  }
}

export function simulateClickAtPoint(x: number, y: number) {
  const element = document.elementFromPoint(x, y) as HTMLElement | null;
  if (!element) return false;

  const target = element.closest(CLICKABLE_SELECTOR) as HTMLElement | null;

  if (target && !target.hasAttribute('disabled') && target.getAttribute('aria-disabled') !== 'true') {
    clickTargetElement(target);
    return true;
  }

  const eventInit = {
    view: window,
    bubbles: true,
    cancelable: true,
    clientX: x,
    clientY: y,
    button: 0,
    buttons: 1,
  };

  element.dispatchEvent(new PointerEvent('pointerdown', eventInit));
  element.dispatchEvent(new MouseEvent('mousedown', eventInit));
  
  eventInit.buttons = 0;
  element.dispatchEvent(new PointerEvent('pointerup', eventInit));
  element.dispatchEvent(new MouseEvent('mouseup', eventInit));
  
  element.dispatchEvent(new MouseEvent('click', eventInit));
  
  return true;
}

export function getScrollableElementAtPoint(x: number, y: number): Element | null {
  let el = document.elementFromPoint(x, y);
  while (el && el !== document.documentElement && el !== document.body) {
    const style = window.getComputedStyle(el);
    const overflowY = style.overflowY;
    if (overflowY === 'auto' || overflowY === 'scroll') {
      if (el.scrollHeight > el.clientHeight) {
        return el;
      }
    }
    el = el.parentElement;
  }
  return null;
}

export function getActiveScrollableElement(x: number, y: number): Element | null {
  let el = getScrollableElementAtPoint(x, y);
  if (el) return el;

  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  el = getScrollableElementAtPoint(centerX, centerY);
  if (el) return el;

  const dialogs = document.querySelectorAll('[role="dialog"]');
  for (let i = dialogs.length - 1; i >= 0; i--) {
    const dialog = dialogs[i];
    const style = window.getComputedStyle(dialog);
    if ((style.overflowY === 'auto' || style.overflowY === 'scroll') && dialog.scrollHeight > dialog.clientHeight) {
      return dialog;
    }
    const scrollableChild = Array.from(dialog.querySelectorAll('*')).find((child) => {
      const childStyle = window.getComputedStyle(child);
      return (childStyle.overflowY === 'auto' || childStyle.overflowY === 'scroll') && child.scrollHeight > child.clientHeight;
    });
    if (scrollableChild) return scrollableChild;
  }

  return null;
}

export function getElementByDataValue(attributeName: string, value: string) {
  return (
    Array.from(document.querySelectorAll<HTMLElement>(`[${attributeName}]`)).find(
      (element) => element.getAttribute(attributeName) === value,
    ) ?? null
  );
}

export function getControlCenterSectionElement(button: HTMLButtonElement) {
  const sectionId = button.dataset.controlCenterSectionId;
  if (!sectionId) return null;

  return (
    document.getElementById(sectionId) ??
    getElementByDataValue('data-section-id', sectionId) ??
    getElementByDataValue('data-gesture-section-id', sectionId)
  );
}

export function getViewportSectionScore(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
  const viewportCenter = viewportHeight / 2;
  const visibleTop = Math.max(rect.top, 0);
  const visibleBottom = Math.min(rect.bottom, viewportHeight);
  const visibleHeight = Math.max(0, visibleBottom - visibleTop);
  const containsViewportCenter = rect.top <= viewportCenter && rect.bottom >= viewportCenter;
  const distanceFromCenter = containsViewportCenter
    ? 0
    : Math.min(Math.abs(rect.top - viewportCenter), Math.abs(rect.bottom - viewportCenter));

  if (rect.height <= 0 && visibleHeight <= 0) return Number.NEGATIVE_INFINITY;

  return (
    (containsViewportCenter ? 1_000_000 : 0) +
    (visibleHeight > 0 ? 100_000 : 0) +
    Math.min(visibleHeight, viewportHeight) -
    distanceFromCenter
  );
}

export function findBestVisibleControlCenterButton(buttons: HTMLButtonElement[]) {
  let bestButton: HTMLButtonElement | null = null;
  let bestScore = Number.NEGATIVE_INFINITY;

  for (const button of buttons) {
    const sectionElement = getControlCenterSectionElement(button);
    if (!sectionElement) continue;

    const score = getViewportSectionScore(sectionElement);
    if (score > bestScore) {
      bestScore = score;
      bestButton = button;
    }
  }

  return bestButton;
}

export function clickControlCenterPlayButton() {
  const buttons = Array.from(
    document.querySelectorAll<HTMLButtonElement>('[data-control-center-playstop="true"]'),
  ).filter(
    (button) => !button.disabled && button.getAttribute('aria-disabled') !== 'true',
  );
  const target = findBestVisibleControlCenterButton(buttons) ?? buttons[0];

  if (!target) return false;

  target.click();
  return true;
}

export function clickControlCenterIpaToggle() {
  const scopedInputs = Array.from(
    document.querySelectorAll<HTMLInputElement>(
      '[data-control-center-root="true"] [data-control-center-ipa-toggle="true"]',
    ),
  );
  const fallbackInputs = scopedInputs.length
    ? scopedInputs
    : Array.from(document.querySelectorAll<HTMLInputElement>('[data-control-center-ipa-toggle="true"]'));
  const target = fallbackInputs.find(
    (input) => !input.disabled && input.getAttribute('aria-disabled') !== 'true',
  );

  if (!target) return false;

  target.click();
  return true;
}

export function getButtonTitle(enabled: boolean, status: string, error: string | null) {
  if (status === 'error') return error ? `Hand gesture error: ${error}` : 'Hand gesture error';
  if (enabled) return 'Hand gesture: On';
  return 'Hand gesture: Off';
}

export function getCursorClasses(activeGesture: HandGestureName) {
  if (activeGesture === 'pinch' || activeGesture === 'fist-zoom') {
    return 'border-cyan-200 bg-cyan-300/10 shadow-[0_0_18px_rgba(103,232,249,0.62)]';
  }

  if (activeGesture === 'palm-scroll') {
    return 'border-lime-300 bg-lime-300/15 shadow-[0_0_18px_rgba(190,242,100,0.65)] scale-110';
  }

  if (activeGesture === 'peace-sign') {
    return 'border-emerald-200 bg-emerald-300/20 shadow-[0_0_20px_rgba(110,231,183,0.72)] scale-110';
  }

  if (activeGesture === 'pinky-point') {
    return 'border-pink-200 bg-pink-300/20 shadow-[0_0_20px_rgba(244,114,182,0.78)] scale-110';
  }

  if (activeGesture === 'swipe-left' || activeGesture === 'swipe-right') {
    return 'border-cyan-100 bg-cyan-300/25 shadow-[0_0_22px_rgba(103,232,249,0.85)] scale-125';
  }

  return 'border-cyan-300 bg-cyan-300/10 shadow-[0_0_16px_rgba(34,211,238,0.55)]';
}

export function getCoverPoint(
  landmark: NormalizedLandmark,
  canvas: HTMLCanvasElement,
  video: HTMLVideoElement | null,
) {
  const width = canvas.clientWidth || window.innerWidth;
  const height = canvas.clientHeight || window.innerHeight;
  const videoWidth = video?.videoWidth || 0;
  const videoHeight = video?.videoHeight || 0;

  if (!videoWidth || !videoHeight) {
    return {
      x: (1 - landmark.x) * width,
      y: landmark.y * height,
    };
  }

  const videoAspect = videoWidth / videoHeight;
  const canvasAspect = width / height;
  const displayWidth = videoAspect > canvasAspect ? height * videoAspect : width;
  const displayHeight = videoAspect > canvasAspect ? height : width / videoAspect;
  const offsetX = (width - displayWidth) / 2;
  const offsetY = (height - displayHeight) / 2;

  return {
    x: offsetX + (1 - landmark.x) * displayWidth,
    y: offsetY + landmark.y * displayHeight,
  };
}

export function drawHandLandmarks(
  canvas: HTMLCanvasElement,
  video: HTMLVideoElement | null,
  landmarks: NormalizedLandmark[] | null,
  zoomLevel: number = 1,
) {
  const context = canvas.getContext('2d');
  if (!context) return;

  const pixelRatio = window.devicePixelRatio || 1;
  const width = window.innerWidth / zoomLevel;
  const height = window.innerHeight / zoomLevel;
  const nextWidth = Math.floor(width * pixelRatio);
  const nextHeight = Math.floor(height * pixelRatio);

  if (canvas.width !== nextWidth || canvas.height !== nextHeight) {
    canvas.width = nextWidth;
    canvas.height = nextHeight;
  }

  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  context.clearRect(0, 0, width, height);

  if (!landmarks?.length) return;

  const points = landmarks.map((landmark) => getCoverPoint(landmark, canvas, video));

  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.lineWidth = 3;
  context.strokeStyle = 'rgba(103, 232, 249, 0.86)';
  context.shadowColor = 'rgba(34, 211, 238, 0.9)';
  context.shadowBlur = 10;

  for (const [from, to] of HAND_CONNECTIONS) {
    const start = points[from];
    const end = points[to];
    if (!start || !end) continue;

    context.beginPath();
    context.moveTo(start.x, start.y);
    context.lineTo(end.x, end.y);
    context.stroke();
  }

  context.shadowBlur = 12;
  for (const [index, point] of points.entries()) {
    context.beginPath();
    context.fillStyle = index === 8 ? 'rgba(244, 114, 182, 0.96)' : 'rgba(255, 255, 255, 0.92)';
    context.arc(point.x, point.y, index === 8 ? 6 : 4, 0, Math.PI * 2);
    context.fill();
  }
}
