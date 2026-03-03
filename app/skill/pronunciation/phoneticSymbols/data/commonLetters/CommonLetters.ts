// Common letters and IPA mappings used by the Common Letters modal.
// The number of mappings/examples per symbol is intentionally dynamic.

export interface CommonLetter {
  letter: string;
  ipaSymbol: string;
  description: string;
  examples: string[];
  category: 'vowel_lax' | 'vowel_tense' | 'diphthong' | 'consonant_voiceless' | 'consonant_voiced';
  pronunciationTip: string;
  traps?: string[];
}

export interface CommonLettersCategory {
  category: string;
  letters: CommonLetter[];
}

export const commonLettersData: CommonLettersCategory[] = [
  {
    category: 'VOWEL',
    letters: [
      {
        letter: 'u, o, ou, oo (rare)',
        ipaSymbol: '/\u028c/',
        description: 'Pola ejaan yang sering menghasilkan bunyi /ʌ/ (AmE):',
        examples: [
          'u -> cup, luck, bus',
          'o -> love, money, come',
          'ou -> country, young, enough',
          'oo (rare) -> blood, flood',
          'oe (rare) -> does',
        ],
        category: 'vowel_lax',
        pronunciationTip: 'Rahang buka sedang, bibir netral. Bunyinya pendek dan tegas.',
        traps: ['Jangan dibaca /u/ panjang.', 'Dalam suku kata tanpa tekanan, sering bergeser ke /ə/.'],
      },
      {
        letter: 'i, y, ui, e (some words)',
        ipaSymbol: '/\u026a/',
        description: 'Pola umum untuk bunyi pendek /ɪ/:',
        examples: [
          'i -> sit, big, fish',
          'y -> gym, symbol, myth',
          'ui -> build, guilt, guitar',
          'e (some words) -> pretty, England',
          'u (some words) -> busy, minute',
        ],
        category: 'vowel_lax',
        pronunciationTip: 'Posisi lidah depan-tengah, bunyi rileks dan pendek.',
        traps: ['Jangan dipanjangkan jadi /i/.'],
      },
      {
        letter: 'oo, u, o, ou',
        ipaSymbol: '/\u028a/',
        description: 'Pola ejaan yang sering memberi bunyi /ʊ/:',
        examples: [
          'oo -> book, good, look',
          'u -> put, full, pull',
          'o -> woman, wolf',
          'ou -> could, would, should',
          'ui (some words) -> built, guilty',
        ],
        category: 'vowel_lax',
        pronunciationTip: 'Bibir sedikit bulat, bunyi pendek. Jaga supaya tidak jadi /u/.',
        traps: ['Sering tertukar dengan /u/.'],
      },
      {
        letter: 'e, ea, a, ie, ai',
        ipaSymbol: '/\u025b/',
        description: 'Pola umum untuk bunyi /ɛ/:',
        examples: [
          'e -> bed, pen, send',
          'ea -> head, bread, heavy',
          'a -> many, any',
          'ie -> friend',
          'ai -> said, again',
        ],
        category: 'vowel_lax',
        pronunciationTip: 'Rahang sedikit lebih terbuka dari /e/ pedagogis, tetap satu vokal pendek.',
        traps: ['Jangan meluncur ke /eɪ/.'],
      },
      {
        letter: 'e (pedagogical short e)',
        ipaSymbol: '/e/',
        description: 'Notasi pedagogis pada sebagian materi EFL untuk e pendek murni:',
        examples: [
          'e -> get, set, very (versi pengajaran)',
          'e -> left, never',
          'e -> met, pen',
        ],
        category: 'vowel_lax',
        pronunciationTip: 'Gunakan sebagai jembatan belajar. Praktik nyata AmE umumnya ditulis /ɛ/.',
        traps: ['Ini bukan simbol target utama di portal.', 'Jangan otomatis dibaca diftong /eɪ/.'],
      },
      {
        letter: 'a, e, o, u (unstressed syllable)',
        ipaSymbol: '/\u0259/',
        description: 'Schwa /ə/ sangat sering muncul pada suku kata lemah:',
        examples: [
          'a -> about, ago, alone',
          'e -> problem, open, system',
          'o -> police, today',
          'u -> support, supply, suggest',
          'ion/ian -> nation, musician',
          'or (weak) -> doctor, actor',
        ],
        category: 'vowel_lax',
        pronunciationTip: 'Santai, ringan, tidak ditekan. Fokus ritme kalimat, bukan artikulasi kuat.',
        traps: ['Jangan beri tekanan kuat.', 'Schwa sering hilang/mereduksi dalam speech cepat.'],
      },
      {
        letter: 'er, ir, ur, or, ear',
        ipaSymbol: '/\u025a/',
        description: 'R-colored schwa versi AmE:',
        examples: [
          'er -> teacher, better, under',
          'ir -> bird, first, shirt',
          'ur -> turn, nurse, burger',
          'or -> word, work, world',
          'ear -> learn, heard, early',
        ],
        category: 'vowel_lax',
        pronunciationTip: 'Schwa + warna /r/ (AmE). Lidah naik sedikit ke belakang tanpa trill.',
        traps: ['Jangan dibaca "er" keras ala Indonesia.', 'Perhatikan perbedaan dengan /ər/ pada transkripsi lain.'],
      },
    ],
  },
  {
    category: 'TENSE VOWEL',
    letters: [
      {
        letter: 'o (AmE), a+r, a, al, au',
        ipaSymbol: '/\u0251/',
        description: 'Pola umum untuk /ɑ/ dalam aksen American:',
        examples: [
          'o (AmE) -> hot, not, top',
          'a+r -> car, start, hard',
          'a -> father, palm, spa',
          'al -> calm, psalm',
          'au (some words) -> aunt, laugh',
        ],
        category: 'vowel_tense',
        pronunciationTip: 'Buka rahang lebar, bibir tidak dibulatkan.',
        traps: ['Sebagian kata bisa berbeda antara AmE dan BrE.'],
      },
      {
        letter: 'ee, ea, e, ie, ei, y',
        ipaSymbol: '/i/',
        description: 'Pola ejaan produktif untuk /i/:',
        examples: [
          'ee -> see, green, meet',
          'ea -> eat, teacher, clean',
          'e -> me, he, these',
          'ie -> piece, field, belief',
          'ei -> receive, ceiling',
          'y -> happy, baby, city',
        ],
        category: 'vowel_tense',
        pronunciationTip: 'Lidah depan tinggi, bunyi tegang dan lebih panjang.',
        traps: ['Perhatikan pengecualian ejaan seperti friend (bukan /i/).'],
      },
      {
        letter: 'oo, u+e, ue, ew, ou, o',
        ipaSymbol: '/u/',
        description: 'Pola umum untuk /u/ panjang:',
        examples: [
          'oo -> food, school, moon',
          'u+e -> rule, June, flute',
          'ue -> blue, true, issue',
          'ew -> new, few, grew',
          'ou -> group, soup, you',
          'o (some words) -> do, move',
        ],
        category: 'vowel_tense',
        pronunciationTip: 'Bibir bulat rapat, tahan sedikit lebih lama daripada /ʊ/.',
        traps: ['Jangan pendekkan ke /ʊ/ pada kata yang memang /u/.'],
      },
      {
        letter: 'a, ai (rare), au (some words)',
        ipaSymbol: '/\u00e6/',
        description: 'Pola utama untuk /æ/:',
        examples: [
          'a -> cat, man, black',
          'a + dge -> badge, adjoin',
          'a + nk -> bank, thank',
          'ai (rare) -> plaid',
          'au (some words) -> laugh',
        ],
        category: 'vowel_tense',
        pronunciationTip: 'Rahang turun jelas, bunyi depan. Jangan dipersempit jadi /e/.',
        traps: ['Sebelum /r/ sering berubah kualitas vokalnya (mis. carry).'],
      },
      {
        letter: 'aw, au, al, o+r, ough',
        ipaSymbol: '/\u0254/',
        description: 'Pola umum untuk /ɔ/ (terutama sebelum /r/ atau pola tertentu):',
        examples: [
          'aw -> saw, law, draw',
          'au -> cause, caught, pause',
          'al -> talk, walk, chalk',
          'o+r -> for, more, story',
          'ough -> thought, bought',
        ],
        category: 'vowel_tense',
        pronunciationTip: 'Bibir sedikit bulat, posisi lidah belakang-menengah.',
        traps: ['Di beberapa kata AmE, /ɔ/ bisa merger dengan /ɑ/ tergantung penutur.'],
      },
    ],
  },
  {
    category: 'DIPHTHONG',
    letters: [
      {
        letter: 'i+e, igh, y, ie, uy',
        ipaSymbol: '/a\u026a/',
        description: 'Diftong naik dari /a/ ke /ɪ/:',
        examples: [
          'i+e -> time, bike, line',
          'igh -> light, night, right',
          'y -> my, try, fly',
          'ie -> tie, pie, lie',
          'uy -> buy, guy',
        ],
        category: 'diphthong',
        pronunciationTip: 'Mulai dari /a/, lalu luncur halus ke /ɪ/ tanpa jeda.',
      },
      {
        letter: 'a+e, ai, ay, ei, ea',
        ipaSymbol: '/e\u026a/',
        description: 'Diftong dari /e/ ke /ɪ/:',
        examples: [
          'a+e -> name, late, game',
          'ai -> rain, train, wait',
          'ay -> day, play, stay',
          'ei -> eight, veil, neighbor',
          'ea (some words) -> break, steak, great',
        ],
        category: 'diphthong',
        pronunciationTip: 'Mulai /e/ yang bersih, lalu glide ke /ɪ/.',
      },
      {
        letter: 'oi, oy',
        ipaSymbol: '/\u0254\u026a/',
        description: 'Diftong dari /ɔ/ ke /ɪ/:',
        examples: [
          'oi -> coin, point, voice',
          'oy -> boy, toy, enjoy',
          'oi + n -> join, joint',
          'oi + ce -> choice, rejoice',
          'oy + er -> lawyer, employer',
        ],
        category: 'diphthong',
        pronunciationTip: 'Mulai dengan bibir agak bulat, lalu akhiri ke /ɪ/.',
      },
      {
        letter: 'ear, eer, ere (variant)',
        ipaSymbol: '/\u026a\u0259/',
        description: 'Notasi centering diphthong yang sering dipakai di materi EFL:',
        examples: [
          'ear -> ear, near, clear',
          'eer -> deer, career, pioneer',
          'ere (variant) -> severe, sphere',
          'ear + d -> beard, heard (careful variation)',
        ],
        category: 'diphthong',
        pronunciationTip: 'Mulai /ɪ/ lalu relaks ke schwa ringan di akhir.',
        traps: ['Dalam AmE modern sering terdengar lebih rhotic (/ɪr/).'],
      },
      {
        letter: 'air, are, ear, ere',
        ipaSymbol: '/e\u0259/',
        description: 'Notasi centering diphthong untuk area "air" sound:',
        examples: [
          'air -> air, fair, chair',
          'are -> care, share, compare',
          'ear -> bear, wear, pear',
          'ere -> there, where',
        ],
        category: 'diphthong',
        pronunciationTip: 'Mulai /e/, lalu turunkan ke /ə/ ringan.',
        traps: ['Dalam AmE sering terdengar sebagai /er/ (rhotic).'],
      },
      {
        letter: 'ure, our, oor',
        ipaSymbol: '/\u028a\u0259/',
        description: 'Notasi centering diphthong untuk "poor/tour" set:',
        examples: [
          'ure -> pure, cure, secure',
          'our -> tour, detour',
          'oor -> poor, moor',
          'ur + e -> sure (historical pattern)',
        ],
        category: 'diphthong',
        pronunciationTip: 'Mulai /ʊ/ lalu netralkan ke /ə/ di akhir.',
        traps: ['Dalam AmE sering realisasi rhotic: /ʊr/.'],
      },
      {
        letter: 'o+e, oa, ow, oe, ou',
        ipaSymbol: '/o\u028a/',
        description: 'Diftong dari /o/ ke /ʊ/:',
        examples: [
          'o+e -> home, nose, stone',
          'oa -> road, boat, coat',
          'ow -> slow, snow, grow',
          'oe -> toe, foe, doe',
          'ou -> soul, shoulder, boulder',
        ],
        category: 'diphthong',
        pronunciationTip: 'Bibir tetap agak bulat, glide halus ke /ʊ/.',
      },
      {
        letter: 'ou, ow, ough',
        ipaSymbol: '/a\u028a/',
        description: 'Diftong dari /a/ ke /ʊ/:',
        examples: [
          'ou -> out, sound, house',
          'ow -> now, how, town',
          'ough -> bough, drought',
          'ou + nd -> round, found',
          'ow + n -> clown, brown',
        ],
        category: 'diphthong',
        pronunciationTip: 'Mulai /a/ terbuka, lalu glide cepat ke /ʊ/.',
      },
    ],
  },
  {
    category: 'CONSONANT',
    letters: [
      {
        letter: 'p, pp, p + silent e',
        ipaSymbol: '/p/',
        description: 'Pola umum bunyi /p/:',
        examples: [
          'p -> pen, map, open',
          'pp -> happy, apple, support',
          'p + e -> hope, shape',
          'sp -> speak, sport',
          'pr -> price, present',
        ],
        category: 'consonant_voiceless',
        pronunciationTip: 'Letupan bibir tanpa getaran suara.',
      },
      {
        letter: 'b, bb, b + final',
        ipaSymbol: '/b/',
        description: 'Pola umum bunyi /b/:',
        examples: [
          'b -> big, cab, baby',
          'bb -> rabbit, hobby',
          'bl -> black, blue',
          'br -> bring, brother',
          'b + e -> cube (ending sound /b/ in some forms)',
        ],
        category: 'consonant_voiced',
        pronunciationTip: 'Letupan bibir dengan getaran suara.',
      },
      {
        letter: 't, tt, -ed (/t/), th (in some loans)',
        ipaSymbol: '/t/',
        description: 'Pola umum bunyi /t/:',
        examples: [
          't -> tea, top, city',
          'tt -> little, matter, bottle',
          '-ed -> looked, worked, watched',
          'st -> stop, best, fast',
          'tr -> train, try',
        ],
        category: 'consonant_voiceless',
        pronunciationTip: 'Ujung lidah ke alveolar ridge, tanpa getaran.',
        traps: ['Jangan selalu pakai aspirasi kuat di tengah kata cepat (American flap context).'],
      },
      {
        letter: 'd, dd, -ed (/d/), dg',
        ipaSymbol: '/d/',
        description: 'Pola umum bunyi /d/:',
        examples: [
          'd -> dog, red, ready',
          'dd -> ladder, middle, hidden',
          '-ed -> played, cleaned, called',
          'dr -> drive, drink',
          'dg (cluster) -> edge (ending /dʒ/, not plain /d/; compare)',
        ],
        category: 'consonant_voiced',
        pronunciationTip: 'Posisi sama seperti /t/ tetapi voiced.',
        traps: ['Dalam speech cepat, /t/ dan /d/ antar-vokal bisa terdengar mirip flap.'],
      },
      {
        letter: 'k, c, ck, ch (Greek), q(u)',
        ipaSymbol: '/k/',
        description: 'Pola paling produktif untuk /k/:',
        examples: [
          'k -> key, kind, skin',
          'c -> cat, cold, class',
          'ck -> back, black, clock',
          'ch (Greek origin) -> chorus, character, chemistry',
          'qu -> question, quick, equal',
        ],
        category: 'consonant_voiceless',
        pronunciationTip: 'Letupan belakang lidah (velar), tanpa getaran.',
      },
      {
        letter: 'g, gg, gh (select words), gu',
        ipaSymbol: '/g/',
        description: 'Pola umum bunyi /g/:',
        examples: [
          'g -> go, give, game',
          'gg -> bigger, suggest',
          'gh (some words) -> ghost, spaghetti',
          'gu -> guard, guess, guild',
          'gr -> green, grow, great',
        ],
        category: 'consonant_voiced',
        pronunciationTip: 'Letupan velar dengan getaran suara.',
      },
      {
        letter: 'f, ff, ph, gh (few words)',
        ipaSymbol: '/f/',
        description: 'Pola umum bunyi /f/:',
        examples: [
          'f -> fan, life, office',
          'ff -> coffee, traffic, different',
          'ph -> phone, photo, phrase',
          'gh -> laugh, rough, cough',
          'ft -> after, left (ending /ft/ cluster)',
        ],
        category: 'consonant_voiceless',
        pronunciationTip: 'Gesekan gigi atas + bibir bawah, unvoiced.',
      },
      {
        letter: 'v, ve, f (in a few function words)',
        ipaSymbol: '/v/',
        description: 'Pola umum bunyi /v/:',
        examples: [
          'v -> very, save, movie',
          've -> have, love, active',
          'f (function word) -> of',
          'vv (rare spelling) -> savvy (loan)',
          'sv cluster -> solve, involve',
        ],
        category: 'consonant_voiced',
        pronunciationTip: 'Posisi seperti /f/, tapi voiced (ada getaran).',
        traps: ['Sering salah jadi /f/.'],
      },
      {
        letter: 'th (voiceless set)',
        ipaSymbol: '/\u03b8/',
        description: 'Pola utama untuk /θ/:',
        examples: [
          'th initial -> think, thank, theory',
          'th final -> math, path, tooth',
          'th medial -> method, athlete',
          'th + s -> months, myths',
          'th + r -> three, throw',
        ],
        category: 'consonant_voiceless',
        pronunciationTip: 'Ujung lidah di antara gigi, udara keluar lembut tanpa suara.',
        traps: ['Jangan ganti ke /t/ atau /s/.'],
      },
      {
        letter: 'th (voiced set)',
        ipaSymbol: '/\u00f0/',
        description: 'Pola utama untuk /ð/:',
        examples: [
          'th function words -> this, that, these, those',
          'th medial -> mother, brother, weather',
          'th in weak words -> the, them, there',
          'th + er -> other, another, either (varies)',
          'th + an -> than, then',
        ],
        category: 'consonant_voiced',
        pronunciationTip: 'Posisi sama seperti /θ/, tetapi voiced.',
        traps: ['Jangan dibaca /d/ keras.'],
      },
      {
        letter: 's, c, ss, sc, ce',
        ipaSymbol: '/s/',
        description: 'Pola umum bunyi /s/:',
        examples: [
          's -> see, sun, bus',
          'c -> city, face, center',
          'ss -> class, lesson, message',
          'sc -> science, scene',
          'ce -> dance, place, notice',
        ],
        category: 'consonant_voiceless',
        pronunciationTip: 'Desis tajam tanpa getaran.',
      },
      {
        letter: 'z, s (between vowels), zz, x, se',
        ipaSymbol: '/z/',
        description: 'Pola umum bunyi /z/:',
        examples: [
          'z -> zoo, zero, crazy',
          's (between vowels) -> music, easy, present (verb)',
          'zz -> buzz, fuzzy, dizzy',
          'x -> exam, exist, exact',
          'se -> rose, cause, disease',
        ],
        category: 'consonant_voiced',
        pronunciationTip: 'Desis bersuara, cek getaran tenggorokan.',
      },
      {
        letter: 'sh, ti, ci, si, ch (French loans)',
        ipaSymbol: '/\u0283/',
        description: 'Pola umum bunyi /ʃ/:',
        examples: [
          'sh -> she, shop, fish',
          'ti -> nation, action, patient',
          'ci -> special, efficient, social',
          'si -> tension, mansion',
          'ch (French loans) -> machine, brochure, chef',
        ],
        category: 'consonant_voiceless',
        pronunciationTip: 'Desis lebih tebal dari /s/, bibir sedikit membulat.',
      },
      {
        letter: 's, si, ge, z (limited set)',
        ipaSymbol: '/\u0292/',
        description: 'Pola umum bunyi /ʒ/ (lebih terbatas):',
        examples: [
          's -> measure, pleasure, treasure',
          'si -> vision, decision, division',
          'ge -> beige, garage, massage',
          'z (rare) -> seizure, azure',
          'su -> usual (in some accents)',
        ],
        category: 'consonant_voiced',
        pronunciationTip: 'Mirip /ʃ/ tapi voiced.',
        traps: ['Jumlah kata /ʒ/ lebih sedikit dibanding /ʃ/.'],
      },
      {
        letter: 'h, wh (in selected words)',
        ipaSymbol: '/h/',
        description: 'Pola umum bunyi /h/:',
        examples: [
          'h initial -> house, help, history',
          'h in stressed syllable -> behind, perhaps',
          'wh (selected) -> who, whole',
          'h + r clusters -> rehearse, reheat',
          'h in compounds -> forehead (careful variation)',
        ],
        category: 'consonant_voiceless',
        pronunciationTip: 'Hembusan napas halus dari glottis, tanpa getaran.',
        traps: ['Dalam speech cepat, /h/ kadang melemah pada fungsi tertentu.'],
      },
      {
        letter: 'ch, tch, t + u, t + io',
        ipaSymbol: '/\u02a7/',
        description: 'Pola umum bunyi /ʧ/:',
        examples: [
          'ch -> chair, chicken, teach',
          'tch -> watch, catch, kitchen',
          't + u -> future, nature, picture',
          't + io -> question, suggestion (in clusters)',
          'tu + re -> culture, adventure',
        ],
        category: 'consonant_voiceless',
        pronunciationTip: 'Gabungan letup + frikatif, unvoiced affricate.',
      },
      {
        letter: 'j, g(e/i/y), dge, dj',
        ipaSymbol: '/\u02a4/',
        description: 'Pola umum bunyi /ʤ/:',
        examples: [
          'j -> job, join, major',
          'g(e/i/y) -> giant, gentle, gym',
          'dge -> bridge, badge, knowledge',
          'dj -> adjust, adjective',
          'ge final -> image, package',
        ],
        category: 'consonant_voiced',
        pronunciationTip: 'Versi voiced dari /ʧ/.',
      },
      {
        letter: 'm, mm, mb (final)',
        ipaSymbol: '/m/',
        description: 'Pola umum bunyi /m/:',
        examples: [
          'm -> map, man, summer',
          'mm -> common, hammer, grammar',
          'mb final -> climb, bomb, thumb',
          'sm cluster -> smile, small',
          'mp cluster -> lamp, simple',
        ],
        category: 'consonant_voiced',
        pronunciationTip: 'Bibir menutup, suara keluar melalui hidung.',
      },
      {
        letter: 'n, nn, kn, gn',
        ipaSymbol: '/n/',
        description: 'Pola umum bunyi /n/:',
        examples: [
          'n -> name, nice, open',
          'nn -> dinner, winner, connect',
          'kn initial -> know, knife, knee',
          'gn initial -> gnat, gnaw',
          'pn/tn clusters -> open, written (ending contexts)',
        ],
        category: 'consonant_voiced',
        pronunciationTip: 'Ujung lidah ke alveolar ridge, suara nasal.',
      },
      {
        letter: 'ng, n + k, n + g, ngue',
        ipaSymbol: '/\u014b/',
        description: 'Pola umum bunyi /ŋ/:',
        examples: [
          'ng final -> sing, long, bring',
          'n + k -> think, uncle, anchor',
          'n + g -> finger, longer, hungry',
          'ngue final -> tongue',
          'ng + er -> singer, stronger',
        ],
        category: 'consonant_voiced',
        pronunciationTip: 'Belakang lidah naik ke velum, suara nasal.',
        traps: ['Biasanya tidak muncul di awal kata Inggris.', 'Jangan tambah bunyi /g/ saat tidak perlu (sing).'],
      },
      {
        letter: 'l, ll, le (syllabic)',
        ipaSymbol: '/l/',
        description: 'Pola umum bunyi /l/:',
        examples: [
          'l initial -> light, late, look',
          'll -> bell, yellow, allow',
          'le ending -> table, little, people',
          'pl/cl/bl -> play, class, blue',
          'al ending -> local, final',
        ],
        category: 'consonant_voiced',
        pronunciationTip: 'Ujung lidah menyentuh alveolar ridge, udara lewat sisi lidah.',
      },
      {
        letter: 'r, rr, wr, rh',
        ipaSymbol: '/r/',
        description: 'Pola umum bunyi /r/ dalam AmE:',
        examples: [
          'r -> red, run, around',
          'rr -> carry, correct, arrive',
          'wr initial -> write, wrong, wrap',
          'rh (rare) -> rhyme, rhythm',
          'r-controlled vowel contexts -> car, turn, word',
        ],
        category: 'consonant_voiced',
        pronunciationTip: 'American /r/: lidah mendekat tanpa trill/gulung.',
        traps: ['Jangan getarkan seperti r bahasa Indonesia.'],
      },
      {
        letter: 'w, wh, qu (as /kw/)',
        ipaSymbol: '/w/',
        description: 'Pola umum bunyi /w/:',
        examples: [
          'w -> we, water, window',
          'wh -> what, when, why',
          'qu -> quick, question, quiet',
          'tw/sw clusters -> twin, swim',
          'w + rime -> wall, work (onset /w/)',
        ],
        category: 'consonant_voiced',
        pronunciationTip: 'Bibir membulat lalu glide cepat ke vokal.',
      },
      {
        letter: 'y, i (semi-vowel), u (after alveolar)',
        ipaSymbol: '/j/',
        description: 'Notasi IPA standar untuk bunyi y (palatal glide):',
        examples: [
          'y -> yes, year, beyond',
          'i (semi-vowel) -> onion, million',
          'u after alveolar -> music, human, computer',
          'eu/ew -> Europe, few (context-dependent)',
          'yu onset -> unit, university',
        ],
        category: 'consonant_voiced',
        pronunciationTip: 'Lidah depan naik ke langit-langit keras lalu meluncur cepat.',
      },
      {
        letter: 'y, i (semi-vowel)',
        ipaSymbol: '/y/',
        description: 'Konvensi simbol di aplikasi ini, diperlakukan setara bunyi /j/:',
        examples: [
          'y -> yes, yellow, beyond',
          'i (semi-vowel) -> onion, senior',
          'yu onset -> unit, union',
          'u after consonant -> music, student',
        ],
        category: 'consonant_voiced',
        pronunciationTip: 'Pakai sebagai alias pedagogis untuk glide y-sound.',
        traps: ['Dalam IPA standar, bunyi ini biasanya ditulis /j/.'],
      },
    ],
  },
];

// Helper functions to get common letters data
export const getCommonLettersByCategory = (category: string): CommonLetter[] => {
  const categoryData = commonLettersData.find((cat) => cat.category === category);
  return categoryData ? categoryData.letters : [];
};

export const getCommonLetterByIPA = (ipaSymbol: string): CommonLetter | undefined => {
  for (const category of commonLettersData) {
    const letter = category.letters.find((item) => item.ipaSymbol === ipaSymbol);
    if (letter) return letter;
  }
  return undefined;
};

export const getCommonLetterByLetter = (letter: string): CommonLetter[] => {
  const results: CommonLetter[] = [];
  for (const category of commonLettersData) {
    const letters = category.letters.filter((item) => item.letter.toLowerCase() === letter.toLowerCase());
    results.push(...letters);
  }
  return results;
};

export const getAllCommonLetters = (): CommonLetter[] => {
  return commonLettersData.flatMap((category) => category.letters);
};

export const getCommonLettersCategories = (): string[] => {
  return commonLettersData.map((category) => category.category);
};
