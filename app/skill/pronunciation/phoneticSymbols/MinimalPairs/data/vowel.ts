import type { PartialMinimalPair } from './shared';

export const vowelPairs: PartialMinimalPair[] = [
  {
    id: 'vowel-ɪ-i',
    category: 'vowel',
    pairLabel: '\u026a \u2194 i',
    videoId: 'rX96zUAApyo',
    words: [
      { a: 'sit', b: 'seat', ipaA: 's\u026at', ipaB: 'sit' },
      { a: 'ship', b: 'sheep', ipaA: '\u0283\u026ap', ipaB: '\u0283ip' },
      { a: 'bit', b: 'beat', ipaA: 'b\u026at', ipaB: 'bit' },
      { a: 'live', b: 'leave', ipaA: 'l\u026av', ipaB: 'liv', ttsA: 'to live', ttsB: 'leave' },
      { a: 'fill', b: 'feel', ipaA: 'f\u026al', ipaB: 'fil' },
      { a: 'fit', b: 'feet', ipaA: 'f\u026at', ipaB: 'fit' },
      { a: 'slip', b: 'sleep', ipaA: 'sl\u026ap', ipaB: 'slip' },
      { a: 'rich', b: 'reach', ipaA: 'r\u026a\u02a7', ipaB: 'ri\u02a7' },
      { a: 'will', b: 'wheel', ipaA: 'w\u026al', ipaB: 'wil' },
      { a: 'lid', b: 'lead', ipaA: 'l\u026ad', ipaB: 'lid' },
    ],
    sentences: [
      { 
        a: 'I will sit here.', 
        b: 'I will seat her.', 
        ipaA: 'aɪ wɪl sɪt hɪr', // FIX: Rapat sempurna per kata, bebas spasi karakter
        ipaB: 'aɪ wɪl sit hɜr'  // FIX: Rapat sempurna per kata
      },
      { 
        a: 'The ship is large.', 
        b: 'The sheep is large.', 
        ipaA: 'ðə ʃɪp ɪz lɑrdʒ', 
        ipaB: 'ðə ʃip ɪz lɑrdʒ' 
      },
      { 
        a: "Don't slip tonight.", 
        b: "Don't sleep tonight.", 
        ipaA: 'doʊnt slɪp təˈnaɪt', 
        ipaB: 'doʊnt slip təˈnaɪt' 
      },
      { 
        a: 'They live nearby.', 
        b: 'They leave nearby.', 
        ipaA: 'ðeɪ lɪv ˌnɪrˈbaɪ', 
        ipaB: 'ðeɪ liv ˌnɪrˈbaɪ' 
      },
      { 
        a: 'Please fill the cup.', 
        b: 'Please feel the cup.', 
        ipaA: 'pliz fɪl ðə kʌp', // FIX: Konsisten rapi per kata
        ipaB: 'pliz fil ðə kʌp'  // FIX: Kata "pliz" sudah dirapatkan, tidak pecah lagi
      },
    ],
  },
  {
    id: 'vowel-æ-ɛ',
    category: 'vowel',
    pairLabel: '\u00e6 \u2194 \u025b',
    videoId: 'II9KgEF3K7E',
    words: [
      { a: 'bat', b: 'bet', ipaA: 'bæt', ipaB: 'bɛt' },
      { a: 'bad', b: 'bed', ipaA: 'bæd', ipaB: 'bɛd' },
      { a: 'man', b: 'men', ipaA: 'mæn', ipaB: 'mɛn' },
      { a: 'pan', b: 'pen', ipaA: 'pæn', ipaB: 'pɛn' },
      { a: 'sat', b: 'set', ipaA: 'sæt', ipaB: 'sɛt' },
      { a: 'mat', b: 'met', ipaA: 'mæt', ipaB: 'mɛt' },
      { a: 'bag', b: 'beg', ipaA: 'bæg', ipaB: 'bɛg' },
      { a: 'tan', b: 'ten', ipaA: 'tæn', ipaB: 'tɛn' },
      { a: 'ham', b: 'hem', ipaA: 'hæm', ipaB: 'hɛm' },
      { a: 'had', b: 'head', ipaA: 'hæd', ipaB: 'hɛd' },
    ],
    sentences: [
      { 
        a: 'The bat flew out at dusk.', 
        b: 'I bet he will arrive soon.', 
        ipaA: 'ðə bæt flu aʊt ət dʌsk', 
        ipaB: 'aɪ bɛt hi wɪl əˈraɪv sun' 
      },
      { 
        a: 'That was a bad call.', 
        b: 'The bed is near the window.', 
        ipaA: 'ðæt wʌz ə bæd kɔl', 
        ipaB: 'ðə bɛd ɪz nɪr ðə ˈwɪndoʊ' 
      },
      { 
        a: 'That man is my uncle.', 
        b: 'Two men are waiting outside.', 
        ipaA: 'ðæt mæn ɪz maɪ ˈʌŋkəl', 
        ipaB: 'tu mɛn ɑr ˈweɪtɪŋ ˌaʊtˈsaɪd' 
      },
      { 
        a: 'Use the pan on low heat.', 
        b: 'Sign with the blue pen.', 
        ipaA: 'juz ðə pæn ɑn loʊ hit', 
        ipaB: 'saɪn wɪð ðə blu pɛn' 
      },
      { 
        a: 'The cat sat on the rug.', 
        b: 'Please set the glass down.', 
        ipaA: 'ðə kæt sæt ɑn ðə rʌg', 
        ipaB: 'pliz sɛt ðə glæs daʊn' 
      },
    ],
  },
  {
    id: 'vowel-æ-ɑ',
    category: 'vowel',
    pairLabel: '\u00e6 \u2194 \u0251',
    videoId: 'rBFB2VXmAI0',
    words: [
      { a: 'cap', b: 'cop', ipaA: 'kæp', ipaB: 'kɑp' },
      { a: 'bat', b: 'bot', ipaA: 'bæt', ipaB: 'bɑt' },
      { a: 'cat', b: 'cot', ipaA: 'kæt', ipaB: 'kɑt' },
      { a: 'sack', b: 'sock', ipaA: 'sæk', ipaB: 'sɑk' },
      { a: 'map', b: 'mop', ipaA: 'mæp', ipaB: 'mɑp' },
      { a: 'shack', b: 'shock', ipaA: '\u0283æk', ipaB: '\u0283\u0251k' },
      { a: 'lack', b: 'lock', ipaA: 'læk', ipaB: 'lɑk' },
      { a: 'tap', b: 'top', ipaA: 'tæp', ipaB: 'tɑp' },
      { a: 'can', b: 'con', ipaA: 'kæn', ipaB: 'kɑn' },
      { a: 'hat', b: 'hot', ipaA: 'hæt', ipaB: 'hɑt' },
    ],
    sentences: [
      { 
        a: 'Put on your cap now.', 
        b: 'The cop stood by the gate.', 
        ipaA: 'pʊt ɑn jər kæp naʊ', 
        ipaB: 'ðə kɑp stʊd baɪ ðə geɪt' 
      },
      { 
        a: 'The bat is in the cave.', 
        b: 'The bot replied quickly.', 
        ipaA: 'ðə bæt ɪz ɪn ðə keɪv', 
        ipaB: 'ðə bɑt rɪˈplaɪd ˈkwɪkli' 
      },
      { 
        a: 'My cat sleeps all day.', 
        b: 'The cot is by the wall.', 
        ipaA: 'maɪ kæt slips ɔl deɪ', 
        ipaB: 'ðə kɑt ɪz baɪ ðə wɔl' 
      },
      { 
        a: 'Take this map with you.', 
        b: 'Use a mop on the floor.', 
        ipaA: 'teɪk ðɪs mæp wɪð ju', 
        ipaB: 'juz ə mɑp ɑn ðə flɔr' 
      },
      { 
        a: 'My hat is on the chair.', 
        b: 'This soup is too hot.', 
        ipaA: 'maɪ hæt ɪz ɑn ðə tʃɛr', 
        ipaB: 'ðɪs sup ɪz tu hɑt' 
      },
    ],
  },
  {
    id: 'vowel-ʊ-u',
    category: 'vowel',
    pairLabel: '\u028a \u2194 u',
    videoId: 'nEhnJj_bLbM',
    words: [
      { a: 'pull', b: 'pool', ipaA: 'pʊl', ipaB: 'pul' },
      { a: 'full', b: 'fool', ipaA: 'fʊl', ipaB: 'ful' },
      { a: 'look', b: 'Luke', ipaA: 'lʊk', ipaB: 'luk' },
      { a: 'could', b: 'cooed', ipaA: 'kʊd', ipaB: 'kud' },
      { a: 'would', b: 'wooed', ipaA: 'wʊd', ipaB: 'wud' },
      { a: 'soot', b: 'suit', ipaA: 'sʊt', ipaB: 'sut' },
      { a: 'hood', b: "who'd", ipaA: 'hʊd', ipaB: 'hud' },
      { a: 'cook', b: 'kook', ipaA: 'kʊk', ipaB: 'kuk' },
      { a: 'should', b: 'shooed', ipaA: '\u0283ʊd', ipaB: '\u0283ud' },
      { a: 'good', b: 'gooed', ipaA: 'gʊd', ipaB: 'gud' },
    ],
    sentences: [
      { 
        a: 'Pull the rope slowly.', 
        b: 'The pool opens at noon.', 
        ipaA: 'pʊl ðə roʊp ˈsloʊli', 
        ipaB: 'ðə pul ˈoʊpənz ət nun' 
      },
      { 
        a: 'The basket is full.', 
        b: 'Do not fool your friend.', 
        ipaA: 'ðə ˈbæskət ɪz fʊl', 
        ipaB: 'du nɑt ful jər frɛnd' 
      },
      { 
        a: 'Look at that sign.', 
        b: 'Luke is waiting outside.', 
        ipaA: 'lʊk ət ðæt saɪn', 
        ipaB: 'luk ɪz ˈweɪtɪŋ ˌaʊtˈsaɪd' 
      },
      { 
        a: 'I could help today.', 
        b: 'The dove cooed all day.', 
        ipaA: 'aɪ kʊd hɛlp təˈdeɪ', 
        ipaB: 'ðə dʌv kud ɔl deɪ' 
      },
      { 
        a: 'We would leave early.', 
        b: 'The pair wooed for years.', 
        ipaA: 'wi wʊd liv ˈɜrli', 
        ipaB: 'ðə pɛr wud fər jɪrz' 
      },
    ],
  },
  {
    id: 'vowel-ʌ-ɑ',
    category: 'vowel',
    pairLabel: '\u028c \u2194 \u0251',
    videoId: 'e6rjJiOxVCs',
    words: [
      { a: 'cut', b: 'cot', ipaA: 'kʌt', ipaB: 'kɑt' },
      { a: 'luck', b: 'lock', ipaA: 'lʌk', ipaB: 'lɑk' },
      { a: 'duck', b: 'dock', ipaA: 'dʌk', ipaB: 'dɑk' },
      { a: 'cup', b: 'cop', ipaA: 'kʌp', ipaB: 'kɑp' },
      { a: 'hut', b: 'hot', ipaA: 'hʌt', ipaB: 'hɑt' },
      { a: 'run', b: 'Ron', ipaA: 'rʌn', ipaB: 'rɑn' },
      { a: 'nut', b: 'not', ipaA: 'n\u028ct', ipaB: 'n\u0251t' },
      { a: 'bug', b: 'bog', ipaA: 'bʌg', ipaB: 'bɑg' },
      { a: 'mud', b: 'mod', ipaA: 'mʌd', ipaB: 'mɑd' },
      { a: 'stuck', b: 'stock', ipaA: 'stʌk', ipaB: 'stɑk' },
    ],
    sentences: [
      { 
        a: 'Cut the paper cleanly.', 
        b: 'The cot is near the bed.', 
        ipaA: 'kʌt ðə ˈpeɪpər ˈklinli', 
        ipaB: 'ðə kɑt ɪz nɪr ðə bɛd' 
      },
      { 
        a: 'Good luck on your test.', 
        b: 'Lock the front door now.', 
        ipaA: 'gʊd lʌk ɑn jər tɛst', 
        ipaB: 'lɑk ðə frʌnt dɔr naʊ' 
      },
      { 
        a: 'The duck swam away fast.', 
        b: 'The dock is behind the shop.', 
        ipaA: 'ðə dʌk swæm əˈweɪ fæst', 
        ipaB: 'ðə dɑk ɪz bɪˈhaɪnd ðə ʃɑp' 
      },
      { 
        a: 'Put the cup on the desk.', 
        b: 'The cop stood by the gate.', 
        ipaA: 'pʊt ðə kʌp ɑn ðə dɛsk', 
        ipaB: 'ðə kɑp stʊd baɪ ðə geɪt' 
      },
      { 
        a: 'I run every morning.', 
        b: 'Ron calls every Sunday.', 
        ipaA: 'aɪ rʌn ˈɛvri ˈmɔrnɪŋ', 
        ipaB: 'rɑn kɔlz ˈɛvri ˈsʌndeɪ' 
      },
    ],
  },
  {
    id: 'vowel-ə-ɛ',
    category: 'vowel',
    pairLabel: '\u0259 \u2194 \u025b',
    videoId: 'rqU4DTeQc5E',
    words: [
      { a: 'banana', b: 'bed', ipaA: 'bəˈnænə', ipaB: 'bɛd' },
      { a: 'balloon', b: 'bell', ipaA: 'bəˈlun', ipaB: 'bɛl' },
      { a: 'police', b: 'pen', ipaA: 'pəˈlis', ipaB: 'pɛn' },
      { a: 'potato', b: 'pet', ipaA: 'pəˈteɪtoʊ', ipaB: 'pɛt' },
      { a: 'today', b: 'ten', ipaA: 'təˈdeɪ', ipaB: 'tɛn' },
      { a: 'machine', b: 'met', ipaA: 'məˈʃin', ipaB: 'mɛt' },
      { a: 'garage', b: 'get', ipaA: 'gəˈrɑʒ', ipaB: 'gɛt' },
      { a: 'support', b: 'set', ipaA: 'səˈpɔrt', ipaB: 'sɛt' },
      { a: 'facade', b: 'fed', ipaA: 'fəˈsɑd', ipaB: 'fɛd' },
      { a: 'vanilla', b: 'vest', ipaA: 'vəˈnɪlə', ipaB: 'vɛst' },
    ],
    sentences: [
      { 
        a: 'I ate a yellow banana.', 
        b: 'Go to bed right now.', 
        ipaA: 'aɪ eɪt ə ˈjɛloʊ bəˈnænə', 
        ipaB: 'goʊ tə bɛd raɪt naʊ' 
      },
      { 
        a: 'Call the police quickly.', 
        b: 'Write it down with a pen.', 
        ipaA: 'kɔl ðə pəˈlis ˈkwɪkli', 
        ipaB: 'raɪt ɪt daʊn wɪð ə pɛn' 
      },
      { 
        a: 'I have a meeting today.', 
        b: 'Count from one to ten.', 
        ipaA: 'aɪ hæv ə ˈmitɪŋ təˈdeɪ', 
        ipaB: 'kaʊnt frəm wʌn tə tɛn' 
      },
      { 
        a: 'Fix the washing machine.', 
        b: 'We met at the station.', 
        ipaA: 'fɪks ðə ˈwɑʃɪŋ məˈʃin', 
        ipaB: 'wi mɛt ət ðə ˈsteɪʃən' 
      },
      { 
        a: 'Thank you for your support.', 
        b: 'Please set the glass down.', 
        ipaA: 'θæŋk ju fər jər səˈpɔrt', 
        ipaB: 'pliz sɛt ðə glæs daʊn' 
      },
    ],
  },
  {
    id: 'vowel-ɔ-ɑ',
    category: 'vowel',
    pairLabel: '\u0254 \u2194 \u0251',
    videoId: '1Kjyf1D7jvE',
    words: [
      { a: 'caught', b: 'cot', ipaA: 'kɔt', ipaB: 'kɑt' },
      { a: 'dawn', b: 'don', ipaA: 'dɔn', ipaB: 'dɑn' },
      { a: 'walk', b: 'wok', ipaA: 'wɔk', ipaB: 'wɑk' },
      { a: 'talk', b: 'tock', ipaA: 'tɔk', ipaB: 'tɑk' },
      { a: 'bought', b: 'bot', ipaA: 'bɔt', ipaB: 'bɑt' },
      { a: 'law', b: 'la', ipaA: 'lɔ', ipaB: 'lɑ' },
      { a: 'awe', b: 'ah', ipaA: 'ɔ', ipaB: 'ɑ' },
      { a: 'stalk', b: 'stock', ipaA: 'stɔk', ipaB: 'stɑk' },
      { a: 'wrought', b: 'rot', ipaA: 'rɔt', ipaB: 'rɑt' },
      { a: 'chalk', b: 'chock', ipaA: '\u02a7\u0254k', ipaB: '\u02a7\u0251k' },
    ],
    sentences: [
      { 
        a: 'I caught the last bus.', 
        b: 'The cot is near the bed.', 
        ipaA: 'aɪ kɔt ðə læst bʌs', 
        ipaB: 'ðə kɑt ɪz nɪr ðə bɛd' 
      },
      { 
        a: 'Dawn arrives very early.', 
        b: 'Don left his keys here.', 
        ipaA: 'dɔn əˈraɪvz ˈvɛri ˈɜrli', 
        ipaB: 'dɑn lɛft hɪz kiz hɪr' 
      },
      { 
        a: 'Walk to the station.', 
        b: 'The wok is on the stove.', 
        ipaA: 'wɔk tə ðə ˈsteɪʃən', 
        ipaB: 'ðə wɑk ɪz ɑn ðə stoʊv' 
      },
      { 
        a: 'Talk a little louder.', 
        b: 'I heard a loud tock.', 
        ipaA: 'tɔk ə ˈlɪtəl ˈlaʊdər', 
        ipaB: 'aɪ hɜrd ə laʊd tɑk' 
      },
      { 
        a: 'She bought fresh bread.', 
        b: 'The bot sent a quick reply.', 
        ipaA: 'ʃi bɔt frɛʃ brɛd', 
        ipaB: 'ðə bɑt sɛnt ə kwɪk rɪˈplaɪ' 
      },
    ],
  }
];