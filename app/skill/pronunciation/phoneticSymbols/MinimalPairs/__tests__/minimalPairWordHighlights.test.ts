import { minimalPairsData } from '../data/index';
import { WORD_HIGHLIGHT_OVERRIDES } from '../../data/wordHighlights';

const normalizeSymbol = (value: string): string =>
  value
    .replace(/\([^)]*\)/g, '')
    .trim()
    .replace(/^\/|\/$/g, '');

const escapeRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/_/g, '.');

describe('MinimalPairs word highlight overrides', () => {
  it('has explicit orange highlight patterns for every minimal-pair word', () => {
    const missing: string[] = [];

    minimalPairsData.forEach((pair) => {
      const [rawA = '', rawB = ''] = pair.pairLabel.split('↔');
      const symbols = {
        a: normalizeSymbol(rawA),
        b: normalizeSymbol(rawB),
      };

      pair.words.forEach((wordPair) => {
        (['a', 'b'] as const).forEach((side) => {
          const word = wordPair[side];
          const symbol = symbols[side];
          const patterns = WORD_HIGHLIGHT_OVERRIDES[symbol]?.[word.toLowerCase()] ?? [];

          if (patterns.length === 0) {
            missing.push(`${pair.id} ${side}:${symbol}:${word}`);
            return;
          }

          const regex = new RegExp(`(${patterns.map(escapeRegex).join('|')})`, 'i');
          if (!regex.test(word)) {
            missing.push(`${pair.id} ${side}:${symbol}:${word} patterns=${patterns.join(',')}`);
          }
        });
      });
    });

    expect(missing).toEqual([]);
  });
});
