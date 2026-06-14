// Voweltense Examples
// Generated from Word_Example Excel files - All 30 examples per symbol
// Optimized: Nested object structure, balanced distributions, and rhotic cleanup.
// UI Ready: Includes an accurate 'uiNote' for positions with limited phonetic presence.

export interface WordExample {
  word: string;
  ipa: string;
}

export interface PositionGroups {
  uiNote?: string; // Properti untuk dipanggil langsung oleh UI/Frontend
  beginning?: WordExample[];
  middle?: WordExample[];
  ending?: WordExample[];
}

export interface SymbolWordExamples {
  [key: string]: PositionGroups;
}

export const vowelTenseExamples: SymbolWordExamples = {
  'Vowel‑Tense‑ɑ': {
    beginning: [
      { word: 'archive', ipa: '/ˈɑrkaɪv/' },
      { word: 'arctic', ipa: '/ˈɑrktɪk/' },
      { word: 'argument', ipa: '/ˈɑrɡjəmənt/' },
      { word: 'arm', ipa: '/ɑrm/' },
      { word: 'army', ipa: '/ˈɑrmi/' },
      { word: 'art', ipa: '/ɑrt/' },
      { word: 'artist', ipa: '/ˈɑrtɪst/' },
      { word: 'honest', ipa: '/ˈɑnɪst/' },
      { word: 'honor', ipa: '/ˈɑnɚ/' },
      { word: 'olive', ipa: '/ˈɑlɪv/' }
    ],
    middle: [
      { word: 'dark', ipa: '/dɑrk/' },
      { word: 'farm', ipa: '/fɑrm/' },
      { word: 'father', ipa: '/ˈfɑðɚ/' },
      { word: 'garden', ipa: '/ˈɡɑrdən/' },
      { word: 'hard', ipa: '/hɑrd/' },
      { word: 'heart', ipa: '/hɑrt/' },
      { word: 'park', ipa: '/pɑrk/' },
      { word: 'part', ipa: '/pɑrt/' },
      { word: 'start', ipa: '/stɑrt/' },
      { word: 'yard', ipa: '/jɑrd/' }
    ],
    ending: [
      { word: 'ah', ipa: '/ ɑ /' },
      { word: 'bah', ipa: '/ bɑ /' },
      { word: 'blah', ipa: '/ blɑ /' },
      { word: 'bra', ipa: '/ brɑ /' },
      { word: 'grandma', ipa: '/ ˈɡrændmɑ /' },
      { word: 'grandpa', ipa: '/ ˈɡrændpɑ /' },
      { word: 'ha', ipa: '/ hɑ /' },
      { word: 'hurrah', ipa: '/ hʊˈrɑ /' }, // Menggantikan 'pa' / 'fa' (Sangat ramah TTS)
      { word: 'ma', ipa: '/ mɑ /' },
      { word: 'spa', ipa: '/ spɑ /' }
    ]
  },
  'Vowel‑Tense‑i': {
    beginning: [
      { word: 'each', ipa: '/itʃ/' },
      { word: 'eager', ipa: '/ˈiɡɚ/' },
      { word: 'eagle', ipa: '/ˈiɡəl/' },
      { word: 'east', ipa: '/ist/' },
      { word: 'easy', ipa: '/ˈizi/' },
      { word: 'eat', ipa: '/it/' },
      { word: 'eel', ipa: '/il/' },
      { word: 'equal', ipa: '/ˈikwəl/' },
      { word: 'even', ipa: '/ˈivən/' },
      { word: 'evening', ipa: '/ˈivnɪŋ/' }
    ],
    middle: [
      { word: 'beat', ipa: '/bit/' },
      { word: 'clean', ipa: '/klin/' },
      { word: 'dream', ipa: '/drim/' },
      { word: 'green', ipa: '/ɡrin/' },
      { word: 'heat', ipa: '/hit/' },
      { word: 'leave', ipa: '/liv/' },
      { word: 'meat', ipa: '/mit/' },
      { word: 'seat', ipa: '/sit/' },
      { word: 'street', ipa: '/strit/' },
      { word: 'team', ipa: '/tim/' }
    ],
    ending: [
      { word: 'be', ipa: '/bi/' },
      { word: 'free', ipa: '/fri/' },
      { word: 'he', ipa: '/hi/' },
      { word: 'key', ipa: '/ki/' },
      { word: 'me', ipa: '/mi/' },
      { word: 'see', ipa: '/si/' },
      { word: 'she', ipa: '/ʃi/' },
      { word: 'tea', ipa: '/ti/' },
      { word: 'tree', ipa: '/tri/' },
      { word: 'we', ipa: '/wi/' }
    ]
  },
  'Vowel‑Tense‑u': {
    beginning: [
      { word: 'oodles', ipa: '/ˈudəlz/' },
      { word: 'ooh', ipa: '/u/' },
      { word: 'oolong', ipa: '/ˈulɔŋ/' },
      { word: 'oomph', ipa: '/umf/' },
      { word: 'oops', ipa: '/ups/' },
      { word: 'ooze', ipa: '/uz/' },
      { word: 'oozy', ipa: '/ˈuzi/' },
      { word: 'ouzo', ipa: '/ˈuzoʊ/' },
      { word: 'uber', ipa: '/ˈubɚ/' },
      { word: 'umami', ipa: '/uˈmɑmi/' }
    ],
    middle: [
      { word: 'food', ipa: '/fud/' },
      { word: 'fruit', ipa: '/frut/' },
      { word: 'group', ipa: '/ɡrup/' },
      { word: 'mood', ipa: '/mud/' },
      { word: 'moon', ipa: '/mun/' },
      { word: 'pool', ipa: '/pul/' },
      { word: 'room', ipa: '/rum/' },
      { word: 'school', ipa: '/skul/' },
      { word: 'soon', ipa: '/sun/' },
      { word: 'suit', ipa: '/sut/' }
    ],
    ending: [
      { word: 'blue', ipa: '/blu/' },
      { word: 'do', ipa: '/du/' },
      { word: 'few', ipa: '/fju/' },
      { word: 'glue', ipa: '/ɡlu/' },
      { word: 'new', ipa: '/nu/' },
      { word: 'true', ipa: '/tru/' },
      { word: 'two', ipa: '/tu/' },
      { word: 'who', ipa: '/hu/' },
      { word: 'you', ipa: '/ju/' },
      { word: 'zoo', ipa: '/zu/' }
    ]
  },
  'Vowel‑Tense‑æ': {
    uiNote: 'Suara ini tidak ditemukan di akhir kosakata baku bahasa Inggris (hanya muncul pada kata informal atau tiruan bunyi seperti "nah" atau "baa").',
    beginning: [
      { word: 'acid', ipa: '/ˈæsɪd/' },
      { word: 'act', ipa: '/ækt/' },
      { word: 'actor', ipa: '/ˈæktɚ/' },
      { word: 'add', ipa: '/æd/' },
      { word: 'after', ipa: '/ˈæftɚ/' },
      { word: 'album', ipa: '/ˈælbəm/' },
      { word: 'ancestry', ipa: '/ˈænsɛstri/' },
      { word: 'angry', ipa: '/ˈæŋɡri/' },
      { word: 'animal', ipa: '/ˈænəməl/' },
      { word: 'ankle', ipa: '/ˈæŋkəl/' },
      { word: 'answer', ipa: '/ˈænsɚ/' },
      { word: 'apple', ipa: '/ˈæpəl/' },
      { word: 'arrow', ipa: '/ˈæroʊ/' },
      { word: 'ask', ipa: '/æsk/' },
      { word: 'aspect', ipa: '/ˈæspɛkt/' }
    ],
    middle: [
      { word: 'back', ipa: '/bæk/' },
      { word: 'bag', ipa: '/bæɡ/' },
      { word: 'bat', ipa: '/bæt/' },
      { word: 'black', ipa: '/blæk/' },
      { word: 'can', ipa: '/kæn/' },
      { word: 'cap', ipa: '/kæp/' },
      { word: 'cat', ipa: '/kæt/' },
      { word: 'class', ipa: '/klæs/' },
      { word: 'family', ipa: '/ˈfæməli/' },
      { word: 'glass', ipa: '/ɡlæs/' },
      { word: 'hat', ipa: '/hæt/' },
      { word: 'jam', ipa: '/dʒæm/' },
      { word: 'man', ipa: '/mæn/' },
      { word: 'map', ipa: '/mæp/' },
      { word: 'pan', ipa: '/pæn/' }
    ]
  },
  'Vowel‑Tense‑ɔ': {
    beginning: [
      { word: 'all', ipa: '/ɔl/' },
      { word: 'also', ipa: '/ˈɔlsoʊ/' },
      { word: 'always', ipa: '/ˈɔlweɪz/' },
      { word: 'audience', ipa: '/ˈɔdiəns/' },
      { word: 'audio', ipa: '/ˈɔdioʊ/' },
      { word: 'author', ipa: '/ˈɔθɚ/' },
      { word: 'autumn', ipa: '/ˈɔtəm/' },
      { word: 'awesome', ipa: '/ˈɔsəm/' },
      { word: 'awful', ipa: '/ˈɔfəl/' },
      { word: 'off', ipa: '/ɔf/' }
    ],
    middle: [
      { word: 'boss', ipa: '/bɔs/' },
      { word: 'cost', ipa: '/kɔst/' },
      { word: 'dog', ipa: '/dɔɡ/' },
      { word: 'long', ipa: '/lɔŋ/' },
      { word: 'lost', ipa: '/lɔst/' },
      { word: 'song', ipa: '/sɔŋ/' },
      { word: 'strong', ipa: '/strɔŋ/' },
      { word: 'talk', ipa: '/tɔk/' },
      { word: 'walk', ipa: '/wɔk/' },
      { word: 'wrong', ipa: '/rɔŋ/' }
    ],
    ending: [
      { word: 'claw', ipa: '/klɔ/' },
      { word: 'draw', ipa: '/drɔ/' },
      { word: 'flaw', ipa: '/flɔ/' },
      { word: 'jaw', ipa: '/dʒɔ/' },
      { word: 'law', ipa: '/lɔ/' },
      { word: 'paw', ipa: '/pɔ/' },
      { word: 'raw', ipa: '/rɔ/' },
      { word: 'saw', ipa: '/sɔ/' },
      { word: 'straw', ipa: '/strɔ/' },
      { word: 'thaw', ipa: '/θɔ/' }
    ]
  }
};