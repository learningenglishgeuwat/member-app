import { resolveQaMode } from './qa';

describe('resolveQaMode', () => {
  it('should explain contraction basics with high confidence', () => {
    const result = resolveQaMode('apa itu contraction');

    expect(result.mode).toBe('qa');
    expect(result.reply.toLowerCase()).toContain('contraction adalah');
    expect(result.reply.toLowerCase()).toContain('apostrof');
    expect(result.actions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: 'route',
          path: '/skill/pronunciation/contraction',
        }),
      ]),
    );
  });

  it('should explain informal contractions', () => {
    const result = resolveQaMode('jelaskan gonna wanna');

    expect(result.mode).toBe('qa');
    expect(result.reply.toLowerCase()).toContain('informal contractions');
    expect(result.reply.toLowerCase()).toContain('wanna');
    expect(result.actions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: 'route',
          path: '/skill/pronunciation/contraction',
        }),
      ]),
    );
  });

  it('should explain linking word basics', () => {
    const result = resolveQaMode('apa itu linking word');

    expect(result.mode).toBe('qa');
    expect(result.reply.toLowerCase()).toContain('linking word');
    expect(result.reply.toLowerCase()).toContain('connected speech');
    expect(result.actions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: 'route',
          path: '/skill/pronunciation/linking-word',
        }),
      ]),
    );
  });

  it('should explain tongue twisters', () => {
    const result = resolveQaMode('latihan kelincahan lidah');

    expect(result.mode).toBe('qa');
    expect(result.reply.toLowerCase()).toContain('tongue twister');
    expect(result.reply.toLowerCase()).toContain('artikulasi');
    expect(result.actions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: 'route',
          path: '/skill/pronunciation/reading-text/tongueTwister',
        }),
      ]),
    );
  });

  it('should answer pronunciation comparisons with concrete contrast and pitfall', () => {
    const result = resolveQaMode('beda flap dan glottal');

    expect(result.mode).toBe('qa');
    expect(result.meta?.answerType).toBe('comparison');
    expect(result.reply.toLowerCase()).toContain('ketukan lidah cepat');
    expect(result.reply.toLowerCase()).toContain('hentian singkat');
    expect(result.reply.toLowerCase()).toContain('kesalahan umum');
    expect(result.actions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: 'route',
          path: '/skill/pronunciation/american-t',
        }),
      ]),
    );
  });

  it('should answer pronunciation how-to questions with a detailed practice routine', () => {
    const result = resolveQaMode('cara latihan s es');

    expect(result.mode).toBe('qa');
    expect(result.meta?.answerType).toBe('how_to');
    expect(result.reply.toLowerCase()).toContain('cara latihan detail');
    expect(result.reply.toLowerCase()).toContain('rekam 10-20 detik');
    expect(result.reply.toLowerCase()).toContain('kesalahan umum');
    expect(result.actions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: 'route',
          path: '/skill/pronunciation/final-sound-new/s/es',
        }),
      ]),
    );
  });

  it('should answer pronunciation term examples with concrete sound patterns', () => {
    const result = resolveQaMode('contoh final sound s/es');

    expect(result.mode).toBe('qa');
    expect(result.meta?.answerType).toBe('word_explanation');
    expect(result.reply.toLowerCase()).toContain('cats');
    expect(result.reply.toLowerCase()).toContain('dogs');
    expect(result.reply.toLowerCase()).toContain('watches');
    expect(result.reply.toLowerCase()).toContain('pola latihan aman');
  });
});
