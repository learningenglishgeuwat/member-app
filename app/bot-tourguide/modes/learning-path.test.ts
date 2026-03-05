import { resolveLearningPathMode } from './learning-path';

describe('resolveLearningPathMode', () => {
  it('returns overview by default with three core actions', () => {
    const result = resolveLearningPathMode('');

    expect(result.mode).toBe('learning-path');
    expect(result.meta?.source).toBe('learning-path');
    expect(result.meta?.learningPath?.roadmapType).toBe('overview');
    expect(result.actions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ kind: 'route', path: '/skill/pronunciation' }),
        expect.objectContaining({ kind: 'route', path: '/skill/speaking' }),
        expect.objectContaining({ kind: 'route', path: '/skill/vocabulary' }),
      ]),
    );
  });

  it('returns pronunciation roadmap details when asked', () => {
    const result = resolveLearningPathMode('pronunciation roadmap');

    expect(result.mode).toBe('learning-path');
    expect(result.meta?.learningPath?.roadmapType).toBe('pronunciation');
    expect(result.reply.toLowerCase()).toContain('pronunciation roadmap');
    expect(result.actions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ kind: 'route', path: '/skill/pronunciation' }),
      ]),
    );
  });

  it('returns speaking roadmap details when asked', () => {
    const result = resolveLearningPathMode('speaking roadmap');

    expect(result.mode).toBe('learning-path');
    expect(result.meta?.learningPath?.roadmapType).toBe('speaking');
    expect(result.reply.toLowerCase()).toContain('speaking roadmap');
    expect(result.actions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ kind: 'route', path: '/skill/speaking' }),
      ]),
    );
  });

  it('returns vocabulary roadmap details when asked', () => {
    const result = resolveLearningPathMode('vocabulary roadmap');

    expect(result.mode).toBe('learning-path');
    expect(result.meta?.learningPath?.roadmapType).toBe('vocabulary');
    expect(result.reply.toLowerCase()).toContain('vocabulary roadmap');
    expect(result.actions.some((action) => action.kind === 'route')).toBe(true);
  });
});
