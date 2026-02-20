import BackButton from '../../../../../components/BackButton';
import './question-tags-confirmation-and-interaction.css';
import '../../topic-layout.css';

const CORE_RULES = [
  {
    title: 'Polarity Rule',
    points: [
      "Statement positif -> tag negatif: You are ready, aren't you?",
      'Statement negatif -> tag positif: You are not ready, are you?',
    ],
  },
  {
    title: 'Auxiliary Matching Rule',
    points: [
      'Tag mengikuti auxiliary/tense utama statement.',
      'Jika statement tidak punya auxiliary (present/past simple), gunakan do/does/did.',
    ],
  },
] as const;

const TAG_EXAMPLES = [
  {
    statement: { before: 'You ', focus: 'are', after: ' ready,' },
    tag: { before: '', focus: "aren't", after: ' you?' },
  },
  {
    statement: { before: 'They ', focus: 'can', after: ' swim,' },
    tag: { before: '', focus: "can't", after: ' they?' },
  },
  {
    statement: { before: 'She ', focus: 'finished', after: ' the task,' },
    tag: { before: '', focus: "didn't", after: ' she?' },
  },
  {
    statement: { before: 'You ', focus: "don't", after: ' like coffee,' },
    tag: { before: '', focus: 'do', after: ' you?' },
  },
  {
    statement: { before: "Let's ", focus: 'start', after: ' now,' },
    tag: { before: '', focus: 'shall', after: ' we?' },
  },
] as const;

const SPECIAL_CASES = [
  {
    rule: "I am ... , aren't I?",
    example: { before: 'I am late, ', focus: "aren't", after: ' I?' },
  },
  {
    rule: "Let's ... , shall we?",
    example: { before: "Let's begin, ", focus: 'shall', after: ' we?' },
  },
  {
    rule: "Imperative tags often use will you? / won't you?",
    example: { before: 'Close the door, ', focus: 'will', after: ' you?' },
  },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'She is tired, is she?', correct: "She is tired, isn't she?" },
  { wrong: "They went home, don't they?", correct: "They went home, didn't they?" },
  { wrong: 'You can swim, do you?', correct: "You can swim, can't you?" },
] as const;

export default function QuestionTagsPage() {
  return (
    <main className="qtg-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="qtg-shell gr-topic-shell">
        <header className="qtg-header">
          <h1 className="qtg-title">Question Tags (Confirmation and Interaction)</h1>
          <p className="qtg-subtitle">
            Memahami question tags untuk meminta konfirmasi dan menjaga interaksi percakapan.
          </p>
        </header>

        <section className="qtg-block">
          <h2 className="qtg-block-title">Konsep</h2>
          <p className="qtg-text">
            Question tag adalah pertanyaan singkat di akhir statement. Fungsinya untuk konfirmasi atau
            mengajak lawan bicara merespons.
          </p>
        </section>

        <section className="qtg-block">
          <h2 className="qtg-block-title">Core Rules</h2>
          <div className="qtg-grid qtg-grid-one-col">
            {CORE_RULES.map((item) => (
              <details key={item.title} className="qtg-card qtg-card-accordion">
                <summary className="qtg-card-summary">
                  <h3 className="qtg-card-title">{item.title}</h3>
                  <span className="qtg-card-caret" aria-hidden="true" />
                </summary>
                <div className="qtg-card-body">
                  <ul className="qtg-list">
                    {item.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="qtg-block">
          <h2 className="qtg-block-title">Common Examples</h2>
          <div className="qtg-table-wrap">
            <table className="qtg-table">
              <thead>
                <tr>
                  <th>Statement</th>
                  <th>Tag</th>
                </tr>
              </thead>
              <tbody>
                {TAG_EXAMPLES.map((row) => (
                  <tr
                    key={`${row.statement.before}${row.statement.focus}${row.statement.after}-${row.tag.before}${row.tag.focus}${row.tag.after}`}
                  >
                    <td>
                      {row.statement.before}
                      <span className="qtg-highlight">{row.statement.focus}</span>
                      {row.statement.after}
                    </td>
                    <td>
                      {row.tag.before}
                      <span className="qtg-highlight">{row.tag.focus}</span>
                      {row.tag.after}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="qtg-block">
          <h2 className="qtg-block-title">Special Cases</h2>
          <div className="qtg-grid qtg-grid-one-col">
            {SPECIAL_CASES.map((item) => (
              <article key={item.rule} className="qtg-card">
                <div className="qtg-card-body">
                  <h3 className="qtg-card-title">{item.rule}</h3>
                  <p className="qtg-text">
                    {item.example.before}
                    <span className="qtg-highlight">{item.example.focus}</span>
                    {item.example.after}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="qtg-block">
          <h2 className="qtg-block-title">Kesalahan Umum</h2>
          <div className="qtg-fix-list">
            {COMMON_MISTAKES.map((item) => (
              <article key={item.wrong} className="qtg-fix-card">
                <p className="qtg-fix-wrong">Salah: {item.wrong}</p>
                <p className="qtg-fix-correct">Benar: {item.correct}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="qtg-block">
          <h2 className="qtg-block-title">Catatan Penting:</h2>
          <ul className="qtg-list">
            <li>Pastikan auxiliary pada tag cocok dengan tense statement.</li>
            <li>Polarity wajib kebalikan antara statement dan tag.</li>
            <li>Intonasi naik menandakan benar-benar bertanya, intonasi turun menandakan konfirmasi.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
