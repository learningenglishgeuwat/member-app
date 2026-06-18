'use client'

export type BritishWordNote = {
  word: string;
  britishIpa: string;
  americanIpa: string;
};

export type BritishSymbolNote = {
  id: string;
  title: string;
  description: string;
  items: BritishWordNote[];
};

export const AME_VS_BRE_BRITISH_NOTES: BritishSymbolNote[] = [
  {
    id: 'r',
    title: 'Suara /r/',
    description: 'Perbedaan pada pengucapan fonem /r/ di akhir silabel. BrE (Non-rhotic) menghilangkan /r/, sedangkan AmE (Rhotic) selalu mempertahankannya.',
    items: [
      { word: 'car', britishIpa: '/kɑ/', americanIpa: '/kɑr/' },
      { word: 'hard', britishIpa: '/hɑd/', americanIpa: '/hɑrd/' },
      { word: 'bird', britishIpa: '/bɜd/', americanIpa: '/bɜrd/' },
      { word: 'park', britishIpa: '/pɑk/', americanIpa: '/pɑrk/' },
      { word: 'smart', britishIpa: '/smɑt/', americanIpa: '/smɑrt/' },
      { word: 'card', britishIpa: '/kɑd/', americanIpa: '/kɑrd/' },
      { word: 'warm', britishIpa: '/wɔm/', americanIpa: '/wɔrm/' },
      { word: 'form', britishIpa: '/fɔm/', americanIpa: '/fɔrm/' },
      { word: 'bark', britishIpa: '/bɑk/', americanIpa: '/bɑrk/' },
      { word: 'term', britishIpa: '/tɜm/', americanIpa: '/tɜrm/' },
    ],
  },
  {
    id: 't',
    title: 'Flap T (middle t)',
    description: 'Perubahan fonetik pada huruf "t" di antara dua vokal. AmE mengubahnya menjadi bunyi mirip [d] (middle t), sedangkan BrE mempertahankan letupan [t] yang jelas.',
    items: [
      { word: 'water', britishIpa: '/ˈwɔtə/', americanIpa: '/ˈwɑdər/' },
      { word: 'better', britishIpa: '/ˈbetə/', americanIpa: '/ˈbedər/' },
      { word: 'later', britishIpa: '/ˈleɪtə/', americanIpa: '/ˈleɪdər/' },
      { word: 'butter', britishIpa: '/ˈbʌtə/', americanIpa: '/ˈbʌdər/' },
      { word: 'bitter', britishIpa: '/ˈbɪtə/', americanIpa: '/ˈbɪdər/' },
      { word: 'city', britishIpa: '/ˈsɪti/', americanIpa: '/ˈsɪdi/' },
      { word: 'pity', britishIpa: '/ˈpɪti/', americanIpa: '/ˈpɪdi/' },
      { word: 'writer', britishIpa: '/ˈraɪtə/', americanIpa: '/ˈraɪdər/' },
      { word: 'metal', britishIpa: '/ˈmetl/', americanIpa: '/ˈmedl/' },
      { word: 'party', britishIpa: '/ˈpɑti/', americanIpa: '/ˈpɑrdi/' },
    ],
  },
  {
    id: '\u00e6',
    title: 'æ vs ɑ',
    description: 'Pergeseran vokal pada kata tertentu sebelum konsonan frikatif atau nasal. Menggunakan /æ/ di American English (AmE) vs /ɑ/ di British English (BrE).',
    items: [
      { word: 'dance', britishIpa: '/dɑns/', americanIpa: '/dæns/' },
      { word: 'bath', britishIpa: '/bɑθ/', americanIpa: '/bæθ/' },
      { word: 'class', britishIpa: '/klɑs/', americanIpa: '/klæs/' },
      { word: 'glass', britishIpa: '/ɡlɑs/', americanIpa: '/ɡlæs/' },
      { word: 'fast', britishIpa: '/fɑst/', americanIpa: '/fæst/' },
      { word: 'past', britishIpa: '/pɑst/', americanIpa: '/pæst/' },
      { word: 'ask', britishIpa: '/ɑsk/', americanIpa: '/æsk/' },
      { word: 'cast', britishIpa: '/kɑst/', americanIpa: '/kæst/' },
      { word: 'plant', britishIpa: '/plɑnt/', americanIpa: '/plænt/' },
      { word: "can't", britishIpa: '/kɑnt/', americanIpa: '/kænt/' },
    ],
  },
  {
    id: 'j',
    title: 'Yod-Dropping',
    description: 'Penghapusan bunyi palatal approximant /j/ setelah konsonan alveolar di Amerika (langsung menuju vokal /u/), sementara British memelihara bunyi /j/.',
    items: [
      { word: 'new', britishIpa: '/nju/', americanIpa: '/nu/' },
      { word: 'tune', britishIpa: '/tjun/', americanIpa: '/tun/' },
      { word: 'duty', britishIpa: '/ˈdjuti/', americanIpa: '/ˈduti/' },
      { word: 'student', britishIpa: '/ˈstjudənt/', americanIpa: '/ˈstudənt/' },
      { word: 'Tuesday', britishIpa: '/ˈtjuzdeɪ/', americanIpa: '/ˈtuzdeɪ/' },
      { word: 'nude', britishIpa: '/njud/', americanIpa: '/nud/' },
      { word: 'duke', britishIpa: '/djuk/', americanIpa: '/duk/' },
      { word: 'assume', britishIpa: '/əˈsjum/', americanIpa: '/əˈsum/' },
      { word: 'suit', britishIpa: '/sjut/', americanIpa: '/sut/' },
      { word: 'resume', britishIpa: '/rɪˈzjum/', americanIpa: '/rɪˈzum/' },
    ],
  },
  {
    id: '\u0251',
    title: 'ɑ vs ɒ',
    description: 'Perbedaan pada kata bermonoftong pendek berhuruf "o". Menggunakan vokal tidak bulat /ɑ/ di American English (AmE) vs vokal bulat pendek /ɒ/ di British English (BrE).',
    items: [
      { word: 'hot', britishIpa: '/hɒt/', americanIpa: '/hɑt/' },
      { word: 'not', britishIpa: '/nɒt/', americanIpa: '/nɑt/' },
      { word: 'lot', britishIpa: '/lɒt/', americanIpa: '/lɑt/' },
      { word: 'top', britishIpa: '/tɒp/', americanIpa: '/tɑp/' },
      { word: 'shop', britishIpa: '/ʃɒp/', americanIpa: '/ʃɑp/' },
      { word: 'stop', britishIpa: '/stɒp/', americanIpa: '/stɑp/' },
      { word: 'clock', britishIpa: '/klɒk/', americanIpa: '/klɑk/' },
      { word: 'rock', britishIpa: '/rɒk/', americanIpa: '/rɑk/' },
      { word: 'box', britishIpa: '/bɒks/', americanIpa: '/bɑks/' },
      { word: 'fox', britishIpa: '/fɒks/', americanIpa: '/fɑks/' },
    ],
  },
  {
    id: 'o\u028a',
    title: 'oʊ vs əʊ',
    description: 'Perbedaan pengucapan vokal "o" panjang. AmE menggunakan diftong bulat /oʊ/, sedangkan BrE memulainya dengan vokal samar /əʊ/.',
    items: [
      { word: 'go', britishIpa: '/ɡəʊ/', americanIpa: '/ɡoʊ/' },
      { word: 'no', britishIpa: '/nəʊ/', americanIpa: '/noʊ/' },
      { word: 'home', britishIpa: '/həʊm/', americanIpa: '/hoʊm/' },
      { word: 'boat', britishIpa: '/bəʊt/', americanIpa: '/boʊt/' },
      { word: 'cold', britishIpa: '/kəʊld/', americanIpa: '/koʊld/' },
      { word: 'coat', britishIpa: '/kəʊt/', americanIpa: '/koʊt/' },
      { word: 'road', britishIpa: '/rəʊd/', americanIpa: '/roʊd/' },
      { word: 'soap', britishIpa: '/səʊp/', americanIpa: '/soʊp/' },
      { word: 'stone', britishIpa: '/stəʊn/', americanIpa: '/stoʊn/' },
      { word: 'gold', britishIpa: '/ɡəʊld/', americanIpa: '/ɡoʊld/' },
    ],
  },
];