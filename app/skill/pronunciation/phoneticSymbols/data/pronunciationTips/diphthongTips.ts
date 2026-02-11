// Diphthong pronunciation tips dataset

import type { SymbolPronunciationTips } from './types';

export const diphthongTips: SymbolPronunciationTips = {
  'aɪ': [
    { tip: 'Start with open mouth', category: 'mouth' },
    { tip: 'Glide to high front position', category: 'tongue' },
    { tip: 'Two-part vowel sound', category: 'general' },
    { tip: 'End with /ɪ/ position', category: 'tongue' }
  ],
  'aʊ': [
    { tip: 'Start with open mouth', category: 'mouth' },
    { tip: 'Glide to high back position', category: 'tongue' },
    { tip: 'Two-part vowel sound', category: 'general' },
    { tip: 'End with /ʊ/ position', category: 'tongue' }
  ],
  'eɪ': [
    { tip: 'Start with mid-front position', category: 'tongue' },
    { tip: 'Glide to high front position', category: 'tongue' },
    { tip: 'Two-part vowel sound', category: 'general' },
    { tip: 'End with /ɪ/ position', category: 'tongue' }
  ],
  'ɔɪ': [
    { tip: 'Start with mid-back position', category: 'tongue' },
    { tip: 'Glide to high front position', category: 'tongue' },
    { tip: 'Two-part vowel sound', category: 'general' },
    { tip: 'End with /ɪ/ position', category: 'tongue' }
  ],
  'oʊ': [
    { tip: 'Start with mid-back position', category: 'tongue' },
    { tip: 'Glide to high back position', category: 'tongue' },
    { tip: 'Two-part vowel sound', category: 'general' },
    { tip: 'End with /ʊ/ position', category: 'tongue' }
  ],
  'eə': [
    { tip: 'Start with mid-front position', category: 'tongue' },
    { tip: 'Glide to schwa position', category: 'tongue' },
    { tip: 'Two-part vowel sound', category: 'general' },
    { tip: 'End with /ə/ position', category: 'tongue' }
  ],
  'ɪə': [
    { tip: 'Start with near-close front position', category: 'tongue' },
    { tip: 'Glide to schwa position', category: 'tongue' },
    { tip: 'Two-part vowel sound', category: 'general' },
    { tip: 'End with /ə/ position', category: 'tongue' }
  ],
  'ʊə': [
    { tip: 'Start with near-close back position', category: 'tongue' },
    { tip: 'Glide to schwa position', category: 'tongue' },
    { tip: 'Two-part vowel sound', category: 'general' },
    { tip: 'End with /ə/ position', category: 'tongue' }
  ]
};
