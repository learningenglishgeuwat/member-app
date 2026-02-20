import BackButton from '../../../../../components/BackButton';
import './conjunctions-and-but-or-because-so.css';
import '../../topic-layout.css';

const CONJUNCTIONS = [
  {
    title: 'and (tambahan)',
    desc: 'Menggabungkan dua ide yang sejalan.',
    examples: [
      { before: 'I like tea ', focus: 'and', after: ' coffee.' },
      { before: 'She opened the book ', focus: 'and', after: ' started reading.' },
    ],
  },
  {
    title: 'but (kontras)',
    desc: 'Menunjukkan pertentangan antara dua ide.',
    examples: [
      { before: 'I was tired, ', focus: 'but', after: ' I finished the task.' },
      { before: 'He is young, ', focus: 'but', after: ' very disciplined.' },
    ],
  },
  {
    title: 'or (pilihan)',
    desc: 'Menawarkan alternatif/pilihan.',
    examples: [
      { before: 'Do you want tea ', focus: 'or', after: ' coffee?' },
      { before: 'We can go now ', focus: 'or', after: ' wait until tomorrow.' },
    ],
  },
  {
    title: 'because (sebab)',
    desc: 'Menjelaskan alasan.',
    examples: [
      { before: 'I stayed home ', focus: 'because', after: ' it was raining.' },
      { before: 'She smiled ', focus: 'because', after: ' she was happy.' },
    ],
  },
  {
    title: 'so (akibat)',
    desc: 'Menunjukkan hasil/konsekuensi.',
    examples: [
      { before: 'It was raining, ', focus: 'so', after: ' I stayed home.' },
      { before: 'He studied hard, ', focus: 'so', after: ' he passed the exam.' },
    ],
  },
] as const;

const PUNCTUATION_RULES = [
  {
    rule: 'Jika menggabungkan dua klausa lengkap dengan but/so, gunakan koma sebelum conjunction.',
    example: { before: 'I was tired, ', focus: 'but', after: ' I kept working.' },
  },
  {
    rule: 'Jika because di tengah kalimat, biasanya tidak perlu koma sebelum because.',
    example: { before: 'I stayed home ', focus: 'because', after: ' it was raining.' },
  },
  {
    rule: 'Jika klausa because di awal, pakai koma setelah klausa tersebut.',
    example: { before: 'Because it was raining, ', focus: 'I stayed home', after: '.' },
  },
] as const;

const BECAUSE_SO_CONTRAST = [
  {
    label: 'Sebab (because)',
    example: { before: 'I stayed home ', focus: 'because', after: ' it was raining.' },
  },
  {
    label: 'Akibat (so)',
    example: { before: 'It was raining, ', focus: 'so', after: ' I stayed home.' },
  },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'Because I was tired, so I slept.', correct: 'Because I was tired, I slept.' },
  { wrong: 'I was tired because so I slept.', correct: 'I was tired, so I slept.' },
  { wrong: 'She likes tea but coffee.', correct: 'She likes tea and coffee.' },
] as const;

export default function ConjunctionsPage() {
  return (
    <main className="conj-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="conj-shell gr-topic-shell">
        <header className="conj-header">
          <h1 className="conj-title">Conjunctions (and, but, or, because, so)</h1>
          <p className="conj-subtitle">
            Memahami conjunction dasar untuk menghubungkan ide agar kalimat lebih padu dan logis.
          </p>
        </header>

        <section className="conj-block">
          <h2 className="conj-block-title">Konsep</h2>
          <p className="conj-text">
            Conjunction menghubungkan kata, frasa, atau klausa. Dengan conjunction yang tepat, hubungan
            makna antargagasan jadi jelas.
          </p>
        </section>

        <section className="conj-block">
          <h2 className="conj-block-title">Core Conjunctions</h2>
          <div className="conj-grid conj-grid-one-col">
            {CONJUNCTIONS.map((item) => (
              <details key={item.title} className="conj-card conj-card-accordion">
                <summary className="conj-card-summary">
                  <h3 className="conj-card-title">{item.title}</h3>
                  <span className="conj-card-caret" aria-hidden="true" />
                </summary>
                <div className="conj-card-body">
                  <p className="conj-card-desc">{item.desc}</p>
                  <ul className="conj-list">
                    {item.examples.map((ex) => (
                      <li key={`${item.title}-${ex.before}-${ex.focus}-${ex.after}`}>
                        {ex.before}
                        <span className="conj-highlight">{ex.focus}</span>
                        {ex.after}
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="conj-block">
          <h2 className="conj-block-title">Punctuation Rules</h2>
          <div className="conj-grid conj-grid-one-col">
            {PUNCTUATION_RULES.map((item) => (
              <article key={item.rule} className="conj-card">
                <div className="conj-card-body">
                  <p className="conj-text">{item.rule}</p>
                  <p className="conj-text">
                    Contoh: {item.example.before}
                    <span className="conj-highlight">{item.example.focus}</span>
                    {item.example.after}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="conj-block">
          <h2 className="conj-block-title">because vs so</h2>
          <div className="conj-grid conj-grid-one-col">
            {BECAUSE_SO_CONTRAST.map((item) => (
              <article key={item.label} className="conj-card">
                <div className="conj-card-body">
                  <h3 className="conj-card-title">{item.label}</h3>
                  <p className="conj-text">
                    {item.example.before}
                    <span className="conj-highlight">{item.example.focus}</span>
                    {item.example.after}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="conj-block">
          <h2 className="conj-block-title">Kesalahan Umum</h2>
          <div className="conj-fix-list">
            {COMMON_MISTAKES.map((item) => (
              <article key={item.wrong} className="conj-fix-card">
                <p className="conj-fix-wrong">Salah: {item.wrong}</p>
                <p className="conj-fix-correct">Benar: {item.correct}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="conj-block">
          <h2 className="conj-block-title">Catatan Penting:</h2>
          <ul className="conj-list">
            <li>because = sebab, so = akibat. Hindari menumpuk keduanya dalam satu pola yang sama.</li>
            <li>Pilih conjunction sesuai relasi makna: tambahan, kontras, pilihan, sebab, akibat.</li>
            <li>Perhatikan tanda baca jika menggabungkan dua klausa lengkap.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
