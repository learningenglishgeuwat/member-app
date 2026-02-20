import BackButton from '../../../../../components/BackButton';
import './possessive-forms.css';
import '../../topic-layout.css';

const CORE_ITEMS = [
  { title: 'Apostrophe s (\'s)', desc: 'Umum untuk orang, hewan, waktu, atau organisasi.', examples: ['Rina\'s bag is new.', 'The company\'s policy changed.'] },
  { title: 'of-phrase', desc: 'Umum untuk benda atau konsep tak bernyawa.', examples: ['The color of the wall is blue.', 'The roof of the building is damaged.'] },
  { title: 'Double possessive', desc: 'Menunjukkan satu item dari beberapa kepemilikan.', examples: ['She is a friend of my brother\'s.', 'That is a photo of John\'s.'] },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'The bag of Rina is here.', correct: 'Rina\'s bag is here.' },
  { wrong: 'She is friend of my sister\'s.', correct: 'She is a friend of my sister\'s.' },
] as const;

const NOTES = [
  'Perhatikan plural possessive (students\' room).',
  'Bedakan its dan it\'s.',
  'Pilih bentuk yang paling natural dalam konteks.',
] as const;

export default function PossessiveFormsPage() {
  return (
    <main className="std-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50"><BackButton to="/skill/grammar/grammar-resource" /></div>
      <div className="std-shell gr-topic-shell">
        <header className="std-header"><h1 className="std-title">Possessive Forms ('s, of, double possessive)</h1><p className="std-subtitle">Memilih bentuk kepemilikan yang tepat untuk orang, benda, dan relasi kompleks.</p></header>
        <section className="std-block"><h2 className="std-block-title">Konsep</h2><p className="std-text">Possessive form menunjukkan kepemilikan atau hubungan. Pilih pola berdasarkan jenis noun dan fokus informasi.</p></section>
        <section className="std-block"><h2 className="std-block-title">Inti Materi</h2><div className="std-grid">{CORE_ITEMS.map((item) => (<details key={item.title} className="std-card std-card-accordion"><summary className="std-card-summary"><h3 className="std-card-title">{item.title}</h3><span className="std-card-caret" aria-hidden="true" /></summary><div className="std-card-body"><p className="std-card-desc">{item.desc}</p><ul className="std-list">{item.examples.map((example) => (<li key={item.title + '-' + example}>{example}</li>))}</ul></div></details>))}</div></section>
        <section className="std-block"><h2 className="std-block-title">Kesalahan Umum</h2><div className="std-fix-grid">{COMMON_MISTAKES.map((item) => (<article key={item.wrong} className="std-fix-card"><p className="std-fix-wrong">Salah: {item.wrong}</p><p className="std-fix-correct">Benar: {item.correct}</p></article>))}</div></section>
        <section className="std-block"><h2 className="std-block-title">Catatan Penting</h2><ul className="std-list">{NOTES.map((note) => (<li key={note}>- {note}</li>))}</ul></section>
      </div>
    </main>
  );
}
