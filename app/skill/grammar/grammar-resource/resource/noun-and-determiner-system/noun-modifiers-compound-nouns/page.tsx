import BackButton from '../../../../../components/BackButton';
import './noun-modifiers-compound-nouns.css';
import '../../topic-layout.css';

const CORE_ITEMS = [
  { title: 'Noun as modifier', desc: 'Noun pertama biasanya tetap singular saat memodifikasi noun utama.', examples: ['a coffee cup', 'a school bus'] },
  { title: 'Compound noun forms', desc: 'Bisa terpisah, hyphen, atau menyatu.', examples: ['ice cream', 'mother-in-law'] },
  { title: 'Head noun awareness', desc: 'Makna inti ada di head noun (biasanya noun terakhir).', examples: ['data analysis report', 'customer service desk'] },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'a coffees cup', correct: 'a coffee cup' },
  { wrong: 'a informations system', correct: 'an information system' },
] as const;

const NOTES = [
  'Spelling compound noun perlu cek kamus.',
  'Jangan otomatis membuat noun modifier plural.',
  'Gunakan bentuk konsisten di writing.',
] as const;

export default function NounModifiersCompoundNounsPage() {
  return (
    <main className="std-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50"><BackButton to="/skill/grammar/grammar-resource" /></div>
      <div className="std-shell gr-topic-shell">
        <header className="std-header"><h1 className="std-title">Noun Modifiers and Compound Nouns</h1><p className="std-subtitle">Memahami noun yang memodifikasi noun lain dan pembentukan compound nouns.</p></header>
        <section className="std-block"><h2 className="std-block-title">Konsep</h2><p className="std-text">Noun modifier dan compound noun membuat noun phrase lebih spesifik dan padat.</p></section>
        <section className="std-block"><h2 className="std-block-title">Inti Materi</h2><div className="std-grid">{CORE_ITEMS.map((item) => (<details key={item.title} className="std-card std-card-accordion"><summary className="std-card-summary"><h3 className="std-card-title">{item.title}</h3><span className="std-card-caret" aria-hidden="true" /></summary><div className="std-card-body"><p className="std-card-desc">{item.desc}</p><ul className="std-list">{item.examples.map((example) => (<li key={item.title + '-' + example}>{example}</li>))}</ul></div></details>))}</div></section>
        <section className="std-block"><h2 className="std-block-title">Kesalahan Umum</h2><div className="std-fix-grid">{COMMON_MISTAKES.map((item) => (<article key={item.wrong} className="std-fix-card"><p className="std-fix-wrong">Salah: {item.wrong}</p><p className="std-fix-correct">Benar: {item.correct}</p></article>))}</div></section>
        <section className="std-block"><h2 className="std-block-title">Catatan Penting</h2><ul className="std-list">{NOTES.map((note) => (<li key={note}>- {note}</li>))}</ul></section>
      </div>
    </main>
  );
}
