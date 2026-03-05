import BackButton from '../../../../../components/BackButton';
import './quantifiers-some-any-much-many-few-little-a-lot-of.css';
import '../../topic-layout.css';

const QUANTIFIER_GROUPS = [
  {
    title: 'some / any',
    desc: 'Untuk countable plural dan uncountable.',
    points: [
      'some umumnya di kalimat positif: I have some books.',
      'any umumnya di negatif/pertanyaan: I do not have any books. / Do you have any books?',
      'di pertanyaan offer/request, some sering dipakai: Would you like some tea?',
    ],
    examples: [
      { sentence: 'We need some water.', focus: 'some' },
      { sentence: 'Do you have any questions?', focus: 'any' },
      { sentence: 'There is not any milk left.', focus: 'any' },
      { sentence: 'Would you like some tea?', focus: 'some' },
    ],
  },
  {
    title: 'many / much',
    desc: 'many untuk countable plural, much untuk uncountable.',
    points: [
      'many students, many ideas',
      'much time, much information',
      'much lebih umum di negatif/pertanyaan; di positif sering diganti a lot of',
    ],
    examples: [
      { sentence: 'How many students are there?', focus: 'many' },
      { sentence: 'How much water do we need?', focus: 'much' },
      { sentence: 'I do not have much time.', focus: 'much' },
      { sentence: 'We have a lot of ideas.', focus: 'a lot of' },
    ],
  },
  {
    title: 'few / little',
    desc: 'few untuk countable plural, little untuk uncountable.',
    points: [
      'few = sedikit dan terasa kurang (countable): few books',
      'little = sedikit dan terasa kurang (uncountable): little money',
      'a few / a little = ada beberapa/sedikit (lebih positif)',
    ],
    examples: [
      { sentence: 'We have few options.', focus: 'few' },
      { sentence: 'He has little experience.', focus: 'little' },
      { sentence: 'I have a few friends here.', focus: 'a few' },
      { sentence: 'We still have a little time.', focus: 'a little' },
    ],
  },
  {
    title: 'a lot of',
    desc: 'Bisa untuk countable plural dan uncountable, sangat umum di speaking/writing netral.',
    points: ['a lot of books', 'a lot of time'],
    examples: [
      { sentence: 'They have a lot of ideas.', focus: 'a lot of' },
      { sentence: 'We spent a lot of money.', focus: 'a lot of' },
    ],
  },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'Much students joined the class.', correct: 'Many students joined the class.' },
  { wrong: 'I have many money.', correct: 'I have much money. / I have a lot of money.' },
  { wrong: 'There is a few water left.', correct: 'There is a little water left.' },
] as const;

function highlightQuantifier(sentence: string, focus: string) {
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
      <span className="qt-highlight">{mid}</span>
      {end}
    </>
  );
}

export default function QuantifiersPage() {
  return (
    <main className="qt-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="qt-shell gr-topic-shell">
        <header className="qt-header">
          <h1 className="qt-title">Quantifiers (some, any, much, many, few, little, a lot of)</h1>
          <p className="qt-subtitle">
            Memahami pemilihan quantifier berdasarkan noun type (countable/uncountable) dan fungsi
            kalimat.
          </p>
        </header>

        <section className="qt-block">
          <h2 className="qt-block-title">Konsep</h2>
          <p className="qt-text">
            Quantifier dipakai untuk menunjukkan jumlah. Pilihan quantifier harus sesuai dengan jenis
            noun dan konteks kalimat (positif, negatif, pertanyaan).
          </p>
        </section>

        <section className="qt-block">
          <h2 className="qt-block-title">Core Quantifiers</h2>
          <div className="qt-grid qt-grid-one-col">
            {QUANTIFIER_GROUPS.map((item) => (
              <details key={item.title} className="qt-card qt-card-accordion">
                <summary className="qt-card-summary">
                  <h3 className="qt-card-title">{item.title}</h3>
                  <span className="qt-card-caret" aria-hidden="true" />
                </summary>
                <div className="qt-card-body">
                  <p className="qt-card-desc">{item.desc}</p>
                  <ul className="qt-list">
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  <ul className="qt-list">
                    {item.examples.map((ex) => (
                      <li key={ex.sentence}>{highlightQuantifier(ex.sentence, ex.focus)}</li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="qt-block">
          <h2 className="qt-block-title">Kesalahan Umum</h2>
          <div className="qt-fix-list">
            {COMMON_MISTAKES.map((item) => (
              <article key={item.wrong} className="qt-fix-card">
                <p className="qt-fix-wrong">Salah: {item.wrong}</p>
                <p className="qt-fix-correct">Benar: {item.correct}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="qt-block">
          <h2 className="qt-block-title">Catatan Penting:</h2>
          <ul className="qt-list">
            <li>- Cek dulu noun type: countable plural atau uncountable.</li>
            <li>- some/any sangat tergantung jenis kalimat (positif vs negatif/tanya).</li>
            <li>- a lot of adalah opsi aman dan natural untuk banyak konteks.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
