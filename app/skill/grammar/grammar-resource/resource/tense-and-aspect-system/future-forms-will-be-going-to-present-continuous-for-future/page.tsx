import BackButton from '../../../../../components/BackButton';
import './future-forms-will-be-going-to-present-continuous-for-future.css';
import '../../topic-layout.css';

const FUTURE_TYPES = [
  {
    title: 'will',
    desc: 'Untuk keputusan spontan, prediksi umum, atau janji.',
    pattern: 'Subject + will + V1',
    points: [
      'keputusan saat berbicara: I will help you.',
      'prediksi/opini: I think it will rain.',
      'janji/tawaran: I will call you later.',
    ],
    examples: [
      { before: 'I forgot my notes. I ', focus: 'will get', after: ' them now.' },
      { before: 'I think she ', focus: 'will pass', after: ' the exam.' },
    ],
  },
  {
    title: 'be going to',
    desc: 'Untuk rencana yang sudah ada atau prediksi berdasarkan bukti.',
    pattern: 'Subject + be (am/is/are) + going to + V1',
    points: [
      'niat/rencana: I am going to study tonight.',
      'bukti sekarang: Look at the clouds. It is going to rain.',
    ],
    examples: [
      { before: 'We ', focus: 'are going to start', after: ' a new project.' },
      { before: 'It ', focus: 'is going to be', after: ' a busy day.' },
    ],
  },
  {
    title: 'present continuous for future',
    desc: 'Untuk arrangement/jadwal personal yang sudah disepakati.',
    pattern: 'Subject + be (am/is/are) + V-ing + time expression',
    points: [
      'biasanya ada waktu jelas: tonight, tomorrow, next week',
      'sudah ada kesepakatan/booking/arrangement',
    ],
    examples: [
      { before: 'We ', focus: 'are meeting', after: ' at 7 tonight.' },
      { before: 'I ', focus: 'am seeing', after: ' my doctor tomorrow.' },
    ],
  },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'I will going to study tonight.', correct: 'I am going to study tonight.' },
  { wrong: 'We will meeting at 8.', correct: 'We are meeting at 8.' },
  { wrong: 'Look at the sky! It will going to rain.', correct: 'Look at the sky! It is going to rain.' },
] as const;

export default function FutureFormsPage() {
  return (
    <main className="ff-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="ff-shell gr-topic-shell">
        <header className="ff-header">
          <h1 className="ff-title">Future Forms (will, be going to, present continuous for future)</h1>
          <p className="ff-subtitle">
            Memahami pemilihan bentuk future berdasarkan niat, keputusan spontan, prediksi, dan arrangement.
          </p>
        </header>

        <section className="ff-block">
          <h2 className="ff-block-title">Konsep</h2>
          <p className="ff-text">
            Bahasa Inggris tidak punya satu bentuk future tunggal. Kita memilih bentuk yang tepat sesuai
            konteks makna: <strong>will</strong>, <strong>be going to</strong>, atau{' '}
            <strong>present continuous</strong>.
          </p>
        </section>

        <section className="ff-block">
          <h2 className="ff-block-title">Future Forms Overview</h2>
          <div className="ff-grid ff-grid-one-col">
            {FUTURE_TYPES.map((item) => (
              <details key={item.title} className="ff-card ff-card-accordion">
                <summary className="ff-card-summary">
                  <h3 className="ff-card-title">{item.title}</h3>
                  <span className="ff-card-caret" aria-hidden="true" />
                </summary>
                <div className="ff-card-body">
                  <p className="ff-card-desc">{item.desc}</p>
                  <p className="ff-pattern">
                    Pola: <span className="ff-highlight">{item.pattern}</span>
                  </p>
                  <ul className="ff-list">
                    {item.points.map((p) => (
                      <li key={p}>{p}</li>
                    ))}
                  </ul>
                  <ul className="ff-list">
                    {item.examples.map((ex) => (
                      <li key={`${ex.before}${ex.focus}${ex.after}`}>
                        {ex.before}
                        <span className="ff-highlight">{ex.focus}</span>
                        {ex.after}
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="ff-block">
          <h2 className="ff-block-title">Kesalahan Umum</h2>
          <div className="ff-fix-list">
            {COMMON_MISTAKES.map((item) => (
              <article key={item.wrong} className="ff-fix-card">
                <p className="ff-fix-wrong">Salah: {item.wrong}</p>
                <p className="ff-fix-correct">Benar: {item.correct}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="ff-block">
          <h2 className="ff-block-title">Catatan Penting:</h2>
          <ul className="ff-list">
            <li>Gunakan satu bentuk future yang sesuai konteks, jangan ditumpuk dalam satu pola.</li>
            <li>Untuk rencana fix dengan waktu jelas, present continuous sangat natural.</li>
            <li>Untuk keputusan spontan saat bicara, will biasanya paling tepat.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
