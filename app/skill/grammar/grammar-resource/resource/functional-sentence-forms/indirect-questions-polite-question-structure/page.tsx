import BackButton from '../../../../../components/BackButton';
import './indirect-questions-polite-question-structure.css';
import '../../topic-layout.css';

const CORE_PATTERNS = [
  {
    title: 'Yes/No Indirect Questions',
    points: [
      'Pola: Intro phrase + if/whether + subject + verb',
      'Tidak pakai inversi auxiliary di klausa tidak langsung',
    ],
    examples: [
      { before: 'Do you know ', focus: 'if she is available', after: '?' },
      { before: 'Could you tell me ', focus: 'whether the class has started', after: '?' },
    ],
  },
  {
    title: 'WH Indirect Questions',
    points: [
      'Pola: Intro phrase + WH word + subject + verb',
      'Urutan tetap seperti statement, bukan direct question',
    ],
    examples: [
      { before: 'Could you tell me ', focus: 'where the office is', after: '?' },
      { before: 'Do you know ', focus: 'what time the meeting starts', after: '?' },
    ],
  },
] as const;

const INTRO_PHRASES = [
  'Could you tell me ...?',
  'Do you know ...?',
  'Can you tell me ...?',
  'Would you mind telling me ...?',
] as const;

const DIRECT_TO_INDIRECT = [
  {
    direct: 'Where is the station?',
    indirect: { before: 'Could you tell me ', focus: 'where the station is', after: '?' },
  },
  {
    direct: 'Is she at home?',
    indirect: { before: 'Do you know ', focus: 'if she is at home', after: '?' },
  },
  {
    direct: 'What time does class start?',
    indirect: { before: 'Could you tell me ', focus: 'what time class starts', after: '?' },
  },
] as const;

const PUNCTUATION_RULES = [
  {
    title: 'Intro phrase = pertanyaan',
    note: 'Tetap pakai tanda tanya (?).',
    example: { before: 'Could you tell me ', focus: 'where he lives', after: '?' },
  },
  {
    title: 'Intro phrase = statement',
    note: 'Biasanya diakhiri titik (.).',
    example: { before: 'I wonder ', focus: 'where he lives', after: '.' },
  },
] as const;

const IF_WHETHER_NOTES = [
  {
    rule: 'if dan whether sama-sama bisa untuk yes/no indirect question.',
    example: { before: 'Do you know ', focus: 'if/whether she is ready', after: '?' },
  },
  {
    rule: 'Pakai whether jika ada pasangan or not atau konteks lebih formal.',
    example: { before: 'I wonder ', focus: 'whether he will come or not', after: '.' },
  },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'Could you tell me where is the station?', correct: 'Could you tell me where the station is?' },
  { wrong: 'Do you know what does she need?', correct: 'Do you know what she needs?' },
  { wrong: 'Can you tell me is he ready?', correct: 'Can you tell me if he is ready?' },
] as const;

export default function IndirectQuestionsPage() {
  return (
    <main className="iq-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="iq-shell gr-topic-shell">
        <header className="iq-header">
          <h1 className="iq-title">Indirect Questions (Polite Question Structure)</h1>
          <p className="iq-subtitle">
            Memahami cara mengubah direct question menjadi bentuk tidak langsung yang lebih sopan.
          </p>
        </header>

        <section className="iq-block">
          <h2 className="iq-block-title">Konsep</h2>
          <p className="iq-text">
            Indirect question dipakai untuk bertanya dengan lebih halus. Struktur utama berubah menjadi
            urutan statement setelah intro phrase.
          </p>
        </section>

        <section className="iq-block">
          <h2 className="iq-block-title">Core Patterns</h2>
          <div className="iq-grid iq-grid-one-col">
            {CORE_PATTERNS.map((item) => (
              <details key={item.title} className="iq-card iq-card-accordion">
                <summary className="iq-card-summary">
                  <h3 className="iq-card-title">{item.title}</h3>
                  <span className="iq-card-caret" aria-hidden="true" />
                </summary>
                <div className="iq-card-body">
                  <ul className="iq-list">
                    {item.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  <ul className="iq-list">
                    {item.examples.map((ex) => (
                      <li key={`${item.title}-${ex.before}-${ex.focus}-${ex.after}`}>
                        {ex.before}
                        <span className="iq-highlight">{ex.focus}</span>
                        {ex.after}
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="iq-block">
          <h2 className="iq-block-title">Common Intro Phrases</h2>
          <ul className="iq-list">
            {INTRO_PHRASES.map((phrase) => (
              <li key={phrase}>{phrase}</li>
            ))}
          </ul>
        </section>

        <section className="iq-block">
          <h2 className="iq-block-title">Direct to Indirect Examples</h2>
          <div className="iq-table-wrap geuwat-table-scroll">
            <table className="iq-table geuwat-table-responsive">
              <thead>
                <tr>
                  <th>Direct Question</th>
                  <th>Indirect Question</th>
                </tr>
              </thead>
              <tbody>
                {DIRECT_TO_INDIRECT.map((row) => (
                  <tr key={row.direct}>
                    <td>{row.direct}</td>
                    <td>
                      {row.indirect.before}
                      <span className="iq-highlight">{row.indirect.focus}</span>
                      {row.indirect.after}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="iq-block">
          <h2 className="iq-block-title">Punctuation Rule</h2>
          <div className="iq-grid iq-grid-one-col">
            {PUNCTUATION_RULES.map((item) => (
              <article key={item.title} className="iq-card">
                <div className="iq-card-body">
                  <h3 className="iq-card-title">{item.title}</h3>
                  <p className="iq-text">{item.note}</p>
                  <p className="iq-text">
                    Contoh: {item.example.before}
                    <span className="iq-highlight">{item.example.focus}</span>
                    {item.example.after}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="iq-block">
          <h2 className="iq-block-title">if vs whether</h2>
          <div className="iq-grid iq-grid-one-col">
            {IF_WHETHER_NOTES.map((item) => (
              <article key={item.rule} className="iq-card">
                <div className="iq-card-body">
                  <p className="iq-text">{item.rule}</p>
                  <p className="iq-text">
                    Contoh: {item.example.before}
                    <span className="iq-highlight">{item.example.focus}</span>
                    {item.example.after}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="iq-block">
          <h2 className="iq-block-title">Kesalahan Umum</h2>
          <div className="iq-fix-list">
            {COMMON_MISTAKES.map((item) => (
              <article key={item.wrong} className="iq-fix-card">
                <p className="iq-fix-wrong">Salah: {item.wrong}</p>
                <p className="iq-fix-correct">Benar: {item.correct}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="iq-block">
          <h2 className="iq-block-title">Catatan Penting:</h2>
          <ul className="iq-list">
            <li>Setelah intro phrase, jangan balik ke pola question (no inversion).</li>
            <li>Untuk yes/no, gunakan if atau whether.</li>
            <li>Indirect question sangat berguna untuk konteks formal dan sopan.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
