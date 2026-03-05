import BackButton from '../../../../../components/BackButton';
import './present-continuous-actions-in-progress-and-near-future-plan.css';
import '../../topic-layout.css';

const USE_CASES = [
  {
    title: 'Actions in Progress (Now)',
    desc: 'Dipakai untuk aksi yang sedang berlangsung saat ini.',
    examples: [
      { sentence: 'She is studying now.', focus: 'is studying' },
      { sentence: 'They are waiting outside.', focus: 'are waiting' },
      { sentence: 'I am writing an email.', focus: 'am writing' },
    ],
  },
  {
    title: 'Temporary Situations',
    desc: 'Dipakai untuk keadaan sementara di periode tertentu.',
    examples: [
      { sentence: 'He is living with his uncle this month.', focus: 'is living' },
      { sentence: 'We are using a temporary office.', focus: 'are using' },
    ],
  },
  {
    title: 'Near Future Plans',
    desc: 'Dipakai untuk rencana dekat yang sudah diatur, biasanya dengan penanda waktu jelas.',
    examples: [
      { sentence: 'I am meeting my mentor tonight.', focus: 'am meeting' },
      { sentence: 'They are traveling next week.', focus: 'are traveling' },
    ],
  },
] as const;

const CORE_PATTERNS = [
  {
    title: 'Positive',
    points: ['S + am/is/are + V-ing'],
    examples: [
      { sentence: 'I am reading now.', focus: 'am reading' },
      { sentence: 'She is preparing dinner.', focus: 'is preparing' },
    ],
  },
  {
    title: 'Negative',
    points: ['S + am/is/are + not + V-ing'],
    examples: [
      { sentence: 'They are not working today.', focus: 'are not working' },
      { sentence: 'He is not driving now.', focus: 'is not driving' },
    ],
  },
  {
    title: 'Question',
    points: ['Am/Is/Are + S + V-ing?'],
    examples: [
      { sentence: 'Are you studying now?', focus: 'Are you studying' },
      { sentence: 'Is she coming tonight?', focus: 'Is she coming' },
    ],
  },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'She studying now.', correct: 'She is studying now.' },
  { wrong: 'They are study now.', correct: 'They are studying now.' },
  { wrong: 'Are you going tomorrow to office?', correct: 'Are you going to the office tomorrow?' },
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
      <span className="pc-highlight">{mid}</span>
      {end}
    </>
  );
}

export default function PresentContinuousPage() {
  return (
    <main className="pc-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="pc-shell gr-topic-shell">
        <header className="pc-header">
          <h1 className="pc-title">Present Continuous (Actions in Progress and Near Future Plan)</h1>
          <p className="pc-subtitle">
            Memahami penggunaan Present Continuous untuk aksi yang sedang berjalan dan rencana dekat.
          </p>
        </header>

        <section className="pc-block">
          <h2 className="pc-block-title">Konsep</h2>
          <p className="pc-text">
            Present Continuous memakai <strong>be (am/is/are) + V-ing</strong> untuk menyatakan proses
            yang sedang terjadi atau rencana dekat yang sudah diatur.
          </p>
        </section>

        <section className="pc-block">
          <h2 className="pc-block-title">When to Use</h2>
          <div className="pc-grid pc-grid-one-col">
            {USE_CASES.map((item) => (
              <details key={item.title} className="pc-card pc-card-accordion">
                <summary className="pc-card-summary">
                  <h3 className="pc-card-title">{item.title}</h3>
                  <span className="pc-card-caret" aria-hidden="true" />
                </summary>
                <div className="pc-card-body">
                  <p className="pc-card-desc">{item.desc}</p>
                  <ul className="pc-list">
                    {item.examples.map((ex) => (
                      <li key={ex.sentence}>{highlightWord(ex.sentence, ex.focus)}</li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="pc-block">
          <h2 className="pc-block-title">Core Patterns</h2>
          <div className="pc-grid pc-grid-one-col">
            {CORE_PATTERNS.map((item) => (
              <details key={item.title} className="pc-card pc-card-accordion">
                <summary className="pc-card-summary">
                  <h3 className="pc-card-title">{item.title}</h3>
                  <span className="pc-card-caret" aria-hidden="true" />
                </summary>
                <div className="pc-card-body">
                  <ul className="pc-list">
                    {item.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  <ul className="pc-list">
                    {item.examples.map((ex) => (
                      <li key={ex.sentence}>{highlightWord(ex.sentence, ex.focus)}</li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="pc-block">
          <h2 className="pc-block-title">Kesalahan Umum</h2>
          <div className="pc-fix-list">
            {COMMON_MISTAKES.map((item) => (
              <article key={item.wrong} className="pc-fix-card">
                <p className="pc-fix-wrong">Salah: {item.wrong}</p>
                <p className="pc-fix-correct">Benar: {item.correct}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="pc-block">
          <h2 className="pc-block-title">Catatan Penting:</h2>
          <ul className="pc-list">
            <li>- Selalu cek be verb (am/is/are) sebelum V-ing.</li>
            <li>- Present Continuous bisa untuk near future jika rencananya sudah jelas.</li>
            <li>- Hindari memakai stative verbs tertentu dalam bentuk continuous jika maknanya state.</li>
            <li>- Contoh stative verb: I know the answer (bukan I am knowing the answer).</li>
          </ul>
        </section>
      </div>
    </main>
  );
}


