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
});
