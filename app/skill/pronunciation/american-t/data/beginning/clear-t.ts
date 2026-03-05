import type { ClearTExample } from '../types';

type SentenceDrillFocusWord = string;

type SentenceDrillItem = {
  text: string;
  ipa: string;
  note: string;
  focusWords: ReadonlyArray<SentenceDrillFocusWord>;
};

type CommonMistakeItem = {
  mistake: string;
  fix: string;
  note: string;
};

type SentenceDrillExample = {
  id: string;
  text: string;
  ipa: string;
  focusWords: ReadonlyArray<SentenceDrillFocusWord>;
};

export const CLEAR_T_BEGINNING_EXAMPLES: ReadonlyArray<ClearTExample> = [
  {
    text: 'time',
    ipa: '/taɪm/',
    note: 'Lidah menyentuh ridge di belakang gigi atas, lalu lepas dengan letupan kecil.',
  },
  {
    text: 'today',
    ipa: '/təˈdeɪ/',
    note: 'Pada awal kata, /t/ cenderung tetap jelas dan tidak menjadi flap.',
  },
  {
    text: 'table',
    ipa: '/ˈteɪbəl/',
    note: 'Fokus pada letupan ringan di awal sebelum vokal /eɪ/.',
  },
  {
    text: 'take',
    ipa: '/teɪk/',
    note: 'Jangan melembutkan bunyi awal menjadi /d/; pertahankan /t/ bersih.',
  },
  {
    text: 'teacher',
    ipa: '/ˈtiːtʃər/',
    note: 'Awal kata tetap /t/ jelas, lalu lanjut ke /iː/ panjang.',
  },
  {
    text: 'ticket',
    ipa: '/ˈtɪkɪt/',
    note: 'Bunyi pertama /t/ harus tegas karena posisi awal sangat terdengar.',
  },
  {
    text: 'tomorrow',
    ipa: '/təˈmɑːroʊ/',
    note: 'Gunakan embusan ringan; jangan terlalu keras agar tetap natural.',
  },
  {
    text: 'top',
    ipa: '/tɑːp/',
    note: 'Contoh sederhana untuk merasakan clean release pada /t/ awal.',
  },
];

