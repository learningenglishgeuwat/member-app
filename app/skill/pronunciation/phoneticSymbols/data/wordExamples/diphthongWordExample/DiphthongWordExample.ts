// Diphthong Examples
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

export const diphthongExamples: SymbolWordExamples = {
  'aɪ': {
    beginning: [
      { word: 'ice', ipa: '/aɪs/' },
      { word: 'icon', ipa: '/ˈaɪkɑn/' },
      { word: 'idea', ipa: '/aɪˈdiə/' },
      { word: 'idle', ipa: '/ˈaɪdəl/' },
      { word: 'iris', ipa: '/ˈaɪrɪs/' },
      { word: 'iron', ipa: '/ˈaɪɚn/' },
      { word: 'island', ipa: '/ˈaɪlənd/' },
      { word: 'isolate', ipa: '/ˈaɪsəleɪt/' },
      { word: 'item', ipa: '/ˈaɪtəm/' },
      { word: 'ivory', ipa: '/ˈaɪvəri/' }
    ],
    middle: [
      { word: 'fight', ipa: '/faɪt/' },
      { word: 'fine', ipa: '/faɪn/' },
      { word: 'kind', ipa: '/kaɪnd/' },
      { word: 'light', ipa: '/laɪt/' },
      { word: 'line', ipa: '/laɪn/' },
      { word: 'night', ipa: '/naɪt/' },
      { word: 'nine', ipa: '/naɪn/' },
      { word: 'right', ipa: '/raɪt/' },
      { word: 'tight', ipa: '/taɪt/' },
      { word: 'time', ipa: '/taɪm/' }
    ],
    ending: [
      { word: 'buy', ipa: '/baɪ/' },
      { word: 'cry', ipa: '/kraɪ/' },
      { word: 'fly', ipa: '/flaɪ/' },
      { word: 'guy', ipa: '/ɡaɪ/' },
      { word: 'high', ipa: '/haɪ/' },
      { word: 'my', ipa: '/maɪ/' },
      { word: 'sky', ipa: '/skaɪ/' },
      { word: 'tie', ipa: '/taɪ/' },
      { word: 'try', ipa: '/traɪ/' },
      { word: 'why', ipa: '/waɪ/' }
    ]
  },
  'eɪ': {
    beginning: [
      { word: 'able', ipa: '/ˈeɪbəl/' },
      { word: 'ache', ipa: '/eɪk/' },
      { word: 'acorn', ipa: '/ˈeɪkɔrn/' },
      { word: 'age', ipa: '/eɪdʒ/' },
      { word: 'agent', ipa: '/ˈeɪdʒənt/' },
      { word: 'aim', ipa: '/eɪm/' },
      { word: 'alien', ipa: '/ˈeɪljən/' },
      { word: 'ape', ipa: '/eɪp/' },
      { word: 'apron', ipa: '/ˈeɪprən/' },
      { word: 'asia', ipa: '/ˈeɪʒə/' }
    ],
    middle: [
      { word: 'date', ipa: '/deɪt/' },
      { word: 'game', ipa: '/ɡeɪm/' },
      { word: 'gate', ipa: '/ɡeɪt/' },
      { word: 'late', ipa: '/leɪt/' },
      { word: 'main', ipa: '/meɪn/' },
      { word: 'name', ipa: '/neɪm/' },
      { word: 'rain', ipa: '/reɪn/' },
      { word: 'same', ipa: '/seɪm/' },
      { word: 'state', ipa: '/steɪt/' },
      { word: 'train', ipa: '/treɪn/' }
    ],
    ending: [
      { word: 'away', ipa: '/əˈweɪ/' },
      { word: 'day', ipa: '/deɪ/' },
      { word: 'gray', ipa: '/ɡreɪ/' },
      { word: 'lay', ipa: '/leɪ/' },
      { word: 'may', ipa: '/meɪ/' },
      { word: 'pay', ipa: '/peɪ/' },
      { word: 'play', ipa: '/pleɪ/' },
      { word: 'say', ipa: '/seɪ/' },
      { word: 'stay', ipa: '/steɪ/' },
      { word: 'way', ipa: '/weɪ/' }
    ]
  },
  'ɔɪ': {
    uiNote: 'Suara ini cukup jarang ditemukan di awal kata, umumnya hanya muncul pada kata dasar "oil" beserta turunannya.',
    beginning: [
      { word: 'oil', ipa: '/ɔɪl/' },
      { word: 'oilfield', ipa: '/ˈɔɪlfild/' },
      { word: 'oily', ipa: '/ˈɔɪli/' },
      { word: 'ointment', ipa: '/ˈɔɪntmənt/' },
      { word: 'oyster', ipa: '/ˈɔɪstɚ/' }
    ],
    middle: [
      { word: 'avoid', ipa: '/əˈvɔɪd/' },
      { word: 'boil', ipa: '/bɔɪl/' },
      { word: 'choice', ipa: '/tʃɔɪs/' },
      { word: 'coin', ipa: '/kɔɪn/' },
      { word: 'foist', ipa: '/fɔɪst/' },
      { word: 'invoice', ipa: '/ˈɪnvɔɪs/' },
      { word: 'join', ipa: '/dʒɔɪn/' },
      { word: 'loyal', ipa: '/ˈlɔɪəl/' },
      { word: 'moist', ipa: '/mɔɪst/' },
      { word: 'noise', ipa: '/nɔɪz/' },
      { word: 'point', ipa: '/pɔɪnt/' },
      { word: 'poison', ipa: '/ˈpɔɪzən/' },
      { word: 'royal', ipa: '/ˈrɔɪəl/' },
      { word: 'soil', ipa: '/sɔɪl/' },
      { word: 'spoiled', ipa: '/spɔɪld/' }
    ],
    ending: [
      { word: 'annoy', ipa: '/əˈnɔɪ/' },
      { word: 'boy', ipa: '/bɔɪ/' },
      { word: 'coy', ipa: '/kɔɪ/' },
      { word: 'destroy', ipa: '/dɪˈstrɔɪ/' },
      { word: 'employ', ipa: '/ɛmˈplɔɪ/' },
      { word: 'enjoy', ipa: '/ɛnˈdʒɔɪ/' },
      { word: 'joy', ipa: '/dʒɔɪ/' },
      { word: 'rejoin', ipa: '/riˈdʒɔɪn/' },
      { word: 'soy', ipa: '/sɔɪ/' },
      { word: 'toy', ipa: '/tɔɪ/' }
    ]
  },
  'ɪr': {
    uiNote: 'Di awal kata, kombinasi suara ini sangat terbatas dan hampir selalu diwakili oleh rumpun kata "ear".',
    beginning: [
      { word: 'ear', ipa: '/ɪr/' },
      { word: 'earlobe', ipa: '/ˈɪrloʊb/' },
      { word: 'earmuff', ipa: '/ˈɪrmʌf/' },
      { word: 'earring', ipa: '/ˈɪrɪŋ/' },
      { word: 'eerie', ipa: '/ˈɪri/' }
    ],
    middle: [
      { word: 'clearing', ipa: '/ˈklɪrɪŋ/' },
      { word: 'criteria', ipa: '/kraɪˈtɪriə/' },
      { word: 'experience', ipa: '/ɪkˈspɪriəns/' },
      { word: 'inferior', ipa: '/ɪnˈfɪriɚ/' },
      { word: 'interior', ipa: '/ɪnˈtɪriɚ/' },
      { word: 'material', ipa: '/məˈtɪriəl/' },
      { word: 'nearly', ipa: '/ˈnɪrli/' },
      { word: 'period', ipa: '/ˈpɪriəd/' },
      { word: 'serious', ipa: '/ˈsɪriəs/' },
      { word: 'superior', ipa: '/suˈpɪriɚ/' }
    ],
    ending: [
      { word: 'appear', ipa: '/əˈpɪr/' },
      { word: 'beer', ipa: '/bɪr/' },
      { word: 'career', ipa: '/kəˈrɪr/' },
      { word: 'cheer', ipa: '/tʃɪr/' },
      { word: 'clear', ipa: '/klɪr/' },
      { word: 'deer', ipa: '/dɪr/' },
      { word: 'disappear', ipa: '/ˌdɪsəˈpɪr/' },
      { word: 'engineer', ipa: '/ˌɛndʒəˈnɪr/' },
      { word: 'fear', ipa: '/fɪr/' },
      { word: 'gear', ipa: '/ɡɪr/' },
      { word: 'hear', ipa: '/hɪr/' },
      { word: 'near', ipa: '/nɪr/' },
      { word: 'sphere', ipa: '/sfɪr/' },
      { word: 'volunteer', ipa: '/ˌvɑlənˈtɪr/' },
      { word: 'year', ipa: '/jɪr/' }
    ]
  },
  'ɛr': {
    beginning: [
      { word: 'air', ipa: '/ɛr/' },
      { word: 'airborne', ipa: '/ˈɛrbɔrn/' },
      { word: 'airman', ipa: '/ˈɛrmæn/' },
      { word: 'airplane', ipa: '/ˈɛrpleɪn/' },
      { word: 'airport', ipa: '/ˈɛrpɔrt/' },
      { word: 'airtight', ipa: '/ˈɛrtaɪt/' },
      { word: 'airway', ipa: '/ˈɛrweɪ/' },
      { word: 'airy', ipa: '/ˈɛri/' },
      { word: 'errand', ipa: '/ˈɛrənd/' },
      { word: 'heir', ipa: '/ɛr/' }
    ],
    middle: [
      { word: 'barely', ipa: '/ˈbɛrli/' },
      { word: 'careful', ipa: '/ˈkɛrfəl/' },
      { word: 'hardware', ipa: '/ˈhɑrdwɛr/' },
      { word: 'nightmare', ipa: '/ˈnaɪtmɛr/' },
      { word: 'rarely', ipa: '/ˈrɛrli/' },
      { word: 'scarecrow', ipa: '/ˈskɛrkroʊ/' },
      { word: 'sharing', ipa: '/ˈʃɛrɪŋ/' },
      { word: 'software', ipa: '/ˈsɑftwɛr/' },
      { word: 'staircase', ipa: '/ˈstɛrkeɪs/' },
      { word: 'welfare', ipa: '/ˈwɛlfɛr/' }
    ],
    ending: [
      { word: 'care', ipa: '/kɛr/' },
      { word: 'chair', ipa: '/tʃɛr/' },
      { word: 'compare', ipa: '/kəmˈpɛr/' },
      { word: 'declare', ipa: '/dɪˈklɛr/' },
      { word: 'fair', ipa: '/fɛr/' },
      { word: 'hair', ipa: '/hɛr/' },
      { word: 'pair', ipa: '/pɛr/' },
      { word: 'prepare', ipa: '/prɪˈpɛr/' },
      { word: 'share', ipa: '/ʃɛr/' },
      { word: 'stair', ipa: '/stɛr/' }
    ]
  },
  'ʊr': {
    uiNote: 'Suara ini tidak ditemukan di awal kata dalam kosakata baku bahasa Inggris standar.',
    middle: [
      { word: 'courier', ipa: '/ˈkʊriɚ/' },
      { word: 'curious', ipa: '/ˈkjʊriəs/' },
      { word: 'during', ipa: '/ˈdʊrɪŋ/' },
      { word: 'furious', ipa: '/ˈfjʊriəs/' },
      { word: 'fury', ipa: '/ˈfjʊri/' },
      { word: 'gourd', ipa: '/ɡʊrd/' },
      { word: 'jury', ipa: '/ˈdʒʊri/' },
      { word: 'maturity', ipa: '/məˈtʃʊrəti/' },
      { word: 'plural', ipa: '/ˈplʊrəl/' },
      { word: 'purity', ipa: '/ˈpjʊrəti/' },
      { word: 'rural', ipa: '/ˈrʊrəl/' },
      { word: 'security', ipa: '/sɪˈkjʊrəti/' },
      { word: 'tourist', ipa: '/ˈtʊrɪst/' },
      { word: 'yours', ipa: '/jʊrz/' },
      { word: 'yourself', ipa: '/jʊrˈsɛlf/' }
    ],
    ending: [
      { word: 'allure', ipa: '/əˈlʊr/' },
      { word: 'brochure', ipa: '/broʊˈʃʊr/' },
      { word: 'cure', ipa: '/kjʊr/' },
      { word: 'endure', ipa: '/ɪnˈdʊr/' },
      { word: 'insure', ipa: '/ɪnˈʃʊr/' },
      { word: 'lure', ipa: '/lʊr/' },
      { word: 'mature', ipa: '/məˈtʃʊr/' },
      { word: 'obscure', ipa: '/əbˈskjʊr/' },
      { word: 'poor', ipa: '/pʊr/' },
      { word: 'pure', ipa: '/pjʊr/' },
      { word: 'reassure', ipa: '/ˌriəˈʃʊr/' },
      { word: 'secure', ipa: '/sɪˈkjʊr/' },
      { word: 'sure', ipa: '/ʃʊr/' },
      { word: 'tour', ipa: '/tʊr/' },
      { word: 'your', ipa: '/jʊr/' }
    ]
  },
  'oʊ': {
    beginning: [
      { word: 'oak', ipa: '/oʊk/' },
      { word: 'oat', ipa: '/oʊt/' },
      { word: 'oboe', ipa: '/ˈoʊboʊ/' },
      { word: 'ocean', ipa: '/ˈoʊʃən/' },
      { word: 'old', ipa: '/oʊld/' },
      { word: 'only', ipa: '/ˈoʊnli/' },
      { word: 'open', ipa: '/ˈoʊpən/' },
      { word: 'oval', ipa: '/ˈoʊvəl/' },
      { word: 'over', ipa: '/ˈoʊvɚ/' },
      { word: 'own', ipa: '/oʊn/' }
    ],
    middle: [
      { word: 'boat', ipa: '/boʊt/' },
      { word: 'bone', ipa: '/boʊn/' },
      { word: 'coat', ipa: '/koʊt/' },
      { word: 'cold', ipa: '/koʊld/' },
      { word: 'gold', ipa: '/ɡoʊld/' },
      { word: 'home', ipa: '/hoʊm/' },
      { word: 'most', ipa: '/moʊst/' },
      { word: 'road', ipa: '/roʊd/' },
      { word: 'soap', ipa: '/soʊp/' },
      { word: 'stone', ipa: '/stoʊn/' }
    ],
    ending: [
      { word: 'blow', ipa: '/bloʊ/' },
      { word: 'go', ipa: '/ɡoʊ/' },
      { word: 'grow', ipa: '/ɡroʊ/' },
      { word: 'know', ipa: '/noʊ/' },
      { word: 'low', ipa: '/loʊ/' },
      { word: 'no', ipa: '/noʊ/' },
      { word: 'show', ipa: '/ʃoʊ/' },
      { word: 'snow', ipa: '/snoʊ/' },
      { word: 'so', ipa: '/soʊ/' },
      { word: 'throw', ipa: '/θroʊ/' }
    ]
  },
  'aʊ': {
    beginning: [
      { word: 'hour', ipa: '/aʊɚ/' },
      { word: 'ounce', ipa: '/aʊns/' },
      { word: 'our', ipa: '/aʊɚ/' },
      { word: 'ours', ipa: '/aʊɚz/' },
      { word: 'oust', ipa: '/aʊst/' },
      { word: 'out', ipa: '/aʊt/' },
      { word: 'outline', ipa: '/ˈaʊtlaɪn/' },
      { word: 'outlook', ipa: '/ˈaʊtlʊk/' },
      { word: 'outside', ipa: '/ˈaʊtsaɪd/' },
      { word: 'owl', ipa: '/aʊl/' }
    ],
    middle: [
      { word: 'brown', ipa: '/braʊn/' },
      { word: 'down', ipa: '/daʊn/' },
      { word: 'found', ipa: '/faʊnd/' },
      { word: 'ground', ipa: '/ˈɡraʊnd/' },
      { word: 'house', ipa: '/haʊs/' },
      { word: 'mouse', ipa: '/maʊs/' },
      { word: 'mouth', ipa: '/maʊθ/' },
      { word: 'round', ipa: '/raʊnd/' },
      { word: 'sound', ipa: '/saʊnd/' },
      { word: 'town', ipa: '/taʊn/' }
    ],
    ending: [
      { word: 'allow', ipa: '/əˈlaʊ/' },
      { word: 'bough', ipa: '/baʊ/' },
      { word: 'brow', ipa: '/braʊ/' },
      { word: 'chow', ipa: '/tʃaʊ/' },
      { word: 'cow', ipa: '/kaʊ/' },
      { word: 'how', ipa: '/haʊ/' },
      { word: 'now', ipa: '/naʊ/' },
      { word: 'plow', ipa: '/plaʊ/' },
      { word: 'vow', ipa: '/vaʊ/' },
      { word: 'wow', ipa: '/waʊ/' }
    ]
  }
};