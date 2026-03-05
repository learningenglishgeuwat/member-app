import BackButton from '../../../../../components/BackButton';
import './question-forms-yes-no-questions-and-wh-questions.css';
import '../../topic-layout.css';

const QUESTION_TYPES = [
  {
    title: 'Yes/No Questions',
    desc: 'Pertanyaan yang jawabannya umumnya yes atau no.',
    points: [
      'Pola dasar: Auxiliary + Subject + Main Verb ...?',
      'Contoh auxiliary: do/does/did, am/is/are, was/were, have/has, can/will',
    ],
    examples: [
      { before: '', focus: 'Do you study', after: ' at night?' },
      { before: '', focus: 'Is she', after: ' at home?' },
      { before: '', focus: 'Can they join', after: ' us?' },
    ],
  },
  {
    title: 'WH Questions',
    desc: 'Pertanyaan untuk informasi spesifik (what, where, when, why, who, how).',
    points: [
      'Pola umum: WH word + Auxiliary + Subject + Main Verb ...?',
      'Untuk be verb: WH word + be + Subject ...?',
      'Subject question: jika WH word menjadi subject, biasanya tidak pakai do/does/did (contoh: Who called you?).',
    ],
    examples: [
      { before: '', focus: 'Where do you live', after: '?' },
      { before: '', focus: 'Why did she call', after: '?' },
      { before: '', focus: 'Who is', after: ' your teacher?' },
    ],
  },
] as const;

const WH_WORDS = [
  { wh: 'What', function: 'benda/informasi', example: { before: '', focus: 'What', after: ' do you need?' } },
  { wh: 'Where', function: 'tempat', example: { before: '', focus: 'Where', after: ' are they now?' } },
  { wh: 'When', function: 'waktu', example: { before: '', focus: 'When', after: ' does the class start?' } },
  { wh: 'Why', function: 'alasan', example: { before: '', focus: 'Why', after: ' are you late?' } },
  { wh: 'Who', function: 'orang', example: { before: '', focus: 'Who', after: ' called you?' } },
  { wh: 'How', function: 'cara/kondisi', example: { before: '', focus: 'How', after: ' do you solve this?' } },
  { wh: 'Which', function: 'pilihan', example: { before: '', focus: 'Which', after: ' book do you want?' } },
  { wh: 'Whose', function: 'kepemilikan', example: { before: '', focus: 'Whose', after: ' bag is this?' } },
  { wh: 'Whom', function: 'objek orang (formal)', example: { before: '', focus: 'Whom', after: ' did you meet?' } },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'Where you live?', correct: 'Where do you live?' },
  { wrong: 'Why she is late?', correct: 'Why is she late?' },
  { wrong: 'Do she like coffee?', correct: 'Does she like coffee?' },
] as const;

export default function QuestionFormsPage() {
  return (
    <main className="qf-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="qf-shell gr-topic-shell">
        <header className="qf-header">
          <h1 className="qf-title">Question Forms (Yes/No Questions and WH Questions)</h1>
          <p className="qf-subtitle">
            Memahami struktur pertanyaan agar urutan kata dan auxiliary tetap benar saat bertanya.
          </p>
        </header>

        <section className="qf-block">
          <h2 className="qf-block-title">Konsep</h2>
          <p className="qf-text">
            Dalam bahasa Inggris, pertanyaan umumnya membutuhkan inversi <strong>auxiliary + subject</strong>.
            Untuk informasi spesifik, gunakan WH word di awal pertanyaan.
          </p>
        </section>

        <section className="qf-block">
          <h2 className="qf-block-title">Question Types</h2>
          <div className="qf-grid qf-grid-one-col">
            {QUESTION_TYPES.map((item) => (
              <details key={item.title} className="qf-card qf-card-accordion">
                <summary className="qf-card-summary">
                  <h3 className="qf-card-title">{item.title}</h3>
                  <span className="qf-card-caret" aria-hidden="true" />
                </summary>
	                <div className="qf-card-body">
	                  <p className="qf-card-desc">{item.desc}</p>
	                  <ul className="qf-list">
	                    {item.points.map((p) => (
	                      <li key={p}>{p}</li>
	                    ))}
	                  </ul>
	                  <ul className="qf-list">
	                    {item.examples.map((ex) => (
	                      <li key={`${item.title}-${ex.before}-${ex.focus}-${ex.after}`}>
	                        {ex.before}
	                        <span className="qf-highlight">{ex.focus}</span>
	                        {ex.after}
	                      </li>
	                    ))}
	                  </ul>
	                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="qf-block">
          <h2 className="qf-block-title">Common WH Words</h2>
          <div className="qf-table-wrap geuwat-table-scroll">
            <table className="qf-table geuwat-table-responsive">
              <thead>
                <tr>
                  <th>WH Word</th>
                  <th>Function</th>
                  <th>Example</th>
                </tr>
              </thead>
              <tbody>
	                {WH_WORDS.map((row) => (
	                  <tr key={row.wh}>
	                    <td>{row.wh}</td>
	                    <td>{row.function}</td>
	                    <td>
	                      {row.example.before}
	                      <span className="qf-highlight">{row.example.focus}</span>
	                      {row.example.after}
	                    </td>
	                  </tr>
	                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="qf-block">
          <h2 className="qf-block-title">Kesalahan Umum</h2>
          <div className="qf-fix-list">
            {COMMON_MISTAKES.map((item) => (
              <article key={item.wrong} className="qf-fix-card">
                <p className="qf-fix-wrong">Salah: {item.wrong}</p>
                <p className="qf-fix-correct">Benar: {item.correct}</p>
              </article>
            ))}
          </div>
        </section>

	        <section className="qf-block">
	          <h2 className="qf-block-title">Catatan Penting:</h2>
	          <ul className="qf-list">
	            <li>Untuk simple present/past tanpa be, gunakan do/does/did.</li>
	            <li>Setelah do/does/did, verb kembali ke base form (V1).</li>
	            <li>Jaga urutan: WH + auxiliary + subject + verb (kecuali subject question khusus).</li>
	            <li>
	              Subject question: <span className="qf-highlight">Who called you?</span> (tanpa do/does/did)
	            </li>
	          </ul>
	        </section>
      </div>
    </main>
  );
}
