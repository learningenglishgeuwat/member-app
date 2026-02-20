import BackButton from '../../../../../components/BackButton';
import './used-to-and-would.css';
import '../../topic-layout.css';

const CORE_ITEMS = [
  { title: 'used to', desc: 'Untuk past habits dan past states yang sekarang sudah berubah.', examples: ['I used to play chess every day.', 'She used to live in Surabaya.'] },
  { title: 'would', desc: 'Untuk kebiasaan berulang, bukan state statis.', examples: ['Every summer, we would visit our grandparents.', 'He would read before bed.'] },
  { title: 'Negative and question', desc: 'Dalam modern usage: did + use to untuk negatif/pertanyaan.', examples: ['Did you use to smoke?', 'I did not use to like coffee.'] },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'Did you used to live here?', correct: 'Did you use to live here?' },
  { wrong: 'I would be shy as a child. (state)', correct: 'I used to be shy as a child.' },
] as const;

const NOTES = [
  'Gunakan used to untuk state seperti be, have, know.',
  'Would butuh konteks kebiasaan yang jelas.',
  'Jika ragu, used to biasanya lebih aman untuk pemula.',
] as const;

export default function UsedToAndWouldPage() {
  return (
    <main className="std-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50"><BackButton to="/skill/grammar/grammar-resource" /></div>
      <div className="std-shell gr-topic-shell">
        <header className="std-header"><h1 className="std-title">Used to and Would (Past Habits and States)</h1><p className="std-subtitle">Membedakan used to dan would untuk kebiasaan serta keadaan masa lalu.</p></header>
        <section className="std-block"><h2 className="std-block-title">Konsep</h2><p className="std-text">Used to dipakai untuk kebiasaan dan state lama; would dipakai terutama untuk kebiasaan berulang dengan konteks masa lalu.</p></section>
        <section className="std-block"><h2 className="std-block-title">Inti Materi</h2><div className="std-grid">{CORE_ITEMS.map((item) => (<details key={item.title} className="std-card std-card-accordion"><summary className="std-card-summary"><h3 className="std-card-title">{item.title}</h3><span className="std-card-caret" aria-hidden="true" /></summary><div className="std-card-body"><p className="std-card-desc">{item.desc}</p><ul className="std-list">{item.examples.map((example) => (<li key={item.title + '-' + example}>{example}</li>))}</ul></div></details>))}</div></section>
        <section className="std-block"><h2 className="std-block-title">Kesalahan Umum</h2><div className="std-fix-grid">{COMMON_MISTAKES.map((item) => (<article key={item.wrong} className="std-fix-card"><p className="std-fix-wrong">Salah: {item.wrong}</p><p className="std-fix-correct">Benar: {item.correct}</p></article>))}</div></section>
        <section className="std-block"><h2 className="std-block-title">Catatan Penting</h2><ul className="std-list">{NOTES.map((note) => (<li key={note}>- {note}</li>))}</ul></section>
      </div>
    </main>
  );
}
