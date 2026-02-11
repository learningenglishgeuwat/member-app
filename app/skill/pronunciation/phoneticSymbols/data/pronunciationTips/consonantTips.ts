// Consonant pronunciation tips dataset

import type { SymbolPronunciationTips } from './types';

export const consonantTips: SymbolPronunciationTips = {
  'p': [
    { tip: 'Both lips close completely', category: 'lips' },
    { tip: 'Build up air pressure', category: 'airflow' },
    { tip: 'Release suddenly', category: 'airflow' },
    { tip: 'Voiceless - no vocal cord vibration', category: 'voice' }
  ],
  'b': [
    { tip: 'Same as /p/ but with voice', category: 'voice' },
    { tip: 'Vocal cords vibrate', category: 'voice' },
    { tip: 'Air pressure builds', category: 'airflow' },
    { tip: 'Both lips close completely', category: 'lips' }
  ],
  't': [
    { tip: 'Tongue tip touches alveolar ridge', category: 'tongue' },
    { tip: 'Build up air pressure', category: 'airflow' },
    { tip: 'Release suddenly', category: 'airflow' },
    { tip: 'Voiceless - no vocal cord vibration', category: 'voice' }
  ],
  'd': [
    { tip: 'Same as /t/ but with voice', category: 'voice' },
    { tip: 'Vocal cords vibrate', category: 'voice' },
    { tip: 'Tongue tip touches alveolar ridge', category: 'tongue' },
    { tip: 'Air pressure builds and releases', category: 'airflow' }
  ],
  'k': [
    { tip: 'Back of tongue touches soft palate', category: 'tongue' },
    { tip: 'Build up air pressure', category: 'airflow' },
    { tip: 'Release suddenly', category: 'airflow' },
    { tip: 'Voiceless - no vocal cord vibration', category: 'voice' }
  ],
  'g': [
    { tip: 'Same as /k/ but with voice', category: 'voice' },
    { tip: 'Vocal cords vibrate', category: 'voice' },
    { tip: 'Back of tongue touches soft palate', category: 'tongue' },
    { tip: 'Air pressure builds and releases', category: 'airflow' }
  ],
  'f': [
    { tip: 'Top teeth touch bottom lip', category: 'mouth' },
    { tip: 'Air flows continuously', category: 'airflow' },
    { tip: 'No vocal cord vibration', category: 'voice' },
    { tip: 'Create friction sound', category: 'airflow' }
  ],
  'v': [
    { tip: 'Same as /f/ but with voice', category: 'voice' },
    { tip: 'Vocal cords vibrate', category: 'voice' },
    { tip: 'Top teeth touch bottom lip', category: 'mouth' },
    { tip: 'Air flows with friction', category: 'airflow' }
  ],
  'θ': [
    { tip: 'Tongue between teeth', category: 'tongue' },
    { tip: 'Air flows continuously', category: 'airflow' },
    { tip: 'No vocal cord vibration', category: 'voice' },
    { tip: 'Create soft friction sound', category: 'airflow' }
  ],
  'ð': [
    { tip: 'Same tongue position as /θ/', category: 'tongue' },
    { tip: 'Vocal cords vibrate', category: 'voice' },
    { tip: 'Voiced counterpart', category: 'voice' },
    { tip: 'Air flows with friction', category: 'airflow' }
  ],
  's': [
    { tip: 'Tongue tip near alveolar ridge', category: 'tongue' },
    { tip: 'Air flows continuously', category: 'airflow' },
    { tip: 'No vocal cord vibration', category: 'voice' },
    { tip: 'Create hissing sound', category: 'airflow' }
  ],
  'z': [
    { tip: 'Same as /s/ but with voice', category: 'voice' },
    { tip: 'Vocal cords vibrate', category: 'voice' },
    { tip: 'Tongue tip near alveolar ridge', category: 'tongue' },
    { tip: 'Create buzzing sound', category: 'airflow' }
  ],
  'ʃ': [
    { tip: 'Tongue pulled back', category: 'tongue' },
    { tip: 'Lips rounded', category: 'lips' },
    { tip: 'Air creates friction', category: 'airflow' },
    { tip: 'Voiceless shushing sound', category: 'voice' }
  ],
  'ʒ': [
    { tip: 'Same as /ʃ/ but with voice', category: 'voice' },
    { tip: 'Vocal cords vibrate', category: 'voice' },
    { tip: 'Tongue pulled back', category: 'tongue' },
    { tip: 'Create buzzing sh sound', category: 'airflow' }
  ],
  'h': [
    { tip: 'Air flows from glottis', category: 'airflow' },
    { tip: 'No vocal cord vibration', category: 'voice' },
    { tip: 'Open mouth position', category: 'mouth' },
    { tip: 'Breathy sound', category: 'airflow' }
  ],
  'ʧ': [
    { tip: 'Start with /t/ position', category: 'tongue' },
    { tip: 'End with /ʃ/ position', category: 'tongue' },
    { tip: 'Voiceless combination', category: 'voice' },
    { tip: 'Tongue moves back during release', category: 'tongue' }
  ],
  'ʤ': [
    { tip: 'Same as /ʧ/ but with voice', category: 'voice' },
    { tip: 'Vocal cords vibrate', category: 'voice' },
    { tip: 'Start with /d/ position', category: 'tongue' },
    { tip: 'End with /ʒ/ position', category: 'tongue' }
  ],
  'm': [
    { tip: 'Both lips close completely', category: 'lips' },
    { tip: 'Air flows through nose', category: 'airflow' },
    { tip: 'Vocal cords vibrate', category: 'voice' },
    { tip: 'Create humming sound', category: 'voice' }
  ],
  'n': [
    { tip: 'Tongue tip touches alveolar ridge', category: 'tongue' },
    { tip: 'Air flows through nose', category: 'airflow' },
    { tip: 'Vocal cords vibrate', category: 'voice' },
    { tip: 'Create nasal sound', category: 'voice' }
  ],
  'ŋ': [
    { tip: 'Back of tongue touches soft palate', category: 'tongue' },
    { tip: 'Air flows through nose', category: 'airflow' },
    { tip: 'Vocal cords vibrate', category: 'voice' },
    { tip: 'Create singing nasal sound', category: 'voice' }
  ],
  'l': [
    { tip: 'Tongue tip touches alveolar ridge', category: 'tongue' },
    { tip: 'Air flows around sides', category: 'airflow' },
    { tip: 'Vocal cords vibrate', category: 'voice' },
    { tip: 'Create clear liquid sound', category: 'voice' }
  ],
  'r': [
    { tip: 'Tongue slightly curled back', category: 'tongue' },
    { tip: 'Air flows continuously', category: 'airflow' },
    { tip: 'Vocal cords vibrate', category: 'voice' },
    { tip: 'Create bunched r sound', category: 'voice' }
  ],
  'w': [
    { tip: 'Lips rounded tightly', category: 'lips' },
    { tip: 'Tongue back raised', category: 'tongue' },
    { tip: 'Vocal cords vibrate', category: 'voice' },
    { tip: 'Create smooth glide', category: 'voice' }
  ],
  'j': [
    { tip: 'Tongue front raised high', category: 'tongue' },
    { tip: 'Lips spread', category: 'lips' },
    { tip: 'Vocal cords vibrate', category: 'voice' },
    { tip: 'Create y-glide sound', category: 'voice' }
  ]
};
