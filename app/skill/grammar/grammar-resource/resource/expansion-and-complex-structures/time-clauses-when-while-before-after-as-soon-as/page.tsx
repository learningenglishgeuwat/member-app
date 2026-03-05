import BackButton from '../../../../../components/BackButton';
import './time-clauses-when-while-before-after-as-soon-as.css';
import '../../topic-layout.css';

const TIME_CONNECTORS = [
  {
    title: 'when',
    desc: 'Umumnya dipakai untuk titik waktu/kejadian spesifik; bisa untuk aksi berurutan atau kejadian yang menyela.',
    examples: ['When I arrive home, I call my mother.', 'Call me when you finish.'],
  },
  {
    title: 'while',
    desc: 'Menunjukkan dua aksi yang berlangsung bersamaan, biasanya aksi duratif (sering berbentuk continuous).',
    examples: ['While I was cooking, he was cleaning.', 'She listens to music while she studies.'],
  },
  {
    title: 'before',
    desc: 'Menghubungkan aksi yang terjadi lebih dulu dengan aksi yang terjadi sesudahnya.',
    examples: ['Finish your homework before you play games.', 'I had eaten before they arrived.'],
  },
  {
    title: 'after',
    desc: 'Menghubungkan aksi yang terjadi sesudah aksi lain selesai.',
    examples: ['After he graduated, he moved to Jakarta.', 'We went out after it stopped raining.'],
  },
  {
    title: 'as soon as',
    desc: 'Menunjukkan aksi yang terjadi segera setelah aksi lain selesai.',
    examples: ['As soon as I get the news, I will tell you.', 'She left as soon as the meeting ended.'],
  },
] as const;

const PATTERNS = [
  {
    title: 'Time clause di depan',
    points: ['Time clause + comma + main clause'],
    examples: ['When the class starts, everyone becomes quiet.'],
  },
  {
    title: 'Time clause di belakang',
    points: ['Main clause + time clause'],
    examples: ['Everyone becomes quiet when the class starts.'],
  },
  {
    title: 'Catatan tense untuk future',
    points: [
      'Dalam time clause, gunakan present simple untuk makna masa depan.',
      'Jangan pakai will langsung setelah when/after/before/as soon as.',
    ],
    examples: ['I will call you when I arrive. (bukan: when I will arrive)'],
  },
  {
    title: 'when vs while (ringkas)',
    points: [
      'when: fokus pada titik waktu/kejadian tertentu.',
      'while: fokus pada proses/aksi yang sedang berlangsung.',
    ],
    examples: [
      'When the phone rang, I was taking a shower.',
      'While I was taking a shower, the phone rang.',
    ],
  },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'I will call you when I will arrive.', correct: 'I will call you when I arrive.' },
  { wrong: 'After I will finish, I go home.', correct: 'After I finish, I will go home.' },
  { wrong: 'While I was study, he was cooking dinner.', correct: 'While I was studying, he was cooking dinner.' },
] as const;

export default function TimeClausesPage() {
  return (
    <main className="tc-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="tc-shell gr-topic-shell">
        <header className="tc-header">
          <h1 className="tc-title">Time Clauses (when, while, before, after, as soon as)</h1>
          <p className="tc-subtitle">
            Time clauses membantu menyusun urutan waktu dan hubungan antar kejadian secara jelas.
          </p>
        </header>

        <section className="tc-block">
          <h2 className="tc-block-title">Konsep</h2>
          <p className="tc-text">
            Time clause adalah anak klausa yang memberi informasi waktu. Biasanya diawali connector
            seperti <strong>when, while, before, after,</strong> dan <strong>as soon as</strong>.
          </p>
        </section>

        <section className="tc-block">
          <h2 className="tc-block-title">Time Connectors</h2>
          <div className="tc-grid tc-grid-one-col">
            {TIME_CONNECTORS.map((item) => (
              <details key={item.title} className="tc-card tc-card-accordion">
                <summary className="tc-card-summary">
                  <h3 className="tc-card-title">{item.title}</h3>
                  <span className="tc-card-caret" aria-hidden="true" />
                </summary>
                <div className="tc-card-body">
                  <p className="tc-card-desc">{item.desc}</p>
                  <ul className="tc-list">
                    {item.examples.map((example) => (
                      <li key={example}>{example}</li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="tc-block">
          <h2 className="tc-block-title">Pola Kalimat</h2>
          <div className="tc-grid tc-grid-one-col">
            {PATTERNS.map((item) => (
              <details key={item.title} className="tc-card tc-card-accordion">
                <summary className="tc-card-summary">
                  <h3 className="tc-card-title">{item.title}</h3>
                  <span className="tc-card-caret" aria-hidden="true" />
                </summary>
                <div className="tc-card-body">
                  <ul className="tc-list">
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  <ul className="tc-list">
                    {item.examples.map((example) => (
                      <li key={example}>{example}</li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="tc-block">
          <h2 className="tc-block-title">Kesalahan Umum</h2>
          <div className="tc-fix-list">
            {COMMON_MISTAKES.map((item) => (
              <article key={item.wrong} className="tc-fix-card">
                <p className="tc-fix-wrong">Salah: {item.wrong}</p>
                <p className="tc-fix-correct">Benar: {item.correct}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="tc-block">
          <h2 className="tc-block-title">Catatan Penting:</h2>
          <ul className="tc-list">
            <li>Gunakan comma jika time clause diletakkan di awal kalimat.</li>
            <li>Untuk future meaning, time clause tetap pakai present form.</li>
            <li>while lebih cocok untuk aksi duratif (continuous action).</li>
            <li>Posisi time clause bisa di depan atau belakang tanpa mengubah aturan tense dasarnya.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
