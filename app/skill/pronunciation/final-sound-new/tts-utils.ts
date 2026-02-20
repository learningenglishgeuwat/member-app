let waitingVoicesPromise: Promise<void> | null = null;

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
  if (waitingVoicesPromise) return waitingVoicesPromise;

  waitingVoicesPromise = new Promise((resolve) => {
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      synth.removeEventListener('voiceschanged', onVoicesChanged);
      waitingVoicesPromise = null;
      resolve();
    };

    const onVoicesChanged = () => {
      if (synth.getVoices().length > 0) finish();
    };

    synth.addEventListener('voiceschanged', onVoicesChanged);
    synth.getVoices();
    window.setTimeout(finish, timeoutMs);
  });

  return waitingVoicesPromise;
}

export async function primeBestEnglishVoice() {
  await waitForVoices();
  getPreferredEnglishVoice();
}

export async function speakWithBestEnglishVoice(
  text: string,
  options?: { rate?: number; pitch?: number; volume?: number },
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  if (!text.trim()) return;

  const synth = window.speechSynthesis;
  await waitForVoices();

  synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-US';

  const preferredVoice = getPreferredEnglishVoice();
  if (preferredVoice) {
    utterance.voice = preferredVoice;
    utterance.lang = preferredVoice.lang;
  }

  utterance.rate = options?.rate ?? 0.82;
  utterance.pitch = options?.pitch ?? 1;
  utterance.volume = options?.volume ?? 1;
  synth.speak(utterance);
}
