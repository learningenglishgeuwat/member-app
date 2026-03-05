import BackButton from '../../../../../components/BackButton';
import './numbers-as-determiners-one-two-first-second.css';
import '../../topic-layout.css';

const NUMBER_TYPES = [
  {
    title: 'Cardinal Numbers (one, two, three...)',
    desc: 'Dipakai untuk menyatakan jumlah.',
    examples: [
      { sentence: 'one student', focus: 'one' },
      { sentence: 'two books', focus: 'two' },
      { sentence: 'three ideas', focus: 'three' },
    ],
  },
  {
    title: 'Ordinal Numbers (first, second, third...)',
    desc: 'Dipakai untuk menyatakan urutan/posisi.',
    examples: [
      { sentence: 'the first chapter', focus: 'first' },
      { sentence: 'my second attempt', focus: 'second' },
      { sentence: 'the third floor', focus: 'third' },
    ],
  },
] as const;

const FUNCTION_RULES = [
  {
    title: 'Numbers Before Nouns',
    points: [
      'cardinal + plural noun: two books',
      'one + singular noun: one book',
      'ordinal umumnya dengan the/possessive: the first day, my second try',
      'uncountable noun biasanya pakai unit: one piece of advice, two bottles of water',
    ],
  },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'two book', correct: 'two books' },
  { wrong: 'one books', correct: 'one book' },
  { wrong: 'first floor is mine', correct: 'the first floor is mine' },
  { wrong: 'two advices', correct: 'two pieces of advice' },
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
      <span className="num-highlight">{mid}</span>
      {end}
    </>
  );
}

export default function NumbersAsDeterminersPage() {
  return (
    <main className="num-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="num-shell gr-topic-shell">
        <header className="num-header">
          <h1 className="num-title">Numbers as Determiners (one, two, first, second)</h1>
          <p className="num-subtitle">
            Memahami penggunaan angka sebagai determiner untuk jumlah dan urutan noun.
          </p>
        </header>

        <section className="num-block">
          <h2 className="num-block-title">Konsep</h2>
          <p className="num-text">
            Number determiners dipakai sebelum noun untuk menunjukkan kuantitas (cardinal) atau urutan
            (ordinal).
          </p>
        </section>

        <section className="num-block">
          <h2 className="num-block-title">Jenis Number Determiners</h2>
          <div className="num-grid num-grid-one-col">
            {NUMBER_TYPES.map((item) => (
              <details key={item.title} className="num-card num-card-accordion">
                <summary className="num-card-summary">
                  <h3 className="num-card-title">{item.title}</h3>
                  <span className="num-card-caret" aria-hidden="true" />
                </summary>
                <div className="num-card-body">
                  <p className="num-card-desc">{item.desc}</p>
                  <ul className="num-list">
                    {item.examples.map((ex) => (
                      <li key={ex.sentence}>{highlightWord(ex.sentence, ex.focus)}</li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="num-block">
          <h2 className="num-block-title">Function and Pattern</h2>
          <div className="num-grid num-grid-one-col">
            {FUNCTION_RULES.map((item) => (
              <details key={item.title} className="num-card num-card-accordion">
                <summary className="num-card-summary">
                  <h3 className="num-card-title">{item.title}</h3>
                  <span className="num-card-caret" aria-hidden="true" />
                </summary>
                <div className="num-card-body">
                  <ul className="num-list">
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="num-block">
          <h2 className="num-block-title">Kesalahan Umum</h2>
          <div className="num-fix-list">
            {COMMON_MISTAKES.map((item) => (
              <article key={item.wrong} className="num-fix-card">
                <p className="num-fix-wrong">Salah: {item.wrong}</p>
                <p className="num-fix-correct">Benar: {item.correct}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="num-block">
          <h2 className="num-block-title">Catatan Penting:</h2>
          <ul className="num-list">
            <li>- Cardinal numbers fokus ke jumlah; ordinal numbers fokus ke urutan.</li>
            <li>- Setelah angka &gt; 1, noun biasanya plural.</li>
            <li>- Ordinal sering butuh article/determiner: the first, my second.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
