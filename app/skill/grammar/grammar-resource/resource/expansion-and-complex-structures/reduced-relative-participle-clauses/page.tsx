import BackButton from '../../../../../components/BackButton';
import './reduced-relative-participle-clauses.css';
import '../../topic-layout.css';

const CORE_ITEMS = [
  { title: 'Active reduction', desc: 'who/which + be + V-ing dapat diringkas jadi V-ing phrase.', examples: ['Students studying in the library are quiet.', 'The woman talking to John is my aunt.'] },
  { title: 'Passive reduction', desc: 'who/which + be + V3 dapat diringkas jadi V3 phrase.', examples: ['The documents submitted yesterday are complete.', 'The method used in this study is effective.'] },
  { title: 'When not to reduce', desc: 'Jika reduction membuat ambigu, pakai full relative clause.', examples: ['The report that was prepared by Ana is clear.', 'The issue that we discussed remains unresolved.'] },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'The student study in class is my friend.', correct: 'The student studying in class is my friend.' },
  { wrong: 'The file sending yesterday is missing.', correct: 'The file sent yesterday is missing.' },
] as const;

const NOTES = [
  'Reduction sering dipakai dalam writing formal.',
  'Past participle menandakan makna pasif/hasil.',
  'Jaga agar head noun tetap jelas.',
] as const;

export default function ReducedRelativeParticipleClausesPage() {
  return (
    <main className="std-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50"><BackButton to="/skill/grammar/grammar-resource" /></div>
      <div className="std-shell gr-topic-shell">
        <header className="std-header"><h1 className="std-title">Reduced Relative / Participle Clauses</h1><p className="std-subtitle">Meringkas relative clause agar kalimat lebih padat.</p></header>
        <section className="std-block"><h2 className="std-block-title">Konsep</h2><p className="std-text">Reduced relative clause memungkinkan informasi relatif ditulis lebih singkat dengan participle.</p></section>
        <section className="std-block"><h2 className="std-block-title">Inti Materi</h2><div className="std-grid">{CORE_ITEMS.map((item) => (<details key={item.title} className="std-card std-card-accordion"><summary className="std-card-summary"><h3 className="std-card-title">{item.title}</h3><span className="std-card-caret" aria-hidden="true" /></summary><div className="std-card-body"><p className="std-card-desc">{item.desc}</p><ul className="std-list">{item.examples.map((example) => (<li key={item.title + '-' + example}>{example}</li>))}</ul></div></details>))}</div></section>
        <section className="std-block"><h2 className="std-block-title">Kesalahan Umum</h2><div className="std-fix-grid">{COMMON_MISTAKES.map((item) => (<article key={item.wrong} className="std-fix-card"><p className="std-fix-wrong">Salah: {item.wrong}</p><p className="std-fix-correct">Benar: {item.correct}</p></article>))}</div></section>
        <section className="std-block"><h2 className="std-block-title">Catatan Penting</h2><ul className="std-list">{NOTES.map((note) => (<li key={note}>- {note}</li>))}</ul></section>
      </div>
    </main>
  );
}
