import BackButton from '../../../../../components/BackButton';
import './countable-and-uncountable-nouns.css';
import '../../topic-layout.css';

const COUNTABLE_RULES = [
  {
    title: 'Countable Nouns',
    desc: 'Bisa dihitung satu per satu (one, two, three...).',
    points: [
      'punya bentuk singular dan plural',
      'bisa dipakai dengan a/an (singular)',
      'bisa dipakai dengan many/few/several (plural)',
    ],
    examples: [
      { text: 'a book', focus: 'a' },
      { text: 'two books', focus: 'two' },
      { text: 'many students', focus: 'many' },
      { text: 'a few chairs', focus: 'a few' },
    ],
  },
  {
    title: 'Uncountable Nouns',
    desc: 'Tidak dihitung satu per satu secara langsung.',
    points: [
      'biasanya tidak punya bentuk plural biasa',
      'tidak dipakai dengan a/an',
      'umum dengan much/little/some',
    ],
    examples: [
      { text: 'water', focus: 'water' },
      { text: 'information', focus: 'information' },
      { text: 'advice', focus: 'advice' },
      { text: 'furniture', focus: 'furniture' },
    ],
  },
] as const;

const UNIT_EXAMPLES = [
  { noun: 'water', unit: 'a glass of water' },
  { noun: 'advice', unit: 'a piece of advice' },
  { noun: 'information', unit: 'a piece of information' },
  { noun: 'furniture', unit: 'a piece of furniture' },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'I need many information.', correct: 'I need a lot of information.' },
  { wrong: 'She gave me an advice.', correct: 'She gave me a piece of advice.' },
  { wrong: 'These furnitures are expensive.', correct: 'This furniture is expensive.' },
] as const;

function highlightWord(text: string, focus: string) {
  const lowerText = text.toLowerCase();
  const lowerFocus = focus.toLowerCase();
  const idx = lowerText.indexOf(lowerFocus);
  if (idx === -1) return text;

  const start = text.slice(0, idx);
  const mid = text.slice(idx, idx + focus.length);
  const end = text.slice(idx + focus.length);

  return (
    <>
      {start}
      <span className="cu-highlight">{mid}</span>
      {end}
    </>
  );
}

export default function CountableUncountablePage() {
  return (
    <main className="cu-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="cu-shell gr-topic-shell">
        <header className="cu-header">
          <h1 className="cu-title">Countable and Uncountable Nouns</h1>
          <p className="cu-subtitle">
            Memahami perbedaan noun yang bisa dihitung dan tidak bisa dihitung untuk pemilihan bentuk
            noun serta quantifier yang tepat.
          </p>
        </header>

        <section className="cu-block">
          <h2 className="cu-block-title">Konsep</h2>
          <p className="cu-text">
            Noun dalam bahasa Inggris dibagi menjadi dua kelompok utama: <strong>countable</strong>{' '}
            dan <strong>uncountable</strong>. Perbedaan ini memengaruhi article, plural, dan quantifier.
          </p>
        </section>

        <section className="cu-block">
          <h2 className="cu-block-title">Core Rules</h2>
          <div className="cu-grid cu-grid-one-col">
            {COUNTABLE_RULES.map((item) => (
              <details key={item.title} className="cu-card cu-card-accordion">
                <summary className="cu-card-summary">
                  <h3 className="cu-card-title">{item.title}</h3>
                  <span className="cu-card-caret" aria-hidden="true" />
                </summary>
                <div className="cu-card-body">
                  <p className="cu-card-desc">{item.desc}</p>
                  <ul className="cu-list">
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  <ul className="cu-list">
                    {item.examples.map((ex) => (
                      <li key={ex.text}>{highlightWord(ex.text, ex.focus)}</li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="cu-block">
          <h2 className="cu-block-title">Unit Expressions for Uncountable Nouns</h2>
          <div className="cu-table-wrap">
            <table className="cu-table">
              <thead>
                <tr>
                  <th>Uncountable Noun</th>
                  <th>Unit Expression</th>
                </tr>
              </thead>
              <tbody>
                {UNIT_EXAMPLES.map((row) => (
                  <tr key={row.noun}>
                    <td>{highlightWord(row.noun, row.noun)}</td>
                    <td>{highlightWord(row.unit, row.unit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="cu-block">
          <h2 className="cu-block-title">Kesalahan Umum</h2>
          <div className="cu-fix-list">
            {COMMON_MISTAKES.map((item) => (
              <article key={item.wrong} className="cu-fix-card">
                <p className="cu-fix-wrong">Salah: {item.wrong}</p>
                <p className="cu-fix-correct">Benar: {item.correct}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="cu-block">
          <h2 className="cu-block-title">Catatan Penting:</h2>
          <ul className="cu-list">
            <li>- Gunakan many/few untuk countable plural.</li>
            <li>- Gunakan much/little untuk uncountable nouns.</li>
            <li>- Untuk uncountable tertentu, pakai unit expression agar bisa dihitung.</li>
            <li>- Beberapa noun bisa countable/uncountable tergantung makna: chicken, paper, time.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
