import React, { useCallback, useEffect, useMemo, useState } from 'react';

export type SymbolDetailSectionState = {
  practice: boolean;
  tips: boolean;
  video: boolean;
  prompt: boolean;
  commonLetters: boolean;
};

export interface UseSymbolProgressParams {
  decodedSymbol: string;
}

export interface UseSymbolProgressResult {
  isProgressSaved: boolean;
  isPracticeOpen: boolean;
  isTipsOpen: boolean;
  isVideoOpen: boolean;
  shouldAutoplayVideo: boolean;
  isPromptOpen: boolean;
  isCommonLettersOpen: boolean;
  setIsPracticeOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsTipsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsVideoOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setShouldAutoplayVideo: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPromptOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCommonLettersOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSaveProgress: (percentage: number) => Promise<void>;
  handleUnsaveProgress: () => Promise<void>;
}

const PRONUNCIATION_PROGRESS_KEY = 'pronunciationProgress';
const DASHBOARD_PROGRESS_KEY = 'dashboardProgress';

const getStorageKey = (decodedSymbol: string) => {
  const normalizedSymbol = decodedSymbol.trim().toLowerCase();
  return `phoneticSymbolSectionState:${normalizedSymbol || 'default'}`;
};

const calculateAverage = (values: number[]) =>
  values.length > 0 ? Math.round(values.reduce((acc, value) => acc + value, 0) / values.length) : 0;

export const useSymbolProgress = ({ decodedSymbol }: UseSymbolProgressParams): UseSymbolProgressResult => {
  const [isProgressSaved, setIsProgressSaved] = useState(false);
  const [isPracticeOpen, setIsPracticeOpen] = useState(false);
  const [isTipsOpen, setIsTipsOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [shouldAutoplayVideo, setShouldAutoplayVideo] = useState(false);
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [isCommonLettersOpen, setIsCommonLettersOpen] = useState(false);
  const [isSectionStateHydrated, setIsSectionStateHydrated] = useState(false);
  const [isClient, setIsClient] = useState(false);

  const sectionStateStorageKey = useMemo(
    () => getStorageKey(decodedSymbol),
    [decodedSymbol],
  );

  useEffect(() => {
    setIsClient(true);

    if (typeof window === 'undefined') {
      return;
    }

    const savedProgress = JSON.parse(localStorage.getItem(PRONUNCIATION_PROGRESS_KEY) || '{}') as Record<string, number>;
    setIsProgressSaved(!!savedProgress[`phoneticSymbols_${decodedSymbol}`]);

    const rawSectionState = localStorage.getItem(sectionStateStorageKey);
    if (rawSectionState) {
      try {
        const sectionState = JSON.parse(rawSectionState) as SymbolDetailSectionState;
        setIsPracticeOpen(!!sectionState.practice);
        setIsTipsOpen(!!sectionState.tips);
        setIsVideoOpen(!!sectionState.video);
        setShouldAutoplayVideo(false);
        setIsPromptOpen(!!sectionState.prompt);
        setIsCommonLettersOpen(!!sectionState.commonLetters);
      } catch {
        setIsPracticeOpen(false);
        setIsTipsOpen(false);
        setIsVideoOpen(false);
        setShouldAutoplayVideo(false);
        setIsPromptOpen(false);
        setIsCommonLettersOpen(false);
      }
    } else {
      setIsPracticeOpen(false);
      setIsTipsOpen(false);
      setIsVideoOpen(false);
      setShouldAutoplayVideo(false);
      setIsPromptOpen(false);
      setIsCommonLettersOpen(false);
    }

    setIsSectionStateHydrated(true);
  }, [decodedSymbol, sectionStateStorageKey]);

  useEffect(() => {
    if (typeof window === 'undefined' || !isSectionStateHydrated) return;

    const nextSectionState: SymbolDetailSectionState = {
      practice: isPracticeOpen,
      tips: isTipsOpen,
      video: isVideoOpen,
      prompt: isPromptOpen,
      commonLetters: isCommonLettersOpen,
    };

    localStorage.setItem(sectionStateStorageKey, JSON.stringify(nextSectionState));
  }, [
    isPracticeOpen,
    isTipsOpen,
    isVideoOpen,
    isPromptOpen,
    isCommonLettersOpen,
    isSectionStateHydrated,
    sectionStateStorageKey,
  ]);

  const syncDashboardProgress = (progress: Record<string, number>) => {
    const phoneticSymbolKeys = Object.keys(progress).filter(key => key.startsWith('phoneticSymbols_'));
    const phoneticSymbolProgress = phoneticSymbolKeys.map(key => progress[key]);
    const averagePhoneticProgress = calculateAverage(phoneticSymbolProgress);

    const allProgress = Object.values(progress) as number[];
    const overallAverageProgress = calculateAverage(allProgress);

    const dashboardProgress = JSON.parse(localStorage.getItem(DASHBOARD_PROGRESS_KEY) || '{}') as Record<string, number>;
    dashboardProgress.pronunciation = overallAverageProgress;
    dashboardProgress.phoneticSymbols = averagePhoneticProgress;
    localStorage.setItem(DASHBOARD_PROGRESS_KEY, JSON.stringify(dashboardProgress));
  };

  const handleSaveProgress = useCallback(async (percentage: number) => {
    setIsProgressSaved(true);

    if (typeof window === 'undefined' || !isClient) return;

    const currentProgress = JSON.parse(localStorage.getItem(PRONUNCIATION_PROGRESS_KEY) || '{}') as Record<string, number>;
    currentProgress[`phoneticSymbols_${decodedSymbol}`] = percentage;
    localStorage.setItem(PRONUNCIATION_PROGRESS_KEY, JSON.stringify(currentProgress));

    syncDashboardProgress(currentProgress);
    console.log(`Symbol /${decodedSymbol}/ progress saved: ${percentage}%`);
  }, [decodedSymbol, isClient]);

  const handleUnsaveProgress = useCallback(async () => {
    setIsProgressSaved(false);

    if (typeof window === 'undefined' || !isClient) return;

    const currentProgress = JSON.parse(localStorage.getItem(PRONUNCIATION_PROGRESS_KEY) || '{}') as Record<string, number>;
    delete currentProgress[`phoneticSymbols_${decodedSymbol}`];
    localStorage.setItem(PRONUNCIATION_PROGRESS_KEY, JSON.stringify(currentProgress));

    syncDashboardProgress(currentProgress);
    console.log(`Symbol /${decodedSymbol}/ progress removed`);
  }, [decodedSymbol, isClient]);

  return {
    isProgressSaved,
    isPracticeOpen,
    isTipsOpen,
    isVideoOpen,
    shouldAutoplayVideo,
    isPromptOpen,
    isCommonLettersOpen,
    setIsPracticeOpen,
    setIsTipsOpen,
    setIsVideoOpen,
    setShouldAutoplayVideo,
    setIsPromptOpen,
    setIsCommonLettersOpen,
    handleSaveProgress,
    handleUnsaveProgress,
  };
};
