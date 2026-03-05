import BackButton from '../../../../../components/BackButton';
import './imperatives-commands-requests-instructions.css';
import '../../topic-layout.css';

const IMPERATIVE_TYPES = [
  {
    title: 'Commands',
    desc: 'Instruksi langsung, biasanya tegas.',
    examples: [
      { before: '', focus: 'Open', after: ' your notebook.' },
      { before: '', focus: 'Turn off', after: ' your phone.' },
      { before: '', focus: 'Stand', after: ' up.' },
    ],
  },
  {
    title: 'Requests (Polite)',
    desc: 'Permintaan lebih sopan, sering memakai please.',
    examples: [
      { before: 'Please ', focus: 'open', after: ' the window.' },
      { before: 'Please ', focus: 'wait', after: ' a moment.' },
      { before: 'Please ', focus: 'check', after: ' this file.' },
    ],
  },
  {
    title: 'Instructions',
    desc: 'Arahan langkah/prosedur.',
    examples: [
      { before: 'First, ', focus: 'read', after: ' the question carefully.' },
      { before: 'Then, ', focus: 'write', after: ' your answer clearly.' },
    ],
  },
  {
    title: "Negative Imperatives (Don't)",
    desc: 'Larangan atau perintah untuk tidak melakukan sesuatu.',
    examples: [
      { before: "Don't ", focus: 'run', after: ' in the hallway.' },
      { before: "Don't ", focus: 'forget', after: ' your ID card.' },
      { before: "Don't ", focus: 'be', after: ' late.' },
    ],
  },
] as const;

const CORE_PATTERNS = [
  {
    title: 'Positive',
    points: ['V1 + object/complement', 'Contoh: Open the file.'],
  },
  {
    title: 'Negative',
    points: ["Don't + V1 + object/complement", "Contoh: Don't open the file."],
  },
  {
    title: 'Polite Request',
    points: ['Please + V1 ... / V1 ..., please', 'Contoh: Please sit down. / Sit down, please.'],
  },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'You open the door.', correct: 'Open the door.' },
  { wrong: "Don't to speak loudly.", correct: "Don't speak loudly." },
  { wrong: 'Please to sit down.', correct: 'Please sit down.' },
] as const;

export default function ImperativesPage() {
  return (
    <main className="imp-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="imp-shell gr-topic-shell">
        <header className="imp-header">
          <h1 className="imp-title">Imperatives (Commands, Requests, Instructions)</h1>
          <p className="imp-subtitle">
            Memahami bentuk imperative untuk memberi perintah, permintaan, dan instruksi secara jelas.
          </p>
        </header>

        <section className="imp-block">
          <h2 className="imp-block-title">Konsep</h2>
          <p className="imp-text">
            Imperative memakai <strong>base verb (V1)</strong> tanpa subject eksplisit (subject tersirat: you).
            Bentuk ini umum untuk command, request, dan instruction.
          </p>
        </section>

	        <section className="imp-block">
	          <h2 className="imp-block-title">Types of Imperatives</h2>
	          <div className="imp-grid imp-grid-one-col">
	            {IMPERATIVE_TYPES.map((item) => (
              <details key={item.title} className="imp-card imp-card-accordion">
                <summary className="imp-card-summary">
                  <h3 className="imp-card-title">{item.title}</h3>
                  <span className="imp-card-caret" aria-hidden="true" />
                </summary>
	                <div className="imp-card-body">
	                  <p className="imp-card-desc">{item.desc}</p>
	                  <ul className="imp-list">
	                    {item.examples.map((ex) => (
	                      <li key={`${item.title}-${ex.before}-${ex.focus}-${ex.after}`}>
	                        {ex.before}
	                        <span className="imp-highlight">{ex.focus}</span>
	                        {ex.after}
	                      </li>
	                    ))}
	                  </ul>
	                </div>
	              </details>
	            ))}
	          </div>
	        </section>

	        <section className="imp-block">
	          <h2 className="imp-block-title">Core Patterns</h2>
	          <div className="imp-grid imp-grid-one-col">
	            {CORE_PATTERNS.map((item) => (
	              <article key={item.title} className="imp-card">
	                <div className="imp-card-body">
	                  <h3 className="imp-card-title">{item.title}</h3>
	                  <ul className="imp-list">
	                    {item.points.map((point) => (
	                      <li key={point}>{point}</li>
	                    ))}
	                  </ul>
	                </div>
	              </article>
	            ))}
	          </div>
	        </section>

        <section className="imp-block">
          <h2 className="imp-block-title">Kesalahan Umum</h2>
          <div className="imp-fix-list">
            {COMMON_MISTAKES.map((item) => (
              <article key={item.wrong} className="imp-fix-card">
                <p className="imp-fix-wrong">Salah: {item.wrong}</p>
                <p className="imp-fix-correct">Benar: {item.correct}</p>
              </article>
            ))}
          </div>
        </section>

	        <section className="imp-block">
	          <h2 className="imp-block-title">Catatan Penting:</h2>
	          <ul className="imp-list">
	            <li>Imperative positif: base verb langsung (Open the file.).</li>
	            <li>Imperative negatif: don&apos;t + base verb (Don&apos;t open the file.).</li>
	            <li>Tambahkan please untuk nada lebih sopan.</li>
	            <li>
	              Untuk ajakan bersama, gunakan <span className="imp-highlight">Let&apos;s + V1</span>
	              (contoh: Let&apos;s start now.).
	            </li>
	          </ul>
	        </section>
      </div>
    </main>
  );
}
