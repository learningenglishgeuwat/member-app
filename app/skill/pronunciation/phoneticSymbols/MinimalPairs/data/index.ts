import type { MinimalPairCategory, MinimalPairData } from '../types';
import { consonantPairs } from './consonant';
import { diphthongPairs } from './diphthong';
import { createTemplatePair } from './shared';
import { vowelPairs } from './vowel';

const seedPairs = [...vowelPairs, ...diphthongPairs, ...consonantPairs];

export const minimalPairsData: MinimalPairData[] = seedPairs.map(createTemplatePair);

export const minimalPairCategories: MinimalPairCategory[] = ['vowel', 'diphthong', 'consonant'];

export const categoryLabelMap: Record<MinimalPairCategory, string> = {
  vowel: 'Vowel',
  diphthong: 'Diphthong',
  consonant: 'Consonant',
};

export const getPairsByCategory = (category: MinimalPairCategory): MinimalPairData[] =>
  minimalPairsData.filter((item) => item.category === category);

export const getPairById = (id: string): MinimalPairData | undefined =>
  minimalPairsData.find((item) => item.id === id);

type PartialModule = {
  consonantPairs?: typeof consonantPairs;
  diphthongPairs?: typeof diphthongPairs;
  vowelPairs?: typeof vowelPairs;
};

const loadedCategoryCache: Partial<Record<MinimalPairCategory, MinimalPairData[]>> = {
  vowel: vowelPairs.map(createTemplatePair),
  diphthong: diphthongPairs.map(createTemplatePair),
  consonant: consonantPairs.map(createTemplatePair),
};

export const loadPairsByCategory = async (category: MinimalPairCategory): Promise<MinimalPairData[]> => {
  const cached = loadedCategoryCache[category];
  if (cached) return cached;

  let moduleLoader: Promise<PartialModule>;
  if (category === 'vowel') moduleLoader = import('./vowel');
  else if (category === 'diphthong') moduleLoader = import('./diphthong');
  else moduleLoader = import('./consonant');

  const loadedModule = await moduleLoader;
  const seed =
    category === 'vowel'
      ? loadedModule.vowelPairs ?? []
      : category === 'diphthong'
        ? loadedModule.diphthongPairs ?? []
        : loadedModule.consonantPairs ?? [];

  const result = seed.map(createTemplatePair);
  loadedCategoryCache[category] = result;
  return result;
};
