import { TOPICS, TOPIC_ROUTES, LOCKED_TOPIC_IDS } from './constants';

describe('Tongue Twister Configuration', () => {
  describe('TOPICS array', () => {
    it('should have tongue-twister entry in TOPICS array', () => {
      const tongueTwister = TOPICS.find(t => t.id === 'tongue-twister');
      expect(tongueTwister).toBeDefined();
    });

    it('should have correct title for tongue-twister', () => {
      const tongueTwister = TOPICS.find(t => t.id === 'tongue-twister');
      expect(tongueTwister?.title).toBe('Tongue Twister');
    });

    it('should have correct shortDesc for tongue-twister', () => {
      const tongueTwister = TOPICS.find(t => t.id === 'tongue-twister');
      expect(tongueTwister?.shortDesc).toBe('Latihan Artikulasi');
    });

    it('should have correct icon for tongue-twister', () => {
      const tongueTwister = TOPICS.find(t => t.id === 'tongue-twister');
      expect(tongueTwister?.icon).toBe('TT');
    });

    it('should have correct color gradient for tongue-twister', () => {
      const tongueTwister = TOPICS.find(t => t.id === 'tongue-twister');
      expect(tongueTwister?.color).toBe('from-amber-500 to-yellow-600');
    });

    it('should have description for tongue-twister', () => {
      const tongueTwister = TOPICS.find(t => t.id === 'tongue-twister');
      expect(tongueTwister?.description).toBeDefined();
      expect(tongueTwister?.description.length).toBeGreaterThan(0);
    });

    it('should have bgImage for tongue-twister', () => {
      const tongueTwister = TOPICS.find(t => t.id === 'tongue-twister');
      expect(tongueTwister?.bgImage).toBeDefined();
      expect(tongueTwister?.bgImage).toContain('https://');
    });

    it('should position tongue-twister after reading-text', () => {
      const readingTextIndex = TOPICS.findIndex(t => t.id === 'reading-text');
      const tongueTwisterIndex = TOPICS.findIndex(t => t.id === 'tongue-twister');
      
      expect(readingTextIndex).toBeGreaterThanOrEqual(0);
      expect(tongueTwisterIndex).toBeGreaterThan(readingTextIndex);
    });

    it('should position linking-word after american-t', () => {
      const americanTIndex = TOPICS.findIndex(t => t.id === 'american-t');
      const linkingWordIndex = TOPICS.findIndex(t => t.id === 'linking-word');
      
      expect(americanTIndex).toBeGreaterThanOrEqual(0);
      expect(linkingWordIndex).toBeGreaterThan(americanTIndex);
    });

    it('should position contraction after linking-word', () => {
      const linkingWordIndex = TOPICS.findIndex(t => t.id === 'linking-word');
      const contractionIndex = TOPICS.findIndex(t => t.id === 'contraction');

      expect(linkingWordIndex).toBeGreaterThanOrEqual(0);
      expect(contractionIndex).toBe(linkingWordIndex + 1);
    });
  });

  describe('TOPIC_ROUTES mapping', () => {
    it('should have route mapping for tongue-twister', () => {
      expect(TOPIC_ROUTES['tongue-twister']).toBeDefined();
    });

    it('should map tongue-twister to correct route', () => {
      expect(TOPIC_ROUTES['tongue-twister']).toBe('/skill/pronunciation/tongue-twister');
    });

    it('should map linking-word to correct route', () => {
      expect(TOPIC_ROUTES['linking-word']).toBe('/skill/pronunciation/linking-word');
    });

    it('should map contraction to correct route', () => {
      expect(TOPIC_ROUTES.contraction).toBe('/skill/pronunciation/contraction');
    });
  });

  describe('LOCKED_TOPIC_IDS', () => {
    it('should not include tongue-twister by default', () => {
      expect(LOCKED_TOPIC_IDS).not.toContain('tongue-twister');
    });

    it('should not include linking-word by default', () => {
      expect(LOCKED_TOPIC_IDS).not.toContain('linking-word');
    });

    it('should not include contraction by default', () => {
      expect(LOCKED_TOPIC_IDS).not.toContain('contraction');
    });
  });

  describe('Data consistency', () => {
    it('should have all required properties for tongue-twister', () => {
      const tongueTwister = TOPICS.find(t => t.id === 'tongue-twister');
      
      expect(tongueTwister).toMatchObject({
        id: expect.any(String),
        title: expect.any(String),
        shortDesc: expect.any(String),
        description: expect.any(String),
        icon: expect.any(String),
        color: expect.any(String),
        bgImage: expect.any(String),
      });
    });

    it('should have unique id for tongue-twister', () => {
      const ids = TOPICS.map(t => t.id);
      const tongueTwisterIds = ids.filter(id => id === 'tongue-twister');
      expect(tongueTwisterIds.length).toBe(1);
    });

    it('should have linking-word entry in TOPICS array', () => {
      const linkingWord = TOPICS.find(t => t.id === 'linking-word');
      expect(linkingWord).toBeDefined();
    });

    it('should have required properties for linking-word', () => {
      const linkingWord = TOPICS.find(t => t.id === 'linking-word');
      expect(linkingWord).toMatchObject({
        id: expect.any(String),
        title: expect.any(String),
        shortDesc: expect.any(String),
        description: expect.any(String),
        icon: expect.any(String),
        color: expect.any(String),
        bgImage: expect.any(String),
      });
    });

    it('should have unique id for linking-word', () => {
      const ids = TOPICS.map(t => t.id);
      const linkingWordIds = ids.filter(id => id === 'linking-word');
      expect(linkingWordIds.length).toBe(1);
    });

    it('should have required properties for contraction', () => {
      const contraction = TOPICS.find(t => t.id === 'contraction');
      expect(contraction).toMatchObject({
        id: 'contraction',
        title: 'Contraction',
        shortDesc: expect.any(String),
        description: expect.any(String),
        icon: expect.any(String),
        color: expect.any(String),
        bgImage: expect.any(String),
      });
    });

    it('should have unique id for contraction', () => {
      const ids = TOPICS.map(t => t.id);
      const contractionIds = ids.filter(id => id === 'contraction');
      expect(contractionIds.length).toBe(1);
    });
  });
});
