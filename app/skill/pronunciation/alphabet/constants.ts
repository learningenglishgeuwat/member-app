export interface AlphabetItem {
  letter: string;
  ipa: string;
  example: string;
}

export const ALPHABET_DATA: AlphabetItem[] = [
  { letter: 'A', ipa: '/eɪ/', example: 'Apple' },
  { letter: 'B', ipa: '/bi/', example: 'Ball' },
  { letter: 'C', ipa: '/si/', example: 'Cat' },
  { letter: 'D', ipa: '/di/', example: 'Dog' },
  { letter: 'E', ipa: '/i/', example: 'Elephant' },
  { letter: 'F', ipa: '/ɛf/', example: 'Fish' },
  { letter: 'G', ipa: '/dʒi/', example: 'Goat' },
  { letter: 'H', ipa: '/eɪtʃ/', example: 'Hat' },
  { letter: 'I', ipa: '/aɪ/', example: 'Igloo' },
  { letter: 'J', ipa: '/dʒeɪ/', example: 'Jar' },
  { letter: 'K', ipa: '/keɪ/', example: 'Kite' },
  { letter: 'L', ipa: '/ɛl/', example: 'Lion' },
  { letter: 'M', ipa: '/ɛm/', example: 'Moon' },
  { letter: 'N', ipa: '/ɛn/', example: 'Nest' },
  { letter: 'O', ipa: '/oʊ/', example: 'Octopus' },
  { letter: 'P', ipa: '/pi/', example: 'Pig' },
  { letter: 'Q', ipa: '/kju/', example: 'Queen' },
  { letter: 'R', ipa: '/ɑr/', example: 'Rabbit' },
  { letter: 'S', ipa: '/ɛs/', example: 'Sun' },
  { letter: 'T', ipa: '/ti/', example: 'Turtle' },
  { letter: 'U', ipa: '/ju/', example: 'Umbrella' },
  { letter: 'V', ipa: '/vi/', example: 'Van' },
  { letter: 'W', ipa: '/ˈdʌb.əl.ju/', example: 'Whale' },
  { letter: 'X', ipa: '/ɛks/', example: 'Xylophone' },
  { letter: 'Y', ipa: '/waɪ/', example: 'Yak' },
  { letter: 'Z', ipa: '/zi/', example: 'Zebra' },
];

export const INDONESIAN_ALPHABET_NOTES: readonly string[] = [
  'Huruf A dibaca /eɪ/, jadi bunyinya seperti "ei", bukan /a/.',
  'Huruf E untuk nama huruf dibaca panjang /iː/, terdengar seperti "ii".',
  'Huruf I dibaca /aɪ/, jadi bunyinya seperti "ai".',
  'Huruf R bahasa Inggris tidak digetarkan kuat seperti R bahasa Indonesia.',
  'Bedakan V dan F: V bersuara (getaran), F tidak bersuara.',
  'Di model US pada halaman ini, huruf Z dibaca /zi/; di British biasanya /zed/.',
];

export const QUICK_SPELLING_WORDS: readonly string[] = [
  'APPLE',
  'BALL',
  'CAT',
  'DOG',
  'ELEPHANT',
  'FISH',
  'GOAT',
  'HAT',
  'IGLOO',
  'JAR',
  'KITE',
  'LION',
  'MOON',
  'NEST',
  'OCTOPUS',
  'PIG',
  'QUEEN',
  'RABBIT',
  'SUN',
  'TURTLE',
  'UMBRELLA',
  'VAN',
  'WHALE',
  'XYLOPHONE',
  'YAK',
  'ZEBRA',
];
