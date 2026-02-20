import BackButton from '../../../../../components/BackButton';
import './past-simple-finished-past-events.css';
import '../../topic-layout.css';

const USE_CASES = [
  {
    title: 'Finished Events in the Past',
    desc: 'Dipakai untuk kejadian yang sudah selesai di waktu lampau.',
    examples: [
      { sentence: 'I visited Bali last year.', focus: 'visited' },
      { sentence: 'She called me yesterday.', focus: 'called' },
      { sentence: 'They finished the project on Friday.', focus: 'finished' },
    ],
  },
  {
    title: 'Past Sequence / Story',
    desc: 'Dipakai untuk menceritakan urutan kejadian masa lalu.',
    examples: [
      { sentence: 'I woke up, took a shower, and left home.', focus: 'woke' },
      { sentence: 'He entered the room and sat down.', focus: 'entered' },
    ],
  },
  {
    title: 'Past Time Markers',
    desc: 'Sering dipakai dengan keterangan waktu lampau.',
    examples: [
      { sentence: 'I met her yesterday.', focus: 'yesterday' },
      { sentence: 'We finished the report last week.', focus: 'last week' },
      { sentence: 'He moved to Jakarta in 2020.', focus: 'in 2020' },
      { sentence: 'She called me two days ago.', focus: 'two days ago' },
    ],
  },
] as const;

const CORE_PATTERNS = [
  {
    title: 'Positive (Regular/Irregular Verbs)',
    points: ['S + V2'],
    examples: [
      { sentence: 'She watched a movie.', focus: 'watched' },
      { sentence: 'We played football.', focus: 'played' },
      { sentence: 'He went home early.', focus: 'went' },
    ],
  },
  {
    title: 'Negative/Question (Regular/Irregular Verbs)',
    points: ['S + did not + V1', 'Did + S + V1?'],
    examples: [
      { sentence: 'She did not watch a movie.', focus: 'did not watch' },
      { sentence: 'We did not play football.', focus: 'did not play' },
      { sentence: 'Did she watch a movie?', focus: 'Did she watch' },
      { sentence: 'Did they arrive on time?', focus: 'Did they arrive' },
    ],
  },
  {
    title: 'Be Verb in Past (was/were)',
    points: ['Positive: S + was/were', 'Negative: S + was/were not', 'Question: Was/Were + S?'],
    examples: [
      { sentence: 'I was tired yesterday.', focus: 'was' },
      { sentence: 'They were at home last night.', focus: 'were' },
      { sentence: 'Was she late?', focus: 'Was' },
    ],
  },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'She did not watched the video.', correct: 'She did not watch the video.' },
  { wrong: 'Did he went to school?', correct: 'Did he go to school?' },
  { wrong: 'I am tired yesterday.', correct: 'I was tired yesterday.' },
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
      <span className="pas-highlight">{mid}</span>
      {end}
    </>
  );
}

export default function PastSimplePage() {
  return (
    <main className="pas-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="pas-shell gr-topic-shell">
        <header className="pas-header">
          <h1 className="pas-title">Past Simple (Finished Past Events)</h1>
          <p className="pas-subtitle">
            Memahami penggunaan Past Simple untuk kejadian lampau yang sudah selesai.
          </p>
        </header>

        <section className="pas-block">
          <h2 className="pas-block-title">Konsep</h2>
          <p className="pas-text">
            Past Simple dipakai untuk menyatakan peristiwa yang selesai di masa lalu, biasanya dengan
            penanda waktu lampau yang jelas.
          </p>
        </section>

        <section className="pas-block">
          <h2 className="pas-block-title">When to Use</h2>
          <div className="pas-grid pas-grid-one-col">
            {USE_CASES.map((item) => (
              <details key={item.title} className="pas-card pas-card-accordion">
                <summary className="pas-card-summary">
                  <h3 className="pas-card-title">{item.title}</h3>
                  <span className="pas-card-caret" aria-hidden="true" />
                </summary>
                <div className="pas-card-body">
                  <p className="pas-card-desc">{item.desc}</p>
                  <ul className="pas-list">
                    {item.examples.map((ex) => (
                      <li key={ex.sentence}>{highlightWord(ex.sentence, ex.focus)}</li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="pas-block">
          <h2 className="pas-block-title">Core Patterns</h2>
          <div className="pas-grid pas-grid-one-col">
            {CORE_PATTERNS.map((item) => (
              <details key={item.title} className="pas-card pas-card-accordion">
                <summary className="pas-card-summary">
                  <h3 className="pas-card-title">{item.title}</h3>
                  <span className="pas-card-caret" aria-hidden="true" />
                </summary>
                <div className="pas-card-body">
                  <ul className="pas-list">
                    {item.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  <ul className="pas-list">
                    {item.examples.map((ex) => (
                      <li key={ex.sentence}>{highlightWord(ex.sentence, ex.focus)}</li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="pas-block">
          <h2 className="pas-block-title">Kesalahan Umum</h2>
          <div className="pas-fix-list">
            {COMMON_MISTAKES.map((item) => (
              <article key={item.wrong} className="pas-fix-card">
                <p className="pas-fix-wrong">Salah: {item.wrong}</p>
                <p className="pas-fix-correct">Benar: {item.correct}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="pas-block">
          <h2 className="pas-block-title">Catatan Penting:</h2>
          <ul className="pas-list">
            <li>- Setelah did/did not, verb harus kembali ke V1 (base form).</li>
            <li>- Positive memakai V2 (regular atau irregular).</li>
            <li>- Past Simple fokus ke event yang sudah selesai, bukan yang masih relevan sekarang.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}


