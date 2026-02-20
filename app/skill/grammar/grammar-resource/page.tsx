 'use client';

import { useEffect, useState } from 'react';
import BackButton from '../../components/BackButton';
import Link from 'next/link';
import './grammar-resource.css';

const TOPIC_GROUPS = [
  {
    title: 'Foundation Grammar',
    topics: [
      {
        label: 'Language Units (Letter, Word, Phrase, Clause, Sentence)',
        href: '/skill/grammar/grammar-resource/resource/foundation-grammar/language-units',
      },
      {
        label: 'Parts of Speech (Noun, Pronoun, Verb, Adjective, Adverb, Preposition, Conjunction)',
        href: '/skill/grammar/grammar-resource/resource/foundation-grammar/parts-of-speech',
      },
      {
        label: 'Sentence Elements and Word Order (Subject-Verb-Object-Complement)',
        href: '/skill/grammar/grammar-resource/resource/foundation-grammar/sentence-elements-and-word-order',
      },
      {
        label: 'Nouns (Types and Functions)',
        href: '/skill/grammar/grammar-resource/resource/foundation-grammar/nouns-types-and-functions',
      },
      {
        label: 'Pronouns (Subject, Object, Possessive, Reflexive)',
        href: '/skill/grammar/grammar-resource/resource/foundation-grammar/pronouns-subject-object-possessive-reflexive',
      },
      {
        label: 'Verbs (Main Verbs and Auxiliaries)',
        href: '/skill/grammar/grammar-resource/resource/foundation-grammar/verbs--main-verbs-and-auxiliaries-be-do-have',
      },
      {
        label: 'Subject-Verb Agreement (Singular and Plural)',
        href: '/skill/grammar/grammar-resource/resource/foundation-grammar/subject-verb-agreement-singular-and-plural',
      },
      {
        label: 'Adjectives (Function and Position)',
        href: '/skill/grammar/grammar-resource/resource/foundation-grammar/adjectives-function-and-position',
      },
      {
        label: 'Adverbs (Function and Position)',
        href: '/skill/grammar/grammar-resource/resource/foundation-grammar/adverbs-function-and-position',
      },
      {
        label: 'Prepositions of Time and Place (in, on, at)',
        href: '/skill/grammar/grammar-resource/resource/foundation-grammar/prepositions-of-time-and-place-in-on-at',
      },
      {
        label: 'Prepositions after Verbs and Adjectives (depend on, interested in, good at)',
        href: '/skill/grammar/grammar-resource/resource/foundation-grammar/prepositions-after-verbs-adjectives',
      },
      {
        label: 'Interjections (Function and Punctuation)',
        href: '/skill/grammar/grammar-resource/resource/foundation-grammar/interjections-function-and-punctuation',
      },
      {
        label: 'Sentence Types (Declarative, Interrogative, Imperative, Exclamative)',
        href: '/skill/grammar/grammar-resource/resource/foundation-grammar/sentence-types',
      },
      {
        label: 'Negation Basics (not, no, never, do-support)',
        href: '/skill/grammar/grammar-resource/resource/foundation-grammar/negation-basics',
      },
    ],
  },
  {
    title: 'Noun and Determiner System',
    topics: [
      {
        label: 'Articles (a, an, the, zero article)',
        href: '/skill/grammar/grammar-resource/resource/noun-and-determiner-system/articles-a-an-the-zero-article',
      },
      {
        label: 'Demonstratives (this, that, these, those)',
        href: '/skill/grammar/grammar-resource/resource/noun-and-determiner-system/demonstratives-this-that-these-those',
      },
      {
        label: 'Possessive Determiners (my, your, his, her, its, our, their)',
        href: '/skill/grammar/grammar-resource/resource/noun-and-determiner-system/possessive-determiners',
      },
      {
        label: 'Distributive Determiners (each, every, either, neither)',
        href: '/skill/grammar/grammar-resource/resource/noun-and-determiner-system/distributive-determiners',
      },
      {
        label: 'Numbers as Determiners (one, two, first, second)',
        href: '/skill/grammar/grammar-resource/resource/noun-and-determiner-system/numbers-as-determiners-one-two-first-second',
      },
      {
        label: 'Countable and Uncountable Nouns',
        href: '/skill/grammar/grammar-resource/resource/noun-and-determiner-system/countable-and-uncountable-nouns',
      },
      {
        label: 'Quantifiers (some, any, much, many, few, little, a lot of)',
        href: '/skill/grammar/grammar-resource/resource/noun-and-determiner-system/quantifiers',
      },
      {
        label: 'There Is and There Are (Singular, Plural, Uncountable)',
        href: '/skill/grammar/grammar-resource/resource/noun-and-determiner-system/there-is-there-are',
      },
      {
        label: "Possessive Forms ('s, of, double possessive)",
        href: '/skill/grammar/grammar-resource/resource/noun-and-determiner-system/possessive-forms',
      },
      {
        label: 'Noun Modifiers and Compound Nouns',
        href: '/skill/grammar/grammar-resource/resource/noun-and-determiner-system/noun-modifiers-compound-nouns',
      },
      {
        label: 'Determiner Combinations (all, both, half + articles/possessives)',
        href: '/skill/grammar/grammar-resource/resource/noun-and-determiner-system/determiner-combinations',
      },
    ],
  },
  {
    title: 'Tense and Aspect System',
    topics: [
      {
        label: 'Present Simple (Habits and Facts)',
        href: '/skill/grammar/grammar-resource/resource/tense-and-aspect-system/present-simple-habits-and-facts',
      },
      {
        label: 'Present Continuous (Actions in Progress and Near Future Plan)',
        href: '/skill/grammar/grammar-resource/resource/tense-and-aspect-system/present-continuous',
      },
      {
        label: 'Past Simple (Finished Past Events)',
        href: '/skill/grammar/grammar-resource/resource/tense-and-aspect-system/past-simple-finished-past-events',
      },
      {
        label: 'Past Continuous (Ongoing Action in the Past)',
        href: '/skill/grammar/grammar-resource/resource/tense-and-aspect-system/past-continuous-ongoing-action-in-the-past',
      },
      {
        label: 'Future Forms (will, be going to, present continuous for future)',
        href: '/skill/grammar/grammar-resource/resource/tense-and-aspect-system/future-forms',
      },
      {
        label: 'Present Perfect (Experience, Result, and Recent Change)',
        href: '/skill/grammar/grammar-resource/resource/tense-and-aspect-system/present-perfect',
      },
      {
        label: 'Past Perfect (Earlier Past Event)',
        href: '/skill/grammar/grammar-resource/resource/tense-and-aspect-system/past-perfect-earlier-past-event',
      },
      {
        label: 'Present Perfect Continuous (Duration from Past to Present)',
        href: '/skill/grammar/grammar-resource/resource/tense-and-aspect-system/present-perfect-continuous',
      },
      {
        label: 'Future Continuous (Action in Progress at a Future Time)',
        href: '/skill/grammar/grammar-resource/resource/tense-and-aspect-system/future-continuous',
      },
      {
        label: 'Future Perfect (Completion Before a Future Point)',
        href: '/skill/grammar/grammar-resource/resource/tense-and-aspect-system/future-perfect',
      },
      {
        label: 'Past Perfect Continuous',
        href: '/skill/grammar/grammar-resource/resource/tense-and-aspect-system/past-perfect-continuous',
      },
      {
        label: 'Future Perfect Continuous',
        href: '/skill/grammar/grammar-resource/resource/tense-and-aspect-system/future-perfect-continuous',
      },
      {
        label: 'Used to and Would (Past Habits and States)',
        href: '/skill/grammar/grammar-resource/resource/tense-and-aspect-system/used-to-and-would',
      },
      {
        label: 'Present Perfect vs Past Simple (Contrast)',
        href: '/skill/grammar/grammar-resource/resource/tense-and-aspect-system/present-perfect-vs-past-simple',
      },
    ],
  },
  {
    title: 'Functional Sentence Forms',
    topics: [
      {
        label: 'Question Forms (Yes/No Questions and WH Questions)',
        href: '/skill/grammar/grammar-resource/resource/functional-sentence-forms/question-forms',
      },
      {
        label: 'Imperatives (Commands, Requests, Instructions)',
        href: '/skill/grammar/grammar-resource/resource/functional-sentence-forms/imperatives-commands-requests-instructions',
      },
      {
        label: 'Core Modals (can, could, may, might, should, must)',
        href: '/skill/grammar/grammar-resource/resource/functional-sentence-forms/core-modals-can-could-may-might-should-must',
      },
      {
        label: 'Question Tags (Confirmation and Interaction)',
        href: '/skill/grammar/grammar-resource/resource/functional-sentence-forms/question-tags-confirmation-and-interaction',
      },
      {
        label: 'Indirect Questions (Polite Question Structure)',
        href: '/skill/grammar/grammar-resource/resource/functional-sentence-forms/indirect-questions-polite-question-structure',
      },
      {
        label: 'Exclamatives (What/How)',
        href: '/skill/grammar/grammar-resource/resource/functional-sentence-forms/exclamatives',
      },
      {
        label: 'Requests, Offers, Suggestions (Could, Would, Shall, Let us)',
        href: '/skill/grammar/grammar-resource/resource/functional-sentence-forms/requests-offers-suggestions',
      },
      {
        label: 'Short Answers and Response Patterns (So do I, Neither do I)',
        href: '/skill/grammar/grammar-resource/resource/functional-sentence-forms/short-answers-response-patterns',
      },
    ],
  },
  {
    title: 'Expansion and Complex Structures',
    topics: [
      {
        label: 'Conjunctions (and, but, or, because, so)',
        href: '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/conjunctions-and-but-or-because-so',
      },
      {
        label: 'Discourse Markers and Connectors (however, although, therefore, moreover)',
        href: '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/discourse-markers-connectors',
      },
      {
        label: 'Comparative and Superlative (Regular and Irregular Forms)',
        href: '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/comparative-superlative',
      },
      {
        label: 'Gerunds and Infinitives (Verb Patterns)',
        href: '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/gerunds-and-infinitives-verb-patterns',
      },
      {
        label: 'Relative Clauses (who, which, that, where, whose)',
        href: '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/relative-clauses-who-which-that-where-whose',
      },
      {
        label: 'Noun Clauses (that clauses, whether/if clauses, wh clauses)',
        href: '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/noun-clauses',
      },
      {
        label: 'Time Clauses (when, while, before, after, as soon as)',
        href: '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/time-clauses',
      },
      {
        label: 'Passive Voice (Form and Use Across Tenses)',
        href: '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/passive-voice-form-and-use-across-tenses',
      },
      {
        label: 'Reported Speech (Statements, Questions, Commands)',
        href: '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/reported-speech',
      },
      {
        label: 'Conditionals Type 0/1/2/3',
        href: '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/conditionals-type-0-1-2-3',
      },
      {
        label: 'Mixed Conditionals (Past-Present and Present-Past)',
        href: '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/mixed-conditionals',
      },
      {
        label: 'Modal Perfect (should have, could have, might have, must have)',
        href: '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/modal-perfect',
      },
      {
        label: 'Stative vs Dynamic Verbs (Simple vs Continuous Meaning)',
        href: '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/stative-vs-dynamic-verbs',
      },
      {
        label: 'Adverbial Clauses (Reason, Purpose, Result, Concession)',
        href: '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/adverbial-clauses',
      },
      {
        label: 'Defining vs Non-defining Relative Clauses',
        href: '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/defining-vs-non-defining-relative-clauses',
      },
      {
        label: 'Reduced Relative / Participle Clauses',
        href: '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/reduced-relative-participle-clauses',
      },
      {
        label: 'Causatives (have/get something done)',
        href: '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/causatives-have-get-something-done',
      },
      {
        label: 'Wish and If only',
        href: '/skill/grammar/grammar-resource/resource/expansion-and-complex-structures/wish-and-if-only',
      },
    ],
  },
  {
    title: 'Optional Advanced Reference',
    topics: [
      {
        label: 'Fixed Expressions and Collocations (make a decision, take responsibility, pay attention)',
        href: '/skill/grammar/grammar-resource/resource/optional-advanced-reference/fixed-expressions-collocations',
      },
      {
        label: 'Emphasis Structures (cleft sentences and inversion)',
        href: '/skill/grammar/grammar-resource/resource/optional-advanced-reference/emphasis-structures',
      },
      {
        label: 'Subjunctive Structures',
        href: '/skill/grammar/grammar-resource/resource/optional-advanced-reference/subjunctive-structures',
      },
      {
        label: 'Advanced Inversion Sets (Not until, So/Such ... that)',
        href: '/skill/grammar/grammar-resource/resource/optional-advanced-reference/advanced-inversion-sets',
      },
      {
        label: 'Hedging and Stance Grammar (seems to, appears to, likely to)',
        href: '/skill/grammar/grammar-resource/resource/optional-advanced-reference/hedging-and-stance-grammar',
      },
    ],
  },
  {
    title: 'Grammar Accuracy and Mechanics',
    topics: [
      {
        label: 'Punctuation for Clause Boundaries (Run-on, Comma Splice)',
        href: '/skill/grammar/grammar-resource/resource/grammar-accuracy-and-mechanics/punctuation-clause-boundaries',
      },
      {
        label: 'Sentence Fragments and Repair Patterns',
        href: '/skill/grammar/grammar-resource/resource/grammar-accuracy-and-mechanics/sentence-fragments-and-repair-patterns',
      },
      {
        label: 'Apostrophe and Capitalization Patterns (Grammar Meaning)',
        href: '/skill/grammar/grammar-resource/resource/grammar-accuracy-and-mechanics/apostrophe-capitalization-grammar-meaning',
      },
    ],
  },
] as const;

