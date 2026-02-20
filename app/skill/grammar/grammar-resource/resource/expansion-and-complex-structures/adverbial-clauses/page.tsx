import BackButton from '../../../../../components/BackButton';
import './adverbial-clauses.css';
import '../../topic-layout.css';

const CORE_ITEMS = [
  { title: 'Reason and purpose', desc: 'because/since/as untuk alasan; so that/in order that untuk tujuan.', examples: ['I stayed home because I was sick.', 'She spoke slowly so that everyone understood.'] },
  { title: 'Result', desc: 'so...that atau such...that untuk akibat.', examples: ['It was so cold that we went inside.', 'She was such a good leader that everyone trusted her.'] },
  { title: 'Concession', desc: 'although/even though/though untuk kontras.', examples: ['Although he was tired, he kept working.', 'Even though it rained, they played.'] },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'Although but he tried, he failed.', correct: 'Although he tried, he failed.' },
  { wrong: 'Because of he was late, we left.', correct: 'Because he was late, we left.' },
] as const;

const NOTES = [
  'Pilih conjunction sesuai relasi makna.',
  'Hindari marker kontras ganda.',
  'Because butuh clause; because of butuh noun phrase.',
] as const;

export default function AdverbialClausesPage() {
  return (
    <main className="std-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50"><BackButton to="/skill/grammar/grammar-resource" /></div>
      <div className="std-shell gr-topic-shell">
        <header className="std-header"><h1 className="std-title">Adverbial Clauses (Reason, Purpose, Result, Concession)</h1><p className="std-subtitle">Mengembangkan kalimat kompleks dengan adverbial clause non-time.</p></header>
        <section className="std-block"><h2 className="std-block-title">Konsep</h2><p className="std-text">Adverbial clauses menambah relasi logis seperti alasan, tujuan, hasil, dan pertentangan.</p></section>
        <section className="std-block"><h2 className="std-block-title">Inti Materi</h2><div className="std-grid">{CORE_ITEMS.map((item) => (<details key={item.title} className="std-card std-card-accordion"><summary className="std-card-summary"><h3 className="std-card-title">{item.title}</h3><span className="std-card-caret" aria-hidden="true" /></summary><div className="std-card-body"><p className="std-card-desc">{item.desc}</p><ul className="std-list">{item.examples.map((example) => (<li key={item.title + '-' + example}>{example}</li>))}</ul></div></details>))}</div></section>
        <section className="std-block"><h2 className="std-block-title">Kesalahan Umum</h2><div className="std-fix-grid">{COMMON_MISTAKES.map((item) => (<article key={item.wrong} className="std-fix-card"><p className="std-fix-wrong">Salah: {item.wrong}</p><p className="std-fix-correct">Benar: {item.correct}</p></article>))}</div></section>
        <section className="std-block"><h2 className="std-block-title">Catatan Penting</h2><ul className="std-list">{NOTES.map((note) => (<li key={note}>- {note}</li>))}</ul></section>
      </div>
    </main>
  );
}