export const CLEAR_T_BEGINNING_WORD_BANK_50: ReadonlyArray<ClearTExample> = [
  { text: 'table', ipa: '/ˈteɪbəl/', note: 'Latih /t/ awal dengan release ringan.' },
  { text: 'take', ipa: '/teɪk/', note: 'Bunyi awal /t/ harus tegas dan singkat.' },
  { text: 'talk', ipa: '/tɔːk/', note: 'Jaga /t/ awal tetap jelas sebelum vokal.' },
  { text: 'tall', ipa: '/tɔːl/', note: 'Awali dengan sentuhan lidah yang rapi.' },
  { text: 'task', ipa: '/tæsk/', note: 'Pertahankan /t/ bersih, jangan melembut ke /d/.' },
  { text: 'tax', ipa: '/tæks/', note: 'Lepaskan /t/ awal tanpa letupan berlebihan.' },
  { text: 'taxi', ipa: '/ˈtæksi/', note: 'Pastikan suku pertama dimulai /t/ yang clear.' },
  { text: 'teach', ipa: '/tiːtʃ/', note: 'Fokus /t/ awal sebelum bunyi akhir /ch/.' },
  { text: 'teacher', ipa: '/ˈtiːtʃər/', note: 'Jaga /t/ awal tetap bersih di tempo normal.' },
  { text: 'team', ipa: '/tiːm/', note: 'Gunakan airflow ringan setelah penutupan /t/.' },
  { text: 'tell', ipa: '/tel/', note: 'Awal kata harus terdengar tajam tapi natural.' },
  { text: 'ten', ipa: '/ten/', note: 'Latihan dasar untuk konsistensi /t/ awal.' },
  { text: 'term', ipa: '/tɝːm/', note: 'Jangan menelan /t/ saat bicara cepat.' },
  { text: 'test', ipa: '/test/', note: 'Awali dengan /t/ tegas, akhirkan tetap ringkas.' },
  { text: 'text', ipa: '/tekst/', note: 'Bersihkan /t/ awal sebelum cluster konsonan.' },
  { text: 'ticket', ipa: '/ˈtɪkɪt/', note: 'Pastikan /t/ pertama paling terdengar.' },
  { text: 'tidy', ipa: '/ˈtaɪdi/', note: 'Awal kata clear, lalu lanjut ritme santai.' },
  { text: 'tie', ipa: '/taɪ/', note: 'Lepasan /t/ harus cepat dan akurat.' },
  { text: 'time', ipa: '/taɪm/', note: 'Contoh inti released /t/ di beginning position.' },
  { text: 'tiny', ipa: '/ˈtaɪni/', note: 'Jaga /t/ awal tidak berubah jadi /d/.' },
  { text: 'title', ipa: '/ˈtaɪtəl/', note: 'Awal kata clear, akhir kata tetap ringan.' },
  { text: 'today', ipa: '/təˈdeɪ/', note: 'Fokus /t/ awal sebelum schwa.' },
  { text: 'together', ipa: '/təˈɡeðər/', note: 'Awali lembut tetapi /t/ tetap terdengar.' },
  { text: 'tomato', ipa: '/təˈmeɪtoʊ/', note: 'Latih /t/ awal di tempo percakapan natural.' },
  { text: 'tomorrow', ipa: '/təˈmɑːroʊ/', note: 'Bunyi /t/ awal harus jelas saat runut.' },
  { text: 'tone', ipa: '/toʊn/', note: 'Gunakan sentuhan lidah singkat dan presisi.' },
  { text: 'tool', ipa: '/tuːl/', note: 'Jaga clarity /t/ meski vokal panjang.' },
  { text: 'tooth', ipa: '/tuːθ/', note: 'Awal /t/ jelas, lalu transisi halus ke akhir.' },
  { text: 'topic', ipa: '/ˈtɑːpɪk/', note: 'Mulai dengan /t/ kuat namun tetap natural.' },
  { text: 'total', ipa: '/ˈtoʊtəl/', note: 'Pastikan awal kata lebih menonjol dari suku lain.' },
  { text: 'touch', ipa: '/tʌtʃ/', note: 'Lepas /t/ awal cepat sebelum vokal pendek.' },
  { text: 'tour', ipa: '/tʊr/', note: 'Awal kata clear meski bunyi vokal melebar.' },
  { text: 'town', ipa: '/taʊn/', note: 'Gunakan /t/ awal yang rapi di ritme cepat.' },
  { text: 'toy', ipa: '/tɔɪ/', note: 'Latih koordinasi /t/ ke diftong dengan halus.' },
  { text: 'track', ipa: '/træk/', note: 'Pada cluster /tr/, /t/ awal tetap harus muncul.' },
  { text: 'trade', ipa: '/treɪd/', note: 'Jaga /t/ awal sebelum geser ke /r/.' },
  { text: 'train', ipa: '/treɪn/', note: 'Released /t/ penting agar cluster tidak blur.' },
  { text: 'travel', ipa: '/ˈtrævəl/', note: 'Mulai dengan /t/ jelas lalu lanjut /r/ ringan.' },
  { text: 'tree', ipa: '/triː/', note: 'Bunyikan /t/ dulu sebelum vokal panjang.' },
  { text: 'trip', ipa: '/trɪp/', note: 'Awal /t/ tegas membantu kata terdengar bersih.' },
  { text: 'truck', ipa: '/trʌk/', note: 'Cluster awal perlu /t/ yang tetap terbaca.' },
  { text: 'true', ipa: '/truː/', note: 'Pastikan tidak langsung ke /r/ tanpa /t/.' },
  { text: 'trust', ipa: '/trʌst/', note: 'Jaga /t/ awal sebelum kombinasi konsonan berikut.' },
  { text: 'try', ipa: '/traɪ/', note: 'Mulai dengan /t/ clear, baru glide ke /r/.' },
  { text: 'turn', ipa: '/tɝːn/', note: 'Latih /t/ awal di kata sehari-hari.' },
  { text: 'turtle', ipa: '/ˈtɝːtəl/', note: 'Awal kata harus jelas meski ada dua suku.' },
  { text: 'type', ipa: '/taɪp/', note: 'Release /t/ singkat membantu kejelasan kata.' },
  { text: 'typical', ipa: '/ˈtɪpɪkəl/', note: 'Fokus suku pertama dengan /t/ yang bersih.' },
  { text: 'target', ipa: '/ˈtɑːrɡɪt/', note: 'Awal /t/ perlu stabil saat bicara natural.' },
  { text: 'tower', ipa: '/ˈtaʊər/', note: 'Mulai dengan /t/ jelas lalu lanjutkan santai.' },
];

