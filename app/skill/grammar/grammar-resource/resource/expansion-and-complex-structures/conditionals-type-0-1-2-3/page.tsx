import BackButton from '../../../../../components/BackButton';
import './conditionals-type-0-1-2-3.css';
import '../../topic-layout.css';

const CONDITIONAL_TYPES = [
  {
    title: 'Type 0 (fakta umum)',
    pattern: 'If + present simple, present simple',
    usage: 'Untuk fakta umum, aturan ilmiah, kebiasaan yang selalu benar.',
    examples: ['If you heat water to 100°C, it boils.', 'If I drink coffee at night, I can\'t sleep.'],
  },
  {
    title: 'Type 1 (kemungkinan nyata di masa depan)',
    pattern: 'If + present simple, will + V1',
    usage: 'Untuk kemungkinan realistis yang bisa terjadi. Main clause juga bisa memakai can/may/must sesuai makna.',
    examples: [
      'If it rains, we will stay at home.',
      'If you study hard, you will pass the exam.',
      'If you finish early, you can join us.',
    ],
  },
  {
    title: 'Type 2 (hipotetis sekarang)',
    pattern: 'If + past simple, would + V1',
    usage: 'Untuk situasi imajiner/tidak nyata pada masa sekarang.',
    examples: ['If I were you, I would apologize.', 'If I had more time, I would learn French.'],
  },
  {
    title: 'Type 3 (penyesalan masa lalu)',
    pattern: 'If + past perfect, would have + V3',
    usage: 'Untuk membahas hal yang tidak terjadi di masa lalu.',
    examples: ['If she had left earlier, she would have caught the train.', 'If I had known, I would have helped you.'],
  },
] as const;

const QUICK_COMPARE = [
  'Type 0: fakta umum / always true.',
  'Type 1: kemungkinan nyata di masa depan.',
  'Type 2: situasi imajiner saat ini (kurang nyata).',
  'Type 3: penyesalan / hal yang tidak terjadi di masa lalu.',
] as const;

const COMMON_MISTAKES = [
  { wrong: 'If it will rain, we will cancel.', correct: 'If it rains, we will cancel.' },
  { wrong: 'If I would be rich, I would travel.', correct: 'If I were rich, I would travel.' },
  { wrong: 'If he studied, he would have passed.', correct: 'If he had studied, he would have passed.' },
] as const;

export default function ConditionalsPage() {
  return (
    <main className="ct-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="ct-shell gr-topic-shell">
        <header className="ct-header">
          <h1 className="ct-title">Conditionals Type 0/1/2/3</h1>
          <p className="ct-subtitle">
            Memahami conditional untuk membedakan fakta umum, kemungkinan nyata, situasi hipotetis,
            dan penyesalan masa lalu.
          </p>
        </header>

        <section className="ct-block">
          <h2 className="ct-block-title">Konsep</h2>
          <p className="ct-text">
            Conditional sentence terdiri dari <strong>if-clause</strong> (kondisi) dan{' '}
            <strong>main clause</strong> (hasil). Pemilihan type tergantung waktu dan realitas situasi.
          </p>
          <ul className="ct-list">
            <li>If-clause bisa di depan atau di belakang main clause.</li>
            <li>Jika if-clause di depan, gunakan comma. Jika di belakang, tidak perlu comma.</li>
            <li>Contoh: If it rains, we stay home. / We stay home if it rains.</li>
          </ul>
        </section>

        <section className="ct-block">
          <h2 className="ct-block-title">Perbandingan Singkat Type</h2>
          <ul className="ct-list">
            {QUICK_COMPARE.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="ct-block">
          <h2 className="ct-block-title">Type 0 / 1 / 2 / 3</h2>
          <div className="ct-grid ct-grid-one-col">
            {CONDITIONAL_TYPES.map((item) => (
              <details key={item.title} className="ct-card ct-card-accordion">
                <summary className="ct-card-summary">
                  <h3 className="ct-card-title">{item.title}</h3>
                  <span className="ct-card-caret" aria-hidden="true" />
                </summary>
                <div className="ct-card-body">
                  <p className="ct-card-desc">
                    Pola: <strong>{item.pattern}</strong>
                  </p>
                  <p className="ct-card-desc">Fungsi: {item.usage}</p>
                  <ul className="ct-list">
                    {item.examples.map((example) => (
                      <li key={example}>{example}</li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="ct-block">
          <h2 className="ct-block-title">Kesalahan Umum</h2>
          <div className="ct-fix-list">
            {COMMON_MISTAKES.map((item) => (
              <article key={item.wrong} className="ct-fix-card">
                <p className="ct-fix-wrong">Salah: {item.wrong}</p>
                <p className="ct-fix-correct">Benar: {item.correct}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="ct-block">
          <h2 className="ct-block-title">Catatan Penting:</h2>
          <ul className="ct-list">
            <li>Type 1: jangan pakai will setelah if.</li>
            <li>Type 1: selain will, main clause bisa pakai can/may/must sesuai maksud.</li>
            <li>Type 2: gunakan were untuk semua subject dalam gaya formal (If I were...).</li>
            <li>Type 3: gunakan past perfect di if-clause dan would have + V3 di hasil.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
