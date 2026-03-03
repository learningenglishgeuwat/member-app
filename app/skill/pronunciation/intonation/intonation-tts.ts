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

function getPreferredEnglishVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;

  return (
    voices.find((voice) => voice.name === 'Google US English') ||
    voices.find((voice) => voice.lang === 'en-US' && voice.name.includes('Google')) ||
    voices.find((voice) => voice.lang === 'en-US' && voice.name.includes('Samantha')) ||
    voices.find((voice) => voice.lang === 'en-US' && voice.name.includes('Zira')) ||
    voices.find((voice) => voice.lang === 'en-US') ||
    voices.find((voice) => voice.lang.toLowerCase().startsWith('en')) ||
    null
  );
}

function waitForVoices(timeoutMs = 1500): Promise<void> {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return Promise.resolve();

  const synth = window.speechSynthesis;
  if (synth.getVoices().length > 0) return Promise.resolve();

  return new Promise((resolve) => {
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      synth.removeEventListener('voiceschanged', onVoicesChanged);
      resolve();
    };

    const onVoicesChanged = () => {
      if (synth.getVoices().length > 0) finish();
    };

    synth.addEventListener('voiceschanged', onVoicesChanged);
    synth.getVoices();
    window.setTimeout(finish, timeoutMs);
  });
}

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
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    toIdle();
  };

  const speakText = async (text: string, expectedRunId: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (!text.trim()) return;
    if (expectedRunId !== runId) return;

    const synth = window.speechSynthesis;
    await waitForVoices();
    if (expectedRunId !== runId) return;

    await new Promise<void>((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.82;
      utterance.pitch = 1;
      utterance.volume = 1;

      const preferredVoice = getPreferredEnglishVoice();
      if (preferredVoice) {
        utterance.voice = preferredVoice;
        utterance.lang = preferredVoice.lang;
      }

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();
      synth.speak(utterance);
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
      await speakText(cleaned[index], currentRunId);
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
      await speakText(cleaned[index], currentRunId);
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
