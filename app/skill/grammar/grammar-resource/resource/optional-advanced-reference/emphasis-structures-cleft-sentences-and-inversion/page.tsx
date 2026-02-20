import BackButton from '../../../../../components/BackButton';
import './emphasis-structures-cleft-sentences-and-inversion.css';
import '../../topic-layout.css';

const EMPHASIS_TYPES = [
  {
    title: 'It-cleft',
    pattern: 'It + be + focus + that/who + clause',
    usage: 'Menekankan bagian tertentu dalam kalimat (subject/object/time/place).',
    examples: [
      'It was John who called me. (focus: subject)',
      'It was this topic that students found difficult. (focus: object)',
      'It was yesterday that we met. (focus: time)',
      'It was in Jakarta that they first met. (focus: place)',
    ],
  },
  {
    title: 'Wh-cleft (pseudo-cleft)',
    pattern: 'What + clause + be + focus',
    usage: 'Menekankan hasil/ide utama dengan struktur formal.',
    examples: ['What I need is more practice.', 'What she wanted was a clear plan.'],
  },
  {
    title: 'Inversion after negative/fronted adverbials',
    pattern: 'Negative adverbial + auxiliary + subject + verb',
    usage: 'Memberi efek formal dan kuat pada writing atau speech tertentu.',
    examples: [
      'Never have I seen such a view.',
      'Only then did I understand the problem.',
      'Not only did she apologize, but she also offered a solution.',
      'No sooner had we arrived than it started to rain.',
    ],
  },
] as const;

const INVERSION_TRIGGERS = [
  'Never / Rarely / Seldom + auxiliary + subject + verb',
  'Only then / Only after ... + auxiliary + subject + verb',
  'Not only ... (aux + subject) but also ...',
  'No sooner ... than ... / Hardly ... when ...',
] as const;

const USE_CASES = [
  'Academic writing untuk menyorot informasi kunci.',
  'Presentasi/speaking formal untuk penekanan ide utama.',
  'Writing style yang lebih advanced dan variatif.',
] as const;

const REGISTER_NOTES = [
  'Cleft dan inversion cenderung terdengar lebih formal/marked.',
  'Untuk percakapan santai, gunakan secukupnya agar tetap natural.',
  'Pilih emphasis structure saat benar-benar ingin menonjolkan informasi penting.',
] as const;

const COMMON_MISTAKES = [
  { wrong: 'It is John that called me yesterday was late.', correct: 'It is John who called me yesterday.' },
  { wrong: 'Never I have seen this before.', correct: 'Never have I seen this before.' },
  { wrong: 'What I need are more practice.', correct: 'What I need is more practice.' },
] as const;

export default function EmphasisStructuresPage() {
  return (
    <main className="es-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="es-shell gr-topic-shell">
        <header className="es-header">
          <h1 className="es-title">Emphasis Structures (cleft sentences and inversion)</h1>
          <p className="es-subtitle">
            Struktur emphasis membantu menonjolkan bagian penting kalimat agar pesan lebih kuat dan
            terarah.
          </p>
        </header>

        <section className="es-block">
          <h2 className="es-block-title">Konsep</h2>
          <p className="es-text">
            Emphasis structure adalah pola sintaksis untuk memberi fokus tambahan pada informasi
            tertentu. Dua pola utama: <strong>cleft sentences</strong> dan <strong>inversion</strong>.
          </p>
        </section>

        <section className="es-block">
          <h2 className="es-block-title">Jenis Emphasis Structures</h2>
          <div className="es-grid es-grid-one-col">
            {EMPHASIS_TYPES.map((item) => (
              <details key={item.title} className="es-card es-card-accordion">
                <summary className="es-card-summary">
                  <h3 className="es-card-title">{item.title}</h3>
                  <span className="es-card-caret" aria-hidden="true" />
                </summary>
                <div className="es-card-body">
                  <p className="es-card-desc">
                    Pola: <strong>{item.pattern}</strong>
                  </p>
                  <p className="es-card-desc">Fungsi: {item.usage}</p>
                  <ul className="es-list">
                    {item.examples.map((example) => (
                      <li key={example}>{example}</li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="es-block">
          <h2 className="es-block-title">Kapan Dipakai</h2>
          <ul className="es-list">
            {USE_CASES.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="es-block">
          <h2 className="es-block-title">Trigger Inversion yang Umum</h2>
          <ul className="es-list">
            {INVERSION_TRIGGERS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="es-block">
          <h2 className="es-block-title">Kesalahan Umum</h2>
          <div className="es-fix-list">
            {COMMON_MISTAKES.map((item) => (
              <article key={item.wrong} className="es-fix-card">
                <p className="es-fix-wrong">Salah: {item.wrong}</p>
                <p className="es-fix-correct">Benar: {item.correct}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="es-block">
          <h2 className="es-block-title">Catatan Penting:</h2>
          <ul className="es-list">
            <li>Jangan overuse; emphasis paling efektif jika dipakai selektif.</li>
            <li>Inversion butuh auxiliary (do/does/did/have/can, dll) pada posisi sebelum subject.</li>
            <li>Cleft cocok untuk memperjelas fokus argumen di writing formal.</li>
            {REGISTER_NOTES.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  );
}
