import BackButton from '../../../../../components/BackButton';
import './mixed-conditionals-past-present-and-present-past.css';
import '../../topic-layout.css';

const MIXED_TYPES = [
  {
    title: 'Past -> Present',
    pattern: 'If + past perfect, would/could/might + V1 (now)',
    usage: 'Penyebab di masa lalu, dampak terasa sekarang.',
    examples: [
      'If I had studied medicine, I would be a doctor now.',
      'If she had slept earlier, she would feel better today.',
      'If we had left earlier, we could be there now.',
    ],
  },
  {
    title: 'Present -> Past',
    pattern: 'If + past simple, would/could/might have + V3',
    usage: 'Kondisi sekarang berbeda, akibatnya berbeda di masa lalu.',
    examples: [
      'If I were more organized, I would have finished the project on time.',
      'If he were more careful, he would not have made that mistake yesterday.',
      'If she were braver, she might have applied for that job last year.',
    ],
  },
] as const;

const WHEN_TO_USE = [
  'Saat sebab dan akibat berada di waktu yang berbeda.',
  'Saat ingin menjelaskan hubungan lintas waktu (past cause -> present result).',
  'Saat mengevaluasi kondisi sekarang yang memengaruhi hasil masa lalu.',
] as const;

const MIXED_VS_BASIC = [
  'Type 2 biasa: kondisi sekarang -> hasil sekarang/masa depan.',
  'Type 3 biasa: kondisi masa lalu -> hasil masa lalu.',
  'Mixed: kondisi dan hasil berada di waktu berbeda (past->present atau present->past).',
] as const;

const INVERSION_PATTERNS = [
  {
    title: 'Past -> Present inversion',
    example: 'Had I studied medicine, I would be a doctor now.',
  },
  {
    title: 'Type 3 style inversion (relevan untuk mixed context)',
    example: 'Had he left earlier, he would be here now.',
  },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'If I had studied harder, I will pass now.', correct: 'If I had studied harder, I would pass now.' },
  { wrong: 'If I were richer, I would bought a car.', correct: 'If I were richer, I would have bought a car.' },
  { wrong: 'If she had left early, she would have be here now.', correct: 'If she had left early, she would be here now.' },
] as const;

export default function MixedConditionalsPage() {
  return (
    <main className="mc-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="mc-shell gr-topic-shell">
        <header className="mc-header">
          <h1 className="mc-title">Mixed Conditionals (Past-Present and Present-Past)</h1>
          <p className="mc-subtitle">
            Mixed conditionals dipakai untuk menghubungkan sebab-akibat yang terjadi pada waktu yang
            berbeda.
          </p>
        </header>

        <section className="mc-block">
          <h2 className="mc-block-title">Konsep</h2>
          <p className="mc-text">
            Berbeda dari conditional murni, mixed conditional menggabungkan pola waktu berbeda antara
            if-clause dan main clause.
          </p>
        </section>

        <section className="mc-block">
          <h2 className="mc-block-title">Tipe Mixed Conditional</h2>
          <div className="mc-grid mc-grid-one-col">
            {MIXED_TYPES.map((item) => (
              <details key={item.title} className="mc-card mc-card-accordion">
                <summary className="mc-card-summary">
                  <h3 className="mc-card-title">{item.title}</h3>
                  <span className="mc-card-caret" aria-hidden="true" />
                </summary>
                <div className="mc-card-body">
                  <p className="mc-card-desc">
                    Pola: <strong>{item.pattern}</strong>
                  </p>
                  <p className="mc-card-desc">Fungsi: {item.usage}</p>
                  <ul className="mc-list">
                    {item.examples.map((example) => (
                      <li key={example}>{example}</li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="mc-block">
          <h2 className="mc-block-title">Kapan Dipakai</h2>
          <ul className="mc-list">
            {WHEN_TO_USE.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mc-block">
          <h2 className="mc-block-title">Mixed vs Conditional Biasa</h2>
          <ul className="mc-list">
            {MIXED_VS_BASIC.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="mc-block">
          <h2 className="mc-block-title">Inversion (Formal, Opsional)</h2>
          <p className="mc-text">
            Dalam gaya formal, <strong>if</strong> bisa dihilangkan dengan inversi <strong>had + subject</strong>.
          </p>
          <ul className="mc-list">
            {INVERSION_PATTERNS.map((item) => (
              <li key={item.title}>
                {item.title}: {item.example}
              </li>
            ))}
          </ul>
        </section>

        <section className="mc-block">
          <h2 className="mc-block-title">Kesalahan Umum</h2>
          <div className="mc-fix-list">
            {COMMON_MISTAKES.map((item) => (
              <article key={item.wrong} className="mc-fix-card">
                <p className="mc-fix-wrong">Salah: {item.wrong}</p>
                <p className="mc-fix-correct">Benar: {item.correct}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mc-block">
          <h2 className="mc-block-title">Catatan Penting:</h2>
          <ul className="mc-list">
            <li>Past -&gt; Present: if-clause pakai past perfect, hasil pakai would/could/might + V1.</li>
            <li>Present -&gt; Past: if-clause pakai past simple, hasil pakai would/could/might have + V3.</li>
            <li>Fokus pada logika waktu sebab dan akibat, bukan hanya hafalan rumus.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
