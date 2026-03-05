import BackButton from '../../../../../components/BackButton';
import './gerunds-and-infinitives-verb-patterns.css';
import '../../topic-layout.css';

const PATTERN_GROUPS = [
  {
    title: 'Verb + Gerund (V-ing)',
    desc: 'Beberapa verb harus diikuti gerund.',
    examples: [
      { before: 'enjoy ', focus: 'reading', after: '' },
      { before: 'avoid ', focus: 'making', after: ' mistakes' },
      { before: 'keep ', focus: 'practicing', after: '' },
    ],
    sentences: [
      { before: 'I enjoy ', focus: 'reading', after: ' at night.' },
      { before: 'They keep ', focus: 'practicing', after: ' every day.' },
    ],
  },
  {
    title: 'Verb + Infinitive (to + V1)',
    desc: 'Beberapa verb harus diikuti infinitive.',
    examples: [
      { before: 'decide ', focus: 'to study', after: '' },
      { before: 'plan ', focus: 'to travel', after: '' },
      { before: 'hope ', focus: 'to improve', after: '' },
    ],
    sentences: [
      { before: 'She decided ', focus: 'to join', after: ' the class.' },
      { before: 'We hope ', focus: 'to finish', after: ' early.' },
    ],
  },
  {
    title: 'Verb + Gerund / Infinitive (Meaning Change)',
    desc: 'Beberapa verb bisa keduanya, tetapi makna bisa berbeda.',
    examples: [
      { before: 'stop ', focus: 'doing', after: ' vs stop to do' },
      { before: 'remember ', focus: 'doing', after: ' vs remember to do' },
      { before: 'try ', focus: 'doing', after: ' vs try to do' },
      { before: 'forget ', focus: 'doing', after: ' vs forget to do' },
      { before: 'regret ', focus: 'doing', after: ' vs regret to do' },
    ],
    sentences: [
      { before: 'I stopped ', focus: 'smoking', after: '. (berhenti kebiasaan)' },
      { before: 'I stopped ', focus: 'to smoke', after: '. (berhenti untuk melakukan aksi itu)' },
      { before: 'I tried ', focus: 'calling', after: '. (mencoba sebagai eksperimen)' },
      { before: 'I tried ', focus: 'to call', after: '. (berusaha melakukan)' },
      { before: 'I remember ', focus: 'meeting', after: ' him. (ingat kejadian lampau)' },
      { before: 'I remembered ', focus: 'to meet', after: ' him. (ingat untuk melakukan)' },
    ],
  },
] as const;

const COMMON_VERB_PATTERNS = [
  {
    title: 'Common verbs + gerund',
    items: ['enjoy', 'avoid', 'keep', 'finish', 'suggest', 'consider'],
  },
  {
    title: 'Common verbs + infinitive',
    items: ['decide', 'plan', 'hope', 'want', 'need', 'learn'],
  },
] as const;

const COMMON_MISTAKES = [
  { wrong: 'I enjoy to read.', correct: 'I enjoy reading.' },
  { wrong: 'She decided studying abroad.', correct: 'She decided to study abroad.' },
  { wrong: 'He avoided to answer.', correct: 'He avoided answering.' },
] as const;

export default function GerundsInfinitivesPage() {
  return (
    <main className="gi-page gr-topic-page">
      <div className="fixed left-4 top-6 z-50">
        <BackButton to="/skill/grammar/grammar-resource" />
      </div>

      <div className="gi-shell gr-topic-shell">
        <header className="gi-header">
          <h1 className="gi-title">Gerunds and Infinitives (Verb Patterns)</h1>
          <p className="gi-subtitle">
            Memahami pola verb + gerund dan verb + infinitive agar struktur kalimat lebih akurat.
          </p>
        </header>

        <section className="gi-block">
          <h2 className="gi-block-title">Konsep</h2>
          <p className="gi-text">
            Setelah verb tertentu, bentuk verb berikutnya tidak bebas. Kita perlu memilih pola yang tepat:
            <strong> gerund (V-ing)</strong> atau <strong>infinitive (to + V1)</strong>.
          </p>
        </section>

        <section className="gi-block">
          <h2 className="gi-block-title">Core Patterns</h2>
          <div className="gi-grid gi-grid-one-col">
            {PATTERN_GROUPS.map((item) => (
              <details key={item.title} className="gi-card gi-card-accordion">
                <summary className="gi-card-summary">
                  <h3 className="gi-card-title">{item.title}</h3>
                  <span className="gi-card-caret" aria-hidden="true" />
                </summary>
                <div className="gi-card-body">
                  <p className="gi-card-desc">{item.desc}</p>
                  <ul className="gi-list">
                    {item.examples.map((ex) => (
                      <li key={`${item.title}-${ex.before}-${ex.focus}-${ex.after}`}>
                        {ex.before}
                        <span className="gi-highlight">{ex.focus}</span>
                        {ex.after}
                      </li>
                    ))}
                  </ul>
                  <ul className="gi-list">
                    {item.sentences.map((s) => (
                      <li key={`${item.title}-s-${s.before}-${s.focus}-${s.after}`}>
                        {s.before}
                        <span className="gi-highlight">{s.focus}</span>
                        {s.after}
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            ))}
          </div>
        </section>

        <section className="gi-block">
          <h2 className="gi-block-title">Common Verb Lists</h2>
          <div className="gi-grid gi-grid-one-col">
            {COMMON_VERB_PATTERNS.map((group) => (
              <article key={group.title} className="gi-card">
                <div className="gi-card-body">
                  <h3 className="gi-card-title">{group.title}</h3>
                  <ul className="gi-list">
                    {group.items.map((item) => (
                      <li key={`${group.title}-${item}`}>
                        <span className="gi-highlight">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="gi-block">
          <h2 className="gi-block-title">Kesalahan Umum</h2>
          <div className="gi-fix-list">
            {COMMON_MISTAKES.map((item) => (
              <article key={item.wrong} className="gi-fix-card">
                <p className="gi-fix-wrong">Salah: {item.wrong}</p>
                <p className="gi-fix-correct">Benar: {item.correct}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="gi-block">
          <h2 className="gi-block-title">Catatan Penting:</h2>
          <ul className="gi-list">
            <li>Hafalkan verb dengan pasangannya (verb pattern), bukan kata per kata saja.</li>
            <li>Beberapa verb bisa dua pola, tetapi maknanya bisa berbeda.</li>
            <li>Saat ragu, cek pattern dictionary dari verb utamanya.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
