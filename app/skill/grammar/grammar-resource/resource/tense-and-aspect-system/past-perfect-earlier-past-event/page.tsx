import BackButton from '../../../../../components/BackButton';
import './past-perfect-earlier-past-event.css';
import '../../topic-layout.css';

const USE_CASES = [
  {
    title: 'Earlier Past Event',
    desc: 'Dipakai untuk kejadian yang terjadi lebih dulu sebelum kejadian lampau lain.',
    examples: [
      { before: 'When I arrived, she ', focus: 'had left', after: '.' },
      { before: 'They ', focus: 'had finished', after: ' dinner before the movie started.' },
    ],
  },
  {
    title: 'Clear Sequence in Past',
    desc: 'Membantu memperjelas urutan dua kejadian lampau.',
    examples: [
      { before: 'After he ', focus: 'had studied', after: ', he took the test.' },
      { before: 'By the time we reached the station, the train ', focus: 'had gone', after: '.' },
    ],
  },
] as const;

const CORE_PATTERNS = [
  {
    title: 'Positive',
    points: ['S + had + V3'],
    examples: [
      { before: 'She ', focus: 'had finished', after: ' her homework.' },
      { before: 'We ', focus: 'had arrived', after: ' before noon.' },
    ],
  },
  {
    title: 'Negative',
    points: ['S + had not + V3'],
    examples: [
      { before: 'He ', focus: 'had not called', after: ' me.' },
      { before: 'They ', focus: 'had not started', after: ' the class.' },
    ],
  },
  {
    title: 'Question',
    points: ['Had + S + V3?'],
    examples: [
      { before: '', focus: 'Had she left', after: ' before you came?' },
      { before: '', focus: 'Had they eaten', after: ' before the meeting?' },
    ],
  },
] as const;

const SIGNAL_WORDS = [
  {
    word: 'before',
    use: 'menunjukkan kejadian Past Perfect terjadi sebelum kejadian Past Simple.',
    example: { before: 'She ', focus: 'had left', after: ' before I arrived.' },
  },
  {
    word: 'after',
    use: 'sering dipakai untuk urutan: aksi pertama (Past Perfect), lalu aksi kedua (Past Simple).',
    example: { before: 'After they ', focus: 'had eaten', after: ', they watched a movie.' },
  },
  {
    word: 'by the time',
    use: 'menekankan bahwa pada titik waktu tertentu di masa lalu, aksi sudah selesai.',
    example: { before: 'By the time we arrived, the class ', focus: 'had started', after: '.' },
  },
  {
    word: 'when',
    use: 'dipakai untuk membandingkan dua aksi lampau dalam satu konteks waktu.',
    example: { before: 'When I called, he ', focus: 'had gone', after: ' out.' },
  },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'When I came, she has left.', correct: 'When I came, she had left.' },
  { wrong: 'They had went home.', correct: 'They had gone home.' },
  { wrong: 'He had finished the task before he had submitted it.', correct: 'He had finished the task before he submitted it.' },
] as const;

export default function PastPerfectPage() {
  return (
    <main className="ppf-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="ppf-shell gr-topic-shell">
        <header className="ppf-header">
          <h1 className="ppf-title">Past Perfect (Earlier Past Event)</h1>
          <p className="ppf-subtitle">
            Memahami Past Perfect untuk menunjukkan kejadian yang terjadi lebih dulu di masa lalu.
          </p>
        </header>

        <section className="ppf-block">
          <h2 className="ppf-block-title">Konsep</h2>
          <p className="ppf-text">
            Past Perfect memakai pola <strong>had + V3</strong> untuk menandai kejadian lampau yang
            lebih awal daripada kejadian lampau lainnya.
          </p>
        </section>

        <section className="ppf-block">
          <h2 className="ppf-block-title">When to Use</h2>
          <div className="ppf-grid ppf-grid-one-col">
            {USE_CASES.map((item) => (
              <details key={item.title} className="ppf-card ppf-card-accordion">
                <summary className="ppf-card-summary">
                  <h3 className="ppf-card-title">{item.title}</h3>
                  <span className="ppf-card-caret" aria-hidden="true" />
                </summary>
                <div className="ppf-card-body">
                  <p className="ppf-card-desc">{item.desc}</p>
                  <ul className="ppf-list">
                    {item.examples.map((ex) => (
                      <li key={`${item.title}-${ex.before}-${ex.focus}-${ex.after}`}>
                        {ex.before}
                        <span className="ppf-highlight">{ex.focus}</span>
                        {ex.after}
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="ppf-block">
          <h2 className="ppf-block-title">Core Patterns</h2>
          <div className="ppf-grid ppf-grid-one-col">
            {CORE_PATTERNS.map((item) => (
              <details key={item.title} className="ppf-card ppf-card-accordion">
                <summary className="ppf-card-summary">
                  <h3 className="ppf-card-title">{item.title}</h3>
                  <span className="ppf-card-caret" aria-hidden="true" />
                </summary>
                <div className="ppf-card-body">
                  <ul className="ppf-list">
                    {item.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  <ul className="ppf-list">
                    {item.examples.map((ex) => (
                      <li key={`${item.title}-${ex.before}-${ex.focus}-${ex.after}`}>
                        {ex.before}
                        <span className="ppf-highlight">{ex.focus}</span>
                        {ex.after}
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="ppf-block">
          <h2 className="ppf-block-title">Signal Words</h2>
          <div className="ppf-signal-grid">
            {SIGNAL_WORDS.map((item) => (
              <article key={item.word} className="ppf-signal-card">
                <p className="ppf-signal-head">
                  <span className="ppf-chip">{item.word}</span>
                </p>
                <p className="ppf-signal-use">{item.use}</p>
                <p className="ppf-signal-example">
                  Contoh: {item.example.before}
                  <span className="ppf-highlight">{item.example.focus}</span>
                  {item.example.after}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="ppf-block">
          <h2 className="ppf-block-title">Kesalahan Umum</h2>
          <div className="ppf-fix-list">
            {COMMON_MISTAKES.map((item) => (
              <article key={item.wrong} className="ppf-fix-card">
                <p className="ppf-fix-wrong">Salah: {item.wrong}</p>
                <p className="ppf-fix-correct">Benar: {item.correct}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="ppf-block">
          <h2 className="ppf-block-title">Catatan Penting:</h2>
          <ul className="ppf-list">
            <li>Past Perfect tidak dipakai sendirian terlalu sering; biasanya berpasangan dengan past simple.</li>
            <li>Past Perfect menandai kejadian yang lebih dulu, bukan sekadar kejadian lampau biasa.</li>
            <li>Past participle (V3) harus akurat, terutama untuk irregular verbs.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
