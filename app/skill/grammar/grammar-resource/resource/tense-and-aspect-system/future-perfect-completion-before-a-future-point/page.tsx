import BackButton from '../../../../../components/BackButton';
import './future-perfect-completion-before-a-future-point.css';
import '../../topic-layout.css';

const USE_CASES = [
  {
    title: 'Completion Before a Deadline',
    desc: 'Dipakai untuk target yang akan selesai sebelum waktu tertentu di masa depan.',
    examples: [
      { before: 'I ', focus: 'will have finished', after: ' this by Friday.' },
      { before: 'She ', focus: 'will have submitted', after: ' the report before noon.' },
    ],
  },
  {
    title: 'Result Achieved by a Future Time',
    desc: 'Menekankan hasil yang sudah tercapai pada titik waktu masa depan.',
    examples: [
      { before: 'By next month, they ', focus: 'will have moved', after: ' to a new office.' },
      { before: 'He ', focus: 'will have saved', after: ' enough money by June.' },
    ],
  },
] as const;

const CORE_PATTERNS = [
  {
    title: 'Positive',
    points: ['S + will have + V3'],
    examples: [
      { before: 'We ', focus: 'will have completed', after: ' the task by tonight.' },
      { before: 'She ', focus: 'will have arrived', after: ' by 8.' },
    ],
  },
  {
    title: 'Negative',
    points: ['S + will not have + V3'],
    examples: [
      { before: 'I ', focus: 'will not have finished', after: ' by 5.' },
      { before: 'They ', focus: 'will not have started', after: ' the meeting by then.' },
    ],
  },
  {
    title: 'Question',
    points: ['Will + S + have + V3?'],
    examples: [
      { before: '', focus: 'Will you have finished', after: ' by Friday?' },
      { before: '', focus: 'Will she have left', after: ' before we arrive?' },
    ],
  },
] as const;

const TIME_MARKERS = [
  {
    marker: 'by + time',
    use: 'menunjukkan batas waktu penyelesaian di masa depan.',
    example: { before: 'I ', focus: 'will have finished', after: ' this by Friday.' },
  },
  {
    marker: 'by the time',
    use: 'menunjukkan saat kejadian lain terjadi, aksi utama sudah selesai.',
    example: { before: 'By the time you arrive, we ', focus: 'will have eaten', after: '.' },
  },
  {
    marker: 'before',
    use: 'menunjukkan aksi selesai lebih dulu sebelum aksi/waktu lain.',
    example: { before: 'She ', focus: 'will have left', after: ' before noon.' },
  },
  {
    marker: 'by next week',
    use: 'deadline mingguan untuk hasil yang harus tercapai.',
    example: { before: 'They ', focus: 'will have completed', after: ' the project by next week.' },
  },
  {
    marker: 'by tomorrow morning',
    use: 'deadline rinci sampai waktu pagi esok.',
    example: { before: 'He ', focus: 'will have submitted', after: ' the form by tomorrow morning.' },
  },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'I will have finish this by Friday.', correct: 'I will have finished this by Friday.' },
  { wrong: 'She will has completed the draft.', correct: 'She will have completed the draft.' },
  { wrong: 'Will you have finish by noon?', correct: 'Will you have finished by noon?' },
] as const;

export default function FuturePerfectPage() {
  return (
    <main className="fp-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="fp-shell gr-topic-shell">
        <header className="fp-header">
          <h1 className="fp-title">Future Perfect (Completion Before a Future Point)</h1>
          <p className="fp-subtitle">
            Memahami Future Perfect untuk target penyelesaian sebelum waktu tertentu di masa depan.
          </p>
        </header>

        <section className="fp-block">
          <h2 className="fp-block-title">Konsep</h2>
          <p className="fp-text">
            Future Perfect memakai pola <strong>will have + V3</strong> untuk menunjukkan bahwa suatu
            aksi akan sudah selesai sebelum titik waktu masa depan.
          </p>
        </section>

        <section className="fp-block">
          <h2 className="fp-block-title">When to Use</h2>
          <div className="fp-grid fp-grid-one-col">
            {USE_CASES.map((item) => (
              <details key={item.title} className="fp-card fp-card-accordion">
                <summary className="fp-card-summary">
                  <h3 className="fp-card-title">{item.title}</h3>
                  <span className="fp-card-caret" aria-hidden="true" />
                </summary>
                <div className="fp-card-body">
                  <p className="fp-card-desc">{item.desc}</p>
                  <ul className="fp-list">
                    {item.examples.map((ex) => (
                      <li key={`${item.title}-${ex.before}-${ex.focus}-${ex.after}`}>
                        {ex.before}
                        <span className="fp-highlight">{ex.focus}</span>
                        {ex.after}
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="fp-block">
          <h2 className="fp-block-title">Core Patterns</h2>
          <div className="fp-grid fp-grid-one-col">
            {CORE_PATTERNS.map((item) => (
              <details key={item.title} className="fp-card fp-card-accordion">
                <summary className="fp-card-summary">
                  <h3 className="fp-card-title">{item.title}</h3>
                  <span className="fp-card-caret" aria-hidden="true" />
                </summary>
                <div className="fp-card-body">
                  <ul className="fp-list">
                    {item.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  <ul className="fp-list">
                    {item.examples.map((ex) => (
                      <li key={`${item.title}-${ex.before}-${ex.focus}-${ex.after}`}>
                        {ex.before}
                        <span className="fp-highlight">{ex.focus}</span>
                        {ex.after}
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="fp-block">
          <h2 className="fp-block-title">Common Time Markers</h2>
          <div className="fp-marker-grid">
            {TIME_MARKERS.map((item) => (
              <article key={item.marker} className="fp-marker-card">
                <p className="fp-marker-head">
                  <span className="fp-chip">{item.marker}</span>
                </p>
                <p className="fp-marker-use">{item.use}</p>
                <p className="fp-marker-example">
                  Contoh: {item.example.before}
                  <span className="fp-highlight">{item.example.focus}</span>
                  {item.example.after}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="fp-block">
          <h2 className="fp-block-title">Kesalahan Umum</h2>
          <div className="fp-fix-list">
            {COMMON_MISTAKES.map((item) => (
              <article key={item.wrong} className="fp-fix-card">
                <p className="fp-fix-wrong">Salah: {item.wrong}</p>
                <p className="fp-fix-correct">Benar: {item.correct}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="fp-block">
          <h2 className="fp-block-title">Catatan Penting:</h2>
          <ul className="fp-list">
            <li>Fokus Future Perfect adalah hasil selesai sebelum deadline masa depan.</li>
            <li>Gunakan V3 (past participle), bukan V1 atau V2.</li>
            <li>Sering dipakai dengan penanda waktu by/before.</li>
            <li>
              Future Perfect (selesai sebelum titik waktu):{' '}
              <span className="fp-highlight">I will have finished by 8.</span>
            </li>
            <li>
              Future Continuous (sedang berlangsung di titik waktu):{' '}
              <span className="fp-highlight">I will be working at 8.</span>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
