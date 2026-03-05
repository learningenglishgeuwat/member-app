import BackButton from '../../../../../components/BackButton';
import './punctuation-clause-boundaries.css';
import '../../topic-layout.css';

const CORE_ITEMS = [
  { title: 'Run-on sentence', desc: 'Dua independent clause digabung tanpa pemisah yang benar.', examples: ['Wrong: I was tired I kept working.', 'Fix: I was tired, but I kept working.'] },
  { title: 'Comma splice', desc: 'Dua independent clause dihubungkan hanya dengan koma.', examples: ['Wrong: She called me, I was driving.', 'Fix: She called me while I was driving.'] },
  { title: 'Repair options', desc: 'Gunakan conjunction, semicolon, atau pisah menjadi dua kalimat.', examples: ['Use and/but/so/because', 'Use ; between related clauses'] },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'We left early, we were exhausted.', correct: 'We left early because we were exhausted.' },
  { wrong: 'The class ended we stayed.', correct: 'The class ended, but we stayed.' },
] as const;

const NOTES = [
  'Independent clause butuh batas jelas.',
  'Comma saja tidak cukup untuk menghubungkan dua klausa bebas.',
  'Semicolon cocok untuk dua ide yang sangat terkait.',
] as const;

export default function PunctuationClauseBoundariesPage() {
  return (
    <main className="std-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50"><BackButton to="/skill/grammar/grammar-resource" /></div>
      <div className="std-shell gr-topic-shell">
        <header className="std-header"><h1 className="std-title">Punctuation for Clause Boundaries (Run-on, Comma Splice)</h1><p className="std-subtitle">Menentukan batas klausa dengan tanda baca yang tepat.</p></header>
        <section className="std-block"><h2 className="std-block-title">Konsep</h2><p className="std-text">Kesalahan tanda baca pada batas klausa membuat kalimat tidak jelas atau terlalu panjang.</p></section>
        <section className="std-block"><h2 className="std-block-title">Inti Materi</h2><div className="std-grid">{CORE_ITEMS.map((item) => (<details key={item.title} className="std-card std-card-accordion"><summary className="std-card-summary"><h3 className="std-card-title">{item.title}</h3><span className="std-card-caret" aria-hidden="true" /></summary><div className="std-card-body"><p className="std-card-desc">{item.desc}</p><ul className="std-list">{item.examples.map((example) => (<li key={item.title + '-' + example}>{example}</li>))}</ul></div></details>))}</div></section>
        <section className="std-block"><h2 className="std-block-title">Kesalahan Umum</h2><div className="std-fix-grid">{COMMON_MISTAKES.map((item) => (<article key={item.wrong} className="std-fix-card"><p className="std-fix-wrong">Salah: {item.wrong}</p><p className="std-fix-correct">Benar: {item.correct}</p></article>))}</div></section>
        <section className="std-block"><h2 className="std-block-title">Catatan Penting</h2><ul className="std-list">{NOTES.map((note) => (<li key={note}>- {note}</li>))}</ul></section>
      </div>
    </main>
  );
}
