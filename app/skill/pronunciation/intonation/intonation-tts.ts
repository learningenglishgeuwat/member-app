import { speakText, stopSpeech } from '@/lib/tts/speech';

export type IntonationPlaybackMode = 'model' | 'shadowing' | null;
export type IntonationPlaybackStatus = 'idle' | 'model' | 'listening' | 'shadowing' | 'continue';

export type IntonationPlaybackState = {
  isPlaying: boolean;
  mode: IntonationPlaybackMode;
  status: IntonationPlaybackStatus;
  activeIndex: number | null;
  currentText: string | null;
  countdown: number | null;
};

type OnStateChange = (state: IntonationPlaybackState) => void;

const SHADOWING_SECONDS = 3;

const IDLE_STATE: IntonationPlaybackState = {
  isPlaying: false,
  mode: null,
  status: 'idle',
  activeIndex: null,
  currentText: null,
  countdown: null,
};

export function createIntonationTtsPlayer(onStateChange: OnStateChange) {
  let runId = 0;

  const emit = (state: IntonationPlaybackState) => {
    onStateChange(state);
  };

  const toIdle = () => {
    emit(IDLE_STATE);
  };

  const stop = () => {
    runId += 1;
    stopSpeech();
    toIdle();
  };

  const speakLine = async (text: string, expectedRunId: number) => {
    if (!text.trim()) return;
    if (expectedRunId !== runId) return;

    await speakText(text, {
      preferredEnglish: 'en-US',
      rate: 0.82,
      pitch: 1,
      volume: 1,
      cancelBeforeSpeak: false,
    });
  };

  const waitMs = async (ms: number, expectedRunId: number) => {
    await new Promise<void>((resolve) => {
      window.setTimeout(() => resolve(), ms);
    });
    if (expectedRunId !== runId) return;
  };

  const playModel = async (sentences: string[]) => {
    const cleaned = sentences.map((line) => line.trim()).filter(Boolean);
    if (!cleaned.length) return;

    stop();
    const currentRunId = runId;

    for (let index = 0; index < cleaned.length; index += 1) {
      if (currentRunId !== runId) return;
      emit({
        isPlaying: true,
        mode: 'model',
        status: 'model',
        activeIndex: index,
        currentText: cleaned[index],
        countdown: null,
      });
      await speakLine(cleaned[index], currentRunId);
    }

    if (currentRunId === runId) toIdle();
  };

  const playShadowing = async (sentences: string[]) => {
    const cleaned = sentences.map((line) => line.trim()).filter(Boolean);
    if (!cleaned.length) return;

    stop();
    const currentRunId = runId;

    for (let index = 0; index < cleaned.length; index += 1) {
      if (currentRunId !== runId) return;

      emit({
        isPlaying: true,
        mode: 'shadowing',
        status: 'listening',
        activeIndex: index,
        currentText: cleaned[index],
        countdown: null,
      });
      await speakLine(cleaned[index], currentRunId);
      if (currentRunId !== runId) return;

      for (let second = SHADOWING_SECONDS; second >= 1; second -= 1) {
        emit({
          isPlaying: true,
          mode: 'shadowing',
          status: 'shadowing',
          activeIndex: index,
          currentText: cleaned[index],
          countdown: second,
        });
        await waitMs(1000, currentRunId);
        if (currentRunId !== runId) return;
      }

      emit({
        isPlaying: true,
        mode: 'shadowing',
        status: 'continue',
        activeIndex: index,
        currentText: cleaned[index],
        countdown: null,
      });
      await waitMs(500, currentRunId);
      if (currentRunId !== runId) return;
    }

    if (currentRunId === runId) toIdle();
  };

  const destroy = () => {
    stop();
  };

  toIdle();

  return {
    playModel,
    playShadowing,
    stop,
    destroy,
  };
}
