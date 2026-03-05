import {
  createUtterance,
  pickPreferredEnglishVoice,
  speakText,
  waitForVoices,
} from './speech';

type MockVoice = Pick<SpeechSynthesisVoice, 'name' | 'lang'>;

class MockSpeechSynthesisUtterance {
  readonly text: string;
  lang = '';
  pitch = 1;
  rate = 1;
  volume = 1;
  voice: SpeechSynthesisVoice | null = null;
  onstart: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => unknown) | null = null;
  onend: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => unknown) | null = null;
  onerror:
    | ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisErrorEvent) => unknown)
    | null = null;
  onpause: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => unknown) | null = null;
  onresume: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => unknown) | null = null;
  onmark: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => unknown) | null = null;
  onboundary: ((this: SpeechSynthesisUtterance, ev: SpeechSynthesisEvent) => unknown) | null = null;
  uri = '';

  constructor(text: string) {
    this.text = text;
  }
}

type SpeechSynthesisMock = {
  getVoices: jest.Mock<SpeechSynthesisVoice[], []>;
  addEventListener: jest.Mock<void, ['voiceschanged', EventListener]>;
  removeEventListener: jest.Mock<void, ['voiceschanged', EventListener]>;
  cancel: jest.Mock<void, []>;
  speak: jest.Mock<void, [SpeechSynthesisUtterance]>;
  setVoices: (voices: MockVoice[]) => void;
  emitVoicesChanged: () => void;
};

function createSpeechSynthesisMock(initialVoices: MockVoice[] = []): SpeechSynthesisMock {
  let voices = initialVoices as SpeechSynthesisVoice[];
  const listeners = new Set<EventListener>();

  return {
    getVoices: jest.fn(() => voices),
    addEventListener: jest.fn((event, listener) => {
      if (event === 'voiceschanged') {
        listeners.add(listener);
      }
    }),
    removeEventListener: jest.fn((event, listener) => {
      if (event === 'voiceschanged') {
        listeners.delete(listener);
      }
    }),
    cancel: jest.fn(),
    speak: jest.fn((utterance) => {
      window.setTimeout(() => {
        utterance.onend?.({} as SpeechSynthesisEvent);
      }, 0);
    }),
    setVoices: (nextVoices) => {
      voices = nextVoices as SpeechSynthesisVoice[];
    },
    emitVoicesChanged: () => {
      listeners.forEach((listener) => listener(new Event('voiceschanged')));
    },
  };
}

function setupSpeechEnvironment(synth: SpeechSynthesisMock) {
  Object.defineProperty(window, 'SpeechSynthesisUtterance', {
    configurable: true,
    writable: true,
    value: MockSpeechSynthesisUtterance,
  });

  Object.defineProperty(window, 'speechSynthesis', {
    configurable: true,
    writable: true,
    value: synth,
  });
}

describe('lib/tts/speech', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('keeps explicit lang override and does not force en-US', () => {
    const synth = createSpeechSynthesisMock([
      { name: 'Google US English', lang: 'en-US' },
    ]);
    setupSpeechEnvironment(synth);

    const utterance = createUtterance('Halo', { lang: 'id-ID' });
    expect(utterance).not.toBeNull();
    expect(utterance?.lang.toLowerCase()).toBe('id-id');
  });

  it('defaults to en-US when lang is not provided', () => {
    const synth = createSpeechSynthesisMock([]);
    setupSpeechEnvironment(synth);

    const utterance = createUtterance('Hello world');
    expect(utterance).not.toBeNull();
    expect(utterance?.lang.toLowerCase()).toBe('en-us');
  });

  it('prioritizes high-quality en-US voices', () => {
    const picked = pickPreferredEnglishVoice(
      [
        { name: 'Default English', lang: 'en-US' },
        { name: 'Google US English', lang: 'en-US' },
        { name: 'Google UK English Female', lang: 'en-GB' },
      ] as SpeechSynthesisVoice[],
      'en-US',
    );

    expect(picked?.name).toBe('Google US English');
  });

  it('reuses waitForVoices listener while pending', async () => {
    const synth = createSpeechSynthesisMock([]);
    setupSpeechEnvironment(synth);

    const waitA = waitForVoices(10_000);
    const waitB = waitForVoices(10_000);
    expect(synth.addEventListener).toHaveBeenCalledTimes(1);

    synth.setVoices([{ name: 'Google US English', lang: 'en-US' }]);
    synth.emitVoicesChanged();

    await Promise.all([waitA, waitB]);
    expect(synth.removeEventListener).toHaveBeenCalledTimes(1);
  });

  it('resolves speakText on end and error events', async () => {
    const synth = createSpeechSynthesisMock([
      { name: 'Google US English', lang: 'en-US' },
    ]);
    setupSpeechEnvironment(synth);

    await expect(speakText('first call')).resolves.toBeUndefined();

    synth.speak.mockImplementationOnce((utterance) => {
      window.setTimeout(() => {
        utterance.onerror?.({} as SpeechSynthesisErrorEvent);
      }, 0);
    });

    await expect(speakText('second call')).resolves.toBeUndefined();
  });
});

