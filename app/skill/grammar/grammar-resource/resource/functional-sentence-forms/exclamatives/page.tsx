import BackButton from '../../../../../components/BackButton';
import './exclamatives.css';
import '../../topic-layout.css';

const CORE_ITEMS = [
  { title: 'What-pattern', desc: 'What + (a/an) + adjective + noun + subject + verb.', examples: ['What a beautiful song this is!', 'What an amazing idea you have!'] },
  { title: 'How-pattern', desc: 'How + adjective/adverb + subject + verb.', examples: ['How fast she runs!', 'How kind they are!'] },
  { title: 'Meaning and intonation', desc: 'Ekspresi emosi juga dipengaruhi intonasi dan konteks.', examples: ['How lovely!', 'What a relief!'] },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'How a beautiful day!', correct: 'What a beautiful day!' },
  { wrong: 'What beautiful she is!', correct: 'How beautiful she is!' },
] as const;

const NOTES = [
  'What fokus ke noun phrase, How fokus ke adjective/adverb.',
  'Bedakan exclamative dari question form.',
  'Gunakan article dengan countable singular noun.',
] as const;

export default function ExclamativesPage() {
  return (
    <main className="std-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50"><BackButton to="/skill/grammar/grammar-resource" /></div>
      <div className="std-shell gr-topic-shell">
        <header className="std-header"><h1 className="std-title">Exclamatives (What/How)</h1><p className="std-subtitle">Membentuk kalimat seru dengan pola what/how secara akurat.</p></header>
        <section className="std-block"><h2 className="std-block-title">Konsep</h2><p className="std-text">Exclamatives dipakai untuk mengekspresikan emosi atau penekanan evaluatif secara kuat.</p></section>
        <section className="std-block"><h2 className="std-block-title">Inti Materi</h2><div className="std-grid">{CORE_ITEMS.map((item) => (<details key={item.title} className="std-card std-card-accordion"><summary className="std-card-summary"><h3 className="std-card-title">{item.title}</h3><span className="std-card-caret" aria-hidden="true" /></summary><div className="std-card-body"><p className="std-card-desc">{item.desc}</p><ul className="std-list">{item.examples.map((example) => (<li key={item.title + '-' + example}>{example}</li>))}</ul></div></details>))}</div></section>
        <section className="std-block"><h2 className="std-block-title">Kesalahan Umum</h2><div className="std-fix-grid">{COMMON_MISTAKES.map((item) => (<article key={item.wrong} className="std-fix-card"><p className="std-fix-wrong">Salah: {item.wrong}</p><p className="std-fix-correct">Benar: {item.correct}</p></article>))}</div></section>
        <section className="std-block"><h2 className="std-block-title">Catatan Penting</h2><ul className="std-list">{NOTES.map((note) => (<li key={note}>- {note}</li>))}</ul></section>
      </div>
    </main>
  );
}
