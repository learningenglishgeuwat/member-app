import BackButton from '../../../../../components/BackButton';
import './comparative-and-superlative-regular-and-irregular-forms.css';
import '../../topic-layout.css';

const FORM_RULES = [
  {
    title: 'Comparative (membandingkan 2 hal)',
    points: [
      'Adjective pendek: adjective + -er + than (taller than, faster than)',
      'Adjective panjang: more + adjective + than (more expensive than)',
      'Akhiran -y jadi -ier: happy -> happier',
      'Pola CVC (big, hot) biasanya double consonant: big -> bigger',
    ],
    examples: [
      { before: 'This bag is ', focus: 'cheaper', after: ' than that one.' },
      { before: 'Rina is ', focus: 'faster', after: ' than me.' },
      { before: 'This room is ', focus: 'bigger', after: ' than that one.' },
    ],
  },
  {
    title: 'Superlative (paling dalam grup)',
    points: [
      'Adjective pendek: the + adjective + -est (the tallest)',
      'Adjective panjang: the most + adjective (the most interesting)',
      'Akhiran -y jadi -iest: happy -> the happiest',
      'Pola CVC (big, hot) biasanya double consonant: big -> the biggest',
    ],
    examples: [
      { before: 'He is ', focus: 'the tallest', after: ' student in class.' },
      { before: 'This is ', focus: 'the most useful', after: ' part.' },
      { before: 'This is ', focus: 'the biggest', after: ' room in the house.' },
    ],
  },
] as const;

const SENTENCE_PATTERNS = [
  {
    title: 'Comparative sentence pattern',
    pattern: 'A + be + comparative + than + B',
    example: { before: 'This car is ', focus: 'faster than', after: ' that car.' },
  },
  {
    title: 'Superlative sentence pattern',
    pattern: 'A + be + the + superlative + in/of + group',
    example: { before: 'She is ', focus: 'the smartest', after: ' student in the class.' },
  },
] as const;

const IRREGULAR_FORMS = [
  { base: 'good', comparative: 'better', superlative: 'the best' },
  { base: 'bad', comparative: 'worse', superlative: 'the worst' },
  { base: 'far', comparative: 'farther/further', superlative: 'the farthest/the furthest' },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'She is more taller than me.', correct: 'She is taller than me.' },
  { wrong: 'This is the most easiest task.', correct: 'This is the easiest task.' },
  { wrong: 'He is gooder than me.', correct: 'He is better than me.' },
] as const;

export default function ComparativeSuperlativePage() {
  return (
    <main className="cs-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="cs-shell gr-topic-shell">
        <header className="cs-header">
          <h1 className="cs-title">Comparative and Superlative (Regular and Irregular Forms)</h1>
          <p className="cs-subtitle">
            Memahami bentuk comparative dan superlative untuk membuat perbandingan yang tepat.
          </p>
        </header>

        <section className="cs-block">
          <h2 className="cs-block-title">Konsep</h2>
          <p className="cs-text">
            Comparative dipakai untuk membandingkan dua hal, sedangkan superlative dipakai untuk
            menunjukkan yang paling tinggi/rendah dalam sebuah kelompok.
          </p>
        </section>

        <section className="cs-block">
          <h2 className="cs-block-title">Core Rules</h2>
          <div className="cs-grid cs-grid-one-col">
            {FORM_RULES.map((item) => (
              <details key={item.title} className="cs-card cs-card-accordion">
                <summary className="cs-card-summary">
                  <h3 className="cs-card-title">{item.title}</h3>
                  <span className="cs-card-caret" aria-hidden="true" />
                </summary>
                <div className="cs-card-body">
                  <ul className="cs-list">
                    {item.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  <ul className="cs-list">
                    {item.examples.map((ex) => (
                      <li key={`${item.title}-${ex.before}-${ex.focus}-${ex.after}`}>
                        {ex.before}
                        <span className="cs-highlight">{ex.focus}</span>
                        {ex.after}
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="cs-block">
          <h2 className="cs-block-title">Sentence Patterns</h2>
          <div className="cs-grid cs-grid-one-col">
            {SENTENCE_PATTERNS.map((item) => (
              <article key={item.title} className="cs-card">
                <div className="cs-card-body">
                  <h3 className="cs-card-title">{item.title}</h3>
                  <p className="cs-text">
                    Pola: <span className="cs-highlight">{item.pattern}</span>
                  </p>
                  <p className="cs-text">
                    Contoh: {item.example.before}
                    <span className="cs-highlight">{item.example.focus}</span>
                    {item.example.after}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="cs-block">
          <h2 className="cs-block-title">Irregular Forms</h2>
          <div className="cs-table-wrap geuwat-table-scroll">
            <table className="cs-table geuwat-table-responsive">
              <thead>
                <tr>
                  <th>Base</th>
                  <th>Comparative</th>
                  <th>Superlative</th>
                </tr>
              </thead>
              <tbody>
                {IRREGULAR_FORMS.map((row) => (
                  <tr key={row.base}>
                    <td>{row.base}</td>
                    <td>{row.comparative}</td>
                    <td>{row.superlative}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="cs-block">
          <h2 className="cs-block-title">Kesalahan Umum</h2>
          <div className="cs-fix-list">
            {COMMON_MISTAKES.map((item) => (
              <article key={item.wrong} className="cs-fix-card">
                <p className="cs-fix-wrong">Salah: {item.wrong}</p>
                <p className="cs-fix-correct">Benar: {item.correct}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="cs-block">
          <h2 className="cs-block-title">Catatan Penting:</h2>
          <ul className="cs-list">
            <li>Hindari double marking: more taller, most easiest.</li>
            <li>Superlative umumnya memakai the.</li>
            <li>Irregular forms harus dihafal (good-better-best, bad-worse-worst).</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
