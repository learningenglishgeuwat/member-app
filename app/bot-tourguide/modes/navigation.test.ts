import { resolveNavigationMode } from './navigation';

describe('resolveNavigationMode', () => {
  it('should navigate to contraction page', () => {
    const result = resolveNavigationMode('buka contraction');

    expect(result.mode).toBe('navigation');
    expect(result.actions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: 'route',
          path: '/skill/pronunciation/contraction',
          label: 'Contraction',
        }),
      ]),
    );
  });

  it('should navigate to linking word page', () => {
    const result = resolveNavigationMode('buka linking word');

    expect(result.mode).toBe('navigation');
    expect(result.actions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: 'route',
          path: '/skill/pronunciation/linking-word',
          label: 'Linking Word',
        }),
      ]),
    );
  });

  it('should navigate to tongue twister reading text page', () => {
    const result = resolveNavigationMode('buka tongue twister reading');

    expect(result.mode).toBe('navigation');
    expect(result.actions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          kind: 'route',
          path: '/skill/pronunciation/reading-text/tongueTwister',
          label: 'Tongue Twister Reading Text',
        }),
      ]),
    );
  });

  it('should detect typo and suggest corrected query', () => {
    const result = resolveNavigationMode('buka contruction');

    expect(result.mode).toBe('navigation');
    expect(result.confirmation?.kind).toBe('typo');
    if (result.confirmation && 'correctedQuery' in result.confirmation) {
      expect(result.confirmation.correctedQuery).toBe('contraction');
    } else {
      fail('Expected result.confirmation to have correctedQuery');
    }
  });

  it('should detect linkingword typo and suggest corrected query', () => {
    const result = resolveNavigationMode('buka linkingword');

    expect(result.mode).toBe('navigation');
    expect(result.confirmation?.kind).toBe('typo');
    if (result.confirmation && 'correctedQuery' in result.confirmation) {
      expect(result.confirmation.correctedQuery).toBe('linking word');
    } else {
      fail('Expected result.confirmation to have correctedQuery');
    }
  });
});
