// Consonant Voiceless Examples
// Generated from Word_Example Excel files - All 30 examples per symbol (15-15 for h)
// Refactored: Nested Object structure for position groups (beginning, middle, ending)
// UI Ready: Includes 'uiNote' property for positions with limited phonetic presence.

export interface WordExample {
  word: string;
  ipa: string;
}

export interface PositionGroups {
  uiNote?: string; // Properti untuk catatan khusus visual UI/Frontend
  beginning?: WordExample[];
  middle?: WordExample[];
  ending?: WordExample[];
}

export interface SymbolWordExamples {
  [key: string]: PositionGroups;
}

export const consonantVoicelessExamples: SymbolWordExamples = {
  'Consonant‑Voiceless‑p': {
    beginning: [
      { word: 'pack', ipa: '/pæk/' },
      { word: 'pan', ipa: '/pæn/' },
      { word: 'paper', ipa: '/ˈpeɪpɚ/' },
      { word: 'park', ipa: '/pɑrk/' },
      { word: 'part', ipa: '/pɑrt/' },
      { word: 'pen', ipa: '/pɛn/' },
      { word: 'pet', ipa: '/pɛt/' },
      { word: 'place', ipa: '/pleɪs/' },
      { word: 'play', ipa: '/pleɪ/' },
      { word: 'price', ipa: '/praɪs/' }
    ],
    middle: [
      { word: 'apple', ipa: '/ˈæpəl/' },
      { word: 'company', ipa: '/ˈkʌmpəni/' },
      { word: 'open', ipa: '/ˈoʊpən/' },
      { word: 'practice', ipa: '/ˈpræktɪs/' },
      { word: 'problem', ipa: '/ˈprɑbləm/' },
      { word: 'purple', ipa: '/ˈpɝpəl/' },
      { word: 'simple', ipa: '/ˈsɪmpəl/' },
      { word: 'super', ipa: '/ˈsupɚ/' },
      { word: 'supply', ipa: '/səˈplaɪ/' },
      { word: 'support', ipa: '/səˈpɔrt/' }
    ],
    ending: [
      { word: 'cup', ipa: '/kʌp/' },
      { word: 'help', ipa: '/hɛlp/' },
      { word: 'keep', ipa: '/kip/' },
      { word: 'map', ipa: '/mæp/' },
      { word: 'ship', ipa: '/ʃɪp/' },
      { word: 'shop', ipa: '/ʃɑp/' },
      { word: 'sleep', ipa: '/slip/' },
      { word: 'stop', ipa: '/stɑp/' },
      { word: 'top', ipa: '/tɑp/' },
      { word: 'up', ipa: '/ʌp/' }
    ]
  },
  'Consonant‑Voiceless‑t': {
    beginning: [
      { word: 'take', ipa: '/teɪk/' },
      { word: 'talk', ipa: '/tɔk/' },
      { word: 'team', ipa: '/tim/' },
      { word: 'tell', ipa: '/tɛl/' },
      { word: 'ten', ipa: '/tɛn/' },
      { word: 'time', ipa: '/taɪm/' },
      { word: 'top', ipa: '/tɑp/' },
      { word: 'town', ipa: '/taʊn/' },
      { word: 'try', ipa: '/traɪ/' },
      { word: 'turn', ipa: '/tɝn/' }
    ],
    middle: [
      { word: 'attend', ipa: '/əˈtɛnd/' },
      { word: 'butter', ipa: '/ˈbʌtɚ/' },
      { word: 'actor', ipa: '/ˈæktɚ/' },
      { word: 'empty', ipa: '/ˈɛmpti/' },
      { word: 'hotel', ipa: '/hoʊˈtɛl/' },
      { word: 'master', ipa: '/ˈmæstɚ/' },
      { word: 'matter', ipa: '/ˈmætɚ/' },
      { word: 'return', ipa: '/rɪˈtɝn/' },
      { word: 'together', ipa: '/təˈɡɛðɚ/' },
      { word: 'vector', ipa: '/ˈvɛktɚ/' }
    ],
    ending: [
      { word: 'boot', ipa: '/but/' },
      { word: 'cat', ipa: '/kæt/' },
      { word: 'fast', ipa: '/fæst/' },
      { word: 'hat', ipa: '/hæt/' },
      { word: 'hit', ipa: '/hɪt/' },
      { word: 'meet', ipa: '/mit/' },
      { word: 'net', ipa: '/nɛt/' },
      { word: 'out', ipa: '/aʊt/' },
      { word: 'past', ipa: '/pæst/' },
      { word: 'test', ipa: '/tɛst/' }
    ]
  },
  'Consonant‑Voiceless‑k': {
    beginning: [
      { word: 'car', ipa: '/kɑr/' },
      { word: 'cat', ipa: '/kæt/' },
      { word: 'cold', ipa: '/koʊld/' },
      { word: 'cook', ipa: '/kʊk/' },
      { word: 'cup', ipa: '/kʌp/' },
      { word: 'keep', ipa: '/kip/' },
      { word: 'key', ipa: '/ki/' },
      { word: 'kid', ipa: '/kɪd/' },
      { word: 'kind', ipa: '/kaɪnd/' },
      { word: 'king', ipa: '/kɪŋ/' }
    ],
    middle: [
      { word: 'blanket', ipa: '/ˈblæŋkət/' },
      { word: 'chicken', ipa: '/ˈtʃɪkən/' },
      { word: 'chocolate', ipa: '/ˈtʃɑklət/' },
      { word: 'jacket', ipa: '/ˈdʒækət/' },
      { word: 'local', ipa: '/ˈloʊkəl/' },
      { word: 'market', ipa: '/ˈmɑrkət/' },
      { word: 'pocket', ipa: '/ˈpɑkət/' },
      { word: 'second', ipa: '/ˈsɛkənd/' },
      { word: 'secret', ipa: '/ˈsikrət/' },
      { word: 'ticket', ipa: '/ˈtɪkɪt/' }
    ],
    ending: [
      { word: 'back', ipa: '/bæk/' },
      { word: 'book', ipa: '/bʊk/' },
      { word: 'clock', ipa: '/klɑk/' },
      { word: 'duck', ipa: '/dʌk/' },
      { word: 'kick', ipa: '/kɪk/' },
      { word: 'look', ipa: '/lʊk/' },
      { word: 'pack', ipa: '/pæk/' },
      { word: 'sick', ipa: '/sɪk/' },
      { word: 'took', ipa: '/tʊk/' },
      { word: 'week', ipa: '/wik/' }
    ]
  },
  'Consonant‑Voiceless‑f': {
    beginning: [
      { word: 'face', ipa: '/feɪs/' },
      { word: 'fan', ipa: '/fæn/' },
      { word: 'farm', ipa: '/fɑrm/' },
      { word: 'fast', ipa: '/fæst/' },
      { word: 'fat', ipa: '/fæt/' },
      { word: 'fine', ipa: '/faɪn/' },
      { word: 'fish', ipa: '/fɪʃ/' },
      { word: 'fit', ipa: '/fɪt/' },
      { word: 'food', ipa: '/fud/' },
      { word: 'fun', ipa: '/fʌn/' }
    ],
    middle: [
      { word: 'coffee', ipa: '/ˈkɔfi/' },
      { word: 'deficit', ipa: '/ˈdɛfəsət/' },
      { word: 'dolphin', ipa: '/ˈdɑlfən/' },
      { word: 'football', ipa: '/ˈfʊtbɔl/' },
      { word: 'future', ipa: '/ˈfjutʃɚ/' },
      { word: 'office', ipa: '/ˈɑfɪs/' },
      { word: 'perfect', ipa: '/ˈpɝfɪkt/' },
      { word: 'profit', ipa: '/ˈprɑfət/' },
      { word: 'safety', ipa: '/ˈseɪfti/' },
      { word: 'traffic', ipa: '/ˈtræfɪk/' }
    ],
    ending: [
      { word: 'brief', ipa: '/brif/' },
      { word: 'chef', ipa: '/ʃɛf/' },
      { word: 'half', ipa: '/hæf/' },
      { word: 'laugh', ipa: '/læf/' },
      { word: 'life', ipa: '/laɪf/' },
      { word: 'off', ipa: '/ɔf/' },
      { word: 'rough', ipa: '/rʌf/' },
      { word: 'safe', ipa: '/seɪf/' },
      { word: 'stuff', ipa: '/stʌf/' },
      { word: 'wife', ipa: '/waɪf/' }
    ]
  },
  'Consonant‑Voiceless‑θ': {
    beginning: [
      { word: 'thank', ipa: '/θæŋk/' },
      { word: 'theater', ipa: '/ˈθiətɚ/' },
      { word: 'thick', ipa: '/θɪk/' },
      { word: 'thin', ipa: '/θɪn/' },
      { word: 'think', ipa: '/θɪŋk/' },
      { word: 'thirsty', ipa: '/ˈθɝsti/' },
      { word: 'thirteen', ipa: '/θɝˈtin/' },
      { word: 'thirty', ipa: '/ˈθɝti/' },
      { word: 'thousand', ipa: '/ˈθaʊzənd/' },
      { word: 'three', ipa: '/θri/' }
    ],
    middle: [
      { word: 'anything', ipa: '/ˈɛniˌθɪŋ/' },
      { word: 'athlete', ipa: '/ˈæθlit/' },
      { word: 'author', ipa: '/ˈɔθɚ/' },
      { word: 'bathroom', ipa: '/ˈbæθrum/' },
      { word: 'birthday', ipa: '/ˈbɝθdeɪ/' },
      { word: 'healthy', ipa: '/ˈhɛlθi/' },
      { word: 'method', ipa: '/ˈmɛθəd/' },
      { word: 'nothing', ipa: '/ˈnʌθɪŋ/' },
      { word: 'python', ipa: '/ˈpaɪθɑn/' },
      { word: 'wealthy', ipa: '/ˈwɛlθi/' }
    ],
    ending: [
      { word: 'birth', ipa: '/bɝθ/' },
      { word: 'both', ipa: '/boʊθ/' },
      { word: 'cloth', ipa: '/klɔθ/' },
      { word: 'earth', ipa: '/ɝθ/' },
      { word: 'math', ipa: '/mæθ/' },
      { word: 'mouth', ipa: '/maʊθ/' },
      { word: 'north', ipa: '/nɔrθ/' },
      { word: 'south', ipa: '/saʊθ/' },
      { word: 'tooth', ipa: '/tuθ/' },
      { word: 'worth', ipa: '/wɝθ/' }
    ]
  },
  'Consonant‑Voiceless‑s': {
    beginning: [
      { word: 'same', ipa: '/seɪm/' },
      { word: 'say', ipa: '/seɪ/' },
      { word: 'see', ipa: '/si/' },
      { word: 'sell', ipa: '/sɛl/' },
      { word: 'send', ipa: '/sɛnd/' },
      { word: 'set', ipa: '/sɛt/' },
      { word: 'sit', ipa: '/sɪt/' },
      { word: 'so', ipa: '/soʊ/' },
      { word: 'song', ipa: '/sɔŋ/' },
      { word: 'sun', ipa: '/sʌn/' }
    ],
    middle: [
      { word: 'basic', ipa: '/ˈbeɪsɪk/' },
      { word: 'blossom', ipa: '/ˈblɑsəm/' },
      { word: 'icing', ipa: '/ˈaɪsɪŋ/' },
      { word: 'lesson', ipa: '/ˈlɛsən/' },
      { word: 'muscle', ipa: '/ˈmʌsəl/' },
      { word: 'pencil', ipa: '/ˈpɛnsəl/' },
      { word: 'person', ipa: '/ˈpɝsən/' },
      { word: 'season', ipa: '/ˈsizən/' },
      { word: 'summer', ipa: '/ˈsʌmɚ/' },
      { word: 'system', ipa: '/ˈsɪstəm/' }
    ],
    ending: [
      { word: 'bus', ipa: '/bʌs/' },
      { word: 'class', ipa: '/klæs/' },
      { word: 'dress', ipa: '/drɛs/' },
      { word: 'face', ipa: '/feɪs/' },
      { word: 'glass', ipa: '/ɡlæs/' },
      { word: 'guess', ipa: '/ɡɛs/' },
      { word: 'house', ipa: '/haʊs/' },
      { word: 'kiss', ipa: '/kɪs/' },
      { word: 'miss', ipa: '/mɪs/' },
      { word: 'yes', ipa: '/jɛs/' }
    ]
  },
  'Consonant‑Voiceless‑ʃ': {
    beginning: [
      { word: 'shape', ipa: '/ʃeɪp/' },
      { word: 'share', ipa: '/ʃɛr/' },
      { word: 'she', ipa: '/ʃi/' },
      { word: 'shine', ipa: '/ʃaɪn/' },
      { word: 'ship', ipa: '/ʃɪp/' },
      { word: 'shirt', ipa: '/ʃɝt/' },
      { word: 'shoe', ipa: '/ʃu/' },
      { word: 'shop', ipa: '/ʃɑp/' },
      { word: 'short', ipa: '/ʃɔrt/' },
      { word: 'shut', ipa: '/ʃʌt/' }
    ],
    middle: [
      { word: 'fashion', ipa: '/ˈfæʃən/' },
      { word: 'machine', ipa: '/məˈʃin/' },
      { word: 'mission', ipa: '/ˈmɪʃən/' },
      { word: 'nation', ipa: '/ˈneɪʃən/' },
      { word: 'ocean', ipa: '/ˈoʊʃən/' },
      { word: 'patient', ipa: '/ˈpeɪʃənt/' },
      { word: 'pressure', ipa: '/ˈprɛʃɚ/' },
      { word: 'special', ipa: '/ˈspɛʃəl/' },
      { word: 'station', ipa: '/ˈsteɪʃən/' },
      { word: 'tissue', ipa: '/ˈtɪʃu/' }
    ],
    ending: [
      { word: 'bush', ipa: '/bʊʃ/' },
      { word: 'cash', ipa: '/kæʃ/' },
      { word: 'crash', ipa: '/kræʃ/' },
      { word: 'dish', ipa: '/dɪʃ/' },
      { word: 'fish', ipa: '/fɪʃ/' },
      { word: 'fresh', ipa: '/frɛʃ/' },
      { word: 'push', ipa: '/pʊʃ/' },
      { word: 'rush', ipa: '/rʌʃ/' },
      { word: 'wash', ipa: '/wɑʃ/' },
      { word: 'wish', ipa: '/wɪʃ/' }
    ]
  },
  'Consonant‑Voiceless‑tʃ': {
    beginning: [
      { word: 'chair', ipa: '/tʃɛr/' },
      { word: 'change', ipa: '/tʃeɪndʒ/' },
      { word: 'chase', ipa: '/tʃeɪs/' },
      { word: 'chat', ipa: '/tʃæt/' },
      { word: 'cheap', ipa: '/tʃip/' },
      { word: 'check', ipa: '/tʃɛk/' },
      { word: 'cheese', ipa: '/tʃiz/' },
      { word: 'child', ipa: '/tʃaɪld/' },
      { word: 'choice', ipa: '/tʃɔɪs/' },
      { word: 'chop', ipa: '/tʃɑp/' }
    ],
    middle: [
      { word: 'achieve', ipa: '/əˈtʃiv/' },
      { word: 'culture', ipa: '/ˈkʌltʃɚ/' },
      { word: 'fortune', ipa: '/ˈfɔrtʃən/' },
      { word: 'future', ipa: '/ˈfjutʃɚ/' },
      { word: 'kitchen', ipa: '/ˈkɪtʃən/' },
      { word: 'matching', ipa: '/ˈmætʃɪŋ/' },
      { word: 'merchant', ipa: '/ˈmɝtʃənt/' },
      { word: 'nature', ipa: '/ˈneɪtʃɚ/' },
      { word: 'picture', ipa: '/ˈpɪktʃɚ/' },
      { word: 'teacher', ipa: '/ˈtitʃɚ/' }
    ],
    ending: [
      { word: 'beach', ipa: '/bitʃ/' },
      { word: 'catch', ipa: '/kætʃ/' },
      { word: 'church', ipa: '/tʃɝtʃ/' },
      { word: 'match', ipa: '/mætʃ/' },
      { word: 'much', ipa: '/mʌtʃ/' },
      { word: 'reach', ipa: '/ritʃ/' },
      { word: 'rich', ipa: '/rɪtʃ/' },
      { word: 'speech', ipa: '/spitʃ/' },
      { word: 'touch', ipa: '/tʌtʃ/' },
      { word: 'watch', ipa: '/wɑtʃ/' }
    ]
  },
  'Consonant‑Voiceless‑h': {
    uiNote: 'Suara ini hanya berfungsi jika berada di awal kata atau di awal suku kata sebelum bunyi vokal. Secara fonetis, suara /h/ tidak pernah muncul di akhir kata baku bahasa Inggris (huruf "h" di akhir kata umumnya bisu).',
    beginning: [
      { word: 'hair', ipa: '/hɛr/' },
      { word: 'hand', ipa: '/hænd/' },
      { word: 'happy', ipa: '/ˈhæpi/' },
      { word: 'hard', ipa: '/hɑrd/' },
      { word: 'hat', ipa: '/hæt/' },
      { word: 'head', ipa: '/hɛd/' },
      { word: 'heart', ipa: '/hɑrt/' },
      { word: 'help', ipa: '/hɛlp/' },
      { word: 'hill', ipa: '/hɪl/' },
      { word: 'hit', ipa: '/hɪt/' },
      { word: 'home', ipa: '/hoʊm/' },
      { word: 'hop', ipa: '/hɑp/' },
      { word: 'hope', ipa: '/hoʊp/' },
      { word: 'hot', ipa: '/hɑt/' },
      { word: 'hug', ipa: '/hʌɡ/' }
    ],
    middle: [
      { word: 'ahead', ipa: '/əˈhɛd/' },
      { word: 'alcohol', ipa: '/ˈælkəhɔl/' },
      { word: 'anyhow', ipa: '/ˈɛniˌhaʊ/' },
      { word: 'behave', ipa: '/bɪˈheɪv/' },
      { word: 'behind', ipa: '/bɪˈhaɪnd/' },
      { word: 'falsehood', ipa: '/ˈfɔlshʊd/' },
      { word: 'greenhouse', ipa: '/ˈɡrinˌhaʊs/' },
      { word: 'keyhole', ipa: '/ˈkihoʊl/' },
      { word: 'loophole', ipa: '/ˈluphoʊl/' },
      { word: 'manhood', ipa: '/ˈmænhʊd/' },
      { word: 'neighborhood', ipa: '/ˈneɪbɚˌhʊd/' },
      { word: 'overhead', ipa: '/oʊvɚˈhɛd/' },
      { word: 'perhaps', ipa: '/pɚˈhæps/' },
      { word: 'rehearsal', ipa: '/rɪˈhɝsəl/' },
      { word: 'yahoo', ipa: '/ˈjɑhu/' }
    ]
  }
};