import { useState, useEffect, useCallback } from 'react';
import { 
  HapticType, 
  VibrationPattern, 
  isVibrationSupported, 
  isHapticEnabled, 
  enableHaptic, 
  disableHaptic, 
  vibrate, 
  vibratePattern, 
  vibrateByType, 
  cancelVibration 
} from './vibration';

export interface UseHapticReturn {
  isSupported: boolean;
  isEnabled: boolean;
  triggerHaptic: (type: HapticType) => void;
  triggerHapticDuration: (duration: number) => void;
  triggerHapticPattern: (pattern: VibrationPattern) => void;
  enable: () => void;
  disable: () => void;
}

export function useHaptic(): UseHapticReturn {
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [isSupported, setIsSupported] = useState<boolean>(false);

  useEffect(() => {
    // Read initial state on mount
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsEnabled(isHapticEnabled());
    setIsSupported(isVibrationSupported());

    // Cleanup on unmount
    return () => {
      cancelVibration();
    };
  }, []);

  const triggerHaptic = useCallback((type: HapticType) => {
    if (isEnabled) {
      vibrateByType(type);
    }
  }, [isEnabled]);

  const triggerHapticDuration = useCallback((duration: number) => {
    if (isEnabled) {
      vibrate(duration);
    }
  }, [isEnabled]);

  const triggerHapticPattern = useCallback((pattern: VibrationPattern) => {
    if (isEnabled) {
      vibratePattern(pattern);
    }
  }, [isEnabled]);

  const enable = useCallback(() => {
    enableHaptic();
    setIsEnabled(true);
  }, []);

  const disable = useCallback(() => {
    disableHaptic();
    setIsEnabled(false);
    cancelVibration();
  }, []);

  return {
    isSupported,
    isEnabled,
    triggerHaptic,
    triggerHapticDuration,
    triggerHapticPattern,
    enable,
    disable,
  };
}
