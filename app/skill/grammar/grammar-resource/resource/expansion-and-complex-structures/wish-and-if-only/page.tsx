import BackButton from '../../../../../components/BackButton';
import './wish-and-if-only.css';
import '../../topic-layout.css';

const CORE_ITEMS = [
  { title: 'Wish about present', desc: 'wish + past simple untuk kondisi sekarang yang tidak nyata.', examples: ['I wish I had more time.', 'She wishes she lived nearer.'] },
  { title: 'Wish about past', desc: 'wish + past perfect untuk penyesalan masa lalu.', examples: ['I wish I had studied harder.', 'They wish they had arrived earlier.'] },
  { title: 'Wish about future', desc: 'wish + would untuk perubahan perilaku/situasi ke depan.', examples: ['I wish you would listen.', 'If only it would stop raining.'] },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'I wish I have more money.', correct: 'I wish I had more money.' },
  { wrong: 'If only I studied yesterday.', correct: 'If only I had studied yesterday.' },
] as const;

const NOTES = [
  'wish present memakai backshift ke past form.',
  'if only biasanya lebih kuat secara emosi.',
  'were sering dipakai untuk semua persons pada formal style.',
] as const;

export default function WishAndIfOnlyPage() {
  return (
    <main className="std-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50"><BackButton to="/skill/grammar/grammar-resource" /></div>
      <div className="std-shell gr-topic-shell">
        <header className="std-header"><h1 className="std-title">Wish and If only</h1><p className="std-subtitle">Menyatakan harapan, penyesalan, dan kondisi yang tidak sesuai fakta.</p></header>
        <section className="std-block"><h2 className="std-block-title">Konsep</h2><p className="std-text">Wish/if only digunakan untuk membicarakan realitas yang berbeda dari keinginan pembicara.</p></section>
        <section className="std-block"><h2 className="std-block-title">Inti Materi</h2><div className="std-grid">{CORE_ITEMS.map((item) => (<details key={item.title} className="std-card std-card-accordion"><summary className="std-card-summary"><h3 className="std-card-title">{item.title}</h3><span className="std-card-caret" aria-hidden="true" /></summary><div className="std-card-body"><p className="std-card-desc">{item.desc}</p><ul className="std-list">{item.examples.map((example) => (<li key={item.title + '-' + example}>{example}</li>))}</ul></div></details>))}</div></section>
        <section className="std-block"><h2 className="std-block-title">Kesalahan Umum</h2><div className="std-fix-grid">{COMMON_MISTAKES.map((item) => (<article key={item.wrong} className="std-fix-card"><p className="std-fix-wrong">Salah: {item.wrong}</p><p className="std-fix-correct">Benar: {item.correct}</p></article>))}</div></section>
        <section className="std-block"><h2 className="std-block-title">Catatan Penting</h2><ul className="std-list">{NOTES.map((note) => (<li key={note}>- {note}</li>))}</ul></section>
      </div>
    </main>
  );
}
