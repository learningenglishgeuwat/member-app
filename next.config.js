/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';
const grammarSlugMappings = [
  [
    '/skill/grammar/grammar-resource/resource/optional-advanced-reference/fixed-expressions-and-collocations-make-a-decision-take-responsibility-pay-attention',
    '/skill/grammar/grammar-resource/resource/optional-advanced-reference/fixed-expressions-collocations',
  ],
  [
    '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/discourse-markers-and-connectors-however-although-therefore-moreover',
    '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/discourse-markers-connectors',
  ],
  [
    '/skill/grammar/grammar-resource/resource/foundation-grammar/prepositions-after-verbs-and-adjectives-depend-on-interested-in-good-at',
    '/skill/grammar/grammar-resource/resource/foundation-grammar/prepositions-after-verbs-adjectives',
  ],
  [
    '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/modal-perfect-should-have-could-have-might-have-must-have',
    '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/modal-perfect',
  ],
  [
    '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/noun-clauses-that-clauses-whether-if-clauses-wh-clauses',
    '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/noun-clauses',
  ],
  [
    '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/stative-vs-dynamic-verbs-simple-vs-continuous-meaning',
    '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/stative-vs-dynamic-verbs',
  ],
  [
    '/skill/grammar/grammar-resource/resource/tense-and-aspect-system/future-forms-will-be-going-to-present-continuous-for-future',
    '/skill/grammar/grammar-resource/resource/tense-and-aspect-system/future-forms',
  ],
  [
    '/skill/grammar/grammar-resource/resource/tense-and-aspect-system/present-continuous-actions-in-progress-and-near-future-plan',
    '/skill/grammar/grammar-resource/resource/tense-and-aspect-system/present-continuous',
  ],
  [
    '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/mixed-conditionals-past-present-and-present-past',
    '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/mixed-conditionals',
  ],
  [
    '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/time-clauses-when-while-before-after-as-soon-as',
    '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/time-clauses',
  ],
  [
    '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/reported-speech-statements-questions-commands',
    '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/reported-speech',
  ],
  [
    '/skill/grammar/grammar-resource/resource/optional-advanced-reference/emphasis-structures-cleft-sentences-and-inversion',
    '/skill/grammar/grammar-resource/resource/optional-advanced-reference/emphasis-structures',
  ],
  [
    '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/comparative-and-superlative-regular-and-irregular-forms',
    '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/comparative-superlative',
  ],
  [
    '/skill/grammar/grammar-resource/resource/tense-and-aspect-system/present-perfect-continuous-duration-from-past-to-present',
    '/skill/grammar/grammar-resource/resource/tense-and-aspect-system/present-perfect-continuous',
  ],
  [
    '/skill/grammar/grammar-resource/resource/tense-and-aspect-system/future-continuous-action-in-progress-at-a-future-time',
    '/skill/grammar/grammar-resource/resource/tense-and-aspect-system/future-continuous',
  ],
  [
    '/skill/grammar/grammar-resource/resource/noun-and-determiner-system/possessive-determiners-my-your-his-her-its-our-their',
    '/skill/grammar/grammar-resource/resource/noun-and-determiner-system/possessive-determiners',
  ],
  [
    '/skill/grammar/grammar-resource/resource/noun-and-determiner-system/distributive-determiners-each-every-either-neither',
    '/skill/grammar/grammar-resource/resource/noun-and-determiner-system/distributive-determiners',
  ],
  [
    '/skill/grammar/grammar-resource/resource/noun-and-determiner-system/quantifiers-some-any-much-many-few-little-a-lot-of',
    '/skill/grammar/grammar-resource/resource/noun-and-determiner-system/quantifiers',
  ],
  [
    '/skill/grammar/grammar-resource/resource/noun-and-determiner-system/there-is-and-there-are-singular-plural-uncountable',
    '/skill/grammar/grammar-resource/resource/noun-and-determiner-system/there-is-there-are',
  ],
  [
    '/skill/grammar/grammar-resource/resource/functional-sentence-forms/question-forms-yes-no-questions-and-wh-questions',
    '/skill/grammar/grammar-resource/resource/functional-sentence-forms/question-forms',
  ],
  [
    '/skill/grammar/grammar-resource/resource/tense-and-aspect-system/future-perfect-completion-before-a-future-point',
    '/skill/grammar/grammar-resource/resource/tense-and-aspect-system/future-perfect',
  ],
  [
    '/skill/grammar/grammar-resource/resource/tense-and-aspect-system/present-perfect-experience-result-and-recent-change',
    '/skill/grammar/grammar-resource/resource/tense-and-aspect-system/present-perfect',
  ],
];
const extraRedirects = [
  {
    source: '/skill/pronunciation/phoneticSymbols/Summary%20of%20Phonetic%20Symbols',
    destination: '/skill/pronunciation/phoneticSymbols/summary-of-phonetic-symbols',
    permanent: true,
  },
];

const nextConfig = {
  // Keep output path short to avoid Windows MAX_PATH issues in Turbopack.
  distDir: process.env.NEXT_DIST_DIR || (isProd ? '.next' : '.d'),
  // Fix NavigatorLockAcquireTimeoutError
  allowedDevOrigins: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3001', 'http://127.0.0.1:3001'],

  // Nonaktifkan StrictMode untuk menghilangkan debugger pause
  reactStrictMode: false,

  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Cache optimization
  experimental: {
    optimizeCss: true,
  },
  async redirects() {
    return [
      ...grammarSlugMappings.map(([destination, source]) => ({
        source,
        destination,
        permanent: true,
      })),
      ...extraRedirects,
    ];
  },
};

module.exports = nextConfig;
