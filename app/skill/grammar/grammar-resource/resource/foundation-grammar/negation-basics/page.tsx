import BackButton from '../../../../../components/BackButton';
import './negation-basics.css';
import '../../topic-layout.css';

const CORE_ITEMS = [
  { title: 'not + auxiliary', desc: 'Gunakan not setelah be/modal/auxiliary.', examples: ['She is not at home.', 'We cannot stay long.'] },
  { title: 'do-support', desc: 'Jika tidak ada auxiliary, gunakan do/does/did + not + V1.', examples: ['I do not understand.', 'He does not work here.'] },
  { title: 'no dan never', desc: 'no untuk noun phrase; never untuk frekuensi nol.', examples: ['There is no sugar.', 'She never arrives late.'] },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'She not like tea.', correct: 'She does not like tea.' },
  { wrong: 'I do not have no time.', correct: 'I do not have any time.' },
] as const;

const NOTES = [
  'Hindari double negative pada standard English.',
  'Posisi never biasanya sebelum main verb.',
  'do-support hanya untuk simple tense tanpa auxiliary lain.',
] as const;

export default function NegationBasicsPage() {
  return (
    <main className="std-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="std-shell gr-topic-shell">
        <header className="std-header">
          <h1 className="std-title">Negation Basics (not, no, never, do-support)</h1>
          <p className="std-subtitle">Dasar membentuk kalimat negatif secara benar.</p>
        </header>

        <section className="std-block">
          <h2 className="std-block-title">Konsep</h2>
          <p className="std-text">Negation meniadakan informasi dan bentuknya bergantung pada tipe verb serta struktur kalimat.</p>
        </section>

        <section className="std-block">
          <h2 className="std-block-title">Inti Materi</h2>
          <div className="std-grid">
            {CORE_ITEMS.map((item) => (
              <details key={item.title} className="std-card std-card-accordion">
                <summary className="std-card-summary">
                  <h3 className="std-card-title">{item.title}</h3>
                  <span className="std-card-caret" aria-hidden="true" />
                </summary>
                <div className="std-card-body">
                  <p className="std-card-desc">{item.desc}</p>
                  <ul className="std-list">
                    {item.examples.map((example) => (
                      <li key={item.title + '-' + example}>{example}</li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="std-block">
          <h2 className="std-block-title">Kesalahan Umum</h2>
          <div className="std-fix-grid">
            {COMMON_MISTAKES.map((item) => (
              <article key={item.wrong} className="std-fix-card">
                <p className="std-fix-wrong">Salah: {item.wrong}</p>
                <p className="std-fix-correct">Benar: {item.correct}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="std-block">
          <h2 className="std-block-title">Catatan Penting</h2>
          <ul className="std-list">
            {NOTES.map((note) => (
              <li key={note}>- {note}</li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
