export const diphthongManualWordHighlightOverrides: Record<string, Record<string, string[]>> = {

  'aɪ': {
    ice: ['i', 'e'],
    time: ['i', 'e'],
    line: ['i', 'e'],
    fine: ['i', 'e'],
    nine: ['i', 'e'],
    ivory: ['0'],
    isolate: ['0'],
    iris: ['0'],
    night: ['igh'],
    light: ['igh'],
    right: ['igh'],
    fight: ['igh'],
    tight: ['igh'],
    high: ['igh'],
    buy: ['uy'],
    guy: ['uy'],
    tie: ['ie'],
  },
  'eɪ': {
    age: ['a', 'e'],
    ape: ['a', 'e'],
    name: ['a', 'e'],
    same: ['a', 'e'],
    game: ['a', 'e'],
    late: ['a', 'e'],
    date: ['a', 'e'],
    gate: ['a', 'e'],
    state: ['a', 'e'],
    ache: ['a', 'e'],
    asia: ['0'],
    away: ['ay'],
  },
  'ɪr': {
    // =========================================================================
    // 1. FALSE NEGATIVE (Tidak ada di pola ejaanmu, wajib di-override manual)
    // =========================================================================
    // Kata ini menggunakan kombinasi huruf 'eri' untuk bunyi /ɪr/.
    experience: ['eri'],

    // =========================================================================
    // 2. KASUS DOUBLE MATCHING (Mengunci suffix agar tidak pecah/terebut pola 'io' dan 'ia')
    // =========================================================================
    material: ['ial'],   // Mengunci 'ial' supaya tidak salah terkena pola 'ia' tunggal
    serious: ['ious'],   // Mengunci 'ious' supaya tidak salah terkena pola 'io' tunggal
    superior: ['ior'],   // Mengunci 'ior' supaya tidak salah terkena pola 'io' tunggal
    inferior: ['ior'],   // Sama seperti superior
    interior: ['ior'],   // Sama seperti superior
  },
  'ɛr': {
    // =========================================================================
    // 1. FALSE NEGATIVE (Tidak ada di pola ejaanmu, wajib di-override manual)
    // =========================================================================
    // Kata ini menggunakan huruf 'er' di depan, sedangkan di polamu hanya ada 'ar'.
    errand: ['er'],

    // =========================================================================
    // 2. KASUS DOUBLE MATCHING (Mencegah pola 'ar' biasa salah sasaran)
    // =========================================================================
    // Kata ini memiliki 'ar' di kata "hard" (bunyinya /ɑ/) dan 'are' di kata "ware" (bunyinya /ɛr/).
    // Jika dilepas ke auto-matching, 'ar' depan akan ikut menyala. Kita paksa hanya 'are' di akhir yang aktif.
    hardware: ['are'],
  },
    'eə': {
    // =========================================================================
    // 1. FALSE NEGATIVE (Tidak ada di pola ejaanmu, wajib di-override manual)
    // =========================================================================
    // Kata ini menggunakan huruf 'er' di depan, sedangkan di polamu hanya ada 'ar'.
    errand: ['er'],

    // =========================================================================
    // 2. KASUS DOUBLE MATCHING (Mencegah pola 'ar' biasa salah sasaran)
    // =========================================================================
    // Kata ini memiliki 'ar' di kata "hard" (bunyinya /ɑ/) dan 'are' di kata "ware" (bunyinya /ɛr/).
    // Jika dilepas ke auto-matching, 'ar' depan akan ikut menyala. Kita paksa hanya 'are' di akhir yang aktif.
    hardware: ['are'],
  },
  'ʊr': {
    tour: ['our'],
    tourist: ['our'],
    gourd: ['our'],
    your: ['our'],
    yours: ['our'],
    yourself: ['our'],
  },
  'ʊə': {
    tour: ['our'],
    tourist: ['our'],
    gourd: ['our'],
    your: ['our'],
    yours: ['our'],
    yourself: ['our'],
  },
  'oʊ': {
    // =========================================================================
    // 1. FIX BUG 'o_e': Menyorot huruf 'o' dan 'e' saja, melewati konsonan tengah.
    // =========================================================================
    home: ['o', 'e'],
    bone: ['o', 'e'],
    stone: ['o', 'e'],

    // =========================================================================
    // 2. KASUS DOUBLE SOUND (Kata ini memiliki dua bunyi /oʊ/ sekaligus)
    // =========================================================================
    // Menyorot 'o' pertama (index 0) dan 'oe' di akhir (index 2 & 3) secara presisi.
    oboe: ['0', '2', '3'],
    sew: ['ew'],
    sewed: ['ew'],
  },
  'aʊ': {
    // =========================================================================
    // 1. FALSE NEGATIVE (Pola '-ow' biasanya mencari di akhir kata, sedangkan 'owl' di awal)
    // =========================================================================
    owl: ['ow'],

    // =========================================================================
    // 2. KASUS SUBSTRING CONFLICT (Mencegah pola 'ou' tunggal memotong huruf 'r' pada 'our')
    // =========================================================================
    hour: ['our'],
    our: ['our'],
    ours: ['our'],
  },
};
