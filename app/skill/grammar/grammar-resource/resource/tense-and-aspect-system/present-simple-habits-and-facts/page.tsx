import BackButton from '../../../../../components/BackButton';
import './present-simple-habits-and-facts.css';
import '../../topic-layout.css';

const USE_CASES = [
  {
    title: 'Habits and Routines',
    desc: 'Dipakai untuk kebiasaan atau rutinitas berulang.',
    examples: [
      { sentence: 'I study every night.', focus: 'study' },
      { sentence: 'She walks to school.', focus: 'walks' },
      { sentence: 'They usually eat at home.', focus: 'eat' },
    ],
  },
  {
    title: 'General Facts',
    desc: 'Dipakai untuk fakta umum atau kebenaran ilmiah.',
    examples: [
      { sentence: 'Water boils at 100 degrees Celsius.', focus: 'boils' },
      { sentence: 'The earth goes around the sun.', focus: 'goes' },
      { sentence: 'Cats like milk.', focus: 'like' },
    ],
  },
  {
    title: 'Permanent States',
    desc: 'Dipakai untuk keadaan yang relatif tetap.',
    examples: [
      { sentence: 'He lives in Bandung.', focus: 'lives' },
      { sentence: 'My sister works in a bank.', focus: 'works' },
      { sentence: 'This book belongs to me.', focus: 'belongs' },
    ],
  },
] as const;

const CORE_PATTERNS = [
  {
    title: 'Positive',
    points: ['I/You/We/They + V1', 'He/She/It + V1-s/es'],
    examples: [
      { sentence: 'I play tennis.', focus: 'play' },
      { sentence: 'She plays tennis.', focus: 'plays' },
    ],
  },
  {
    title: 'Negative',
    points: ['I/You/We/They + do not + V1', 'He/She/It + does not + V1'],
    examples: [
      { sentence: 'They do not work on Sunday.', focus: 'do not work' },
      { sentence: 'He does not like coffee.', focus: 'does not like' },
    ],
  },
  {
    title: 'Question',
    points: ['Do + I/you/we/they + V1?', 'Does + he/she/it + V1?'],
    examples: [
      { sentence: 'Do you study at night?', focus: 'Do you study' },
      { sentence: 'Does she work here?', focus: 'Does she work' },
    ],
  },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'He go to school every day.', correct: 'He goes to school every day.' },
  { wrong: 'She do not like tea.', correct: 'She does not like tea.' },
  { wrong: 'Does he plays football?', correct: 'Does he play football?' },
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
      <span className="ps-highlight">{mid}</span>
      {end}
    </>
  );
}

export default function PresentSimplePage() {
  return (
    <main className="ps-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="ps-shell gr-topic-shell">
        <header className="ps-header">
          <h1 className="ps-title">Present Simple (Habits and Facts)</h1>
          <p className="ps-subtitle">
            Memahami penggunaan Present Simple untuk kebiasaan, fakta umum, dan pola kalimat dasar.
          </p>
        </header>

        <section className="ps-block">
          <h2 className="ps-block-title">Konsep</h2>
          <p className="ps-text">
            Present Simple dipakai untuk menyatakan hal yang rutin, fakta umum, dan keadaan yang stabil.
            Fokus utama ada pada bentuk verb dan penggunaan do/does.
          </p>
        </section>

        <section className="ps-block">
          <h2 className="ps-block-title">When to Use</h2>
          <div className="ps-grid ps-grid-one-col">
            {USE_CASES.map((item) => (
              <details key={item.title} className="ps-card ps-card-accordion">
                <summary className="ps-card-summary">
                  <h3 className="ps-card-title">{item.title}</h3>
                  <span className="ps-card-caret" aria-hidden="true" />
                </summary>
                <div className="ps-card-body">
                  <p className="ps-card-desc">{item.desc}</p>
                  <ul className="ps-list">
                    {item.examples.map((ex) => (
                      <li key={ex.sentence}>{highlightWord(ex.sentence, ex.focus)}</li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="ps-block">
          <h2 className="ps-block-title">Core Patterns</h2>
          <div className="ps-grid ps-grid-one-col">
            {CORE_PATTERNS.map((item) => (
              <details key={item.title} className="ps-card ps-card-accordion">
                <summary className="ps-card-summary">
                  <h3 className="ps-card-title">{item.title}</h3>
                  <span className="ps-card-caret" aria-hidden="true" />
                </summary>
                <div className="ps-card-body">
                  <ul className="ps-list">
                    {item.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  <ul className="ps-list">
                    {item.examples.map((ex) => (
                      <li key={ex.sentence}>{highlightWord(ex.sentence, ex.focus)}</li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="ps-block">
          <h2 className="ps-block-title">Kesalahan Umum</h2>
          <div className="ps-fix-list">
            {COMMON_MISTAKES.map((item) => (
              <article key={item.wrong} className="ps-fix-card">
                <p className="ps-fix-wrong">Salah: {item.wrong}</p>
                <p className="ps-fix-correct">Benar: {item.correct}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="ps-block">
          <h2 className="ps-block-title">Catatan Penting:</h2>
          <ul className="ps-list">
            <li>- Subjek he/she/it butuh verb s/es di kalimat positif.</li>
            <li>- Setelah do/does, verb kembali ke base form (V1).</li>
            <li>- Frequency adverbs umum di Present Simple: always, usually, often, sometimes, never.</li>
            <li>
              - Posisi frequency adverb: sebelum main verb, tetapi setelah be (She always studies. /
              She is always on time.).
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
