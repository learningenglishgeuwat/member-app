export const tenseVowelManualWordHighlightOverrides: Record<string, Record<string, string[]>> = {
  'i': {
    eat: ['ea'],
    easy: ['ea'],
    each: ['ea'],
    eagle: ['ea'],
    even: ['0'],
    east: ['ea'],
    eager: ['ea'],
    equal: ['e'],
    evening: ['0'],
    eel: ['ee'],
    seat: ['ea'],
    meat: ['ea'],
    heat: ['ea'],
    beat: ['ea'],
    street: ['ee'],
    green: ['ee'],
    clean: ['ea'],
    dream: ['ea'],
    team: ['ea'],
    leave: ['ea'],
    see: ['ee'],
    be: ['e'],
    me: ['e'],
    we: ['e'],
    tree: ['ee'],
    free: ['ee'],
    key: ['ey'],
    tea: ['ea'],
    she: ['e'],
    he: ['e'],
  },
  'i\u02d0': {
    eagle: ['0', '1'],
  },
  'u': {
    // =========================================================================
    // 1. KASUS KONFLIK REGEX UNDERSCORE (Pola seperti u_e, oo_e akan menghasilkan nama pola kotor)
    // =========================================================================
    ooze: ['oo'],
    goose: ['oo'],
    rude: ['u'],
    use: ['u'],

    // =========================================================================
    // 2. KASUS DOUBLE MATCHING (Mencegah huruf vokal lain/tunggal ikut menyala)
    // =========================================================================
    ouzo: ['ou'],
    blue: ['ue'],
    true: ['ue'],
    glue: ['ue'],
    suit: ['ui'],
    fruit: ['ui'],
    group: ['ou'],
    you: ['ou'],
  },
  
};
