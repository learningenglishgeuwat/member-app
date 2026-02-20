import BackButton from '../../../../../components/BackButton';
import './adjectives-function-and-position.css';
import '../../topic-layout.css';

const ADJECTIVE_FUNCTIONS = [
  {
    title: 'Before a Noun (Attributive)',
    explanation: 'Adjective ditempatkan sebelum noun untuk menjelaskan noun tersebut.',
    examples: ['This is a beautiful city.', 'This is a useful book.', 'That is a difficult question.'],
  },
  {
    title: 'After Linking Verb (Predicative)',
    explanation: 'Adjective muncul setelah linking verb seperti be, seem, look, feel, become.',
    examples: ['The city is beautiful.', 'The book looks useful.', 'She feels tired.'],
  },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'She is beauty.', correct: 'She is beautiful.' },
  { wrong: 'He is a intelligently student.', correct: 'He is an intelligent student.' },
  { wrong: 'The soup tastes well.', correct: 'The soup tastes good.' },
] as const;

const ADJ_ORDER = [
  'opinion',
  'size',
  'age',
  'shape',
  'color',
  'origin',
  'material',
  'purpose',
] as const;

export default function AdjectivesPage() {
  return (
    <main className="adj-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="adj-shell gr-topic-shell">
        <header className="adj-header">
          <h1 className="adj-title">Adjectives (Function and Position)</h1>
          <p className="adj-subtitle">
            Memahami fungsi adjective dan posisi yang tepat agar deskripsi lebih natural dan akurat.
          </p>
        </header>

        <section className="adj-block">
          <h2 className="adj-block-title">Konsep</h2>
          <p className="adj-text">
            Adjective adalah kata yang menjelaskan noun atau pronoun. Posisi adjective memengaruhi
            kelancaran dan kejelasan kalimat.
          </p>
        </section>

        <section className="adj-block">
          <h2 className="adj-block-title">Function and Position</h2>
          <div className="adj-grid">
            {ADJECTIVE_FUNCTIONS.map((item) => (
              <details key={item.title} className="adj-card adj-card-accordion">
                <summary className="adj-card-summary">
                  <h3 className="adj-card-title">{item.title}</h3>
                  <span className="adj-card-caret" aria-hidden="true" />
                </summary>
                <div className="adj-card-body">
                  <p className="adj-card-desc">{item.explanation}</p>
                  <ul className="adj-list">
                    {item.examples.map((ex) => (
                      <li key={ex}>{ex}</li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="adj-block">
          <h2 className="adj-block-title">Urutan Adjective (Jika lebih dari satu)</h2>
          <p className="adj-text">
            Urutan umum: opinion -&gt; size -&gt; age -&gt; shape -&gt; color -&gt; origin -&gt;
            material -&gt; purpose.
          </p>
          <div className="adj-chip-row">
            {ADJ_ORDER.map((item) => (
              <span key={item} className="adj-chip">
                {item}
              </span>
            ))}
          </div>
          <p className="adj-example-line">
            Contoh: <span className="adj-inline-highlight">a beautiful small old wooden table</span>
          </p>
        </section>

        <section className="adj-block">
          <h2 className="adj-block-title">Kesalahan Umum</h2>
          <div className="adj-fix-list">
            {COMMON_MISTAKES.map((item) => (
              <article key={item.wrong} className="adj-fix-card">
                <p className="adj-fix-wrong">Salah: {item.wrong}</p>
                <p className="adj-fix-correct">Benar: {item.correct}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="adj-block">
          <h2 className="adj-block-title">Catatan Penting:</h2>
          <ul className="adj-list">
            <li>- Adjective menjelaskan noun/pronoun, bukan verb (untuk verb biasanya adverb).</li>
            <li>- Setelah linking verb, pakai adjective: feel tired, look good, become strong.</li>
            <li>
              - Pola benar: an intelligent student / a very intelligent student (bukan a intelligently
              student).
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
