import BackButton from '../../../../../components/BackButton';
import './future-continuous-action-in-progress-at-a-future-time.css';
import '../../topic-layout.css';

const USE_CASES = [
  {
    title: 'Action in Progress at a Specific Future Time',
    desc: 'Dipakai untuk aksi yang sedang berlangsung pada titik waktu tertentu di masa depan.',
    examples: [
      { before: 'At 9 tonight, I ', focus: 'will be studying', after: '.' },
      { before: 'This time next week, we ', focus: 'will be traveling', after: '.' },
    ],
  },
  {
    title: 'Polite Inquiry About Future Plans',
    desc: 'Dipakai untuk menanyakan rencana orang lain dengan lebih netral/sopan.',
    examples: [
      { before: '', focus: 'Will you be using', after: ' this room at 3 p.m.?' },
      { before: '', focus: 'Will she be joining', after: ' us tomorrow?' },
    ],
  },
] as const;

const CORE_PATTERNS = [
  {
    title: 'Positive',
    points: ['S + will be + V-ing'],
    examples: [
      { before: 'She ', focus: 'will be working', after: ' at 8.' },
      { before: 'They ', focus: 'will be waiting', after: ' for us.' },
    ],
  },
  {
    title: 'Negative',
    points: ['S + will not be + V-ing'],
    examples: [
      { before: 'He ', focus: 'will not be sleeping', after: ' at 10.' },
      { before: 'We ', focus: 'will not be traveling', after: ' this month.' },
    ],
  },
  {
    title: 'Question',
    points: ['Will + S + be + V-ing?'],
    examples: [
      { before: '', focus: 'Will you be studying', after: ' tonight?' },
      { before: '', focus: 'Will they be coming', after: ' early?' },
    ],
  },
] as const;

const TIME_MARKERS = [
  {
    marker: 'at + time',
    use: 'menunjukkan titik waktu spesifik di masa depan saat aksi sedang berlangsung.',
    example: { before: 'At 8 tomorrow, I ', focus: 'will be driving', after: ' to work.' },
  },
  {
    marker: 'this time next ...',
    use: 'menunjukkan momen perbandingan di masa depan (minggu depan, bulan depan, dll).',
    example: { before: 'This time next week, we ', focus: 'will be flying', after: ' to Bali.' },
  },
  {
    marker: 'tonight',
    use: 'waktu malam ini yang diproyeksikan sebagai proses berlangsung.',
    example: { before: 'Tonight, she ', focus: 'will be preparing', after: ' for the exam.' },
  },
  {
    marker: 'tomorrow morning',
    use: 'waktu pagi besok untuk aksi yang sedang berlangsung.',
    example: { before: 'Tomorrow morning, they ', focus: 'will be practicing', after: ' together.' },
  },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'She will be work at 8.', correct: 'She will be working at 8.' },
  { wrong: 'Will you be use this room?', correct: 'Will you be using this room?' },
  { wrong: 'They will working tomorrow.', correct: 'They will be working tomorrow.' },
] as const;

export default function FutureContinuousPage() {
  return (
    <main className="fc-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="fc-shell gr-topic-shell">
        <header className="fc-header">
          <h1 className="fc-title">Future Continuous (Action in Progress at a Future Time)</h1>
          <p className="fc-subtitle">
            Memahami Future Continuous untuk proses yang sedang berlangsung di titik waktu masa depan.
          </p>
        </header>

        <section className="fc-block">
          <h2 className="fc-block-title">Konsep</h2>
          <p className="fc-text">
            Future Continuous memakai pola <strong>will be + V-ing</strong> untuk menekankan proses aksi
            pada waktu tertentu di masa depan.
          </p>
        </section>

        <section className="fc-block">
          <h2 className="fc-block-title">When to Use</h2>
          <div className="fc-grid fc-grid-one-col">
            {USE_CASES.map((item) => (
              <details key={item.title} className="fc-card fc-card-accordion">
                <summary className="fc-card-summary">
                  <h3 className="fc-card-title">{item.title}</h3>
                  <span className="fc-card-caret" aria-hidden="true" />
                </summary>
                <div className="fc-card-body">
                  <p className="fc-card-desc">{item.desc}</p>
                  <ul className="fc-list">
                    {item.examples.map((ex) => (
                      <li key={`${item.title}-${ex.before}-${ex.focus}-${ex.after}`}>
                        {ex.before}
                        <span className="fc-highlight">{ex.focus}</span>
                        {ex.after}
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="fc-block">
          <h2 className="fc-block-title">Core Patterns</h2>
          <div className="fc-grid fc-grid-one-col">
            {CORE_PATTERNS.map((item) => (
              <details key={item.title} className="fc-card fc-card-accordion">
                <summary className="fc-card-summary">
                  <h3 className="fc-card-title">{item.title}</h3>
                  <span className="fc-card-caret" aria-hidden="true" />
                </summary>
                <div className="fc-card-body">
                  <ul className="fc-list">
                    {item.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  <ul className="fc-list">
                    {item.examples.map((ex) => (
                      <li key={`${item.title}-${ex.before}-${ex.focus}-${ex.after}`}>
                        {ex.before}
                        <span className="fc-highlight">{ex.focus}</span>
                        {ex.after}
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="fc-block">
          <h2 className="fc-block-title">Common Time Markers</h2>
          <div className="fc-marker-grid">
            {TIME_MARKERS.map((item) => (
              <article key={item.marker} className="fc-marker-card">
                <p className="fc-marker-head">
                  <span className="fc-chip">{item.marker}</span>
                </p>
                <p className="fc-marker-use">{item.use}</p>
                <p className="fc-marker-example">
                  Contoh: {item.example.before}
                  <span className="fc-highlight">{item.example.focus}</span>
                  {item.example.after}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="fc-block">
          <h2 className="fc-block-title">Kesalahan Umum</h2>
          <div className="fc-fix-list">
            {COMMON_MISTAKES.map((item) => (
              <article key={item.wrong} className="fc-fix-card">
                <p className="fc-fix-wrong">Salah: {item.wrong}</p>
                <p className="fc-fix-correct">Benar: {item.correct}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="fc-block">
          <h2 className="fc-block-title">Catatan Penting:</h2>
          <ul className="fc-list">
            <li>Future Continuous fokus pada proses, bukan hasil akhir.</li>
            <li>Bentuk ini cocok saat ingin terdengar lebih netral/sopan saat bertanya rencana.</li>
            <li>Jangan lupa unsur lengkap: will + be + V-ing.</li>
            <li>
              Future Continuous (proses): <span className="fc-highlight">At 8, I will be studying.</span>
            </li>
            <li>
              Future Simple (keputusan/prediksi):{' '}
              <span className="fc-highlight">I will study tonight.</span>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
