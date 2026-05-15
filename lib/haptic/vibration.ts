/**
 * Haptic Feedback System - Core Library
 * 
 * Provides tactile feedback for user interactions using the browser's Vibration API.
 * Follows a modular architecture pattern similar to the TTS system.
 * 
 * Features:
 * - Device detection and graceful degradation
 * - Predefined haptic types (tap, input, error, success)
 * - Custom vibration patterns
 * - User preference management via localStorage
 * - Performance-conscious (cancels previous vibrations)
 * - Type-safe with full TypeScript support
 */

/**
 * Predefined haptic feedback types with semantic meaning
 */
export type HapticType = 'tap' | 'input' | 'error' | 'success';

/**
 * Vibration pattern: array of durations in milliseconds
 * Alternates between vibrate and pause: [vibrate, pause, vibrate, pause, ...]
 * 
 * @example
 * ```typescript
 * // Single vibration
 * const tapPattern: VibrationPattern = [50];
 * 
 * // Multiple vibrations with pauses
 * const errorPattern: VibrationPattern = [100, 50, 100, 50, 100];
 * ```
 */
export type VibrationPattern = number[];

/**
 * Options for custom vibration
 */
export type VibrateOptions = {
  /** Duration in milliseconds for a single vibration */
  duration?: number;
  /** Pattern array for complex vibration sequences */
  pattern?: VibrationPattern;
};

/**
 * Predefined haptic patterns for common interaction types
 * 
 * - tap: Quick confirmation for button/card taps (50ms)
 * - input: Subtle feedback for keyboard input (30ms)
 * - error: Attention-grabbing pattern for validation errors
 * - success: Pleasant pattern for successful actions
 */
const HAPTIC_PATTERNS: Record<HapticType, VibrationPattern> = {
  tap: [50],                          // Quick tap confirmation
  input: [30],                        // Subtle keyboard feedback
  error: [100, 50, 100, 50, 100],    // Attention-grabbing error pattern
  success: [50, 30, 50, 30, 100],    // Pleasant success pattern
};

/**
 * localStorage key for storing user's haptic feedback preference
 */
const HAPTIC_STORAGE_KEY = 'haptic-feedback-enabled';

/**
 * Check if Vibration API is supported on current device.
 * Returns false in server-side context or unsupported browsers.
 * 
 * @returns true if Vibration API is available, false otherwise
 * 
 * @example
 * ```typescript
 * if (isVibrationSupported()) {
 *   console.log('Haptic feedback available');
 * } else {
 *   console.log('Haptic feedback not supported on this device');
 * }
 * ```
 */
export function isVibrationSupported(): boolean {
  // Check for server-side rendering context
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }

  // Check for modern Vibration API
  if ('vibrate' in navigator && typeof navigator.vibrate === 'function') {
    return true;
  }

  // Check for legacy Vibration API (older Android devices)
  if ('vibration' in navigator) {
    return true;
  }

  return false;
}

/**
 * Check if haptic feedback is currently enabled by user preference.
 * Defaults to true if preference not set.
 * 
 * @returns true if haptic feedback is enabled, false otherwise
 * 
 * @example
 * ```typescript
 * if (isHapticEnabled()) {
 *   vibrate(50);
 * }
 * ```
 */
export function isHapticEnabled(): boolean {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return true; // Default to enabled
    }

    const stored = localStorage.getItem(HAPTIC_STORAGE_KEY);
    if (stored === null) {
      return true; // Default to enabled if not set
    }

    return stored === 'true';
  } catch {
    // localStorage might be blocked or unavailable
    return true; // Default to enabled
  }
}

/**
 * Set haptic enabled state and persist to localStorage.
 * 
 * @param enabled - true to enable haptic feedback, false to disable
 * 
 * @example
 * ```typescript
 * // Disable haptic feedback
 * setHapticEnabled(false);
 * 
 * // Enable haptic feedback
 * setHapticEnabled(true);
 * ```
 */
export function setHapticEnabled(enabled: boolean): void {
  try {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(HAPTIC_STORAGE_KEY, enabled ? 'true' : 'false');
  } catch {
    // localStorage might be blocked or unavailable
    // Fail silently - preference won't persist but app continues working
  }
}

/**
 * Enable haptic feedback and persist preference to localStorage.
 * 
 * @example
 * ```typescript
 * enableHaptic();
 * ```
 */
