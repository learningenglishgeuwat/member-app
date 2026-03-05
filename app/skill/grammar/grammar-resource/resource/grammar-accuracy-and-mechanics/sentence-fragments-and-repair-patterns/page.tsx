import BackButton from '../../../../../components/BackButton';
import './sentence-fragments-and-repair-patterns.css';
import '../../topic-layout.css';

const CORE_ITEMS = [
  { title: 'Common fragment types', desc: 'Missing subject, missing finite verb, atau dependent clause berdiri sendiri.', examples: ['Because I was late.', 'The boy in the blue jacket.'] },
  { title: 'Repair by attachment', desc: 'Tempelkan fragment ke independent clause yang relevan.', examples: ['Because I was late, I took a taxi.', 'The boy in the blue jacket is my cousin.'] },
  { title: 'Repair by rewriting', desc: 'Ubah jadi kalimat mandiri lengkap.', examples: ['I was late this morning.', 'This chapter is very difficult.'] },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'When I arrived at school.', correct: 'When I arrived at school, the class had started.' },
  { wrong: 'Very difficult to understand.', correct: 'This text is very difficult to understand.' },
] as const;

const NOTES = [
  'Cek minimal S + finite V + ide utuh.',
  'Dependent clause tidak boleh berdiri sendiri.',
  'Fragment bisa dipakai kreatif, tapi hindari untuk writing akademik dasar.',
] as const;

export default function SentenceFragmentsAndRepairPatternsPage() {
  return (
    <main className="std-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50"><BackButton to="/skill/grammar/grammar-resource" /></div>
      <div className="std-shell gr-topic-shell">
        <header className="std-header"><h1 className="std-title">Sentence Fragments and Repair Patterns</h1><p className="std-subtitle">Mengidentifikasi dan memperbaiki potongan kalimat yang menggantung.</p></header>
        <section className="std-block"><h2 className="std-block-title">Konsep</h2><p className="std-text">Sentence fragment terjadi ketika potongan kalimat tidak memiliki struktur lengkap atau ide utuh.</p></section>
        <section className="std-block"><h2 className="std-block-title">Inti Materi</h2><div className="std-grid">{CORE_ITEMS.map((item) => (<details key={item.title} className="std-card std-card-accordion"><summary className="std-card-summary"><h3 className="std-card-title">{item.title}</h3><span className="std-card-caret" aria-hidden="true" /></summary><div className="std-card-body"><p className="std-card-desc">{item.desc}</p><ul className="std-list">{item.examples.map((example) => (<li key={item.title + '-' + example}>{example}</li>))}</ul></div></details>))}</div></section>
        <section className="std-block"><h2 className="std-block-title">Kesalahan Umum</h2><div className="std-fix-grid">{COMMON_MISTAKES.map((item) => (<article key={item.wrong} className="std-fix-card"><p className="std-fix-wrong">Salah: {item.wrong}</p><p className="std-fix-correct">Benar: {item.correct}</p></article>))}</div></section>
        <section className="std-block"><h2 className="std-block-title">Catatan Penting</h2><ul className="std-list">{NOTES.map((note) => (<li key={note}>- {note}</li>))}</ul></section>
      </div>
    </main>
  );
}
