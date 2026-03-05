import BackButton from '../../../../../components/BackButton';
import './causatives-have-get-something-done.css';
import '../../topic-layout.css';

const CORE_ITEMS = [
  { title: 'have something done', desc: 'Cenderung netral/formal untuk layanan.', examples: ['I had my car repaired.', 'She has her hair cut every month.'] },
  { title: 'get something done', desc: 'Lebih informal dan menekankan hasil.', examples: ['I got my laptop fixed.', 'They got the room painted.'] },
  { title: 'Causative with person', desc: 'have/get + person + base/to-infinitive sesuai pola.', examples: ['I had him check the file.', 'She got me to join the project.'] },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'I had repaired my car. (maksud jasa)', correct: 'I had my car repaired.' },
  { wrong: 'She got cut her hair.', correct: 'She got her hair cut.' },
] as const;

const NOTES = [
  'Objek pada causative menerima aksi (makna pasif).',
  'Bedakan causative dari perfect biasa.',
  'Pilih have/get sesuai tone formalitas.',
] as const;

export default function CausativesHaveGetSomethingDonePage() {
  return (
    <main className="std-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50"><BackButton to="/skill/grammar/grammar-resource" /></div>
      <div className="std-shell gr-topic-shell">
        <header className="std-header"><h1 className="std-title">Causatives (have/get something done)</h1><p className="std-subtitle">Menyatakan aksi yang dikerjakan pihak lain atas inisiatif subject.</p></header>
        <section className="std-block"><h2 className="std-block-title">Konsep</h2><p className="std-text">Causative dipakai saat subject tidak melakukan aksi sendiri, tetapi menyebabkan aksi dilakukan oleh orang lain.</p></section>
        <section className="std-block"><h2 className="std-block-title">Inti Materi</h2><div className="std-grid">{CORE_ITEMS.map((item) => (<details key={item.title} className="std-card std-card-accordion"><summary className="std-card-summary"><h3 className="std-card-title">{item.title}</h3><span className="std-card-caret" aria-hidden="true" /></summary><div className="std-card-body"><p className="std-card-desc">{item.desc}</p><ul className="std-list">{item.examples.map((example) => (<li key={item.title + '-' + example}>{example}</li>))}</ul></div></details>))}</div></section>
        <section className="std-block"><h2 className="std-block-title">Kesalahan Umum</h2><div className="std-fix-grid">{COMMON_MISTAKES.map((item) => (<article key={item.wrong} className="std-fix-card"><p className="std-fix-wrong">Salah: {item.wrong}</p><p className="std-fix-correct">Benar: {item.correct}</p></article>))}</div></section>
        <section className="std-block"><h2 className="std-block-title">Catatan Penting</h2><ul className="std-list">{NOTES.map((note) => (<li key={note}>- {note}</li>))}</ul></section>
      </div>
    </main>
  );
}
