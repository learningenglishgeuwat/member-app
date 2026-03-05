import BackButton from '../../../../../components/BackButton';
import './requests-offers-suggestions.css';
import '../../topic-layout.css';

const CORE_ITEMS = [
  { title: 'Requests', desc: 'Gunakan could/would untuk permintaan lebih sopan.', examples: ['Could you open the window?', 'Would you help me with this?'] },
  { title: 'Offers', desc: 'Gunakan shall I/can I/would you like me to....', examples: ['Shall I carry your bag?', 'Would you like me to call him?'] },
  { title: 'Suggestions', desc: 'Gunakan let us/why do not we/how about.', examples: ['Let us start now.', 'Why do not we review this chapter?'] },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'Let us to begin now.', correct: 'Let us begin now.' },
  { wrong: 'Shall you help me?', correct: 'Could you help me?' },
] as const;

const NOTES = [
  'Could/Would biasanya lebih halus dari Can/Will.',
  'Shall I lazim untuk offer dengan subject I.',
  'Tambahkan please jika perlu memperhalus request.',
] as const;

export default function RequestsOffersSuggestionsPage() {
  return (
    <main className="std-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50"><BackButton to="/skill/grammar/grammar-resource" /></div>
      <div className="std-shell gr-topic-shell">
        <header className="std-header"><h1 className="std-title">Requests, Offers, Suggestions (Could, Would, Shall, Let us)</h1><p className="std-subtitle">Membuat request, offer, dan suggestion dengan tingkat kesopanan tepat.</p></header>
        <section className="std-block"><h2 className="std-block-title">Konsep</h2><p className="std-text">Pemilihan modal menentukan nuansa sopan atau formal saat meminta, menawarkan, atau menyarankan sesuatu.</p></section>
        <section className="std-block"><h2 className="std-block-title">Inti Materi</h2><div className="std-grid">{CORE_ITEMS.map((item) => (<details key={item.title} className="std-card std-card-accordion"><summary className="std-card-summary"><h3 className="std-card-title">{item.title}</h3><span className="std-card-caret" aria-hidden="true" /></summary><div className="std-card-body"><p className="std-card-desc">{item.desc}</p><ul className="std-list">{item.examples.map((example) => (<li key={item.title + '-' + example}>{example}</li>))}</ul></div></details>))}</div></section>
        <section className="std-block"><h2 className="std-block-title">Kesalahan Umum</h2><div className="std-fix-grid">{COMMON_MISTAKES.map((item) => (<article key={item.wrong} className="std-fix-card"><p className="std-fix-wrong">Salah: {item.wrong}</p><p className="std-fix-correct">Benar: {item.correct}</p></article>))}</div></section>
        <section className="std-block"><h2 className="std-block-title">Catatan Penting</h2><ul className="std-list">{NOTES.map((note) => (<li key={note}>- {note}</li>))}</ul></section>
      </div>
    </main>
  );
}
