'use client';

import React from 'react';
import CustomSelect from '@/app/components/CustomSelect/CustomSelect';
import { useAudioAccent } from '@/app/contexts/AudioAccentContext';

type AudioAccent = 'en-US' | 'en-GB';

const ACCENT_OPTIONS = [
  { value: 'en-US' as AudioAccent, label: 'American (US)' },
  { value: 'en-GB' as AudioAccent, label: 'British (UK)' },
];

export const AudioAccentSelect: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { accent, setAccent } = useAudioAccent();

  const handleChange = (value: string) => {
    const next = value as AudioAccent;
    setAccent(next);
  };

  return (
    <CustomSelect
      options={ACCENT_OPTIONS}
      value={accent}
      onChange={handleChange}
      className={className}
    />
  );
};

export default AudioAccentSelect;
