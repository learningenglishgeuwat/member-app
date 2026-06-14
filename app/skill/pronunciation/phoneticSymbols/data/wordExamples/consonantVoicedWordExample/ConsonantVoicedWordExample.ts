// Consonant Voiced Examples
// Generated from Word_Example Excel files - All 30 examples per symbol
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

export const consonantVoicedExamples: SymbolWordExamples = {
  'Consonant‑Voiced‑b': {
    beginning: [
      { word: 'baby', ipa: '/ˈbeɪbi/' },
      { word: 'back', ipa: '/bæk/' },
      { word: 'bad', ipa: '/bæd/' },
      { word: 'bag', ipa: '/bæɡ/' },
      { word: 'bat', ipa: '/bæt/' },
      { word: 'bed', ipa: '/bɛd/' },
      { word: 'big', ipa: '/bɪɡ/' },
      { word: 'book', ipa: '/bʊk/' },
      { word: 'boy', ipa: '/bɔɪ/' },
      { word: 'bus', ipa: '/bʌs/' }
    ],
    middle: [
      { word: 'about', ipa: '/əˈbaʊt/' },
      { word: 'cabin', ipa: '/ˈkæbɪn/' },
      { word: 'habit', ipa: '/ˈhæbɪt/' },
      { word: 'labor', ipa: '/ˈleɪbɚ/' },
      { word: 'number', ipa: '/ˈnʌmbɚ/' },
      { word: 'object', ipa: '/ˈɑbdʒɛkt/' },
      { word: 'problem', ipa: '/ˈprɑbləm/' },
      { word: 'public', ipa: '/ˈpʌblɪk/' },
      { word: 'rabbit', ipa: '/ˈræbɪt/' },
      { word: 'table', ipa: '/ˈteɪbəl/' }
    ],
    ending: [
      { word: 'club', ipa: '/klʌb/' },
      { word: 'crab', ipa: '/kræb/' },
      { word: 'grab', ipa: '/ɡræb/' },
      { word: 'job', ipa: '/dʒɑb/' },
      { word: 'lab', ipa: '/læb/' },
      { word: 'rib', ipa: '/rɪb/' },
      { word: 'rub', ipa: '/rʌb/' },
      { word: 'sub', ipa: '/sʌb/' },
      { word: 'tub', ipa: '/tʌb/' },
      { word: 'web', ipa: '/wɛb/' }
    ]
  },
  'Consonant‑Voiced‑d': {
    beginning: [
      { word: 'dad', ipa: '/dæd/' },
      { word: 'dark', ipa: '/dɑrk/' },
      { word: 'day', ipa: '/deɪ/' },
      { word: 'deal', ipa: '/dil/' },
      { word: 'dear', ipa: '/dɪr/' },
      { word: 'deep', ipa: '/dip/' },
      { word: 'did', ipa: '/dɪd/' },
      { word: 'dog', ipa: '/dɔɡ/' },
      { word: 'door', ipa: '/dɔr/' },
      { word: 'down', ipa: '/daʊn/' }
    ],
    middle: [
      { word: 'body', ipa: '/ˈbɑdi/' },
      { word: 'ladder', ipa: '/ˈlædɚ/' },
      { word: 'leader', ipa: '/ˈlidɚ/' },
      { word: 'medical', ipa: '/ˈmɛdɪkəl/' }, // FIXED: Standarisasi vokal /ɪ/
      { word: 'order', ipa: '/ˈɔrdɚ/' },
      { word: 'radio', ipa: '/ˈreɪdioʊ/' },
      { word: 'reading', ipa: '/ˈridɪŋ/' },
      { word: 'shadow', ipa: '/ˈʃædoʊ/' },
      { word: 'under', ipa: '/ˈʌndɚ/' },
      { word: 'window', ipa: '/ˈwɪndoʊ/' }
    ],
    ending: [
      { word: 'bad', ipa: '/bæd/' },
      { word: 'bed', ipa: '/bɛd/' },
      { word: 'find', ipa: '/faɪnd/' },
      { word: 'food', ipa: '/fud/' },
      { word: 'good', ipa: '/ɡʊd/' },
      { word: 'hand', ipa: '/hænd/' },
      { word: 'head', ipa: '/hɛd/' },
      { word: 'mad', ipa: '/mæd/' },
      { word: 'old', ipa: '/oʊld/' },
      { word: 'red', ipa: '/rɛd/' }
    ]
  },
  'Consonant‑Voiced‑ɡ': {
    beginning: [
      { word: 'game', ipa: '/ɡeɪm/' },
      { word: 'garden', ipa: '/ˈɡɑrdən/' },
      { word: 'get', ipa: '/ɡɛt/' },
      { word: 'give', ipa: '/ɡɪv/' },
      { word: 'glass', ipa: '/ɡlæs/' },
      { word: 'go', ipa: '/ɡoʊ/' },
      { word: 'goal', ipa: '/ɡoʊl/' },
      { word: 'good', ipa: '/ɡʊd/' },
      { word: 'great', ipa: '/ɡreɪt/' },
      { word: 'green', ipa: '/ɡrin/' }
    ],
    middle: [
      { word: 'angry', ipa: '/ˈæŋɡri/' },
      { word: 'bigger', ipa: '/ˈbɪɡɚ/' },
      { word: 'eager', ipa: '/ˈiɡɚ/' },
      { word: 'finger', ipa: '/ˈfɪŋɡɚ/' },
      { word: 'hungry', ipa: '/ˈhʌŋɡri/' },
      { word: 'regular', ipa: '/ˈrɛɡjəlɚ/' },
      { word: 'sugar', ipa: '/ˈʃʊɡɚ/' },
      { word: 'tiger', ipa: '/ˈtaɪɡɚ/' },
      { word: 'target', ipa: '/ˈtɑrɡɪt/' }, // FIXED: Mengganti 'together' yang tidak punya bunyi /g/ sama sekali
      { word: 'ugly', ipa: '/ˈʌɡli/' }
    ],
    ending: [
      { word: 'bag', ipa: '/bæɡ/' },
      { word: 'big', ipa: '/bɪɡ/' },
      { word: 'dog', ipa: '/dɔɡ/' },
      { word: 'egg', ipa: '/ɛɡ/' },
      { word: 'flag', ipa: '/flæɡ/' },
      { word: 'frog', ipa: '/frɔɡ/' },
      { word: 'hug', ipa: '/hʌɡ/' },
      { word: 'leg', ipa: '/lɛɡ/' },
      { word: 'log', ipa: '/lɔɡ/' },
      { word: 'tag', ipa: '/tæɡ/' }
    ]
  },
  'Consonant‑Voiced‑v': {
    beginning: [
      { word: 'value', ipa: '/ˈvælju/' },
      { word: 'van', ipa: '/væn/' },
      { word: 'very', ipa: '/ˈvɛri/' },
      { word: 'victory', ipa: '/ˈvɪktəri/' },
      { word: 'video', ipa: '/ˈvɪdioʊ/' },
      { word: 'view', ipa: '/vju/' },
      { word: 'village', ipa: '/ˈvɪlɪdʒ/' },
      { word: 'visit', ipa: '/ˈvɪzɪt/' },
      { word: 'voice', ipa: '/vɔɪs/' },
      { word: 'vote', ipa: '/voʊt/' }
    ],
    middle: [
      { word: 'even', ipa: '/ˈivən/' },
      { word: 'ever', ipa: '/ˈɛvɚ/' },
      { word: 'heavy', ipa: '/ˈhɛvi/' },
      { word: 'level', ipa: '/ˈlɛvəl/' },
      { word: 'never', ipa: '/ˈnɛvɚ/' },
      { word: 'over', ipa: '/ˈoʊvɚ/' },
      { word: 'river', ipa: '/ˈrɪvɚ/' },
      { word: 'seven', ipa: '/ˈsɛvən/' },
      { word: 'silver', ipa: '/ˈsɪlvɚ/' },
      { word: 'travel', ipa: '/ˈtrævəl/' }
    ],
    ending: [
      { word: 'drive', ipa: '/draɪv/' },
      { word: 'five', ipa: '/faɪv/' },
      { word: 'give', ipa: '/ɡɪv/' },
      { word: 'leave', ipa: '/liv/' },
      { word: 'live', ipa: '/lɪv/' },
      { word: 'love', ipa: '/lʌv/' },
      { word: 'move', ipa: '/muv/' },
      { word: 'prove', ipa: '/pruv/' },
      { word: 'save', ipa: '/seɪv/' },
      { word: 'wave', ipa: '/weɪv/' }
    ]
  },
  'Consonant‑Voiced‑ð': {
    beginning: [
      { word: 'that', ipa: '/ðæt/' },
      { word: 'their', ipa: '/ðɛr/' },
      { word: 'them', ipa: '/ðɛm/' },
      { word: 'then', ipa: '/ðɛn/' },
      { word: 'there', ipa: '/ðɛr/' },
      { word: 'these', ipa: '/ðiz/' },
      { word: 'they', ipa: '/ðeɪ/' },
      { word: 'this', ipa: '/ðɪs/' },
      { word: 'those', ipa: '/ðoʊz/' },
      { word: 'though', ipa: '/ðoʊ/' }
    ],
    middle: [
      { word: 'another', ipa: '/əˈnʌðɚ/' },
      { word: 'brother', ipa: '/ˈbrʌðɚ/' },
      { word: 'father', ipa: '/ˈfɑðɚ/' },
      { word: 'gather', ipa: '/ˈɡæðɚ/' },
      { word: 'mother', ipa: '/ˈmʌðɚ/' },
      { word: 'other', ipa: '/ˈʌðɚ/' },
      { word: 'rather', ipa: '/ˈræðɚ/' },
      { word: 'together', ipa: '/təˈɡɛðɚ/' },
      { word: 'weather', ipa: '/ˈwɛðɚ/' },
      { word: 'whether', ipa: '/ˈwɛðɚ/' }
    ],
    ending: [
      { word: 'bathe', ipa: '/beɪð/' },
      { word: 'breathe', ipa: '/brið/' },
      { word: 'clothe', ipa: '/kloʊð/' },
      { word: 'lathe', ipa: '/leɪð/' },     // FIXED: Pengganti kata bermasalah / ambigu
      { word: 'loathe', ipa: '/loʊð/' },
      { word: 'scythe', ipa: '/saɪð/' },    // FIXED: Pengganti 'mouth' yang aslinya voiceless /θ/
      { word: 'smooth', ipa: '/smuð/' },
      { word: 'soothe', ipa: '/suð/' },
      { word: 'teethe', ipa: '/tið/' },
      { word: 'wreathe', ipa: '/rið/' }     // FIXED: Pengganti kata bermasalah / ambigu
    ]
  },
  'Consonant‑Voiced‑z': {
    beginning: [
      { word: 'zeal', ipa: '/zil/' },
      { word: 'zebra', ipa: '/ˈzibrə/' },
      { word: 'zero', ipa: '/ˈziroʊ/' },
      { word: 'zigzag', ipa: '/ˈzɪɡˌzæɡ/' },
      { word: 'zinc', ipa: '/zɪŋk/' },
      { word: 'zip', ipa: '/zɪp/' },
      { word: 'zodiac', ipa: '/ˈzoʊdiˌæk/' },
      { word: 'zone', ipa: '/zoʊn/' },
      { word: 'zoo', ipa: '/zu/' },
      { word: 'zoom', ipa: '/zum/' }
    ],
    middle: [
      { word: 'busy', ipa: '/ˈbɪzi/' },
      { word: 'cousin', ipa: '/ˈkʌzən/' },
      { word: 'crazy', ipa: '/ˈkreɪzi/' },
      { word: 'desert', ipa: '/ˈdɛzɚt/' },
      { word: 'dozen', ipa: '/ˈdʌzən/' },
      { word: 'easy', ipa: '/ˈizi/' },
      { word: 'frozen', ipa: '/ˈfroʊzən/' },
      { word: 'lazy', ipa: '/ˈleɪzi/' },
      { word: 'music', ipa: '/ˈmjuzɪk/' },
      { word: 'season', ipa: '/ˈsizən/' }
    ],
    ending: [
      { word: 'because', ipa: '/bɪˈkɔz/' },
      { word: 'does', ipa: '/dʌz/' },
      { word: 'is', ipa: '/ɪz/' },
      { word: 'noise', ipa: '/nɔɪz/' },
      { word: 'please', ipa: '/pliz/' },
      { word: 'prize', ipa: '/praɪz/' },
      { word: 'rise', ipa: '/raɪz/' },
      { word: 'size', ipa: '/saɪz/' },
      { word: 'was', ipa: '/wʌz/' },
      { word: 'wise', ipa: '/waɪz/' }
    ]
  },
  'Consonant‑Voiced‑ʒ': {
    uiNote: 'Suara /ʒ/ sangat jarang muncul di awal kata dalam bahasa Inggris baku, umumnya hanya ditemukan pada kata serapan (loanwords) seperti "genre". Oleh karena itu, contoh hanya tersedia untuk posisi tengah dan akhir.',
    middle: [
      { word: 'collision', ipa: '/kəˈlɪʒən/' },
      { word: 'conclusion', ipa: '/kənˈkluʒən/' },
      { word: 'confusion', ipa: '/kənˈfjuʒən/' },
      { word: 'decision', ipa: '/dɪˈsɪʒən/' },
      { word: 'division', ipa: '/dɪˈvɪʒən/' },
      { word: 'erosion', ipa: '/ɪˈroʊʒən/' },
      { word: 'explosion', ipa: '/ɪkˈsploʊʒən/' },
      { word: 'illusion', ipa: '/ɪˈluʒən/' },
      { word: 'invasion', ipa: '/ɪnˈveɪʒən/' },
      { word: 'leisure', ipa: '/ˈliʒɚ/' },
      { word: 'measure', ipa: '/ˈmɛʒɚ/' },
      { word: 'occasion', ipa: '/əˈkeɪʒən/' },
      { word: 'pleasure', ipa: '/ˈplɛʒɚ/' },
      { word: 'precision', ipa: '/prɪˈsɪʒən/' },
      { word: 'provision', ipa: '/prəˈvɪʒən/' },
      { word: 'revision', ipa: '/rɪˈvɪʒən/' },
      { word: 'television', ipa: '/ˈtɛləˌvɪʒən/' },
      { word: 'treasure', ipa: '/ˈtrɛʒɚ/' },
      { word: 'version', ipa: '/ˈvɝʒən/' },
      { word: 'vision', ipa: '/ˈvɪʒən/' }
    ],
    ending: [
      { word: 'beige', ipa: '/beɪʒ/' },
      { word: 'camouflage', ipa: '/ˈkæməˌflɑʒ/' },
      { word: 'collage', ipa: '/koʊˈlɑʒ/' },
      { word: 'espionage', ipa: '/ˈɛspiəˌnɑʒ/' },
      { word: 'garage', ipa: '/ɡəˈrɑʒ/' },
      { word: 'massage', ipa: '/məˈsɑʒ/' },
      { word: 'mirage', ipa: '/məˈrɑʒ/' },
      { word: 'prestige', ipa: '/prɛsˈtiʒ/' },
      { word: 'rouge', ipa: '/ruʒ/' },
      { word: 'sabotage', ipa: '/ˈsæbəˌtɑʒ/' }
    ]
  },
  'Consonant‑Voiced‑dʒ': {
    beginning: [
      { word: 'January', ipa: '/ˈdʒænjuˌɛri/' },
      { word: 'job', ipa: '/dʒɑb/' },
      { word: 'join', ipa: '/dʒɔɪn/' },
      { word: 'joke', ipa: '/dʒoʊk/' },
      { word: 'joy', ipa: '/dʒɔɪ/' },
      { word: 'judge', ipa: '/dʒʌdʒ/' },
      { word: 'juice', ipa: '/dʒus/' },
      { word: 'July', ipa: '/dʒʊˈlaɪ/' },
      { word: 'June', ipa: '/dʒun/' },
      { word: 'jungle', ipa: '/ˈdʒʌŋɡəl/' }
    ],
    middle: [
      { word: 'adjust', ipa: '/əˈdʒʌst/' },
      { word: 'danger', ipa: '/ˈdeɪndʒɚ/' },
      { word: 'education', ipa: '/ˌɛdʒʊˈkeɪʃen/' },
      { word: 'engine', ipa: '/ˈɛndʒɪn/' },     // FIXED: Standarisasi vokal /ɪ/
      { word: 'major', ipa: '/ˈmeɪdʒɚ/' },
      { word: 'manager', ipa: '/ˈmænɪdʒɚ/' },
      { word: 'project', ipa: '/ˈprɑdʒɛkt/' },
      { word: 'region', ipa: '/ˈridʒen/' },
      { word: 'religion', ipa: '/rɪˈlɪdʒen/' },
      { word: 'subject', ipa: '/ˈsʌbdʒɪkt/' }
    ],
    ending: [
      { word: 'age', ipa: '/eɪdʒ/' },
      { word: 'badge', ipa: '/bædʒ/' },
      { word: 'bridge', ipa: '/brɪdʒ/' },
      { word: 'change', ipa: '/tʃeɪndʒ/' },
      { word: 'college', ipa: '/ˈkɑlɪdʒ/' },
      { word: 'edge', ipa: '/ɛdʒ/' },
      { word: 'huge', ipa: '/hjudʒ/' },
      { word: 'large', ipa: '/lɑrdʒ/' },
      { word: 'page', ipa: '/peɪdʒ/' },
      { word: 'stage', ipa: '/steɪdʒ/' }
    ]
  },
  'Consonant‑Voiced‑m': {
    beginning: [
      { word: 'mad', ipa: '/mæd/' },
      { word: 'make', ipa: '/meɪk/' },
      { word: 'man', ipa: '/mæn/' },
      { word: 'many', ipa: '/ˈmɛni/' },
      { word: 'map', ipa: '/mæp/' },
      { word: 'milk', ipa: '/mɪlk/' },
      { word: 'money', ipa: '/ˈmʌni/' },
      { word: 'more', ipa: '/mɔr/' },
      { word: 'most', ipa: '/moʊst/' },
      { word: 'mouth', ipa: '/maʊθ/' }
    ],
    middle: [
      { word: 'amount', ipa: '/əˈmaʊnt/' },
      { word: 'animal', ipa: '/ˈænəməl/' },
      { word: 'company', ipa: '/ˈkʌmpəni/' },
      { word: 'damage', ipa: '/ˈdæmɪdʒ/' },   // FIXED: Standarisasi vokal /ɪ/
      { word: 'famous', ipa: '/ˈfeɪməs/' },
      { word: 'hammer', ipa: '/ˈhæmɚ/' },
      { word: 'lemon', ipa: '/ˈlɛmən/' },
      { word: 'promise', ipa: '/ˈprɑmɪs/' },  // FIXED: Standarisasi vokal /ɪ/
      { word: 'simple', ipa: '/ˈsɪmpəl/' },
      { word: 'summer', ipa: '/ˈsʌmɚ/' }
    ],
    ending: [
      { word: 'come', ipa: '/kʌm/' },
      { word: 'game', ipa: '/ɡeɪm/' },
      { word: 'home', ipa: '/hoʊm/' },
      { word: 'name', ipa: '/neɪm/' },
      { word: 'problem', ipa: '/ˈprɑbləm/' },
      { word: 'room', ipa: '/rum/' },
      { word: 'swim', ipa: '/swɪm/' },
      { word: 'system', ipa: '/ˈsɪstəm/' },
      { word: 'team', ipa: '/tim/' },
      { word: 'time', ipa: '/taɪm/' }
    ]
  },
  'Consonant‑Voiced‑n': {
    beginning: [
      { word: 'name', ipa: '/neɪm/' },
      { word: 'near', ipa: '/nɪr/' },
      { word: 'need', ipa: '/nid/' },
      { word: 'never', ipa: '/ˈnɛvɚ/' },
      { word: 'new', ipa: '/nu/' },
      { word: 'next', ipa: '/nɛkst/' },
      { word: 'nice', ipa: '/naɪs/' },
      { word: 'nine', ipa: '/naɪn/' },
      { word: 'no', ipa: '/noʊ/' },
      { word: 'not', ipa: '/nɑt/' }
    ],
    middle: [
      { word: 'dinner', ipa: '/ˈdɪnɚ/' },
      { word: 'funny', ipa: '/ˈfʌni/' },
      { word: 'money', ipa: '/ˈmʌni/' },
      { word: 'nation', ipa: '/ˈneɪʃən/' },
      { word: 'nature', ipa: '/ˈneɪtʃɚ/' },
      { word: 'nothing', ipa: '/ˈnʌθɪŋ/' },
      { word: 'notice', ipa: '/ˈnoʊtɪs/' },
      { word: 'number', ipa: '/ˈnʌmbɚ/' },     // FIXED: Memperbaiki typo parah bawaan (/mʌmbɚ/ -> /nʌmbɚ/)
      { word: 'person', ipa: '/ˈpɝsən/' },
      { word: 'winter', ipa: '/ˈwɪntɚ/' }
    ],
    ending: [
      { word: 'fine', ipa: '/faɪn/' },
      { word: 'line', ipa: '/laɪn/' },
      { word: 'main', ipa: '/meɪn/' },
      { word: 'man', ipa: '/mæn/' },
      { word: 'pan', ipa: '/pæn/' },
      { word: 'rain', ipa: '/reɪn/' },
      { word: 'run', ipa: '/rʌn/' },
      { word: 'sign', ipa: '/saɪn/' },
      { word: 'ten', ipa: '/tɛn/' },
      { word: 'win', ipa: '/wɪn/' }
    ]
  },
  'Consonant‑Voiced‑ŋ': {
    uiNote: 'Suara /ŋ/ (ng) secara fonotaktik tidak pernah muncul di awal kata dalam bahasa Inggris baku. Oleh karena itu, contoh posisi awal tidak tersedia.',
    middle: [
      { word: 'angry', ipa: '/ˈæŋɡri/' },
      { word: 'beginning', ipa: '/bɪˈɡɪnɪŋ/' },
      { word: 'blanket', ipa: '/ˈblæŋkɪt/' },   // FIXED: Standarisasi vokal /ɪ/
      { word: 'ending', ipa: '/ˈɛndɪŋ/' },
      { word: 'evening', ipa: '/ˈivnɪŋ/' },
      { word: 'finger', ipa: '/ˈfɪŋɡɚ/' },
      { word: 'hungry', ipa: '/ˈhʌŋɡri/' },
      { word: 'language', ipa: '/ˈlæŋɡwɪdʒ/' },
      { word: 'longer', ipa: '/ˈlɔŋɡɚ/' },
      { word: 'morning', ipa: '/ˈmɔrnɪŋ/' },
      { word: 'single', ipa: '/ˈsɪŋɡəl/' },
      { word: 'stronger', ipa: '/ˈstrɔŋɡɚ/' },
      { word: 'talking', ipa: '/ˈtɔkɪŋ/' },
      { word: 'thinking', ipa: '/ˈθɪŋkɪŋ/' },
      { word: 'working', ipa: '/ˈwɝkɪŋ/' }
    ],
    ending: [
      { word: 'bang', ipa: '/bæŋ/' },
      { word: 'bring', ipa: '/brɪŋ/' },
      { word: 'hang', ipa: '/hæŋ/' },
      { word: 'king', ipa: '/kɪŋ/' },
      { word: 'long', ipa: '/lɔŋ/' },
      { word: 'ring', ipa: '/rɪŋ/' },
      { word: 'sing', ipa: '/sɪŋ/' },
      { word: 'song', ipa: '/sɔŋ/' },
      { word: 'spring', ipa: '/sprɪŋ/' },
      { word: 'string', ipa: '/strɪŋ/' },
      { word: 'strong', ipa: '/strɔŋ/' },
      { word: 'thing', ipa: '/θɪŋ/' },
      { word: 'wing', ipa: '/wɪŋ/' },
      { word: 'wrong', ipa: '/rɔŋ/' },
      { word: 'young', ipa: '/jʌŋ/' }
    ]
  },
  'Consonant‑Voiced‑l': {
    beginning: [
      { word: 'land', ipa: '/lænd/' },
      { word: 'last', ipa: '/læst/' },
      { word: 'late', ipa: '/leɪt/' },
      { word: 'let', ipa: '/lɛt/' },
      { word: 'life', ipa: '/laɪf/' },
      { word: 'light', ipa: '/laɪt/' },
      { word: 'line', ipa: '/laɪn/' },
      { word: 'list', ipa: '/lɪst/' },
      { word: 'long', ipa: '/lɔŋ/' },
      { word: 'love', ipa: '/lʌv/' }
    ],
    middle: [
      { word: 'believe', ipa: '/bɪˈliv/' },
      { word: 'color', ipa: '/ˈkʌlɚ/' },
      { word: 'dollar', ipa: '/ˈdɑlɚ/' },
      { word: 'level', ipa: '/ˈlɛvəl/' },
      { word: 'little', ipa: '/ˈlɪtəl/' },
      { word: 'local', ipa: '/ˈloʊkəl/' },
      { word: 'million', ipa: '/ˈmɪljən/' },
      { word: 'public', ipa: '/ˈpʌblɪk/' },
      { word: 'valley', ipa: '/ˈvæli/' },
      { word: 'yellow', ipa: '/ˈjɛloʊ/' }
    ],
    ending: [
      { word: 'ball', ipa: '/bɔl/' },
      { word: 'call', ipa: '/kɔl/' },
      { word: 'cool', ipa: '/kul/' },
      { word: 'fall', ipa: '/fɔl/' },
      { word: 'full', ipa: '/fʊl/' },
      { word: 'mail', ipa: '/meɪl/' },
      { word: 'meal', ipa: '/mil/' },
      { word: 'school', ipa: '/skul/' },
      { word: 'tool', ipa: '/tul/' },
      { word: 'wall', ipa: '/wɔl/' }
    ]
  },
  'Consonant‑Voiced‑r': {
    uiNote: 'Dalam standar General American, suara /r/ di akhir kata menyatu dengan bunyi vokal menjadi r-colored vowel (seperti /ɚ/ atau /ɝ/). Maka dari itu, contoh difokuskan pada posisi awal dan tengah sebelum bunyi vokal.',
    beginning: [
      { word: 'race', ipa: '/reɪs/' },
      { word: 'rain', ipa: '/reɪn/' },
      { word: 'reach', ipa: '/ritʃ/' },
      { word: 'read', ipa: '/rid/' },
      { word: 'red', ipa: '/rɛd/' },
      { word: 'rich', ipa: '/rɪtʃ/' },
      { word: 'right', ipa: '/raɪt/' },
      { word: 'rise', ipa: '/raɪz/' },
      { word: 'river', ipa: '/ˈrɪvɚ/' },
      { word: 'road', ipa: '/roʊd/' },
      { word: 'rock', ipa: '/rɑk/' },
      { word: 'roll', ipa: '/roʊl/' },
      { word: 'room', ipa: '/rum/' },
      { word: 'round', ipa: '/raʊnd/' },
      { word: 'run', ipa: '/rʌn/' }
    ],
    middle: [
      { word: 'area', ipa: '/ˈɛriə/' },
      { word: 'current', ipa: '/ˈkɝənt/' },
      { word: 'direct', ipa: '/dəˈrɛkt/' },
      { word: 'direction', ipa: '/dɪˈrɛkʃən/' },
      { word: 'during', ipa: '/ˈdʊrɪŋ/' },
      { word: 'forest', ipa: '/ˈfɔrɪst/' },
      { word: 'generic', ipa: '/dʒəˈnɛrɪk/' },
      { word: 'library', ipa: '/ˈlaɪbrɛri/' },
      { word: 'marry', ipa: '/ˈmæri/' },
      { word: 'orange', ipa: '/ˈɔrɪndʒ/' },    // FIXED: Standarisasi vokal /ɪ/
      { word: 'parent', ipa: '/ˈpɛrənt/' },
      { word: 'period', ipa: '/ˈpɪriəd/' },
      { word: 'story', ipa: '/ˈstɔri/' },
      { word: 'very', ipa: '/ˈvɛri/' },
      { word: 'zero', ipa: '/ˈziroʊ/' }
    ]
  },
  'Consonant‑Voiced‑w': {
    uiNote: 'Suara /w/ merupakan semi-vokal (glide) yang secara fonotaktik hanya muncul sebelum vokal. Huruf "w" di akhir kata (seperti "law" atau "new") berfungsi sebagai bagian dari grafem vokal/diftong, bukan sebagai konsonan lepas.',
    beginning: [
      { word: 'wait', ipa: '/weɪt/' },
      { word: 'wake', ipa: '/weɪk/' },
      { word: 'walk', ipa: '/wɔk/' },
      { word: 'wall', ipa: '/wɔl/' },
      { word: 'want', ipa: '/wɑnt/' },
      { word: 'warm', ipa: '/wɔrm/' },
      { word: 'water', ipa: '/ˈwɑtɚ/' },
      { word: 'wave', ipa: '/weɪv/' },
      { word: 'way', ipa: '/weɪ/' },
      { word: 'we', ipa: '/wi/' },
      { word: 'well', ipa: '/wɛl/' },
      { word: 'win', ipa: '/wɪn/' },
      { word: 'word', ipa: '/wɝrd/' },
      { word: 'work', ipa: '/wɝk/' },
      { word: 'world', ipa: '/wɝld/' }
    ],
    middle: [
      { word: 'anyway', ipa: '/ˈɛniˌweɪ/' },
      { word: 'away', ipa: '/əˈweɪ/' },
      { word: 'backward', ipa: '/ˈbækwɚd/' },
      { word: 'forward', ipa: '/ˈfɔrwɚd/' },
      { word: 'halfway', ipa: '/ˈhæfˌweɪ/' },
      { word: 'hardware', ipa: '/ˈhɑrdˌwɛr/' },
      { word: 'highway', ipa: '/ˈhaɪˌweɪ/' },
      { word: 'language', ipa: '/ˈlæŋɡwɪdʒ/' },
      { word: 'reward', ipa: '/rɪˈwɔrd/' },
      { word: 'software', ipa: '/ˈsɔftˌwɛr/' },
      { word: 'someone', ipa: '/ˈsʌmˌwʌn/' },
      { word: 'sweet', ipa: '/swit/' },
      { word: 'swim', ipa: '/swɪm/' },
      { word: 'twenty', ipa: '/ˈtwɛnti/' },
      { word: 'twist', ipa: '/twɪst/' }
    ]
  },
  'Consonant‑Voiced‑j': {
    uiNote: 'Suara /j/ (y) merupakan semi-vokal (glide) yang secara fonotaktik hanya berfungsi sebelum bunyi vokal (onset). Huruf "y" di akhir kata (seperti "boy" atau "many") diucapkan sebagai bagian dari bunyi vokal murni, bukan konsonan lepas /j/.',
    beginning: [
      { word: 'yard', ipa: '/jɑrd/' },
      { word: 'yarn', ipa: '/jɑrn/' },
      { word: 'yawn', ipa: '/jɔn/' },
      { word: 'year', ipa: '/jɪr/' },
      { word: 'yell', ipa: '/jɛl/' },
      { word: 'yellow', ipa: '/ˈjɛloʊ/' },
      { word: 'yes', ipa: '/jɛs/' },
      { word: 'yesterday', ipa: '/ˈjɛstɚˌdeɪ/' },
      { word: 'yield', ipa: '/jild/' },
      { word: 'yoga', ipa: '/ˈjoʊɡə/' },
      { word: 'yolk', ipa: '/joʊk/' },
      { word: 'you', ipa: '/ju/' },
      { word: 'young', ipa: '/jʌŋ/' },
      { word: 'your', ipa: '/jɔr/' },
      { word: 'youth', ipa: '/juθ/' }
    ],
    middle: [
      { word: 'argue', ipa: '/ˈɑrɡju/' },
      { word: 'beautiful', ipa: '/ˈbjutɪfəl/' }, // FIXED: Standarisasi vokal /ɪ/
      { word: 'beyond', ipa: '/bɪˈjɑnd/' },
      { word: 'computer', ipa: '/kəmˈpjutɚ/' },
      { word: 'future', ipa: '/ˈfjutʃɚ/' },
      { word: 'huge', ipa: '/hjudʒ/' },
      { word: 'million', ipa: '/ˈmɪljən/' },
      { word: 'music', ipa: '/ˈmjuzɪk/' },
      { word: 'onion', ipa: '/ˈʌnjən/' },
      { word: 'regular', ipa: '/ˈrɛɡjəlɚ/' },
      { word: 'rescue', ipa: '/ˈrɛskju/' },
      { word: 'senior', ipa: '/ˈsinjɚ/' },
      { word: 'value', ipa: '/ˈvælju/' },
      { word: 'view', ipa: '/vju/' },
      { word: 'volume', ipa: '/ˈvɑljum/' }
    ]
  }
};