import BackButton from '../../../../../components/BackButton';
import './apostrophe-capitalization-grammar-meaning.css';
import '../../topic-layout.css';

const CORE_ITEMS = [
  { title: 'Apostrophe for possession', desc: 'Dipakai untuk menunjukkan kepemilikan singular/plural.', examples: ['the student\'s book', 'the students\' room'] },
  { title: 'Apostrophe for contractions', desc: 'Menandai huruf yang dihilangkan.', examples: ['it is -> it\'s', 'do not -> don\'t'] },
  { title: 'Capitalization patterns', desc: 'Proper noun dan awal kalimat wajib kapital.', examples: ['Rina lives in Jakarta.', 'English is taught globally.'] },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'its raining today', correct: 'it\'s raining today' },
  { wrong: 'rina lives in jakarta', correct: 'Rina lives in Jakarta.' },
] as const;

const NOTES = [
  'Bedakan its (possessive) dan it\'s (it is).',
  'Kapitalisasi bisa mengubah interpretasi kata.',
  'Cek apostrophe dan kapitalisasi di tahap proofreading akhir.',
] as const;

export default function ApostropheCapitalizationGrammarMeaningPage() {
  return (
    <main className="std-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50"><BackButton to="/skill/grammar/grammar-resource" /></div>
      <div className="std-shell gr-topic-shell">
        <header className="std-header"><h1 className="std-title">Apostrophe and Capitalization Patterns (Grammar Meaning)</h1><p className="std-subtitle">Memahami dampak apostrophe dan kapitalisasi terhadap makna gramatikal.</p></header>
        <section className="std-block"><h2 className="std-block-title">Konsep</h2><p className="std-text">Apostrophe dan kapitalisasi bukan hanya ejaan; keduanya memengaruhi makna kepemilikan, kontraksi, dan identitas proper noun.</p></section>
        <section className="std-block"><h2 className="std-block-title">Inti Materi</h2><div className="std-grid">{CORE_ITEMS.map((item) => (<details key={item.title} className="std-card std-card-accordion"><summary className="std-card-summary"><h3 className="std-card-title">{item.title}</h3><span className="std-card-caret" aria-hidden="true" /></summary><div className="std-card-body"><p className="std-card-desc">{item.desc}</p><ul className="std-list">{item.examples.map((example) => (<li key={item.title + '-' + example}>{example}</li>))}</ul></div></details>))}</div></section>
        <section className="std-block"><h2 className="std-block-title">Kesalahan Umum</h2><div className="std-fix-grid">{COMMON_MISTAKES.map((item) => (<article key={item.wrong} className="std-fix-card"><p className="std-fix-wrong">Salah: {item.wrong}</p><p className="std-fix-correct">Benar: {item.correct}</p></article>))}</div></section>
        <section className="std-block"><h2 className="std-block-title">Catatan Penting</h2><ul className="std-list">{NOTES.map((note) => (<li key={note}>- {note}</li>))}</ul></section>
      </div>
    </main>
  );
}
