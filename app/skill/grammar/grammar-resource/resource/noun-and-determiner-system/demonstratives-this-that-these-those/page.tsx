import BackButton from '../../../../../components/BackButton';
import './demonstratives-this-that-these-those.css';
import '../../topic-layout.css';

const DEMO_RULES = [
  {
    title: 'this (singular, near)',
    desc: 'Dipakai untuk satu benda/orang yang dekat dengan speaker.',
    examples: [
      { sentence: 'This book is mine.', focus: 'This', usage: 'determiner' },
      { sentence: 'I like this idea.', focus: 'this', usage: 'determiner' },
      { sentence: 'This is my seat.', focus: 'This', usage: 'pronoun' },
    ],
  },
  {
    title: 'that (singular, far)',
    desc: 'Dipakai untuk satu benda/orang yang lebih jauh.',
    examples: [
      { sentence: 'That building is old.', focus: 'That', usage: 'determiner' },
      { sentence: 'I remember that day.', focus: 'that', usage: 'determiner' },
      { sentence: 'That is my teacher.', focus: 'That', usage: 'pronoun' },
    ],
  },
  {
    title: 'these (plural, near)',
    desc: 'Dipakai untuk lebih dari satu benda/orang yang dekat.',
    examples: [
      { sentence: 'These books are useful.', focus: 'These', usage: 'determiner' },
      { sentence: 'I bought these shoes.', focus: 'these', usage: 'determiner' },
      { sentence: 'These are my keys.', focus: 'These', usage: 'pronoun' },
    ],
  },
  {
    title: 'those (plural, far)',
    desc: 'Dipakai untuk lebih dari satu benda/orang yang jauh.',
    examples: [
      { sentence: 'Those houses are expensive.', focus: 'Those', usage: 'determiner' },
      { sentence: 'I saw those people yesterday.', focus: 'those', usage: 'determiner' },
      { sentence: 'Those are my notes.', focus: 'Those', usage: 'pronoun' },
    ],
  },
] as const;

const DEMO_MATRIX = [
  { distance: 'Near', singular: 'this', plural: 'these' },
  { distance: 'Far', singular: 'that', plural: 'those' },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'This books are new.', correct: 'These books are new.' },
  { wrong: 'Those car is fast.', correct: 'That car is fast.' },
  { wrong: 'I like these idea.', correct: 'I like this idea.' },
] as const;

function highlightWord(sentence: string, focus: string) {
  const lowerSentence = sentence.toLowerCase();
  const lowerFocus = focus.toLowerCase();
  const idx = lowerSentence.indexOf(lowerFocus);
  if (idx === -1) return sentence;

  const start = sentence.slice(0, idx);
  const mid = sentence.slice(idx, idx + focus.length);
  const end = sentence.slice(idx + focus.length);

  return (
    <>
      {start}
      <span className="dem-highlight">{mid}</span>
      {end}
    </>
  );
}

export default function DemonstrativesPage() {
  return (
    <main className="dem-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="dem-shell gr-topic-shell">
        <header className="dem-header">
          <h1 className="dem-title">Demonstratives (this, that, these, those)</h1>
          <p className="dem-subtitle">
            Memahami penggunaan demonstratives berdasarkan jumlah (singular/plural) dan jarak (near/far).
          </p>
        </header>

        <section className="dem-block">
          <h2 className="dem-block-title">Konsep</h2>
          <p className="dem-text">
            Demonstratives adalah determiner/pronoun penunjuk. Pilihannya bergantung pada dua hal:
            jumlah (satu atau lebih) dan jarak (dekat atau jauh).
          </p>
          <p className="dem-text">
            Determiner: <span className="dem-highlight">this</span> book. Pronoun:{' '}
            <span className="dem-highlight">This</span> is mine.
          </p>
        </section>

        <section className="dem-block">
          <h2 className="dem-block-title">Quick Map</h2>
          <div className="dem-mini-table" role="table" aria-label="Demonstratives map">
            <div className="dem-mini-row dem-mini-head" role="row">
              <span role="columnheader">Distance</span>
              <span role="columnheader">Singular</span>
              <span role="columnheader">Plural</span>
            </div>
            {DEMO_MATRIX.map((row) => (
              <div key={row.distance} className="dem-mini-row" role="row">
                <span role="cell">{row.distance}</span>
                <span role="cell">
                  <span className="dem-highlight">{row.singular}</span>
                </span>
                <span role="cell">
                  <span className="dem-highlight">{row.plural}</span>
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="dem-block">
          <h2 className="dem-block-title">Penggunaan</h2>
          <div className="dem-grid dem-grid-one-col">
            {DEMO_RULES.map((item) => (
              <details key={item.title} className="dem-card dem-card-accordion">
                <summary className="dem-card-summary">
                  <h3 className="dem-card-title">{item.title}</h3>
                  <span className="dem-card-caret" aria-hidden="true" />
                </summary>
                <div className="dem-card-body">
                  <p className="dem-card-desc">{item.desc}</p>
                  <ul className="dem-list">
                    {item.examples.map((ex) => (
                      <li key={ex.sentence}>
                        {highlightWord(ex.sentence, ex.focus)} ({ex.usage})
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="dem-block">
          <h2 className="dem-block-title">Kesalahan Umum</h2>
          <div className="dem-fix-list">
            {COMMON_MISTAKES.map((item) => (
              <article key={item.wrong} className="dem-fix-card">
                <p className="dem-fix-wrong">Salah: {item.wrong}</p>
                <p className="dem-fix-correct">Benar: {item.correct}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="dem-block">
          <h2 className="dem-block-title">Catatan Penting:</h2>
          <ul className="dem-list">
            <li>- this/that untuk singular, these/those untuk plural.</li>
            <li>- this/these = dekat; that/those = jauh (secara fisik atau konteks).</li>
            <li>- Demonstratives bisa jadi determiner (this book) atau pronoun (This is mine).</li>
            <li>- Jarak juga bisa non-fisik: this week, that day, this idea, those problems.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}

