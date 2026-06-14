// Vowellax Examples
// Generated from Word_Example Excel files - All 30 examples per symbol
// Fixed: Balanced 15-15 distribution for 2-position vowels & Sorted Alphabetically
// Refactored: Nested Object structure for syntax efficiency
// UI Ready: Includes 'uiNote' property for positions with limited phonetic presence.

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

export const vowelLaxExamples: SymbolWordExamples = {
  'ʌ': {
    uiNote: 'Suara ini tidak ditemukan di akhir kata baku, hanya muncul pada kata seruan informal seperti "huh" atau "duh".',
    beginning: [
      { word: 'onion', ipa: '/ˈʌnjən/' },
      { word: 'other', ipa: '/ˈʌðɚ/' },
      { word: 'oven', ipa: '/ˈʌvən/' },
      { word: 'udder', ipa: '/ˈʌdɚ/' },
      { word: 'ugly', ipa: '/ˈʌɡli/' },
      { word: 'ulcer', ipa: '/ˈʌlsɚ/' },
      { word: 'ultimate', ipa: '/ˈʌltəmət/' },
      { word: 'ultra', ipa: '/ˈʌltrə/' },
      { word: 'umbrella', ipa: '/ʌmˈbrɛlə/' },
      { word: 'umpire', ipa: '/ˈʌmpaɪɚ/' },
      { word: 'uncle', ipa: '/ˈʌŋkəl/' },
      { word: 'under', ipa: '/ˈʌndɚ/' },
      { word: 'up', ipa: '/ʌp/' },
      { word: 'us', ipa: '/ʌs/' },
      { word: 'utter', ipa: '/ˈʌtɚ/' }
    ],
    middle: [
      { word: 'bus', ipa: '/bʌs/' },
      { word: 'but', ipa: '/bʌt/' },
      { word: 'come', ipa: '/kʌm/' },
      { word: 'cup', ipa: '/kʌp/' },
      { word: 'cut', ipa: '/kʌt/' },
      { word: 'duck', ipa: '/dʌk/' },
      { word: 'fun', ipa: '/fʌn/' },
      { word: 'honey', ipa: '/ˈhʌni/' },
      { word: 'jump', ipa: '/dʒʌmp/' },
      { word: 'love', ipa: '/lʌv/' },
      { word: 'luck', ipa: '/lʌk/' },
      { word: 'much', ipa: '/mʌtʃ/' },
      { word: 'run', ipa: '/rʌn/' },
      { word: 'sun', ipa: '/sʌn/' },
      { word: 'trust', ipa: '/trʌst/' }
    ]
  },
  'ɪ': {
    uiNote: 'Suara ini tidak pernah muncul di akhir kata baku dalam bahasa Inggris.',
    beginning: [
      { word: 'if', ipa: '/ɪf/' },
      { word: 'ignore', ipa: '/ɪɡˈnɔr/' }, // Diperbaiki dari /ɪbˈnɔr/ ke /ɪɡˈnɔr/
      { word: 'ill', ipa: '/ɪl/' },
      { word: 'illness', ipa: '/ˈɪlnəs/' },
      { word: 'image', ipa: '/ˈɪmɪdʒ/' },
      { word: 'impact', ipa: '/ˈɪmpækt/' },
      { word: 'in', ipa: '/ɪn/' },
      { word: 'inch', ipa: '/ɪntʃ/' },
      { word: 'index', ipa: '/ˈɪndɛks/' },
      { word: 'infant', ipa: '/ˈɪnfənt/' },
      { word: 'ink', ipa: '/ɪŋk/' },
      { word: 'insect', ipa: '/ˈɪnsɛkt/' },
      { word: 'instant', ipa: '/ˈɪnstənt/' },
      { word: 'is', ipa: '/ɪz/' },
      { word: 'it', ipa: '/ɪt/' }
    ],
    middle: [
      { word: 'big', ipa: '/bɪɡ/' },
      { word: 'bit', ipa: '/bɪt/' },
      { word: 'fish', ipa: '/fɪʃ/' },
      { word: 'hit', ipa: '/hɪt/' },
      { word: 'kid', ipa: '/kɪd/' },
      { word: 'kiss', ipa: '/kɪs/' },
      { word: 'list', ipa: '/lɪst/' },
      { word: 'milk', ipa: '/mɪlk/' },
      { word: 'miss', ipa: '/mɪs/' },
      { word: 'pin', ipa: '/pɪn/' },
      { word: 'quick', ipa: '/kwɪk/' },
      { word: 'rich', ipa: '/rɪtʃ/' },
      { word: 'ship', ipa: '/ʃɪp/' },
      { word: 'sick', ipa: '/sɪk/' },
      { word: 'sit', ipa: '/sɪt/' }
    ]
  },
  'ʊ': {
    uiNote: 'Suara ini hampir selalu berada di tengah kata. Sangat langka di awal kata (kecuali kata serapan khusus) dan tidak ada di akhir kata baku.',
    middle: [
      { word: 'book', ipa: '/bʊk/' },
      { word: 'bull', ipa: '/bʊl/' },
      { word: 'bush', ipa: '/bʊʃ/' },
      { word: 'butcher', ipa: '/ˈbʊtʃɚ/' },
      { word: 'cook', ipa: '/kʊk/' },
      { word: 'cookie', ipa: '/ˈkʊki/' },
      { word: 'could', ipa: '/kʊd/' },
      { word: 'cushion', ipa: '/ˈkʊʃən/' },
      { word: 'foot', ipa: '/fʊt/' },
      { word: 'full', ipa: '/fʊl/' },
      { word: 'good', ipa: '/ɡʊd/' },
      { word: 'hood', ipa: '/hʊd/' },
      { word: 'hoodie', ipa: '/ˈhʊdi/' },
      { word: 'hook', ipa: '/hʊk/' },
      { word: 'look', ipa: '/lʊk/' },
      { word: 'pudding', ipa: '/ˈpʊdɪŋ/' },
      { word: 'pull', ipa: '/pʊl/' },
      { word: 'pulling', ipa: '/ˈpʊlɪŋ/' },
      { word: 'push', ipa: '/pʊʃ/' },
      { word: 'put', ipa: '/pʊt/' },
      { word: 'rookie', ipa: '/ˈrʊki/' },
      { word: 'shook', ipa: '/ʃʊk/' },
      { word: 'should', ipa: '/ʃʊd/' },
      { word: 'stood', ipa: '/stʊd/' },
      { word: 'sugar', ipa: '/ˈʃʊɡɚ/' },
      { word: 'took', ipa: '/tʊk/' },
      { word: 'wolf', ipa: '/wʊlf/' },
      { word: 'woman', ipa: '/ˈwʊmən/' },
      { word: 'wood', ipa: '/wʊd/' },
      { word: 'wooden', ipa: '/ˈwʊdən/' }
    ]
  },
  'ɛ': {
    uiNote: 'Suara ini tidak ditemukan di akhir kata baku, hanya muncul pada kata seruan informal seperti "meh" atau "bleh".',
    beginning: [
      { word: 'echo', ipa: '/ˈɛkoʊ/' },
      { word: 'edit', ipa: '/ˈɛdɪt/' },
      { word: 'effort', ipa: '/ˈɛfɚt/' },
      { word: 'egg', ipa: '/ɛɡ/' },
      { word: 'elbow', ipa: '/ˈɛlboʊ/' },
      { word: 'empty', ipa: '/ˈɛmpti/' },
      { word: 'end', ipa: '/ɛnd/' },
      { word: 'energy', ipa: '/ˈɛnɚdʒi/' },
      { word: 'engine', ipa: '/ˈɛndʒən/' },
      { word: 'enter', ipa: '/ˈɛntɚ/' },
      { word: 'envy', ipa: '/ˈɛnvi/' },
      { word: 'episode', ipa: '/ˈɛpəsoʊd/' },
      { word: 'error', ipa: '/ˈɛrɚ/' },
      { word: 'expert', ipa: '/ˈɛkspɝt/' },
      { word: 'extra', ipa: '/ˈɛkstrə/' }
    ],
    middle: [
      { word: 'bed', ipa: '/bɛd/' },
      { word: 'best', ipa: '/bɛst/' },
      { word: 'bread', ipa: '/brɛd/' },
      { word: 'dress', ipa: '/drɛs/' },
      { word: 'friend', ipa: '/frɛnd/' },
      { word: 'get', ipa: '/ɡɛt/' },
      { word: 'head', ipa: '/hɛd/' },
      { word: 'let', ipa: '/lɛt/' },
      { word: 'men', ipa: '/mɛn/' },
      { word: 'pen', ipa: '/pɛn/' },
      { word: 'red', ipa: '/rɛd/' },
      { word: 'said', ipa: '/sɛd/' },
      { word: 'send', ipa: '/sɛnd/' },
      { word: 'ten', ipa: '/tɛn/' },
      { word: 'test', ipa: '/tɛst/' }
    ]
  },
  'ə': {
    // Schwa mencakup seluruh posisi dengan distribusi seimbang, tidak memerlukan uiNote khusus posisi.
    beginning: [
      { word: 'about', ipa: '/əˈbaʊt/' },
      { word: 'above', ipa: '/əˈbʌv/' },
      { word: 'ago', ipa: '/əˈɡoʊ/' },
      { word: 'agree', ipa: '/əˈɡri/' },
      { word: 'alert', ipa: '/əˈlɝt/' },
      { word: 'alone', ipa: '/əˈloʊn/' },
      { word: 'amaze', ipa: '/əˈmeɪz/' },
      { word: 'around', ipa: '/əˈraʊnd/' },
      { word: 'attack', ipa: '/əˈtæk/' },
      { word: 'away', ipa: '/əˈweɪ/' }
    ],
    middle: [
      { word: 'animal', ipa: '/ˈænəməl/' },
      { word: 'condition', ipa: '/kənˈdɪʃən/' },
      { word: 'family', ipa: '/ˈfæməli/' },
      { word: 'machine', ipa: '/məˈʃin/' },
      { word: 'police', ipa: '/pəˈlis/' },
      { word: 'problem', ipa: '/ˈprɑbləm/' },
      { word: 'support', ipa: '/səˈpɔrt/' },
      { word: 'system', ipa: '/ˈsɪstəm/' },
      { word: 'today', ipa: '/təˈdeɪ/' },
      { word: 'tomorrow', ipa: '/təˈmɑroʊ/' }
    ],
    ending: [
      { word: 'area', ipa: '/ˈɛriə/' },
      { word: 'banana', ipa: '/bəˈnænə/' },
      { word: 'camera', ipa: '/ˈkæmrə/' },
      { word: 'china', ipa: '/ˈtʃaɪnə/' },
      { word: 'comma', ipa: '/ˈkɑmə/' },
      { word: 'data', ipa: '/ˈdeɪtə/' },
      { word: 'drama', ipa: '/ˈdrɑmə/' },
      { word: 'idea', ipa: '/aɪˈdiə/' },
      { word: 'pizza', ipa: '/ˈpitsə/' },
      { word: 'sofa', ipa: '/ˈsoʊfə/' }
    ]
  },
  'ɚ': {
    uiNote: 'Suara ini tidak bisa berada di awal kata karena sifat rhotik-nya yang selalu tidak mendapat tekanan (unstressed).',
    middle: [
      { word: 'butterfly', ipa: '/ˈbʌtɚflaɪ/' },
      { word: 'dangerous', ipa: '/ˈdeɪndʒɚəs/' },
      { word: 'eastern', ipa: '/ˈistɚn/' },
      { word: 'interview', ipa: '/ˈɪntɚvju/' },
      { word: 'lantern', ipa: '/ˈlæntɚn/' },
      { word: 'leadership', ipa: '/ˈlidɚʃɪp/' },
      { word: 'liberty', ipa: '/ˈlɪbɚti/' },
      { word: 'modern', ipa: '/ˈmɑdɚn/' },
      { word: 'northern', ipa: '/ˈnɔrðɚn/' },
      { word: 'pattern', ipa: '/ˈpætɚn/' },
      { word: 'poverty', ipa: '/ˈpɑvɚti/' },
      { word: 'property', ipa: '/ˈprɑpɚti/' },
      { word: 'western', ipa: '/ˈwɛstɚn/' },
      { word: 'wonderful', ipa: '/ˈwʌndɚfəl/' },
      { word: 'yesterday', ipa: '/ˈjɛstɚdeɪ/' }
    ],
    ending: [
      { word: 'better', ipa: '/ˈbɛtɚ/' },
      { word: 'brother', ipa: '/ˈbrʌðɚ/' },
      { word: 'computer', ipa: '/kəmˈpjutɚ/' },
      { word: 'doctor', ipa: '/ˈdɑktɚ/' },
      { word: 'driver', ipa: '/ˈdraɪvɚ/' },
      { word: 'father', ipa: '/ˈfɑðɚ/' },
      { word: 'letter', ipa: '/ˈlɛtɚ/' },
      { word: 'mother', ipa: '/ˈmʌðɚ/' },
      { word: 'number', ipa: '/ˈnʌmbɚ/' },
      { word: 'player', ipa: '/ˈpleɪɚ/' },
      { word: 'sister', ipa: '/ˈsɪstɚ/' },
      { word: 'summer', ipa: '/ˈsʌmɚ/' },
      { word: 'teacher', ipa: '/ˈtitʃɚ/' },
      { word: 'water', ipa: '/ˈwɑtɚ/' },
      { word: 'worker', ipa: '/ˈwɝkɚ/' }
    ]
  }
};