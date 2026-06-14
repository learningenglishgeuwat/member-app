import React, { useEffect, useRef, useState } from 'react';
import type { WordExample } from '../../data/wordExamples/wordExamples';

export interface UseClipboardCopyParams {
  symbolData: { examples: WordExample[] };
  accentEvaluationPrompt: string;
}

export interface UseClipboardCopyResult {
  isPromptCopied: boolean;
  isWordExamplesCopied: boolean;
  isMissionCopied: boolean;
  handleCopyMission: () => Promise<void>;
  handleCopyPrompt: () => Promise<void>;
  handleCopyWordExamples: () => Promise<void>;
}

export const useClipboardCopy = ({ symbolData, accentEvaluationPrompt }: UseClipboardCopyParams): UseClipboardCopyResult => {
  const [isPromptCopied, setIsPromptCopied] = useState(false);
  const [isWordExamplesCopied, setIsWordExamplesCopied] = useState(false);
  const [isMissionCopied, setIsMissionCopied] = useState(false);

  const promptCopyTimeoutRef = useRef<number | null>(null);
  const wordExamplesCopyTimeoutRef = useRef<number | null>(null);
  const missionCopyTimeoutRef = useRef<number | null>(null);

  const handleCopyMission = async () => {
    if (typeof window === 'undefined' || !navigator?.clipboard?.writeText) {
      return;
    }

    const words = symbolData.examples
      .map(example => example.word?.trim())
      .filter((word): word is string => !!word);

    if (words.length === 0) {
      return;
    }

    const textToCopy = `Kata:\n${words.join(', ')}\n\nPrompt:\n${accentEvaluationPrompt}`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsMissionCopied(true);
      if (missionCopyTimeoutRef.current) {
        window.clearTimeout(missionCopyTimeoutRef.current);
      }
      missionCopyTimeoutRef.current = window.setTimeout(() => {
        setIsMissionCopied(false);
      }, 1800);
    } catch (error) {
      console.error('Failed to copy mission:', error);
      setIsMissionCopied(false);
    }
  };

  const handleCopyPrompt = async () => {
    if (typeof window === 'undefined' || !navigator?.clipboard?.writeText) {
      return;
    }

    try {
      await navigator.clipboard.writeText(accentEvaluationPrompt);
      setIsPromptCopied(true);
      if (promptCopyTimeoutRef.current) {
        window.clearTimeout(promptCopyTimeoutRef.current);
      }
      promptCopyTimeoutRef.current = window.setTimeout(() => {
        setIsPromptCopied(false);
      }, 1800);
    } catch (error) {
      console.error('Failed to copy prompt:', error);
      setIsPromptCopied(false);
    }
  };

  const handleCopyWordExamples = async () => {
    if (typeof window === 'undefined' || !navigator?.clipboard?.writeText) {
      return;
    }

    const words = symbolData.examples
      .map(example => example.word?.trim())
      .filter((word): word is string => !!word);

    if (words.length === 0) {
      return;
    }

    try {
      await navigator.clipboard.writeText(words.join(', '));
      setIsWordExamplesCopied(true);
      if (wordExamplesCopyTimeoutRef.current) {
        window.clearTimeout(wordExamplesCopyTimeoutRef.current);
      }
      wordExamplesCopyTimeoutRef.current = window.setTimeout(() => {
        setIsWordExamplesCopied(false);
      }, 1800);
    } catch (error) {
      console.error('Failed to copy word examples:', error);
      setIsWordExamplesCopied(false);
    }
  };

  useEffect(() => {
    return () => {
      if (promptCopyTimeoutRef.current) {
        window.clearTimeout(promptCopyTimeoutRef.current);
      }
      if (wordExamplesCopyTimeoutRef.current) {
        window.clearTimeout(wordExamplesCopyTimeoutRef.current);
      }
      if (missionCopyTimeoutRef.current) {
        window.clearTimeout(missionCopyTimeoutRef.current);
      }
    };
  }, []);

  return {
    isPromptCopied,
    isWordExamplesCopied,
    isMissionCopied,
    handleCopyMission,
    handleCopyPrompt,
    handleCopyWordExamples,
  };
};
