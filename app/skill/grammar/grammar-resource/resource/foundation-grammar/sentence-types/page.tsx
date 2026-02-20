import BackButton from '../../../../../components/BackButton';
import './sentence-types.css';
import '../../topic-layout.css';

const CORE_ITEMS = [
  { title: 'Declarative', desc: 'Kalimat pernyataan untuk informasi/fakta.', examples: ['She studies every night.', 'The meeting starts at nine.'] },
  { title: 'Interrogative', desc: 'Kalimat tanya (yes/no dan WH).', examples: ['Do you like coffee?', 'Where does he live?'] },
  { title: 'Imperative dan Exclamative', desc: 'Imperative untuk instruksi, exclamative untuk emosi kuat.', examples: ['Please close the door.', 'What a beautiful day!'] },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'You are ready?', correct: 'Are you ready?' },
  { wrong: 'What beautiful day.', correct: 'What a beautiful day!' },
] as const;

const NOTES = [
  'Jenis kalimat memengaruhi urutan kata.',
  'Imperative biasanya tanpa subject eksplisit.',
  'Gunakan tanda baca sesuai fungsi kalimat.',
] as const;

export default function SentenceTypesPage() {
  return (
    <main className="std-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="std-shell gr-topic-shell">
        <header className="std-header">
          <h1 className="std-title">Sentence Types (Declarative, Interrogative, Imperative, Exclamative)</h1>
          <p className="std-subtitle">Membedakan jenis kalimat berdasarkan fungsi komunikasinya.</p>
        </header>

        <section className="std-block">
          <h2 className="std-block-title">Konsep</h2>
          <p className="std-text">Jenis kalimat ditentukan oleh tujuan komunikasi: menyatakan, bertanya, memerintah, atau mengekspresikan emosi.</p>
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
