import BackButton from '../../../../../components/BackButton';
import './future-perfect-continuous.css';
import '../../topic-layout.css';

const CORE_ITEMS = [
  { title: 'Form', desc: 'Subject + will have been + V-ing.', examples: ['By July, she will have been working here for ten years.', 'By noon, we will have been studying for four hours.'] },
  { title: 'Main use', desc: 'Menekankan akumulasi durasi sampai future reference point.', examples: ['Next month, he will have been living here for a year.', 'By 9 p.m., they will have been traveling all day.'] },
  { title: 'Markers', desc: 'Umum dengan by, by the time, for.', examples: ['by next year', 'for six months'] },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'She will has been working here.', correct: 'She will have been working here.' },
  { wrong: 'I will have being studying.', correct: 'I will have been studying.' },
] as const;

const NOTES = [
  'Berbeda dari future perfect yang fokus pada hasil selesai.',
  'Gunakan jika durasi memang relevan.',
  'Struktur ini lebih advanced dan sering di writing formal.',
] as const;

export default function FuturePerfectContinuousPage() {
  return (
    <main className="std-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50"><BackButton to="/skill/grammar/grammar-resource" /></div>
      <div className="std-shell gr-topic-shell">
        <header className="std-header"><h1 className="std-title">Future Perfect Continuous</h1><p className="std-subtitle">Menyatakan durasi aktivitas yang akan sudah berjalan sampai titik waktu masa depan.</p></header>
        <section className="std-block"><h2 className="std-block-title">Konsep</h2><p className="std-text">Future perfect continuous dipakai ketika durasi aktivitas sampai waktu target di masa depan menjadi informasi penting.</p></section>
        <section className="std-block"><h2 className="std-block-title">Inti Materi</h2><div className="std-grid">{CORE_ITEMS.map((item) => (<details key={item.title} className="std-card std-card-accordion"><summary className="std-card-summary"><h3 className="std-card-title">{item.title}</h3><span className="std-card-caret" aria-hidden="true" /></summary><div className="std-card-body"><p className="std-card-desc">{item.desc}</p><ul className="std-list">{item.examples.map((example) => (<li key={item.title + '-' + example}>{example}</li>))}</ul></div></details>))}</div></section>
        <section className="std-block"><h2 className="std-block-title">Kesalahan Umum</h2><div className="std-fix-grid">{COMMON_MISTAKES.map((item) => (<article key={item.wrong} className="std-fix-card"><p className="std-fix-wrong">Salah: {item.wrong}</p><p className="std-fix-correct">Benar: {item.correct}</p></article>))}</div></section>
        <section className="std-block"><h2 className="std-block-title">Catatan Penting</h2><ul className="std-list">{NOTES.map((note) => (<li key={note}>- {note}</li>))}</ul></section>
      </div>
    </main>
  );
}
