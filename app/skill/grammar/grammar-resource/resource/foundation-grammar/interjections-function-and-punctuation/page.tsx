import BackButton from '../../../../../components/BackButton';
import './interjections-function-and-punctuation.css';
import '../../topic-layout.css';

const CORE_ITEMS = [
  { title: 'Fungsi Emosi', desc: 'Menunjukkan reaksi cepat seperti kaget, senang, atau sakit.', examples: ['Wow! That is amazing.', 'Ouch! My finger hurts.'] },
  { title: 'Posisi dalam Kalimat', desc: 'Bisa berdiri sendiri atau muncul di awal kalimat utama.', examples: ['Hey, listen to this.', 'Well, I need more time.'] },
  { title: 'Punctuation', desc: 'Gunakan ! untuk emosi kuat dan koma untuk nada ringan.', examples: ['Great! We won.', 'Oh, I forgot my key.'] },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'Wow I passed the test', correct: 'Wow, I passed the test.' },
  { wrong: 'Well! I think so.', correct: 'Well, I think so.' },
] as const;

const NOTES = [
  'Interjection memberi nuansa, bukan inti struktur S + V.',
  'Jangan berlebihan memakai tanda seru.',
  'Intonasi penting dalam speaking.',
] as const;

export default function InterjectionsFunctionAndPunctuationPage() {
  return (
    <main className="std-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="std-shell gr-topic-shell">
        <header className="std-header">
          <h1 className="std-title">Interjections (Function and Punctuation)</h1>
          <p className="std-subtitle">Memahami interjection sebagai ekspresi spontan dan cara menuliskannya dengan tanda baca yang tepat.</p>
        </header>

        <section className="std-block">
          <h2 className="std-block-title">Konsep</h2>
          <p className="std-text">Interjection adalah kata atau frasa pendek untuk mengekspresikan emosi, reaksi, atau respons spontan.</p>
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
