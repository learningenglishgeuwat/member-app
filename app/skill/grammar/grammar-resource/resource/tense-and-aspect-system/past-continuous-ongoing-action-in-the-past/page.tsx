import BackButton from '../../../../../components/BackButton';
import './past-continuous-ongoing-action-in-the-past.css';
import '../../topic-layout.css';

const USE_CASES = [
  {
    title: 'Ongoing Action at a Specific Past Time',
    desc: 'Dipakai untuk aksi yang sedang berlangsung pada titik waktu tertentu di masa lalu.',
    examples: [
      { sentence: 'I was studying at 9 p.m. last night.', focus: 'was studying' },
      { sentence: 'At that time, she was working in her office.', focus: 'was working' },
    ],
  },
  {
    title: 'Background Action + Interrupted Event',
    desc: 'Dipakai untuk aksi latar belakang yang diganggu aksi lain (umumnya past simple).',
    examples: [
      { sentence: 'They were walking when it started to rain.', focus: 'were walking' },
      { sentence: 'We were discussing when the teacher arrived.', focus: 'were discussing' },
    ],
  },
  {
    title: 'Two Ongoing Past Actions',
    desc: 'Dipakai untuk dua aksi yang sama-sama berlangsung bersamaan di masa lalu.',
    examples: [
      {
        sentence: 'I was cooking while my brother was washing dishes.',
        focus: 'was cooking',
      },
      { sentence: 'She was reading while I was writing notes.', focus: 'was reading' },
    ],
  },
] as const;

const CORE_PATTERNS = [
  {
    title: 'Positive',
    points: ['S + was/were + V-ing'],
    examples: [
      { sentence: 'He was sleeping.', focus: 'was sleeping' },
      { sentence: 'They were studying.', focus: 'were studying' },
    ],
  },
  {
    title: 'Negative',
    points: ['S + was/were + not + V-ing'],
    examples: [
      { sentence: 'He was not sleeping.', focus: 'was not sleeping' },
      { sentence: 'They were not studying.', focus: 'were not studying' },
    ],
  },
  {
    title: 'Question',
    points: ['Was/Were + S + V-ing?'],
    examples: [
      { sentence: 'Was he sleeping?', focus: 'Was he sleeping' },
      { sentence: 'Were they studying?', focus: 'Were they studying' },
    ],
  },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'They was studying.', correct: 'They were studying.' },
  { wrong: 'Was you working at 8?', correct: 'Were you working at 8?' },
  { wrong: 'She was cook when I came.', correct: 'She was cooking when I came.' },
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
      <span className="pac-highlight">{mid}</span>
      {end}
    </>
  );
}

export default function PastContinuousPage() {
  return (
    <main className="pac-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="pac-shell gr-topic-shell">
        <header className="pac-header">
          <h1 className="pac-title">Past Continuous (Ongoing Action in the Past)</h1>
          <p className="pac-subtitle">
            Memahami penggunaan Past Continuous untuk aksi yang sedang berlangsung di masa lalu.
          </p>
        </header>

        <section className="pac-block">
          <h2 className="pac-block-title">Konsep</h2>
          <p className="pac-text">
            Past Continuous memakai <strong>was/were + V-ing</strong> untuk menekankan proses/aksi yang
            sedang terjadi di masa lalu.
          </p>
        </section>

        <section className="pac-block">
          <h2 className="pac-block-title">When to Use</h2>
          <div className="pac-grid pac-grid-one-col">
            {USE_CASES.map((item) => (
              <details key={item.title} className="pac-card pac-card-accordion">
                <summary className="pac-card-summary">
                  <h3 className="pac-card-title">{item.title}</h3>
                  <span className="pac-card-caret" aria-hidden="true" />
                </summary>
                <div className="pac-card-body">
                  <p className="pac-card-desc">{item.desc}</p>
                  <ul className="pac-list">
                    {item.examples.map((ex) => (
                      <li key={ex.sentence}>{highlightWord(ex.sentence, ex.focus)}</li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="pac-block">
          <h2 className="pac-block-title">Core Patterns</h2>
          <div className="pac-grid pac-grid-one-col">
            {CORE_PATTERNS.map((item) => (
              <details key={item.title} className="pac-card pac-card-accordion">
                <summary className="pac-card-summary">
                  <h3 className="pac-card-title">{item.title}</h3>
                  <span className="pac-card-caret" aria-hidden="true" />
                </summary>
                <div className="pac-card-body">
                  <ul className="pac-list">
                    {item.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  <ul className="pac-list">
                    {item.examples.map((ex) => (
                      <li key={ex.sentence}>{highlightWord(ex.sentence, ex.focus)}</li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="pac-block">
          <h2 className="pac-block-title">Kesalahan Umum</h2>
          <div className="pac-fix-list">
            {COMMON_MISTAKES.map((item) => (
              <article key={item.wrong} className="pac-fix-card">
                <p className="pac-fix-wrong">Salah: {item.wrong}</p>
                <p className="pac-fix-correct">Benar: {item.correct}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="pac-block">
          <h2 className="pac-block-title">Catatan Penting:</h2>
          <ul className="pac-list">
            <li>- Gunakan past simple untuk aksi singkat yang memotong proses (interruption).</li>
            <li>- Past Continuous fokus pada proses, bukan hasil akhir aksi.</li>
            <li>- While biasanya untuk aksi duratif (past continuous), sedangkan when sering untuk event pemotong (past simple).</li>
            <li>- Past markers umum: at that time, at 8 p.m., while, when.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}


