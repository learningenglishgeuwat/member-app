import BackButton from '../../../../../components/BackButton';
import './present-perfect-experience-result-and-recent-change.css';
import '../../topic-layout.css';

const USE_CASES = [
  {
    title: 'Experience',
    desc: 'Membahas pengalaman hidup sampai sekarang (tanpa waktu spesifik).',
    examples: [
      { before: 'I ', focus: 'have visited', after: ' Bali.' },
      { before: 'She ', focus: 'has never tried', after: ' sushi.' },
      { before: '', focus: 'Have you ever seen', after: ' snow?' },
    ],
  },
  {
    title: 'Result (Now-Relevant)',
    desc: 'Aksi sudah selesai, hasilnya masih relevan sekarang.',
    examples: [
      { before: 'I ', focus: 'have finished', after: ' my report.' },
      { before: 'He ', focus: 'has lost', after: ' his key.' },
      { before: 'They ', focus: 'have cleaned', after: ' the room.' },
    ],
  },
  {
    title: 'Recent Change',
    desc: 'Perubahan terbaru yang terasa sampai sekarang.',
    examples: [
      { before: 'The weather ', focus: 'has changed', after: '.' },
      { before: 'She ', focus: 'has become', after: ' more confident.' },
      { before: 'Prices ', focus: 'have increased', after: '.' },
    ],
  },
] as const;

const CORE_PATTERNS = [
  {
    title: 'Positive',
    points: ['S + have/has + V3'],
    examples: [
      { before: 'I ', focus: 'have finished', after: ' the task.' },
      { before: 'She ', focus: 'has submitted', after: ' the form.' },
    ],
  },
  {
    title: 'Negative',
    points: ['S + have/has + not + V3'],
    examples: [
      { before: 'I ', focus: 'have not seen', after: ' that movie.' },
      { before: 'He ', focus: 'has not arrived', after: ' yet.' },
    ],
  },
  {
    title: 'Question',
    points: ['Have/Has + S + V3?'],
    examples: [
      { before: '', focus: 'Have you done', after: ' your homework?' },
      { before: '', focus: 'Has she called', after: ' you?' },
    ],
  },
] as const;

const TIME_MARKERS = [
  {
    marker: 'already',
    use: 'untuk menyatakan sesuatu sudah terjadi (umumnya kalimat positif).',
    example: { before: 'She has ', focus: 'already finished', after: ' her homework.' },
  },
  {
    marker: 'just',
    use: 'untuk aksi yang baru saja terjadi.',
    example: { before: 'They have ', focus: 'just arrived', after: '.' },
  },
  {
    marker: 'yet',
    use: 'umumnya di kalimat negatif/pertanyaan, biasanya di akhir kalimat.',
    example: { before: 'I have not ', focus: 'finished my report yet', after: '.' },
  },
  {
    marker: 'ever',
    use: 'untuk menanyakan pengalaman seumur hidup sampai sekarang.',
    example: { before: '', focus: 'Have you ever visited', after: ' Singapore?' },
  },
  {
    marker: 'never',
    use: 'untuk menyatakan belum pernah sama sekali.',
    example: { before: 'He has ', focus: 'never tried', after: ' sushi.' },
  },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'I have saw that film.', correct: 'I have seen that film.' },
  { wrong: 'She has finish her work.', correct: 'She has finished her work.' },
  { wrong: 'Did you ever visit Japan?', correct: 'Have you ever visited Japan?' },
] as const;

export default function PresentPerfectPage() {
  return (
    <main className="pp-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="pp-shell gr-topic-shell">
        <header className="pp-header">
          <h1 className="pp-title">Present Perfect (Experience, Result, and Recent Change)</h1>
          <p className="pp-subtitle">
            Memahami Present Perfect untuk pengalaman, hasil yang masih relevan, dan perubahan terbaru.
          </p>
        </header>

        <section className="pp-block">
          <h2 className="pp-block-title">Konsep</h2>
          <p className="pp-text">
            Present Perfect menghubungkan masa lalu dengan kondisi sekarang, memakai pola{' '}
            <strong>have/has + V3</strong>.
          </p>
        </section>

        <section className="pp-block">
          <h2 className="pp-block-title">When to Use</h2>
          <div className="pp-grid pp-grid-one-col">
            {USE_CASES.map((item) => (
              <details key={item.title} className="pp-card pp-card-accordion">
                <summary className="pp-card-summary">
                  <h3 className="pp-card-title">{item.title}</h3>
                  <span className="pp-card-caret" aria-hidden="true" />
                </summary>
                <div className="pp-card-body">
                  <p className="pp-card-desc">{item.desc}</p>
                  <ul className="pp-list">
                    {item.examples.map((ex) => (
                      <li key={`${item.title}-${ex.before}-${ex.focus}-${ex.after}`}>
                        {ex.before}
                        <span className="pp-highlight">{ex.focus}</span>
                        {ex.after}
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="pp-block">
          <h2 className="pp-block-title">Core Patterns</h2>
          <div className="pp-grid pp-grid-one-col">
            {CORE_PATTERNS.map((item) => (
              <details key={item.title} className="pp-card pp-card-accordion">
                <summary className="pp-card-summary">
                  <h3 className="pp-card-title">{item.title}</h3>
                  <span className="pp-card-caret" aria-hidden="true" />
                </summary>
                <div className="pp-card-body">
                  <ul className="pp-list">
                    {item.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  <ul className="pp-list">
                    {item.examples.map((ex) => (
                      <li key={`${item.title}-${ex.before}-${ex.focus}-${ex.after}`}>
                        {ex.before}
                        <span className="pp-highlight">{ex.focus}</span>
                        {ex.after}
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="pp-block">
          <h2 className="pp-block-title">Common Time Markers</h2>
          <div className="pp-marker-grid">
            {TIME_MARKERS.map((item) => (
              <article key={item.marker} className="pp-marker-card">
                <p className="pp-marker-head">
                  <span className="pp-chip">{item.marker}</span>
                </p>
                <p className="pp-marker-use">{item.use}</p>
                <p className="pp-marker-example">
                  Contoh: {item.example.before}
                  <span className="pp-highlight">{item.example.focus}</span>
                  {item.example.after}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="pp-block">
          <h2 className="pp-block-title">Kesalahan Umum</h2>
          <div className="pp-fix-list">
            {COMMON_MISTAKES.map((item) => (
              <article key={item.wrong} className="pp-fix-card">
                <p className="pp-fix-wrong">Salah: {item.wrong}</p>
                <p className="pp-fix-correct">Benar: {item.correct}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="pp-block">
          <h2 className="pp-block-title">Catatan Penting:</h2>
          <ul className="pp-list">
            <li>Jangan pakai waktu lampau spesifik (yesterday, last year) dengan Present Perfect.</li>
            <li>Gunakan V3 (past participle), bukan V2.</li>
            <li>have untuk I/you/we/they, has untuk he/she/it.</li>
            <li>
              Present Perfect: <span className="pp-highlight">I have visited Bali.</span> (waktu tidak
              spesifik)
            </li>
            <li>
              Past Simple: <span className="pp-highlight">I visited Bali last year.</span> (waktu spesifik)
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
