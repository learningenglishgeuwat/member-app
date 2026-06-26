// Phonetic Symbol Reference Data - Sound Guidance
export interface PhoneticReference {
  symbol: string;
  acuanSuara: string;
  contohKata: string;
}

export interface PhoneticGroup {
  title: string;
  subtitle: string;
  items: PhoneticReference[];
}

export const ACUAN_SUARA_GROUPS: PhoneticGroup[] = [
  {
    title: 'VOWEL (LAX)',
    subtitle: 'Vokal Ringkas - Bunyi Pendek/Santai',
    items: [
      {
        symbol: '/ʌ/',
        acuanSuara: 'mirip a pendek / suara kaget',
        contohKata: 'mantap',
      },
      {
        symbol: '/ɪ/',
        acuanSuara: 'mirip i menggantung / pendek',
        contohKata: 'batik',
      },
      {
        symbol: '/ʊ/',
        acuanSuara: 'mirip u rileks / pendek',
        contohKata: 'sarung',
      },
      {
        symbol: '/ɛ/',
        acuanSuara: 'mirip e taling terbuka',
        contohKata: 'bebek',
      },
      {
        symbol: '/ə/',
        acuanSuara: 'mirip e pepet',
        contohKata: 'pepaya',
      },
      {
        symbol: '/ɚ/',
        acuanSuara: 'mirip e pepet + bunyi r tipis di akhir',
        contohKata: 'dokter',
      },
    ],
  },
  {
    title: 'VOWEL (TENSE)',
    subtitle: 'Vokal Panjang - Bunyi Panjang/Tegang',
    items: [
      {
        symbol: '/ɑ/',
        acuanSuara: 'mirip a dalam / tegap (mulut dibuka lebar)',
        contohKata: 'aa',
      },
      {
        symbol: '/i/',
        acuanSuara: 'mirip i tajam / panjang',
        contohKata: 'ii',
      },
      {
        symbol: '/u/',
        acuanSuara: 'mirip u bulat / penuh (bibir maju)',
        contohKata: 'uu',
      },
      {
        symbol: '/æ/',
        acuanSuara: 'mirip a cempreng (mulut ditarik ke samping)',
        contohKata: 'eumbee (suara kambing)',
      },
      {
        symbol: '/ɔ/',
        acuanSuara: 'mirip o terbuka',
        contohKata: 'toko',
      },
    ],
  },
  {
    title: 'DIPHTHONG',
    subtitle: 'Vokal Ganda - Bunyi Dua Vokal Sekaligus',
    items: [
      {
        symbol: '/aɪ/',
        acuanSuara: 'mirip bunyi ai / ay',
        contohKata: 'pantai (a+i)',
      },
      {
        symbol: '/eɪ/',
        acuanSuara: 'mirip bunyi ei',
        contohKata: 'survei (e+i)',
      },
      {
        symbol: '/ɔɪ/',
        acuanSuara: 'mirip bunyi oi',
        contohKata: 'amboi (o+i)',
      },
      {
        symbol: '/ɪr/',
        acuanSuara: 'mirip bunyi ir (i pendek + e pepet + r)',
        contohKata: '— (tidak ada di bahasa Indonesia)',
      },
      {
        symbol: '/ɛr/',
        acuanSuara: 'mirip bunyi er (e taling + e pepet + r)',
        contohKata: '— (tidak ada di bahasa Indonesia)',
      },
      {
        symbol: '/ʊr/',
        acuanSuara: 'mirip bunyi ur (u pendek + e pepet + r)',
        contohKata: '— (tidak ada di bahasa Indonesia)',
      },
      {
        symbol: '/oʊ/',
        acuanSuara: 'mirip bunyi o membulat/mengayun ke u',
        contohKata: 'ou',
      },
      {
        symbol: '/aʊ/',
        acuanSuara: 'mirip bunyi au / aw',
        contohKata: 'kalau',
      },
    ],
  },
  {
    title: 'CONSONANT (VOICELESS)',
    subtitle: 'Konsonan Tanpa Vibrasi Pita Suara',
    items: [
      {
        symbol: '/p/',
        acuanSuara: 'mirip huruf p',
        contohKata: 'pasar',
      },
      {
        symbol: '/t/',
        acuanSuara: 'mirip huruf t',
        contohKata: 'tali',
      },
      {
        symbol: '/k/',
        acuanSuara: 'mirip huruf k',
        contohKata: 'kelas',
      },
      {
        symbol: '/f/',
        acuanSuara: 'mirip huruf f',
        contohKata: 'foto',
      },
      {
        symbol: '/θ/',
        acuanSuara: 'mirip huruf t tipis (ujung lidah di antara gigi)',
        contohKata: 'hadis (suara "th") / Tsa (ث)',
      },
      {
        symbol: '/s/',
        acuanSuara: 'mirip huruf s',
        contohKata: 'satu',
      },
      {
        symbol: '/ʃ/',
        acuanSuara: 'mirip gabungan huruf sy',
        contohKata: 'syarat (suara "sshh")',
      },
      {
        symbol: '/ʧ/',
        acuanSuara: 'mirip huruf c tunggal',
        contohKata: 'cepat',
      },
      {
        symbol: '/h/',
        acuanSuara: 'mirip huruf h',
        contohKata: 'hari',
      },
    ],
  },
  {
    title: 'CONSONANT (VOICED)',
    subtitle: 'Konsonan Dengan Vibrasi Pita Suara',
    items: [
      {
        symbol: '/b/',
        acuanSuara: 'mirip huruf b',
        contohKata: 'buku',
      },
      {
        symbol: '/d/',
        acuanSuara: 'mirip huruf d',
        contohKata: 'datang',
      },
      {
        symbol: '/g/',
        acuanSuara: 'mirip huruf g',
        contohKata: 'gajah',
      },
      {
        symbol: '/v/',
        acuanSuara: 'mirip huruf v / f tebal',
        contohKata: 'video',
      },
      {
        symbol: '/ð/',
        acuanSuara: 'mirip huruf d tipis (ujung lidah digigit sedikit)',
        contohKata: 'zat (suara "dz") / dza (ذ)',
      },
      {
        symbol: '/z/',
        acuanSuara: 'mirip huruf z',
        contohKata: 'zebra',
      },
      {
        symbol: '/ʒ/',
        acuanSuara: 'mirip huruf zh',
        contohKata: 'Zainudin (suara "zh")',
      },
      {
        symbol: '/ʤ/',
        acuanSuara: 'mirip huruf j tunggal',
        contohKata: 'jalan',
      },
      {
        symbol: '/l/',
        acuanSuara: 'mirip huruf l',
        contohKata: 'lama',
      },
      {
        symbol: '/m/',
        acuanSuara: 'mirip huruf m',
        contohKata: 'makan',
      },
      {
        symbol: '/n/',
        acuanSuara: 'mirip huruf n',
        contohKata: 'nasi',
      },
      {
        symbol: '/ŋ/',
        acuanSuara: 'mirip gabungan huruf ng',
        contohKata: 'burung',
      },
      {
        symbol: '/r/',
        acuanSuara: 'mirip huruf r (tanpa getaran lidah yang kuat)',
        contohKata: 'rumah',
      },
      {
        symbol: '/w/',
        acuanSuara: 'mirip huruf w',
        contohKata: 'wajah',
      },
      {
        symbol: '/j/',
        acuanSuara: 'mirip huruf y tunggal',
        contohKata: 'yakin',
      },
    ],
  },
];
