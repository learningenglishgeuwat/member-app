import { useEffect, useMemo, useRef, useState } from 'react';
import { loadPairsByCategory } from '../data/index';
import type { MinimalPairCategory, MinimalPairData, MinimalPairSpeechLang, MinimalPairWord } from '../types';

type SpeechLang = MinimalPairSpeechLang;

const readSavedState = (pairId: string): boolean => {
  if (typeof window === 'undefined' || !pairId) return false;
  const progress = JSON.parse(localStorage.getItem('pronunciationProgress') || '{}') as Record<string, number>;
  return Boolean(progress[`minimalPairs_${pairId}`]);
};

export const useMinimalPairs = () => {
  const [selectedCategory, setSelectedCategory] = useState<MinimalPairCategory>('vowel');
  const [pairsInCategory, setPairsInCategory] = useState<MinimalPairData[]>([]);
  const [selectedPairId, setSelectedPairId] = useState<string>('');
  const [activeSpeechKey, setActiveSpeechKey] = useState<string | null>(null);
  const [isPlayingWords, setIsPlayingWords] = useState(false);
  const [isPlayingSentences, setIsPlayingSentences] = useState(false);
  const [isProgressSaved, setIsProgressSaved] = useState<boolean>(false);
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  const speechElementRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const playbackSessionRef = useRef(0);

  const selectedPair = useMemo(
    () => pairsInCategory.find((pair) => pair.id === selectedPairId),
    [pairsInCategory, selectedPairId],
  );

  const cancelSpeechSynthesis = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };

  const stopPlayback = () => {
    playbackSessionRef.current += 1;
    cancelSpeechSynthesis();
    setActiveSpeechKey(null);
    setIsPlayingWords(false);
    setIsPlayingSentences(false);
  };

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.speechSynthesis.getVoices();
    const onVoicesChanged = () => window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = onVoicesChanged;

    return () => {
      cancelSpeechSynthesis();
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const loadCategory = async () => {
      setIsCategoryLoading(true);
      const loadedPairs = await loadPairsByCategory(selectedCategory);
      if (cancelled) return;
      setPairsInCategory(loadedPairs);
      const firstPairId = loadedPairs[0]?.id ?? '';
      setSelectedPairId(firstPairId);
      setIsProgressSaved(readSavedState(firstPairId));
      setIsCategoryLoading(false);
    };
    loadCategory();
    return () => {
      cancelled = true;
    };
  }, [selectedCategory]);

  const getPreferredVoice = (lang: SpeechLang) => {
    if (typeof window === 'undefined') return null;
    const voices = window.speechSynthesis.getVoices();
    if (lang === 'id-ID') {
      return (
        voices.find((voice) => voice.name.toLowerCase().includes('indonesian')) ||
        voices.find((voice) => voice.lang.toLowerCase().startsWith('id')) ||
        null
      );
    }
    if (lang === 'en-GB') {
      return (
        voices.find((voice) => voice.name === 'Google UK English Female') ||
        voices.find((voice) => voice.name === 'Google UK English Male') ||
        voices.find((voice) => voice.lang === 'en-GB' && voice.name.includes('Google')) ||
        voices.find((voice) => voice.lang === 'en-GB') ||
        null
      );
    }
    return (
      voices.find((voice) => voice.name === 'Google US English') ||
      voices.find((voice) => voice.lang === 'en-US' && voice.name.includes('Google')) ||
      voices.find((voice) => voice.lang === 'en-US' && voice.name.includes('Samantha')) ||
      voices.find((voice) => voice.lang === 'en-US' && voice.name.includes('Zira')) ||
      voices.find((voice) => voice.lang === 'en-US') ||
      null
    );
  };

  const speakText = (text: string, speechKey: string, lang: SpeechLang = 'en-US') => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window) || !text) return;
    window.speechSynthesis.cancel();
    setIsPlayingWords(false);
    setIsPlayingSentences(false);
    setActiveSpeechKey(speechKey);

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.82;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.lang = lang;

    const voice = getPreferredVoice(lang);
    if (voice) utterance.voice = voice;

    utterance.onend = () => setActiveSpeechKey(null);
    utterance.onerror = () => setActiveSpeechKey(null);
    window.speechSynthesis.speak(utterance);
  };

  const registerSpeechElement = (key: string, element: HTMLButtonElement | null) => {
    if (!element) {
      speechElementRefs.current.delete(key);
      return;
    }
    speechElementRefs.current.set(key, element);
  };

  const scrollToSpeechKey = (key: string) => {
    const target = speechElementRefs.current.get(key);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
  };

  const playQueue = async (items: Array<{ text: string; key: string; lang: SpeechLang }>, done: () => void) => {
    if (typeof window === 'undefined' || !items.length) return;
    window.speechSynthesis.cancel();
    const sessionId = playbackSessionRef.current;

    let index = 0;
    const playNext = () => {
      if (sessionId !== playbackSessionRef.current) return;
      if (index >= items.length) {
        setActiveSpeechKey(null);
        done();
        return;
      }
      const current = items[index];
      setActiveSpeechKey(current.key);
      scrollToSpeechKey(current.key);

      const utterance = new SpeechSynthesisUtterance(current.text);
      utterance.rate = 0.82;
      utterance.pitch = 1;
      utterance.volume = 1;
      utterance.lang = current.lang;
      const voice = getPreferredVoice(current.lang);
      if (voice) utterance.voice = voice;

      utterance.onend = () => {
        if (sessionId !== playbackSessionRef.current) return;
        index += 1;
        window.setTimeout(playNext, 260);
      };
      utterance.onerror = () => {
        if (sessionId !== playbackSessionRef.current) return;
        index += 1;
        window.setTimeout(playNext, 260);
      };

      window.speechSynthesis.speak(utterance);
    };

    playNext();
  };

  const findWholeWordStart = (sentence: string, targetWord: string): number => {
    if (!sentence || !targetWord) return -1;
    const source = sentence.toLowerCase();
    const target = targetWord.toLowerCase();
    let cursor = 0;
    while (cursor < source.length) {
      const index = source.indexOf(target, cursor);
      if (index === -1) return -1;
      const before = index === 0 ? '' : sentence[index - 1];
      const after = index + target.length >= sentence.length ? '' : sentence[index + target.length];
      const validBefore = !before || !/[A-Za-z]/.test(before);
      const validAfter = !after || !/[A-Za-z]/.test(after);
      if (validBefore && validAfter) return index;
      cursor = index + 1;
    }
    return -1;
  };

  const findMatchedWordItemInSentence = (
    sentence: string,
    side: 'a' | 'b',
    words: MinimalPairWord[],
  ): MinimalPairWord | undefined =>
    words.find((wordItem) => {
      const candidate = side === 'a' ? wordItem.a : wordItem.b;
      return findWholeWordStart(sentence, candidate) !== -1;
    });

  const handlePlayAllWords = () => {
    if (!selectedPair) return;
    playbackSessionRef.current += 1;
    const useIndonesianOnB = selectedPair.id === 'diphthong-er-r';
    if (isPlayingWords) {
      stopPlayback();
      return;
    }
    if (isPlayingSentences) stopPlayback();

    setIsPlayingWords(true);
    const isTwoColumnWordsLayout =
      typeof window !== 'undefined' ? !window.matchMedia('(max-width: 860px)').matches : false;
    const orderedWordIndexes = isTwoColumnWordsLayout
      ? [
          ...selectedPair.words.map((_, index) => index).filter((index) => index % 2 === 0),
          ...selectedPair.words.map((_, index) => index).filter((index) => index % 2 !== 0),
        ]
      : selectedPair.words.map((_, index) => index);

    const queue = orderedWordIndexes.flatMap((wordIndex) => {
      const item = selectedPair.words[wordIndex];
      return [
        { text: item.ttsA ?? item.a, key: `word-${wordIndex}-a`, lang: item.ttsLangA ?? ('en-US' as SpeechLang) },
        {
          text: item.ttsB ?? item.b,
          key: `word-${wordIndex}-b`,
          lang: item.ttsLangB ?? (useIndonesianOnB ? ('id-ID' as SpeechLang) : ('en-US' as SpeechLang)),
        },
      ];
    });
    playQueue(queue, () => setIsPlayingWords(false));
  };

  const handlePlayAllSentences = () => {
    if (!selectedPair) return;
    playbackSessionRef.current += 1;
    const useIndonesianOnB = selectedPair.id === 'diphthong-er-r';
    if (isPlayingSentences) {
      stopPlayback();
      return;
    }
    if (isPlayingWords) stopPlayback();

    setIsPlayingSentences(true);
    const queue = selectedPair.sentences.flatMap((item, index) => {
      const matchedA = findMatchedWordItemInSentence(item.a, 'a', selectedPair.words);
      const matchedB = findMatchedWordItemInSentence(item.b, 'b', selectedPair.words);
      return [
        { text: item.a, key: `sentence-${index}-a`, lang: matchedA?.ttsLangA ?? ('en-US' as SpeechLang) },
        {
          text: item.b,
          key: `sentence-${index}-b`,
          lang: matchedB?.ttsLangB ?? (useIndonesianOnB ? ('id-ID' as SpeechLang) : ('en-US' as SpeechLang)),
        },
      ];
    });
    playQueue(queue, () => setIsPlayingSentences(false));
  };

  const handleSaveProgress = async (percentage: number) => {
    if (typeof window === 'undefined' || !selectedPair) return;
    const currentProgress = JSON.parse(localStorage.getItem('pronunciationProgress') || '{}') as Record<string, number>;
    currentProgress[`minimalPairs_${selectedPair.id}`] = percentage;
    localStorage.setItem('pronunciationProgress', JSON.stringify(currentProgress));

    const minimalPairKeys = Object.keys(currentProgress).filter((key) => key.startsWith('minimalPairs_'));
    const minimalPairProgress = minimalPairKeys.map((key) => currentProgress[key]);
    const minimalPairAverage = minimalPairProgress.length
      ? Math.round(minimalPairProgress.reduce((acc, value) => acc + value, 0) / minimalPairProgress.length)
      : 0;

    const allPronunciationProgress = Object.values(currentProgress);
    const pronunciationAverage = allPronunciationProgress.length
      ? Math.round(allPronunciationProgress.reduce((acc, value) => acc + value, 0) / allPronunciationProgress.length)
      : 0;

    const dashboardProgress = JSON.parse(localStorage.getItem('dashboardProgress') || '{}') as Record<string, number>;
    dashboardProgress.minimalPairs = minimalPairAverage;
    dashboardProgress.pronunciation = pronunciationAverage;
    localStorage.setItem('dashboardProgress', JSON.stringify(dashboardProgress));
    setIsProgressSaved(true);
  };

  const handleUnsaveProgress = async () => {
    if (typeof window === 'undefined' || !selectedPair) return;
    const currentProgress = JSON.parse(localStorage.getItem('pronunciationProgress') || '{}') as Record<string, number>;
    delete currentProgress[`minimalPairs_${selectedPair.id}`];
    localStorage.setItem('pronunciationProgress', JSON.stringify(currentProgress));

    const minimalPairKeys = Object.keys(currentProgress).filter((key) => key.startsWith('minimalPairs_'));
    const minimalPairProgress = minimalPairKeys.map((key) => currentProgress[key]);
    const minimalPairAverage = minimalPairProgress.length
      ? Math.round(minimalPairProgress.reduce((acc, value) => acc + value, 0) / minimalPairProgress.length)
      : 0;

    const allPronunciationProgress = Object.values(currentProgress);
    const pronunciationAverage = allPronunciationProgress.length
      ? Math.round(allPronunciationProgress.reduce((acc, value) => acc + value, 0) / allPronunciationProgress.length)
      : 0;

    const dashboardProgress = JSON.parse(localStorage.getItem('dashboardProgress') || '{}') as Record<string, number>;
    dashboardProgress.minimalPairs = minimalPairAverage;
    dashboardProgress.pronunciation = pronunciationAverage;
    localStorage.setItem('dashboardProgress', JSON.stringify(dashboardProgress));
    setIsProgressSaved(false);
  };

  const handleCategoryChange = (nextCategory: MinimalPairCategory) => {
    stopPlayback();
    setSelectedCategory(nextCategory);
  };

  const handlePairChange = (nextPairId: string) => {
    stopPlayback();
    setSelectedPairId(nextPairId);
    setIsProgressSaved(readSavedState(nextPairId));
  };

  return {
    activeSpeechKey,
    handleCategoryChange,
    handlePairChange,
    handlePlayAllSentences,
    handlePlayAllWords,
    handleSaveProgress,
    handleUnsaveProgress,
    isCategoryLoading,
    isPlayingSentences,
    isPlayingWords,
    isProgressSaved,
    pairsInCategory,
    registerSpeechElement,
    selectedCategory,
    selectedPair,
    selectedPairId,
    speakText,
    stopPlayback,
  };
};
