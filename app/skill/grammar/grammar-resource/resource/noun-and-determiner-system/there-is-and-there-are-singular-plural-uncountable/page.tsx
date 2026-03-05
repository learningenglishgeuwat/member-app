import BackButton from '../../../../../components/BackButton';
import './there-is-and-there-are-singular-plural-uncountable.css';
import '../../topic-layout.css';

const CORE_RULES = [
  {
    title: 'Singular: There is',
    desc: 'Dipakai untuk noun singular.',
    examples: [
      { sentence: 'There is a book on the table.', focus: 'There is' },
      { sentence: 'There is one student in the room.', focus: 'There is' },
    ],
  },
  {
    title: 'Plural: There are',
    desc: 'Dipakai untuk noun plural.',
    examples: [
      { sentence: 'There are two books on the table.', focus: 'There are' },
      { sentence: 'There are many students here.', focus: 'There are' },
    ],
  },
  {
    title: 'Uncountable: There is',
    desc: 'Dipakai untuk noun uncountable.',
    examples: [
      { sentence: 'There is some water in the bottle.', focus: 'There is' },
      { sentence: 'There is a lot of traffic today.', focus: 'There is' },
    ],
  },
] as const;

const FORMS = [
  {
    title: 'Positive Form',
    examples: [
      { sentence: 'There is a chair in my room.', focus: 'There is' },
      { sentence: 'There are three bags on the floor.', focus: 'There are' },
    ],
  },
  {
    title: 'Negative Form',
    examples: [
      { sentence: 'There is not any milk left.', focus: 'There is not' },
      { sentence: "There isn't any milk left.", focus: "There isn't" },
      { sentence: 'There are not any empty seats.', focus: 'There are not' },
      { sentence: "There aren't any empty seats.", focus: "There aren't" },
    ],
  },
  {
    title: 'Question Form',
    examples: [
      { sentence: 'Is there a bank near here?', focus: 'Is there' },
      { sentence: 'Are there any questions?', focus: 'Are there' },
    ],
  },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'There are some water in the bottle.', correct: 'There is some water in the bottle.' },
  { wrong: 'There is three students in class.', correct: 'There are three students in class.' },
  { wrong: 'Are there a book on the desk?', correct: 'Is there a book on the desk?' },
] as const;

function highlightPhrase(sentence: string, focus: string) {
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
      <span className="tia-highlight">{mid}</span>
      {end}
    </>
  );
}

export default function ThereIsThereArePage() {
  return (
    <main className="tia-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="tia-shell gr-topic-shell">
        <header className="tia-header">
          <h1 className="tia-title">There Is and There Are (Singular, Plural, Uncountable)</h1>
          <p className="tia-subtitle">
            Memahami penggunaan there is/there are untuk menyatakan keberadaan benda/orang secara tepat.
          </p>
        </header>

        <section className="tia-block">
          <h2 className="tia-block-title">Konsep</h2>
          <p className="tia-text">
            <strong>There is/there are</strong> dipakai untuk memperkenalkan keberadaan sesuatu. Pilihan
            <em> is</em> atau <em>are</em> ditentukan oleh noun setelahnya.
          </p>
        </section>

        <section className="tia-block">
          <h2 className="tia-block-title">Core Rules</h2>
          <div className="tia-grid tia-grid-one-col">
            {CORE_RULES.map((item) => (
              <details key={item.title} className="tia-card tia-card-accordion">
                <summary className="tia-card-summary">
                  <h3 className="tia-card-title">{item.title}</h3>
                  <span className="tia-card-caret" aria-hidden="true" />
                </summary>
                <div className="tia-card-body">
                  <p className="tia-card-desc">{item.desc}</p>
                  <ul className="tia-list">
                    {item.examples.map((ex) => (
                      <li key={ex.sentence}>{highlightPhrase(ex.sentence, ex.focus)}</li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="tia-block">
          <h2 className="tia-block-title">Sentence Forms</h2>
          <div className="tia-grid tia-grid-one-col">
            {FORMS.map((item) => (
              <details key={item.title} className="tia-card tia-card-accordion">
                <summary className="tia-card-summary">
                  <h3 className="tia-card-title">{item.title}</h3>
                  <span className="tia-card-caret" aria-hidden="true" />
                </summary>
                <div className="tia-card-body">
                  <ul className="tia-list">
                    {item.examples.map((ex) => (
                      <li key={ex.sentence}>{highlightPhrase(ex.sentence, ex.focus)}</li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="tia-block">
          <h2 className="tia-block-title">Kesalahan Umum</h2>
          <div className="tia-fix-list">
            {COMMON_MISTAKES.map((item) => (
              <article key={item.wrong} className="tia-fix-card">
                <p className="tia-fix-wrong">Salah: {item.wrong}</p>
                <p className="tia-fix-correct">Benar: {item.correct}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="tia-block">
          <h2 className="tia-block-title">Catatan Penting:</h2>
          <ul className="tia-list">
            <li>- Singular/uncountable gunakan there is.</li>
            <li>- Plural gunakan there are.</li>
            <li>- Cek noun setelah there is/are sebelum menentukan auxiliary.</li>
            <li>
              - Jika noun campuran, agreement biasanya ikut noun pertama setelah there (There is a
              pen and two books.).
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
