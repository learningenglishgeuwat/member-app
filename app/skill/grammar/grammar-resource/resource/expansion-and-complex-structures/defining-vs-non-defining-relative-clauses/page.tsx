import BackButton from '../../../../../components/BackButton';
import './defining-vs-non-defining-relative-clauses.css';
import '../../topic-layout.css';

const CORE_ITEMS = [
  { title: 'Defining clause', desc: 'Informasi wajib, tanpa koma, that boleh dipakai.', examples: ['The student who sits there is my cousin.', 'The book that you lent me is excellent.'] },
  { title: 'Non-defining clause', desc: 'Informasi tambahan, pakai koma, that tidak dipakai.', examples: ['Mr. Lee, who teaches physics, is absent.', 'My laptop, which I bought last year, is still fast.'] },
  { title: 'Pronoun choice', desc: 'who untuk orang, which untuk benda, whose untuk kepemilikan.', examples: ['The girl whose bag is red is my sister.', 'The man who called you is waiting.'] },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'My brother, that lives in Bali, is a doctor.', correct: 'My brother, who lives in Bali, is a doctor.' },
  { wrong: 'The teacher who teaches us math, is strict.', correct: 'The teacher who teaches us math is strict.' },
] as const;

const NOTES = [
  'Defining clause tidak pakai koma.',
  'Non-defining clause harus diapit koma.',
  'that tidak dipakai di non-defining clause.',
] as const;

export default function DefiningVsNonDefiningRelativeClausesPage() {
  return (
    <main className="std-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50"><BackButton to="/skill/grammar/grammar-resource" /></div>
      <div className="std-shell gr-topic-shell">
        <header className="std-header"><h1 className="std-title">Defining vs Non-defining Relative Clauses</h1><p className="std-subtitle">Membedakan klausa relatif esensial vs tambahan.</p></header>
        <section className="std-block"><h2 className="std-block-title">Konsep</h2><p className="std-text">Defining clause menentukan identitas noun; non-defining clause menambah informasi tambahan.</p></section>
        <section className="std-block"><h2 className="std-block-title">Inti Materi</h2><div className="std-grid">{CORE_ITEMS.map((item) => (<details key={item.title} className="std-card std-card-accordion"><summary className="std-card-summary"><h3 className="std-card-title">{item.title}</h3><span className="std-card-caret" aria-hidden="true" /></summary><div className="std-card-body"><p className="std-card-desc">{item.desc}</p><ul className="std-list">{item.examples.map((example) => (<li key={item.title + '-' + example}>{example}</li>))}</ul></div></details>))}</div></section>
        <section className="std-block"><h2 className="std-block-title">Kesalahan Umum</h2><div className="std-fix-grid">{COMMON_MISTAKES.map((item) => (<article key={item.wrong} className="std-fix-card"><p className="std-fix-wrong">Salah: {item.wrong}</p><p className="std-fix-correct">Benar: {item.correct}</p></article>))}</div></section>
        <section className="std-block"><h2 className="std-block-title">Catatan Penting</h2><ul className="std-list">{NOTES.map((note) => (<li key={note}>- {note}</li>))}</ul></section>
      </div>
    </main>
  );
}
