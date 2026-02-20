import BackButton from '../../../../../components/BackButton';
import './hedging-and-stance-grammar.css';
import '../../topic-layout.css';

const CORE_ITEMS = [
  { title: 'Verb-based hedging', desc: 'seem/appear/tend + to infinitive.', examples: ['The data seem to support the claim.', 'He appears to understand the issue.'] },
  { title: 'Adjective stance', desc: 'likely/unlikely/possible/certain + clause/to infinitive.', examples: ['She is likely to join us.', 'It is unlikely that they will agree.'] },
  { title: 'Adverb hedging', desc: 'possibly/probably/apparently untuk menurunkan kepastian.', examples: ['This is probably the best option.', 'Apparently, the file was deleted.'] },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'The result proves absolutely this method works.', correct: 'The result seems to indicate this method works.' },
  { wrong: 'He likely will come.', correct: 'He is likely to come.' },
] as const;

const NOTES = [
  'Sesuaikan tingkat kepastian dengan bukti yang tersedia.',
  'Hedging penting untuk tone akademik dan profesional.',
  'Jangan gunakan hedge berlebihan sampai argumen jadi kabur.',
] as const;

export default function HedgingAndStanceGrammarPage() {
  return (
    <main className="std-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50"><BackButton to="/skill/grammar/grammar-resource" /></div>
      <div className="std-shell gr-topic-shell">
        <header className="std-header"><h1 className="std-title">Hedging and Stance Grammar (seems to, appears to, likely to)</h1><p className="std-subtitle">Menyampaikan opini dengan level kepastian yang terukur.</p></header>
        <section className="std-block"><h2 className="std-block-title">Konsep</h2><p className="std-text">Hedging dan stance grammar membantu menghindari klaim absolut serta membuat argumen lebih akademik.</p></section>
        <section className="std-block"><h2 className="std-block-title">Inti Materi</h2><div className="std-grid">{CORE_ITEMS.map((item) => (<details key={item.title} className="std-card std-card-accordion"><summary className="std-card-summary"><h3 className="std-card-title">{item.title}</h3><span className="std-card-caret" aria-hidden="true" /></summary><div className="std-card-body"><p className="std-card-desc">{item.desc}</p><ul className="std-list">{item.examples.map((example) => (<li key={item.title + '-' + example}>{example}</li>))}</ul></div></details>))}</div></section>
        <section className="std-block"><h2 className="std-block-title">Kesalahan Umum</h2><div className="std-fix-grid">{COMMON_MISTAKES.map((item) => (<article key={item.wrong} className="std-fix-card"><p className="std-fix-wrong">Salah: {item.wrong}</p><p className="std-fix-correct">Benar: {item.correct}</p></article>))}</div></section>
        <section className="std-block"><h2 className="std-block-title">Catatan Penting</h2><ul className="std-list">{NOTES.map((note) => (<li key={note}>- {note}</li>))}</ul></section>
      </div>
    </main>
  );
}