export default function GrammarResourcePage() {
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  useEffect(() => {
    const savedGroup = sessionStorage.getItem('gr_open_group');
    if (savedGroup) {
      setOpenGroup(savedGroup);
    }
  }, []);

  useEffect(() => {
    if (openGroup) {
      sessionStorage.setItem('gr_open_group', openGroup);
      return;
    }
    sessionStorage.removeItem('gr_open_group');
  }, [openGroup]);

  return (
    <main className="grammar-resource-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar" />
      </div>

      <div className="grammar-resource-shell">
        <h1 className="grammar-resource-title">Grammar Resource</h1>
        <p className="grammar-resource-subtitle">
          Daftar topik inti grammar sebagai sumber referensi utama.
        </p>

        <section className="grammar-resource-tree">
          {TOPIC_GROUPS.map((group) => (
            <details
              key={group.title}
              className="grammar-resource-tree-group"
              open={openGroup === group.title}
            >
              <summary
                className="tree-card tree-folder-card"
                onClick={(e) => {
                  e.preventDefault();
                  setOpenGroup((prev) => (prev === group.title ? null : group.title));
                }}
              >
                <span className="tree-caret" aria-hidden="true" />
                <span className="tree-folder-label">{group.title}</span>
              </summary>

              <div className="tree-children">
                {group.topics.map((topic) => (
                  typeof topic === 'string' ? (
                    <article key={`${group.title}-${topic}`} className="tree-card tree-topic-card">
                      <span className="tree-branch" aria-hidden="true" />
                      <span className="tree-topic-label">{topic}</span>
                    </article>
                  ) : (
                    <Link
                      key={`${group.title}-${topic.label}`}
                      href={topic.href}
                      className="tree-card tree-topic-card tree-topic-link"
                      onClick={() => setOpenGroup(group.title)}
                    >
                      <span className="tree-branch" aria-hidden="true" />
                      <span className="tree-topic-label">{topic.label}</span>
                    </Link>
                  )
                ))}
              </div>
            </details>
          ))}
        </section>
      </div>
    </main>
  );
}
