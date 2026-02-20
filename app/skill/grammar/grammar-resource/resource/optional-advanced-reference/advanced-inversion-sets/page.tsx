import BackButton from '../../../../../components/BackButton';
import './advanced-inversion-sets.css';
import '../../topic-layout.css';

const CORE_ITEMS = [
  { title: 'Negative fronting inversion', desc: 'Not until/never/rarely/hardly di awal memicu inversion.', examples: ['Not until midnight did he finish.', 'Rarely do we see this pattern.'] },
  { title: 'So/Such inversion', desc: 'So + adjective / Such + noun phrase untuk efek penekanan.', examples: ['So difficult was the test that many failed.', 'Such was his influence that everyone listened.'] },
  { title: 'Conditional inversion', desc: 'Had/Were/Should + subject sebagai alternatif if-clause formal.', examples: ['Had I known, I would have called.', 'Should you need help, contact us.'] },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'Not until he arrived we started.', correct: 'Not until he arrived did we start.' },
  { wrong: 'So difficult the task was that...', correct: 'So difficult was the task that...' },
] as const;

const NOTES = [
  'Gunakan inversion untuk emphasis, bukan semua kalimat.',
  'Pastikan auxiliary dan tense tepat.',
  'Pola ini lebih cocok untuk formal style.',
] as const;

export default function AdvancedInversionSetsPage() {
  return (
    <main className="std-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50"><BackButton to="/skill/grammar/grammar-resource" /></div>
      <div className="std-shell gr-topic-shell">
        <header className="std-header"><h1 className="std-title">Advanced Inversion Sets (Not until, So/Such ... that)</h1><p className="std-subtitle">Menggunakan inversion untuk penekanan tingkat lanjut.</p></header>
        <section className="std-block"><h2 className="std-block-title">Konsep</h2><p className="std-text">Inversion memindahkan auxiliary sebelum subject untuk efek emphatic, terutama pada formal writing.</p></section>
        <section className="std-block"><h2 className="std-block-title">Inti Materi</h2><div className="std-grid">{CORE_ITEMS.map((item) => (<details key={item.title} className="std-card std-card-accordion"><summary className="std-card-summary"><h3 className="std-card-title">{item.title}</h3><span className="std-card-caret" aria-hidden="true" /></summary><div className="std-card-body"><p className="std-card-desc">{item.desc}</p><ul className="std-list">{item.examples.map((example) => (<li key={item.title + '-' + example}>{example}</li>))}</ul></div></details>))}</div></section>
        <section className="std-block"><h2 className="std-block-title">Kesalahan Umum</h2><div className="std-fix-grid">{COMMON_MISTAKES.map((item) => (<article key={item.wrong} className="std-fix-card"><p className="std-fix-wrong">Salah: {item.wrong}</p><p className="std-fix-correct">Benar: {item.correct}</p></article>))}</div></section>
        <section className="std-block"><h2 className="std-block-title">Catatan Penting</h2><ul className="std-list">{NOTES.map((note) => (<li key={note}>- {note}</li>))}</ul></section>
      </div>
    </main>
  );
}