export const CLEAR_T_BEGINNING_SENTENCES: ReadonlyArray<SentenceDrillItem> = [
  {
    text: 'Take your time before you talk.',
    ipa: '/teɪk jʊr taɪm bɪˈfɔr ju tɔk/',
    note: 'Ulangi perlahan lalu naikkan tempo.',
    focusWords: ['Take', 'time', 'talk'],
  },
  {
    text: 'Today we start a new topic.',
    ipa: '/təˈdeɪ wi stɑrt ə nu ˈtɑpɪk/',
    note: 'Jaga /t/ awal pada today dan topic tetap jelas.',
    focusWords: ['Today', 'topic'],
  },
  {
    text: 'The teacher told us to try again.',
    ipa: '/ðə ˈtitʃər toʊld ʌs tə traɪ əˈɡɛn/',
    note: 'Latih kombinasi beberapa /t/ awal dalam satu kalimat.',
    focusWords: ['teacher', 'told', 'try'],
  },
  {
    text: 'Tom took the ticket at noon.',
    ipa: '/tɑm tʊk ðə ˈtɪkɪt æt nun/',
    note: 'Perhatikan /t/ pada Tom, took, ticket.',
    focusWords: ['Tom', 'took', 'ticket'],
  },
  {
    text: 'Turn to page ten and take notes.',
    ipa: '/tɝn tə peɪdʒ ten ænd teɪk noʊts/',
    note: 'Fokus ritme: released /t/ tanpa terdengar kaku.',
    focusWords: ['Turn', 'ten', 'take'],
  },
  {
    text: 'Try to talk a little slower today.',
    ipa: '/traɪ tə tɔk ə ˈlɪtəl ˈsloʊər təˈdeɪ/',
    note: 'Latihan kontrol kejelasan dan kecepatan.',
    focusWords: ['Try', 'talk', 'today'],
  },
];

export const CLEAR_T_BEGINNING_SENTENCE_DRILL_EXAMPLES_15: ReadonlyArray<SentenceDrillExample> = [
  {
    id: 'set-01',
    text: 'Take the train to town today.',
    ipa: '/teɪk ðə treɪn tə taʊn təˈdeɪ/',
    focusWords: [
      'take',
      'train',
      'town',
      'today',
    ],
  },
  {
    id: 'set-02',
    text: 'Tom told Tina to tidy the table.',
    ipa: '/tɑm toʊld ˈtinə tə ˈtaɪdi ðə ˈteɪbəl/',
    focusWords: [
      'Tom',
      'told',
      'Tina',
      'tidy',
      'table',
    ],
  },
  {
    id: 'set-03',
    text: 'Try to talk ten times tonight.',
    ipa: '/traɪ tə tɔk ten taɪmz təˈnaɪt/',
    focusWords: [
      'Try',
      'talk',
      'ten',
      'times',
      'tonight',
    ],
  },
  {
    id: 'set-04',
    text: 'The teacher tests ten topics today.',
    ipa: '/ðə ˈtitʃər tests ten ˈtɑpɪks təˈdeɪ/',
    focusWords: [
      'teacher',
      'tests',
      'ten',
      'topics',
      'today',
    ],
  },
  {
    id: 'set-05',
    text: 'Turn to topic ten, then take notes.',
    ipa: '/tɝn tə ˈtɑpɪk ten ðen teɪk noʊts/',
    focusWords: [
      'Turn',
      'topic',
      'ten',
      'take',
    ],
  },
  {
    id: 'set-06',
    text: 'Tony took two tickets to Texas.',
    ipa: '/ˈtoʊni tʊk tu ˈtɪkɪts tə ˈteksəs/',
    focusWords: [
      'Tony',
      'took',
      'two',
      'tickets',
      'Texas',
    ],
  },
  {
    id: 'set-07',
    text: 'Tell Tim to text me tomorrow.',
    ipa: '/tel tɪm tə tekst mi təˈmɑroʊ/',
    focusWords: [
      'Tell',
      'Tim',
      'text',
      'tomorrow',
    ],
  },
  {
    id: 'set-08',
    text: 'Tina typed the title twice.',
    ipa: '/ˈtinə taɪpt ðə ˈtaɪtəl twaɪs/',
    focusWords: [
      'Tina',
      'typed',
      'title',
      'twice',
    ],
  },
  {
    id: 'set-09',
    text: 'Take the towel and the toothbrush.',
    ipa: '/teɪk ðə ˈtaʊəl ænd ðə ˈtuθbrʌʃ/',
    focusWords: [
      'Take',
      'towel',
      'toothbrush',
    ],
  },
  {
    id: 'set-10',
    text: 'Try this task ten times.',
    ipa: '/traɪ ðɪs tæsk ten taɪmz/',
    focusWords: [
      'Try',
      'task',
      'ten',
      'times',
    ],
  },
  {
    id: 'set-11',
    text: 'Tim traveled to Toronto today.',
    ipa: '/tɪm ˈtrævəld tə təˈrɑntoʊ təˈdeɪ/',
    focusWords: [
      'Tim',
      'traveled',
      'Toronto',
      'today',
    ],
  },
  {
    id: 'set-12',
    text: 'Turn the TV to ten.',
    ipa: '/tɝn ðə ˌtiˈvi tə ten/',
    focusWords: [
      'Turn',
      'TV',
      'to',
      'ten',
    ],
  },
  {
    id: 'set-13',
    text: 'The taxi turned toward town.',
    ipa: '/ðə ˈtæksi tɝnd təˈwɔrd taʊn/',
    focusWords: [
      'taxi',
      'turned',
      'toward',
      'town',
    ],
  },
  {
    id: 'set-14',
    text: 'Take the tiny toy to Tina.',
    ipa: '/teɪk ðə ˈtaɪni tɔɪ tə ˈtinə/',
    focusWords: [
      'Take',
      'tiny',
      'toy',
      'Tina',
    ],
  },
  {
    id: 'set-15',
    text: 'Today the team talks together.',
    ipa: '/təˈdeɪ ðə tim tɔks təˈɡɛðər/',
    focusWords: [
      'Today',
      'team',
      'talks',
      'together',
    ],
  },
];

