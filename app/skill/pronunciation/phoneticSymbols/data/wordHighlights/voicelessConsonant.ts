export const voicelessConsonantManualWordHighlightOverrides: Record<string, Record<string, string[]>> = {

    'p': {
    // Memperbaiki kebocoran pola '-pe' agar tidak ikut menyalakan huruf 'e'
    pen: ['p'],
    pet: ['p'],
    open: ['p'],
    super: ['p'],
    paper: ['p'],

    // Memperbaiki kebocoran pola 'pr-' agar tidak ikut menyalakan huruf 'r'
    price: ['pr'],
    problem: ['pr'],
    practice: ['pr'],
  },
  't': {
    // Memperbaiki bocornya pola '-te' (menghapus 'e' yang ikut menyala di depan/tengah)
    ten: ['t'],
    tell: ['t'],
    team: ['t'],
    hotel: ['t'],

    // Memperbaiki bocornya pola 'tr-' dan 'th-' (mengunci agar 'r' dan 'h' tidak ikut menyala)
    try: ['tr'],
    together: ['0'], // Menggunakan indeks 0 agar hanya 't' depan yang menyala, bukan 'th' di tengah

    // Memperbaiki bocornya pola 'pt' dan 'st' (menghapus 'p' dan 's' dari highlight)
    empty: ['t'],
    capture: ['t'],
    master: ['st'],
    past: ['st'],
    fast: ['st'],

    // Kata 'test' terkena bocor ganda ('te' di depan dan 'st' di belakang)
    test: ['t', 'st'],
  },

  'k': {
    // =========================================================================
    // 1. KASUS FALSE POSITIVE (Mencegah pola 'ch' salah sasaran menyalakan /tʃ/)
    // =========================================================================
    // Huruf 'ch' di depan berbunyi /tʃ/, hanya huruf 'ck' atau 'c' tengah yang berbunyi /k/
    chicken: ['ck'],
    chocolate: ['3'], // Mengunci hanya 'c' kedua di indeks 3, bukan 'ch' di depan

    // =========================================================================
    // 2. MEMPERBAIKI BOCORNYA POLA '-ke'
    // =========================================================================
    // Mencegah huruf 'e' ikut menyala di kata-kata yang mengandung 'ke' di depan/tengah
    key: ['k'],
    keep: ['k'],
    market: ['k'],
    blanket: ['k'],
    ticket: ['ck'],
  },
  'f': {
    // =========================================================================
    // MEMPERBAIKI BOCORNYA POLA '-fe'
    // Mencegah huruf 'e' ikut menyala pada kata yang memiliki kombinasi 'fe' 
    // di posisi depan atau tengah (bukan di akhir kata).
    // =========================================================================
    safety: ['f'],
    perfect: ['f'],

    // Mengunci 'ff' agar tidak rusak/terpotong oleh bocoran pola 'fe' tengah
    coffee: ['ff'],
  },
  'θ': {
    // =========================================================================
    // KASUS CLUSTER CONFLICT
    // Mencegah huruf 'r' ikut menyala akibat terpicu oleh pola 'thr-'.
    // Kita paksa hanya kombinasi huruf 'th' saja yang aktif menyala.
    // =========================================================================
    three: ['th'],
    bathroom: ['th'],
  },
  's': {
    // Memperbaiki bocornya pola '-se' pada kata yang diawali dengan huruf 'se'
    see: ['s'],
    sell: ['s'],
    send: ['s'],
    set: ['s'],
    season: ['0'], // Hanya 's' pertama yang berbunyi /s/ (indeks 0), karena 's' kedua berbunyi /z/

    // Memperbaiki pola 'st' agar tidak ikut menyalakan huruf 't' yang tidak bisu
    system: ['0', '2'], // Menyorot kedua huruf 's' di indeks 0 dan 2
  },
  'ʃ': {
    // station -> s-t-a-t-i-o-n (indeks 0 adalah 's' biasa /s/).
    // Yang berbunyi /ʃ/ hanya 'ti' di indeks 3 dan 4.
    station: ['3', '4'],

    // tissue -> t-i-s-s-u-e. Karena ada aturan global 'ti', 
    // sistem akan salah mengira 'ti' di depan adalah /ʃ/. Yang benar adalah 'ss' di indeks 2 dan 3.
    tissue: ['2', '3'],

    // special -> s-p-e-c-i-a-l (indeks 0 adalah 's' biasa /s/).
    // Yang berbunyi /ʃ/ hanya 'ci' di indeks 3 dan 4.
    special: ['3', '4'],
  },
  'ʧ': {
    // check -> c-h-e-c-k. 'ch' di depan (indeks 0,1) adalah /tʃ/. 
    // Kita kunci indeksnya agar 'c' pada 'ck' di belakang (indeks 3) tidak ikut menyala.
    check: ['0', '1'],

    // choice -> c-h-o-i-c-e. 'ch' di depan (indeks 0,1) adalah /tʃ/. 
    // Kita kunci agar 'c' di akhir kata (indeks 4) yang berbunyi /s/ tidak ikut menyala.
    choice: ['0', '1'],

    // picture -> p-i-c-t-u-r-e. Yang berbunyi /tʃ/ adalah 'tu' (indeks 3,4).
    // Kita kunci agar huruf 'c' di indeks 2 (berbunyi /k/) tidak ikut menyala.
    picture: ['3', '4'],

    // culture -> c-u-l-t-u-r-e. Yang berbunyi /tʃ/ adalah 'tu' (indeks 4,5).
    // Kita kunci agar huruf 'c' di awal kata (indeks 0) yang berbunyi /k/ tidak ikut menyala.
    culture: ['ture'],

    // =========================================================================
    // 3. KASUS MULTIPLE SOUNDS (Kata dengan dua bunyi /ʧ/ sekaligus)
    // =========================================================================
    church: ['0', '1', '4', '5'],
  },
  'h': {
    // =========================================================================
    // KASUS SILENT LETTER & MULTIPLE H
    // Kata 'neighborhood' memiliki dua huruf 'h'. Huruf 'h' pertama di dalam 'gh' 
    // bersifat bisu (silent), sedangkan 'h' kedua pada 'hood' berbunyi /h/.
    // Kita kunci menggunakan indeks agar hanya 'h' kedua yang menyala.
    // =========================================================================
    neighborhood: ['8'],
  },
}
  

