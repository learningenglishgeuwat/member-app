// YouTube Video IDs for Phonetic Symbols
// Organized by category with IPA symbols and corresponding YouTube video IDs

export interface VideoMapping {
  videoId: string;
  symbol: string;
}

export interface VideoCategory {
  [symbol: string]: string;
}

// Video IDs for vowel lax symbols
export const vowelLaxVideos: VideoCategory = {
  'ʌ': 'e6rjJiOxVCs',
  'ɪ': 'rX96zUAApyo',
  'ʊ': 'nEhnJj_bLbM',
  'ɛ': 'II9KgEF3K7E',
  'ə': 'rqU4DTeQc5E',
  'ɚ': 'UUNI1k8tNSY'
};

// Video IDs for vowel tense symbols
export const vowelTenseVideos: VideoCategory = {
  'ɑ': 'rBFB2VXmAI0',
  'i': '9XcUY0nunfw',
  'u': 'qJiVghRtg1I',
  'æ': 'qg0IjcUZdso',
  'ɔ': '1Kjyf1D7jvE',

};

// Video IDs for consonant voiced symbols
export const consonantVoicedVideos: VideoCategory = {
  'b': 'THcT0SvCjK4',
  'd': '9h7EWDTAAoY',
  'g': 'a3yi-Ge8HS8',
  'v': 'fC6BCT_KF-o',
  'ð': 'Sg0ssrA0Yaw',
  'z': 'mEoGA6y-fQo',
  'ʒ': 'RmQncMXQdG4',
  'ʤ': 'XJQzE4tDW0A',
  'l': 'VKiTgQdJXjI',
  'm': 'iuIOJHjztzc',
  'n': 'uCZEU-h2JSs',
  'ŋ': 'X3dSWxLvNKc',
  'r': 'Fa9FuZBe820',
  'w': 'vxNQEd_b3VU',
  'y': 'RcwlhTaGVzo'
};

// Video IDs for consonant voiceless symbols
export const consonantVoicelessVideos: VideoCategory = {
  'p': 'gRO8tJ6EK1M',
  't': 'HXsyO2iWY44',
  'k': 'VJaW7kOly1s',
  'f': 'ODkqeBCL49o',
  'θ': 'riRrCGw2-6I',
  's': 'r92ZzmP_15k',
  'ʃ': 'Dxc20oQ6VX8',
  'ʧ': 'fXB0-xkV7Vg',
  'h': 'OjGa6UjvRrU'
};

// Video IDs for diphthong symbols
export const diphthongVideos: VideoCategory = {
  'aɪ': 'xndGoQmWYxU',
  'eɪ': 'Gk_ZufNX5jQ',
  'ɔɪ': 'TL8bvCYD0dk',
  'ɪə': 'v_9rTF9MXyY',
  'eə': '08MZWPOwiYw',
  'ʊə': '3zSOQ_wWdyc',
  'aʊ': 'WzlK8CnFh8c',
  'oʊ': '08MZWPOwiYw'
};

// Combined all video IDs by category
export const allVideoIds: { [category: string]: VideoCategory } = {
  vowel_lax: vowelLaxVideos,
  vowel_tense: vowelTenseVideos,
  consonant_voiced: consonantVoicedVideos,
  consonant_voiceless: consonantVoicelessVideos,
  diphthong: diphthongVideos
};

// Helper function to get video ID by symbol
export function getVideoIdBySymbol(symbol: string): string | undefined {
  for (const category of Object.values(allVideoIds)) {
    if (category[symbol]) {
      return category[symbol];
    }
  }
  return undefined;
}

// Helper function to get video ID by category and symbol
export function getVideoIdByCategoryAndSymbol(category: string, symbol: string): string | undefined {
  return allVideoIds[category]?.[symbol];
}

// Helper function to get all video mappings for a category
export function getVideoMappingsByCategory(category: string): VideoMapping[] {
  const categoryVideos = allVideoIds[category];
  if (!categoryVideos) return [];
  
  return Object.entries(categoryVideos).map(([symbol, videoId]) => ({
    videoId,
    symbol
  }));
}

// Helper function to get all video mappings
export function getAllVideoMappings(): VideoMapping[] {
  const mappings: VideoMapping[] = [];
  
  for (const videos of Object.values(allVideoIds)) {
    for (const [symbol, videoId] of Object.entries(videos)) {
      mappings.push({
        videoId,
        symbol
      });
    }
  }
  
  return mappings;
}


