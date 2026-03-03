import type { GrammarTopicCatalogItem, GrammarTopicGroup } from './grammarTypes';

type RawTopic = {
  topicLabel: string;
  href: string;
  keywords?: string[];
};

type RawGroup = {
  groupId: string;
  groupTitle: string;
  topics: RawTopic[];
};

const STOPWORDS = new Set([
  'and',
  'the',
  'for',
  'of',
  'to',
  'a',
  'an',
  'in',
  'on',
  'at',
  'vs',
  'dan',
  'atau',
  'yang',
  'untuk',
  'dengan',
  'dari',
  'ke',
  'di',
  'pada',
]);

const normalize = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9/\-\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const toTopicId = (href: string): string => {
  const segment = href.split('/').filter(Boolean).at(-1) ?? '';
  return segment
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
};

const makeKeywords = (topicLabel: string, topicId: string, href: string, extra?: string[]): string[] => {
  const source = [topicLabel, topicId, href, ...(extra ?? [])];
  return Array.from(
    new Set(
      source
        .flatMap((item) => normalize(item).split(' '))
        .filter((token) => token.length > 1 && !STOPWORDS.has(token)),
    ),
  );
};

const RAW_GROUPS: RawGroup[] = [
  {
    groupId: 'foundation-grammar',
    groupTitle: 'Foundation Grammar',
    topics: [
      {
        topicLabel: 'Language Units (Letter, Word, Phrase, Clause, Sentence)',
        href: '/skill/grammar/grammar-resource/resource/foundation-grammar/language-units',
      },
      {
        topicLabel:
          'Parts of Speech (Noun, Pronoun, Verb, Adjective, Adverb, Preposition, Conjunction)',
        href: '/skill/grammar/grammar-resource/resource/foundation-grammar/parts-of-speech',
      },
      {
        topicLabel: 'Sentence Elements and Word Order (Subject-Verb-Object-Complement)',
        href: '/skill/grammar/grammar-resource/resource/foundation-grammar/sentence-elements-and-word-order',
      },
      {
        topicLabel: 'Nouns (Types and Functions)',
        href: '/skill/grammar/grammar-resource/resource/foundation-grammar/nouns-types-and-functions',
      },
      {
        topicLabel: 'Pronouns (Subject, Object, Possessive, Reflexive)',
        href: '/skill/grammar/grammar-resource/resource/foundation-grammar/pronouns-subject-object-possessive-reflexive',
      },
      {
        topicLabel: 'Verbs (Main Verbs and Auxiliaries)',
        href: '/skill/grammar/grammar-resource/resource/foundation-grammar/verbs--main-verbs-and-auxiliaries-be-do-have',
      },
      {
        topicLabel: 'Subject-Verb Agreement (Singular and Plural)',
        href: '/skill/grammar/grammar-resource/resource/foundation-grammar/subject-verb-agreement-singular-and-plural',
      },
      {
        topicLabel: 'Adjectives (Function and Position)',
        href: '/skill/grammar/grammar-resource/resource/foundation-grammar/adjectives-function-and-position',
      },
      {
        topicLabel: 'Adverbs (Function and Position)',
        href: '/skill/grammar/grammar-resource/resource/foundation-grammar/adverbs-function-and-position',
      },
      {
        topicLabel: 'Prepositions of Time and Place (in, on, at)',
        href: '/skill/grammar/grammar-resource/resource/foundation-grammar/prepositions-of-time-and-place-in-on-at',
      },
      {
        topicLabel: 'Prepositions after Verbs and Adjectives (depend on, interested in, good at)',
        href: '/skill/grammar/grammar-resource/resource/foundation-grammar/prepositions-after-verbs-adjectives',
      },
      {
        topicLabel: 'Interjections (Function and Punctuation)',
        href: '/skill/grammar/grammar-resource/resource/foundation-grammar/interjections-function-and-punctuation',
      },
      {
        topicLabel: 'Sentence Types (Declarative, Interrogative, Imperative, Exclamative)',
        href: '/skill/grammar/grammar-resource/resource/foundation-grammar/sentence-types',
      },
      {
        topicLabel: 'Negation Basics (not, no, never, do-support)',
        href: '/skill/grammar/grammar-resource/resource/foundation-grammar/negation-basics',
      },
    ],
  },
  {
    groupId: 'noun-and-determiner-system',
    groupTitle: 'Noun and Determiner System',
    topics: [
      {
        topicLabel: 'Articles (a, an, the, zero article)',
        href: '/skill/grammar/grammar-resource/resource/noun-and-determiner-system/articles-a-an-the-zero-article',
      },
      {
        topicLabel: 'Demonstratives (this, that, these, those)',
        href: '/skill/grammar/grammar-resource/resource/noun-and-determiner-system/demonstratives-this-that-these-those',
      },
      {
        topicLabel: 'Possessive Determiners (my, your, his, her, its, our, their)',
        href: '/skill/grammar/grammar-resource/resource/noun-and-determiner-system/possessive-determiners',
      },
      {
        topicLabel: 'Distributive Determiners (each, every, either, neither)',
        href: '/skill/grammar/grammar-resource/resource/noun-and-determiner-system/distributive-determiners',
      },
      {
        topicLabel: 'Numbers as Determiners (one, two, first, second)',
        href: '/skill/grammar/grammar-resource/resource/noun-and-determiner-system/numbers-as-determiners-one-two-first-second',
      },
      {
        topicLabel: 'Countable and Uncountable Nouns',
        href: '/skill/grammar/grammar-resource/resource/noun-and-determiner-system/countable-and-uncountable-nouns',
      },
      {
        topicLabel: 'Quantifiers (some, any, much, many, few, little, a lot of)',
        href: '/skill/grammar/grammar-resource/resource/noun-and-determiner-system/quantifiers',
      },
      {
        topicLabel: 'There Is and There Are (Singular, Plural, Uncountable)',
        href: '/skill/grammar/grammar-resource/resource/noun-and-determiner-system/there-is-there-are',
      },
      {
        topicLabel: "Possessive Forms ('s, of, double possessive)",
        href: '/skill/grammar/grammar-resource/resource/noun-and-determiner-system/possessive-forms',
      },
      {
        topicLabel: 'Noun Modifiers and Compound Nouns',
        href: '/skill/grammar/grammar-resource/resource/noun-and-determiner-system/noun-modifiers-compound-nouns',
      },
      {
        topicLabel: 'Determiner Combinations (all, both, half + articles/possessives)',
        href: '/skill/grammar/grammar-resource/resource/noun-and-determiner-system/determiner-combinations',
      },
    ],
  },
  {
    groupId: 'tense-and-aspect-system',
    groupTitle: 'Tense and Aspect System',
    topics: [
      {
        topicLabel: 'Present Simple (Habits and Facts)',
        href: '/skill/grammar/grammar-resource/resource/tense-and-aspect-system/present-simple-habits-and-facts',
      },
      {
        topicLabel: 'Present Continuous (Actions in Progress and Near Future Plan)',
        href: '/skill/grammar/grammar-resource/resource/tense-and-aspect-system/present-continuous',
      },
      {
        topicLabel: 'Past Simple (Finished Past Events)',
        href: '/skill/grammar/grammar-resource/resource/tense-and-aspect-system/past-simple-finished-past-events',
      },
      {
        topicLabel: 'Past Continuous (Ongoing Action in the Past)',
        href: '/skill/grammar/grammar-resource/resource/tense-and-aspect-system/past-continuous-ongoing-action-in-the-past',
      },
      {
        topicLabel: 'Future Forms (will, be going to, present continuous for future)',
        href: '/skill/grammar/grammar-resource/resource/tense-and-aspect-system/future-forms',
      },
      {
        topicLabel: 'Present Perfect (Experience, Result, and Recent Change)',
        href: '/skill/grammar/grammar-resource/resource/tense-and-aspect-system/present-perfect',
      },
      {
        topicLabel: 'Past Perfect (Earlier Past Event)',
        href: '/skill/grammar/grammar-resource/resource/tense-and-aspect-system/past-perfect-earlier-past-event',
      },
      {
        topicLabel: 'Present Perfect Continuous (Duration from Past to Present)',
        href: '/skill/grammar/grammar-resource/resource/tense-and-aspect-system/present-perfect-continuous',
      },
      {
        topicLabel: 'Future Continuous (Action in Progress at a Future Time)',
        href: '/skill/grammar/grammar-resource/resource/tense-and-aspect-system/future-continuous',
      },
      {
        topicLabel: 'Future Perfect (Completion Before a Future Point)',
        href: '/skill/grammar/grammar-resource/resource/tense-and-aspect-system/future-perfect',
      },
      {
        topicLabel: 'Past Perfect Continuous',
        href: '/skill/grammar/grammar-resource/resource/tense-and-aspect-system/past-perfect-continuous',
      },
      {
        topicLabel: 'Future Perfect Continuous',
        href: '/skill/grammar/grammar-resource/resource/tense-and-aspect-system/future-perfect-continuous',
      },
      {
        topicLabel: 'Used to and Would (Past Habits and States)',
        href: '/skill/grammar/grammar-resource/resource/tense-and-aspect-system/used-to-and-would',
      },
      {
        topicLabel: 'Present Perfect vs Past Simple (Contrast)',
        href: '/skill/grammar/grammar-resource/resource/tense-and-aspect-system/present-perfect-vs-past-simple',
      },
    ],
  },
  {
    groupId: 'functional-sentence-forms',
    groupTitle: 'Functional Sentence Forms',
    topics: [
      {
        topicLabel: 'Question Forms (Yes/No Questions and WH Questions)',
        href: '/skill/grammar/grammar-resource/resource/functional-sentence-forms/question-forms',
      },
      {
        topicLabel: 'Imperatives (Commands, Requests, Instructions)',
        href: '/skill/grammar/grammar-resource/resource/functional-sentence-forms/imperatives-commands-requests-instructions',
      },
      {
        topicLabel: 'Core Modals (can, could, may, might, should, must)',
        href: '/skill/grammar/grammar-resource/resource/functional-sentence-forms/core-modals-can-could-may-might-should-must',
      },
      {
        topicLabel: 'Question Tags (Confirmation and Interaction)',
        href: '/skill/grammar/grammar-resource/resource/functional-sentence-forms/question-tags-confirmation-and-interaction',
      },
      {
        topicLabel: 'Indirect Questions (Polite Question Structure)',
        href: '/skill/grammar/grammar-resource/resource/functional-sentence-forms/indirect-questions-polite-question-structure',
      },
      {
        topicLabel: 'Exclamatives (What/How)',
        href: '/skill/grammar/grammar-resource/resource/functional-sentence-forms/exclamatives',
      },
      {
        topicLabel: 'Requests, Offers, Suggestions (Could, Would, Shall, Let us)',
        href: '/skill/grammar/grammar-resource/resource/functional-sentence-forms/requests-offers-suggestions',
      },
      {
        topicLabel: 'Short Answers and Response Patterns (So do I, Neither do I)',
        href: '/skill/grammar/grammar-resource/resource/functional-sentence-forms/short-answers-response-patterns',
      },
    ],
  },
  {
    groupId: 'expansion-and-complex-structures',
    groupTitle: 'Expansion and Complex Structures',
    topics: [
      {
        topicLabel: 'Conjunctions (and, but, or, because, so)',
        href: '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/conjunctions-and-but-or-because-so',
      },
      {
        topicLabel: 'Discourse Markers and Connectors (however, although, therefore, moreover)',
        href: '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/discourse-markers-connectors',
      },
      {
        topicLabel: 'Comparative and Superlative (Regular and Irregular Forms)',
        href: '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/comparative-superlative',
      },
      {
        topicLabel: 'Gerunds and Infinitives (Verb Patterns)',
        href: '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/gerunds-and-infinitives-verb-patterns',
      },
      {
        topicLabel: 'Relative Clauses (who, which, that, where, whose)',
        href: '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/relative-clauses-who-which-that-where-whose',
      },
      {
        topicLabel: 'Noun Clauses (that clauses, whether/if clauses, wh clauses)',
        href: '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/noun-clauses',
      },
      {
        topicLabel: 'Time Clauses (when, while, before, after, as soon as)',
        href: '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/time-clauses',
      },
      {
        topicLabel: 'Passive Voice (Form and Use Across Tenses)',
        href: '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/passive-voice-form-and-use-across-tenses',
      },
      {
        topicLabel: 'Reported Speech (Statements, Questions, Commands)',
        href: '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/reported-speech',
      },
      {
        topicLabel: 'Conditionals Type 0/1/2/3',
        href: '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/conditionals-type-0-1-2-3',
      },
      {
        topicLabel: 'Mixed Conditionals (Past-Present and Present-Past)',
        href: '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/mixed-conditionals',
      },
      {
        topicLabel: 'Modal Perfect (should have, could have, might have, must have)',
        href: '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/modal-perfect',
      },
      {
        topicLabel: 'Stative vs Dynamic Verbs (Simple vs Continuous Meaning)',
        href: '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/stative-vs-dynamic-verbs',
      },
      {
        topicLabel: 'Adverbial Clauses (Reason, Purpose, Result, Concession)',
        href: '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/adverbial-clauses',
      },
      {
        topicLabel: 'Defining vs Non-defining Relative Clauses',
        href: '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/defining-vs-non-defining-relative-clauses',
      },
      {
        topicLabel: 'Reduced Relative / Participle Clauses',
        href: '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/reduced-relative-participle-clauses',
      },
      {
        topicLabel: 'Causatives (have/get something done)',
        href: '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/causatives-have-get-something-done',
      },
      {
        topicLabel: 'Wish and If only',
        href: '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/wish-and-if-only',
      },
    ],
  },
  {
    groupId: 'optional-advanced-reference',
    groupTitle: 'Optional Advanced Reference',
    topics: [
      {
        topicLabel:
          'Fixed Expressions and Collocations (make a decision, take responsibility, pay attention)',
        href: '/skill/grammar/grammar-resource/resource/optional-advanced-reference/fixed-expressions-collocations',
      },
      {
        topicLabel: 'Emphasis Structures (cleft sentences and inversion)',
        href: '/skill/grammar/grammar-resource/resource/optional-advanced-reference/emphasis-structures',
      },
      {
        topicLabel: 'Subjunctive Structures',
        href: '/skill/grammar/grammar-resource/resource/optional-advanced-reference/subjunctive-structures',
      },
      {
        topicLabel: 'Advanced Inversion Sets (Not until, So/Such ... that)',
        href: '/skill/grammar/grammar-resource/resource/optional-advanced-reference/advanced-inversion-sets',
      },
      {
        topicLabel: 'Hedging and Stance Grammar (seems to, appears to, likely to)',
        href: '/skill/grammar/grammar-resource/resource/optional-advanced-reference/hedging-and-stance-grammar',
      },
    ],
  },
  {
    groupId: 'grammar-accuracy-and-mechanics',
    groupTitle: 'Grammar Accuracy and Mechanics',
    topics: [
      {
        topicLabel: 'Punctuation for Clause Boundaries (Run-on, Comma Splice)',
        href: '/skill/grammar/grammar-resource/resource/grammar-accuracy-and-mechanics/punctuation-clause-boundaries',
      },
      {
        topicLabel: 'Sentence Fragments and Repair Patterns',
        href: '/skill/grammar/grammar-resource/resource/grammar-accuracy-and-mechanics/sentence-fragments-and-repair-patterns',
      },
      {
        topicLabel: 'Apostrophe and Capitalization Patterns (Grammar Meaning)',
        href: '/skill/grammar/grammar-resource/resource/grammar-accuracy-and-mechanics/apostrophe-capitalization-grammar-meaning',
      },
    ],
  },
];

export const GRAMMAR_RESOURCE_GROUPS: GrammarTopicGroup[] = RAW_GROUPS.map((group) => ({
  groupId: group.groupId,
  groupTitle: group.groupTitle,
  topics: group.topics.map((topic) => {
    const topicId = toTopicId(topic.href);
    return {
      groupId: group.groupId,
      groupTitle: group.groupTitle,
      topicId,
      topicLabel: topic.topicLabel,
      href: topic.href,
      keywords: makeKeywords(topic.topicLabel, topicId, topic.href, topic.keywords),
    };
  }),
}));

export const GRAMMAR_RESOURCE_TOPICS: GrammarTopicCatalogItem[] = GRAMMAR_RESOURCE_GROUPS.flatMap(
  (group) => group.topics,
);

export const GRAMMAR_RESOURCE_TOPIC_MAP: Record<string, GrammarTopicCatalogItem> =
  GRAMMAR_RESOURCE_TOPICS.reduce<Record<string, GrammarTopicCatalogItem>>((acc, topic) => {
    acc[topic.topicId] = topic;
    return acc;
  }, {});
