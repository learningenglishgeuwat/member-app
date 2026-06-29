'use client';

import React, { createContext, useContext, useState, type ReactNode } from 'react';

type AudioAccent = 'en-US' | 'en-GB';

interface AudioAccentContextValue {
  accent: AudioAccent;
  setAccent: (accent: AudioAccent) => void;
}

const AudioAccentContext = createContext<AudioAccentContextValue | undefined>(undefined);

const STORAGE_KEY = 'geuwat:audio-accent';

const getInitialAccent = (): AudioAccent => {
  if (typeof window === 'undefined') return 'en-US';
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'en-US' || stored === 'en-GB') return stored;
  } catch {
    // ignore
  }
  return 'en-US';
};

export function AudioAccentProvider({ children }: { children: ReactNode }) {
  const [accent, setAccent] = useState<AudioAccent>(getInitialAccent);

  const handleSetAccent = (next: AudioAccent) => {
    setAccent(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  };

  return (
    <AudioAccentContext.Provider value={{ accent, setAccent: handleSetAccent }}>
      {children}
    </AudioAccentContext.Provider>
  );
}

export function useAudioAccent(): AudioAccentContextValue {
  const context = useContext(AudioAccentContext);
  if (!context) {
    return { accent: 'en-US', setAccent: () => {} };
  }
  return context;
}