export function enableHaptic(): void {
  setHapticEnabled(true);
}

/**
 * Disable haptic feedback and persist preference to localStorage.
 * 
 * @example
 * ```typescript
 * disableHaptic();
 * ```
 */
export function disableHaptic(): void {
  setHapticEnabled(false);
}

/**
 * Cancel any ongoing vibration immediately.
 * 
 * @example
 * ```typescript
 * // Start a long vibration
 * vibrate(1000);
 * 
 * // Cancel it immediately
 * cancelVibration();
 * ```
 */
export function cancelVibration(): void {
  if (!isVibrationSupported()) {
    return;
  }

  try {
    navigator.vibrate(0);
  } catch {
    // Vibration API might throw errors on some devices
    // Fail silently to prevent breaking the application
  }
}

/**
 * Execute vibration with specified duration in milliseconds.
 * Cancels any ongoing vibration before starting new one.
 * Returns early if device doesn't support vibration or duration is invalid.
 * 
 * @param duration - Vibration duration in milliseconds (must be positive)
 * 
 * @example
 * ```typescript
 * // Vibrate for 50ms
 * vibrate(50);
 * 
 * // Invalid duration (no vibration)
 * vibrate(-10);
 * vibrate(0);
 * ```
 */
export function vibrate(duration: number): void {
  // Check if haptic feedback is enabled by user preference
  if (!isHapticEnabled()) {
    return;
  }

  // Check device support
  if (!isVibrationSupported()) {
    return;
  }

  // Validate duration
  if (duration <= 0 || !Number.isFinite(duration)) {
    return;
  }

  try {
    // Cancel any ongoing vibration
    navigator.vibrate(0);

    // Execute new vibration
    navigator.vibrate(duration);
  } catch {
    // Vibration API might throw errors on some devices
    // Fail silently to prevent breaking the application
  }
}

/**
 * Execute vibration with specified pattern.
 * Pattern format: [vibrate, pause, vibrate, pause, ...]
 * Cancels any ongoing vibration before starting new one.
 * 
 * @param pattern - Array of durations in milliseconds
 * 
 * @example
 * ```typescript
 * // Simple pattern: vibrate 100ms, pause 50ms, vibrate 100ms
 * vibratePattern([100, 50, 100]);
 * 
 * // Complex pattern
 * vibratePattern([50, 30, 50, 30, 100]);
 * ```
 */
export function vibratePattern(pattern: VibrationPattern): void {
  // Check if haptic feedback is enabled by user preference
  if (!isHapticEnabled()) {
    return;
  }

  // Check device support
  if (!isVibrationSupported()) {
    return;
  }

  // Validate pattern
  if (!Array.isArray(pattern) || pattern.length === 0) {
    return;
  }

  // Filter out invalid values (negative, NaN, non-numbers)
  const validPattern = pattern.filter(
    (value) => typeof value === 'number' && Number.isFinite(value) && value >= 0
  );

  if (validPattern.length === 0) {
    return;
  }

  // Limit pattern to 10 elements for compatibility
  const limitedPattern = validPattern.slice(0, 10);

  try {
    // Cancel any ongoing vibration
    navigator.vibrate(0);

    // Execute new pattern
    navigator.vibrate(limitedPattern);
  } catch {
    // Vibration API might throw errors on some devices
    // Fail silently to prevent breaking the application
  }
}

/**
 * Execute vibration by predefined haptic type.
 * Maps semantic types to appropriate patterns.
 * 
 * @param type - Predefined haptic type ('tap', 'input', 'error', 'success')
 * 
 * @example
 * ```typescript
 * // Button tap feedback
 * vibrateByType('tap');
 * 
 * // Keyboard input feedback
 * vibrateByType('input');
 * 
 * // Validation error feedback
 * vibrateByType('error');
 * 
 * // Success action feedback
 * vibrateByType('success');
 * ```
 */
export function vibrateByType(type: HapticType): void {
  // Look up pattern from predefined patterns
  const pattern = HAPTIC_PATTERNS[type];

  if (!pattern) {
    // Invalid type - log warning in development
    if (typeof console !== 'undefined' && console.warn) {
      console.warn(`[Haptic] Invalid haptic type: ${type}`);
    }
    return;
  }

  // Execute the pattern
  vibratePattern(pattern);
}
