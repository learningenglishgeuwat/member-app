'use client';

import React from 'react';
import { Vibrate, Smartphone } from 'lucide-react';
import { useHaptic } from '@/lib/haptic/useHaptic';

export const HapticSettings: React.FC = () => {
  const { isSupported, isEnabled, enable, disable, triggerHaptic } = useHaptic();

  if (!isSupported) {
    return (
      <div className="bg-slate-900/50 border border-slate-700/50 p-4 sm:p-6 rounded-xl backdrop-blur-sm">
        <h2 className="text-base sm:text-xl font-semibold text-white mb-2 font-display">Haptic Feedback</h2>
        <div className="flex items-center gap-3 text-slate-400 bg-slate-800/50 p-3 rounded-lg">
          <Smartphone className="w-5 h-5" />
          <p className="text-xs sm:text-sm">Haptic feedback is not supported on your device or browser.</p>
        </div>
      </div>
    );
  }

  const handleToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      enable();
      // Use setTimeout to allow state to update and haptic to trigger
      setTimeout(() => triggerHaptic('success'), 50);
    } else {
      disable();
    }
  };

  return (
    <div className="bg-slate-900/50 border border-purple-500/20 p-4 sm:p-6 rounded-xl backdrop-blur-sm">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-base sm:text-xl font-semibold text-white mb-1 font-display flex items-center gap-2">
            <Vibrate className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400" />
            Haptic Feedback
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-sm">
            Enable tactile vibrations for buttons, cards, and interactions.
          </p>
        </div>
        
        <label className="relative inline-flex items-center cursor-pointer mt-1">
          <input 
            type="checkbox" 
            className="sr-only peer" 
            checked={isEnabled}
            onChange={handleToggle}
          />
          <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
        </label>
      </div>
    </div>
  );
};
