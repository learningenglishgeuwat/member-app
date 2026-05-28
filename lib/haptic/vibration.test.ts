/**
 * Unit tests for Haptic Feedback System - Core Library
 */

import {
  isVibrationSupported,
  vibrate,
  vibratePattern,
  vibrateByType,
  cancelVibration,
  isHapticEnabled,
  setHapticEnabled,
  enableHaptic,
  disableHaptic,
  type HapticType,
  type VibrationPattern,
} from './vibration';

describe('Haptic Feedback System - Core Library', () => {
  // Store original values
  const originalNavigator = global.navigator;
  const originalWindow = global.window;
  const originalLocalStorage = global.localStorage;

  // Mock functions
  let mockVibrate: jest.Mock;
  let mockGetItem: jest.Mock;
  let mockSetItem: jest.Mock;

  beforeEach(() => {
    // Reset mocks
    mockVibrate = jest.fn().mockReturnValue(true);
    mockGetItem = jest.fn();
    mockSetItem = jest.fn();

    // Setup navigator mock with vibrate support
    Object.defineProperty(global, 'navigator', {
      value: {
        vibrate: mockVibrate,
      },
      writable: true,
      configurable: true,
    });

    // Setup window mock
    Object.defineProperty(global, 'window', {
      value: {},
      writable: true,
      configurable: true,
    });

    // Setup localStorage mock
    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: mockGetItem,
        setItem: mockSetItem,
      },
      writable: true,
      configurable: true,
    });

    // Clear console.warn mock
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    // Restore original values
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(global, 'window', {
      value: originalWindow,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(global, 'localStorage', {
      value: originalLocalStorage,
      writable: true,
      configurable: true,
    });

    jest.restoreAllMocks();
  });

  describe('isVibrationSupported', () => {
    it('should return true when navigator.vibrate exists', () => {
      expect(isVibrationSupported()).toBe(true);
    });

    it('should return true when navigator.vibration exists (legacy API)', () => {
      Object.defineProperty(global, 'navigator', {
        value: {
          vibration: {},
        },
        writable: true,
        configurable: true,
      });

      expect(isVibrationSupported()).toBe(true);
    });

    it('should return false when navigator.vibrate does not exist', () => {
      Object.defineProperty(global, 'navigator', {
        value: {},
        writable: true,
        configurable: true,
      });

      expect(isVibrationSupported()).toBe(false);
    });

    it('should return false in server-side context (window undefined)', () => {
      Object.defineProperty(global, 'window', {
        value: undefined,
        writable: true,
        configurable: true,
      });

      expect(isVibrationSupported()).toBe(false);
    });

    it('should return false in server-side context (navigator undefined)', () => {
      Object.defineProperty(global, 'navigator', {
        value: undefined,
        writable: true,
        configurable: true,
      });

      expect(isVibrationSupported()).toBe(false);
    });

    it('should check both navigator.vibrate and navigator.vibration', () => {
      // First check: navigator.vibrate exists
      Object.defineProperty(global, 'navigator', {
        value: {
          vibrate: mockVibrate,
        },
        writable: true,
        configurable: true,
      });
      expect(isVibrationSupported()).toBe(true);

      // Second check: only navigator.vibration exists
      Object.defineProperty(global, 'navigator', {
        value: {
          vibration: {},
        },
        writable: true,
        configurable: true,
      });
      expect(isVibrationSupported()).toBe(true);

      // Third check: neither exists
      Object.defineProperty(global, 'navigator', {
        value: {},
        writable: true,
        configurable: true,
      });
      expect(isVibrationSupported()).toBe(false);
    });
  });

  describe('vibrate', () => {
    beforeEach(() => {
      // Default to enabled
      mockGetItem.mockReturnValue('true');
    });

    it('should call navigator.vibrate with correct duration', () => {
      vibrate(50);

      expect(mockVibrate).toHaveBeenCalledWith(0); // Cancel previous
      expect(mockVibrate).toHaveBeenCalledWith(50); // New vibration
      expect(mockVibrate).toHaveBeenCalledTimes(2);
    });

    it('should cancel previous vibration before new one', () => {
      vibrate(100);

      const calls = mockVibrate.mock.calls;
      expect(calls[0][0]).toBe(0); // First call cancels
      expect(calls[1][0]).toBe(100); // Second call vibrates
    });

    it('should return early when duration is zero', () => {
      vibrate(0);

      expect(mockVibrate).not.toHaveBeenCalled();
    });

    it('should return early when duration is negative', () => {
      vibrate(-10);

      expect(mockVibrate).not.toHaveBeenCalled();
    });

    it('should return early when duration is NaN', () => {
      vibrate(NaN);

      expect(mockVibrate).not.toHaveBeenCalled();
    });

    it('should return early when duration is Infinity', () => {
      vibrate(Infinity);

      expect(mockVibrate).not.toHaveBeenCalled();
    });

    it('should return early when device does not support vibration', () => {
      Object.defineProperty(global, 'navigator', {
        value: {},
        writable: true,
        configurable: true,
      });

      vibrate(50);

      expect(mockVibrate).not.toHaveBeenCalled();
    });

    it('should return early when haptic is disabled', () => {
      mockGetItem.mockReturnValue('false');

      vibrate(50);

      expect(mockVibrate).not.toHaveBeenCalled();
    });

    it('should not throw error when vibration fails', () => {
      mockVibrate.mockImplementation(() => {
        throw new Error('Vibration failed');
      });

      expect(() => vibrate(50)).not.toThrow();
    });
  });

  describe('vibratePattern', () => {
    beforeEach(() => {
      mockGetItem.mockReturnValue('true');
    });

    it('should call navigator.vibrate with correct pattern array', () => {
      const pattern: VibrationPattern = [100, 50, 100];
      vibratePattern(pattern);

      expect(mockVibrate).toHaveBeenCalledWith(0); // Cancel previous
      expect(mockVibrate).toHaveBeenCalledWith(pattern); // New pattern
      expect(mockVibrate).toHaveBeenCalledTimes(2);
    });

    it('should return early when pattern is empty', () => {
      vibratePattern([]);

      expect(mockVibrate).not.toHaveBeenCalled();
    });

    it('should filter out negative values', () => {
      vibratePattern([100, -50, 100]);

      expect(mockVibrate).toHaveBeenCalledWith(0);
      expect(mockVibrate).toHaveBeenCalledWith([100, 100]);
    });

    it('should filter out NaN values', () => {
      vibratePattern([100, NaN, 100]);

      expect(mockVibrate).toHaveBeenCalledWith(0);
      expect(mockVibrate).toHaveBeenCalledWith([100, 100]);
    });

    it('should filter out non-number values', () => {
      vibratePattern([100, '50' as any, 100]);

      expect(mockVibrate).toHaveBeenCalledWith(0);
      expect(mockVibrate).toHaveBeenCalledWith([100, 100]);
    });

    it('should limit pattern to 10 elements', () => {
      const longPattern = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120];
      vibratePattern(longPattern);

      expect(mockVibrate).toHaveBeenCalledWith(0);
      expect(mockVibrate).toHaveBeenCalledWith([10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
    });

    it('should return early when all values are invalid', () => {
      vibratePattern([-1, -2, NaN, 'invalid' as any]);

      expect(mockVibrate).not.toHaveBeenCalled();
    });

    it('should cancel previous vibration before new pattern', () => {
      vibratePattern([100, 50, 100]);

      const calls = mockVibrate.mock.calls;
      expect(calls[0][0]).toBe(0); // First call cancels
      expect(calls[1]).toEqual([[100, 50, 100]]); // Second call vibrates
    });

    it('should return early when device does not support vibration', () => {
      Object.defineProperty(global, 'navigator', {
        value: {},
        writable: true,
        configurable: true,
      });

      vibratePattern([100, 50, 100]);

      expect(mockVibrate).not.toHaveBeenCalled();
    });

    it('should return early when haptic is disabled', () => {
      mockGetItem.mockReturnValue('false');

      vibratePattern([100, 50, 100]);

      expect(mockVibrate).not.toHaveBeenCalled();
    });

    it('should not throw error when vibration fails', () => {
      mockVibrate.mockImplementation(() => {
        throw new Error('Vibration failed');
      });

      expect(() => vibratePattern([100, 50, 100])).not.toThrow();
    });
  });

  describe('vibrateByType', () => {
    beforeEach(() => {
      mockGetItem.mockReturnValue('true');
    });

    it('should trigger tap pattern [50]', () => {
      vibrateByType('tap');

      expect(mockVibrate).toHaveBeenCalledWith(0);
      expect(mockVibrate).toHaveBeenCalledWith([50]);
    });

    it('should trigger input pattern [30]', () => {
      vibrateByType('input');

      expect(mockVibrate).toHaveBeenCalledWith(0);
      expect(mockVibrate).toHaveBeenCalledWith([30]);
    });

    it('should trigger error pattern [100, 50, 100, 50, 100]', () => {
      vibrateByType('error');

      expect(mockVibrate).toHaveBeenCalledWith(0);
      expect(mockVibrate).toHaveBeenCalledWith([100, 50, 100, 50, 100]);
    });

    it('should trigger success pattern [50, 30, 50, 30, 100]', () => {
      vibrateByType('success');

      expect(mockVibrate).toHaveBeenCalledWith(0);
      expect(mockVibrate).toHaveBeenCalledWith([50, 30, 50, 30, 100]);
    });

    it('should log warning for invalid type', () => {
      const consoleWarnSpy = jest.spyOn(console, 'warn');

      vibrateByType('invalid' as HapticType);

      expect(consoleWarnSpy).toHaveBeenCalledWith('[Haptic] Invalid haptic type: invalid');
      expect(mockVibrate).not.toHaveBeenCalled();
    });

    it('should return early when haptic is disabled', () => {
      mockGetItem.mockReturnValue('false');

      vibrateByType('tap');

      expect(mockVibrate).not.toHaveBeenCalled();
    });
  });

  describe('cancelVibration', () => {
    it('should call navigator.vibrate(0) to cancel', () => {
      cancelVibration();

      expect(mockVibrate).toHaveBeenCalledWith(0);
      expect(mockVibrate).toHaveBeenCalledTimes(1);
    });

    it('should work even when no vibration is active', () => {
      expect(() => cancelVibration()).not.toThrow();
      expect(mockVibrate).toHaveBeenCalledWith(0);
    });

    it('should return early when device does not support vibration', () => {
      Object.defineProperty(global, 'navigator', {
        value: {},
        writable: true,
        configurable: true,
      });

      cancelVibration();

      expect(mockVibrate).not.toHaveBeenCalled();
    });

    it('should not throw error when cancellation fails', () => {
      mockVibrate.mockImplementation(() => {
        throw new Error('Cancellation failed');
      });

      expect(() => cancelVibration()).not.toThrow();
    });
  });

  describe('isHapticEnabled', () => {
    it('should read preference from localStorage', () => {
      mockGetItem.mockReturnValue('true');

      const result = isHapticEnabled();

      expect(mockGetItem).toHaveBeenCalledWith('haptic-feedback-enabled');
      expect(result).toBe(true);
    });

    it('should return true when preference is "true"', () => {
      mockGetItem.mockReturnValue('true');

      expect(isHapticEnabled()).toBe(true);
    });

    it('should return false when preference is "false"', () => {
      mockGetItem.mockReturnValue('false');

      expect(isHapticEnabled()).toBe(false);
    });

    it('should default to true when preference not set', () => {
      mockGetItem.mockReturnValue(null);

      expect(isHapticEnabled()).toBe(true);
    });

    it('should default to true when localStorage is unavailable', () => {
      Object.defineProperty(global, 'localStorage', {
        value: undefined,
        writable: true,
        configurable: true,
      });

      expect(isHapticEnabled()).toBe(true);
    });

    it('should default to true when localStorage throws error', () => {
      mockGetItem.mockImplementation(() => {
        throw new Error('localStorage blocked');
      });

      expect(isHapticEnabled()).toBe(true);
    });

    it('should default to true in server-side context', () => {
      Object.defineProperty(global, 'window', {
        value: undefined,
        writable: true,
        configurable: true,
      });

      expect(isHapticEnabled()).toBe(true);
    });
  });

  describe('setHapticEnabled', () => {
    it('should save "true" to localStorage when enabled', () => {
      setHapticEnabled(true);

      expect(mockSetItem).toHaveBeenCalledWith('haptic-feedback-enabled', 'true');
    });

    it('should save "false" to localStorage when disabled', () => {
      setHapticEnabled(false);

      expect(mockSetItem).toHaveBeenCalledWith('haptic-feedback-enabled', 'false');
    });

    it('should handle localStorage unavailable gracefully', () => {
      Object.defineProperty(global, 'localStorage', {
        value: undefined,
        writable: true,
        configurable: true,
      });

      expect(() => setHapticEnabled(true)).not.toThrow();
    });

    it('should handle localStorage error gracefully', () => {
      mockSetItem.mockImplementation(() => {
        throw new Error('localStorage blocked');
      });

      expect(() => setHapticEnabled(true)).not.toThrow();
    });

    it('should handle server-side context gracefully', () => {
      Object.defineProperty(global, 'window', {
        value: undefined,
        writable: true,
        configurable: true,
      });

      expect(() => setHapticEnabled(true)).not.toThrow();
    });
  });

  describe('enableHaptic', () => {
    it('should call setHapticEnabled with true', () => {
      enableHaptic();

      expect(mockSetItem).toHaveBeenCalledWith('haptic-feedback-enabled', 'true');
    });
  });

  describe('disableHaptic', () => {
    it('should call setHapticEnabled with false', () => {
      disableHaptic();

      expect(mockSetItem).toHaveBeenCalledWith('haptic-feedback-enabled', 'false');
    });
  });

  describe('Preference Management Integration', () => {
    it('should block vibration when disabled', () => {
      mockGetItem.mockReturnValue('false');

      vibrate(50);
      vibratePattern([100, 50, 100]);
      vibrateByType('tap');

      expect(mockVibrate).not.toHaveBeenCalled();
    });

    it('should allow vibration when enabled', () => {
      mockGetItem.mockReturnValue('true');

      vibrate(50);

      expect(mockVibrate).toHaveBeenCalled();
    });

    it('should persist preference across function calls', () => {
      // Disable haptic
      setHapticEnabled(false);
      expect(mockSetItem).toHaveBeenCalledWith('haptic-feedback-enabled', 'false');

      // Check that it's disabled
      mockGetItem.mockReturnValue('false');
      expect(isHapticEnabled()).toBe(false);

      // Enable haptic
      setHapticEnabled(true);
      expect(mockSetItem).toHaveBeenCalledWith('haptic-feedback-enabled', 'true');

      // Check that it's enabled
      mockGetItem.mockReturnValue('true');
      expect(isHapticEnabled()).toBe(true);
    });
  });
});
