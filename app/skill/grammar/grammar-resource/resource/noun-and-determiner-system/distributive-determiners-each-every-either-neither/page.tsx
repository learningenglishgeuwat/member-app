import BackButton from '../../../../../components/BackButton';
import './distributive-determiners-each-every-either-neither.css';
import '../../topic-layout.css';

const DISTRIBUTIVE_RULES = [
  {
    title: 'each',
    desc: 'Fokus ke anggota satu per satu dalam grup kecil atau saat penekanan individual kuat.',
    points: [
      'each + singular countable noun',
      'each of + plural noun/pronoun (each of the students, each of them)',
      'verb tetap singular',
    ],
    examples: [
      { sentence: 'Each student has a card.', focus: 'Each' },
      { sentence: 'Each of the students has a card.', focus: 'Each' },
      { sentence: 'Each of them is ready.', focus: 'Each' },
    ],
  },
  {
    title: 'every',
    desc: 'Fokus ke semua anggota sebagai keseluruhan umum.',
    points: ['every + singular countable noun', 'verb tetap singular', 'tidak dipakai dengan of'],
    examples: [
      { sentence: 'Every student has a card.', focus: 'Every' },
      { sentence: 'Every room is clean.', focus: 'Every' },
    ],
  },
  {
    title: 'either',
    desc: 'Salah satu dari dua pilihan (positive choice).',
    points: [
      'either + singular noun',
      'either of + plural noun/pronoun',
      'dipakai untuk dua opsi',
    ],
    examples: [
      { sentence: 'You can take either seat.', focus: 'either' },
      { sentence: 'Either answer is acceptable.', focus: 'Either' },
      { sentence: 'Either of the answers is acceptable.', focus: 'Either' },
    ],
  },
  {
    title: 'neither',
    desc: 'Tidak satu pun dari dua pilihan.',
    points: ['neither + singular noun', 'neither of + plural noun/pronoun', 'makna sudah negatif'],
    examples: [
      { sentence: 'Neither option works.', focus: 'Neither' },
      { sentence: 'Neither student is absent.', focus: 'Neither' },
      { sentence: 'Neither of them is absent.', focus: 'Neither' },
    ],
  },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'Each students are ready.', correct: 'Each student is ready.' },
  { wrong: 'Every people is happy.', correct: 'Every person is happy.' },
  { wrong: 'Neither of them are late.', correct: 'Neither of them is late.' },
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
      <span className="dd-highlight">{mid}</span>
      {end}
    </>
  );
}

export default function DistributiveDeterminersPage() {
  return (
    <main className="dd-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="dd-shell gr-topic-shell">
        <header className="dd-header">
          <h1 className="dd-title">Distributive Determiners (each, every, either, neither)</h1>
          <p className="dd-subtitle">
            Memahami distributive determiners untuk membicarakan anggota grup secara individual atau
            pilihan dua opsi.
          </p>
        </header>

        <section className="dd-block">
          <h2 className="dd-block-title">Konsep</h2>
          <p className="dd-text">
            Distributive determiners dipakai untuk melihat anggota grup secara terpisah (bukan sebagai
            massa). Walau membahas grup, noun dan verb biasanya tetap singular.
          </p>
        </section>

        <section className="dd-block">
          <h2 className="dd-block-title">Core Rules</h2>
          <div className="dd-grid dd-grid-one-col">
            {DISTRIBUTIVE_RULES.map((item) => (
              <details key={item.title} className="dd-card dd-card-accordion">
                <summary className="dd-card-summary">
                  <h3 className="dd-card-title">{item.title}</h3>
                  <span className="dd-card-caret" aria-hidden="true" />
                </summary>
                <div className="dd-card-body">
                  <p className="dd-card-desc">{item.desc}</p>
                  <ul className="dd-list">
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  <ul className="dd-list">
                    {item.examples.map((ex) => (
                      <li key={ex.sentence}>{highlightWord(ex.sentence, ex.focus)}</li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="dd-block">
          <h2 className="dd-block-title">Kesalahan Umum</h2>
          <div className="dd-fix-list">
            {COMMON_MISTAKES.map((item) => (
              <article key={item.wrong} className="dd-fix-card">
                <p className="dd-fix-wrong">Salah: {item.wrong}</p>
                <p className="dd-fix-correct">Benar: {item.correct}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="dd-block">
          <h2 className="dd-block-title">Catatan Penting:</h2>
          <ul className="dd-list">
            <li>- each/every/either/neither diikuti noun singular.</li>
            <li>- either/neither dipakai untuk dua pilihan, bukan lebih dari dua.</li>
            <li>- Untuk makna plural umum, gunakan quantifiers lain (mis. many, several, all).</li>
          </ul>
        </section>
      </div>
    </main>
  );
}

