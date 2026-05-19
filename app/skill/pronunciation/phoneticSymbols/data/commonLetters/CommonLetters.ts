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
        letter: 'u, o, ou, -oo, -oe',
        ipaSymbol: '/\u028c/',
        description: 'Pola ejaan yang sering menghasilkan bunyi /ʌ/ (AmE):',
        examples: [
          'u -> cup, luck, bus',
          'o -> love, money, come',
          'ou -> country, young, enough',
          '-oo -> blood, flood',
          '-oe -> does',
        ],
        category: 'vowel_lax',
        pronunciationTip: 'Rahang buka sedang, bibir netral. Bunyinya pendek dan tegas.',
        traps: ['Jangan dibaca /u/ panjang.', 'Dalam suku kata tanpa tekanan, sering bergeser ke /ə/.'],
      },
      {
        letter: 'i, y, ui, e, u',
        ipaSymbol: '/\u026a/',
        description: 'Pola umum untuk bunyi pendek /ɪ/:',
        examples: [
          'i -> sit, big, fish',
          'y -> gym, symbol, myth',
          'ui -> build, guilt, guitar',
          'e -> pretty, England',
          'u -> busy, minute',
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
        ],
        category: 'vowel_lax',
        pronunciationTip: 'Bibir sedikit bulat, bunyi pendek. Jaga supaya tidak jadi /u/.',
        traps: ['Sering tertukar dengan /u/.'],
      },
      {
        letter: 'e, ea, a, ie, ai, ue',
        ipaSymbol: '/\u025b/',
        description: 'Pola umum untuk bunyi /ɛ/ (AmE) atau /e/ (BrE) - bunyi yang sama, notasi berbeda:',
        examples: [
          'e -> bed, pen, send, get, set',
          'ea -> head, bread, heavy',
          'a -> many, any',
          'ie -> friend',
          'ai -> said, again',
          'ue -> guest, guess',
        ],
        category: 'vowel_lax',
        pronunciationTip: 'Rahang sedikit terbuka, vokal pendek. AmE biasa pakai /ɛ/, BrE pakai /e/.',
        traps: ['Jangan meluncur ke /eɪ/.', 'Ini adalah bunyi yang sama dengan notasi berbeda antara kamus AmE dan BrE.'],
      },
      {
        letter: 'a, e, o, u, -ion, -ian, -or',
        ipaSymbol: '/\u0259/',
        description: 'Schwa /ə/ sangat sering muncul pada suku kata lemah:',
        examples: [
          'a -> about, ago, alone',
          'e -> problem, open, system',
          'o -> police, today',
          'u -> support, supply, suggest',
          '-ion -> nation',
          '-ian -> musician',
          '-or -> doctor, actor',
        ],
        category: 'vowel_lax',
        pronunciationTip: 'Santai, ringan, tidak ditekan. Fokus ritme kalimat, bukan artikulasi kuat.',
        traps: ['Jangan beri tekanan kuat.', 'Schwa sering hilang/mereduksi dalam speech cepat.'],
      },
      {
        letter: '-er, -or, -ar',
        ipaSymbol: '/\u025a/',
        description: 'R-colored schwa (unstressed) versi AmE:',
        examples: [
          '-er -> teacher, better, under, father',
          '-or -> doctor, actor, visitor',
          '-ar -> sugar, collar, dollar',
        ],
        category: 'vowel_lax',
        pronunciationTip: 'Schwa + warna /r/ (AmE) pada suku kata LEMAH. Lidah naik sedikit ke belakang tanpa trill.',
        traps: ['Jangan dibaca "er" keras ala Indonesia.', 'Ini untuk suku kata tanpa tekanan. Untuk stressed, lihat /ɝ/.'],
      },
      {
        letter: '-ir, -ur, -or, -ear, -er',
        ipaSymbol: '/\u025d/',
        description: 'R-colored vowel (stressed) versi AmE / /ɜː/ (BrE non-rhotic):',
        examples: [
          '-ir -> bird, first, shirt, girl',
          '-ur -> turn, nurse, burger, hurt',
          '-or -> word, work, world, worm',
          '-ear -> learn, early, earth',
          '-er -> her, term, serve',
        ],
        category: 'vowel_lax',
        pronunciationTip: 'AmE: Vokal tegang dengan warna /r/ pada suku kata DITEKAN. BrE: /ɜː/ panjang tanpa /r/.',
        traps: ['Jangan samakan dengan /ɚ/ yang unstressed.', 'BrE: bird -> /bɜːd/, AmE: bird -> /bɝd/.'],
      },
    ],
  },
  {
    category: 'TENSE VOWEL',
    letters: [
      {
        letter: 'o, a, al, au',
        ipaSymbol: '/\u0251/',
        description: 'Pola umum untuk /ɑ/ dalam aksen American (AmE) - tanpa /r/ setelahnya:',
        examples: [
          'o -> hot, not, top, box (AmE)',
          'a -> father, spa',
          'al -> calm, psalm',
          'au -> aunt (AmE)',
        ],
        category: 'vowel_tense',
        pronunciationTip: 'Buka rahang lebar, bibir tidak dibulatkan. Khas AmE.',
        traps: ['BrE menggunakan /ɒ/ untuk kata hot, not, top (lihat entri /ɒ/).', 'Untuk pola ar (car, hard), lihat entri /ɑr/.'],
      },
      {
        letter: 'ar, ear, al',
        ipaSymbol: '/\u0251r/',
        description: 'Vokal /ɑ/ + konsonan /r/ (AmE rhotic):',
        examples: [
          'ar -> car, hard, start, garden, park',
          'ear -> heart, hearth',
          'al -> calm (tanpa /r/), tapi calmly bisa → /ˈkɑrmli/ di beberapa dialek',
        ],
        category: 'vowel_tense',
        pronunciationTip: 'AmE: Vokal /ɑ/ terbuka lebar, lalu langsung ke bunyi /r/ konsonan. BrE: /ɑː/ panjang tanpa /r/ (non-rhotic).',
        traps: [
          'AmE adalah rhotic (bunyi /r/ jelas): car → /kɑr/.',
          'BrE non-rhotic: car → /kɑː/ (vokal panjang, tanpa /r/).',
        ],
      },
      {
        letter: 'o, -ock, -od, -og, -op',
        ipaSymbol: '/\u0252/',
        description: 'Pola umum untuk /ɒ/ dalam aksen British (BrE) - vokal bulat pendek:',
        examples: [
          'o -> hot, not, top, box, dog',
          '-ock -> clock, rock, sock',
          '-od -> god, nod, rod',
          '-og -> log, fog, jog',
          '-op -> shop, stop, drop',
        ],
        category: 'vowel_tense',
        pronunciationTip: 'Rahang terbuka, bibir BULAT. Bunyi pendek. Khas BrE.',
        traps: ['AmE menggunakan /ɑ/ untuk kata-kata ini (tanpa bibir bulat).', 'Ini adalah perbedaan paling mendasar AmE vs BrE.'],
      },
      {
        letter: 'ee, ea, e, ie, ei, -y',
        ipaSymbol: '/i/',
        description: 'Pola ejaan produktif untuk /i/:',
        examples: [
          'ee -> see, green, meet',
          'ea -> eat, teacher, clean',
          'e -> me, he, these',
          'ie -> piece, field, belief',
          'ei -> receive, ceiling',
          '-y -> happy, baby, city',
        ],
        category: 'vowel_tense',
        pronunciationTip: 'Lidah depan tinggi, bunyi tegang dan lebih panjang.',
        traps: ['Perhatikan pengecualian ejaan seperti friend (bukan /i/).'],
      },
      {
        letter: 'oo, u_e, ue, ew, ou, o',
        ipaSymbol: '/u/',
        description: 'Pola umum untuk /u/ panjang:',
        examples: [
          'oo -> food, school, moon',
          'u_e -> rule, June, flute',
          'ue -> blue, true, issue',
          'ew -> new, few, grew',
          'ou -> group, soup, you',
          'o -> do, move',
        ],
        category: 'vowel_tense',
        pronunciationTip: 'Bibir bulat rapat, tahan sedikit lebih lama daripada /ʊ/.',
        traps: [
          'Jangan pendekkan ke /ʊ/ pada kata yang memang /u/.',
          'Yod-dropping: BrE mempertahankan /j/ (new -> /njuː/, tune -> /tjuːn/), AmE sering membuangnya (new -> /nuː/, tune -> /tuːn/).',
        ],
      },
      {
        letter: 'a, -adge, -ank, ai, au',
        ipaSymbol: '/\u00e6/',
        description: 'Pola utama untuk /æ/ (AmE):',
        examples: [
          'a -> cat, man, black, hat',
          '-adge -> badge',
          '-ank -> bank, thank',
          'ai -> plaid',
          'au -> laugh (AmE)',
        ],
        category: 'vowel_tense',
        pronunciationTip: 'Rahang turun jelas, bunyi depan. Jangan dipersempit jadi /e/.',
        traps: [
          'Sebelum /r/ sering berubah kualitas vokalnya (mis. carry).',
          'TRAP-BATH Split: Kata laugh, aunt, bath, dance di AmE pakai /æ/, tapi di BrE pakai /ɑː/ panjang (laugh → AmE /læf/, BrE /lɑːf/).',
        ],
      },
      {
        letter: 'aw, au, al, -ough',
        ipaSymbol: '/\u0254/',
        description: 'Pola umum untuk /ɔ/ (tanpa /r/ setelahnya):',
        examples: [
          'aw -> saw, law, draw',
          'au -> cause, caught, pause',
          'al -> talk, walk, chalk',
          '-ough -> thought, bought',
        ],
        category: 'vowel_tense',
        pronunciationTip: 'Bibir sedikit bulat, posisi lidah belakang-menengah.',
        traps: [
          'COT-CAUGHT MERGER: Mayoritas penutur AmE modern (terutama Midwest & West) tidak membedakan /ɑ/ dan /ɔ/. Kata cot dan caught terdengar sama → /kɑt/.',
          'Jika Anda belajar dari kamus lama atau guru BrE, perbedaan ini mungkin diajarkan, tapi banyak native AmE tidak membedakannya lagi.',
          'Untuk pola or, oor, oar (more, floor, board), lihat entri /ɔr/.',
        ],
      },
      {
        letter: 'or, oor, oar, our, ore, ar',
        ipaSymbol: '/\u0254r/',
        description: 'Vokal /ɔ/ + konsonan /r/ (AmE rhotic):',
        examples: [
          'or -> more, store, born, north, for',
          'oor -> floor, door',
          'oar -> board, soar, roar',
          'our -> four, pour, your, course',
          'ore -> core, score, before, more',
          'ar (setelah w) -> war, warm, ward, warning',
        ],
        category: 'vowel_tense',
        pronunciationTip: 'AmE: Vokal /ɔ/ dengan bibir bulat, lalu langsung ke bunyi /r/ konsonan. BrE: /ɔː/ panjang tanpa /r/ (non-rhotic).',
        traps: [
          'AmE adalah rhotic (bunyi /r/ jelas): more → /mɔr/.',
          'BrE non-rhotic: more → /mɔː/ (vokal panjang, tanpa /r/).',
          'Berbeda dari /ʊr/ (poor, pure) yang menggunakan vokal /ʊ/, bukan /ɔ/.',
        ],
      },
    ],
  },
  {
    category: 'DIPHTHONG',
    letters: [
      {
        letter: 'i_e, -igh, y, ie, uy',
        ipaSymbol: '/a\u026a/',
        description: 'Diftong naik dari /a/ ke /ɪ/:',
        examples: [
          'i_e -> time, bike, line',
          '-igh -> light, night, right',
          'y -> my, try, fly',
          'ie -> tie, pie, lie',
          'uy -> buy, guy',
        ],
        category: 'diphthong',
        pronunciationTip: 'Mulai dari /a/, lalu luncur halus ke /ɪ/ tanpa jeda.',
      },
      {
        letter: 'a_e, ai, -ay, ei, ea',
        ipaSymbol: '/e\u026a/',
        description: 'Diftong dari /e/ ke /ɪ/:',
        examples: [
          'a_e -> name, late, game',
          'ai -> rain, train, wait',
          '-ay -> day, play, stay',
          'ei -> eight, veil, neighbor',
          'ea -> break, steak, great',
        ],
        category: 'diphthong',
        pronunciationTip: 'Mulai /e/ yang bersih, lalu glide ke /ɪ/.',
      },
      {
        letter: 'oi, -oy, -oin, -oice, -oyer',
        ipaSymbol: '/\u0254\u026a/',
        description: 'Diftong dari /ɔ/ ke /ɪ/:',
        examples: [
          'oi -> coin, point, voice',
          '-oy -> boy, toy, enjoy',
          '-oin -> join, joint',
          '-oice -> choice, rejoice',
          '-oyer -> lawyer, employer',
        ],
        category: 'diphthong',
        pronunciationTip: 'Mulai dengan bibir agak bulat, lalu akhiri ke /ɪ/.',
      },
      {
        letter: '-ear, -eard, -eer, -ere',
        ipaSymbol: '/\u026ar/',
        description: 'Vokal /ɪ/ + konsonan /r/ (AmE rhotic):',
        examples: [
          '-ear -> ear, near, clear, hear',
          '-eer -> deer, career, pioneer, beer',
          '-ere -> severe, sphere, here',
          '-eard -> beard, weird',
        ],
        category: 'diphthong',
        pronunciationTip: 'AmE: Vokal /ɪ/ langsung diikuti bunyi /r/ konsonan. BrE: Diftong /ɪə/ (centering diphthong).',
        traps: ['AmE adalah rhotic (bunyi /r/ jelas), BrE non-rhotic (jadi diftong /ɪə/).'],
      },
      {
        letter: '-air, -are, -ear, -ere',
        ipaSymbol: '/\u025br/',
        description: 'Vokal /ɛ/ + konsonan /r/ (AmE rhotic):',
        examples: [
          '-air -> air, fair, chair, hair',
          '-are -> care, share, compare, dare',
          '-ear -> bear, wear, pear, swear',
          '-ere -> there, where',
        ],
        category: 'diphthong',
        pronunciationTip: 'AmE: Vokal /ɛ/ langsung diikuti bunyi /r/ konsonan. BrE: Diftong /eə/ (centering diphthong).',
        traps: ['AmE adalah rhotic (bunyi /r/ jelas), BrE non-rhotic (jadi diftong /eə/).'],
      },
      {
        letter: '-ure, -our, -oor',
        ipaSymbol: '/\u028ar/',
        description: 'Vokal /ʊ/ + konsonan /r/ (AmE rhotic):',
        examples: [
          '-ure -> pure, cure, secure, sure',
          '-our -> tour, detour, your',
          '-oor -> poor, moor',
        ],
        category: 'diphthong',
        pronunciationTip: 'AmE: Vokal /ʊ/ langsung diikuti bunyi /r/ konsonan. BrE: Diftong /ʊə/ (centering diphthong).',
        traps: ['AmE adalah rhotic (bunyi /r/ jelas), BrE non-rhotic (jadi diftong /ʊə/).', 'Banyak penutur AmE modern mengucapkan ini sebagai /ɔr/ (tour → /tɔr/).'],
      },
      {
        letter: 'o_e, oa, -ow, -oe, ou',
        ipaSymbol: '/o\u028a/',
        description: 'Diftong dari /o/ ke /ʊ/ (AmE):',
        examples: [
          'o_e -> home, nose, stone',
          'oa -> road, boat, coat',
          '-ow -> slow, snow, grow',
          '-oe -> toe, foe, doe',
          'ou -> soul, shoulder, boulder',
        ],
        category: 'diphthong',
        pronunciationTip: 'AmE: Bibir tetap agak bulat, glide halus ke /ʊ/.',
        traps: ['BrE menggunakan /əʊ/ (dimulai dari schwa, bukan /o/).'],
      },
      {
        letter: 'o_e, oa, -ow, -oe, ou',
        ipaSymbol: '/\u0259\u028a/',
        description: 'Diftong dari /ə/ ke /ʊ/ (BrE):',
        examples: [
          'o_e -> home, nose, stone',
          'oa -> road, boat, coat',
          '-ow -> slow, snow, grow',
          '-oe -> toe, foe, doe',
          'ou -> soul, shoulder',
        ],
        category: 'diphthong',
        pronunciationTip: 'BrE: Mulai dari schwa /ə/, lalu glide ke /ʊ/. Lebih netral di awal.',
        traps: ['AmE menggunakan /oʊ/ (dimulai dari /o/, bukan schwa).'],
      },
      {
        letter: 'ou, -ow, -ough, -bound, -own',
        ipaSymbol: '/a\u028a/',
        description: 'Diftong dari /a/ ke /ʊ/:',
        examples: [
          'ou -> out, sound, house',
          '-ow -> now, how, town',
          '-ough -> bough, drought',
          '-bound -> round, found',
          '-own -> clown, brown',
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
        letter: 'p, -pp, p_e, sp-, pr-',
        ipaSymbol: '/p/',
        description: 'Pola umum bunyi /p/:',
        examples: [
          'p -> pen, map, open',
          '-pp -> happy, apple, support',
          'p_e -> hope, shape',
          'sp- -> speak, sport',
          'pr- -> price, present',
        ],
        category: 'consonant_voiceless',
        pronunciationTip: 'Letupan bibir tanpa getaran suara.',
      },
      {
        letter: 'b, -bb, b_e, bl-, br-',
        ipaSymbol: '/b/',
        description: 'Pola umum bunyi /b/:',
        examples: [
          'b -> big, cab, baby',
          '-bb -> rabbit, hobby',
          'b_e -> cube',
          'bl- -> black, blue',
          'br- -> bring, brother',
        ],
        category: 'consonant_voiced',
        pronunciationTip: 'Letupan bibir dengan getaran suara.',
      },
      {
        letter: 't, -tt, -ed, st-, tr-',
        ipaSymbol: '/t/',
        description: 'Pola umum bunyi /t/:',
        examples: [
          't -> tea, top, city',
          '-tt -> little, matter, bottle',
          '-ed -> looked, worked, watched',
          'st- -> stop, best, fast',
          'tr- -> train, try',
        ],
        category: 'consonant_voiceless',
        pronunciationTip: 'Ujung lidah ke alveolar ridge, tanpa getaran.',
        traps: ['Dalam speech cepat, /t/ di tengah kata bisa terdengar lebih lemah.'],
      },
      {
        letter: 'd, -dd, -ed, dr-',
        ipaSymbol: '/d/',
        description: 'Pola umum bunyi /d/:',
        examples: [
          'd -> dog, red, ready',
          '-dd -> ladder, middle, hidden',
          '-ed -> played, cleaned, called',
          'dr- -> drive, drink',
        ],
        category: 'consonant_voiced',
        pronunciationTip: 'Posisi sama seperti /t/ tetapi voiced.',
        traps: ['Hati-hati dengan cluster -dge (seperti pada kata edge) yang menghasilkan bunyi /dʒ/, bukan /d/ murni.'],
      },
      {
        letter: 'k, c, -ck, ch, qu',
        ipaSymbol: '/k/',
        description: 'Pola paling produktif untuk /k/ (termasuk kata serapan Yunani):',
        examples: [
          'k -> key, kind, skin',
          'c -> cat, cold, class',
          '-ck -> back, black, clock',
          'ch -> chorus, character, chemistry',
          'qu -> question, quick, equal',
        ],
        category: 'consonant_voiceless',
        pronunciationTip: 'Letupan belakang lidah (velar), tanpa getaran.',
      },
      {
        letter: 'g, -gg, gh, gu, gr-',
        ipaSymbol: '/g/',
        description: 'Pola umum bunyi /g/:',
        examples: [
          'g -> go, give, game',
          '-gg -> bigger, suggest',
          'gh -> ghost, spaghetti',
          'gu -> guard, guess, guild',
          'gr- -> green, grow, great',
        ],
        category: 'consonant_voiced',
        pronunciationTip: 'Letupan velar dengan getaran suara.',
      },
      {
        letter: 'f, -ff, ph, -gh, -ft',
        ipaSymbol: '/f/',
        description: 'Pola umum bunyi /f/:',
        examples: [
          'f -> fan, life, office',
          '-ff -> coffee, traffic, different',
          'ph -> phone, photo, phrase',
          '-gh -> laugh, rough, cough',
          '-ft -> after, left',
        ],
        category: 'consonant_voiceless',
        pronunciationTip: 'Gesekan gigi atas + bibir bawah, unvoiced.',
      },
      {
        letter: 'v, -ve, f, vv, -sv-',
        ipaSymbol: '/v/',
        description: 'Pola umum bunyi /v/:',
        examples: [
          'v -> very, save, movie',
          '-ve -> have, love, active',
          'f -> of',
          'vv -> savvy',
          '-sv- -> solve, involve',
        ],
        category: 'consonant_voiced',
        pronunciationTip: 'Posisi seperti /f/, tapi voiced (ada getaran).',
        traps: ['Sering salah jadi /f/.'],
      },
      {
        letter: 'th, -ths, thr-',
        ipaSymbol: '/\u03b8/',
        description: 'Pola utama untuk voiceless th (/θ/):',
        examples: [
          'th -> think, thank, theory',
          '-th -> math, path, tooth',
          '-th- -> method, athlete',
          '-ths -> months, myths',
          'thr- -> three, throw',
        ],
        category: 'consonant_voiceless',
        pronunciationTip: 'Ujung lidah di antara gigi, udara keluar lembut tanpa suara.',
        traps: ['Jangan ganti ke /t/ atau /s/.'],
      },
      {
        letter: 'th, -ther, than',
        ipaSymbol: '/\u00f0/',
        description: 'Pola utama untuk voiced th (/ð/):',
        examples: [
          'th -> this, that, these, those',
          '-th- -> mother, brother, weather',
          'th -> the, them, there',
          '-ther -> other, another, either',
          'than -> than, then',
        ],
        category: 'consonant_voiced',
        pronunciationTip: 'Posisi sama seperti /θ/, tetapi voiced.',
        traps: ['Jangan dibaca /d/ keras.'],
      },
      {
        letter: 's, c, -ss, sc, -ce',
        ipaSymbol: '/s/',
        description: 'Pola umum bunyi /s/:',
        examples: [
          's -> see, sun, bus',
          'c -> city, face, center',
          '-ss -> class, lesson, message',
          'sc -> science, scene',
          '-ce -> dance, place, notice',
        ],
        category: 'consonant_voiceless',
        pronunciationTip: 'Desis tajam tanpa getaran.',
      },
      {
        letter: 'z, s, -zz, x, -se',
        ipaSymbol: '/z/',
        description: 'Pola umum bunyi /z/:',
        examples: [
          'z -> zoo, zero, crazy',
          's -> music, easy, present',
          '-zz -> buzz, fuzzy, dizzy',
          'x -> exam, exist, exact',
          '-se -> rose, cause, disease',
        ],
        category: 'consonant_voiced',
        pronunciationTip: 'Desis bersuara, cek getaran tenggorokan.',
      },
      {
        letter: 'sh, -ti, -ci, -si, ch',
        ipaSymbol: '/\u0283/',
        description: 'Pola umum bunyi /ʃ/ (termasuk kata serapan Perancis):',
        examples: [
          'sh -> she, shop, fish',
          '-ti -> nation, action, patient',
          '-ci -> special, efficient, social',
          '-si -> tension, mansion',
          'ch -> machine, brochure, chef',
        ],
        category: 'consonant_voiceless',
        pronunciationTip: 'Desis lebih tebal dari /s/, bibir sedikit membulat.',
      },
      {
        letter: 's, -si, -ge, z, su',
        ipaSymbol: '/\u0292/',
        description: 'Pola umum bunyi /ʒ/ (lebih terbatas):',
        examples: [
          's -> measure, pleasure, treasure',
          '-si -> vision, decision, division',
          '-ge -> beige, garage, massage',
          'z -> seizure, azure',
          'su -> usual',
        ],
        category: 'consonant_voiced',
        pronunciationTip: 'Mirip /ʃ/ tapi voiced.',
        traps: ['Jumlah kata /ʒ/ lebih sedikit dibanding /ʃ/.'],
      },
      {
        letter: 'h, wh',
        ipaSymbol: '/h/',
        description: 'Pola umum bunyi /h/:',
        examples: [
          'h -> house, help, history',
          '-h- -> behind, perhaps',
          'wh -> who, whole',
          'h- -> rehearse, reheat',
          '-h- -> forehead',
        ],
        category: 'consonant_voiceless',
        pronunciationTip: 'Hembusan napas halus dari glottis, tanpa getaran.',
        traps: ['Dalam speech cepat, /h/ kadang melemah pada fungsi tertentu.'],
      },
      {
        letter: 'ch, -tch, t_u, -tion, -ture',
        ipaSymbol: '/\u02a7/',
        description: 'Pola umum bunyi /ʧ/:',
        examples: [
          'ch -> chair, chicken, teach',
          '-tch -> watch, catch, kitchen',
          't_u -> future, nature, picture',
          '-tion -> question, suggestion',
          '-ture -> culture, adventure',
        ],
        category: 'consonant_voiceless',
        pronunciationTip: 'Gabungan letup + frikatif, unvoiced affricate.',
      },
      {
        letter: 'j, g, -dge, -dj, -ge',
        ipaSymbol: '/\u02a4/',
        description: 'Pola umum bunyi /ʤ/ (termasuk g sebelum e/i/y):',
        examples: [
          'j -> job, join, major',
          'g -> giant, gentle, gym',
          '-dge -> bridge, badge, knowledge',
          '-dj -> adjust, adjective',
          '-ge -> image, package',
        ],
        category: 'consonant_voiced',
        pronunciationTip: 'Versi voiced dari /ʧ/.',
      },
      {
        letter: 'm, -mm, -mb, sm-, -mp',
        ipaSymbol: '/m/',
        description: 'Pola umum bunyi /m/:',
        examples: [
          'm -> map, man, summer',
          '-mm -> common, hammer, grammar',
          '-mb -> climb, bomb, thumb',
          'sm- -> smile, small',
          '-mp -> lamp, simple',
        ],
        category: 'consonant_voiced',
        pronunciationTip: 'Bibir menutup, suara keluar melalui hidung.',
      },
      {
        letter: 'n, -nn, kn-, gn-, pn-, tn-',
        ipaSymbol: '/n/',
        description: 'Pola umum bunyi /n/:',
        examples: [
          'n -> name, nice, open',
          '-nn -> dinner, winner, connect',
          'kn- -> know, knife, knee',
          'gn- -> gnat, gnaw',
          'pn- -> open',
          'tn- -> written',
        ],
        category: 'consonant_voiced',
        pronunciationTip: 'Ujung lidah ke alveolar ridge, suara nasal.',
      },
      {
        letter: '-ng, -nk, -ng-, -ngue, -nger',
        ipaSymbol: '/\u014b/',
        description: 'Pola umum bunyi /ŋ/:',
        examples: [
          '-ng -> sing, long, bring (akhir kata = /ŋ/ saja)',
          '-nk -> think, uncle, anchor (= /ŋk/, bukan /ŋ/ saja)',
          '-ng- -> finger, longer, hungry',
          '-ngue -> tongue',
          '-nger -> singer, stronger',
        ],
        category: 'consonant_voiced',
        pronunciationTip: 'Belakang lidah naik ke velum, suara nasal. PENTING: Pola -nk = /ŋk/ (ada bunyi /k/), sedangkan -ng di akhir kata = /ŋ/ saja.',
        traps: ['Biasanya tidak muncul di awal kata Inggris.', 'Jangan tambah bunyi /g/ pada kata seperti sing, long (hanya /ŋ/).', 'Pada pola -nk, bunyi /k/ tetap ada: think → /θɪŋk/, bukan /θɪŋ/.'],
      },
      {
        letter: 'l, -ll, -le, -al, pl-, cl-, bl-',
        ipaSymbol: '/l/',
        description: 'Pola umum bunyi /l/:',
        examples: [
          'l -> light, late, look',
          '-ll -> bell, yellow, allow',
          '-le -> table, little, people',
          'pl- -> play',
          'cl- -> class',
          'bl- -> blue',
          '-al -> local, final',
        ],
        category: 'consonant_voiced',
        pronunciationTip: 'Ujung lidah menyentuh alveolar ridge, udara lewat sisi lidah.',
      },
      {
        letter: 'r, -rr, wr-, rh-',
        ipaSymbol: '/r/',
        description: 'Pola umum bunyi /r/ dalam AmE:',
        examples: [
          'r -> red, run, around',
          '-rr -> carry, correct, arrive',
          'wr- -> write, wrong, wrap',
          'rh- -> rhyme, rhythm',
        ],
        category: 'consonant_voiced',
        pronunciationTip: 'American /r/: lidah mendekat tanpa trill/gulung.',
        traps: ['Jangan getarkan seperti r bahasa Indonesia.'],
      },
      {
        letter: 'w, wh-, qu-, tw-, sw-',
        ipaSymbol: '/w/',
        description: 'Pola umum bunyi /w/:',
        examples: [
          'w -> we, water, window, wall, work',
          'wh- -> what, when, why, where',
          'qu- -> quick, question, quiet',
          'tw- -> twin, twelve, twenty',
          'sw- -> swim, sweet, switch',
        ],
        category: 'consonant_voiced',
        pronunciationTip: 'Bibir membulat lalu glide cepat ke vokal.',
      },
      {
        letter: 'y, i, u, eu, ew, yu-',
        ipaSymbol: '/j/',
        description: 'Notasi IPA standar untuk bunyi y (palatal glide):',
        examples: [
          'y -> yes, year, beyond, yellow',
          'i -> onion, million, senior',
          'u -> music, human, computer, student',
          'eu -> Europe',
          'ew -> few',
          'yu- -> unit, university, union',
        ],
        category: 'consonant_voiced',
        pronunciationTip: 'Lidah depan naik ke langit-langit keras lalu meluncur cepat.',
        traps: ['Dalam IPA standar internasional, simbol /y/ adalah vokal (bukan konsonan), jadi gunakan /j/ untuk bunyi "y".'],
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
