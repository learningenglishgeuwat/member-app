export const voicedConsonantManualWordHighlightOverrides: Record<string, Record<string, string[]>> = {
    'b': {
    // =========================================================================
    // 1. KASUS MULTIPLE SOUNDS (Dua bunyi /b/ dalam satu kata)
    // =========================================================================
    baby: ['0', '2'],

    // =========================================================================
    // 2. MEMPERBAIKI BOCORNYA POLA '-be' DAN 'bu-'
    // Mencegah 'e' atau 'u' ikut menyala di posisi depan/tengah halaman /b/
    // =========================================================================
    bed: ['b'],
    bus: ['b'],
    number: ['3'], // Mengunci 'b' saja, mencegah 'e' menyala

    // =========================================================================
    // 3. MEMPERBAIKI BOCORNYA POLA 'bl-'
    // Mencegah huruf 'l' atau 'e' ikut menyala saat posisi cluster di tengah/akhir
    // =========================================================================
    problem: ['3'],
    public: ['2'],
    table: ['2'],
  },
  'd': {
    // =========================================================================
    // 1. KASUS MULTIPLE SOUNDS (Dua bunyi /d/ dalam satu kata)
    // =========================================================================
    dad: ['0', '2'],
    did: ['0', '2'],
    decide: ['0', '4', '5'],

    // =========================================================================
    // 2. MEMPERBAIKI BOCORNYA POLA '-de'
    // Mencegah huruf 'e' ikut menyala pada kata yang memiliki kombinasi 'de'
    // di posisi awal/tengah kata (bukan akhiran kata).
    // =========================================================================
    dear: ['d'],
    deal: ['d'],
    deep: ['d'],
    under: ['2'],   // Mengunci 'd' di indeks 2
    order: ['2'],   // Mengunci 'd' di indeks 2
    leader: ['3'],  // Mengunci 'd' di indeks 3
    reading: ['3'], // Mengunci 'd' di indeks 3
    design: ['d'],
    detail: ['d'],
  },
  
  'g': {
    // =========================================================================
    // 1. MEMPERBAIKI BOCORNYA POLA '-gue' & 'gu-'
    // Mencegah huruf 'u' atau 'e' ikut menyala pada kata yang memiliki 'gu'/'ge'
    // di posisi awal atau tengah (bukan di akhir kata).
    // =========================================================================
    get: ['g'],
    give: ['g'],
    together: ['2'], // Mengunci 'g' di indeks 2 agar 'e' tidak ikut menyala
    finger: ['3'],   // Mengunci 'g' di indeks 3 dari pola '-nger' agar 'e' tidak ikut
    eager: ['2'],    // Mengunci 'g' di indeks 2
    tiger: ['2'],    // Mengunci 'g' di indeks 2
    regular: ['2'],  // Mengunci 'g' di indeks 2, mencegah konflik 'gu-' di tengah

    // =========================================================================
    // 2. KASUS CLUSTER CONFLICT (Mencegah huruf 'r' atau 'l' ikut menyala)
    // =========================================================================
    great: ['gr'],
    green: ['gr'],
    glass: ['gl'],
    ugly: ['1'],     // Mengunci 'g' di indeks 1, mencegah 'l' menyala akibat pola 'gl-'
  },
  'v': {
    very: ['v'],
    river: ['v'],
    silver: ['v'],
    over: ['v'],
    ever: ['v'],
    never: ['v'],
    seven: ['v'],
    travel: ['v'],
    even: ['v'],
    level: ['v'],
  },
  'ð': {
    these: ['th'],
    then: ['th'],
    there: ['th'],
    they: ['th'],
    them: ['th'],
    their: ['th'],
    other: ['th'],
    another: ['th'],
    mother: ['th'],
    father: ['th'],
    brother: ['th'],
    together: ['th'],
    weather: ['th'],
    whether: ['th'],
    rather: ['th'],
    gather: ['th'],
  },
  'z': {
    zoo: ['z'],
    zero: ['z'],
    zip: ['z'],
    zone: ['z'],
    zebra: ['z'],
    zeal: ['z'],
    zoom: ['z'],
    zinc: ['z'],
    zigzag: ['0', '3'],
    zodiac: ['z'],
    busy: ['s'],
    easy: ['s'],
    lazy: ['z'],
    crazy: ['z'],
    dozen: ['z'],
    cousin: ['s'],
    season: ['3'],
    music: ['s'],
    desert: ['s'],
    frozen: ['z'],
    size: ['ze'],
    prize: ['ze'],
    rise: ['se'],
    wise: ['se'],
    noise: ['se'],
    please: ['se'],
    because: ['se'],
    does: ['es'],
    was: ['s'],
    is: ['s'],
  },
  'ʒ': {
    measure: ['s'],
    pleasure: ['s'],
    treasure: ['s'],
    leisure: ['s'],
    vision: ['si'],
    decision: ['si'],
    television: ['si'],
    occasion: ['si'],
    collision: ['si'],
    division: ['si'],
    revision: ['si'],
    provision: ['si'],
    confusion: ['si'],
    illusion: ['si'],
    conclusion: ['si'],
    invasion: ['si'],
    erosion: ['si'],
    explosion: ['si'],
    precision: ['si'],
    version: ['si'],
    massage: ['ge'],
    garage: ['ge'],
    mirage: ['ge'],
    beige: ['ge'],
    rouge: ['ge'],
    prestige: ['ge'],
    collage: ['ge'],
    espionage: ['ge'],
    camouflage: ['ge'],
    sabotage: ['ge'],
  },
  'ʤ': {
    job: ['j'],
    joke: ['j'],
    joy: ['j'],
    join: ['j'],
    juice: ['j'],
    judge: ['j', 'dge'],
    jungle: ['j'],
    january: ['j'],
    june: ['j'],
    july: ['j'],
    engine: ['gi'],
    region: ['gi'],
    religion: ['gi'],
    education: ['d'],
    adjust: ['dj'],
    project: ['j'],
    subject: ['j'],
    danger: ['g'],
    manager: ['g'],
    major: ['j'],
    large: ['ge'],
    change: ['ge'],
    page: ['ge'],
    age: ['ge'],
    stage: ['ge'],
    bridge: ['dge'],
    edge: ['dge'],
    huge: ['ge'],
    college: ['ge'],
    badge: ['dge'],
  },
  'l': {
    let: ['l'],
    level: ['l', 'el'],
    yellow: ['ll'],
    color: ['l'],
    valley: ['ll'],
    million: ['ll'],
    public: ['l'],
    believe: ['l'],
    dollar: ['ll'],
    meal: ['l'],
    mail: ['l'],
    ball: ['ll'],
    call: ['ll'],
    fall: ['ll'],
    full: ['ll'],
    cool: ['l'],
    school: ['l'],
    tool: ['l'],
    wall: ['ll'],
  },
  'm': {
    moment: ['m', 'm'],
    member: ['m', 'm'],
    memory: ['m', 'm'],
  },
  'n': {
    new: ['n'],
    need: ['n'],
    near: ['n'],
    next: ['n'],
    never: ['n'],
    nothing: ['n'],
    money: ['n'],
  },
  'ŋ': {
    finger: ['ng'],
    longer: ['ng'],
    stronger: ['ng'],
  },
  'r': {
    red: ['r'],
    read: ['r'],
    reach: ['r'],
    area: ['r'],
    direction: ['r'],
    parent: ['r'],
    library: ['r', 'r'],
    direct: ['r'],
    ready: ['r'],
  },
  'w': {
    work: ['w'],
    word: ['w'],
    world: ['w'],
    hardware: ['w'],
    software: ['w'],
  },

  'j': {
    you: ['y'],
    young: ['y'],
    yesterday: ['0'], // Menggunakan angka karena ada dua huruf 'y'
    youth: ['y'],
    your: ['y'],
    million: ['io'],
    onion: ['io'],
    beautiful: ['eau'],
    future: ['1'], // Menggunakan angka karena ada dua huruf 'u'
    senior: ['io'],
  },
};