export const CLEAR_T_BEGINNING_COMMON_MISTAKES: ReadonlyArray<CommonMistakeItem> = [
  {
    mistake: 'Bunyi awal /t/ terdengar seperti /d/.',
    fix: 'Perlambat tempo, sentuh lidah sebentar di belakang gigi atas, lalu lepas cepat ke vokal.',
    note: "Latih kontras 5x: 'take' lalu 'day', dan pastikan keduanya terdengar beda jelas.",
  },
  {
    mistake: 'Letupan /t/ terlalu keras sehingga ucapan kaku.',
    fix: 'Kurangi tenaga; targetnya /t/ tetap jelas tapi pendek, bukan meledak.',
    note: "Ucapkan 'time, take, today' dengan volume normal, bukan seperti sedang berteriak.",
  },
  {
    mistake: "Bunyi /t/ hilang saat cluster /tr/ (contoh: 'train').",
    fix: "Pisahkan dulu jadi dua langkah: /t/ + /r/, lalu gabungkan jadi satu aliran.",
    note: "Latih bertahap: 't-rain' 5x, lalu percepat sampai 'train' terdengar natural.",
  },
  {
    mistake: "Semua kata dipaksa /t/ tegas, termasuk kata fungsi seperti 'to'.",
    fix: "Untuk ritme natural, 'to' sering cukup dibaca /tə/ dalam kalimat biasa.",
    note: "Prioritaskan /t/ jelas pada kata konten seperti 'take, time, topic', bukan di setiap kata.",
  },
];

export const CLEAR_T_BEGINNING_CHECKLIST: ReadonlyArray<string> = [
  'Mulai pemanasan 1 menit: ucapkan time, take, today perlahan dengan /t/ awal yang jelas.',
  'Lakukan 3 ronde latihan kata (masing-masing 5 kata) sebelum masuk ke sentence drills.',
  'Saat latihan, cek dua hal: /t/ tetap terdengar, tetapi letupannya tidak berlebihan.',
  "Jika bunyi mulai mirip /d/, turunkan tempo lalu ulangi sampai kontras 'take' vs 'day' kembali jelas.",
  'Tutup sesi dengan rekaman 20-30 detik agar progres harian bisa dibandingkan.',
];


