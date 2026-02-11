// Vowel pronunciation tips dataset

import type { SymbolPronunciationTips } from './types';

export const vowelTips: SymbolPronunciationTips = {
  'i': [
    { tip: 'Tongue high and forward', category: 'tongue' },
    { tip: 'Lips spread wide', category: 'lips' },
    { tip: 'Long vowel sound', category: 'general' },
    { tip: 'Front of tongue touches hard palate', category: 'tongue' }
  ],
  'ɪ': [
    { tip: 'Tongue slightly lower than for /iː/', category: 'tongue' },
    { tip: 'Lips relaxed, not spread', category: 'lips' },
    { tip: 'Short vowel sound', category: 'general' },
    { tip: 'Tongue position is near-close', category: 'tongue' }
  ],
  'e': [
    { tip: 'Tongue mid-high position', category: 'tongue' },
    { tip: 'Lips slightly spread', category: 'lips' },
    { tip: 'Long vowel sound', category: 'general' },
    { tip: 'Front of tongue is raised', category: 'tongue' }
  ],
  'ɛ': [
    { tip: 'Tongue mid-low position', category: 'tongue' },
    { tip: 'Lips neutral', category: 'lips' },
    { tip: 'Short vowel sound', category: 'general' },
    { tip: 'Mouth moderately open', category: 'mouth' }
  ],
  'æ': [
    { tip: 'Tongue low front position', category: 'tongue' },
    { tip: 'Lips wide open', category: 'mouth' },
    { tip: 'Short vowel sound', category: 'general' },
    { tip: 'Jaw dropped significantly', category: 'mouth' }
  ],
  'ɑ': [
    { tip: 'Tongue low back position', category: 'tongue' },
    { tip: 'Mouth wide open', category: 'mouth' },
    { tip: 'Long vowel sound', category: 'general' },
    { tip: 'Jaw completely relaxed', category: 'mouth' }
  ],
  'ɔ': [
    { tip: 'Tongue mid-back position', category: 'tongue' },
    { tip: 'Lips rounded', category: 'lips' },
    { tip: 'Short vowel sound', category: 'general' },
    { tip: 'Mouth moderately open', category: 'mouth' }
  ],
  'ʊ': [
    { tip: 'Tongue high back position', category: 'tongue' },
    { tip: 'Lips slightly rounded', category: 'lips' },
    { tip: 'Short vowel sound', category: 'general' },
    { tip: 'Tongue is near-close', category: 'tongue' }
  ],
  'ʌ': [
    { tip: 'Tongue mid-back position', category: 'tongue' },
    { tip: 'Lips neutral', category: 'lips' },
    { tip: 'Short vowel sound', category: 'general' },
    { tip: 'Mouth moderately open', category: 'mouth' }
  ],
  'ə': [
    { tip: 'Tongue mid-central position', category: 'tongue' },
    { tip: 'Lips completely relaxed', category: 'lips' },
    { tip: 'Weak unstressed vowel', category: 'general' },
    { tip: 'Most common sound in English', category: 'general' }
  ],
  'ɚ': [
    { tip: 'Tongue mid-central position', category: 'tongue' },
    { tip: 'Lips neutral', category: 'lips' },
    { tip: 'R-colored vowel', category: 'voice' },
    { tip: 'Tongue slightly retracted', category: 'tongue' }
  ],
  'u': [
    { tip: 'Tongue high back position', category: 'tongue' },
    { tip: 'Lips fully rounded', category: 'lips' },
    { tip: 'Long vowel sound', category: 'general' },
    { tip: 'Back of tongue raised', category: 'tongue' }
  ]
};
