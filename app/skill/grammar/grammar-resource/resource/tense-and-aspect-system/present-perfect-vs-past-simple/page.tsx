import BackButton from '../../../../../components/BackButton';
import './present-perfect-vs-past-simple.css';
import '../../topic-layout.css';

const CORE_ITEMS = [
  { title: 'Present perfect', desc: 'have/has + V3 untuk pengalaman, hasil saat ini, atau perubahan baru.', examples: ['I have finished my homework.', 'She has visited Japan twice.'] },
  { title: 'Past simple', desc: 'V2 untuk kejadian selesai pada waktu lampau tertentu.', examples: ['I finished my homework last night.', 'She visited Japan in 2019.'] },
  { title: 'Time expression contrast', desc: 'Present perfect tidak dipakai dengan finished past time marker.', examples: ['already, yet, ever, never', 'yesterday, last week, in 2020'] },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'I have seen him yesterday.', correct: 'I saw him yesterday.' },
  { wrong: 'Did you ever went there?', correct: 'Have you ever been there?' },
] as const;

const NOTES = [
  'Cek apakah waktu disebut jelas atau tidak.',
  'Past simple wajib jika ada marker waktu selesai.',
  'Kontras ini sangat penting untuk akurasi speaking dan writing.',
] as const;

export default function PresentPerfectVsPastSimplePage() {
  return (
    <main className="std-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50"><BackButton to="/skill/grammar/grammar-resource" /></div>
      <div className="std-shell gr-topic-shell">
        <header className="std-header"><h1 className="std-title">Present Perfect vs Past Simple (Contrast)</h1><p className="std-subtitle">Membedakan dua tense yang sering tertukar.</p></header>
        <section className="std-block"><h2 className="std-block-title">Konsep</h2><p className="std-text">Perbedaan utama ada di referensi waktu: present perfect terhubung ke sekarang, past simple terkait waktu lampau yang sudah selesai.</p></section>
        <section className="std-block"><h2 className="std-block-title">Inti Materi</h2><div className="std-grid">{CORE_ITEMS.map((item) => (<details key={item.title} className="std-card std-card-accordion"><summary className="std-card-summary"><h3 className="std-card-title">{item.title}</h3><span className="std-card-caret" aria-hidden="true" /></summary><div className="std-card-body"><p className="std-card-desc">{item.desc}</p><ul className="std-list">{item.examples.map((example) => (<li key={item.title + '-' + example}>{example}</li>))}</ul></div></details>))}</div></section>
        <section className="std-block"><h2 className="std-block-title">Kesalahan Umum</h2><div className="std-fix-grid">{COMMON_MISTAKES.map((item) => (<article key={item.wrong} className="std-fix-card"><p className="std-fix-wrong">Salah: {item.wrong}</p><p className="std-fix-correct">Benar: {item.correct}</p></article>))}</div></section>
        <section className="std-block"><h2 className="std-block-title">Catatan Penting</h2><ul className="std-list">{NOTES.map((note) => (<li key={note}>- {note}</li>))}</ul></section>
      </div>
    </main>
  );
}
