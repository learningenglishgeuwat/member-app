import BackButton from '../../../../../components/BackButton';
import './determiner-combinations.css';
import '../../topic-layout.css';

const CORE_ITEMS = [
  { title: 'Basic order', desc: 'Pola: all/both/half + the/my/these + noun.', examples: ['all the students', 'both my parents'] },
  { title: 'of-structure', desc: 'Pola: all/both/half + of + object/determiner phrase.', examples: ['all of them', 'half of the class'] },
  { title: 'Agreement', desc: 'Pastikan agreement sesuai noun countable/uncountable dan singular/plural.', examples: ['all the water is clean.', 'both students are present.'] },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'the all students', correct: 'all the students' },
  { wrong: 'both of students', correct: 'both students / both of the students' },
] as const;

const NOTES = [
  'Urutan determiner lebih penting dari terjemahan literal.',
  'all of/both of lazim dengan pronoun object.',
  'Periksa agreement setelah phrase.',
] as const;

export default function DeterminerCombinationsPage() {
  return (
    <main className="std-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50"><BackButton to="/skill/grammar/grammar-resource" /></div>
      <div className="std-shell gr-topic-shell">
        <header className="std-header"><h1 className="std-title">Determiner Combinations (all, both, half + articles/possessives)</h1><p className="std-subtitle">Menyusun kombinasi determiner dengan urutan yang benar.</p></header>
        <section className="std-block"><h2 className="std-block-title">Konsep</h2><p className="std-text">Beberapa determiner dapat digabungkan, tetapi urutannya tetap agar kalimat natural.</p></section>
        <section className="std-block"><h2 className="std-block-title">Inti Materi</h2><div className="std-grid">{CORE_ITEMS.map((item) => (<details key={item.title} className="std-card std-card-accordion"><summary className="std-card-summary"><h3 className="std-card-title">{item.title}</h3><span className="std-card-caret" aria-hidden="true" /></summary><div className="std-card-body"><p className="std-card-desc">{item.desc}</p><ul className="std-list">{item.examples.map((example) => (<li key={item.title + '-' + example}>{example}</li>))}</ul></div></details>))}</div></section>
        <section className="std-block"><h2 className="std-block-title">Kesalahan Umum</h2><div className="std-fix-grid">{COMMON_MISTAKES.map((item) => (<article key={item.wrong} className="std-fix-card"><p className="std-fix-wrong">Salah: {item.wrong}</p><p className="std-fix-correct">Benar: {item.correct}</p></article>))}</div></section>
        <section className="std-block"><h2 className="std-block-title">Catatan Penting</h2><ul className="std-list">{NOTES.map((note) => (<li key={note}>- {note}</li>))}</ul></section>
      </div>
    </main>
  );
}
