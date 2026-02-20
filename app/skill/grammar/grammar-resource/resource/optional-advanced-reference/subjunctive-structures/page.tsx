import BackButton from '../../../../../components/BackButton';
import './subjunctive-structures.css';
import '../../topic-layout.css';

const CORE_ITEMS = [
  { title: 'Mandative subjunctive', desc: 'that + subject + base verb setelah suggest/recommend/insist.', examples: ['They recommended that he be present.', 'It is essential that everyone arrive on time.'] },
  { title: 'Formulaic forms', desc: 'Ekspresi tetap seperti Long live... atau God bless....', examples: ['Long live the king.', 'God bless you.'] },
  { title: 'Were subjunctive', desc: 'If I were... untuk kondisi tidak nyata.', examples: ['If I were you, I would wait.', 'I wish he were more careful.'] },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'They suggested that he is present.', correct: 'They suggested that he be present.' },
  { wrong: 'If I was you, I would apologize.', correct: 'If I were you, I would apologize.' },
] as const;

const NOTES = [
  'Subjunctive umum di register formal/akademik.',
  'Base verb dipakai tanpa -s setelah that clause mandative.',
  'Kuasai pola ini untuk advanced accuracy.',
] as const;

export default function SubjunctiveStructuresPage() {
  return (
    <main className="std-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50"><BackButton to="/skill/grammar/grammar-resource" /></div>
      <div className="std-shell gr-topic-shell">
        <header className="std-header"><h1 className="std-title">Subjunctive Structures</h1><p className="std-subtitle">Mengenal pola subjunctive untuk rekomendasi formal dan kondisi hipotetis.</p></header>
        <section className="std-block"><h2 className="std-block-title">Konsep</h2><p className="std-text">Subjunctive dipakai untuk non-fact meaning, rekomendasi resmi, dan kondisi hipotesis tertentu.</p></section>
        <section className="std-block"><h2 className="std-block-title">Inti Materi</h2><div className="std-grid">{CORE_ITEMS.map((item) => (<details key={item.title} className="std-card std-card-accordion"><summary className="std-card-summary"><h3 className="std-card-title">{item.title}</h3><span className="std-card-caret" aria-hidden="true" /></summary><div className="std-card-body"><p className="std-card-desc">{item.desc}</p><ul className="std-list">{item.examples.map((example) => (<li key={item.title + '-' + example}>{example}</li>))}</ul></div></details>))}</div></section>
        <section className="std-block"><h2 className="std-block-title">Kesalahan Umum</h2><div className="std-fix-grid">{COMMON_MISTAKES.map((item) => (<article key={item.wrong} className="std-fix-card"><p className="std-fix-wrong">Salah: {item.wrong}</p><p className="std-fix-correct">Benar: {item.correct}</p></article>))}</div></section>
        <section className="std-block"><h2 className="std-block-title">Catatan Penting</h2><ul className="std-list">{NOTES.map((note) => (<li key={note}>- {note}</li>))}</ul></section>
      </div>
    </main>
  );
}
