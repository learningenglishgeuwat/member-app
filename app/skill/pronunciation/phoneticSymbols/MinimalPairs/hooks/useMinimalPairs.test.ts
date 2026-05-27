import { getMinimalPairUtteranceOptions } from './useMinimalPairs';

describe('getMinimalPairUtteranceOptions', () => {
  it('uses the phonetic-symbol detail English voice selector for American words', () => {
    const options = getMinimalPairUtteranceOptions('word-0-a', 'en-US');

    expect(options).toMatchObject({
      preferredEnglish: 'en-US',
      rate: 0.86,
    });
    expect(options).not.toHaveProperty('lang');
  });

  it('uses the phonetic-symbol detail English voice selector for British words', () => {
    const options = getMinimalPairUtteranceOptions('word-0-a', 'en-GB');

    expect(options).toMatchObject({
      preferredEnglish: 'en-GB',
      rate: 0.86,
    });
    expect(options).not.toHaveProperty('lang');
  });

  it('keeps Indonesian r practice on explicit Indonesian TTS', () => {
    const options = getMinimalPairUtteranceOptions('word-0-b', 'id-ID');

    expect(options).toMatchObject({
      lang: 'id-ID',
      rate: 0.86,
    });
    expect(options).not.toHaveProperty('preferredEnglish');
  });

  it('keeps sentence playback a little slower', () => {
    expect(getMinimalPairUtteranceOptions('sentence-0-a', 'en-US')).toMatchObject({
      preferredEnglish: 'en-US',
      rate: 0.82,
    });
  });
});
