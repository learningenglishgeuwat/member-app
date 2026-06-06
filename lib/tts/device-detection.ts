// lib/tts/device-detection.ts
// ============================================================
// Device and Browser Detection Utilities
// ============================================================

/**
 * Detects iOS devices (iPad, iPhone, iPod)
 */
export function isIOS(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window);
}

/**
 * Detects Safari browser
 */
export function isSafari(): boolean {
  if (typeof navigator === 'undefined') return false;
  return (
    /^((?!chrome|android).)*safari/i.test(navigator.userAgent) ||
    (navigator.vendor?.includes('Apple') ?? false)
  );
}

/**
 * Detects Xiaomi devices (includes Mi, Redmi, POCO brands)
 */
export function isXiaomi(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /xiaomi|mi\s|redmi|poco/i.test(navigator.userAgent);
}

/**
 * Check if Speech Synthesis API is supported
 */
export function isSpeechSynthesisSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof window.SpeechSynthesisUtterance !== 'undefined' &&
    'speechSynthesis' in window
  );
}
