import BackButton from '../../../../../components/BackButton';
import './present-perfect-continuous-duration-from-past-to-present.css';
import '../../topic-layout.css';

const USE_CASES = [
  {
    title: 'Duration Until Now',
    desc: 'Aksi dimulai di masa lalu dan masih berlangsung sampai sekarang.',
    examples: [
      { before: 'I ', focus: 'have been studying', after: ' for two hours.' },
      { before: 'She ', focus: 'has been working', after: ' since 8 a.m.' },
    ],
  },
  {
    title: 'Recent Ongoing Activity with Visible Effect',
    desc: 'Aktivitas baru saja berlangsung dan efeknya terlihat sekarang.',
    examples: [
      { before: 'He is tired because he ', focus: 'has been running', after: '.' },
      { before: 'The floor is wet because it ', focus: 'has been raining', after: '.' },
    ],
  },
] as const;

const CORE_PATTERNS = [
  {
    title: 'Positive',
    points: ['S + have/has + been + V-ing'],
    examples: [
      { before: 'They ', focus: 'have been practicing', after: ' all week.' },
      { before: 'She ', focus: 'has been learning', after: ' English.' },
    ],
  },
  {
    title: 'Negative',
    points: ['S + have/has + not + been + V-ing'],
    examples: [
      { before: 'I ', focus: 'have not been sleeping', after: ' well.' },
      { before: 'He ', focus: 'has not been attending', after: ' class regularly.' },
    ],
  },
  {
    title: 'Question',
    points: ['Have/Has + S + been + V-ing?'],
    examples: [
      { before: '', focus: 'Have you been waiting', after: ' long?' },
      { before: '', focus: 'Has she been working', after: ' here since 2020?' },
    ],
  },
] as const;

const TIME_MARKERS = [
  {
    marker: 'for',
    use: 'dipakai untuk menyatakan durasi (berapa lama).',
    example: { before: 'They have been studying ', focus: 'for three hours', after: '.' },
  },
  {
    marker: 'since',
    use: 'dipakai untuk titik awal waktu.',
    example: { before: 'She has been working here ', focus: 'since 2021', after: '.' },
  },
  {
    marker: 'lately',
    use: 'menunjukkan periode belakangan ini.',
    example: { before: 'I ', focus: 'have been feeling', after: ' tired lately.' },
  },
  {
    marker: 'recently',
    use: 'menunjukkan aktivitas yang sering terjadi baru-baru ini.',
    example: { before: 'He ', focus: 'has been reading', after: ' more recently.' },
  },
  {
    marker: 'all day',
    use: 'menekankan proses berkelanjutan selama satu hari.',
    example: { before: 'It ', focus: 'has been raining', after: ' all day.' },
  },
  {
    marker: 'all week',
    use: 'menekankan proses berkelanjutan selama satu minggu.',
    example: { before: 'We ', focus: 'have been preparing', after: ' for the test all week.' },
  },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'I have been study for two hours.', correct: 'I have been studying for two hours.' },
  { wrong: 'She has being working since morning.', correct: 'She has been working since morning.' },
  { wrong: 'Have you been wait long?', correct: 'Have you been waiting long?' },
] as const;

export default function PresentPerfectContinuousPage() {
  return (
    <main className="ppc-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="ppc-shell gr-topic-shell">
        <header className="ppc-header">
          <h1 className="ppc-title">Present Perfect Continuous (Duration from Past to Present)</h1>
          <p className="ppc-subtitle">
            Memahami penggunaan Present Perfect Continuous untuk proses berkelanjutan dari masa lalu ke sekarang.
          </p>
        </header>

        <section className="ppc-block">
          <h2 className="ppc-block-title">Konsep</h2>
          <p className="ppc-text">
            Present Perfect Continuous memakai pola <strong>have/has + been + V-ing</strong> untuk
            menekankan durasi/proses yang berjalan dari masa lalu hingga sekarang.
          </p>
        </section>

        <section className="ppc-block">
          <h2 className="ppc-block-title">When to Use</h2>
          <div className="ppc-grid ppc-grid-one-col">
            {USE_CASES.map((item) => (
              <details key={item.title} className="ppc-card ppc-card-accordion">
                <summary className="ppc-card-summary">
                  <h3 className="ppc-card-title">{item.title}</h3>
                  <span className="ppc-card-caret" aria-hidden="true" />
                </summary>
                <div className="ppc-card-body">
                  <p className="ppc-card-desc">{item.desc}</p>
                  <ul className="ppc-list">
                    {item.examples.map((ex) => (
                      <li key={`${item.title}-${ex.before}-${ex.focus}-${ex.after}`}>
                        {ex.before}
                        <span className="ppc-highlight">{ex.focus}</span>
                        {ex.after}
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="ppc-block">
          <h2 className="ppc-block-title">Core Patterns</h2>
          <div className="ppc-grid ppc-grid-one-col">
            {CORE_PATTERNS.map((item) => (
              <details key={item.title} className="ppc-card ppc-card-accordion">
                <summary className="ppc-card-summary">
                  <h3 className="ppc-card-title">{item.title}</h3>
                  <span className="ppc-card-caret" aria-hidden="true" />
                </summary>
                <div className="ppc-card-body">
                  <ul className="ppc-list">
                    {item.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  <ul className="ppc-list">
                    {item.examples.map((ex) => (
                      <li key={`${item.title}-${ex.before}-${ex.focus}-${ex.after}`}>
                        {ex.before}
                        <span className="ppc-highlight">{ex.focus}</span>
                        {ex.after}
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="ppc-block">
          <h2 className="ppc-block-title">Common Time Markers</h2>
          <div className="ppc-marker-grid">
            {TIME_MARKERS.map((item) => (
              <article key={item.marker} className="ppc-marker-card">
                <p className="ppc-marker-head">
                  <span className="ppc-chip">{item.marker}</span>
                </p>
                <p className="ppc-marker-use">{item.use}</p>
                <p className="ppc-marker-example">
                  Contoh: {item.example.before}
                  <span className="ppc-highlight">{item.example.focus}</span>
                  {item.example.after}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="ppc-block">
          <h2 className="ppc-block-title">Kesalahan Umum</h2>
          <div className="ppc-fix-list">
            {COMMON_MISTAKES.map((item) => (
              <article key={item.wrong} className="ppc-fix-card">
                <p className="ppc-fix-wrong">Salah: {item.wrong}</p>
                <p className="ppc-fix-correct">Benar: {item.correct}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="ppc-block">
          <h2 className="ppc-block-title">Catatan Penting:</h2>
          <ul className="ppc-list">
            <li>for dipakai untuk durasi, since dipakai untuk titik awal.</li>
            <li>Bentuk ini menekankan proses; jika fokus hasil, sering lebih tepat Present Perfect biasa.</li>
            <li>Tidak semua verb cocok untuk continuous (terutama stative verbs tertentu).</li>
            <li>
              Fokus proses: <span className="ppc-highlight">I have been reading for two hours.</span>
            </li>
            <li>
              Fokus hasil: <span className="ppc-highlight">I have read three chapters.</span>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
