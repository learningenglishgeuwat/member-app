import BackButton from '../../../../../components/BackButton';
import './past-perfect-continuous.css';
import '../../topic-layout.css';

const CORE_ITEMS = [
  { title: 'Form', desc: 'Subject + had been + V-ing.', examples: ['She had been studying for two hours.', 'They had been waiting since noon.'] },
  { title: 'Main use', desc: 'Menjelaskan durasi/proses sebelum event lampau lain.', examples: ['He was tired because he had been running.', 'The road was wet because it had been raining.'] },
  { title: 'Time markers', desc: 'Sering muncul dengan for, since, before, by the time.', examples: ['for three weeks', 'since Monday'] },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'She had been study for two hours.', correct: 'She had been studying for two hours.' },
  { wrong: 'They had been waited since 8.', correct: 'They had been waiting since 8.' },
] as const;

const NOTES = [
  'Fokus pada durasi proses, bukan hanya hasil.',
  'Bandingkan dengan past perfect simple saat fokus completion.',
  'Gunakan konteks dua titik waktu lampau agar jelas.',
] as const;

export default function PastPerfectContinuousPage() {
  return (
    <main className="std-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50"><BackButton to="/skill/grammar/grammar-resource" /></div>
      <div className="std-shell gr-topic-shell">
        <header className="std-header"><h1 className="std-title">Past Perfect Continuous</h1><p className="std-subtitle">Menyatakan durasi aktivitas sebelum titik waktu tertentu di masa lampau.</p></header>
        <section className="std-block"><h2 className="std-block-title">Konsep</h2><p className="std-text">Past perfect continuous menekankan proses yang sudah berlangsung selama periode tertentu sebelum kejadian lampau lain.</p></section>
        <section className="std-block"><h2 className="std-block-title">Inti Materi</h2><div className="std-grid">{CORE_ITEMS.map((item) => (<details key={item.title} className="std-card std-card-accordion"><summary className="std-card-summary"><h3 className="std-card-title">{item.title}</h3><span className="std-card-caret" aria-hidden="true" /></summary><div className="std-card-body"><p className="std-card-desc">{item.desc}</p><ul className="std-list">{item.examples.map((example) => (<li key={item.title + '-' + example}>{example}</li>))}</ul></div></details>))}</div></section>
        <section className="std-block"><h2 className="std-block-title">Kesalahan Umum</h2><div className="std-fix-grid">{COMMON_MISTAKES.map((item) => (<article key={item.wrong} className="std-fix-card"><p className="std-fix-wrong">Salah: {item.wrong}</p><p className="std-fix-correct">Benar: {item.correct}</p></article>))}</div></section>
        <section className="std-block"><h2 className="std-block-title">Catatan Penting</h2><ul className="std-list">{NOTES.map((note) => (<li key={note}>- {note}</li>))}</ul></section>
      </div>
    </main>
  );
}
