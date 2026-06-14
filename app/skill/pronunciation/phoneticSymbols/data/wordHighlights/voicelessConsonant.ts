import type { CommonLetter } from '../types';

export const voicelessConsonantManualWordHighlightOverrides: Record<string, Record<string, string[]>> = {
  'p': {
    // =========================================================================
    // KOREKSI DAN OPTIMALISASI POLA BUNYI /p/
    // =========================================================================
    open: ['p'],      // Memperbaiki kebocoran pola '-pe' agar tidak ikut menyalakan huruf 'e'
    paper: ['p'],
    peer: ['p'],
    pen: ['p'],
    perry: ['p'],
    pet: ['p'],
    practice: ['pr'], // Memperbaiki kebocoran pola 'pr-' agar tidak ikut menyalakan huruf 'r'
    price: ['pr'],
    problem: ['pr'],
    super: ['p'],
  },
  't': {
    // =========================================================================
    // KOREKSI DAN OPTIMALISASI POLA BUNYI /t/
    // =========================================================================
    capture: ['t'],   // Memperbaiki bocornya pola 'pt' dan 'st'
    empty: ['t'],
    fast: ['st'],
    hotel: ['t'],     // Memperbaiki bocornya pola '-te'
    master: ['st'],
    past: ['st'],
    taught: ['t'],
    team: ['t'],
    tell: ['t'],
    ten: ['t'],
    test: ['t', 'st'], // Terkena bocor ganda ('te' di depan dan 'st' di belakang)
    together: ['0'],   // Menggunakan indeks 0 agar hanya 't' depan yang menyala, bukan 'th' di tengah
    tread: ['t'],      // Menyorot 'tr' di depan dan 'd' di belakang, melewati 'ea' di tengah
    tree: ['t'],
    true: ['t'],
    try: ['tr'],
    water: ['t'],
  },
  'k': {
    // =========================================================================
    // KOREKSI DAN OPTIMALISASI POLA BUNYI /k/
    // =========================================================================
    blanket: ['k'],   // Memperbaiki kebocoran pola '-ke'
    chicken: ['ck'],  // Mencegah pola 'ch' salah sasaran menyalakan /tʃ/
    chocolate: ['3'], // Mengunci hanya 'c' kedua di indeks 3, bukan 'ch' di depan
    keep: ['k'],
    key: ['k'],
    market: ['k'],
    ticket: ['ck'],
  },
  'f': {
    // =========================================================================
    // KOREKSI DAN OPTIMALISASI POLA BUNYI /f/
    // =========================================================================
    after: ['f'],
    coffee: ['ff'],   // Mengunci 'ff' agar tidak rusak/terpotong oleh bocoran pola 'fe' tengah
    fear: ['f'],
    feel: ['f'],
    ferry: ['f'],
    fest: ['f'],
    perfect: ['f'],   // Memperbaiki bocornya pola '-fe' di posisi depan atau tengah
    safety: ['fe'],
    laugh: ['gh'],
    half: ['f'],
    wife: ['fe'],
    rough: ['gh'],
    safe: ['fe'],



   // KASUS KHUSUS: 'gh' di akhir kata berbunyi /f/, jadi kita kunci 'gh' agar tidak ikut menyala dari pola 'g...h'
  },
  'θ': {
    // =========================================================================
    // KASUS CLUSTER CONFLICT
    // Mencegah huruf 'r' ikut menyala akibat terpicu oleh pola 'thr-'.
    // =========================================================================
    bathroom: ['th'],
    thread: ['th'],
    three: ['th'],
    through: ['th'],
  },
  's': {
    // =========================================================================
    // KOREKSI DAN OPTIMALISASI POLA BUNYI /s/
    // =========================================================================
    sack: ['s'],
    season: ['0'],    // Hanya 's' pertama yang berbunyi /s/ (indeks 0), karena 's' kedua berbunyi /z/
    see: ['s'],       // Memperbaiki bocornya pola '-se' pada kata yang diawali dengan huruf 'se'
    sell: ['s'],
    send: ['s'],
    set: ['s'],
    sock: ['s'],
    basic: ['s'],
    class : ['s'],
    face: ['ce'],
    house: ['se'],      // Memperbaiki bocornya pola '-se' pada kata yang diawali dengan huruf 'ha'

    system: ['0', '2'], // Menyorot kedua huruf 's' di indeks 0 dan 2 (mencegah t menyala dari 'st')
  },
  'ʃ': {
    ocean: ['c', 'e'], // Memperbaiki kebocoran pola '-ce' agar tidak ikut menyalakan 'c' di kata seperti 'ocean'
    // =========================================================================
    // KOREKSI DAN OPTIMALISASI POLA BUNYI /ʃ/
    // =========================================================================
    special: ['3', '4'], // Yang berbunyi /ʃ/ hanya 'ci' di indeks 3 dan 4
    station: ['3', '4'], // Yang berbunyi /ʃ/ hanya 'ti' di indeks 3 and 4
    tissue: ['2', '3'],  // Mengunci 'ss' di indeks 2 dan 3 agar sistem tidak salah mengira 'ti' di depan
  },
  'ʧ': {
    catch: ['tch'],   // Mengunci 'c' di depan agar 't' pada 'tch' di belakang tidak ikut menyala
    // =========================================================================
    // KOREKSI DAN OPTIMALISASI POLA BUNYI /tʃ/
    // =========================================================================
    check: ['0', '1'],   // Mengunci 'ch' di depan agar 'c' pada 'ck' di belakang tidak ikut menyala
    choice: ['0', '1'],  // Mengunci 'ch' di depan agar 'c' di akhir kata (/s/) tidak ikut menyala
    church: ['0', '1', '4', '5'], // KASUS MULTIPLE SOUNDS (Dua bunyi /tʃ/ sekaligus)
    culture: ['ture'],   // Mengunci agar huruf 'c' di awal kata (/k/) tidak ikut menyala
    picture: ['3', '4'], // Yang berbunyi /tʃ/ adalah 'tu' (indeks 3,4), mencegah 'c' (/k/) menyala
  },
  'h': {
    // =========================================================================
    // KASUS SILENT LETTER & MULTIPLE H
    // =========================================================================
    neighborhood: ['8'], // Huruf 'h' pertama pada 'gh' bisu. Hanya mengunci 'h' kedua pada 'hood'.
  },
};