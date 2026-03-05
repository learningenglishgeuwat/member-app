import BackButton from '../../../../../components/BackButton';
import './short-answers-response-patterns.css';
import '../../topic-layout.css';

const CORE_ITEMS = [
  { title: 'Positive agreement', desc: 'So + auxiliary + subject.', examples: ['I like jazz. So do I.', 'She has finished. So have they.'] },
  { title: 'Negative agreement', desc: 'Neither/Nor + auxiliary + subject.', examples: ['I do not smoke. Neither do I.', 'She is not ready. Nor am I.'] },
  { title: 'Short answers', desc: 'Jawaban singkat memakai auxiliary yang sama.', examples: ['Do you study? Yes, I do.', 'Is he here? No, he is not.'] },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'I like tea. So I do.', correct: 'I like tea. So do I.' },
  { wrong: 'She is not ready. Neither I am.', correct: 'She is not ready. Neither am I.' },
] as const;

const NOTES = [
  'Auxiliary response harus match kalimat awal.',
  'Neither dan nor sama-sama valid untuk negative agreement.',
  'Pola ini penting untuk speaking natural.',
] as const;

export default function ShortAnswersResponsePatternsPage() {
  return (
    <main className="std-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50"><BackButton to="/skill/grammar/grammar-resource" /></div>
      <div className="std-shell gr-topic-shell">
        <header className="std-header"><h1 className="std-title">Short Answers and Response Patterns (So do I, Neither do I)</h1><p className="std-subtitle">Merespons pernyataan secara ringkas dengan auxiliary yang benar.</p></header>
        <section className="std-block"><h2 className="std-block-title">Konsep</h2><p className="std-text">Response pattern membantu interaksi natural dan harus mengikuti tense serta auxiliary dari kalimat awal.</p></section>
        <section className="std-block"><h2 className="std-block-title">Inti Materi</h2><div className="std-grid">{CORE_ITEMS.map((item) => (<details key={item.title} className="std-card std-card-accordion"><summary className="std-card-summary"><h3 className="std-card-title">{item.title}</h3><span className="std-card-caret" aria-hidden="true" /></summary><div className="std-card-body"><p className="std-card-desc">{item.desc}</p><ul className="std-list">{item.examples.map((example) => (<li key={item.title + '-' + example}>{example}</li>))}</ul></div></details>))}</div></section>
        <section className="std-block"><h2 className="std-block-title">Kesalahan Umum</h2><div className="std-fix-grid">{COMMON_MISTAKES.map((item) => (<article key={item.wrong} className="std-fix-card"><p className="std-fix-wrong">Salah: {item.wrong}</p><p className="std-fix-correct">Benar: {item.correct}</p></article>))}</div></section>
        <section className="std-block"><h2 className="std-block-title">Catatan Penting</h2><ul className="std-list">{NOTES.map((note) => (<li key={note}>- {note}</li>))}</ul></section>
      </div>
    </main>
  );
}
