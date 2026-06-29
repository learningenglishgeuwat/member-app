import { useEffect, useRef } from 'react';
import {
  isSpeechSynthesisSupported,
  speakTextWithPause,
  stopSpeech,
  waitForVoices,
} from '@/lib/tts/speech';
import type { WordExample } from '../../data/wordExamples/wordExamples';

export interface BritishNoteItem {
  word: string;
  britishIpa: string;
  americanIpa: string;
}

export interface BritishNoteData {
  items: BritishNoteItem[];
}

export interface UseSymbolPlaybackParams {
  symbolData: { examples: WordExample[] };
  britishNote: BritishNoteData | null;
  commonLettersExamples: string[];
  isPlayingAll: boolean;
  isPlayingAllBritishNotes: boolean;
  isPlayingAllCommonLetters: boolean;
  setIsPlayingAll: (value: boolean) => void;
  setIsPlayingAllBritishNotes: (value: boolean) => void;
  setIsPlayingAllCommonLetters: (value: boolean) => void;
  setActiveWord: (value: string | null) => void;
  setActiveWordIndex: (value: number | null) => void;
}

const BETWEEN_PLAY_ALL_WORDS_MS = 220;

export const useSymbolPlayback = ({
  symbolData,
  britishNote,
  commonLettersExamples,
  isPlayingAll,
  isPlayingAllBritishNotes,
  isPlayingAllCommonLetters,
  setIsPlayingAll,
  setIsPlayingAllBritishNotes,
  setIsPlayingAllCommonLetters,
  setActiveWord,
  setActiveWordIndex,
}: UseSymbolPlaybackParams) => {
  const wordCardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const britishNoteItemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const playSessionRef = useRef(0);
  const playNextTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    void waitForVoices();

    return () => {
      playSessionRef.current += 1;
      if (playNextTimeoutRef.current) {
        window.clearTimeout(playNextTimeoutRef.current);
        playNextTimeoutRef.current = null;
      }
      setIsPlayingAll(false);
      setIsPlayingAllBritishNotes(false);
      setIsPlayingAllCommonLetters(false);
      setActiveWord(null);
      setActiveWordIndex(null);
      stopSpeech();
    };
  }, [setActiveWord, setActiveWordIndex, setIsPlayingAll, setIsPlayingAllBritishNotes, setIsPlayingAllCommonLetters]);

  const stopPlayAllWords = () => {
    playSessionRef.current += 1;
    if (playNextTimeoutRef.current) {
      window.clearTimeout(playNextTimeoutRef.current);
      playNextTimeoutRef.current = null;
    }
    stopSpeech();
    setIsPlayingAll(false);
    setIsPlayingAllBritishNotes(false);
    setIsPlayingAllCommonLetters(false);
    setActiveWord(null);
    setActiveWordIndex(null);
  };

  const handlePlayAllWords = () => {
    if (!isSpeechSynthesisSupported() || symbolData.examples.length === 0) return;

    if (isPlayingAll) {
      stopPlayAllWords();
      return;
    }

    stopPlayAllWords();
    const currentSession = playSessionRef.current;
    setIsPlayingAll(true);

    void (async () => {
      for (let currentIndex = 0; currentIndex < symbolData.examples.length; currentIndex++) {
        if (currentSession !== playSessionRef.current) return;

        const example = symbolData.examples[currentIndex];
        setActiveWord(example.word);
        setActiveWordIndex(currentIndex);

        if (wordCardRefs.current[currentIndex]) {
          wordCardRefs.current[currentIndex]?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center',
          });
        }

        await speakTextWithPause(example.word, {
          preferredEnglish: 'en-US',
          rate: 0.86,
          pitch: 1,
          volume: 1,
        });

        if (currentSession !== playSessionRef.current) return;

        await new Promise<void>((resolve) => {
          playNextTimeoutRef.current = window.setTimeout(() => {
            playNextTimeoutRef.current = null;
            resolve();
          }, BETWEEN_PLAY_ALL_WORDS_MS);
        });
      }

      if (currentSession === playSessionRef.current) {
        setIsPlayingAll(false);
        setActiveWord(null);
        setActiveWordIndex(null);
      }
    })();
  };

  const handlePlayAllBritishNotes = () => {
    if (!isSpeechSynthesisSupported() || !britishNote || britishNote.items.length === 0) return;

    if (isPlayingAllBritishNotes) {
      stopPlayAllWords();
      return;
    }

    stopPlayAllWords();
    const currentSession = playSessionRef.current;
    setIsPlayingAllBritishNotes(true);

    void (async () => {
      for (let currentIndex = 0; currentIndex < britishNote.items.length; currentIndex++) {
        if (currentSession !== playSessionRef.current) return;

        const item = britishNote.items[currentIndex];
        setActiveWord(item.word);
        setActiveWordIndex(null);

        if (britishNoteItemRefs.current[currentIndex]) {
          britishNoteItemRefs.current[currentIndex]?.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center',
          });
        }

        await speakTextWithPause(item.word, {
          preferredEnglish: 'en-GB',
          rate: 0.86,
          pitch: 1,
          volume: 1,
        });

        if (currentSession !== playSessionRef.current) return;
        await new Promise<void>((resolve) => {
          playNextTimeoutRef.current = window.setTimeout(() => {
            playNextTimeoutRef.current = null;
            resolve();
          }, 400);
        });

        if (currentSession !== playSessionRef.current) return;
        await speakTextWithPause(item.word, {
          preferredEnglish: 'en-US',
          rate: 0.86,
          pitch: 1,
          volume: 1,
        });

        if (currentSession !== playSessionRef.current) return;
        if (currentIndex < britishNote.items.length - 1) {
          await new Promise<void>((resolve) => {
            playNextTimeoutRef.current = window.setTimeout(() => {
              playNextTimeoutRef.current = null;
              resolve();
            }, 800);
          });
        }
      }

      if (currentSession === playSessionRef.current) {
        setIsPlayingAllBritishNotes(false);
        setActiveWord(null);
        setActiveWordIndex(null);
      }
    })();
  };

  const handlePlayAllCommonLetters = () => {
    if (!isSpeechSynthesisSupported() || commonLettersExamples.length === 0) return;

    if (isPlayingAllCommonLetters) {
      stopPlayAllWords();
      return;
    }

    stopPlayAllWords();
    const currentSession = playSessionRef.current;
    setIsPlayingAllCommonLetters(true);

    void (async () => {
      for (let currentIndex = 0; currentIndex < commonLettersExamples.length; currentIndex++) {
        if (currentSession !== playSessionRef.current) return;

        const word = commonLettersExamples[currentIndex];
        
        const cards = document.querySelectorAll('.common-letter-example-card');
        if (cards[currentIndex]) {
          const el = cards[currentIndex] as HTMLElement;
          el.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center',
          });
          
          // Temporary highlight
          const originalBg = el.style.backgroundColor;
          const originalBorder = el.style.borderColor;
          el.style.backgroundColor = 'rgba(168, 85, 247, 0.2)';
          el.style.borderColor = 'rgba(168, 85, 247, 0.5)';
          
          setTimeout(() => {
            el.style.backgroundColor = originalBg;
            el.style.borderColor = originalBorder;
          }, 800);
        }

        await speakTextWithPause(word, {
          preferredEnglish: 'en-US',
          rate: 0.86,
          pitch: 1,
          volume: 1,
        });

        if (currentSession !== playSessionRef.current) return;

        await new Promise<void>((resolve) => {
          playNextTimeoutRef.current = window.setTimeout(() => {
            playNextTimeoutRef.current = null;
            resolve();
          }, BETWEEN_PLAY_ALL_WORDS_MS);
        });
      }

      if (currentSession === playSessionRef.current) {
        setIsPlayingAllCommonLetters(false);
      }
    })();
  };

  const handlePlayWord = (word: string, wordIndex?: number) => {
    if (!isSpeechSynthesisSupported()) return;

    stopPlayAllWords();
    stopSpeech();
    setActiveWord(word);
    setActiveWordIndex(typeof wordIndex === 'number' ? wordIndex : null);

    const currentSession = playSessionRef.current;
    void (async () => {
      await speakTextWithPause(word, {
        preferredEnglish: 'en-US',
        rate: 0.86,
        pitch: 1,
        volume: 1,
      });

      if (currentSession !== playSessionRef.current) return;
      setActiveWord(null);
      setActiveWordIndex(null);
    })();
  };

  const handlePlayBritishNoteWord = (word: string, itemIndex?: number) => {
    if (!isSpeechSynthesisSupported()) return;

    stopPlayAllWords();
    stopSpeech();
    setActiveWord(word);
    setActiveWordIndex(null);

    if (typeof itemIndex === 'number' && britishNoteItemRefs.current[itemIndex]) {
      britishNoteItemRefs.current[itemIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
    }

    const currentSession = playSessionRef.current;
    void (async () => {
      await speakTextWithPause(word, {
        preferredEnglish: 'en-GB',
        rate: 0.86,
        pitch: 1,
        volume: 1,
      });

      if (currentSession !== playSessionRef.current) return;
      setActiveWord(null);
      setActiveWordIndex(null);
    })();
  };

  const handlePlayAmericanNoteWord = (word: string, itemIndex?: number) => {
    if (!isSpeechSynthesisSupported()) return;

    stopPlayAllWords();
    stopSpeech();
    setActiveWord(word);
    setActiveWordIndex(null);

    if (typeof itemIndex === 'number' && britishNoteItemRefs.current[itemIndex]) {
      britishNoteItemRefs.current[itemIndex]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
      });
    }

    const currentSession = playSessionRef.current;
    void (async () => {
      await speakTextWithPause(word, {
        preferredEnglish: 'en-US',
        rate: 0.86,
        pitch: 1,
        volume: 1,
      });

      if (currentSession !== playSessionRef.current) return;
      setActiveWord(null);
      setActiveWordIndex(null);
    })();
  };

  return {
    wordCardRefs,
    britishNoteItemRefs,
    stopPlayAllWords,
    handlePlayAllWords,
    handlePlayAllBritishNotes,
    handlePlayAllCommonLetters,
    handlePlayWord,
    handlePlayBritishNoteWord,
    handlePlayAmericanNoteWord,
  };
};
